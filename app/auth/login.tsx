import React, { useEffect, useState } from 'react';
import { Text, Image, TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth';
// import { useAuth } from '../contexts/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();



  const storeData = async () => {
    try {
      await AsyncStorage.setItem('email', email);
      alert('Login successfull');
    } catch (error) {
      alert('Failed to Login localluy' + error);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('email');
      if (value !== null) {
        console.log('Retrieved data: ', value);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Failed to retrieve data', error);
      return false;
    }
  };

  useEffect(() => {
    const checkData = async () => {
      const dataExists = await getData();
      if (dataExists) {
        router.push("/home/123")
      }
    };
    checkData();
  }, []);
  const onSubmit = async () => {
    if (email && password) {
      try {
        await doSignInWithEmailAndPassword(email, password).then(storeData);
        router.push("/home/123");
      } catch (error) {
        alert("Error creating user!!! enter valid credential" + error);
      }
    } else {
      alert("please enter all credentials");
    }

  };

  const GoogleSignin = async () => {
    try {
      await doSignInWithGoogle();
      router.push("/home/123");
    } catch (error) {
      alert("Error creating user!!! enter valid credential");
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <Text>or</Text>
        <TouchableOpacity onPress={GoogleSignin} style={styles.googleButton}>
          <View style={styles.googleButtonContent}>
            <Image
              source={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </View>
        </TouchableOpacity>
        <Link href="/auth/signup" style={styles.link}>
          Go to user signup
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  formContainer: {
    width: '75%',
    padding: 16,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
  },
  link: {
    color: 'black',
    fontSize: 14,
    marginTop: 12,
  },
});

export default Login;
