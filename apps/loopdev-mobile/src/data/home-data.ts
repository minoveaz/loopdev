import { useEffect, useState } from 'react';
import { createHomeDataSource } from './data-source';
import type { HomeDataSource } from './contracts/home';
import type { ActivityItem, NotificationItem, Organization } from './adapters/fixtures/home';
import type { PlatformOverview } from './contracts/home';

export type HomeDataState = {
  status: 'loading' | 'success' | 'error';
  organizations: Organization[];
  activity: ActivityItem[];
  notifications: NotificationItem[];
  overview: PlatformOverview | null;
  error: Error | null;
};

const loadingState: HomeDataState = {
  status: 'loading', organizations: [], activity: [], notifications: [], overview: null, error: null,
};

export async function loadHomeData(dataSource: HomeDataSource): Promise<HomeDataState> {
  const [organizations, activity, notifications, overview] = await Promise.all([
    dataSource.getOrganizations(), dataSource.getActivity(), dataSource.getNotifications(), dataSource.getPlatformOverview(),
  ]);
  return { status: 'success', organizations, activity, notifications, overview, error: null };
}

export function useHomeData(dataSource = createHomeDataSource()): HomeDataState {
  const [state, setState] = useState<HomeDataState>(loadingState);
  useEffect(() => {
    let active = true;
    loadHomeData(dataSource).then((nextState) => { if (active) setState(nextState); }).catch((error: unknown) => { if (active) setState({ ...loadingState, status: 'error', error: error instanceof Error ? error : new Error('Unable to load home data') }); });
    return () => { active = false; };
  }, [dataSource]);
  return state;
}