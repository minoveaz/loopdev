import { useEffect, useState } from 'react';
import type { HomeDataSource } from './contracts/home';
import type {
  ActivityItem,
  MobileOrganization,
  NotificationItem,
  PlatformOverview,
} from './contracts/home';

export type HomeDataState = {
  status: 'loading' | 'success' | 'error';
  organizations: MobileOrganization[];
  activity: ActivityItem[];
  notifications: NotificationItem[];
  overview: PlatformOverview | null;
  error: Error | null;
};

const loadingState: HomeDataState = {
  status: 'loading',
  organizations: [],
  activity: [],
  notifications: [],
  overview: null,
  error: null,
};

export async function loadHomeData(dataSource: HomeDataSource, organizationId?: string): Promise<HomeDataState> {
  const [organizations, activity, notifications, overview] = await Promise.all([
    dataSource.getOrganizations(),
    dataSource.getActivity(organizationId),
    dataSource.getNotifications(organizationId),
    dataSource.getPlatformOverview(organizationId),
  ]);
  return { status: 'success', organizations, activity, notifications, overview, error: null };
}

export function useHomeData(dataSource?: HomeDataSource, organizationId?: string): HomeDataState {
  const [state, setState] = useState<HomeDataState>(loadingState);
  useEffect(() => {
    if (!dataSource) {
      setState(loadingState);
      return;
    }
    let active = true;
    loadHomeData(dataSource, organizationId)
      .then((nextState) => {
        if (active) setState(nextState);
      })
      .catch((error: unknown) => {
        if (active)
          setState({
            ...loadingState,
            status: 'error',
            error: error instanceof Error ? error : new Error('Unable to load home data'),
          });
      });
    return () => {
      active = false;
    };
  }, [dataSource, organizationId]);
  return state;
}
