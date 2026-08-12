import { NativeButton } from '@loopdev/ui-native';
import { useTheme } from '../../theme/ThemeProvider';

export function Button(props: React.ComponentProps<typeof NativeButton>) {
	const { colors } = useTheme();
	return <NativeButton {...props} colors={colors} />;
}