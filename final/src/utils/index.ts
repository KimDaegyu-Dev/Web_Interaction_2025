import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
