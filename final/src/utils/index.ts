import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Comment {
  commentId: number;
  authorId: number;
  authorUsername: string;
  parentCommentId: number | null;
  content: string;
  createdAt: string;
  profileImageUrl?: string;
  replies?: Comment[]; // 트리 변환 후에만 생김
}

export interface CommentResponse {
  commentId: number;
  authorId: number;
  authorUsername: string;
  parentCommentId: number;
  content: string;
  createdAt: string;
  profileImageUrl?: string;
  distance?: string;
  replies?: CommentResponse[];
}

export function buildCommentTree(comments: CommentResponse[]) {
  const map: Record<number, Comment> = {};
  const roots: Comment[] = [];

  comments.forEach((comment) => {
    map[comment.commentId] = { ...comment, replies: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentCommentId !== null) {
      map[comment.parentCommentId]?.replies?.push(map[comment.commentId]);
    } else {
      roots.push(map[comment.commentId]);
    }
  });

  return roots;
}

/**
 * URL에 #debug 해시가 있는지 확인합니다.
 * 디버그 도구들(MSW, LocatorJS, TanStack Query Devtools, Leva)을 조건부로 활성화하는데 사용됩니다.
 */
function isDebugMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hash === "#debug";
}

/**
 * URL 해시 변경을 감지하여 디버그 모드가 변경될 때 콜백을 실행합니다.
 */
function onDebugModeChange(callback: (isDebug: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = () => {
    callback(isDebugMode());
  };

  window.addEventListener("hashchange", handler);

  return () => {
    window.removeEventListener("hashchange", handler);
  };
}

/**
 * 디버그 모드 상태를 관리하는 커스텀 훅
 * URL 해시 변경을 자동으로 감지하여 상태를 업데이트합니다.
 *
 * @returns {boolean} 현재 디버그 모드 활성화 여부
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const debugMode = useDebugMode();
 *   return debugMode ? <DebugTools /> : null;
 * }
 * ```
 */
export function useDebugMode(): boolean {
  const [debugMode, setDebugMode] = useState(isDebugMode());

  useEffect(() => {
    // URL 해시 변경 감지
    const unsubscribe = onDebugModeChange((isDebug) => {
      setDebugMode(isDebug);
    });

    return unsubscribe;
  }, []);

  return debugMode;
}
