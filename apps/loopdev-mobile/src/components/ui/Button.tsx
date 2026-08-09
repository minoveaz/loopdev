import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';

export function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.button}><Text style={styles.label}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({ button: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: 8, justifyContent: 'center', minHeight: 48, paddingHorizontal: 20 }, label: { color: colors.white, fontSize: 15, fontWeight: '700' } });