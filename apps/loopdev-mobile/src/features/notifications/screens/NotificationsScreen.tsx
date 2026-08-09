import { ListScreen } from '../../../components/feedback/ListScreen';
import type { HomeDataState } from '../../../data/home-data';

export function NotificationsScreen({ data }: { data: HomeDataState }) {
  return <ListScreen title="Notificaciones" status={data.status} items={data.notifications.map(({ title, detail }) => `${title} · ${detail}`)} />;
}