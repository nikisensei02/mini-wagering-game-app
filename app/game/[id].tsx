import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import gamesData from '../gamesData.json';
import { router, useLocalSearchParams } from 'expo-router';


const AboutGame = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [game, setGame] = useState<typeof gamesData[number] | null>(null);

    useEffect(() => {
        const selectedGame = gamesData.find(game => game.id === id);
        if (selectedGame) {
            setGame(selectedGame);
        }
    }, [id]);

    if (!game) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }
    const handleJoin = () => {
        router.push({
            pathname: "joinGame/[id]",
            params: { id: id },
        });
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleJoin}>
                <Text style={styles.button}>JOIN</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Game Details</Text>
            <View style={styles.gameDetailsContainer}>
                <Image source={{ uri: game.imageUrl }} style={styles.gameImage} />
                <View style={styles.gameTextContainer}>
                    <Text style={styles.gameTitle}>{game.title}</Text>
                    <Text style={styles.gameDescription}>{game.description}</Text>
                </View>
            </View>
            <View>
                <Text>1. {game.description1}</Text>
                <Text>2. {game.description2}</Text>
                <Text>3. {game.description3}</Text>
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
    button: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    gameDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    gameImage: {
        width: 100,
        height: 100,
        borderRadius: 50, // Ensure a circular shape for the image
        marginRight: 16,
    },
    gameTextContainer: {
        flex: 1,
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    gameDescription: {
        fontSize: 14,
        color: 'gray',
    },
});

export default AboutGame;
