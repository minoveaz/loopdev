import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radii, spacing, typography } from '@loopdev/tokens/semantic';

export function ListScreen({ title, items, status = 'success', onItemPress }: { title: string; items: string[]; status?: 'loading' | 'success' | 'error'; onItemPress?: (index: number) => void }) {
  const { colors: themeColors } = useTheme();
  if (status === 'loading') return <Text style={[styles.message, { color: themeColors.muted }]}>Cargando {title.toLowerCase()}...</Text>;
  if (status === 'error') return <Text style={[styles.message, { color: themeColors.muted }]}>No se pudo cargar {title.toLowerCase()}.</Text>;
  if (items.length === 0) return <Text style={[styles.message, { color: themeColors.muted }]}>No hay {title.toLowerCase()} disponibles.</Text>;
  return <><Text style={[styles.title, { color: themeColors.ink }]}>{title}</Text>{items.map((item, index) => <Pressable key={`${item}-${index}`} accessibilityRole={onItemPress ? 'button' : undefined} onPress={onItemPress ? () => onItemPress(index) : undefined} style={[styles.item, { backgroundColor: themeColors.surface, borderColor: themeColors.line }]}><Text style={[styles.itemText, { color: themeColors.ink }]}>{item}</Text></Pressable>)}</>;
}

const styles = StyleSheet.create({ title: { fontFamily: typography.sans, fontSize: 28, fontWeight: '700' }, message: { fontFamily: typography.sans, fontSize: 16, lineHeight: 24 }, item: { borderRadius: radii.md, borderWidth: StyleSheet.hairlineWidth, marginTop: spacing.sm, padding: spacing.lg }, itemText: { fontFamily: typography.sans, fontSize: 15, lineHeight: 22 } });