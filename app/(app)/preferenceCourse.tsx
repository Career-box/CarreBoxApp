import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

// Types
interface CoursePreference {
  eligibleCourses: string[];
  admissionChoices: string[];
}

// Constants
const COURSES = {
  Science: ["B.Sc.", "M.Sc."],
  Engineering: ["Mechanical", "CS", "IT"],
  Business: ["BBA", "MBA"],
  Medical: ["M.D.", "MBBS"],
};

const validationSchema = Yup.object().shape({
  eligibleCourses: Yup.array()
    .min(1, "Select at least one course stream")
    .required("Course stream is required"),
  // admissionChoices: Yup.array()
  //   .min(1, "Select at least one specific course")
  //   .required("Specific course selection is required"),
});

const preferenceCourse: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const renderChips = (
    items: string[],
    onRemove: (item: string) => void,
    style?: object
  ) => {
    return (
      <View style={styles.chipsContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.chip, style]}
            onPress={() => onRemove(item)}
          >
            <Text style={styles.chipText}>{item}</Text>
            <Text style={styles.chipClose}>×</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderDropdown = (
    options: string[],
    onSelect: (value: string) => void,
    currentValues: string[]
  ) => {
    if (!showDropdown) return null;

    return (
      <Modal transparent visible={true} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowDropdown(null)}
        >
          <View style={styles.dropdownContainer}>
            <ScrollView>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownItem,
                    currentValues.includes(option) &&
                      styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setShowDropdown(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      currentValues.includes(option) &&
                        styles.dropdownTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>{"<< Back"}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.skipButton}>{"Skip >>"} </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Set Admission Preference</Text>
      <Text style={styles.subtitle}>
        Select the eligible options for getting Admission in your favourite
        course
      </Text>

      <Formik
        initialValues={{
          eligibleCourses: [] as string[],
          admissionChoices: [] as string[],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            setIsLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 800));
            router.push("/(tabs)/preferences");
          } catch (error: any) {
            Toast.show({
              type: "error",
              text1: "Perference Course Ffailed",
              text2: `${error.message}`,
            });
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Eligible Courses</Text>

            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowDropdown("courses")}
            >
              <Text style={styles.dropdownPlaceholder}>
                {values.eligibleCourses.length
                  ? "Selected Courses"
                  : "Select Multiple Course"}
              </Text>
            </TouchableOpacity>

            {renderChips(values.eligibleCourses, (course) =>
              setFieldValue(
                "eligibleCourses",
                values.eligibleCourses.filter((c) => c !== course)
              )
            )}

            {errors.eligibleCourses && touched.eligibleCourses && (
              <Text style={styles.errorText}>{errors.eligibleCourses}</Text>
            )}

            {showDropdown === "courses" &&
              renderDropdown(
                Object.keys(COURSES),
                (course) => {
                  if (!values.eligibleCourses.includes(course)) {
                    setFieldValue("eligibleCourses", [
                      ...values.eligibleCourses,
                      course,
                    ]);
                  }
                },
                values.eligibleCourses
              )}

            <Text style={styles.sectionTitle}>Admission Choices</Text>
            {renderChips(
              values.admissionChoices,
              (choice) =>
                setFieldValue(
                  "admissionChoices",
                  values.admissionChoices.filter((c) => c !== choice)
                ),
              { backgroundColor: "#E8F0FE" }
            )}

            {errors.admissionChoices && touched.admissionChoices && (
              <Text style={styles.errorText}>{errors.admissionChoices}</Text>
            )}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                handleSubmit();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backTextButton}>
              <Text style={styles.backTextButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: "#000",
  },
  skipButton: {
    fontSize: 16,
    color: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  dropdownPlaceholder: {
    color: "#666",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  chipText: {
    marginRight: 4,
  },
  chipClose: {
    fontSize: 18,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    width: "80%",
    maxHeight: "50%",
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemSelected: {
    backgroundColor: "#E8F0FE",
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownTextSelected: {
    color: "#1a73e8",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#1a1b1d",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backTextButton: {
    padding: 15,
    alignItems: "center",
  },
  backTextButtonText: {
    color: "#666",
    fontSize: 16,
  },
});

export default preferenceCourse;
