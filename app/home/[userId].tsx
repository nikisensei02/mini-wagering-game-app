import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import gamesData from '../gamesData.json'
import AsyncStorage from '@react-native-async-storage/async-storage';


const numColumns = 1;
const cardMargin = 8;

const HomeScreen = () => {
  const router = useRouter();
  const [games, setGames] = useState<typeof gamesData>([]);

  useEffect(() => {
    console.log('Fetching games data...');
    console.log(gamesData);
    setGames(gamesData);
  }, []);
  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      alert('Logout successfully');
      router.push("/auth/login");
    } catch (error) {
      alert('logout unsuccessfull'+ error);
    }
  };

  const renderGameCard = ({ item }: { item: typeof gamesData[number] }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push({
        pathname: "game/[id]",
        params: { id: item.id },
      })}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardStarting}>Description: </Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.title}>Game Feed</Text>
        <Pressable onPress={clearStorage}><Text  style={styles.logout}>LOGOUT</Text></Pressable>
      </View>
      <FlatList
        data={games}
        renderItem={renderGameCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        numColumns={numColumns}
      />
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
  headingContainer:{
    width:700,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  logout:{
    color:'red',
    cursor:'pointer',
  },
  listContainer: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: cardMargin,
    paddingVertical: 8,
  },
  card: {
    width: '85%',
    height: 250,
    margin: cardMargin,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardImage: {
    margin: 10,
    width: 100,
    aspectRatio: 1, // Square aspect ratio
    borderRadius: 200,
  },
  cardContent: {
    padding: 12,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  cardStarting: {
    fontWeight: '500',
  },
  cardTitle: {
    minWidth: 120,
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'left',
  },
  cardDescription: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});


export default HomeScreen;
