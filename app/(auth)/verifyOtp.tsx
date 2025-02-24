import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { verify } from "@/services/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthenticated,
  setToken,
  setUserData,
} from "@/store/slices/authSlices";
import { RootState } from "@/store/store";
import Toast from "react-native-toast-message";

const VerifyOtp: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [isResendDisabled, setResendDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth) as any;
  const handleVerifyOtp = async () => {
    if (otp != "123456") {
      Toast.show({
        type: "error",
        text1: "Verification otp not valid",
      });
      return;
    }
    if (isLoading) return;
    try {
      setIsLoading(true);
      const response = await verify(user.phoneNumber, otp);
      dispatch(setToken(response.data.token));
      dispatch(setUserData(response.data.user));
      dispatch(setAuthenticated(true));
      Toast.show({
        type: "success",
        text1: "OTP Verify Successfully",
      });
      router.push("/(auth)/generatePin");
    } catch (error: any) {
      console.error("Verification failed:", error);
      Toast.show({
        type: "error",
        text1: "Verification OTP failed",
        text2: `${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setResendDisabled(true);
    Toast.show({
      type: "success",
      text1: "A new OTP has been sent to your number.",
    });
    setTimeout(() => setResendDisabled(false), 30000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Career box</Text>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        We sent a code to{" "}
        <Text style={styles.phoneNumber}>+91 {user.phoneNumber}</Text>
      </Text>
      <Text style={styles.subtitle}>Please enter it below</Text>

      <LinearGradient
        colors={["#2F57EF", "#B966E7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientLine}
      />

      <Text style={styles.otpText}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="######"
        keyboardType="number-pad"
        maxLength={6}
        onChangeText={(text) => setOtp(text)}
        value={otp}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendOtp}
          disabled={isResendDisabled}
        >
          <Text
            style={[
              styles.resendText,
              isResendDisabled && styles.disabledResendText,
            ]}
          >
            Resend code
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.verifyButton}
        disabled={isLoading}
        onPress={handleVerifyOtp}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.verifyText}>Verify OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VerifyOtp;

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
  phoneNumber: {
    color: "#000",
    fontWeight: "bold",
  },
  gradientLine: {
    width: "80%",
    height: 2,
    marginTop: 5,
    marginBottom: 20,
    borderRadius: 1,
  },
  inputContainer: {
    marginBlockStart: 10,
    width: "100%",
    position: "relative",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 20,
    textAlign: "center",
    fontSize: 18,
  },
  resendButton: {
    position: "absolute", // Absolute positioning for bottom-right alignment
    right: 10,
    bottom: 0,
    // paddingTop: 50,
  },
  resendText: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 21,
  },
  disabledResendText: {
    color: "#aaa",
  },
  verifyButton: {
    backgroundColor: "#192335",
    padding: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  verifyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  otpContainer: {
    width: "100%",
    paddingHorizontal: 5,
  },
  otpText: {
    fontWeight: "bold",
    width: "100%",
    fontSize: 16,
    lineHeight: 21,
    alignSelf: "flex-start",
    color: "#000",
  },
});
