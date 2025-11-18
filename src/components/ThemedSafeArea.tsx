import { ReactNode } from "react";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export function ThemedSafeAreaView({ style, children, edges }: { style?: any; children: ReactNode; edges?: string[] }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }, style]} edges={["top", "bottom"]}>
      {children}
    </SafeAreaView>
  );
}
