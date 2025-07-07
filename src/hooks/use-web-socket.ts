import { useRef, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface ISocketData {
  DeviceID: string;
  UserUD: string;
  UserName: string;
  FaceImage: string;
  fullImage: string;
  The_date: string;
}

const useWebSocket = (token: string) => {
  const [data, setData] = useState<ISocketData[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    let ws: WebSocket | null = null;
    let pingInterval: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      ws = new WebSocket(`ws://api.uvmsoft.uz/ws/connect?token=${token}`);

      ws.onopen = () => {
        console.log('WebSocket connected');
        ws?.send(JSON.stringify({ type: 'greet', payload: 'ping' }));

        pingInterval = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send('ping');
          }
        }, 5000);
      };

      ws.onmessage = (event) => {
        if (event.data === 'device') queryClient.invalidateQueries({ queryKey: ['device'] });
        else if (event.data === 'company') queryClient.invalidateQueries({ queryKey: ['company'] });
        else if (event.data === 'company-stats')
          queryClient.invalidateQueries({ queryKey: ['company-stats'] });
        else if (event.data === 'pong') {
          console.log('pong');
        } else {
          setData((prev) => {
            const newData = [JSON.parse(event.data), ...prev];
            return newData.slice(0, 20);
          });
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        cleanup();
        reconnect();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        cleanup();
        reconnect();
      };

      setSocket(ws);
    };

    const cleanup = () => {
      if (pingInterval) {
        clearInterval(pingInterval);
        pingInterval = null;
      }
      ws?.close();
      ws = null;
    };

    const reconnect = () => {
      if (reconnectTimeout.current) return;
      reconnectTimeout.current = setTimeout(() => {
        console.log('Reconnecting WebSocket...');
        connectWebSocket();
        reconnectTimeout.current = null;
      }, 3000);
    };

    connectWebSocket();

    return () => {
      cleanup();
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
    };
  }, [token, queryClient]);

  return { data, socket };
};

export default useWebSocket;
