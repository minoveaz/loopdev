import { NativeScreen } from '@loopdev/ui-native';
import { useTheme } from '../../theme/ThemeProvider';

export function Screen(props: React.ComponentProps<typeof NativeScreen>) {
	const { colors } = useTheme();
	return <NativeScreen {...props} colors={colors} />;
}