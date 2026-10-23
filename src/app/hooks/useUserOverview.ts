import { useEffect, useState } from 'react';
import { getGoals, getMe, getTrails } from '../services/api';
import type { Goal, Trail, User } from '../services/api';

interface Resource<T> { data: T | null; loading: boolean; error: string }
const initial = <T,>(): Resource<T> => ({ data: null, loading: true, error: '' });

/** Cada fonte tem seu próprio erro: uma falha não vira contagem zero. */
export function useUserOverview() {
  const [user, setUser] = useState<Resource<User>>(initial);
  const [trails, setTrails] = useState<Resource<Trail[]>>(initial);
  const [goals, setGoals] = useState<Resource<Goal[]>>(initial);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load<T>(fetcher: (signal?: AbortSignal) => Promise<T>, setter: (value: Resource<T>) => void) {
      setter(initial<T>());
      try {
        const data = await fetcher(controller.signal);
        if (!controller.signal.aborted) setter({ data, loading: false, error: '' });
      } catch (error) {
        if (!controller.signal.aborted) setter({ data: null, loading: false,
          error: error instanceof Error ? error.message : 'Não foi possível carregar os dados.' });
      }
    }
    void Promise.allSettled([load(getMe, setUser), load(getTrails, setTrails), load(getGoals, setGoals)]);
    return () => controller.abort();
  }, [retry]);
  return { user, trails, goals, reload: () => setRetry(value => value + 1) };
}
