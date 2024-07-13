import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import gamesData from '../gamesData.json';

const Id = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [game, setGame] = useState<typeof gamesData[number] | null>(null);
    const [gameResult, setGameResult] = useState<number>(0);
    const [currentStepCount, setCurrentStepCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const selectedGame = gamesData.find(game => game.id === id);
        if (selectedGame) {
            setGame(selectedGame);
            if (typeof selectedGame.result === 'string') {
                const gameOutcomeResult = parseInt(selectedGame.result, 10);
                setGameResult(gameOutcomeResult);
            }
        }
    }, [id]);

    useEffect(() => {
        const fetchStepCount = async () => {
            try {
                const value = await AsyncStorage.getItem('@step_count');
                if (value !== null) {
                    setCurrentStepCount(JSON.parse(value));
                }
            } catch (e) {
                console.error('Failed to load step count.', e);
            }
        };

        fetchStepCount();
    }, []);

    const handleNavigate = () => {
        router.push(`home/${currentStepCount}`);
    };

    const getResultMessage = () => {
        if (gameResult !== undefined) {
            return currentStepCount >= gameResult
                ? 'You have completed the challenge'
                : 'You failed to complete the challenge';
        }
        return 'Game result not found';
    };

    const resultMessageStyle = currentStepCount >= gameResult ? styles.successMessage : styles.failMessage;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Game Result</Text>
            <Text style={styles.stepCount}>Current Step Count: {currentStepCount}</Text>
            <Text style={resultMessageStyle}>{getResultMessage()}</Text>
            <Button
                title="Go to Home"
                onPress={handleNavigate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    stepCount: {
        fontSize: 18,
    },
    successMessage: {
        fontSize: 18,
        marginVertical: 20,
        color: 'green',
    },
    failMessage: {
        fontSize: 18,
        marginVertical: 20,
        color: 'red',
    },
});

export default Id;
