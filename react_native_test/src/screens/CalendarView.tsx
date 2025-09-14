import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../components/Navbar'; // <-- Add this import

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date();

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Calendar: undefined;
};

const CalendarView: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<any[]>([]);

  // Fetch events from AsyncStorage
  useEffect(() => {
    const fetchEvents = async () => {
      const storedEvents = await AsyncStorage.getItem('userEvents');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    };
    fetchEvents();
  }, []);

  // Get number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Generate all days for the current month
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(currentYear, currentMonth, i + 1);
  });

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerMonth}>{monthNames[currentMonth]} {currentYear}</Text>
        <TouchableOpacity style={styles.headerSearchBtn}>
          <Image source={require('../assets/icons/calendar.png')} style={styles.headerSearchIcon} />
        </TouchableOpacity>
      </View>
      {/* Horizontal Date Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalDateBar}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {monthDays.map((date, i) => {
          const isSelected =
            date.getDate() === selectedDate &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.datePill, isSelected && styles.datePillSelected]}
              onPress={() => {
                setSelectedDate(date.getDate());
                setCurrentMonth(date.getMonth());
                setCurrentYear(date.getFullYear());
              }}
            >
              <View style={styles.datePillContent}>
                <Text style={[styles.datePillDay, isSelected && styles.datePillDaySelected]}>
                  {weekDays[date.getDay()]}
                </Text>
                <Text
                  style={[
                    styles.datePillNum,
                    isSelected && styles.datePillNumSelected,
                    { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
                  ]}
                >
                  {date.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {/* Timeline */}
      <ScrollView style={styles.timelineScroll} contentContainerStyle={{paddingBottom: 32}}>
        {Array.from({ length: 11 }, (_, i) => i + 8).map(hour => {
          const event = events.find(e =>
            e.day === selectedDate &&
            e.month === currentMonth &&
            e.year === currentYear &&
            parseInt(e.time.split(':')[0]) === hour
          );
          return (
            <View key={hour} style={styles.timelineRow}>
              <Text style={styles.timelineHour}>{hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour-12} PM`}</Text>
              {event ? (
                <View style={[styles.eventCard, {backgroundColor: event.color}]}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventMetaRow}>
                    <Text style={styles.eventTime}>{event.time}</Text>
                    {event.priority && event.priority !== 'None' && (
                      <View style={{
                        marginLeft: 8,
                        backgroundColor: 
                          event.priority === 'Top Priority' ? '#ef4444' :
                          event.priority === 'Urgent' ? '#f59e42' :
                          event.priority === 'Critical Event' ? '#6366f1' :
                          '#e0e7ff',
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{event.priority}</Text>
                      </View>
                    )}
                  </View>
                  {event.people.length > 0 && (
                    <View style={styles.eventPeopleRow}>
                      {event.people.map((_: string, i: number) => (
                        <Image key={i} source={require('../assets/icons/user.png')} style={styles.eventPersonAvatar} />
                      ))}
                      {event.people.length > 3 && (
                        <View style={styles.eventMorePeople}><Text style={styles.eventMorePeopleText}>+{event.people.length - 3}</Text></View>
                      )}
                    </View>
                  )}
                </View>
              ) : <View style={styles.eventCardPlaceholder} />}
            </View>
          );
        })}
      </ScrollView>
      {/* Modern pill-shaped navbar at bottom */}
      <Navbar activeTab="calendar" />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  headerMonth: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    letterSpacing: 1,
    textAlign: 'left',
    textShadowColor: '#e0e7ff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  headerSearchBtn: {
    backgroundColor: '#e0e7ff',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSearchIcon: {
    width: 28,
    height: 28,
    tintColor: '#6366f1',
  },
  horizontalDateBar: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 2,
    paddingVertical: 4,
  },
  datePill: {
    backgroundColor: '#f3f4f6',
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center', 
    marginHorizontal: 4,
    minWidth: 48,
  },
  datePillSelected: {
    backgroundColor: '#6366f1',
  },
  datePillContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '30%',
  },
  datePillDay: {
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 14,
  },
  datePillDaySelected: {
    color: '#fff',
  },
  datePillNum: {
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 20, 
    marginTop: 4,
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  datePillNumSelected: {
    color: '#fff',
    textShadowColor: '#6366f1',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  timelineScroll: {
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  timelineHour: {
    width: 60,
    color: '#a3a3a3',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
  },
  eventCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    marginRight: 10,
    minWidth: 150,
    shadowColor: '#6366f1',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  eventTitle: { fontWeight: 'bold', fontSize: 16, color: '#2563eb' },
  eventMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 },
  eventTime: { color: '#64748b', fontSize: 14, marginRight: 8 },
  eventType: { color: '#6366f1', fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
  eventPeopleRow: { flexDirection: 'row', marginTop: 8 },
  eventPersonAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  eventMorePeople: {
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  eventMorePeopleText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 13,
  },
  eventCardPlaceholder: {
    flex: 1,
    minHeight: 60,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginRight: 10,
  },
  pillNavbarBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    paddingBottom: 8,
  },
  pillNavbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#6366f1',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  pillTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginHorizontal: 4,
    backgroundColor: 'transparent',
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
  },
  pillTabActive: {
    backgroundColor: '#e0e7ff',
    borderWidth: 2,
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  pillTabAdd: {
    backgroundColor: '#6366f1',
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 8,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
  },
  pillTabIcon: {
    width: 32,
    height: 32,
    tintColor: '#2563eb',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 22,
    backgroundColor: 'transparent',
    marginRight: 0,
  },
  pillTabIconActive: {
    tintColor: '#6366f1',
  },
  pillTabLabel: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default CalendarView;
