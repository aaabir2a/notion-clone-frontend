// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

// Auth types
export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

// Workspace types
export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  role?: WorkspaceRole;
  createdAt: string;
  updatedAt: string;
  _count?: {
    pages: number;
    members: number;
  };
}

export interface WorkspaceMember {
  id: string;
  role: WorkspaceRole;
  joinedAt: string;
  user: User;
}

// Page types
export interface Page {
  id: string;
  title: string;
  icon?: string;
  coverImage?: string;
  parentId?: string;
  position: number;
  isPublished: boolean;
  isArchived: boolean;
  workspaceId: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  children?: Page[];
  blocks?: Block[];
}

// Block types
export type BlockType =
  | 'TEXT'
  | 'HEADING_1'
  | 'HEADING_2'
  | 'HEADING_3'
  | 'BULLET_LIST'
  | 'NUMBERED_LIST'
  | 'TODO'
  | 'TOGGLE'
  | 'QUOTE'
  | 'DIVIDER'
  | 'CODE'
  | 'IMAGE'
  | 'VIDEO'
  | 'FILE'
  | 'EMBED'
  | 'TABLE'
  | 'CALLOUT';

export interface Block {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  position: number;
  parentId?: string;
  pageId: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  children?: Block[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

// Collaboration types
export interface PresenceUser {
  id: string;
  name: string;
  avatar?: string;
  socketId: string;
  lastSeen: number;
}

export interface CursorPosition {
  userId: string;
  blockId: string;
  position: number;
  selection?: {
    start: number;
    end: number;
  };
}
