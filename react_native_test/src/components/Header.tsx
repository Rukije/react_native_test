import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <View style={styles.headerContainer}>
    <View style={styles.centerContent}>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: 24,
    paddingBottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 2,
    shadowColor: '#6366f1',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#18181b',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
});

export default Header;