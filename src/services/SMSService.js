// Mock SMS Service for testing purposes
class SMSService {
  constructor() {
    this.sentMessages = [];
  }

  async sendSMS(phoneNumber, message) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful response
    const mockResponse = {
      success: true,
      messageId: `mock-${Date.now()}`,
      phoneNumber,
      message,
      timestamp: new Date().toISOString()
    };

    // Store the sent message for testing purposes
    this.sentMessages.push(mockResponse);

    // Log the message (in production, this would be replaced with actual SMS sending)
    console.log(`[Mock SMS] Sent to ${phoneNumber}: ${message}`);

    return mockResponse;
  }

  async getMessageHistory() {
    return this.sentMessages;
  }

  async getMessageStatus(messageId) {
    const message = this.sentMessages.find(msg => msg.messageId === messageId);
    if (!message) {
      throw new Error('Message not found');
    }
    return {
      ...message,
      status: 'delivered', // Mock status
      deliveredAt: new Date().toISOString()
    };
  }
}

// Export a singleton instance
export default new SMSService(); 