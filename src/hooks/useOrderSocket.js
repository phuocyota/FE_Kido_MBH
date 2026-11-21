import { useEffect, useRef, useState } from "react";
import { getSocket, joinOrders, leaveOrders, ORDER_LIST_EVENTS } from "../api/socket";

/**
 * Lắng nghe các event đơn hàng realtime.
 *
 * - onChange(event, payload): gọi khi có event thay đổi đơn (đã debounce,
 *   vì BE phát nhiều event liên tiếp cho cùng một thao tác).
 * - onReconnect(): gọi khi socket kết nối lại, để refetch bù các event bị lỡ.
 *
 * Trả về { connected } để hiển thị trạng thái / bật polling dự phòng.
 */
export default function useOrderSocket({
  onChange,
  onReconnect,
  events = ORDER_LIST_EVENTS,
  joinPayload,
  debounceMs = 300,
} = {}) {
  const [connected, setConnected] = useState(false);
  const onChangeRef = useRef(onChange);
  const onReconnectRef = useRef(onReconnect);
  onChangeRef.current = onChange;
  onReconnectRef.current = onReconnect;

  const joinKey = JSON.stringify(joinPayload || {});
  const eventsKey = events.join("|");

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;

    const payload = JSON.parse(joinKey);
    let timer = null;
    let hasConnectedBefore = false;

    const handleConnect = () => {
      setConnected(true);
      joinOrders(payload).then((res) => {
        if (res && res.ok === false) {
          console.warn("[socket] orders:join bị từ chối:", res.error);
        }
      });
      if (hasConnectedBefore) onReconnectRef.current?.();
      hasConnectedBefore = true;
    };
    const handleDisconnect = () => setConnected(false);
    const handleError = (err) => {
      setConnected(false);
      console.warn("[socket] connect_error:", err?.message);
    };

    const handlers = events.map((event) => {
      const handler = (data) => {
        clearTimeout(timer);
        timer = setTimeout(() => onChangeRef.current?.(event, data), debounceMs);
      };
      socket.on(event, handler);
      return [event, handler];
    });

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);
    if (socket.connected) handleConnect();

    return () => {
      clearTimeout(timer);
      handlers.forEach(([event, handler]) => socket.off(event, handler));
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      leaveOrders(payload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinKey, eventsKey, debounceMs]);

  return { connected };
}
