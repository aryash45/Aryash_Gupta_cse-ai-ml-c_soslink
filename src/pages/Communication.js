import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  Fade,
  Grow,
  Zoom,
  Slide,
  useTheme,
  alpha,
  CircularProgress,
  ListItemIcon
} from '@mui/material';
import {
  Send as SendIcon,
  Delete as DeleteIcon,
  Message as MessageIcon,
  Save as SaveIcon,
  ContentCopy as CopyIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import AlertService from '../services/AlertService';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionButton = motion(Button);
const MotionChip = motion(Chip);

const messageTemplates = [
  {
    id: 1,
    name: 'Severe Weather Alert',
    template: 'Severe weather warning for {area}. Please take necessary precautions and stay indoors.',
    severity: 'high',
    icon: <WarningIcon />
  },
  {
    id: 2,
    name: 'Evacuation Notice',
    template: 'EVACUATION NOTICE for {area}. Please follow emergency routes and proceed to designated shelters.',
    severity: 'critical',
    icon: <ErrorIcon />
  },
  {
    id: 3,
    name: 'Power Outage',
    template: 'Power outage reported in {area}. Estimated restoration time: {time}. Please prepare accordingly.',
    severity: 'medium',
    icon: <InfoIcon />
  },
  {
    id: 4,
    name: 'Road Closure',
    template: 'Road closure in {area} due to {reason}. Please use alternative routes.',
    severity: 'medium',
    icon: <InfoIcon />
  },
  {
    id: 5,
    name: 'Medical Emergency',
    template: 'Medical emergency in {area}. Emergency services are responding. Please avoid the area.',
    severity: 'high',
    icon: <WarningIcon />
  }
];

const Communication = () => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customVariables, setCustomVariables] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const areas = [
    'Downtown Area',
    'River District',
    'Industrial Park',
    'Residential Zone A',
    'North District',
    'Central Business District',
    'South Side',
    'East End',
    'West Valley'
  ];

  useEffect(() => {
    // Subscribe to real-time alerts updates
    const unsubscribeAlerts = AlertService.subscribeToAlertsUpdates((updatedAlerts) => {
      setAlerts(updatedAlerts);
      setLoading(false);
    });

    // Subscribe to real-time subscribers updates
    const unsubscribeSubscribers = AlertService.subscribeToSubscribersUpdates((updatedSubscribers) => {
      setSubscribers(updatedSubscribers);
    });

    return () => {
      unsubscribeAlerts();
      unsubscribeSubscribers();
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setMessage(template.template);
    setSeverity(template.severity);
    // Initialize custom variables from template
    const variables = template.template.match(/\{([^}]+)\}/g) || [];
    const initialVariables = {};
    variables.forEach(variable => {
      const key = variable.slice(1, -1);
      initialVariables[key] = '';
    });
    setCustomVariables(initialVariables);
  };

  const handleCustomVariableChange = (key, value) => {
    setCustomVariables(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyTemplateVariables = (template) => {
    let finalMessage = template;
    Object.entries(customVariables).forEach(([key, value]) => {
      finalMessage = finalMessage.replace(`{${key}}`, value || key);
    });
    return finalMessage;
  };

  const handleSendMessage = async () => {
    if (!message || !selectedArea) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    try {
      // First subscribe the test numbers if they're not already subscribed
      const testNumbers = AlertService.testPhoneNumbers;
      for (const phoneNumber of testNumbers) {
        try {
          await AlertService.subscribeToAlerts(phoneNumber, { area: selectedArea });
        } catch (error) {
          console.log(`Phone number ${phoneNumber} might already be subscribed`);
        }
      }

      // Then send the alert
      const alert = {
        title: 'Emergency Alert',
        description: applyTemplateVariables(message),
        severity,
        location: selectedArea,
        type: 'emergency'
      };

      const result = await AlertService.sendAlert(alert);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: `Alert sent successfully! Message ID: ${result.messageId}`,
          severity: 'success'
        });
        setMessage('');
        setSelectedArea('');
        setSeverity('medium');
        setCustomVariables({});
      } else {
        throw new Error(result.error || 'Failed to send alert');
      }
    } catch (error) {
      console.error('Error sending alert:', error);
      setSnackbar({
        open: true,
        message: `Error sending alert: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Fade in timeout={500}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4
          }}
        >
          Communication Center
        </Typography>
      </Fade>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            },
            '& .Mui-selected': {
              fontWeight: 600,
            },
          }}
        >
          <Tab label="Send Alert" />
          <Tab label="Message Templates" />
          <Tab label="History" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grow in timeout={800}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Send Emergency Alert
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      sx={{ mb: 2 }}
                      variant="outlined"
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Area</InputLabel>
                          <Select
                            value={selectedArea}
                            label="Area"
                            onChange={(e) => setSelectedArea(e.target.value)}
                          >
                            {areas.map((area) => (
                              <MenuItem key={area} value={area}>
                                {area}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Severity</InputLabel>
                          <Select
                            value={severity}
                            label="Severity"
                            onChange={(e) => setSeverity(e.target.value)}
                          >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="critical">Critical</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <MotionButton
                      variant="contained"
                      color="primary"
                      startIcon={<SendIcon />}
                      onClick={handleSendMessage}
                      disabled={!message || !selectedArea}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Send Alert
                    </MotionButton>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grow>
          </Grid>

          <Grid item xs={12} md={4}>
            <Slide direction="up" in timeout={1000}>
              <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Quick Stats
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Active Subscribers"
                        secondary={
                          <MotionChip
                            label={AlertService.subscribers.size}
                            color="primary"
                            size="small"
                            whileHover={{ scale: 1.1 }}
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Areas Covered"
                        secondary={
                          <MotionChip
                            label={new Set(Array.from(AlertService.subscribers.values()).map(sub => sub.area)).size}
                            color="info"
                            size="small"
                            whileHover={{ scale: 1.1 }}
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Zoom in timeout={800}>
              <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Available Templates
                  </Typography>
                  <List>
                    {messageTemplates.map((template, index) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ListItem
                          button
                          onClick={() => handleTemplateSelect(template)}
                          selected={selectedTemplate?.id === template.id}
                          sx={{
                            borderRadius: 1,
                            mb: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                            '&.Mui-selected': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {template.icon}
                                <Typography sx={{ ml: 1, fontWeight: 600 }}>
                                  {template.name}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <MotionChip
                                  label={template.severity}
                                  color={getSeverityColor(template.severity)}
                                  size="small"
                                  sx={{ mr: 1 }}
                                  whileHover={{ scale: 1.1 }}
                                />
                                <Typography variant="body2" color="textSecondary">
                                  {template.template}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} md={6}>
            {selectedTemplate && (
              <Fade in timeout={500}>
                <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Customize Template
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {selectedTemplate.template}
                      </Typography>
                      {selectedTemplate.template.match(/\{([^}]+)\}/g)?.map((variable) => {
                        const key = variable.slice(1, -1);
                        return (
                          <TextField
                            key={key}
                            fullWidth
                            label={key}
                            value={customVariables[key] || ''}
                            onChange={(e) => handleCustomVariableChange(key, e.target.value)}
                            sx={{ mb: 2 }}
                            variant="outlined"
                          />
                        );
                      })}
                      <MotionButton
                        variant="contained"
                        color="primary"
                        startIcon={<SendIcon />}
                        onClick={handleSendMessage}
                        disabled={!selectedArea}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Send Alert
                      </MotionButton>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            )}
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Fade in timeout={500}>
          <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Message History
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ListItem
                        sx={{
                          mb: 2,
                          borderRadius: 1,
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <ListItemIcon>
                          {alert.severity === 'critical' ? <ErrorIcon color="error" /> :
                           alert.severity === 'high' ? <WarningIcon color="warning" /> :
                           <InfoIcon color="info" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {alert.title}
                              </Typography>
                              <MotionChip
                                label={alert.severity}
                                color={getSeverityColor(alert.severity)}
                                size="small"
                                whileHover={{ scale: 1.05 }}
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="textSecondary">
                                {alert.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip
                                  icon={<LocationOnIcon />}
                                  label={alert.location}
                                  size="small"
                                  variant="outlined"
                                />
                                <Chip
                                  icon={<AccessTimeIcon />}
                                  label={formatTimestamp(alert.createdAt)}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Fade>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
          iconMapping={{
            success: <SuccessIcon />,
            error: <ErrorIcon />,
            warning: <WarningIcon />,
            info: <InfoIcon />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Communication; 