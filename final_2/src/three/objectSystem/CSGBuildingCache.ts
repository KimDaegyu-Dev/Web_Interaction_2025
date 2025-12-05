import * as THREE from "three";
import { Brush, Evaluator, ADDITION } from "three-bvh-csg";
import { getBuildingStructure } from "../config/buildingPresets";
import type { BuildingStructureBox } from "@/utils/supabase";

/**
 * CSG 건물 캐시
 * mesh_index별로 CSG Union 결과를 캐싱하여 성능 최적화
 */
class CSGBuildingCache {
  private cache: Map<number, THREE.BufferGeometry> = new Map();
  private evaluator: Evaluator;

  constructor() {
    this.evaluator = new Evaluator();
  }

  /**
   * mesh_index에 해당하는 건물 지오메트리 가져오기
   * 캐시에 없으면 CSG 연산 수행 후 캐싱
   */
  getGeometry(meshIndex: number): THREE.BufferGeometry {
    // 캐시 확인
    if (this.cache.has(meshIndex)) {
      return this.cache.get(meshIndex)!.clone();
    }

    // 프리셋에서 구조 가져오기
    const structure = getBuildingStructure(meshIndex);
    
    // CSG 연산으로 지오메트리 생성
    const geometry = this.buildCSGGeometry(structure);
    
    // 캐시에 저장
    this.cache.set(meshIndex, geometry);
    
    return geometry.clone();
  }

  /**
   * 커스텀 구조로 건물 지오메트리 생성
   * (DB에 저장된 building_structure 사용 시)
   */
  getGeometryFromStructure(
    structure: BuildingStructureBox[],
    cacheKey?: string
  ): THREE.BufferGeometry {
    // 커스텀 키로 캐싱 (옵션)
    if (cacheKey) {
      const numericKey = this.hashString(cacheKey);
      if (this.cache.has(numericKey)) {
        return this.cache.get(numericKey)!.clone();
      }
      
      const geometry = this.buildCSGGeometry(structure);
      this.cache.set(numericKey, geometry);
      return geometry.clone();
    }

    // 캐싱 없이 바로 생성
    return this.buildCSGGeometry(structure);
  }

  /**
   * CSG Union 연산으로 여러 박스를 하나의 지오메트리로 합침
   */
  private buildCSGGeometry(structure: BuildingStructureBox[]): THREE.BufferGeometry {
    if (structure.length === 0) {
      // 빈 구조면 기본 박스 반환
      return new THREE.BoxGeometry(2, 2, 2);
    }

    if (structure.length === 1) {
      // 단일 박스면 CSG 없이 반환
      const box = structure[0];
      const geometry = new THREE.BoxGeometry(...box.scale);
      geometry.translate(...box.position);
      return geometry;
    }

    // 첫 번째 박스로 기본 Brush 생성
    const firstBox = structure[0];
    let resultBrush = new Brush(
      new THREE.BoxGeometry(...firstBox.scale)
    );
    resultBrush.position.set(...firstBox.position);
    resultBrush.updateMatrixWorld();

    // 나머지 박스들을 Union으로 합침
    for (let i = 1; i < structure.length; i++) {
      const box = structure[i];
      const brush = new Brush(
        new THREE.BoxGeometry(...box.scale)
      );
      brush.position.set(...box.position);
      brush.updateMatrixWorld();

      // CSG Union 연산
      resultBrush = this.evaluator.evaluate(resultBrush, brush, ADDITION);
    }

    // Brush에서 BufferGeometry 추출
    const geometry = resultBrush.geometry.clone();
    
    // 노말 재계산
    geometry.computeVertexNormals();
    
    return geometry;
  }

  /**
   * 문자열을 숫자 해시로 변환 (캐시 키용)
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * 특정 캐시 항목 삭제
   */
  clearCache(meshIndex: number): void {
    if (this.cache.has(meshIndex)) {
      this.cache.get(meshIndex)?.dispose();
      this.cache.delete(meshIndex);
    }
  }

  /**
   * 전체 캐시 클리어
   */
  clearAllCache(): void {
    this.cache.forEach((geometry) => geometry.dispose());
    this.cache.clear();
  }

  /**
   * 캐시 크기 반환
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

// 싱글톤 인스턴스
export const csgBuildingCache = new CSGBuildingCache();
