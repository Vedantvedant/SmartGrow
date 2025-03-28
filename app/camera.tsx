import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import * as Network from "expo-network";

const CAMERA_IP = "http://192.168.83.112"; // Change if needed

const CameraScreen = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const checkConnection = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected ?? false);
      setLoading(false);
    };

    checkConnection();

    // Update time every second
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="green" />
        <Text>Checking network connection...</Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.centered}>
        <Text>No internet connection. Connect to ESP32 network.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📷 Live Camera Feed</Text>
      
      <View style={styles.videoContainer}>
        <WebView source={{ uri: CAMERA_IP }} style={styles.webview} />
      </View>

      <Text style={styles.timestamp}>🕒 {currentTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 15,
  },
  videoContainer: {
    width: "95%", // ✅ Increased width
    height: 350,  // ✅ Increased height
    backgroundColor: "#000",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#2E7D32",
    elevation: 5,
  },
  webview: {
    flex: 1,
  },
  timestamp: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#1B5E20",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default CameraScreen;
