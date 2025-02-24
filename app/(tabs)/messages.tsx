import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";

export const messages: Message[] = Array.from({ length: 10 }, (_, i) => ({
  id: `msg-${i + 1}`,
  sender: {
    id: `user-${i + 1}`,
    name: "Bhargav Patel",
    avatar: "https://v0.dev/placeholder.svg?height=48&width=48",
    organization: "SAL College",
    isOnline: true,
  },
  preview: "Feel this form & Re-Send it!",
  timestamp: "10:38 AM",
  unreadCount: 382,
  isUnread: i < 5, // First 5 messages are unread
  isGroup: i % 3 === 0, // Every third message is a group
}));

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    organization: string;
    isOnline: boolean;
  };
  preview: string;
  timestamp: string;
  unreadCount: number;
  isUnread: boolean;
  isGroup: boolean;
}

type FilterType = "All" | "Unread" | "Groups";

export default function Messages() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Unread");

  const filteredMessages = useMemo(() => {
    switch (activeFilter) {
      case "Unread":
        return messages.filter((msg) => msg.isUnread);
      case "Groups":
        return messages.filter((msg) => msg.isGroup);
      default:
        return messages;
    }
  }, [activeFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require("../../assets/icons/back-btn.png")}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Image
              source={{
                uri: "https://v0.dev/placeholder.svg?height=24&width=24",
              }}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Image
              source={{
                uri: "https://v0.dev/placeholder.svg?height=24&width=24",
              }}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {(["All", "Unread", "Groups"] as FilterType[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chatSection}>
        <Text style={styles.sectionTitle}>CHATS</Text>
        <ScrollView style={styles.messageList}>
          {filteredMessages.map((message) => (
            <TouchableOpacity key={message.id} style={styles.messageItem}>
              <View style={styles.avatarContainer}>
                {/* source={{ uri: message.sender.avatar }} */}
                <Image
                  source={require("../../assets/icons/user-icon.png")}
                  style={styles.avatar}
                />
                {message.sender.isOnline && (
                  <View style={styles.onlineIndicator} />
                )}
              </View>
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <View style={styles.senderInfo}>
                    <Text style={styles.senderName}>{message.sender.name}</Text>
                    <Text style={styles.organizationText}>
                      {message.sender.organization}
                    </Text>
                  </View>
                  <Text style={styles.timestamp}>{message.timestamp}</Text>
                </View>
                <View style={styles.messagePreview}>
                  <Image
                    source={{
                      uri: "https://v0.dev/placeholder.svg?height=16&width=16",
                    }}
                    style={styles.previewIcon}
                  />
                  <Text style={styles.previewText} numberOfLines={1}>
                    {message.preview}
                  </Text>
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>
                      {message.unreadCount}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Image
            source={{
              uri: "https://v0.dev/placeholder.svg?height=24&width=24",
            }}
            style={[styles.navIcon, styles.activeNavIcon]}
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
    width: 30,
    height: 30,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: "row",
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  activeFilterButton: {
    backgroundColor: "#7C3AED",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "500",
  },
  chatSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: "absolute",
    top: 30,
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#fff",
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  senderInfo: {
    flex: 1,
    marginRight: 8,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  organizationText: {
    fontSize: 14,
    color: "#2563EB",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  messagePreview: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  previewText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
  },
  unreadCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
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
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: "#7C3AED",
    marginTop: -2,
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  activeNavIcon: {
    tintColor: "#7C3AED",
  },
});
