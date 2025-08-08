import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import res from './src/components/Res';
import { SIZES } from './src/components/theme';

 
const App = () => {
  const prayersData = [
    { name: 'Fajr', startTime: null, endTime: null },
    { name: 'Zuhar', startTime: null, endTime: null },
    { name: 'Asar', startTime: null, endTime: null },
    { name: 'Maghrib', startTime: null, endTime: null },
    { name: 'Isha', startTime: null, endTime: null },
  ];
  const [prayers, setPrayers] = useState(prayersData);

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

  
  const handleTimeChange = (event, selectedTime) => {
    setShowPicker(false);
    if (!selectedTime || selectedPrayerIndex === null) return;

    const updatedPrayers = [...prayers];

    if (pickerType === 'start') {
      // set start
      updatedPrayers[selectedPrayerIndex].startTime = selectedTime;

      // auto end +30 min if none set
      const existingEnd = updatedPrayers[selectedPrayerIndex].endTime;
      const autoEnd = existingEnd || new Date(selectedTime.getTime() + 30 * 60000);
      updatedPrayers[selectedPrayerIndex].endTime = autoEnd;
 
 
    } else {
      // set end
      updatedPrayers[selectedPrayerIndex].endTime = selectedTime;
 
     
    }

    setPrayers(updatedPrayers);
    savePrayersTime(updatedPrayers);
  };

  const savePrayersTime = async data => {
    try {
      await AsyncStorage.setItem('PRAYERS', JSON.stringify(data));
      console.log('Saved to async storage');
    } catch (err) {
      console.log('There is an error while saving');
    }
  };

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

  useEffect(() => {
    const loadPrayerFromStorage = async () => {
      try {
        const stored = await AsyncStorage.getItem('PRAYERS');
        if (stored) {
          const parsed = JSON.parse(stored);
          const restored = parsed.map(prayer => ({
            ...prayer,
            startTime: prayer.startTime ? new Date(prayer.startTime) : null,
            endTime: prayer.endTime ? new Date(prayer.endTime) : null,
          }));
          setPrayers(restored);
          console.log('Loaded saved namaz times');
        }
      } catch (err) {
        console.log('Error while fetching from AsyncStorage');
      }
    };
    loadPrayerFromStorage();
  }, []);

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
              value={new Date()}
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
