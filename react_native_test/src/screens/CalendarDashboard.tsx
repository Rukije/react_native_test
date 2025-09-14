import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal, TextInput, Image } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const today = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type EventType = {
  title: string;
  time: string;
  people: string[];
  color: string;
  day: number;
  month: number;
  year: number;
  createdBy?: string;
  priority?: 'Top Priority' | 'Urgent' | 'Critical Event' | 'None';
};

const initialEvents: EventType[] = [
  { title: 'Design Meeting', time: '10:00 - 11:30 AM', people: ['A', 'B', 'C'], color: '#fce7f3', day: today.getDate(), month: today.getMonth(), year: today.getFullYear() },
  { title: 'Office Team Meeting', time: '12:00 - 12:30 PM', people: ['D', 'E'], color: '#e0e7ff', day: today.getDate(), month: today.getMonth(), year: today.getFullYear() },
];

function toAmPmLabel(start: string, end: string): string {
  // start/end: 'HH:MM'
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const ampm = eh >= 12 ? 'PM' : 'AM';
  // Remove AM/PM from each time, add only at the end
  const fmt = (h: number, m: number) => `${h}:${m.toString().padStart(2, '0')}`;
  return `${fmt(sh, sm)} - ${fmt(eh, em)} ${ampm}`;
}

type TimeSlot = { slot: string, label: string, disabled: boolean };
function getAvailableTimeSlots(dayEvents: EventType[]): TimeSlot[] {
  const slots: TimeSlot[] = [];
  // Build slots from 10:30 to 16:00 (4:00 PM)
  const slotTimes = [
    ['10:30', '11:00'],
    ['11:00', '11:30'],
    ['11:30', '12:00'],
    ['12:00', '12:30'],
    ['12:30', '13:00'],
    ['13:00', '13:30'],
    ['13:30', '14:00'],
    ['14:00', '14:30'],
    ['14:30', '15:00'],
    ['15:00', '15:30'],
  ];
  for (const [start, end] of slotTimes) {
    const slot = `${start} - ${end}`;
  const label = toAmPmLabel(start, end);
    const disabled = dayEvents.some(ev => ev.time === slot);
    slots.push({ slot, label, disabled });
  }
  return slots;
}

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  Profile: undefined;
  Calendar: undefined;
};

