import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';

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

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});

export default App;
