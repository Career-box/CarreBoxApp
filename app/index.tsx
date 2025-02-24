import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function Index() {
  const scale = useSharedValue(0);
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const checkAuthStatus = () => {
      if (!isAuthenticated) {
        router.replace("/(auth)/signUp");
      } else if (!user.hasMpin) {
        router.replace("/(auth)/generatePin");
      } else if (!user.hasCompletedProfile) {
        router.replace("/(app)/profileDetails");
      } else {
        router.replace("/(tabs)/preferences");
      }
    };

    // Animate the logo
    scale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });

    // Check auth status and navigate after 2 seconds
    const timeout = setTimeout(() => {
      checkAuthStatus();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, user.hasMpin, user.hasCompletedProfile, router, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Text style={styles.logoText}>Careerbox</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
  },
});
