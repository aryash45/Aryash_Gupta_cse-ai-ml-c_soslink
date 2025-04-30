import React, { useState } from 'react';
import AlertService from '../services/AlertService';

const TestAlert = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSendAlert = async (e) => {
    e.preventDefault();
    try {
      // First subscribe the phone number
      await AlertService.subscribeToAlerts(phoneNumber);
      
      // Then send the alert
      const result = await AlertService.sendAlert({
        description: message,
        location: 'Test Area',
        severity: 'high',
        type: 'test'
      });

      setStatus(`Alert sent successfully! Message ID: ${result.messageId}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Test Alert Sending</h2>
      <form onSubmit={handleSendAlert}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Phone Number:
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1234567890"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Message:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your alert message"
            style={{ width: '100%', padding: '8px', minHeight: '100px' }}
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send Test Alert
        </button>
      </form>
      {status && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          {status}
        </div>
      )}
    </div>
  );
};

export default TestAlert; 