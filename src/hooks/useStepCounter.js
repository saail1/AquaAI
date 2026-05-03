import { useEffect, useRef } from 'react';
import { Pedometer } from 'expo-sensors';
import { useStepStore } from '../store/stepStore';

export const useStepCounter = () => {
  const { steps, stepGoal, isTracking, setSteps, setTracking, resetSteps, setStepGoal } = useStepStore();
  const subscriptionRef = useRef(null);

  const startTracking = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    if (!isAvailable) {
      alert('Pedometer is not available on this device!');
      return;
    }

    resetSteps();
    setTracking(true);

    subscriptionRef.current = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);
    });
  };

  const stopTracking = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    setTracking(false);
  };

  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  const percentComplete = Math.min((steps / stepGoal) * 100, 100);

  return { steps, stepGoal, isTracking, startTracking, stopTracking, percentComplete, setStepGoal };
};