import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ListRenderItem,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { updateEducation } from "@/services/api";
import { updateUserProfile } from "@/store/slices/authSlices";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

type DropdownState = {
  courseLevel: string;
  branch: string;
  subject: string;
  university: string;
  year: string;
  domicile: string;
};

type DropdownVisibility = {
  [key in keyof DropdownState]: boolean;
};

type FormField = {
  label: string;
  field: keyof DropdownState;
  isTextInput?: boolean;
};

const options: Record<keyof DropdownState, string[]> = {
  courseLevel: ["10th", "12th", "Graduate"],
  branch: ["Engineering", "Medical", "B.Sc.", "B.A."],
  subject: ["Physics", "Mathematics", "History", "Biology"],
  university: [], // Text input field
  year: ["2023", "2022", "2021", "2020"],
  domicile: ["California", "New York", "Texas", "Florida"],
};

const validationSchema = Yup.object().shape({
  courseLevel: Yup.string().required("Course level is required"),
  branch: Yup.string().required("Branch/Stream is required"),
  subject: Yup.string().required("Subject is required"),
  university: Yup.string().required("University/Board is required"),
  year: Yup.string().required("Passing year is required"),
  domicile: Yup.string().required("Domicile is required"),
});

const educationDetails: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [isDropdownVisible, setDropdownVisible] = useState<DropdownVisibility>({
    courseLevel: false,
    branch: false,
    subject: false,
    university: false,
    year: false,
    domicile: false,
  });

  const initialValues: DropdownState = {
    courseLevel: "",
    branch: "",
    subject: "",
    university: "",
    year: "",
    domicile: "",
  };

  const onSave = async (values: DropdownState) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      // await updateEducation(token!, { major, graduationYear })
      dispatch(
        updateUserProfile({ major: values.branch, graduationYear: values.year })
      );
      Toast.show({
        type: "success",
        text1: "Education Details Updated",
        text2: "Your educational information has been saved.",
      });
      router.push("/(app)/eligibilityForm");
    } catch (error) {
      console.error("Educational details update failed:", error);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdownToggle = (field: keyof DropdownState): void => {
    setDropdownVisible((prev) => {
      const newState = {
        courseLevel: false,
        branch: false,
        subject: false,
        university: false,
        year: false,
        domicile: false,
      };
      newState[field] = !prev[field];
      return newState;
    });
  };

  const renderDropdown = (
    field: keyof DropdownState,
    setFieldValue: (field: string, value: string) => void,
    errors: Record<string, string>,
    touched: Record<string, boolean>
  ): JSX.Element | null => {
    if (!isDropdownVisible[field]) return null;

    return (
      <View
        style={[
          styles.dropdown,
          errors[field] && touched[field] && styles.dropdownError,
        ]}
      >
        <FlatList
          data={options[field]}
          keyExtractor={(item, index) => `${field}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setFieldValue(field, item);
                handleDropdownToggle(field);
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

  const formFields: FormField[] = [
    { label: "Latest Passout Course Level", field: "courseLevel" },
    { label: "Branch/Stream/Degree", field: "branch" },
    { label: "Specialize Subject", field: "subject" },
    { label: "Exam Board/University", field: "university", isTextInput: true },
    { label: "Passing Year", field: "year" },
    { label: "Domicile", field: "domicile" },
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSave}
    >
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <View style={styles.container}>
          <FlatList
            data={formFields}
            keyExtractor={(item) => item.field}
            renderItem={({ item }) => (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>{item.label}</Text>
                {item.isTextInput ? (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        errors[item.field] &&
                          touched[item.field] &&
                          styles.inputError,
                      ]}
                      placeholder={`Enter ${item.label}`}
                      value={values[item.field]}
                      onChangeText={handleChange(item.field)}
                      placeholderTextColor="#7C7C7C"
                    />
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      style={[
                        styles.input,
                        errors[item.field] &&
                          touched[item.field] &&
                          styles.inputError,
                      ]}
                      onPress={() => handleDropdownToggle(item.field)}
                    >
                      <Text
                        style={[
                          styles.inputText,
                          values[item.field] && styles.selectedText,
                        ]}
                      >
                        {values[item.field] || `Select ${item.label}`}
                      </Text>
                      <Image
                        source={require("../../assets/icons/dropdown-icon.png")}
                        style={[
                          styles.dropdownIcon,
                          isDropdownVisible[item.field] &&
                            styles.dropdownIconRotated,
                        ]}
                      />
                    </TouchableOpacity>
                    {renderDropdown(item.field, setFieldValue, errors, touched)}
                  </View>
                )}
                {errors[item.field] && touched[item.field] && (
                  <Text style={styles.errorText}>{errors[item.field]}</Text>
                )}
              </View>
            )}
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                <Text style={styles.skip}>Skip {">>"}</Text>
                <Text style={styles.header}>Education Details</Text>
                <Text style={styles.subHeader}>
                  Fill up your latest passout education details
                </Text>
                <View style={styles.divider} />
              </View>
            }
            ListFooterComponent={
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
            }
            contentContainerStyle={styles.scrollContainer}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 25,
  },
  skip: {
    alignSelf: "flex-end",
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#333",
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 14,
    textAlign: "center",
    color: "#7C7C7C",
    marginTop: 5,
  },
  divider: {
    height: 2,
    backgroundColor: "#007BFF",
    width: "50%",
    alignSelf: "center",
    marginVertical: 15,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1A1B1D",
  },
  input: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12,
    backgroundColor: "#F9F9F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputError: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 4,
  },
  inputText: {
    fontSize: 14,
    color: "#7C7C7C",
    flex: 1,
  },
  selectedText: {
    color: "#1A1B1D",
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    transform: [{ rotate: "0deg" }],
  },
  dropdownIconRotated: {
    transform: [{ rotate: "180deg" }],
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: "#fff",
    maxHeight: 200,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dropdownError: {
    borderColor: "#FF0000",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#1A1B1D",
  },
  saveButton: {
    backgroundColor: "#192335",
    borderRadius: 30,
    marginTop: 20,
    marginBottom: Platform.OS === "ios" ? 40 : 20,
    overflow: "hidden",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    padding: 16,
  },
});

export default educationDetails;
