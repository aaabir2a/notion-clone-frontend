import { useEffect, useCallback, useState } from 'react';
import { useSocket } from './useSocket';
import type { PresenceUser, CursorPosition } from '@/types';

export function useCollaboration(pageId?: string) {
  const { socket, isConnected, socketClient } = useSocket();
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Join page room
  useEffect(() => {
    if (socket && pageId && isConnected) {
      socketClient.joinPage(pageId);

      return () => {
        socketClient.leavePage(pageId);
      };
    }
  }, [socket, pageId, isConnected]);

  // Setup presence
  useEffect(() => {
    if (socket && pageId && isConnected) {
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;

      if (user) {
        socketClient.joinPresence(pageId, user);

        // Send heartbeat every 10 seconds
        const heartbeatInterval = setInterval(() => {
          socketClient.sendHeartbeat(pageId);
        }, 10000);

        return () => {
          clearInterval(heartbeatInterval);
          socketClient.leavePresence(pageId);
        };
      }
    }
  }, [socket, pageId, isConnected]);

  // Listen for presence updates
  useEffect(() => {
    if (!socket) return;

    const handlePresenceUpdate = (data: { users: PresenceUser[] }) => {
      setActiveUsers(data.users);
    };

    socketClient.onPresenceUpdated(handlePresenceUpdate);

    return () => {
      socketClient.offPresenceUpdated(handlePresenceUpdate);
    };
  }, [socket]);

  // Listen for cursor movements
  useEffect(() => {
    if (!socket) return;

    const handleCursorMove = (data: CursorPosition) => {
      setCursors((prev) => {
        const newCursors = new Map(prev);
        newCursors.set(data.userId, data);
        return newCursors;
      });
    };

    socketClient.onCursorMoved(handleCursorMove);

    return () => {
      socketClient.offCursorMoved(handleCursorMove);
    };
  }, [socket]);

  // Listen for typing indicators
  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = (data: { userId: string; blockId: string }) => {
      setTypingUsers((prev) => new Set(prev).add(data.userId));
    };

    const handleUserStoppedTyping = (data: { userId: string; blockId: string }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    };

    socketClient.onUserTyping(handleUserTyping);
    socketClient.onUserStoppedTyping(handleUserStoppedTyping);

    return () => {
      socket.off('user:typing', handleUserTyping);
      socket.off('user:stopped-typing', handleUserStoppedTyping);
    };
  }, [socket]);

  // Emit cursor position
  const updateCursor = useCallback(
    (blockId: string, position: number, selection?: any) => {
      if (pageId) {
        socketClient.emitCursorMove(pageId, blockId, position, selection);
      }
    },
    [pageId, socketClient]
  );

  // Emit typing status
  const startTyping = useCallback(
    (blockId: string) => {
      if (pageId) {
        socketClient.emitTypingStart(pageId, blockId);
      }
    },
    [pageId, socketClient]
  );

  const stopTyping = useCallback(
    (blockId: string) => {
      if (pageId) {
        socketClient.emitTypingStop(pageId, blockId);
      }
    },
    [pageId, socketClient]
  );

  return {
    activeUsers,
    cursors,
    typingUsers,
    isConnected,
    updateCursor,
    startTyping,
    stopTyping,
  };
}

