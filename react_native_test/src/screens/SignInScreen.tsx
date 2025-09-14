import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

const SignInScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email format.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSignIn = async () => {
    if (validate()) {
      try {
        await auth().signInWithEmailAndPassword(email, password);
        await AsyncStorage.setItem('biometricUser', email);
        navigation.navigate('Home');
      } catch (e: any) {
        if (e.code === 'auth/user-not-found') {
          setError('No user found with this email.');
        } else if (e.code === 'auth/wrong-password') {
          setError('Incorrect password.');
        } else if (e.code === 'auth/invalid-email') {
          setError('Invalid email address.');
        } else {
          setError('This account does not exist. Please try again.');
        }
      }
    }
  };

  const handleBiometricSignIn = async () => {
    setError('');
    const savedEmail = await AsyncStorage.getItem('biometricUser');
    if (!savedEmail) {
      setError('No previous biometric login found. Please login with email/password first.');
      return;
    }
    const rnBiometrics = new ReactNativeBiometrics();
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    console.log('Biometric available:', available, 'Type:', biometryType);

    if (!available) {
      setError('Biometric authentication not available on this device.');
      return;
    }

    const { success } = await rnBiometrics.simplePrompt({
      promptMessage: biometryType === 'FaceID' ? 'Sign in with FaceID' : 'Sign in with Biometrics',
    });

    if (success) {
      navigation.navigate('Home');
    } else {
      setError('Biometric authentication failed or cancelled.');
    }
  };

  const FaceIDButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 16,
        alignSelf: 'center',
        width: 180,
        justifyContent: 'center',
      }}
      onPress={onPress}
    >
      <Image
        source={require('../assets/icons/face-id.png')}
        style={{ width: 24, height: 24, marginRight: 8 }}
        resizeMode="contain"
      />
      <Text style={{ fontSize: 16, color: '#333' }}>Face ID</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.creativeHeader}>
          <LinearGradient colors={["#2563eb", "#60a5fa"]} style={styles.creativeGradient}>
            <Text style={styles.loginHeader}>Login</Text>
          </LinearGradient>
        </View>
        <View style={styles.content}>
          <View style={styles.blobWrapper}>
            <LinearGradient colors={["#60a5fa", "#2563eb"]} style={styles.blobBackground} />
          </View>
          <View style={styles.inputsContainer}>
            <TextInput
              style={[styles.input, { borderColor: '#c7d2fe', borderWidth: 2, color: '#2563eb' }]}
              placeholder="Email"
              placeholderTextColor="#93c5fd"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, { borderColor: '#c7d2fe', borderWidth: 2, color: '#2563eb' }]}
              placeholder="Password"
              placeholderTextColor="#93c5fd"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.loginBtn} onPress={handleSignIn}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
          <FaceIDButton onPress={handleBiometricSignIn} />
          <View style={styles.bottomRow}>
            <Text style={styles.newHere}>New Here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.register}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7fa', position: 'relative' },
  creativeHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 200,
    zIndex: 1,
    elevation: 2,
    overflow: 'visible',
    transform: [{ skewY: '0deg' }],
  },
  creativeGradient: {
    flex: 1,
     borderBottomLeftRadius: 120,
     borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 36,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 12,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 2,
  },
  loginHeaderContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 32,
    height: 180,
  },
  loginHeader: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: '#2563eb',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    elevation: 5,
  },
  inputsContainer: {
    width: '100%',
    marginTop: 270,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  input: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
    color: '#2563eb',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  forgot: {
    color: '#2563eb',
    fontSize: 17,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  error: {
    color: '#ef4444',
    marginBottom: 14,
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold',
  },
  loginBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 26,
    alignSelf: 'center',
    minWidth: 160,
    maxWidth: 220,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
      loginText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 1,
        textShadowColor: '#2563eb',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
        elevation: 3,
      },
      divider: {
        width: '40%',
        height: 4,
        backgroundColor: '#60a5fa',
        borderRadius: 2,
        alignSelf: 'center',
        marginVertical: 18,
        opacity: 0.7,
      },
      bottomRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
      },
      newHere: {
        color: '#6b7280',
        fontSize: 18,
      },
      register: {
        color: '#2563eb',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 2,
        textDecorationLine: 'underline',
      },
      blobWrapper: {
        position: 'absolute',
        top: 250,
        left: '10%',
        width: '80%',
        height: 140,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      blobBackground: {
        width: '100%',
        height: '100%',
        borderRadius: 80,
        transform: [{ scaleX: 1.3 }, { scaleY: 1.1 }, { rotate: '-8deg' }],
        opacity: 0.35,
      },
});

export default SignInScreen;
