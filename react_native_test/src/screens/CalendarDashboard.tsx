import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal, TextInput, Image } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const today = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const initialEvents = [
  { title: 'Design Meeting', time: '10:00 - 11:30 AM', people: ['A', 'B', 'C'], color: '#fce7f3', day: today.getDate(), month: today.getMonth(), year: today.getFullYear() },
  { title: 'Office Team Meeting', time: '12:00 - 12:30 PM', people: ['D', 'E'], color: '#e0e7ff', day: today.getDate(), month: today.getMonth(), year: today.getFullYear() },
];

const goals = [
  { title: 'Travel Dhaka', color: '#e0e7ff' },
  { title: 'Shopping', color: '#fee2e2' },
  { title: 'Bike Riding', color: '#d1fae5' },
];

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

const CalendarDashboard: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [events, setEvents] = useState(initialEvents);
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [activeTab, setActiveTab] = useState('calendar');

  const userName = 'Rukije';
  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour >= 5 && hour < 12) greeting = 'Good Morning';
  else if (hour >= 12 && hour < 18) greeting = 'Good Afternoon';

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Filter events for selected day
  const dayEvents = events.filter(e => e.day === selectedDay && e.month === currentMonth && e.year === currentYear);

  const openModal = (idx?: number) => {
    if (typeof idx === 'number') {
      setEditIndex(idx);
      setEventTitle(events[idx].title);
      setEventTime(events[idx].time);

    } else {
      setEditIndex(null);
      setEventTitle('');
      setEventTime('');

    }
    setModalVisible(true);
  };

  const saveEvent = () => {
    if (eventTitle.trim() === '' || eventTime.trim() === '') return;
    if (editIndex !== null) {
      // Edit existing event
      const updated = [...events];
      updated[editIndex] = {
        ...updated[editIndex],
        title: eventTitle,
        time: eventTime,
        day: selectedDay,
        month: currentMonth,
        year: currentYear,
      };
      setEvents(updated);
    } else {
      // Add new event for selected date
      setEvents([...events, {
        title: eventTitle,
        time: eventTime,
        people: [],
        color: '#e0e7ff',
        day: selectedDay,
        month: currentMonth,
        year: currentYear,
      }]);
    }
    setModalVisible(false);
    setEventTitle('');
    setEventTime('');
    setEditIndex(null);

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
              {dayEvents.map((event, idx) => (
                <TouchableOpacity key={idx} style={[styles.eventCard, { backgroundColor: event.color }]} onPress={() => openModal(events.indexOf(event))}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                  <View style={styles.peopleRow}>
                    {event.people.map((p, i) => (
                      <View key={i} style={styles.personCircle}><Text>{p}</Text></View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Goals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{monthNames[currentMonth]} Goal</Text>
          {goals.map((goal, idx) => (
            <View key={idx} style={[styles.goalCard, { backgroundColor: goal.color }]}> 
              <Text style={styles.goalTitle}>{goal.title}</Text>
            </View>
          ))}
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
              if (tab.key === 'add') openModal();
              else setActiveTab(tab.key);
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
            <Text style={styles.modalTitle}>{editIndex !== null ? 'Edit Event' : 'Create Event'}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Event Title"
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholderTextColor="#93c5fd"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Event Time"
              value={eventTime}
              onChangeText={setEventTime}
              placeholderTextColor="#93c5fd"
            />
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

const styles = StyleSheet.create({
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
  goalCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#6366f1',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  goalTitle: { fontWeight: 'bold', fontSize: 16, color: '#2563eb' },
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
});

export default CalendarDashboard;
