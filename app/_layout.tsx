import React, { createContext, useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Platform, LogBox } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';


// ✅ Import MQTT for React Native Expo
import { connect } from 'mqtt/dist/mqtt';

// ✅ Create Context for MQTT and Sensor Data
export const MqttContext = createContext<any>(null);
export const SensorDataContext = createContext<any>(null);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [mqttClient, setMqttClient] = useState<any>(null);
  const [sensorData, setSensorData] = useState({
    ph: "--",
    tds: "--",
    waterlevel: "--",
    watertemp: "--",
    airtemp: "--",
    humidity: "--",
  });

  useEffect(() => {
    // ✅ Try WebSocket Secure Port 8084 (Check EMQX Dashboard)
    const client = connect('wss://bf35a8fa.ala.us-east-1.emqxsl.com:8084/mqtt', {
      username: 'Vedant',
      password: 'Password@562003',
      reconnectPeriod: 1000,  // Auto-reconnect every 1 sec
    });

    client.on('connect', () => {
      console.log('✅ MQTT Connected Successfully');
      
      // ✅ Subscribe to all required topics
      client.subscribe([
        'smartgrow/sensor/ph',
        'smartgrow/sensor/tds',
        'smartgrow/sensor/waterlevel',
        'smartgrow/sensor/watertemp',
        'smartgrow/sensor/airtemp',
        'smartgrow/sensor/humidity',
        'smartgrow/control/motor1',
        'smartgrow/control/motor2'
      ], (err) => {
        if (err) console.error('❌ MQTT Subscription Failed:', err);
      });
    });

    client.on('message', (topic, message) => {
      const value = message.toString();
      console.log(`📩 MQTT Message Received: ${topic} → ${value}`);

      // ✅ Handle Sensor Data
      if (topic.startsWith('smartgrow/sensor/')) {
        const sensorType = topic.replace('smartgrow/sensor/', '');
        setSensorData((prev) => ({
          ...prev,
          [sensorType]: isNaN(parseFloat(value)) ? value : parseFloat(value),
        }));
      }

      // ✅ Handle Motor Control Messages
      else if (topic === 'smartgrow/control/motor1' || topic === 'smartgrow/control/motor2') {
        console.log(`🚀 Motor Control Command: ${topic} → ${value}`);
      }
    });

    // ✅ Handle MQTT Errors
    client.on('error', (err:Error) => console.error('❌ MQTT Error:', err));
    client.on('close', () => console.log('🔌 MQTT Disconnected! Trying to Reconnect...'));

    setMqttClient(client);

    return () => {
      console.log("🔻 Disconnecting MQTT...");
      client.end();
    };
  }, []);

  return (
    <MqttContext.Provider value={mqttClient}>
      <SensorDataContext.Provider value={sensorData}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: { position: 'absolute' },
              default: {},
            }),
          }}>
          
          {/* ✅ Home Screen */}
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
          />

          {/* ✅ Sensor Data Screen */}
          <Tabs.Screen
            name="sensorData"
            options={{
              title: 'Sensor Data',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
            }}
          />

          {/* ✅ Motor Control Screen */}
          <Tabs.Screen
            name="motorControl"
            options={{
              title: 'Motor Control',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
            }}
          />

          {/* ✅ Camera Screen */}
          <Tabs.Screen
            name="camera"
            options={{
              title: 'Camera',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="camera.fill" color={color} />,
            }}
          />
          
        </Tabs>
      </SensorDataContext.Provider>
    </MqttContext.Provider>
  );
}
