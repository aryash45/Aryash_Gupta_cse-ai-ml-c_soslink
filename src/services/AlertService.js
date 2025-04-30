import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';

class AlertService {
  constructor() {
    this.subscribers = new Map();
    this.alertsCollection = collection(db, 'alerts');
    this.subscribersCollection = collection(db, 'subscribers');
    this.testPhoneNumbers = [
      '+1234567890',
      '+1987654321',
      '+1122334455'
    ];
  }

  async sendAlert(alert) {
    try {
      // Simulate sending to test numbers
      const recipients = this.testPhoneNumbers;
      const messageStatus = recipients.map(phone => ({
        phone,
        status: 'delivered',
        timestamp: new Date().toISOString()
      }));

      const docRef = await addDoc(this.alertsCollection, {
        ...alert,
        status: 'sent',
        createdAt: new Date().toISOString(),
        recipients: messageStatus,
        messageType: 'test'
      });
      
      return {
        success: true,
        messageId: docRef.id,
        timestamp: new Date().toISOString(),
        recipients: messageStatus
      };
    } catch (error) {
      console.error('Error sending alert:', error);
      throw error;
    }
  }

  async subscribeToAlerts(phoneNumber, preferences = {}) {
    try {
      // Validate phone number format
      if (!this.isValidPhoneNumber(phoneNumber)) {
        throw new Error('Invalid phone number format');
      }

      const docRef = await addDoc(this.subscribersCollection, {
        phoneNumber,
        ...preferences,
        subscribed: true,
        createdAt: new Date().toISOString(),
        isTest: true
      });

      this.subscribers.set(phoneNumber, {
        id: docRef.id,
        ...preferences,
        subscribed: true,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        phoneNumber,
        ...preferences,
        isTest: true
      };
    } catch (error) {
      console.error('Error subscribing:', error);
      throw error;
    }
  }

  isValidPhoneNumber(phoneNumber) {
    // Basic phone number validation
    return /^\+?[1-9]\d{1,14}$/.test(phoneNumber);
  }

  async unsubscribeFromAlerts(phoneNumber) {
    try {
      const q = query(this.subscribersCollection, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, 'subscribers', document.id));
      });

      this.subscribers.delete(phoneNumber);
      return {
        success: true,
        phoneNumber
      };
    } catch (error) {
      console.error('Error unsubscribing:', error);
      throw error;
    }
  }

  async getSubscribers() {
    try {
      const querySnapshot = await getDocs(this.subscribersCollection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting subscribers:', error);
      throw error;
    }
  }

  // Real-time listener for alerts
  subscribeToAlertsUpdates(callback) {
    return onSnapshot(this.alertsCollection, (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(alerts);
    });
  }

  // Real-time listener for subscribers
  subscribeToSubscribersUpdates(callback) {
    return onSnapshot(this.subscribersCollection, (snapshot) => {
      const subscribers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(subscribers);
    });
  }
}

export default new AlertService(); 