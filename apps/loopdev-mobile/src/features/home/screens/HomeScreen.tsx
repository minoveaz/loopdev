import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeBrandMark, NativeSuiteCard, type SuiteCardContract } from '@loopdev/ui-native';
import type { HomeDataState } from '../../../data/home-data';
import { useTheme } from '../../../theme/ThemeProvider';
import { radii, spacing, typography } from '@loopdev/tokens/semantic';

type Tab = 'activity' | 'notifications' | 'organizations' | 'profile';
export function HomeScreen({ data, activeOrganizationId, isPlatformAdministrator, onNavigate }: { data: HomeDataState; activeOrganizationId: string | null; isPlatformAdministrator: boolean; onNavigate: (tab: Tab) => void }) {
  const { colors: themeColors } = useTheme();
  if (data.status === 'loading') return <Text style={[styles.description, { color: themeColors.muted }]}>Cargando resumen de plataforma...</Text>;
  if (data.status === 'error') return <Text style={[styles.description, { color: themeColors.muted }]}>No se pudo cargar el resumen. Inténtalo de nuevo.</Text>;
  const overview = data.overview;
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
      title: name,
      description: suiteDescriptions[suiteKey] ?? 'Módulo operativo de LoopDev.',
      availability: status === 'active' ? 'enabled' : 'disabled',
      status: status === 'active' ? 'ready' : 'audit',
    } satisfies SuiteCardContract,
  }));
  return <><View style={styles.launchHeader}><View><NativeBrandMark colors={themeColors} /><Text style={[styles.headerCaption, { color: themeColors.muted }]}>WORK CONTEXT / SUPERVISIÓN</Text></View><Pressable accessibilityRole="button" onPress={() => onNavigate('profile')}><Text style={[styles.themeAction, { color: themeColors.accent }]}>PERFIL</Text></Pressable></View><Text style={[styles.kicker, { color: themeColors.accent }]}>CORE_SUITES_AVAILABLE</Text><Text style={[styles.title, { color: themeColors.ink }]}>Inicializa tu contexto de trabajo.</Text><Text style={[styles.description, { color: themeColors.muted }]}>Selecciona una suite para comenzar a operar.</Text><View style={styles.suites}>{suites.map(({ suiteKey, card }) => <NativeSuiteCard key={card.suiteId} suite={card} colors={themeColors} onPress={() => card.availability === 'enabled' && onNavigate(suiteKey === 'crm' ? 'organizations' : 'activity')} />)}</View><View style={[styles.statusCard, { backgroundColor: themeColors.ink }]}><Text style={[styles.cardEyebrow, { color: themeColors.energy }]}>SYSTEM STATUS</Text><Text style={[styles.statusTitle, { color: themeColors.inverse }]}>{overview?.systemStatus === 'operational' ? 'Todo operativo' : 'Servicio degradado'}</Text><Text style={[styles.cardDetail, { color: themeColors.muted }]}>Última comprobación hace 2 min</Text></View></>;
}
function Metric({ label, value }: { label: string; value: number }) { const { colors: themeColors } = useTheme(); return <View style={[styles.metric, { backgroundColor: themeColors.surface }]}><Text style={[styles.metricValue, { color: themeColors.accent }]}>{value}</Text><Text style={[styles.cardDetail, { color: themeColors.muted }]}>{label}</Text></View>; }
function QuickLink({ label, onPress }: { label: string; onPress: () => void }) { const { colors: themeColors } = useTheme(); return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[styles.quickLink, { backgroundColor: themeColors.surface, borderColor: themeColors.line }]}><Text style={[styles.quickLinkLabel, { color: themeColors.accent }]}>{label}</Text></Pressable>; }
const styles = StyleSheet.create({ launchHeader: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xxl }, headerCaption: { fontFamily: typography.mono, fontSize: typography.technical, letterSpacing: 1, marginTop: spacing.xs }, themeAction: { fontFamily: typography.mono, fontSize: typography.technical, fontWeight: '700', letterSpacing: 1 }, kicker: { fontFamily: typography.mono, fontSize: typography.nano, fontWeight: '700', letterSpacing: 2.5, marginBottom: spacing.sm }, title: { fontFamily: typography.sans, fontSize: 28, fontWeight: '700' }, description: { fontFamily: typography.sans, fontSize: 16, lineHeight: 24, marginTop: spacing.md }, suites: { gap: spacing.md, marginTop: spacing.xl }, statusCard: { borderRadius: radii.lg, marginTop: spacing.xl, padding: 20 }, cardEyebrow: { fontFamily: typography.mono, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 }, statusTitle: { fontFamily: typography.sans, fontSize: 22, fontWeight: '700', marginTop: spacing.sm }, cardDetail: { fontFamily: typography.sans, fontSize: 13, marginTop: 6 }, metricRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }, metric: { borderRadius: radii.md, borderWidth: StyleSheet.hairlineWidth, flex: 1, padding: spacing.md }, metricValue: { fontFamily: typography.mono, fontSize: 24, fontWeight: '700' }, sectionTitle: { fontFamily: typography.sans, fontSize: 18, fontWeight: '700', marginTop: spacing.xl }, quickLinks: { gap: spacing.sm, marginTop: spacing.md }, quickLink: { borderRadius: radii.md, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', minHeight: 48, paddingHorizontal: spacing.lg }, quickLinkLabel: { fontFamily: typography.sans, fontSize: 15, fontWeight: '700' } });

const suiteDescriptions: Record<string, string> = {
  marketing: 'Identity governance y motor de contenido generativo.',
  crm: 'Inteligencia de pipeline y relaciones comerciales.',
  quant: 'Ejecución algorítmica y centro de control operativo.',
  health: 'Agenda clínica, registros y operación asistencial.',
};