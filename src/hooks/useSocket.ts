import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { socketClient } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        const socketInstance = socketClient.connect(token);
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
          setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
          setIsConnected(false);
        });
      }
    }

    return () => {
      if (socket) {
        socketClient.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [isAuthenticated]);

  return {
    socket,
    isConnected,
    socketClient,
  };
}
