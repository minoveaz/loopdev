import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

export function ListScreen({ title, items, status = 'success' }: { title: string; items: string[]; status?: 'loading' | 'success' | 'error' }) {
  if (status === 'loading') return <Text style={styles.message}>Cargando {title.toLowerCase()}...</Text>;
  if (status === 'error') return <Text style={styles.message}>No se pudo cargar {title.toLowerCase()}.</Text>;
  if (items.length === 0) return <Text style={styles.message}>No hay {title.toLowerCase()} disponibles.</Text>;
  return <><Text style={styles.title}>{title}</Text>{items.map((item) => <View key={item} style={styles.item}><Text style={styles.itemText}>{item}</Text></View>)}</>;
}

const styles = StyleSheet.create({ title: { color: colors.ink, fontSize: 28, fontWeight: '700' }, message: { color: colors.muted, fontSize: 16, lineHeight: 24 }, item: { backgroundColor: colors.white, borderRadius: 8, marginTop: 10, padding: 16 }, itemText: { color: colors.ink, fontSize: 15, lineHeight: 22 } });