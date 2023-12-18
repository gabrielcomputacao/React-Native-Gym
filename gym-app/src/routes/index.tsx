import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useTheme, Box } from "native-base";
import { useAuth } from "@hooks/useAuth";

export function Routes() {
  const nativeBaseTheme = useTheme();
  const theme = DefaultTheme;
  theme.colors.background = nativeBaseTheme.colors.gray[700];
  const { user } = useAuth();

  console.log(user);

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  );
}
