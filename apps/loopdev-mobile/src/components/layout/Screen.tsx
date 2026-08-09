import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

export function Screen({ children, eyebrow = 'LOOPDEV MOBILE' }: { children: React.ReactNode; eyebrow?: string }) {
  return <View style={styles.screen}><Text style={styles.eyebrow}>{eyebrow}</Text>{children}</View>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: colors.canvas, flex: 1, padding: 32, paddingTop: 64 }, eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 } });