const CalendarDashboard: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [events, setEvents] = useState<EventType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventPriority, setEventPriority] = useState<'Top Priority' | 'Urgent' | 'Critical Event' | 'None'>('None');
  const [activeTab, setActiveTab] = useState('home');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Load user name from AsyncStorage
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem('userName');
      setUserName(name || '');
    };
    fetchUserName();

    // Load events from AsyncStorage
    const fetchEvents = async () => {
      const storedEvents = await AsyncStorage.getItem('userEvents');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    };
    fetchEvents();
  }, []);

  // Save events to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem('userEvents', JSON.stringify(events));
  }, [events]);

  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour >= 5 && hour < 12) greeting = 'Good Morning';
  else if (hour >= 12 && hour < 18) greeting = 'Good Afternoon';

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Filter events for selected day and current user
  const dayEvents = events.filter(
    e =>
      e.day === selectedDay &&
      e.month === currentMonth &&
      e.year === currentYear &&
      e.createdBy === userName
  );

  const openModal = (idx?: number) => {
    if (typeof idx === 'number') {
      setEditIndex(idx);
      setEventTitle(events[idx].title);
      setEventTime(events[idx].time);
      setEventPriority(events[idx].priority || 'None');
    } else {
      setEditIndex(null);
      setEventTitle('');
      setEventTime('');
      setEventPriority('None');
    }
    setModalVisible(true);
  };

  const saveEvent = () => {
    if (eventTitle.trim() === '' || eventTime.trim() === '') return;

    const userDayEvents = events.filter(
      e =>
        e.day === selectedDay &&
        e.month === currentMonth &&
        e.year === currentYear &&
        e.createdBy === userName
    );
    const color = userDayEvents.length % 2 === 0 ? '#fce7f3' : '#e0e7ff';

    if (editIndex !== null) {
      const updated = [...events];
      updated[editIndex] = {
        ...updated[editIndex],
        title: eventTitle,
        time: eventTime,
        day: selectedDay,
        month: currentMonth,
        year: currentYear,
        createdBy: userName,
        color,
        priority: eventPriority,
      };
      setEvents(updated);
    } else {
      setEvents([...events, {
        title: eventTitle,
        time: eventTime,
        people: [],
        color,
        day: selectedDay,
        month: currentMonth,
        year: currentYear,
        createdBy: userName,
        priority: eventPriority,
      }]);
    }
    setModalVisible(false);
    setEventTitle('');
    setEventTime('');
    setEditIndex(null);
    setEventPriority('None');
  };

  // Modern navbar tab data
  const tabData = [
    { key: 'home', icon: require('../assets/icons/home.png'), label: 'Home' },
    { key: 'calendar', icon: require('../assets/icons/schedule.png'), label: 'Calendar' },
    { key: 'add', icon: '+', label: '' },
    { key: 'profile', icon: require('../assets/icons/user.png'), label: 'Profile' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <LinearGradient colors={["#f7fafc", "#e0e7ff"]} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.username}>{userName}</Text>
            </View>
            <View style={styles.weatherBox}>
              <Text style={styles.weatherTemp}>21°C</Text>
              <Text style={styles.weatherIcon}>☁️</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Calendar Bar */}
        <View style={styles.calendarBar}>
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}>
              <Text style={styles.arrow}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.month}>{monthNames[currentMonth]} {currentYear}</Text>
            <TouchableOpacity onPress={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}>
              <Text style={styles.arrow}>{'>'}</Text>
            </TouchableOpacity>
          </View>
          <LinearGradient colors={["#e0e7ff", "#f7fafc"]} style={styles.calendarGradient}>
            <View style={styles.daysGrid}>
              {[...Array(firstDayOfWeek)].map((_, i) => (
                <View key={i} style={styles.dayBox} />
              ))}
              {[...Array(daysInMonth)].map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.dayBox, selectedDay === i + 1 && styles.daySelected]}
                  onPress={() => setSelectedDay(i + 1)}
                  disabled={selectedDay === i + 1}
                >
                  <View style={styles.dayNumberWrapper}>
                    <Text style={[styles.dayText, selectedDay === i + 1 && styles.dayTextSelected]}>{i + 1}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Today Task */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Events</Text>
            <TouchableOpacity onPress={() => openModal()}>
              <LinearGradient colors={["#6366f1", "#60a5fa"]} style={styles.addBtnGradient}>
                <Text style={styles.addBtn}>+</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.cardsRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
              {dayEvents.length === 0 ? (
                <View style={[styles.eventCard, { backgroundColor: '#e0e7ff', justifyContent: 'center', alignItems: 'center', minWidth: 180 }]}>
                  <Text style={{ color: '#6366f1', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                    No events on this day.
                  </Text>
                </View>
              ) : (
                dayEvents.map((event, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.eventCard, { backgroundColor: event.color }]}
                    onPress={() => openModal(events.indexOf(event))}
                  >
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventTime}>{event.time}</Text>
                    <View style={styles.peopleRow}>
                      {event.people.map((p, i) => (
                        <View key={i} style={styles.personCircle}><Text>{p}</Text></View>
                      ))}
                    </View>
                    {event.priority && event.priority !== 'None' && (
                      <View style={{
                        marginTop: 6,
                        alignSelf: 'flex-start',
                        backgroundColor: PRIORITY_OPTIONS.find(opt => opt.label === event.priority)?.color || '#6366f1',
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{event.priority}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
            )}
            </ScrollView>
          </View>
        </View>

  
        {/* Modern Reminder/Notification Section */}
        <View style={styles.section}>
          <View style={styles.reminderCard}>
            <View style={styles.reminderHeaderRow}>
              <Text style={styles.reminderTitle}>Plan for the next month</Text>
              <View style={styles.reminderPriority}><Text style={styles.reminderPriorityText}>High Priority</Text></View>
            </View>
            <Text style={styles.reminderDesc}>Prepare a content plan for September</Text>
            <View style={styles.reminderInfoRow}>
              <View style={styles.reminderInfoCol}>
                <Text style={styles.reminderInfoLabel}>Due date</Text>
                <Text style={styles.reminderInfoValue}>Aug 25</Text>
              </View>
              <View style={styles.reminderInfoCol}>
                <Text style={styles.reminderInfoLabel}>Assigned to</Text>
                <View style={styles.reminderAssigneeRow}>
                  <Image source={require('../assets/icons/user.png')} style={styles.reminderAssigneeAvatar} />
                  <Text style={styles.reminderAssigneeName}>Rukije Morina</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      {/* Modern pill-shaped navbar */}
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
                openModal();
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

      {/* Event Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Image source={require('../assets/icons/schedule.png')} style={styles.modalHeaderIcon} />
              <Text style={styles.modalTitle}>{editIndex !== null ? 'Edit Event' : 'Create Event'}</Text>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Event Title"
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholderTextColor="#93c5fd"
            />
            <Text style={styles.modalLabel}>Available Time</Text>
            <View style={styles.timeSlotGrid}>
              {(() => {
                const slots = getAvailableTimeSlots(dayEvents);
                const rows = [];
                for (let i = 0; i < slots.length; i += 2) {
                  rows.push(
                    <View key={i} style={styles.timeSlotRow}>
                      {[0, 1].map(j => {
                        const slotObj = slots[i + j];
                        if (!slotObj) return <View key={j} style={{ flex: 1 }} />;
                        return (
                          <TouchableOpacity
                            key={j}
                            style={[styles.timeSlotPill, eventTime === slotObj.slot && styles.timeSlotPillSelected, slotObj.disabled && { opacity: 0.4 }]}
                            onPress={() => !slotObj.disabled && setEventTime(slotObj.slot)}
                            activeOpacity={slotObj.disabled ? 1 : 0.8}
                            disabled={slotObj.disabled}
                          >
                            <Text style={[styles.timeSlotText, eventTime === slotObj.slot && styles.timeSlotTextSelected]}>{slotObj.label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  );
                }
                return rows;
              })()}
            </View>
            <View style={{ marginVertical: 12 }}>
              <Text style={styles.modalLabel}>Priority</Text>
              <View style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 6,
    gap: 8,
  }}>
    {PRIORITY_OPTIONS.map((option, idx) => (
      <TouchableOpacity
        key={option.label}
        style={{
          backgroundColor: eventPriority === option.label ? option.color : '#e0e7ff',
          borderRadius: 16,
          paddingHorizontal: 14,
          paddingVertical: 10,
          margin: 6,
          minWidth: 130,
          alignItems: 'center',
          marginBottom: idx % 2 === 0 ? 8 : 0,
        }}
        onPress={() => setEventPriority(option.label as any)}
      >
        <Text style={{
          color: eventPriority === option.label ? '#fff' : '#2563eb',
          fontWeight: 'bold',
          fontSize: 14,
        }}>{option.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
            </View>
            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#6366f1', marginBottom: 0 }]}
                onPress={saveEvent}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>{editIndex !== null ? 'Edit Changes' : 'Create Meet'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#e0e7ff', marginBottom: 0 }]}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalBtnText, { color: '#6366f1' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

const PRIORITY_OPTIONS = [
  { label: 'Top Priority', color: '#ef4444' },         // Red
  { label: 'Urgent', color: '#f59e42' },               // Orange
  { label: 'Critical Event', color: '#6366f1' },       // Indigo
  { label: 'None', color: '#e0e7ff' },                 // Light violet
];

const styles = StyleSheet.create({
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
    justifyContent: 'center',
  },
  modalHeaderIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
    tintColor: '#6366f1',
  },
  modalLabel: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 2,
  },
  timeSlotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    width: '100%',
    maxWidth: 320,
  },
  timeSlotGrid: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotPill: {
    backgroundColor: '#e0e7ff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginVertical: 2,
    marginHorizontal: 8,
    minWidth: 110,
    alignItems: 'center',
  },
  timeSlotPillSelected: {
    backgroundColor: '#6366f1',
  },
  timeSlotText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
  },
  timeSlotTextSelected: {
    color: '#fff',
  },
  dayNumberWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: { flex: 1, backgroundColor: '#f7fafc' },
  container: { flex: 1 },
  header: {
    padding: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 12,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#2563eb' },
  username: { fontSize: 18, color: '#64748b', marginTop: 4 },
  weatherBox: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  weatherTemp: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  weatherIcon: { fontSize: 20, marginTop: 2 },
  calendarBar: { paddingHorizontal: 24, marginBottom: 18 },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  arrow: { fontSize: 22, color: '#6366f1', marginHorizontal: 12 },
  month: { fontSize: 18, fontWeight: 'bold', color: '#6366f1', marginBottom: 8 },
  calendarGradient: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: '#6366f1',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 8,
    marginLeft:10,
  },
  dayBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    padding: 0,
    shadowColor: '#6366f1',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  daySelected: {
    backgroundColor: '#6366f1',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  dayText: { color: '#64748b', fontWeight: 'bold', fontSize: 16 },
  dayTextSelected: { color: '#fff', fontWeight: 'bold' },
  section: { paddingHorizontal: 24, marginBottom: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2563eb' },
  addBtn: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  addBtnGradient: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsRow: { flexDirection: 'row', gap: 12 },
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
  eventTime: { color: '#64748b', fontSize: 14, marginVertical: 4 },
  peopleRow: { flexDirection: 'row', marginTop: 8 },
  personCircle: {
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
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#6366f1',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  navIcon: {
    padding: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCircleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
  },
  addCircle: {
    backgroundColor: '#6366f1',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  addCircleGradient: {
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  addCircleText: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '85%',
    maxWidth: 420,
    shadowColor: '#6366f1',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e7ff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#2563eb',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  modalBtn: {
    minWidth: 140,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  pillNavbar: {
    flexDirection: 'row',
    backgroundColor: '#fff', // white background
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
    backgroundColor: '#e0e7ff', // light blue for active
    borderWidth: 2,
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  pillTabAdd: {
    backgroundColor: '#6366f1', // blue for add
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
    tintColor: '#2563eb', // blue icon
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 22,
    backgroundColor: 'transparent',
    marginRight: 0,
  },
  pillTabIconActive: {
    tintColor: '#6366f1', // accent blue for active
  },
  pillTabLabel: {
    color: '#2563eb', // blue text
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  createHeader: {
    marginBottom: 8,
  },
  createDesc: {
    color: '#64748b',
    fontSize: 15,
    marginBottom: 8,
  },
  createFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  createInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#2563eb',
    backgroundColor: '#f7fafc',
  },
  createBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reminderCard: {
    backgroundColor: '#2563eb', // main blue for background
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  reminderHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reminderTitle: {
    color: '#fff', // white text for contrast
    fontWeight: 'bold',
    fontSize: 18,
  },
  reminderPriority: {
    backgroundColor: '#f87171',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  reminderPriorityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  reminderDesc: {
    color: '#e0e7ff', // light blue for secondary text
    fontSize: 15,
    marginBottom: 12,
  },
  reminderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderInfoCol: {
    flexDirection: 'column',
  },
  reminderInfoLabel: {
    color: '#e0e7ff', 
    fontSize: 13,
    marginBottom: 2,
  },
  reminderInfoValue: {
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 15,
  },
  reminderAssigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  reminderAssigneeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  reminderAssigneeName: {
    color: '#fff', // white for name
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default CalendarDashboard;
