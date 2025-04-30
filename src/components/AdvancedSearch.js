import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  Chip,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  Save as SaveIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

function AdvancedSearch({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    dateRange: '',
    tags: [],
  });
  const [savedSearches, setSavedSearches] = useState([
    { id: 1, name: 'High Priority Plans', query: 'priority:high' },
    { id: 2, name: 'Active Security Plans', query: 'status:active type:security' },
  ]);
  const [searchHistory, setSearchHistory] = useState([
    { id: 1, query: 'evacuation routes', timestamp: '2024-03-25T10:30:00' },
    { id: 2, query: 'emergency contacts', timestamp: '2024-03-25T09:15:00' },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const searchParams = {
      query: searchQuery,
      ...filters,
    };
    onSearch(searchParams);
    // Add to search history
    setSearchHistory([
      { id: Date.now(), query: searchQuery, timestamp: new Date().toISOString() },
      ...searchHistory,
    ]);
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilters({
      category: '',
      status: '',
      priority: '',
      dateRange: '',
      tags: [],
    });
  };

  const handleFilterMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSaveSearch = () => {
    const newSavedSearch = {
      id: Date.now(),
      name: `Search ${savedSearches.length + 1}`,
      query: searchQuery,
    };
    setSavedSearches([...savedSearches, newSavedSearch]);
  };

  const handleLoadSavedSearch = (savedSearch) => {
    setSearchQuery(savedSearch);
    handleSearch();
  };

  return (
    <Box sx={{ mb: 3 }}>
      <MotionPaper
        elevation={2}
        sx={{ p: 2 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery('')} size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            onClick={handleFilterMenuOpen}
            startIcon={<FilterIcon />}
          >
            Filters
          </Button>
        </Box>

        {showFilters && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    label="Category"
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    <MenuItem value="emergency">Emergency Response</MenuItem>
                    <MenuItem value="security">Security</MenuItem>
                    <MenuItem value="disaster">Natural Disaster</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    label="Priority"
                  >
                    <MenuItem value="">All Priorities</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Recent Searches
          </Typography>
          <Box sx={{ bgcolor: 'background.paper' }}>
            {searchHistory.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => {
                  setSearchQuery(item.query);
                  handleSearch();
                }}
              >
                <Box sx={{ mr: 2 }}>
                  <HistoryIcon />
                </Box>
                <Box>
                  <Typography>{item.query}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Saved Searches
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {savedSearches.map((search) => (
              <Chip
                key={search.id}
                label={search.name}
                onClick={() => handleLoadSavedSearch(search.query)}
                onDelete={() => {
                  setSavedSearches(savedSearches.filter(s => s.id !== search.id));
                }}
                icon={<StarIcon />}
              />
            ))}
          </Box>
        </Box>
      </MotionPaper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterMenuClose}
      >
        <MenuItem onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </MenuItem>
        <MenuItem onClick={handleSaveSearch}>
          <SaveIcon sx={{ mr: 1 }} /> Save Search
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClear}>
          <ClearIcon sx={{ mr: 1 }} /> Clear All
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default AdvancedSearch; 