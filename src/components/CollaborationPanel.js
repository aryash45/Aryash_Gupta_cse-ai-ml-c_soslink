import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
  Chip,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const MotionListItem = motion(ListItem);

function CollaborationPanel({ planId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [mentions, setMentions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  // Simulated team members data
  const teamMembers = [
    { id: 1, name: 'John Doe', role: 'Team Lead', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', role: 'Security Expert', avatar: 'JS' },
    { id: 3, name: 'Mike Johnson', role: 'Emergency Coordinator', avatar: 'MJ' },
  ];

  useEffect(() => {
    // Simulated initial comments
    setComments([
      {
        id: 1,
        author: teamMembers[0],
        text: 'Please review the evacuation routes in section 3.2',
        timestamp: new Date(Date.now() - 3600000),
        replies: [
          {
            id: 2,
            author: teamMembers[1],
            text: "I've reviewed and updated the routes. They look good now.",
            timestamp: new Date(Date.now() - 1800000),
          }
        ]
      }
    ]);
  }, [planId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: currentUser,
      text: newComment,
      timestamp: new Date(),
      replies: [],
    };

    setComments([...comments, comment]);
    setNewComment('');
    setReplyTo(null);
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
  };

  const handleMenuOpen = (event, comment) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComment(null);
  };

  const handleDelete = () => {
    if (selectedComment) {
      setComments(comments.filter(c => c.id !== selectedComment.id));
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedComment) {
      setNewComment(selectedComment.text);
      setReplyTo(null);
    }
    handleMenuClose();
  };

  const handleMention = (member) => {
    const mention = `@${member.name} `;
    setNewComment(prev => prev + mention);
    setMentions([...mentions, member]);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Collaboration
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Team Members
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {teamMembers.map(member => (
            <Chip
              key={member.id}
              avatar={<Avatar>{member.avatar}</Avatar>}
              label={member.name}
              onClick={() => handleMention(member)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ height: '400px', overflowY: 'auto', mb: 2 }}>
        {comments.map(comment => (
          <MotionListItem
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemAvatar>
                  <Avatar>{comment.author.avatar}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={comment.author.name}
                  secondary={formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                />
              </Box>
              <IconButton onClick={(e) => handleMenuOpen(e, comment)}>
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Typography variant="body1" sx={{ ml: 7, mb: 1 }}>
              {comment.text}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, ml: 7 }}>
              <Button
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => handleReply(comment.id)}
              >
                Reply
              </Button>
            </Box>

            {comment.replies && comment.replies.length > 0 && (
              <List sx={{ width: '100%', pl: 4 }}>
                {comment.replies.map(reply => (
                  <MotionListItem
                    key={reply.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <ListItemAvatar>
                      <Avatar>{reply.author.avatar}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={reply.author.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {reply.text}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
                          </Typography>
                        </>
                      }
                    />
                  </MotionListItem>
                ))}
              </List>
            )}
            <Divider sx={{ width: '100%', my: 1 }} />
          </MotionListItem>
        ))}
      </Box>

      <Box component="form" onSubmit={handleCommentSubmit}>
        <TextField
          fullWidth
          multiline
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
          variant="outlined"
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<AttachFileIcon />}
            size="small"
          >
            Attach File
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SendIcon />}
            disabled={!newComment.trim()}
          >
            {replyTo ? 'Reply' : 'Comment'}
          </Button>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
}

export default CollaborationPanel; 