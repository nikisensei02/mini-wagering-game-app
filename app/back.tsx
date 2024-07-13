import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import BackgroundService from 'react-native-background-actions';

interface TaskData {
    delay: number;
    // Define other fields as needed
}

const Back = () => {
    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const veryIntensiveTask = async (taskData?: TaskData) => {
        if (!taskData) {
            // Handle case where taskData is undefined
            return;
        }

        const { delay } = taskData;
        await new Promise(async () => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                console.log(i);
                await sleep(delay);
            }
        });
    };

    const options = {
        taskName: 'Example',
        taskTitle: 'ExampleTask title',
        taskDesc: 'ExampleTask description',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'yourSchemeHere://chat/jane',
        parameters: {
            delay: 1000,
        },
    };

    const startBackground = async () => {
        try {
            await BackgroundService.start(veryIntensiveTask, options);
            await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' });
        } catch (error) {
            console.error('Error starting background service:', error);
        }
    };
    
    const stopBackground = async () => {
        try {
            await BackgroundService.stop();
        } catch (error) {
            console.error('Error stopping background service:', error);
        }
    };
    

    return (
        <View>
            <TouchableOpacity style={styles.container}><Text>Start Foreground</Text></TouchableOpacity>
            <TouchableOpacity style={styles.container}><Text>Stop Foreground</Text></TouchableOpacity>
            <TouchableOpacity style={styles.container} onPress={startBackground}><Text>Start Background</Text></TouchableOpacity>
            <TouchableOpacity style={styles.container} onPress={stopBackground}><Text>Stop Background</Text></TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
});

export default Back;
