import { useRouter } from "expo-router";
import type React from "react";
import { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
export interface College {
  id: string;
  name: string;
  logo: string;
  location: string;
  type: "Private" | "Govt.";
  totalFees: string;
  isFollowing: boolean;
  cutoffYear: string;
  courses: string[];
}

export interface Filters {
  type: string | null;
  location: string | null;
  feesRange: string | null;
}

export const collegeData: College[] = [
  {
    id: "1",
    name: "SAL College of Engineering",
    logo: "https://v0.dev/placeholder.svg?height=40&width=40",
    location: "Ahmedabad",
    type: "Private",
    totalFees: "1.8 Lac. to 8.6 Lac.",
    isFollowing: true,
    cutoffYear: "24",
    courses: ["B.Tech", "M.Tech"],
  },
  {
    id: "2",
    name: "Karnavati University",
    logo: "https://v0.dev/placeholder.svg?height=40&width=40",
    location: "Ahmedabad",
    type: "Private",
    totalFees: "1.5 Lac to 4.8 Lac",
    isFollowing: false,
    cutoffYear: "24",
    courses: ["B.Tech", "MBA"],
  },
  {
    id: "3",
    name: "M.G. Science Institute",
    logo: "https://v0.dev/placeholder.svg?height=40&width=40",
    location: "Ahmedabad",
    type: "Govt.",
    totalFees: "7500 to 21000",
    isFollowing: true,
    cutoffYear: "24",
    courses: ["BSc", "MSc"],
  },
  {
    id: "4",
    name: "IIT Gandhinagar",
    logo: "https://v0.dev/placeholder.svg?height=40&width=40",
    location: "Gandhinagar",
    type: "Private",
    totalFees: "₹ 6,70,000",
    isFollowing: false,
    cutoffYear: "24",
    courses: ["B.Tech", "M.Tech", "PhD"],
  },
  {
    id: "5",
    name: "PDPU",
    logo: "https://v0.dev/placeholder.svg?height=40&width=40",
    location: "Gandhinagar",
    type: "Private",
    totalFees: "2.1 Lac to 9.2 Lac",
    isFollowing: true,
    cutoffYear: "24",
    courses: ["B.Tech", "MBA"],
  },
];

export const locations = ["Ahmedabad", "Gandhinagar", "Surat", "Vadodara"];
export const types = ["Private", "Govt."];
export const feesRanges = [
  "Under 1 Lac",
  "1-5 Lac",
  "5-10 Lac",
  "Above 10 Lac",
];

type FilterChipProps = {
  label: string;
  onPress: () => void;
  isActive: boolean;
  count?: number;
};

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  onPress,
  isActive,
  count,
}) => (
  <TouchableOpacity
    style={[styles.filterChip, isActive && styles.activeFilterChip]}
    onPress={onPress}
  >
    <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
      {label}
      {count !== undefined ? ` (${count})` : ""}
      {isActive ? " ✓" : " ▼"}
    </Text>
  </TouchableOpacity>
);

const ITEMS_PER_PAGE = 3;

