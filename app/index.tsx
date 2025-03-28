import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#E8F5E9', '#ffffff']} style={styles.container}>
        {/* App Heading */}
        <Text style={styles.header}>🌱 Smart Grow</Text>

        {/* Navigation Buttons */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/sensorData')}
        >
          <Text style={styles.buttonText}>📊 Sensor Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/motorControl')}
        >
          <Text style={styles.buttonText}>⚙️ Motor Control</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/camera')}
        >
          <Text style={styles.buttonText}>📷 Camera</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32', // Deep green for contrast
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#A5D6A7',
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
  },
  buttonText: {
    color: '#1B5E20',
    fontSize: 18,
    fontWeight: '600',
  },
});