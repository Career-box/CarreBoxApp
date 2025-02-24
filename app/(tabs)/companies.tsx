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
} from "react-native";
export interface Company {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  isVerified: boolean;
  services: string[];
  isFollowing: boolean;
}

export interface Filter {
  services: string[];
  location: string | null;
  priceRange: string | null;
}

type FilterChipProps = {
  label: string;
  onPress: () => void;
  isActive: boolean;
  count?: number;
};

export const companies: Company[] = Array.from({ length: 8 }, (_, i) => ({
  id: `company-${i + 1}`,
  name: "MAAC INDIA Solution",
  image: "https://v0.dev/placeholder.svg?height=80&width=80",
  location: "Andheri East, Mumbai",
  rating: 4.8,
  isVerified: true,
  services: [
    "Laptop Parts",
    "Computer Parts",
    "Router Parts",
    "Workstations",
    "Laptop Charger",
  ],
  isFollowing: i % 2 === 0,
}));

export const serviceOptions = [
  "Laptop Parts",
  "Computer Parts",
  "Router Parts",
  "Workstations",
  "Laptop Charger",
  "Repair Services",
  "Data Recovery",
];

export const locationOptions = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
];

export const priceRangeOptions = [
  "Under ₹1000",
  "₹1000-₹5000",
  "₹5000-₹10000",
  "Above ₹10000",
];

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
      {count ? ` (${count})` : ""}
      {isActive ? " ✓" : " ▼"}
    </Text>
  </TouchableOpacity>
);

