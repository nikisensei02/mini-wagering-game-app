import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams,useRouter } from 'expo-router';
import gamesData from '../gamesData.json';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function JoinGame() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [game, setGame] = useState<typeof gamesData[number] | null>(null);
    const [isPedometerAvailable, setIsPedometerAvailable] = useState<string>('checking');
    const [currentStepCount, setCurrentStepCount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [countingActive, setCountingActive] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [stopTime,setStopTime] = useState<number>(0);
    const router = useRouter();

    
    
    
    
    useEffect(() => {
        const selectedGame = gamesData.find(game => game.id === id);
        if (selectedGame) {
            setGame(selectedGame);
            if (typeof selectedGame.time === 'string') {
                const gameStopTime = parseInt(selectedGame.time, 10);
                setStopTime(gameStopTime);
            }
        }
    }, [id]);

    useEffect(() => {
        let subscription: { remove: () => void } | undefined;
        
        const subscribe = async () => {
            const isAvailable = await Pedometer.isAvailableAsync();
            setIsPedometerAvailable(String(isAvailable));

            if (isAvailable) {
                subscription = Pedometer.watchStepCount(result => {
                    setCurrentStepCount(result.steps);
                });
            } else {
                setErrorMessage('Pedometer is not available on this device.');
            }
        };

        subscribe();

        return () => {
            if (subscription && typeof subscription.remove === 'function') {
                subscription.remove();
            }
        };
    }, []);

    const startCounting = () => {
        setCountingActive(true);
        setStartTime(Date.now());
        setCurrentStepCount(0); 
    };

    const stopCounting = () => {
        setCountingActive(false);
        setElapsedTime(0);
    };

    const storeStepCount=async()=>{
        try {
            await AsyncStorage.setItem('@step_count', JSON.stringify(currentStepCount));
        } catch (e) {
            console.error('Failed to save step count.', e);
        }
    }

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        const updateElapsedTime = () => {
            interval = setInterval(() => {
                if (countingActive) {
                    const now = Date.now();
                    const elapsed = now - startTime!;
                    setElapsedTime(Math.floor(elapsed / 1000)); 
                    if (elapsedTime >= stopTime) { 
                        stopCounting();
                        storeStepCount();
                        router.push({
                            pathname: "gameResult/[id]",
                            params: { id: id},
                        })
                    }
                }
            }, 1000); 
        };

        if (countingActive) {
            updateElapsedTime();
        } else {
            if (interval) clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [countingActive, startTime, elapsedTime]);

    if (!game) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Game Dashboard</Text>
            <View style={styles.gameContainer}>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <View style={styles.pedometerContainer}>
                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : (
                        <Text style={styles.stepCountText}>Walk! And watch this go up: {currentStepCount}</Text>
                    )}
                </View>
                <TouchableOpacity
                    style={[styles.button, countingActive ? styles.disabledButton : null]}
                    onPress={countingActive ? stopCounting : startCounting}
                    disabled={countingActive}
                >
                    <Text style={styles.buttonText}>{countingActive ? 'Counting...' : 'Ready'}</Text>
                </TouchableOpacity>
                {countingActive && (
                    <Text style={styles.elapsedTimeText}>Elapsed Time: {Math.floor(elapsedTime / 60)} minutes {elapsedTime % 60} seconds</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 18,
        color: '#555',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    gameContainer: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    gameTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pedometerContainer: {
        marginTop: 20,
    },
    pedometerText: {
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    stepCountText: {
        fontSize: 32,
        color: '#28a745',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#ccc', 
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
    elapsedTimeText: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
    },
});