export default function Preferences() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Saved">("All");
  const [filters, setFilters] = useState<Filters>({
    type: null,
    location: null,
    feesRange: null,
  });
  const [activeFilter, setActiveFilter] = useState<
    "type" | "location" | "feesRange" | null
  >(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const filteredColleges = useMemo(() => {
    let result = [...collegeData];

    // Filter by search
    if (searchText) {
      result = result.filter(
        (college) =>
          college.name.toLowerCase().includes(searchText.toLowerCase()) ||
          college.courses.some((course) =>
            course.toLowerCase().includes(searchText.toLowerCase())
          )
      );
    }

    // Filter by tab
    if (activeTab === "Saved") {
      result = result.filter((college) => college.isFollowing);
    }

    // Apply filters
    if (filters.type) {
      result = result.filter((college) => college.type === filters.type);
    }
    if (filters.location) {
      result = result.filter(
        (college) => college.location === filters.location
      );
    }
    if (filters.feesRange) {
      // Implement fees range filter logic here
    }

    return result;
  }, [searchText, activeTab, filters]);

  const displayedColleges = filteredColleges.slice(0, page * ITEMS_PER_PAGE);

  const loadMore = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  const FilterModal = ({
    type,
  }: {
    type: "type" | "location" | "feesRange";
  }) => {
    const options =
      type === "type" ? types : type === "location" ? locations : feesRanges;

    return (
      <Modal
        visible={activeFilter === type}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveFilter(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {type}</Text>
              <TouchableOpacity onPress={() => setActiveFilter(null)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.modalItem,
                    filters[type] === option && styles.modalItemActive,
                  ]}
                  onPress={() => {
                    setFilters((prev) => ({
                      ...prev,
                      [type]: prev[type] === option ? null : option,
                    }));
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      filters[type] === option && styles.modalItemTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                  {filters[type] === option && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image
            source={require("../../assets/icons/back-btn.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Image
            source={require("../../assets/icons/courses-inactive.png")}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            placeholder="Search colleges or courses..."
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Text style={styles.clearButton}>×</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView
        horizontal
        style={styles.filterContainer}
        showsHorizontalScrollIndicator={false}
      >
        <FilterChip
          label="Type"
          onPress={() => setActiveFilter("type")}
          isActive={!!filters.type}
        />
        <FilterChip
          label="Location"
          onPress={() => setActiveFilter("location")}
          isActive={!!filters.location}
        />
        <FilterChip
          label="Fees Range"
          onPress={() => setActiveFilter("feesRange")}
          isActive={!!filters.feesRange}
        />
      </ScrollView>

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>
          About {filteredColleges.length}+ Results
        </Text>
        <Text style={styles.resultSubtext}>For B.Tech in Colleges</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "All" && styles.activeTab]}
            onPress={() => setActiveTab("All")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "All" && styles.activeTabText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Saved" && styles.activeTab]}
            onPress={() => setActiveTab("Saved")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Saved" && styles.activeTabText,
              ]}
            >
              Saved
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.collegeList}>
        {displayedColleges.map((college) => (
          <TouchableOpacity
            key={college.id}
            style={styles.collegeCard}
            onPress={() => {
              return;
            }}
          >
            <View style={styles.collegeHeader}>
              <Image
                source={require("../../assets/icons/college-icon.png")}
                style={styles.collegeLogo}
              />
              <View style={styles.collegeInfo}>
                <Text style={styles.collegeName}>{college.name}</Text>
                <View style={styles.locationContainer}>
                  <Text style={styles.locationText}>{college.location}</Text>
                  <View style={styles.dot} />
                  <Text style={styles.typeText}>{college.type}</Text>
                </View>
                <Text style={styles.feesText}>
                  Total Fees: {college.totalFees}
                </Text>
                <View style={styles.coursesContainer}>
                  {college.courses.map((course, index) => (
                    <Text key={index} style={styles.courseTag}>
                      {course}
                    </Text>
                  ))}
                </View>
              </View>
              <TouchableOpacity>
                <Text
                  style={[
                    styles.followButton,
                    college.isFollowing && styles.followingButton,
                  ]}
                >
                  {college.isFollowing ? "Following" : "+Follow"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.cutoffButton}>
                <Text style={styles.cutoffButtonText}>
                  View Cutoff '{college.cutoffYear}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        {displayedColleges.length < filteredColleges.length && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={loadMore}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#2563eb" />
            ) : (
              <Text style={styles.loadMoreText}>Load More</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      <FilterModal type="type" />
      <FilterModal type="location" />
      <FilterModal type="feesRange" />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  clearButton: {
    fontSize: 24,
    color: "#666",
    padding: 4,
  },
  filterContainer: {
    position: "absolute",
    padding: 12,
    left: 0,
    top: 60,
    marginVertical: 10,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginHorizontal: 4,
  },
  activeFilterChip: {
    backgroundColor: "#EEF2FF",
    borderColor: "#7C3AED",
  },
  filterText: {
    fontSize: 14,
    color: "#374151",
  },
  activeFilterText: {
    color: "#7C3AED",
    fontWeight: "500",
  },
  resultHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 40,
  },
  resultCount: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 14,
  },
  resultSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTab: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  collegeList: {
    flex: 1,
  },
  collegeCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  collegeHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  collegeLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  collegeInfo: {
    flex: 1,
  },
  collegeName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#666",
    marginHorizontal: 8,
  },
  typeText: {
    fontSize: 14,
    color: "#666",
  },
  feesText: {
    fontSize: 14,
    color: "#666",
  },
  coursesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  courseTag: {
    fontSize: 12,
    color: "#2563eb",
    backgroundColor: "#e5edff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  followButton: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "500",
  },
  followingButton: {
    color: "#666",
  },
  cardActions: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },
  cutoffButton: {
    flex: 1,
  },
  cutoffButtonText: {
    color: "#2563eb",
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  loadMoreButton: {
    padding: 16,
    alignItems: "center",
  },
  loadMoreText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomNav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingBottom: isIOS ? 24 : 12,
    paddingTop: 12,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: isIOS ? 34 : 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalClose: {
    fontSize: 24,
    color: "#666",
    padding: 4,
  },
  modalList: {
    padding: 16,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
    color: "#374151",
  },
  modalItemActive: {
    backgroundColor: "#EEF2FF",
  },
  modalItemTextActive: {
    color: "#7C3AED",
    fontWeight: "500",
  },
  checkmark: {
    color: "#7C3AED",
    fontSize: 18,
    fontWeight: "600",
  },
});
