/**
 * RxJS 기반 카메라 액션 레이어
 * 마우스 이벤트 스트림을 구독하여 카메라 상태(panOffset, zoom)를 업데이트
 */
import { Subject, BehaviorSubject, Observable, Subscription, merge } from "rxjs";
import {
  filter,
  withLatestFrom,
  debounceTime,
  takeUntil,
} from "rxjs/operators";
import * as THREE from "three";
import { MouseEventStreams, type EdgeZone, type MousePosition } from "./mouseEvents";

// ============================================================
// 상태 타입 정의
// ============================================================

export interface CameraState {
  panOffset: THREE.Vector3;
  zoom: number;
}

export interface CameraConfig {
  panSpeed: number;
  zoomSpeed: number;
  minZoom: number;
  maxZoom: number;
  edgeThresholdX: number;
  edgeThresholdY: number;
  edgePanSpeed: number;
}

const DEFAULT_CONFIG: CameraConfig = {
  panSpeed: 0.5,
  zoomSpeed: 0.05,
  minZoom: 0.01, // 최대 줌인
  maxZoom: 0.2, // 최대 줌아웃
  edgeThresholdX: 300,
  edgeThresholdY: 300,
  edgePanSpeed: 0.8,
};

// ============================================================
// 카메라 액션 클래스
// ============================================================

export class CameraActions {
  private mouseEvents: MouseEventStreams;
  private subscriptions: Subscription[] = [];
  private destroy$ = new Subject<void>();

  // 상태 Subject들
  private panOffset$ = new BehaviorSubject<THREE.Vector3>(new THREE.Vector3());
  private zoom$ = new BehaviorSubject<number>(1.0);
  private edgeZone$ = new BehaviorSubject<EdgeZone>({
    left: false,
    right: false,
    top: false,
    bottom: false,
  });
  private isDragging$ = new BehaviorSubject<boolean>(false);
  private lastMousePosition$ = new BehaviorSubject<MousePosition | null>(null);

  // 설정
  private config: CameraConfig;

  // 카메라 참조 (줌 업데이트용)
  private camera: THREE.Camera | null = null;

  // 상태 변경 디바운스 콜백
  private onStateChange: ((state: { x: number; y: number; zoom: number }) => void) | null = null;
  private stateChange$ = new Subject<{ x: number; y: number; zoom: number }>();

  constructor(
    mouseEvents: MouseEventStreams,
    config: Partial<CameraConfig> = {},
    camera?: THREE.Camera,
    onStateChange?: (state: { x: number; y: number; zoom: number }) => void
  ) {
    this.mouseEvents = mouseEvents;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.camera = camera || null;
    this.onStateChange = onStateChange || null;

    // 카메라 초기 줌 동기화
    if (camera instanceof THREE.OrthographicCamera) {
      this.zoom$.next(1 / camera.zoom);
    }

    this.setupDragPanning();
    this.setupWheelZoom();
    this.setupEdgeScrolling();
    this.setupStateChangeDebounce();
  }

  // ============================================================
  // 드래그 패닝 (우클릭 드래그)
  // ============================================================

