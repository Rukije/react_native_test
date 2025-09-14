import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import CalendarDashboard from './src/screens/CalendarDashboard';
import CalendarView from './src/screens/CalendarView';
import ProfileScreen from './src/screens/ProfileScreen';
import { Provider } from 'react-redux';
import { store } from './src/store';

function HomeScreen() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <React.Fragment>
        <StatusBar barStyle="dark-content" />
        <HomeView />
      </React.Fragment>
    </>
  );
}

function HomeView() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Text style={{ fontSize: 32, textAlign: 'center', marginTop: 60 }}>Welcome Home!</Text>
    </>
  );
}

const Stack = createStackNavigator();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Home" component={CalendarDashboard} />
            <Stack.Screen name="Calendar" component={CalendarView} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({});
