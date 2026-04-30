import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

export const createUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    }
    return { data: null, error: 'Profile not found' };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addWaterLog = async (userId, logData) => {
  try {
    const logsRef = collection(db, 'waterLogs', userId, 'logs');
    const docRef = await addDoc(logsRef, {
      ...logData,
      timestamp: Timestamp.now(),
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getTodayLogs = async (userId, dateStr) => {
  try {
    const logsRef = collection(db, 'waterLogs', userId, 'logs');
    const q = query(logsRef, where('date', '==', dateStr));
    const querySnapshot = await getDocs(q);
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    return { logs, error: null };
  } catch (error) {
    return { logs: [], error: error.message };
  }
};

export const deleteWaterLog = async (userId, logId) => {
  try {
    const logRef = doc(db, 'waterLogs', userId, 'logs', logId);
    await deleteDoc(logRef);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getWeeklyLogs = async (userId, startDateStr, endDateStr) => {
  try {
    const logsRef = collection(db, 'waterLogs', userId, 'logs');
    const q = query(
      logsRef,
      where('date', '>=', startDateStr),
      where('date', '<=', endDateStr)
    );
    const querySnapshot = await getDocs(q);
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    return { logs, error: null };
  } catch (error) {
    return { logs: [], error: error.message };
  }
};

export const updateStreak = async (userId, streakData) => {
  try {
    const streakRef = doc(db, 'streaks', userId);
    await setDoc(streakRef, {
      ...streakData,
      updatedAt: Timestamp.now(),
    }, { merge: true });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getStreak = async (userId) => {
  try {
    const streakRef = doc(db, 'streaks', userId);
    const docSnap = await getDoc(streakRef);
    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    }
    return { data: null, error: 'Streak not found' };
  } catch (error) {
    return { data: null, error: error.message };
  }
};