  private setupDragPanning(): void {
    // 이전 마우스 위치 추적
    let prevMouseX = 0;
    let prevMouseY = 0;

    // 우클릭 다운 → 드래그 시작, 시작 위치 저장
    const dragStartSub = this.mouseEvents.rightMouseDown$
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        this.isDragging$.next(true);
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      });

    this.subscriptions.push(dragStartSub);

    // 드래그 종료 (마우스 업 또는 마우스 떠남)
    const dragEnd$ = merge(this.mouseEvents.up$, this.mouseEvents.leave$);

    const dragEndSub = dragEnd$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isDragging$.next(false);
      });

    this.subscriptions.push(dragEndSub);

    // 드래그 중 마우스 이동 → 패닝
    const moveSub = this.mouseEvents.move$
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(this.isDragging$, this.zoom$),
        filter(([_, isDragging]) => isDragging)
      )
      .subscribe(([event, _, zoom]) => {
        const deltaX = event.clientX - prevMouseX;
        const deltaY = event.clientY - prevMouseY;

        // 현재 위치를 이전 위치로 업데이트
        prevMouseX = event.clientX;
        prevMouseY = event.clientY;

        // 줌 레벨에 따른 패닝 속도 조정
        const adjustedSpeed = this.config.panSpeed * zoom;

        const currentOffset = this.panOffset$.value.clone();
        // 드래그 패닝: 마우스를 오른쪽으로 드래그하면 화면이 오른쪽으로 이동
        currentOffset.x += deltaX * adjustedSpeed;
        currentOffset.y -= deltaY * adjustedSpeed;

        this.panOffset$.next(currentOffset);
        this.emitStateChange();
      });

    this.subscriptions.push(moveSub);
  }

  // ============================================================
  // 휠 줌
  // ============================================================

  private setupWheelZoom(): void {
    const sub = this.mouseEvents.wheelEvent$
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        const delta = e.deltaY * 0.001;
        const currentZoom = this.zoom$.value;
        const newZoom = THREE.MathUtils.clamp(
          currentZoom + delta * this.config.zoomSpeed,
          this.config.minZoom,
          this.config.maxZoom
        );

        this.zoom$.next(newZoom);

        // 카메라 줌 업데이트
        if (this.camera instanceof THREE.OrthographicCamera) {
          this.camera.zoom = 1 / newZoom;
          this.camera.updateProjectionMatrix();
        }

        // 가장자리 패닝 속도 업데이트
        this.config.edgePanSpeed = 0.5 * Math.sqrt(newZoom);

        this.emitStateChange();
      });

    this.subscriptions.push(sub);
  }

  // ============================================================
  // 가장자리 스크롤 (조이스틱 방식)
  // ============================================================

  private setupEdgeScrolling(): void {
    // 마우스 위치 추적
    this.mouseEvents.mousePosition$
      .pipe(takeUntil(this.destroy$))
      .subscribe((pos) => {
        this.lastMousePosition$.next(pos);
      });

    // 마우스 떠남 시 위치 초기화
    this.mouseEvents.leave$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.lastMousePosition$.next(null);
      this.edgeZone$.next({
        left: false,
        right: false,
        top: false,
        bottom: false,
      });
    });

    // 애니메이션 프레임마다 가장자리 체크 및 스크롤
    const sub = this.mouseEvents.animationFrame$
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(this.lastMousePosition$, this.isDragging$, this.zoom$)
      )
      .subscribe(([_, mousePos, isDragging, zoom]) => {
        // 드래그 중이면 가장자리 스크롤 비활성화
        if (isDragging) return;

        if (!mousePos) {
          this.edgeZone$.next({
            left: false,
            right: false,
            top: false,
            bottom: false,
          });
          return;
        }

        const viewport = this.mouseEvents.getViewportInfo();
        const { width, height, centerX, centerY } = viewport;
        const { edgeThresholdX, edgeThresholdY, edgePanSpeed } = this.config;
        const { x, y } = mousePos;

        // 뷰포트 밖이면 무시
        if (x < 0 || y < 0 || x > width || y > height) {
          this.edgeZone$.next({
            left: false,
            right: false,
            top: false,
            bottom: false,
          });
          return;
        }

        // 가장자리 영역 감지
        const edgeZone: EdgeZone = {
          left: x < edgeThresholdX,
          right: x > width - edgeThresholdX,
          top: y < edgeThresholdY,
          bottom: y > height - edgeThresholdY,
        };

        const isInEdgeZone =
          edgeZone.left || edgeZone.right || edgeZone.top || edgeZone.bottom;

        this.edgeZone$.next(edgeZone);

        if (!isInEdgeZone) return;

        // 강도 계산
        let intensity = 0;
        if (edgeZone.left) {
          intensity = Math.max(intensity, (edgeThresholdX - x) / edgeThresholdX);
        }
        if (edgeZone.right) {
          intensity = Math.max(
            intensity,
            (x - (width - edgeThresholdX)) / edgeThresholdX
          );
        }
        if (edgeZone.top) {
          intensity = Math.max(intensity, (edgeThresholdY - y) / edgeThresholdY);
        }
        if (edgeZone.bottom) {
          intensity = Math.max(
            intensity,
            (y - (height - edgeThresholdY)) / edgeThresholdY
          );
        }

        // 방향 벡터 계산 (중심에서 마우스 방향)
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        const directionX = dx / distance;
        const directionY = dy / distance;

        // 패닝 적용
        // final 프로젝트와 동일한 방향 로직:
        // - 마우스가 오른쪽 가장자리에 있으면 → 씬이 왼쪽으로 이동 (panOffset.x 감소)
        // - 마우스가 아래쪽 가장자리에 있으면 → 씬이 위로 이동 (panOffset.y 증가)
        const speed = edgePanSpeed * intensity;
        const currentOffset = this.panOffset$.value.clone();
        
        // final과 동일한 방향 벡터 적용
        currentOffset.x -= directionX * speed;
        currentOffset.y += directionY * speed;

        this.panOffset$.next(currentOffset);
        this.emitStateChange();
      });

    this.subscriptions.push(sub);
  }

  // ============================================================
  // 상태 변경 디바운스 (500ms)
  // ============================================================

  private setupStateChangeDebounce(): void {
    const sub = this.stateChange$
      .pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe((state) => {
        if (this.onStateChange) {
          this.onStateChange(state);
        }
      });

    this.subscriptions.push(sub);
  }

  private emitStateChange(): void {
    const panOffset = this.panOffset$.value;
    this.stateChange$.next({
      x: panOffset.x,
      y: panOffset.y,
      zoom: this.zoom$.value,
    });
  }

  // ============================================================
  // 공개 API
  // ============================================================

  /** 현재 panOffset 가져오기 */
  getPanOffset(): THREE.Vector3 {
    return this.panOffset$.value;
  }

  /** panOffset Observable */
  get panOffsetObservable$(): Observable<THREE.Vector3> {
    return this.panOffset$.asObservable();
  }

  /** 현재 zoom 가져오기 */
  getZoom(): number {
    return this.zoom$.value;
  }

  /** zoom Observable */
  get zoomObservable$(): Observable<number> {
    return this.zoom$.asObservable();
  }

  /** 현재 가장자리 영역 상태 */
  getEdgeZone(): EdgeZone {
    return this.edgeZone$.value;
  }

  /** 가장자리 영역 Observable */
  get edgeZoneObservable$(): Observable<EdgeZone> {
    return this.edgeZone$.asObservable();
  }

  /** 드래그 상태 Observable */
  get isDraggingObservable$(): Observable<boolean> {
    return this.isDragging$.asObservable();
  }

  /** 상태 설정 (복원용) */
  setState(x: number, y: number, zoom: number): void {
    this.panOffset$.next(new THREE.Vector3(x, y, 0));
    this.zoom$.next(zoom);

    if (this.camera instanceof THREE.OrthographicCamera) {
      this.camera.zoom = 1 / zoom;
      this.camera.updateProjectionMatrix();
    }
  }

  /** 카메라 설정 */
  setCamera(camera: THREE.Camera): void {
    this.camera = camera;
    if (camera instanceof THREE.OrthographicCamera) {
      this.zoom$.next(1 / camera.zoom);
    }
  }

  /** 정리 */
  dispose(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    this.panOffset$.complete();
    this.zoom$.complete();
    this.edgeZone$.complete();
    this.isDragging$.complete();
    this.lastMousePosition$.complete();
    this.stateChange$.complete();
  }
}
