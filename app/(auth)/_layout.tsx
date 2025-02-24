import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Layout = () => {
  const screenOptions: any = {
    headerShown: false,
    animation: "slide_from_right",
  };

  return (
    <SafeAreaProvider>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="onBoarding" />
        <Stack.Screen name="singIn" />
        <Stack.Screen name="signUp" />
        <Stack.Screen name="verifyOtp" />
        <Stack.Screen name="generatePin" />
        <Stack.Screen name="forgetPin" />
      </Stack>
    </SafeAreaProvider>
  );
};

export default Layout;
