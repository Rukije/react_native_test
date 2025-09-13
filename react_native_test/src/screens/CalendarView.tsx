
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date();

const events = [
  {
    title: 'Morning Yoga',
    time: '9 AM - 10 AM · 1 hr',
    type: 'Personal',
    color: '#f3f4f6',
    borderColor: '#d1d5db',
    textColor: '#64748b',
    labelColor: '#a3a3a3',
    people: [],
    hour: 8,
  },
  {
    title: 'Daily sync',
    time: '9 AM - 10 AM · 1 hr',
    type: 'Team meeting',
    color: '#e0e7ff',
    borderColor: '#6366f1',
    textColor: '#2563eb',
    labelColor: '#6366f1',
    people: ['../assets/icons/user.png', '../assets/icons/user.png', '../assets/icons/user.png'],
    hour: 9,
  },
  {
    title: 'Design review on PrimaVita p...',
    time: '10 AM - 10:30 AM · 30 m',
    type: '',
    color: '#18181b',
    borderColor: '#18181b',
    textColor: '#fff',
    labelColor: '#fff',
    people: ['../assets/icons/user.png', '../assets/icons/user.png'],
    hour: 10,
  },
  {
    title: 'Prepare product presentation for PrimaVita Project',
    time: '11 AM - 1 PM · 2 hr',
    type: '',
    color: '#fef9c3',
    borderColor: '#fde047',
    textColor: '#a16207',
    labelColor: '#a16207',
    people: ['../assets/icons/user.png', '../assets/icons/user.png', '../assets/icons/user.png'],
    hour: 11,
  },
];

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Calendar: undefined;
};

const tabData = [
  { key: 'home', icon: require('../assets/icons/home.png'), label: 'Home' },
  { key: 'calendar', icon: require('../assets/icons/schedule.png'), label: 'Calendar' },
  { key: 'add', icon: '+', label: '' },
  { key: 'profile', icon: require('../assets/icons/user.png'), label: 'Profile' },
];

const CalendarView: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Generate 7 days for the horizontal bar
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentYear, currentMonth, selectedDate - today.getDay() + i);
    return d;
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalDateBar} contentContainerStyle={{paddingHorizontal: 8}}>
        {week.map((date, i) => {
          const isSelected = date.getDate() === selectedDate && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.datePill, isSelected && styles.datePillSelected]}
              onPress={() => setSelectedDate(date.getDate())}
            >
              <Text style={[styles.datePillDay, isSelected && styles.datePillDaySelected]}>{weekDays[date.getDay()]}</Text>
              <Text style={[styles.datePillNum, isSelected && styles.datePillNumSelected]}>{date.getDate()}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {/* Timeline */}
      <ScrollView style={styles.timelineScroll} contentContainerStyle={{paddingBottom: 32}}>
        {[8,9,10,11].map(hour => {
          const event = events.find(e => e.hour === hour);
          return (
            <View key={hour} style={styles.timelineRow}>
              <Text style={styles.timelineHour}>{hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour-12} PM`}</Text>
              {event ? (
                <View style={[styles.eventCard, {backgroundColor: event.color, borderColor: event.borderColor}]}> 
                  <Text style={[styles.eventTitle, {color: event.textColor}]}>{event.title}</Text>
                  <View style={styles.eventMetaRow}>
                    <Text style={[styles.eventTime, {color: event.labelColor}]}>{event.time}</Text>
                    {event.type ? <Text style={[styles.eventType, {color: event.labelColor}]}>{event.type}</Text> : null}
                  </View>
                  {event.people.length > 0 && (
                    <View style={styles.eventPeopleRow}>
                      {event.people.map((p, i) => (
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
      <View style={styles.pillNavbarBottom}>
        <View style={styles.pillNavbar}>
          {tabData.map((tab, idx) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.pillTab,
                activeTab === tab.key && styles.pillTabActive,
                tab.key === 'add' && styles.pillTabAdd
              ]}
              onPress={() => {
                if (tab.key === 'add') {
                  // No modal for calendar, do nothing
                } else if (tab.key === 'profile') {
                  navigation.navigate('Profile');
                  setActiveTab(tab.key);
                } else if (tab.key === 'calendar') {
                  navigation.navigate('Calendar');
                  setActiveTab(tab.key);
                } else if (tab.key === 'home') {
                  navigation.navigate('Home');
                  setActiveTab(tab.key);
                } else {
                  setActiveTab(tab.key);
                }
              }}
              activeOpacity={0.8}
            >
              {tab.key === 'add' ? (
                <Text style={[styles.pillTabIcon, { color: '#fff' }]}>+</Text>
              ) : (
                <Image
                  source={tab.icon}
                  style={[
                    styles.pillTabIcon,
                    activeTab === tab.key ? styles.pillTabIconActive : { tintColor: '#2563eb' }
                  ]}
                  resizeMode="contain"
                />
              )}
              {activeTab === tab.key && tab.key !== 'add' && (
                <Text style={styles.pillTabLabel}>{tab.label}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    minWidth: 48,
  },
  datePillSelected: {
    backgroundColor: '#6366f1',
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
    fontSize: 18,
    marginTop: 2,
  },
  datePillNumSelected: {
    color: '#fff',
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
