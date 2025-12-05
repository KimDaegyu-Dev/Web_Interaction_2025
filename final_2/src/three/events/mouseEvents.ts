/**
 * RxJS 기반 마우스 이벤트 스트림
 * 모든 마우스 이벤트를 Observable로 변환하여 관리
 */
import {
  Subject,
  Observable,
  fromEvent,
  merge,
  animationFrameScheduler,
  interval,
} from "rxjs";
import {
  map,
  filter,
  takeUntil,
  share,
  startWith,
  distinctUntilChanged,
  observeOn,
  switchMap,
  take,
  race,
  mapTo,
} from "rxjs/operators";

// ============================================================
// 이벤트 타입 정의
// ============================================================

export interface MousePosition {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
}

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
}

export interface WheelState {
  deltaY: number;
  clientX: number;
  clientY: number;
}

export interface EdgeZone {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

export interface ViewportInfo {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

// ============================================================
// 마우스 이벤트 스트림 클래스
// ============================================================

export class MouseEventStreams {
  private destroy$ = new Subject<void>();
  private domElement: HTMLElement;

  // 개별 이벤트 Subject들
  private mouseDown$ = new Subject<MouseEvent>();
  private mouseMove$ = new Subject<MouseEvent>();
  private mouseUp$ = new Subject<MouseEvent>();
  private mouseLeave$ = new Subject<MouseEvent>();
  private wheel$ = new Subject<WheelEvent>();
  private contextMenu$ = new Subject<MouseEvent>();

  // 이벤트 핸들러 참조 (cleanup용)
  private handlers: {
    mousedown: (e: MouseEvent) => void;
    mousemove: (e: MouseEvent) => void;
    mouseup: (e: MouseEvent) => void;
    mouseleave: (e: MouseEvent) => void;
    wheel: (e: WheelEvent) => void;
    contextmenu: (e: MouseEvent) => void;
  };

  constructor(domElement: HTMLElement) {
    this.domElement = domElement;

    // 이벤트 핸들러 바인딩
    this.handlers = {
      mousedown: (e) => this.mouseDown$.next(e),
      mousemove: (e) => this.mouseMove$.next(e),
      mouseup: (e) => this.mouseUp$.next(e),
      mouseleave: (e) => this.mouseLeave$.next(e),
      wheel: (e) => {
        e.preventDefault();
        this.wheel$.next(e);
      },
      contextmenu: (e) => {
        e.preventDefault();
        this.contextMenu$.next(e);
      },
    };

    // 이벤트 리스너 등록
    domElement.addEventListener("mousedown", this.handlers.mousedown);
    domElement.addEventListener("mousemove", this.handlers.mousemove);
    domElement.addEventListener("mouseup", this.handlers.mouseup);
    domElement.addEventListener("mouseleave", this.handlers.mouseleave);
    domElement.addEventListener("wheel", this.handlers.wheel, {
      passive: false,
    });
    domElement.addEventListener("contextmenu", this.handlers.contextmenu);
  }

  // ============================================================
  // 기본 이벤트 스트림 (Observable)
  // ============================================================

  /** 우클릭 마우스 다운 스트림 */
  get rightMouseDown$(): Observable<MouseEvent> {
    return this.mouseDown$.pipe(
      filter((e) => e.button === 2),
      takeUntil(this.destroy$),
      share()
    );
  }

  /** 좌클릭 마우스 다운 스트림 */
  get leftMouseDown$(): Observable<MouseEvent> {
    return this.mouseDown$.pipe(
      filter((e) => e.button === 0),
      takeUntil(this.destroy$),
      share()
    );
  }

  /** 좌클릭 스트림 (mousedown → mouseup이 빠르게 일어난 경우) */
  get leftClick$(): Observable<MouseEvent> {
    const CLICK_THRESHOLD = 200; // ms
    const MOVE_THRESHOLD = 5; // px
    
    return this.leftMouseDown$.pipe(
      switchMap((downEvent) => {
        const startX = downEvent.clientX;
        const startY = downEvent.clientY;
        const startTime = Date.now();
        
        // mouseup 또는 mouseleave 중 먼저 발생하는 것
        return merge(
          this.up$.pipe(
            filter((upEvent) => {
              const elapsed = Date.now() - startTime;
              const dx = Math.abs(upEvent.clientX - startX);
              const dy = Math.abs(upEvent.clientY - startY);
              // 시간과 이동 거리가 임계값 이내여야 클릭으로 인정
              return elapsed < CLICK_THRESHOLD && dx < MOVE_THRESHOLD && dy < MOVE_THRESHOLD;
            }),
            take(1)
          ),
          this.leave$.pipe(
            take(1),
            filter(() => false) // leave는 클릭 취소
          )
        ).pipe(take(1));
      }),
      takeUntil(this.destroy$),
      share()
    );
  }

  /** 마우스 이동 스트림 */
  get move$(): Observable<MouseEvent> {
    return this.mouseMove$.pipe(takeUntil(this.destroy$), share());
  }

  /** 마우스 업 스트림 */
  get up$(): Observable<MouseEvent> {
    return this.mouseUp$.pipe(takeUntil(this.destroy$), share());
  }

  /** 마우스 떠남 스트림 */
  get leave$(): Observable<MouseEvent> {
    return this.mouseLeave$.pipe(takeUntil(this.destroy$), share());
  }

  /** 휠 스트림 */
  get wheelEvent$(): Observable<WheelEvent> {
    return this.wheel$.pipe(takeUntil(this.destroy$), share());
  }

  // ============================================================
  // 파생 스트림 (고수준)
  // ============================================================

  /** 뷰포트 기준 마우스 위치 스트림 */
  get mousePosition$(): Observable<MousePosition> {
    return this.mouseMove$.pipe(
      takeUntil(this.destroy$),
      map((e) => {
        const rect = this.domElement.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          clientX: e.clientX,
          clientY: e.clientY,
        };
      }),
      share()
    );
  }

  /** 마우스가 뷰포트 내에 있는지 여부 */
  get isInsideViewport$(): Observable<boolean> {
    return merge(
      this.mouseMove$.pipe(map(() => true)),
      this.mouseLeave$.pipe(map(() => false))
    ).pipe(takeUntil(this.destroy$), startWith(false), share());
  }

  /** 뷰포트 정보 */
  getViewportInfo(): ViewportInfo {
    const rect = this.domElement.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      centerX: rect.width / 2,
      centerY: rect.height / 2,
    };
  }

  /** 애니메이션 프레임 틱 (가장자리 스크롤용) */
  get animationFrame$(): Observable<number> {
    return interval(0, animationFrameScheduler).pipe(
      takeUntil(this.destroy$),
      share()
    );
  }

  // ============================================================
  // 정리
  // ============================================================

  dispose(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // 이벤트 리스너 제거
    this.domElement.removeEventListener("mousedown", this.handlers.mousedown);
    this.domElement.removeEventListener("mousemove", this.handlers.mousemove);
    this.domElement.removeEventListener("mouseup", this.handlers.mouseup);
    this.domElement.removeEventListener("mouseleave", this.handlers.mouseleave);
    this.domElement.removeEventListener("wheel", this.handlers.wheel);
    this.domElement.removeEventListener(
      "contextmenu",
      this.handlers.contextmenu
    );
  }
}
