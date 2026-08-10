import { StyleSheet, Text, View } from 'react-native';
import { NativeSuiteCard, type SuiteCardContract } from '@loopdev/ui-native';
import type { HomeDataState } from '../../../data/home-data';
import { useTheme } from '../../../theme/ThemeProvider';
import { radii, spacing, typography } from '@loopdev/tokens/semantic';

type Tab = 'activity' | 'notifications' | 'organizations' | 'profile';
export function HomeScreen({ data, activeOrganizationId, isPlatformAdministrator, onNavigate }: { data: HomeDataState; activeOrganizationId: string | null; isPlatformAdministrator: boolean; onNavigate: (tab: Tab) => void }) {
  const { colors: themeColors } = useTheme();
  if (data.status === 'loading') return <Text style={[styles.description, { color: themeColors.muted }]}>Cargando resumen de plataforma...</Text>;
  if (data.status === 'error') return <Text style={[styles.description, { color: themeColors.muted }]}>No se pudo cargar el resumen. Inténtalo de nuevo.</Text>;
  const activeOrganization = data.organizations.find(({ id }) => id === activeOrganizationId);
  const isLoopDevPlatformScope = (isPlatformAdministrator || activeOrganization?.role === 'owner') && activeOrganization?.slug === 'loopdev';
  const platformSuites = isLoopDevPlatformScope ? [
    { id: 'platform-marketing', suiteKey: 'marketing' as const, name: 'Marketing Studio', status: 'active' as const },
    { id: 'platform-crm', suiteKey: 'crm' as const, name: 'Sales & CRM', status: 'active' as const },
    { id: 'platform-quant', suiteKey: 'quant' as const, name: 'Quant Ops', status: 'active' as const },
    { id: 'platform-finance', suiteKey: 'finance' as const, name: 'Financial Ops', status: 'disabled' as const },
    { id: 'platform-health', suiteKey: 'health' as const, name: 'Health OS', status: 'disabled' as const },
  ] : [];
  const availableSuites = [...data.suites, ...platformSuites.filter(({ suiteKey }) => !data.suites.some((suite) => suite.suiteKey === suiteKey))];
  const suites = availableSuites.map(({ id, suiteKey, name, status }) => ({
    suiteKey,
    card: {
      suiteId: id,
      title: suiteTitles[suiteKey] ?? name,
      description: suiteDescriptions[suiteKey] ?? 'Módulo operativo de LoopDev.',
      availability: status === 'active' ? 'enabled' : 'disabled',
      status: status === 'active' ? 'ready' : 'audit',
    } satisfies SuiteCardContract,
  }));
  return <><Text style={[styles.kicker, { color: themeColors.accent }]}>CORE_SUITES_AVAILABLE</Text><Text style={[styles.title, { color: themeColors.ink }]}>Inicializa tu contexto de trabajo.</Text><Text style={[styles.description, { color: themeColors.muted }]}>Selecciona una suite para comenzar a operar.</Text><View style={styles.suites}>{suites.map(({ suiteKey, card }) => <NativeSuiteCard key={card.suiteId} suite={card} colors={themeColors} onPress={() => card.availability === 'enabled' && onNavigate(suiteKey === 'crm' ? 'organizations' : 'activity')} />)}</View></>;
}
const styles = StyleSheet.create({ kicker: { fontFamily: typography.mono, fontSize: typography.nano, fontWeight: '700', letterSpacing: 2.5, marginBottom: spacing.sm }, title: { fontFamily: typography.sans, fontSize: 28, fontWeight: '700' }, description: { fontFamily: typography.sans, fontSize: 16, lineHeight: 24, marginTop: spacing.md }, suites: { gap: spacing.md, marginTop: spacing.xl } });

const suiteDescriptions: Record<string, string> = {
  marketing: 'High-performance identity governance and generative content engine for modern teams.',
  crm: 'Pipeline intelligence and relationship management powered by predictive neural models.',
  quant: 'Algorithmic trading engine and high-frequency execution command center.',
  health: 'Industrial-grade clinical care, electronic health records (HCE), and medical agenda for IPS providers.',
};

const suiteTitles: Record<string, string> = {
  marketing: 'Marketing Studio',
  crm: 'Sales & CRM',
  finance: 'Financial Ops',
  quant: 'Quant Ops',
  health: 'Health OS',
};