export default function Companies() {
  const [searchText, setSearchText] = useState("Laptop");
  const [activeTab, setActiveTab] = useState<"All" | "Saved">("All");
  const [filters, setFilters] = useState<Filter>({
    services: [],
    location: null,
    priceRange: null,
  });
  const [activeFilter, setActiveFilter] = useState<
    "services" | "location" | "priceRange" | null
  >(null);

  const filteredCompanies = useMemo(() => {
    let result = [...companies];

    // Filter by search
    if (searchText) {
      result = result.filter(
        (company) =>
          company.name.toLowerCase().includes(searchText.toLowerCase()) ||
          company.services.some((service) =>
            service.toLowerCase().includes(searchText.toLowerCase())
          )
      );
    }

    // Filter by tab
    if (activeTab === "Saved") {
      result = result.filter((company) => company.isFollowing);
    }

    // Apply filters
    if (filters.services.length > 0) {
      result = result.filter((company) =>
        filters.services.some((service) => company.services.includes(service))
      );
    }
    if (filters.location) {
      result = result.filter((company) =>
        company.location.includes(filters.location!)
      );
    }

    return result;
  }, [searchText, activeTab, filters]);

  const FilterModal = ({
    type,
  }: {
    type: "services" | "location" | "priceRange";
  }) => {
    const options =
      type === "services"
        ? serviceOptions
        : type === "location"
        ? locationOptions
        : priceRangeOptions;

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
                    type === "services"
                      ? filters.services.includes(option) &&
                        styles.modalItemActive
                      : filters[type] === option && styles.modalItemActive,
                  ]}
                  onPress={() => {
                    if (type === "services") {
                      setFilters((prev) => ({
                        ...prev,
                        services: prev.services.includes(option)
                          ? prev.services.filter((s) => s !== option)
                          : [...prev.services, option],
                      }));
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        [type]: prev[type] === option ? null : option,
                      }));
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      type === "services"
                        ? filters.services.includes(option) &&
                          styles.modalItemTextActive
                        : filters[type] === option &&
                          styles.modalItemTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                  {type === "services" ? (
                    filters.services.includes(option)
                  ) : filters[type] === option ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : null}
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
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require("../../assets/icons/back-btn.png")}
            style={styles.headerIcon}
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
            placeholder="Search services..."
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
        showsHorizontalScrollIndicator={true}
      >
        <FilterChip
          label="Services"
          onPress={() => setActiveFilter("services")}
          isActive={filters.services.length > 0}
          count={filters.services.length}
        />
        <FilterChip
          label="Location"
          onPress={() => setActiveFilter("location")}
          isActive={!!filters.location}
        />
        <FilterChip
          label="Price Range"
          onPress={() => setActiveFilter("priceRange")}
          isActive={!!filters.priceRange}
        />
      </ScrollView>

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>
          About {filteredCompanies.length}+ Results
        </Text>
        <Text style={styles.resultSubtext}>For Laptop</Text>
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

      <ScrollView style={styles.companyList}>
        {filteredCompanies.map((company) => (
          <View key={company.id} style={styles.companyCard}>
            <View style={styles.companyHeader}>
              <View style={styles.companyImageContainer}>
                {/* source={{ uri: company.image }} */}
                <Image
                  source={require("../../assets/icons/college-icon.png")}
                  style={styles.companyImage}
                />
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {company.rating}</Text>
                </View>
              </View>
              <View style={styles.companyInfo}>
                <View style={styles.companyTitleRow}>
                  <Text style={styles.companyName}>{company.name}</Text>
                  <TouchableOpacity>
                    <Text style={styles.followButton}>
                      {company.isFollowing ? "Following" : "+Follow"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.locationRow}>
                  <Image
                    source={{
                      uri: "https://v0.dev/placeholder.svg?height=16&width=16",
                    }}
                    style={styles.locationIcon}
                  />
                  <Text style={styles.locationText}>{company.location}</Text>
                </View>
                {company.isVerified && (
                  <View style={styles.verifiedRow}>
                    <Image
                      source={{
                        uri: "https://v0.dev/placeholder.svg?height=16&width=16",
                      }}
                      style={styles.verifiedIcon}
                    />
                    <Text style={styles.verifiedText}>
                      Trusted & Verified Seals
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <ScrollView
              horizontal
              style={styles.serviceTagsContainer}
              showsHorizontalScrollIndicator={false}
            >
              {company.services.map((service, index) => (
                <View
                  key={index}
                  style={[
                    styles.serviceTag,
                    index % 2 === 0 ? styles.primaryTag : styles.secondaryTag,
                  ]}
                >
                  <Text
                    style={[
                      styles.serviceTagText,
                      index % 2 === 0
                        ? styles.primaryTagText
                        : styles.secondaryTagText,
                    ]}
                  >
                    {service}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.quoteButton}>
                <Text style={styles.quoteButtonText}>Get Quote</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.callButton}>
                <Text style={styles.callButtonText}>Call now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <FilterModal type="services" />
      <FilterModal type="location" />
      <FilterModal type="priceRange" />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={{
              uri: "https://v0.dev/placeholder.svg?height=24&width=24",
            }}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={{
              uri: "https://v0.dev/placeholder.svg?height=24&width=24",
            }}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={{
              uri: "https://v0.dev/placeholder.svg?height=24&width=24",
            }}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={{
              uri: "https://v0.dev/placeholder.svg?height=24&width=24",
            }}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
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
    padding: 4,
  },
  headerIcon: {
    width: 28,
    height: 28,
    // marginRight: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginLeft: 12,
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
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    position: "absolute",
    top: 60,
    // left: 60,
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
  filterIcon: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  resultHeader: {
    marginTop: 40,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultCount: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "bold",
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
  companyList: {
    flex: 1,
  },
  companyCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  companyHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  companyImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  companyImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  ratingBadge: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    transform: [{ translateX: -20 }],
    backgroundColor: "#7C3AED",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  companyInfo: {
    flex: 1,
  },
  companyTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "500",
  },
  followButton: {
    color: "#2563EB",
    fontSize: 14,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 14,
    color: "#666",
  },
  serviceTagsContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  serviceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  primaryTag: {
    backgroundColor: "#F3F4F6",
  },
  secondaryTag: {
    backgroundColor: "#E5E7EB",
  },
  serviceTagText: {
    fontSize: 12,
  },
  primaryTagText: {
    color: "#374151",
  },
  secondaryTagText: {
    color: "#4B5563",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  quoteButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  quoteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  callButton: {
    flex: 1,
    backgroundColor: "#1E293B",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  callButtonText: {
    color: "#fff",
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
