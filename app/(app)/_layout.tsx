import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profileDetails" />
      <Stack.Screen name="educationDetails" />
      <Stack.Screen name="eligibilityForm" />
      <Stack.Screen name="preferenceCourse" />
      <Stack.Screen name="collegeDetails" />
    </Stack>
  );
};

export default Layout;
