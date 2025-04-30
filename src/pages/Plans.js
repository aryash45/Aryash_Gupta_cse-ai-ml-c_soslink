import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Snackbar,
  Alert,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Badge,
  Divider,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AttachFile as AttachFileIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Label as LabelIcon,
  Category as CategoryIcon,
  Check as CheckIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CollaborationPanel from '../components/CollaborationPanel';
import AdvancedSearch from '../components/AdvancedSearch';

const MotionCard = motion(Card, { forwardMotionProps: true });
const MotionButton = motion(Button, { forwardMotionProps: true });
const MotionChip = motion(Chip, { forwardMotionProps: true });

const planCategories = [
  'Emergency Response',
  'Security',
  'Natural Disaster',
  'Medical',
  'Infrastructure',
  'Environmental',
  'Cybersecurity',
  'Public Safety'
];

const teamMembers = [
  { id: 1, name: 'John Doe', role: 'Team Lead', avatar: 'JD' },
  { id: 2, name: 'Jane Smith', role: 'Security Expert', avatar: 'JS' },
  { id: 3, name: 'Mike Johnson', role: 'Emergency Coordinator', avatar: 'MJ' },
  { id: 4, name: 'Sarah Wilson', role: 'Medical Specialist', avatar: 'SW' },
];

function Plans() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [tags, setTags] = useState([]);
  const [plans, setPlans] = useState([
    {
      id: 1,
      title: 'Emergency Response Plan',
      description: 'Standard emergency response procedures for various crisis scenarios',
      status: 'active',
      lastUpdated: '2024-03-25',
      type: 'emergency',
      assignedTo: 'Emergency Team',
      progress: 85,
      priority: 'high',
      category: 'Emergency Response',
      tags: ['evacuation', 'first-aid', 'shelter'],
      team: [teamMembers[0], teamMembers[1]],
      attachments: ['response_protocol.pdf', 'evacuation_map.jpg'],
      comments: [
        { id: 1, author: 'John Doe', text: 'Updated evacuation routes', timestamp: '2024-03-25T10:30:00' },
        { id: 2, author: 'Jane Smith', text: 'Added new emergency contacts', timestamp: '2024-03-25T11:15:00' },
      ],
      starred: true,
    },
    {
      id: 2,
      title: 'Data Breach Protocol',
      description: 'Procedures for handling data security incidents',
      status: 'draft',
      lastUpdated: '2024-03-24',
      type: 'security',
      assignedTo: 'Security Team',
    },
    {
      id: 3,
      title: 'Natural Disaster Response',
      description: 'Guidelines for handling natural disasters',
      status: 'active',
      lastUpdated: '2024-03-23',
      type: 'disaster',
      assignedTo: 'Response Team',
    },
  ]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentUser] = useState({
    id: 1,
    name: 'John Doe',
    role: 'Team Lead',
    avatar: 'JD'
  });
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const handleOpenDialog = (plan = null) => {
    setSelectedPlan(plan);
    setDescription(plan?.description || '');
    setAttachments(plan?.attachments || []);
    setSelectedTeam(plan?.team || []);
    setTags(plan?.tags || []);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPlan(null);
  };

  const handleSavePlan = () => {
    const formData = new FormData(document.getElementById('plan-form'));
    const newPlan = {
      id: selectedPlan?.id || Date.now(),
      title: formData.get('title'),
      description: description,
      type: formData.get('type'),
      status: formData.get('status'),
      assignedTo: formData.get('assignedTo'),
      lastUpdated: new Date().toISOString().split('T')[0],
      progress: parseInt(formData.get('progress') || '0'),
      priority: formData.get('priority'),
      category: formData.get('category'),
      tags: tags,
      team: selectedTeam,
      attachments: attachments,
      starred: selectedPlan?.starred || false,
    };

    if (selectedPlan) {
      setPlans(plans.map(plan => plan.id === selectedPlan.id ? newPlan : plan));
      setSnackbar({ open: true, message: 'Plan updated successfully', severity: 'success' });
    } else {
      setPlans([...plans, newPlan]);
      setSnackbar({ open: true, message: 'Plan created successfully', severity: 'success' });
    }
    handleCloseDialog();
  };

  const handleDeletePlan = (id) => {
    setPlans(plans.filter(plan => plan.id !== id));
    setSnackbar({ open: true, message: 'Plan deleted successfully', severity: 'success' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'emergency': return <WarningIcon />;
      case 'security': return <AssignmentIcon />;
      case 'disaster': return <CheckCircleIcon />;
      default: return <AssignmentIcon />;
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setAttachments([...attachments, ...files.map(file => file.name)]);
  };

  const handleTagChange = (event, newValue) => {
    setTags(newValue);
  };

  const handleTeamChange = (event, newValue) => {
    setSelectedTeam(newValue);
  };

  const toggleStar = (planId) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, starred: !plan.starred } : plan
    ));
  };

  const handleSearch = (searchParams) => {
    // Filter plans based on search parameters
    const results = plans.filter(plan => {
      const matchesQuery = !searchParams.query || 
        plan.title.toLowerCase().includes(searchParams.query.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchParams.query.toLowerCase());
      
      const matchesCategory = !searchParams.category || 
        plan.category === searchParams.category;
      
      const matchesStatus = !searchParams.status || 
        plan.status === searchParams.status;
      
      const matchesPriority = !searchParams.priority || 
        plan.priority === searchParams.priority;
      
      return matchesQuery && matchesCategory && matchesStatus && matchesPriority;
    });
    
    setSearchResults(results);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Crisis Management Plans
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<CategoryIcon />}
            onClick={() => setActiveTab(1)}
          >
            Categories
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create New Plan
          </Button>
        </Stack>
      </Box>

      <AdvancedSearch onSearch={handleSearch} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
            <Tab label="All Plans" />
            <Tab label="Categories" />
            <Tab label="Starred" />
            <Tab label="Recent" />
          </Tabs>

          <Grid container spacing={3}>
            {(searchResults.length > 0 ? searchResults : plans).map((plan) => {
              if (!plan) return null;
              return (
                <Grid item xs={12} md={6} key={plan.id || Math.random()}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box display="flex" alignItems="center">
                          {getTypeIcon(plan.type || '')}
                          <Typography variant="h6" sx={{ ml: 1 }}>
                            {plan.title || ''}
                          </Typography>
                        </Box>
                        <IconButton onClick={() => toggleStar(plan.id)}>
                          {plan.starred ? <StarIcon color="primary" /> : <StarBorderIcon />}
                        </IconButton>
                      </Box>

                      <Typography color="textSecondary" gutterBottom>
                        {plan.description || ''}
                      </Typography>

                      <Box sx={{ mt: 2, mb: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={plan.progress || 0} 
                          sx={{ height: 8, borderRadius: 4, mb: 1 }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          Progress: {plan.progress || 0}%
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1} mb={2}>
                        <Chip 
                          label={(plan.status || '').toUpperCase()} 
                          color={getStatusColor(plan.status || '')}
                          size="small"
                        />
                        <Chip 
                          label={(plan.type || '').toUpperCase()} 
                          variant="outlined"
                          size="small"
                        />
                        <Chip 
                          label={(plan.priority || '').toUpperCase()} 
                          color={plan.priority === 'high' ? 'error' : 'default'}
                          size="small"
                        />
                      </Stack>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Category: {plan.category || ''}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {(plan.tags || []).map((tag, index) => (
                            <MotionChip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 0.5, mb: 0.5 }}
                              whileHover={{ scale: 1.05 }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AvatarGroup max={4} sx={{ mr: 2 }}>
                          {(plan.team || []).map((member) => (
                            <Tooltip key={member.id} title={`${member.name || ''} - ${member.role || ''}`}>
                              <Avatar>{member.avatar || ''}</Avatar>
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                        <Typography variant="caption" color="textSecondary">
                          {(plan.attachments || []).length} attachments
                        </Typography>
                      </Box>

                      <Typography variant="caption" color="textSecondary" display="block">
                        Last updated: {plan.lastUpdated || ''}
                      </Typography>
                    </CardContent>

                    <Divider />

                    <CardActions>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            handleOpenDialog(plan);
                            setSelectedPlanId(plan.id);
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Plan">
                        <IconButton size="small" onClick={() => handleOpenDialog(plan)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share">
                        <IconButton size="small">
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Plan">
                        <IconButton size="small" color="error" onClick={() => handleDeletePlan(plan.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </MotionCard>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          {selectedPlanId && (
            <CollaborationPanel 
              planId={selectedPlanId} 
              currentUser={currentUser} 
            />
          )}
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPlan ? 'Edit Plan' : 'Create New Plan'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" id="plan-form" sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Plan Title"
                  name="title"
                  margin="normal"
                  required
                  defaultValue={selectedPlan?.title}
                />
                
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Description
                  </Typography>
                  <Box sx={{ height: '200px', mb: '50px' }}>
                    <ReactQuill
                      theme="snow"
                      value={description}
                      onChange={setDescription}
                      style={{ height: '100%' }}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link', 'image'],
                          ['clean']
                        ]
                      }}
                    />
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  select
                  label="Plan Type"
                  name="type"
                  margin="normal"
                  defaultValue={selectedPlan?.type || 'emergency'}
                >
                  <MenuItem value="emergency">Emergency Response</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                  <MenuItem value="disaster">Natural Disaster</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  margin="normal"
                  defaultValue={selectedPlan?.status || 'draft'}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Priority"
                  name="priority"
                  margin="normal"
                  defaultValue={selectedPlan?.priority || 'medium'}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  margin="normal"
                  defaultValue={selectedPlan?.category || 'Emergency Response'}
                >
                  {planCategories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Progress"
                  name="progress"
                  type="number"
                  margin="normal"
                  defaultValue={selectedPlan?.progress || 0}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Team Members
                  </Typography>
                  <Autocomplete
                    multiple
                    options={teamMembers}
                    getOptionLabel={(option) => option.name}
                    value={selectedTeam}
                    onChange={handleTeamChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select team members"
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>{option.avatar}</Avatar>
                        {option.name}
                      </li>
                    )}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tags
                  </Typography>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={tags}
                    onChange={handleTagChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Add tags"
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Attachments
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AttachFileIcon />}
                    fullWidth
                  >
                    Upload Files
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleFileUpload}
                    />
                  </Button>
                  <List>
                    {attachments.map((file, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AttachFileIcon />
                        </ListItemIcon>
                        <ListItemText primary={file} />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" size="small">
                            <DownloadIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <MotionButton
            variant="contained"
            color="primary"
            onClick={handleSavePlan}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {selectedPlan ? 'Update' : 'Create'}
          </MotionButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Plans; 