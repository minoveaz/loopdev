import { ListScreen } from '../../../components/feedback/ListScreen';
import type { HomeDataState } from '../../../data/home-data';

export function OrganizationsScreen({ data }: { data: HomeDataState }) {
  return <ListScreen title="Organizaciones" status={data.status} items={data.organizations.map(({ name, memberCount, status }) => `${name} · ${memberCount} miembros · ${status}`)} />;
}