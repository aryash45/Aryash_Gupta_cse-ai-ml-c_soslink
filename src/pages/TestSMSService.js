import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import SMSService from '../services/SMSService';

const TestSMSService = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadMessageHistory();
  }, []);

  const loadMessageHistory = async () => {
    const history = await SMSService.getMessageHistory();
    setMessageHistory(history);
  };

  const handleSendMessage = async () => {
    try {
      const result = await SMSService.sendSMS(phoneNumber, message);
      setSnackbar({
        open: true,
        message: `Message sent successfully! ID: ${result.messageId}`,
        severity: 'success'
      });
      setPhoneNumber('');
      setMessage('');
      loadMessageHistory();
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error sending message: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        SMS Service Test
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Send Test Message
              </Typography>
              <TextField
                fullWidth
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your test message here"
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={!phoneNumber || !message}
              >
                Send Message
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Message History
              </Typography>
              <List>
                {messageHistory.map((msg, index) => (
                  <React.Fragment key={msg.messageId}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body1" component="div">
                            <strong>To:</strong> {msg.phoneNumber}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {msg.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Sent: {new Date(msg.timestamp).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < messageHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                {messageHistory.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No messages sent yet" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TestSMSService; 