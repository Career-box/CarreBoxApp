import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CountryPicker from "react-native-country-picker-modal";
import { useRouter } from "expo-router";

const forgetPin: React.FC = () => {
  const [phone, setPhone] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("IN");
  const [callingCode, setCallingCode] = useState<string>("91");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isResendDisabled, setResendDisabled] = useState(false);
  const router = useRouter();
  const handleSendOtp = () => {
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    setOtpSent(true);
    alert("OTP sent to + " + callingCode + " " + phone);
  };

  const handleResendOtp = () => {
    if (otpSent) {
      alert("OTP resent to + " + callingCode + " " + phone);
    }
  };

  const handleBackToLogin = () => {
    router.push("/(auth)/signIn");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>
        {otpSent ? "OTP Verification" : "Forgot PIN"}
      </Text>
      <Text style={styles.subHeader}>
        {otpSent
          ? "Enter OTP Reset Password"
          : "Please Enter Mobile no. For Reset Password"}
      </Text>

      {/* Gradient Line */}
      <LinearGradient
        colors={["#2F57EF", "#B966E7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientLine}
      />

      {/* Dynamic Input Render */}
      {!otpSent ? (
        <>
          {/* Phone Number Input */}
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.callingCode}>+{callingCode}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Mobile No."
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => setPhone(text)}
            />
          </View>
        </>
      ) : (
        <>
          {/* OTP Input */}
          <Text style={styles.label}>Enter OTP</Text>
          <View style={styles.otpInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="######"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={otp}
              onChangeText={(text) => setOtp(text)}
              maxLength={6}
            />
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
        </>
      )}

      {/* Buttons */}
      <TouchableOpacity
        style={styles.sendOtpButton}
        onPress={!otpSent ? handleSendOtp : () => alert("OTP Verified")}
      >
        <Text style={styles.buttonText}>
          {otpSent ? "Verify OTP" : "Send OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backToLoginButton}
        onPress={handleBackToLogin}
      >
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 14,
    color: "#7C7C7C",
    textAlign: "center",
    marginTop: 8,
  },
  gradientLine: {
    width: "80%",
    height: 2,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C8A2C8",
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
    width: "100%",
  },
  callingCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    color: "#000",
    flex: 1,
    padding: 4,
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2F57EF",
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
    width: "100%",
    position: "relative",
  },
  resendCodeText: {
    color: "#2F57EF",
    fontSize: 14,
    fontWeight: "bold",
  },
  sendOtpButton: {
    backgroundColor: "#1A1B1D",
    paddingVertical: 12,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backToLoginButton: {
    alignItems: "center",
  },
  backToLoginText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
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
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});

export default forgetPin;
