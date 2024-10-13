import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper'; // Using React Native Paper for enhanced UI
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { LinearGradient } from 'expo-linear-gradient'; // For background gradient

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>

        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>

        <Button mode="text" onPress={() => navigation.navigate('Signup')} style={styles.signupButton}>
          Don't have an account? Sign up
        </Button>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#2575fc',
  },
  signupButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default LoginScreen;
