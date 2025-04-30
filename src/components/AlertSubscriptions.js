import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

function AlertSubscriptions() {
  const [phoneNumbers, setPhoneNumbers] = useState([
    { id: 1, number: '+1234567890', area: 'Downtown Area', subscribed: true },
    { id: 2, number: '+1987654321', area: 'River District', subscribed: true },
    { id: 3, number: '+1122334455', area: 'Industrial Park', subscribed: false },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    number: '',
    area: '',
  });

  const areas = [
    'Downtown Area',
    'River District',
    'Industrial Park',
    'Residential Zone A',
    'North District',
    'Central Business District',
    'South Side',
    'East End',
    'West Valley',
  ];

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleAddSubscription = () => {
    if (newSubscription.number && newSubscription.area) {
      setPhoneNumbers([
        ...phoneNumbers,
        {
          id: phoneNumbers.length + 1,
          number: newSubscription.number,
          area: newSubscription.area,
          subscribed: true,
        },
      ]);
      handleCloseDialog();
      setNewSubscription({ number: '', area: '' });
    }
  };

  const handleDeleteSubscription = (id) => {
    setPhoneNumbers(phoneNumbers.filter(sub => sub.id !== id));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Alert Subscriptions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Subscription
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Subscriptions
              </Typography>
              <List>
                {phoneNumbers.filter(sub => sub.subscribed).map((sub) => (
                  <ListItem key={sub.id}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <PhoneIcon sx={{ mr: 1 }} />
                          <Typography>{sub.number}</Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" mt={1}>
                          <LocationIcon sx={{ mr: 1, fontSize: 'small' }} />
                          <Typography variant="body2">{sub.area}</Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteSubscription(sub.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subscription Statistics
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>Total Subscribers:</Typography>
                  <Chip
                    label={phoneNumbers.filter(sub => sub.subscribed).length}
                    color="primary"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>Areas Covered:</Typography>
                  <Chip
                    label={new Set(phoneNumbers.map(sub => sub.area)).size}
                    color="info"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Subscription</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Phone Number"
              fullWidth
              value={newSubscription.number}
              onChange={(e) => setNewSubscription({ ...newSubscription, number: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="Area"
              fullWidth
              value={newSubscription.area}
              onChange={(e) => setNewSubscription({ ...newSubscription, area: e.target.value })}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select an area</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddSubscription}
            disabled={!newSubscription.number || !newSubscription.area}
          >
            Add Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AlertSubscriptions; 