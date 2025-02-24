import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Linking,
} from "react-native";

export interface CollegeDetails {
  name: string;
  logo: string;
  isFollowing: boolean;
  type: string;
  location: string;
  about: {
    description: string;
    lastUpdated: string;
    expertise: string[];
    customSolutions: string[];
    contact: {
      website: string;
      phone: string;
      email: string;
    };
    stats: {
      employees: string;
      members: string;
    };
    headquarters: {
      city: string;
      state: string;
    };
    founded: string;
    specialties: string[];
  };
  otherDetails: {
    title: string;
    description: string;
    lastUpdated: string;
  };
  locations: {
    registeredOffice: {
      address: string;
      contact: {
        email: string;
        phone: string;
      };
    };
    headquarters: {
      address: string;
      contact: {
        email: string;
        phone: string;
      };
    };
  };
}

export type TabType = "Home" | "About" | "Reviews" | "Courses & Fees";

const collegeData: CollegeDetails = {
  name: "Karnavati University",
  logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Company%20About%20Us-p71ovc0Do5kah7bUwZFKC3sD4d1hoL.png",
  isFollowing: true,
  type: "Private",
  location: "Ahmedabad",
  about: {
    description:
      "Karnavati University is a center of academic excellence, committed to nurturing future leaders",
    lastUpdated: "25 Oct 24",
    expertise: [
      "Product Prototyping",
      "Design Engineering",
      "Software Development",
      "Web Application Development",
      "Mobile Application Development",
      "Front End Development",
    ],
    customSolutions: [
      "Inventory & Warehouse Solution",
      "Procurement Solution",
      "Maintenance & Service Solution",
      "Attendance Solution",
      "Financial Accounting Solution",
    ],
    contact: {
      website: "https://www.karnavatiuniversity.com/",
      phone: "+91 9898458585",
      email: "contact@business.com",
    },
    stats: {
      employees: "50+ 1,000 employees",
      members: "70+ associated members",
    },
    headquarters: {
      city: "Ahmedabad",
      state: "Gujarat",
    },
    founded: "2003",
    specialties: [
      "Mobile Application Development",
      "Web Development",
      "Quality Assurance Services",
      "IT Consultancy",
      "Enterprise IT Solutions",
      "IoT, Cloud & DevOps",
      "Data Science & Analytics",
      "Blockchain Development",
      "Frontend Development",
      "Product Prototyping",
    ],
  },
  otherDetails: {
    title: "Other Details",
    description:
      "Karnavati University is a private university established in 2017. Karnavati University comprises six constituent colleges that include the Unitedworld Institute of Design, Unitedworld School of Business, Unitedworld School of Liberal Arts & Mass Communication, Unitedworld School of Law, Unitedworld School of Computational Intelligence, and Karnavati School of Dentistry",
    lastUpdated: "25 Oct 24",
  },
  locations: {
    registeredOffice: {
      address:
        "D-152, Jaina Apartment\nNr. Suvidha Shopping,\nNirnaynagar,Prahladnagar,\nAhmedabad - 382481",
      contact: {
        email: "contact@business.com",
        phone: "+91 9898458585",
      },
    },
    headquarters: {
      address:
        "D-152, Jaina Support\nNr. Suvidha Data,\nNirnaynagar,Prahladnagar,\nAhmedabad - 382481",
      contact: {
        email: "contact@business.com",
        phone: "+91 9898458585",
      },
    },
  },
};

const collegeDetails = () => {
  const [activeTab, setActiveTab] = useState<TabType>("About");

  const handleApply = () => {
    // Handle apply action
  };

  const handleBrochure = () => {
    // Handle brochure download
  };

  const handleWebsiteLink = () => {
    Linking.openURL(collegeData.about.contact.website);
  };

  const renderAboutContent = () => (
    <View style={styles.aboutContent}>
      <Text style={styles.lastUpdated}>
        Last Updated on {collegeData.about.lastUpdated}
      </Text>

      <Text style={styles.description}>{collegeData.about.description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Expertise:</Text>
        {collegeData.about.expertise.map((item, index) => (
          <Text key={index} style={styles.listItem}>
            • {item}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customized Solutions:</Text>
        {collegeData.about.customSolutions.map((item, index) => (
          <Text key={index} style={styles.listItem}>
            • {item}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <TouchableOpacity onPress={handleWebsiteLink}>
          <Text style={styles.link}>
            Website: {collegeData.about.contact.website}
          </Text>
        </TouchableOpacity>
        <Text style={styles.contactInfo}>
          Phone: {collegeData.about.contact.phone}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Employees & Network</Text>
        <Text style={styles.stats}>{collegeData.about.stats.employees}</Text>
        <Text style={styles.stats}>{collegeData.about.stats.members}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Headquarters</Text>
        <Text style={styles.location}>
          {collegeData.about.headquarters.city},{" "}
          {collegeData.about.headquarters.state}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Founded</Text>
        <Text style={styles.founded}>{collegeData.about.founded}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specialties</Text>
        {collegeData.about.specialties.map((specialty, index) => (
          <Text key={index} style={styles.listItem}>
            • {specialty}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {collegeData.otherDetails.title}
        </Text>
        <Text style={styles.lastUpdated}>
          Last Updated on {collegeData.otherDetails.lastUpdated}
        </Text>
        <Text style={styles.description}>
          {collegeData.otherDetails.description}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Locations</Text>
        <Text style={styles.subTitle}>Registered Office</Text>
        <Text style={styles.address}>
          {collegeData.locations.registeredOffice.address}
        </Text>
        <Text style={styles.contactInfo}>
          {collegeData.locations.registeredOffice.contact.email}
        </Text>
        <Text style={styles.contactInfo}>
          {collegeData.locations.registeredOffice.contact.phone}
        </Text>

        <Text style={[styles.subTitle, styles.marginTop]}>Headquarter</Text>
        <Text style={styles.address}>
          {collegeData.locations.headquarters.address}
        </Text>
        <Text style={styles.contactInfo}>
          {collegeData.locations.headquarters.contact.email}
        </Text>
        <Text style={styles.contactInfo}>
          {collegeData.locations.headquarters.contact.phone}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require("../../assets/icons/back-btn.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.collegeHeader}>
          <Image source={{ uri: collegeData.logo }} style={styles.logo} />
          <View style={styles.collegeInfo}>
            <Text style={styles.collegeName}>{collegeData.name}</Text>
            <View style={styles.tagContainer}>
              <Text style={styles.tag}>Education & Learning</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.tag}>{collegeData.location}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.tag}>{collegeData.type}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.brochureButton}
            onPress={handleBrochure}
          >
            <Text style={styles.brochureButtonText}>Brochure</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
        >
          {(["Home", "About", "Reviews", "Courses & Fees"] as TabType[]).map(
            (tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        {activeTab === "About" && renderAboutContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  collegeHeader: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  collegeInfo: {
    flex: 1,
  },
  collegeName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  tag: {
    fontSize: 14,
    color: "#666",
  },
  dot: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 6,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  applyButtonText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "500",
  },
  brochureButton: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  brochureButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#2563eb",
    fontWeight: "500",
  },
  aboutContent: {
    padding: 16,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111",
  },
  listItem: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
    paddingLeft: 8,
  },
  link: {
    fontSize: 14,
    color: "#2563eb",
    textDecorationLine: "underline",
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  stats: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#444",
  },
  founded: {
    fontSize: 14,
    color: "#444",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333",
  },
  marginTop: {
    marginTop: 16,
  },
  address: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
});

export default collegeDetails;
