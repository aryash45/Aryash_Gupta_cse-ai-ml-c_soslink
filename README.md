# 🚨 Crisis Communicator

**Crisis Communicator** is a comprehensive emergency management platform that combines real-time communication, plan management, and team collaboration features. Built with React and Firebase, it provides a robust solution for managing crisis situations effectively.

---

## 📽️ Video Explanation

🎥 [Click here to watch the demo video](#)  
<!-- Replace # with actual YouTube or Google Drive video link -->

---

## 👥 Team Members

- Aryash Gupta (roll no-2401730021)
- Piyush  (roll no-2401730018)
- Piyush Singh  (roll no-2401730288)
- Garvit Pant (roll no -2401730088)

---

## ⚙️ Development Setup

### 1. Prerequisites
- [Bun](https://bun.sh/) (v1.0 or higher)
- Firebase project (if testing full functionality)

### 2. Installation & Running the App
```bash
# Clone the repository
git clone https://github.com/yourusername/crisis-communicator.git

# Navigate into the project folder
cd crisis-communicator

# Install dependencies using Bun
bun install

# Start the development server
bun react-scripts start
```

> ✅ The app will be available at: `http://localhost:3000`

---

## 🔑 Firebase Setup (Optional for full functionality)

Create a `.env` file in the root directory with your Firebase credentials:

```
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_DATABASE_URL=your_db_url
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_APP_ID=your_app_id
```

---

## 🌟 Key Features

### 1. 🧩 Emergency Plan Management
- Create, edit, and manage emergency response plans
- Rich text editor for detailed descriptions
- File attachments and document storage
- Progress tracking and priority status
- Team assignment and responsibility tracking

### 2. 💬 Real-time Collaboration
- @Mentions and threaded replies
- File sharing and activity feed
- Team member roles and permissions
- Notifications and comment editor

### 3. 🔍 Advanced Search and Filtering
- Full-text plan search
- Filters by status, category, priority
- Saved searches and tag-based organization
- Quick filters for fast access

### 4. 🖥️ User Interface
- Modern, responsive design
- Smooth transitions (Framer Motion)
- Mobile-friendly layout
- Real-time updates and progress indicators

### 5. 👥 Team Management
- Role-based access control
- Team member profiles
- Activity tracking and collaboration tools

---

## 🔧 Tech Stack

### Frontend
- **React.js** – UI framework
- **Material-UI** – Component library
- **Framer Motion** – Animations
- **React Quill** – Rich text editing
- **Bun** – Fast JavaScript runtime and package manager

### Backend (Firebase)
- **Authentication** – User login/signup
- **Realtime Database** – Plan and collaboration data
- **Firebase Storage** – File attachments
- **Hosting** – Optional for deployment

---

## 🚀 Deployment Options

### Firebase Hosting
```bash
bun run build
firebase deploy
```

### Netlify
- Connect repository
- Build command: `bun run build`
- Publish directory: `build`

### Vercel
- Import your GitHub repo
- It handles auto-deployment on push

---

## 🔐 Security Considerations

- Role-based access control
- Authentication & authorization
- Secure file storage
- Audit logs
- Data encryption and regular updates

---

## 🔮 Future Enhancements

- 📱 Mobile app (iOS & Android)
- 📊 Advanced analytics dashboard
- 🌦️ Weather/social media API integration
- 🧪 Virtual crisis training & simulation

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Push to your branch  
5. Open a Pull Request

---

## 📄 License

Licensed under the **MIT License** – see the `LICENSE` file for full details.

---


