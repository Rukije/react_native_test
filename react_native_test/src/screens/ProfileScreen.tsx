import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
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

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('profile');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      const name = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('biometricUser');
      setUserName(name || '');
      setUserEmail(email || '');
    };
    getUserInfo();
  }, []);

  const user = {
    name: userName || 'User',
    avatar: require('../assets/icons/user.png'),
    email: userEmail || '',
  };

  const menuOptions = [
    { icon: require('../assets/icons/edit.png'), label: 'Info', action: () => setModalVisible(true) },
    { icon: require('../assets/icons/bell.png'), label: 'Notification' },
    { icon: require('../assets/icons/location.png'), label: 'Shipping Address' },
    { icon: require('../assets/icons/lock.png'), label: 'Change Password' },
  ];

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarModernWrapper}>
            <LinearGradient colors={["#2563eb", "#6366f1"]} style={styles.avatarModernBg}>
              <Text style={styles.avatarInitials}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </LinearGradient>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.userSubtitle}>{user.email}</Text>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          {menuOptions.map((option, idx) => (
            <TouchableOpacity key={idx} style={styles.menuRow} onPress={option.action}>
              <View style={styles.menuIconWrapper}>
                <Image source={option.icon} style={styles.menuIcon} />
              </View>
              <Text style={styles.menuLabel}>{option.label}</Text>
              <Text style={styles.menuArrow}>{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate('SignIn')}>
          <Image source={require('../assets/icons/logout.png')} style={styles.logoutIcon} />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <LinearGradient colors={["#2563eb", "#60a5fa"]} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Info</Text>
            </LinearGradient>
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Name:</Text>
              <Text style={styles.modalValue}>{user.name}</Text>
              <Text style={styles.modalLabel}>Email:</Text>
              <Text style={styles.modalValue}>{user.email}</Text>
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                  // No modal for profile, do nothing
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
  pillNavbarBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    paddingBottom: 8,
  },
  profileCard: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 18,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 24,
    shadowColor: '#2563eb',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  avatarModernWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  avatarModernBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarInitials: {
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: '#2563eb',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 2,
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: '#e0e7ff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginTop: 2,
  },
  userSubtitle: {
    fontSize: 16,
    color: '#6366f1',
    marginBottom: 6,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 2,
  },
  menuSection: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    elevation: 1,
  },
  menuIconWrapper: {
    backgroundColor: '#e0e7ff', // lighter blue
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#2563eb', // main blue
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 22,
    color: '#64748b',
    marginLeft: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb', // main blue
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginBottom: 80,
    marginTop: 12,
    elevation: 2,
  },
  logoutIcon: {
    width: 22,
    height: 22,
    tintColor: '#fff', // white icon on blue
    marginRight: 10,
  },
  logoutBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#6366f1',
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
    tintColor: '#2563eb', // main blue
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
    color: '#2563eb', // main blue text
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    width: '80%',
    elevation: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    width: '100%',
    paddingVertical: 18,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalLabel: {
    fontSize: 16,
    color: '#6366f1',
    marginTop: 8,
    fontWeight: 'bold',
  },
  modalValue: {
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
  },
  closeModalBtn: {
    marginTop: 22,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  closeModalText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
