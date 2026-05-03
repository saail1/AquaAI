import { useSleepStore } from '../store/sleepStore';

export const useSleep = () => {
  const { sleepLogs, addSleepLog, removeSleepLog } = useSleepStore();

  const logSleep = (bedTime, wakeTime, quality, notes) => {
    const bed = new Date(bedTime);
    const wake = new Date(wakeTime);
    let duration = (wake - bed) / (1000 * 60 * 60);
    if (duration < 0) duration += 24;

    addSleepLog({
      bedTime: bed.toISOString(),
      wakeTime: wake.toISOString(),
      duration: parseFloat(duration.toFixed(1)),
      quality,
      notes,
      date: new Date().toLocaleDateString(),
    });
  };

  const avgSleep = sleepLogs.length
    ? (sleepLogs.reduce((sum, l) => sum + l.duration, 0) / sleepLogs.length).toFixed(1)
    : 0;

  const avgQuality = sleepLogs.length
    ? (sleepLogs.reduce((sum, l) => sum + l.quality, 0) / sleepLogs.length).toFixed(1)
    : 0;

  return { sleepLogs, logSleep, removeSleepLog, avgSleep, avgQuality };
};