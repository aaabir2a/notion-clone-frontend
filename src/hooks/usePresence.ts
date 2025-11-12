import { useEffect, useState } from 'react';
import { useSocket } from './useSocket';
import { useAuthStore } from '@/store/authStore';
import type { PresenceUser } from '@/types';

export function usePresence(pageId?: string) {
  const { socket, isConnected, socketClient } = useSocket();
  const { user } = useAuthStore();
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!socket || !pageId || !user || !isConnected) return;

    // Join presence
    socketClient.joinPresence(pageId, {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    });

    // Listen for presence updates
    const handlePresenceUpdate = (data: { users: PresenceUser[] }) => {
      setActiveUsers(data.users.filter((u) => u.id !== user.id));
    };

    socketClient.onPresenceUpdated(handlePresenceUpdate);

    // Send heartbeat every 10 seconds
    const heartbeatInterval = setInterval(() => {
      socketClient.sendHeartbeat(pageId);
    }, 10000);

    return () => {
      clearInterval(heartbeatInterval);
      socketClient.leavePresence(pageId);
      socketClient.offPresenceUpdated(handlePresenceUpdate);
    };
  }, [socket, pageId, user, isConnected]);

  return {
    activeUsers,
    isConnected,
  };
}
