import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

/**
 * 모델 캐시 시스템
 * GLTF 모델을 한 번만 클론하고 재사용하여 메모리 사용량을 줄입니다.
 */
class ModelCache {
  private cache: Map<string, THREE.Object3D> = new Map();

  /**
   * 캐시된 모델을 가져오거나 새로 생성합니다.
   * @param key - 캐시 키 (url + meshIndex 조합)
   * @param factory - 모델을 생성하는 팩토리 함수
   */
  getOrCreate(key: string, factory: () => THREE.Object3D): THREE.Object3D {
    if (!this.cache.has(key)) {
      const model = factory();
      this.cache.set(key, model);
    }
    return this.cache.get(key)!;
  }

  /**
   * 캐시된 모델을 복제합니다 (SkeletonUtils.clone 사용)
   * 애니메이션이 있는 모델의 경우 각 인스턴스가 독립적인 애니메이션을 가져야 하므로 복제가 필요합니다.
   */
  cloneFromCache(key: string, factory: () => THREE.Object3D): THREE.Object3D {
    const cached = this.getOrCreate(key, factory);
    return clone(cached);
  }

  /**
   * 특정 키의 캐시를 제거합니다.
   */
  remove(key: string): void {
    const model = this.cache.get(key);
    if (model) {
      // 메모리 정리
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      this.cache.delete(key);
    }
  }

  /**
   * 모든 캐시를 제거합니다.
   */
  clear(): void {
    this.cache.forEach((_, key) => this.remove(key));
    this.cache.clear();
  }

  /**
   * 캐시 크기를 반환합니다.
   */
  get size(): number {
    return this.cache.size;
  }
}

// 싱글톤 인스턴스
export const modelCache = new ModelCache();
