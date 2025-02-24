import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  Image,
  Animated,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/store";
import Toast from "react-native-toast-message";
import { updateProfile } from "@/services/api";
import { updateUserProfile } from "@/store/slices/authSlices";

type DropdownKey = "location" | "gender";

interface FormField {
  label: string;
  placeholder: string;
  keyboardType?: "default" | "email-address";
}

interface FormValues {
  fullName: string;
  email: string;
  gender: string;
  dob: Date | null;
  location: string;
}

const profileDetails: React.FC = () => {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState<DropdownKey | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { token, userData, user } = useSelector(
    (state: RootState) => state.auth
  ) as any;
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
  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ];

  const genderOptions = ["male", "female", "otherr"];

  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required("Full name is required")
      .min(2, "Name must be at least 2 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    gender: Yup.string().required("Gender is required"),
    dob: Yup.date().nullable().required("Date of birth is required"),
    location: Yup.string().required("Location is required"),
  });

  const initialValues: FormValues = {
    fullName: "",
    email: "",
    gender: "",
    dob: null,
    location: "",
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSetupProfile = async (values: FormValues) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      animateButton();
      await new Promise((resolve) => setTimeout(resolve, 800));
      // await updateProfile(token!, userData, {
      //   fullName: values.fullName,
      //   email: values.email,
      //   gender: values.gender,
      //   dob: values.dob,
      //   city: values.location,
      //   phoneNumber: userData.phoneNumber,
      // });
      dispatch(
        updateUserProfile({
          name: values.fullName,
          email: values.email,
          gender: values.gender,
          dob: values.dob,
          city: values.location,
          hasCompletedProfile: true,
        })
      );

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been updated successfully.",
      });

      router.push("/(app)/educationDetails");
    } catch (error: any) {
      console.error("Profile details update failed:", error);
      Toast.show({
        type: "error",
        text1: "Profile Updated Failed",
        text2: `${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderDropdown = (
    key: DropdownKey,
    data: string[],
    onSelect: (value: string) => void
  ) => {
    if (showDropdown !== key) return null;

    return (
      <View style={styles.dropdownContainer}>
        {key === "location" && (
          <TextInput
            style={styles.searchInput}
            placeholder="Search location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#A0A0A0"
          />
        )}
        <FlatList
          data={data}
          keyExtractor={(item) => item}
          style={styles.dropdownList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(item);
                setShowDropdown(null);
                setSearchQuery("");
              }}
            >
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          )}
          nestedScrollEnabled
        />
      </View>
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSetupProfile}
    >
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={
            <>
              <Text style={styles.skip}>Skip {">>"}</Text>
              <Text style={styles.header}>Profile Details</Text>
              <Text style={styles.subHeader}>
                Fill up the correct details as it is.
              </Text>
              <View style={styles.divider} />

              {/* Full Name Input */}
              <Text style={styles.label}>Student Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.fullName && touched.fullName && styles.inputError,
                ]}
                placeholder="Enter your name"
                onChangeText={handleChange("fullName")}
                value={values.fullName}
              />
              {errors.fullName && touched.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}

              {/* Email Input */}
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.email && touched.email && styles.inputError,
                ]}
                placeholder="Enter your email"
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                value={values.email}
              />
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </>
          }
          ListFooterComponent={
            <>
              {/* Gender Selection */}
              <Text style={styles.label}>Gender</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  errors.gender && touched.gender && styles.inputError,
                ]}
                onPress={() =>
                  setShowDropdown(showDropdown === "gender" ? null : "gender")
                }
              >
                <Text
                  style={[
                    styles.inputText,
                    values.gender && styles.selectedText,
                  ]}
                >
                  {values.gender || "Select Gender"}
                </Text>
              </TouchableOpacity>
              {renderDropdown("gender", genderOptions, (gender) => {
                setFieldValue("gender", gender);
              })}
              {errors.gender && touched.gender && (
                <Text style={styles.errorText}>{errors.gender}</Text>
              )}

              {/* Date of Birth */}
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={[
                  styles.dateInputContainer,
                  errors.dob && touched.dob && styles.inputError,
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={[
                    styles.dateInputText,
                    values.dob && styles.selectedText,
                  ]}
                >
                  {values.dob ? formatDate(values.dob) : "DD/MM/YYYY"}
                </Text>
                <Image
                  source={require("../../assets/icons/calendar.png")}
                  style={styles.calendarIcon}
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={values.dob || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === "ios");
                    if (selectedDate) {
                      setFieldValue("dob", selectedDate);
                    }
                  }}
                />
              )}
              {errors.dob && touched.dob && (
                <Text style={styles.errorText}>{errors.dob}</Text>
              )}

              {/* Location Selection */}
              <Text style={styles.label}>City/Location</Text>
              <TouchableOpacity
                style={[
                  styles.locationInput,
                  errors.location && touched.location && styles.inputError,
                ]}
                onPress={() =>
                  setShowDropdown(
                    showDropdown === "location" ? null : "location"
                  )
                }
              >
                <Text
                  style={[
                    styles.inputText,
                    values.location && styles.selectedText,
                  ]}
                >
                  {values.location || "Select Location"}
                </Text>
              </TouchableOpacity>
              {renderDropdown("location", filteredLocations, (location) => {
                setFieldValue("location", location);
              })}
              {errors.location && touched.location && (
                <Text style={styles.errorText}>{errors.location}</Text>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSubmit()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator
                    color="#fff"
                    style={styles.saveButtonText}
                  />
                ) : (
                  <Text style={styles.saveButtonText}>Save & Continue</Text>
                )}
              </TouchableOpacity>

              {/* Go to Desk */}
              <TouchableOpacity
                onPress={() => {
                  router.push("/(tabs)/home");
                }}
              >
                <Text style={styles.goToDesk}>Go to my desk</Text>
              </TouchableOpacity>
            </>
          }
          contentContainerStyle={styles.container}
        />
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  skip: {
    alignSelf: "flex-end",
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 14,
    textAlign: "center",
    color: "#7C7C7C",
  },
  divider: {
    height: 2,
    backgroundColor: "#007BFF",
    width: "50%",
    alignSelf: "center",
    marginVertical: 15,
  },
  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#F9F9F9",
  },
  inputError: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginBottom: 10,
  },
  inputText: {
    color: "#A0A0A0",
    fontSize: 16,
  },
  selectedText: {
    color: "#000",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
    backgroundColor: "#F9F9F9",
  },
  dateInputText: {
    flex: 1,
    fontSize: 16,
    color: "#A0A0A0",
  },
  calendarIcon: {
    width: 24,
    height: 24,
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
    backgroundColor: "#F9F9F9",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  dropdownList: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#192335",
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 15,
  },
  goToDesk: {
    textAlign: "center",
    color: "#000",
    fontSize: 16,
    marginTop: 20,
    fontWeight: "500",
  },
});

export default profileDetails;
