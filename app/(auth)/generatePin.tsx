import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { createMpin } from "@/services/api";
import { setHasMpin } from "@/store/slices/authSlices";

const GeneratePin: React.FC = () => {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const dispatch = useDispatch();

  const [confirmPin, setConfirmPin] = useState("");
  const [isPinCreated, setIsPinCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);
  const [animation] = useState(new Animated.Value(0));
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const handleCreatePin = async () => {
    if (pin !== confirmPin) {
      Toast.show({
        type: "error",
        text1: "MPin do not match",
        text2: "Please try again.",
      });
      return;
    }

    if (isLoading) return;
    try {
      setIsLoading(true);
      animateButton();
      await createMpin(token!, pin);
      dispatch(setHasMpin(true));

      Toast.show({
        type: "success",
        text1: "MPIN Created",
        text2: "Your MPIN has been set successfully.",
      });

      router.push("/(app)/profileDetails");
    } catch (error) {
      console.error("MPIN creation failed:", error);
      Toast.show({
        type: "error",
        text1: "MPIN Creation Failed",
        text2: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/(auth)/signIn");
  };
  const handleSetupProfile = () => {
    router.push("/(app)/profileDetails");
  };

  if (isPinCreated) {
    return (
      <View style={styles.container}>
        <View style={styles.checkmarkContainer}>
          {/* Checkmark Gradient Circle */}
          <LinearGradient
            colors={["#6C63FF", "#C460F9"]}
            style={styles.checkmarkCircle}
          >
            <Text style={styles.checkmark}>✔</Text>
          </LinearGradient>
        </View>
        <Text style={styles.successTitle}>Welcome to Career box!</Text>
        <Text style={styles.successSubtitle}>
          Thank you for signing up. Let’s set up your education profile.
        </Text>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.setupProfileButton}
          onPress={handleSetupProfile}
        >
          <Text style={styles.setupProfileText}>Setup Student Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push("/(tabs)/home");
          }}
        >
          <Text style={styles.goToDeskLink}>Go to My Desk</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Careerbox</Text>
      <Text style={styles.title}>Create pin</Text>
      <Text style={styles.subtitle}>Create 4 digit pin for easy login</Text>

      {/* Gradient Line */}
      <LinearGradient
        colors={["#6C63FF", "#C460F9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientLine}
      />

      {/* Input Fields */}
      <Text style={styles.inputLabel}>Enter 4 digit pin</Text>
      <TextInput
        style={styles.input}
        placeholder="####"
        keyboardType="number-pad"
        maxLength={4}
        onChangeText={(text) => setPin(text)}
        secureTextEntry={true}
        value={pin}
      />

      <Text style={styles.inputLabel}>Confirm pin</Text>
      <TextInput
        style={[styles.input, styles.confirmInput]}
        placeholder="####"
        keyboardType="number-pad"
        maxLength={4}
        onChangeText={(text) => setConfirmPin(text)}
        value={confirmPin}
        secureTextEntry={true}
      />

      {/* Create PIN Button */}
      <TouchableOpacity
        style={styles.createPinButton}
        onPress={handleCreatePin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.createPinText}>Create PIN</Text>
        )}
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity onPress={handleBackToLogin}>
        <Text style={styles.backToLogin}>
          Remember PIN?{" "}
          <Text style={styles.backToLoginLink}>Back to login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GeneratePin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#000",
    height: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#7e7e7e",
    textAlign: "center",
    marginVertical: 5,
  },
  gradientLine: {
    width: 241,
    height: 3,
    marginTop: 10,
    marginBottom: 20,
  },
  inputLabel: {
    width: "100%",
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "flex-start",
    marginVertical: 10,
    color: "#000",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 0,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },
  confirmInput: {
    borderColor: "#6C63FF",
    borderWidth: 2,
  },
  createPinButton: {
    backgroundColor: "#192335",
    padding: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  createPinText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backToLogin: {
    fontSize: 14,
    color: "#7e7e7e",
    marginTop: 20,
  },
  backToLoginLink: {
    color: "#6c63ff",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  // CompleteAuthScreen styles
  checkmarkContainer: {
    marginBottom: 20,
  },
  checkmarkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 50,
    color: "#fff",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#7e7e7e",
    textAlign: "center",
    marginVertical: 10,
  },
  setupProfileButton: {
    backgroundColor: "#192335",
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 5,
  },
  setupProfileText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  goToDeskLink: {
    color: "#6c63ff",
    fontWeight: "600",
    marginTop: 20,
  },
});
