import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";

if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}
global.__ExpoImportMetaRegistry = { get: () => ({}), set: () => {} };


// Expo Notifications
jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve()), // 🔑 Mock funksioni
  AndroidImportance: { MAX: 4 },
  setNotificationChannelAsync: jest.fn(),
}));

// AuthContext
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: "test-user" } }),
}));

// Firebase
jest.mock("../../firebase", () => ({
  auth: {
    currentUser: {
      uid: "test-user",
      email: "test@test.com",
    },
  },
  db: {},
}));

// NotifCard
jest.mock(
  "../../components/NotifCard",
  () => {
    const { Text } = require("react-native");
    return ({ item }) => <Text>{item?.title || "No Title"}</Text>;
  },
  { virtual: true }
);

// Firestore
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => true,
      data: () => ({ notificationsEnabled: true }),
    })
  ),
  onSnapshot: jest.fn((q, cb) => {
    cb({
      docs: [
        {
          id: "1",
          data: () => ({
            title: "Test Recipe",
            scheduledAt: { toDate: () => new Date() },
          }),
        },
      ],
    });
    return () => {};
  }),
  setDoc: jest.fn(() => Promise.resolve()), 
}));

import NotificationsScreen from "../(tabs)/profile/notifications";

describe("NotificationsScreen", () => {
  it("shfaq listën e njoftimeve", async () => {
    const { getByText, getByRole } = render(<NotificationsScreen />);

    const switchElement = getByRole("switch");
    fireEvent(switchElement, "valueChange", true);

    await waitFor(() => {
      expect(getByText("Test Recipe")).toBeTruthy();
    });
  });

  it("shfaq mesazhin No items yet kur lista është bosh", async () => {
    const firestore = require("firebase/firestore");

    firestore.onSnapshot.mockImplementationOnce((q, cb) => {
      cb({ docs: [] });
      return () => {};
    });

    const { getByText, getByRole } = render(<NotificationsScreen />);

    const switchElement = getByRole("switch");
    fireEvent(switchElement, "valueChange", true);

    await waitFor(() => {
      expect(getByText("No items yet!")).toBeTruthy();
    });
  });
});
