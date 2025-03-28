import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MqttContext } from './_layout'; 

export default function MotorControlScreen() {
  const mqttClient = useContext(MqttContext);

  const [motorStates, setMotorStates] = useState<{ motor1: boolean; motor2: boolean }>({
    motor1: false,
    motor2: false,
  });

  const toggleMotor = (motorKey: 'motor1' | 'motor2') => {
    if (!mqttClient || !mqttClient.connected) {
      console.warn('⚠️ MQTT Client is not connected');
      return;
    }

    const newState = !motorStates[motorKey];
    setMotorStates((prev) => ({ ...prev, [motorKey]: newState }));

    mqttClient.publish(`smartgrow/control/${motorKey}`, newState ? 'ON' : 'OFF', { qos: 1 });
  };

  return (
    <LinearGradient colors={['#E8F5E9', '#ffffff']} style={styles.container}>
      <Text style={styles.header}>⚙️ Motor Control</Text>

      <View style={styles.grid}>
        <MotorButton icon="engine" label="Motor 1 (pH Up)" motorKey="motor1" state={motorStates.motor1} toggle={toggleMotor} mqttClient={mqttClient} />
        <MotorButton icon="engine-outline" label="Motor 2 (pH Down)" motorKey="motor2" state={motorStates.motor2} toggle={toggleMotor} mqttClient={mqttClient} />
      </View>
    </LinearGradient>
  );
}

type MotorButtonProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  motorKey: 'motor1' | 'motor2';
  state: boolean;
  toggle: (key: 'motor1' | 'motor2') => void;
  mqttClient: any;
};

const MotorButton: React.FC<MotorButtonProps> = ({ icon, label, motorKey, state, toggle, mqttClient }) => (
  <TouchableOpacity onPress={() => toggle(motorKey)} style={[styles.card, state && styles.cardActive]}>
    <MaterialCommunityIcons name={icon} size={30} color={state ? '#ffffff' : '#1B5E20'} />
    <Text style={[styles.label, state && styles.labelActive]}>{label}</Text>
    <Text style={[styles.status, state && styles.statusActive]}>
      {mqttClient && mqttClient.connected ? (state ? 'ON' : 'OFF') : '🔌 Connecting...'}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', color: '#2E7D32', textAlign: 'center', marginBottom: 20 },
  grid: { flexDirection: 'row', justifyContent: 'space-evenly' },
  card: {
    width: '45%',
    backgroundColor: '#A5D6A7',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardActive: { backgroundColor: '#1B5E20' },
  label: { fontSize: 16, fontWeight: '600', color: '#1B5E20', marginTop: 5 },
  labelActive: { color: '#ffffff' },
  status: { fontSize: 20, fontWeight: 'bold', color: '#1B5E20', marginTop: 5 },
  statusActive: { color: '#ffffff' },
});
