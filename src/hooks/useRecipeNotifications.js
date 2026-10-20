import { useCallback, useEffect, useRef, useState } from 'react';
import { kitchenRecipeApi } from '../api/kitchenRecipeApi';

export default function useRecipeNotifications(user) {
  const enabled = Boolean(user.userId && ['ADMIN', 'MANAGER'].includes(user.role));
  const scope = `${user.userId}:${user.role}:${user.branchId}`;
  const active = useRef(null);
  const [result, setResult] = useState({});
  const reload = useCallback(async () => {
    if (!enabled) return;
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    try {
      const data = await kitchenRecipeApi.notifications(controller.signal);
      if (!controller.signal.aborted) setResult({ scope, data, error: '' });
    } catch (error) {
      if (!controller.signal.aborted) setResult((previous) => ({
        ...(previous.scope === scope ? previous : {}),
        scope,
        error: error.response?.data?.message || 'Không tải được thông báo. Vui lòng thử lại.',
      }));
    }
  }, [enabled, scope]);
  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    queueMicrotask(() => { if (!disposed) reload(); });
    const refresh = () => { if (document.visibilityState === 'visible') reload(); };
    const interval = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    return () => {
      disposed = true;
      active.current?.abort();
      window.clearInterval(interval);
      window.removeEventListener('focus', refresh);
    };
  }, [enabled, reload]);
  return {
    items: enabled && result.scope === scope ? result.data?.items || [] : [],
    unreadCount: enabled && result.scope === scope ? result.data?.unreadCount || 0 : 0,
    error: enabled && result.scope === scope ? result.error : '',
    loading: enabled && (result.scope !== scope || (!result.data && !result.error)),
    reload,
  };
}
