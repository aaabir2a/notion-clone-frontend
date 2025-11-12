import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from './constants';

class SocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();

    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Page collaboration methods
  joinPage(pageId: string) {
    this.socket?.emit('page:join', pageId);
  }

  leavePage(pageId: string) {
    this.socket?.emit('page:leave', pageId);
  }

  // Block operations
  emitBlockUpdate(pageId: string, blockId: string, content: any, type?: string) {
    this.socket?.emit('block:update', { pageId, blockId, content, type });
  }

  emitBlockCreated(pageId: string, block: any) {
    this.socket?.emit('block:created', { pageId, block });
  }

  emitBlockDeleted(pageId: string, blockId: string) {
    this.socket?.emit('block:deleted', { pageId, blockId });
  }

  emitBlockMoved(pageId: string, blockId: string, newPosition: number, parentId?: string) {
    this.socket?.emit('block:moved', { pageId, blockId, newPosition, parentId });
  }

  // Page operations
  emitPageTitleUpdate(pageId: string, title: string) {
    this.socket?.emit('page:title-update', { pageId, title });
  }

  // Cursor operations
  emitCursorMove(pageId: string, blockId: string, position: number, selection?: any) {
    this.socket?.emit('cursor:move', { pageId, blockId, position, selection });
  }

  // Typing indicators
  emitTypingStart(pageId: string, blockId: string) {
    this.socket?.emit('typing:start', { pageId, blockId });
  }

  emitTypingStop(pageId: string, blockId: string) {
    this.socket?.emit('typing:stop', { pageId, blockId });
  }

  // Presence
  joinPresence(pageId: string, user: any) {
    this.socket?.emit('presence:join', { pageId, user });
  }

  leavePresence(pageId: string) {
    this.socket?.emit('presence:leave', { pageId });
  }

  sendHeartbeat(pageId: string) {
    this.socket?.emit('presence:heartbeat', { pageId });
  }

  // Event listeners
  onBlockUpdated(callback: (data: any) => void) {
    this.socket?.on('block:updated', callback);
  }

  onBlockCreated(callback: (data: any) => void) {
    this.socket?.on('block:created', callback);
  }

  onBlockDeleted(callback: (data: any) => void) {
    this.socket?.on('block:deleted', callback);
  }

  onBlockMoved(callback: (data: any) => void) {
    this.socket?.on('block:moved', callback);
  }

  onPageTitleUpdated(callback: (data: any) => void) {
    this.socket?.on('page:title-updated', callback);
  }

  onCursorMoved(callback: (data: any) => void) {
    this.socket?.on('cursor:moved', callback);
  }

  onUserTyping(callback: (data: any) => void) {
    this.socket?.on('user:typing', callback);
  }

  onUserStoppedTyping(callback: (data: any) => void) {
    this.socket?.on('user:stopped-typing', callback);
  }

  onPresenceUpdated(callback: (data: any) => void) {
    this.socket?.on('presence:updated', callback);
  }

  onUserJoined(callback: (data: any) => void) {
    this.socket?.on('user:joined', callback);
  }

  onUserLeft(callback: (data: any) => void) {
    this.socket?.on('user:left', callback);
  }

  // Remove listeners
  offBlockUpdated(callback: (data: any) => void) {
    this.socket?.off('block:updated', callback);
  }

  offBlockCreated(callback: (data: any) => void) {
    this.socket?.off('block:created', callback);
  }

  offBlockDeleted(callback: (data: any) => void) {
    this.socket?.off('block:deleted', callback);
  }

  offPresenceUpdated(callback: (data: any) => void) {
    this.socket?.off('presence:updated', callback);
  }

  offCursorMoved(callback: (data: any) => void) {
    this.socket?.off('cursor:moved', callback);
  }
}

export const socketClient = new SocketClient();
