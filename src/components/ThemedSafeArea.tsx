import { ReactNode } from "react";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export function ThemedSafeAreaView({
  style,
  children,
}: {
  style?: any;
  children: ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
      edges={["top"]}
    >
      {children}
    </SafeAreaView>
  );
}
