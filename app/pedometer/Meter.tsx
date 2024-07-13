import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function Meter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<string>('checking');
  const [currentStepCount, setCurrentStepCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      {errorMessage ? (
        <Text>{errorMessage}</Text>
      ) : (
        <Text>Walk! And watch this go up: {currentStepCount}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
