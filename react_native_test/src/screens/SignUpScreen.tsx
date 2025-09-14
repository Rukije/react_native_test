import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth'; // <-- Add this line

interface SignUpScreenProps {
  navigation: any;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // <-- Add loading state

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Firebase registration
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      // Optionally update display name
      await userCredential.user.updateProfile({ displayName: name });
      setLoading(false);
      navigation.navigate('SignIn');
    } catch (e: any) {
      setLoading(false);
      if (e.code === 'auth/email-already-in-use') {
        setError('That email address is already in use!');
      } else if (e.code === 'auth/invalid-email') {
        setError('That email address is invalid!');
      } else if (e.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters!');
      } else {
        setError(e.message || 'Registration failed');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#2575fc", "#005bea"]} style={styles.topCurve}>
        <Text style={styles.headerText}>Create Account</Text>
      </LinearGradient>
      <View style={[styles.card, { marginTop: 40 }]}>
        <TextInput
          style={[styles.input, { borderColor: '#c7d2fe', borderWidth: 2, color: '#2563eb' }]}
          placeholder="Name"
          placeholderTextColor="#93c5fd"
          value={name}
          onChangeText={setName}
        />
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
          selectionColor="#2575fc"
        />
        <TextInput
          style={[styles.input, { borderColor: '#c7d2fe', borderWidth: 2, color: '#2563eb' }]}
          placeholder="Confirm Password"
          placeholderTextColor="#93c5fd"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          selectionColor="#2575fc"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  topCurve: {
    height: 180,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginTop: -40,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    height: 48,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#2575fc',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#2575fc',
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default SignUpScreen;
