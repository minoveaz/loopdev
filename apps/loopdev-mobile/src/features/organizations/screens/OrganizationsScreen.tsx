import { ListScreen } from '../../../components/feedback/ListScreen';
import type { HomeDataState } from '../../../data/home-data';

export function OrganizationsScreen({ data, activeOrganizationId, onSelectOrganization }: { data: HomeDataState; activeOrganizationId: string | null; onSelectOrganization: (organizationId: string) => void }) {
  return <ListScreen title="Organizaciones" status={data.status} items={data.organizations.map(({ id, name, memberCount, status }) => `${id === activeOrganizationId ? 'Activa · ' : ''}${name} · ${memberCount} miembros · ${status}`)} onItemPress={(index) => {
    const organization = data.organizations[index];
    if (organization) onSelectOrganization(organization.id);
  }} />;
}