import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const tabData = [
  { key: 'home', icon: require('../assets/icons/home.png'), label: 'Home', route: 'Home' },
  { key: 'calendar', icon: require('../assets/icons/schedule.png'), label: 'Calendar', route: 'Calendar' },
  { key: 'add', icon: null, label: '', route: '' },
  { key: 'profile', icon: require('../assets/icons/user.png'), label: 'Profile', route: 'Profile' },
];

const Navbar: React.FC<{ activeTab?: string }> = ({ activeTab }) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.pillNavbarBottom}>
      <View style={styles.pillNavbar}>
        {tabData.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.pillTab,
              activeTab === tab.key && styles.pillTabActive,
              tab.key === 'add' && styles.pillTabAdd,
            ]}
            onPress={() => {
              if (tab.route) navigation.navigate(tab.route);
            }}
            activeOpacity={0.8}
          >
            {tab.key === 'add' ? (
              <View style={styles.addCircle}>
                <Text style={styles.addPlus}>+</Text>
              </View>
            ) : (
              <>
                <Image
                  source={tab.icon}
                  style={[
                    styles.pillTabIcon,
                    activeTab === tab.key ? styles.pillTabIconActive : { tintColor: '#2563eb' },
                  ]}
                  resizeMode="contain"
                />
                {activeTab === tab.key && (
                  <Text style={styles.pillTabLabel}>{tab.label}</Text>
                )}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pillNavbarBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
    paddingBottom: 8,
  },
  pillNavbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 8,
    elevation: 10,
    shadowColor: '#6366f1',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 24,
    marginHorizontal: 12,
  },
  pillTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
    minWidth: 44,
    justifyContent: 'center',
  },
  pillTabActive: {
    backgroundColor: '#e0e7ff',
    borderWidth: 1.5,
    borderColor: '#6366f1',
  },
  pillTabAdd: {
    backgroundColor: 'transparent',
    borderRadius: 32,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginHorizontal: 8,
    minWidth: 0,
  },
  addCircle: {
    backgroundColor: '#6366f1',
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  addPlus: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2,
  },
  pillTabIcon: {
    width: 32,
    height: 32,
    tintColor: '#2563eb',
  },
  pillTabIconActive: {
    tintColor: '#6366f1',
  },
  pillTabLabel: {
    marginLeft: 8,
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Navbar;