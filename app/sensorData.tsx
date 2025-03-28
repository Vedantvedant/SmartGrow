import React, { useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SensorDataContext } from '@/app/_layout';

export default function SensorData() {
  const sensorData = useContext(SensorDataContext);
  
  return (
    <LinearGradient colors={['#E8F5E9', '#ffffff']} style={styles.container}>
      <Text style={styles.header}>📊 Sensor Dashboard</Text>

      <View style={styles.grid}>
        <SensorCard icon="test-tube" label="pH Level" value={sensorData.ph} unit="" />
        <SensorCard icon="water" label="TDS" value={sensorData.tds} unit="ppm" />
        <SensorCard icon="coolant-temperature" label="Water Temp" value={sensorData.watertemp} unit="°C" />
        <SensorCard icon="water-percent" label="Water Level" value={sensorData.waterlevel} unit="%" />
        <SensorCard icon="thermometer" label="Air Temp" value={sensorData.airtemp} unit="°C" />
        <SensorCard icon="water-outline" label="Humidity" value={sensorData.humidity} unit="%" />
      </View>

      {!sensorData.ph && <ActivityIndicator size="large" color="#2E7D32" />}
    </LinearGradient>
  );
}

type SensorCardProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: number | null;
  unit: string;
};

const SensorCard: React.FC<SensorCardProps> = ({ icon, label, value, unit }) => (
  <View style={styles.card}>
    <MaterialCommunityIcons name={icon} size={30} color="#1B5E20" />
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value !== null ? `${value}${unit}` : '---'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#A5D6A7',
    padding: 15,
    marginVertical: 8,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
    marginTop: 5,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 5,
  },
});