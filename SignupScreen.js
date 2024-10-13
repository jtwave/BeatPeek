import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from './firebase';
import { LinearGradient } from 'expo-linear-gradient';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(database, 'users/' + user.uid), {
        email: user.email,
        uid: user.uid,
      });

      navigation.navigate('Home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>

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

        <Button mode="contained" onPress={handleSignup} style={styles.button}>
          Sign Up
        </Button>

        <Button mode="text" onPress={() => navigation.navigate('Login')} style={styles.signupButton}>
          Already have an account? Login
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
    backgroundColor: '#FF4B2B',
  },
  signupButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default SignupScreen;
