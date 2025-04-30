import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  LinearProgress,
  IconButton,
  Tooltip,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  Message as MessageIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const Home = () => {
  const [stats] = useState({
    alerts: 3,
    plans: 5,
    messages: 12,
    teamMembers: 8
  });

  const recentActivities = [
    {
      id: 1,
      type: 'alert',
      title: 'Flash Flood Warning',
      description: 'Heavy rainfall expected in Downtown Area',
      severity: 'high',
      timestamp: '5 minutes ago'
    },
    {
      id: 2,
      type: 'plan',
      title: 'Evacuation Plan Updated',
      description: 'New evacuation routes added for River District',
      severity: 'medium',
      timestamp: '1 hour ago'
    },
    {
      id: 3,
      type: 'message',
      title: 'Emergency Broadcast',
      description: 'All residents in Industrial Park area should stay indoors',
      severity: 'high',
      timestamp: '2 hours ago'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'alert': return <WarningIcon />;
      case 'plan': return <AssignmentIcon />;
      case 'message': return <MessageIcon />;
      default: return <WarningIcon />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Crisis Communicator Dashboard
        </Typography>
        <Box>
          <Tooltip title="Refresh Data">
            <IconButton>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Alerts</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>{stats.alerts}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                color="error" 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Emergency Plans</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>{stats.plans}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={60} 
                color="primary" 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MessageIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Messages Sent</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>{stats.messages}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={90} 
                color="info" 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 1 }}>
                  {stats.teamMembers}
                </Avatar>
                <Typography variant="h6">Team Members</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>{stats.teamMembers}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={80} 
                color="success" 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Activities</Typography>
                <Button 
                  component={Link} 
                  to="/monitoring" 
                  variant="contained" 
                  color="primary" 
                  startIcon={<WarningIcon />}
                >
                  New Alert
                </Button>
              </Box>

              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: `${getSeverityColor(activity.severity)}.main` }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1">{activity.title}</Typography>
                            <Chip 
                              label={activity.severity.toUpperCase()} 
                              color={getSeverityColor(activity.severity)}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {activity.description}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {activity.timestamp}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 