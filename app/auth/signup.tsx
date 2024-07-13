import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const onSubmit = async () => {
        if(email && password && confirmPassword){
            if (password === confirmPassword) {
                try {
                  await doCreateUserWithEmailAndPassword(email, password);
                  alert("User created successfully!");
                } catch (error) {
                  alert("Error creating user!!! enter valid credential");
                }
              } else {
                alert("Passwords do not match!");
              }
        }else{
            alert("please enter all credentials");
        }
        
      };

    const GoogleSignin = async () => {
        doSignInWithGoogle();
        router.push("/home/123");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
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
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.button} onPress={onSubmit}>
                    <Text style={styles.buttonText}>Sign Up</Text>
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
                <Link href="/auth/login" style={styles.link}>
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

export default Signup;
