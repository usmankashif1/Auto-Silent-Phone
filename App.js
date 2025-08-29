import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SIZES } from './src/components/theme';
import res from './src/components/Res';

import { ensureNotificationPermission } from './src/services/permissions';
import {
  scheduleStartEnd,
  cancelAllScheduled,
} from './src/services/NotificationScheduler';
import { startDndService } from './src/services/DndServiceStarter';

const App = () => {
  const [prayers, setPrayers] = useState([
    { name: 'Fajr', startTime: null, endTime: null },
    { name: 'Zuhar', startTime: null, endTime: null },
    { name: 'Asar', startTime: null, endTime: null },
    { name: 'Maghrib', startTime: null, endTime: null },
    { name: 'Isha', startTime: null, endTime: null },
  ]);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState('start');
  const [selectedPrayerIndex, setSelectedPrayerIndex] = useState(null);

  const formatTime = time => {
    if (!time || !(time instanceof Date)) return '- -';
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const amPm = hours >= 12 ? 'Pm' : 'Am';
    const adjustedHours = hours % 12 || 12;
    const h = String(adjustedHours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    return `${h}:${m} ${amPm}`;
  };

  const savePrayersTime = async data => {
    try {
      const formatted = data.map(prayer => ({
        ...prayer,
        startTime: prayer.startTime ? prayer.startTime.toISOString() : null,
        endTime: prayer.endTime ? prayer.endTime.toISOString() : null,
      }));
      await AsyncStorage.setItem('PRAYERS', JSON.stringify(formatted));
      console.log('Saved PRAYERS to AsyncStorage');
    } catch (err) {
      console.log('Error saving PRAYERS', err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await ensureNotificationPermission();

        const stored = await AsyncStorage.getItem('PRAYERS');
        if (stored) {
          const parsed = JSON.parse(stored);
          const restored = parsed.map(prayerData => ({
            ...prayerData,
            startTime: prayerData.startTime
              ? new Date(prayerData.startTime)
              : null,
            endTime: prayerData.endTime ? new Date(prayerData.endTime) : null,
          }));
          setPrayers(restored);

          await cancelAllScheduled();
          for (const pr of restored) {
            if (pr.startTime && pr.endTime) {
              await scheduleStartEnd(pr.name, pr.startTime, pr.endTime);
            }
          }
          console.log('Loaded & scheduled saved prayer times');
        }
      } catch (e) {
        console.warn('Init error', e);
      }
    })();

(async () => {
    await ensureNotificationPermission();
    startDndService(); // Start the foreground service
  })();

  }, []);

  const handleStart = index => {
    setPickerType('start');
    setShowPicker(true);
    setSelectedPrayerIndex(index);
  };

  const handleEnd = index => {
    setPickerType('end');
    setShowPicker(true);
    setSelectedPrayerIndex(index);
  };

  const handleTimeChange = async (event, selectedTime) => {
    setShowPicker(false);
    if (!selectedTime || selectedPrayerIndex === null) return;
    if (
      (event.type && event.type === 'dismissed') || 
      selectedTime === undefined  
    )
      return;
    const updated = [...prayers];
    if (pickerType === 'start') {
      updated[selectedPrayerIndex].startTime = selectedTime;
      const autoEnd = new Date(selectedTime.getTime() + 30 * 60000);
      updated[selectedPrayerIndex].endTime = autoEnd;
    } else {
      updated[selectedPrayerIndex].endTime = selectedTime;
    }
    setPrayers(updated);

    await savePrayersTime(updated);

    await cancelAllScheduled();
    for (const pr of updated) {
      if (pr.startTime && pr.endTime) {
        await scheduleStartEnd(pr.name, pr.startTime, pr.endTime);
      }
    }
    console.log('Re-scheduled after time change');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.overlay}>
        <Text style={styles.appTitle}>🕌 Namaz Mode</Text>

        <ScrollView
          contentContainerStyle={{ marginBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {prayers.map((item, index) => (
            <View style={styles.namazCard} key={index}>
              <Text style={styles.namazName}>{item.name}</Text>

              <TouchableOpacity
                style={styles.timeBox}
                onPress={() => handleStart(index)}
              >
                <Text style={styles.timeLabel}>Start Time</Text>
                <Text style={styles.timeValue}>
                  {formatTime(item.startTime)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.timeBox}
                onPress={() => handleEnd(index)}
              >
                <Text style={styles.timeLabel}>End Time</Text>
                <Text style={styles.timeValue}>{formatTime(item.endTime)}</Text>
              </TouchableOpacity>
            </View>
          ))}

          {showPicker && (
            <DateTimePicker
              mode="time"
              value={
                pickerType === 'start'
                  ? prayers[selectedPrayerIndex].startTime || new Date()
                  : prayers[selectedPrayerIndex].endTime || new Date()
              }
              onChange={handleTimeChange}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'white',
    padding: res.padding(15),
  },
  appTitle: {
    fontSize: SIZES.h1 + 6,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: res.margin(20),
  },
  namazCard: {
    backgroundColor: 'white',
    borderRadius: res.borderRadius(15),
    padding: res.padding(15),
    marginBottom: res.margin(15),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  namazName: {
    fontSize: SIZES.h2 + 2,
    fontWeight: 'bold',
    color: '#16a085',
    marginBottom: res.margin(10),
  },
  timeBox: {
    width: '90%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: res.padding(10),
    marginVertical: res.margin(5),
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: SIZES.h3,
    color: '#34495e',
  },
  timeValue: {
    fontSize: SIZES.h3 + 1,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 4,
  },
});
