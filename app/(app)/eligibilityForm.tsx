import React, { useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import * as Yup from "yup";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { updateUserProfile } from "@/store/slices/authSlices";
import { updateEducation } from "@/services/api";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

// Types
interface ExamScore {
  id: string;
  name: string;
  marks: string;
  total: string;
  percentage: string;
}

interface FormValues {
  casteCategory: string;
  is12thPass: boolean;
  examScores: ExamScore[];
  regularExam: string;
  rank: string;
  cgpa: string;
  obtainMark: string;
}

// Constants
const CASTE_CATEGORIES = [
  { label: "Select Category", value: "" },
  { label: "General", value: "GENERAL" },
  { label: "OBC", value: "OBC" },
  { label: "SC", value: "SC" },
  { label: "ST", value: "ST" },
  { label: "EWS", value: "EWS" },
];

const EXAM_TYPES = [
  { label: "Select Exam", value: "" },
  { label: "JEE Main", value: "JEE_MAIN" },
  { label: "NEET", value: "NEET" },
  { label: "GATE", value: "GATE" },
  { label: "CAT", value: "CAT" },
];

// Validation Schema
const validationSchema = Yup.object().shape({
  casteCategory: Yup.string().required("Caste category is required"),
  examScores: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Exam name is required"),
        marks: Yup.string()
          .required("Marks are required")
          .test("is-number", "Must be a valid number", (value) =>
            /^\d+$/.test(value || "")
          ),
        total: Yup.string()
          .required("Total marks are required")
          .test("is-number", "Must be a valid number", (value) =>
            /^\d+$/.test(value || "")
          ),
      })
    )
    .min(1, "At least one exam score is required"),
  rank: Yup.string().required("Rank is required"),
  cgpa: Yup.string().required("CGPA is required"),
  obtainMark: Yup.string().required("Obtain mark is required"),
});

const eligibilityForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [rank, setRank] = useState<string>("");
  const [cgpa, setCgpa] = useState<string>("");
  const [obtainMark, setObtainMark] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: FormValues = {
    casteCategory: "",
    is12thPass: false,
    examScores: [],
    regularExam: "",
    rank: "",
    cgpa: "",
    obtainMark: "",
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      // await updateEducation(token!, { collegeName:values.regularExam, degree:values.rank })
      dispatch(
        updateUserProfile({
          collegeName: values.regularExam,
          degree: values.rank,
        })
      );
      Toast.show({
        type: "success",
        text1: "College Details Updated",
        text2: "Your college information has been saved.",
      });
      router.push("/(tabs)/home");
    } catch (error) {
      console.error("College details update failed:", error);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Please try again.",
      });
    }
  };

  const calculatePercentage = (marks: string, total: string): string => {
    const percentage = (parseFloat(marks) / parseFloat(total)) * 100;
    return percentage.toFixed(2);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.backButton}>{"< Back"}</Text>
          <Text style={styles.skipButton}>Skip {">>"}</Text>
        </View>

        <Text style={styles.header}>Check Your Eligibility</Text>
        <Text style={styles.subHeader}>
          Fill up your latest passout education details
        </Text>
        <View style={styles.divider} />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleSubmit, setFieldValue }) => (
            <View>
              {/* Caste Category Dropdown */}
              <Text style={styles.label}>Caste Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={values.casteCategory}
                  onValueChange={(value) =>
                    setFieldValue("casteCategory", value)
                  }
                  style={styles.picker}
                >
                  {CASTE_CATEGORIES.map((category) => (
                    <Picker.Item
                      key={category.value}
                      label={category.label}
                      value={category.value}
                    />
                  ))}
                </Picker>
              </View>
              {touched.casteCategory && errors.casteCategory && (
                <Text style={styles.errorText}>{errors.casteCategory}</Text>
              )}

              {/* 12th Pass Switch */}
              <View style={styles.switchContainer}>
                <Text style={styles.label}>12th Exam Passout?</Text>
                <Switch
                  value={values.is12thPass}
                  onValueChange={(value) => {
                    void setFieldValue("is12thPass", value);
                  }}
                />
              </View>

              {/* Exam Scores */}
              <FieldArray name="examScores">
                {({ push, remove }) => (
                  <View>
                    {values.examScores.map((score, index) => (
                      <View key={score.id} style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>
                          {score.name}: {score.marks}/{score.total} (
                          {score.percentage}%)
                        </Text>
                        <TouchableOpacity
                          onPress={() => remove(index)}
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeButtonText}>X</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    {/* Add Exam Score */}
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => {
                        return;
                        // const newScore: ExamScore = {
                        //   id: `${new Date().getTime()}`,
                        //   name: values.regularExam,
                        //   marks: values.obtainMark,
                        //   total: "100",
                        //   percentage: calculatePercentage(
                        //     values.obtainMark,
                        //     "100"
                        //   ),
                        // };
                        // push(newScore);
                      }}
                    >
                      <Text style={styles.addButtonText}>
                        Add Last Exam Score
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </FieldArray>

              {/* Regular/Entrance Exam Dropdown */}
              <Text style={styles.label}>Regular/Entrance Exam</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={values.regularExam}
                  onValueChange={(value) => setFieldValue("regularExam", value)}
                  style={styles.picker}
                >
                  {EXAM_TYPES.map((exam) => (
                    <Picker.Item
                      key={exam.value}
                      label={exam.label}
                      value={exam.value}
                    />
                  ))}
                </Picker>
              </View>

              {/* Rank */}
              <Text style={styles.label}>Rank:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Rank"
                keyboardType="numeric"
                value={rank}
                onChangeText={setRank}
              />

              {/* CGPA */}
              <Text style={styles.label}>CGPA / Percentile Point:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter CGPA or Percentile"
                keyboardType="numeric"
                value={cgpa}
                onChangeText={setCgpa}
              />

              {/* Obtain Mark */}
              <Text style={styles.label}>Obtain Mark:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Obtain Mark"
                keyboardType="numeric"
                value={obtainMark}
                onChangeText={setObtainMark}
              />

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.button}
                disabled={isLoading}
                onPress={async () => {
                  try {
                    setIsLoading(true);
                    await new Promise((resolve) => setTimeout(resolve, 800));
                    dispatch(
                      updateUserProfile({
                        collegeName: values.regularExam || "Gate",
                        degree: values.rank || "5515",
                      })
                    );
                    router.push("/(app)/preferenceCourse");
                    Toast.show({
                      type: "success",
                      text1: "College Details Updated",
                      text2: "Your college information has been saved.",
                    });
                  } catch (error) {
                    console.error("College details update failed:", error);
                    Toast.show({
                      type: "error",
                      text1: "Update Failed",
                      text2: "Please try again.",
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save & Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backButton: {
    fontSize: 16,
    color: "#000",
  },
  skipButton: {
    fontSize: 16,
    color: "#000",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  subHeader: {
    fontSize: 14,
    textAlign: "center",
    color: "#7C7C7C",
    marginVertical: 10,
  },
  divider: {
    height: 2,
    backgroundColor: "#C8A2C8",
    width: "50%",
    alignSelf: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 5,
    fontWeight: "500",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#F9F9F9",
  },
  picker: {
    height: 55,
    padding: 10,
  },
  errorText: {
    color: "#FF5C5C",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 14,
    color: "#000",
  },
  removeButton: {
    backgroundColor: "#FF5C5C",
    padding: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#1A1B1D",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#1A1B1D",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#F9F9F9",
  },
});

export default eligibilityForm;
