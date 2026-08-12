import { ListScreen } from '../../../components/feedback/ListScreen';
import type { HomeDataState } from '../../../data/home-data';

export function ActivityScreen({ data }: { data: HomeDataState }) {
  return <ListScreen title="Actividad" status={data.status} items={data.activity.map(({ title, detail, age }) => `${title} · ${detail} · ${age}`)} />;
}