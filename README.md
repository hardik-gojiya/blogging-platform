
# ✍️ Writly – Modern Blogging Platform

[![License](https://img.shields.io/github/license/hardik-gojiya/blogging-platform?color=blue)](LICENSE)
[![Issues](https://img.shields.io/github/issues/hardik-gojiya/blogging-platform)](https://github.com/hardik-gojiya/blogging-platform/issues)
[![Forks](https://img.shields.io/github/forks/hardik-gojiya/blogging-platform)](https://github.com/hardik-gojiya/blogging-platform/network)
[![Stars](https://img.shields.io/github/stars/hardik-gojiya/blogging-platform)](https://github.com/hardik-gojiya/blogging-platform/stargazers)

**Writly** is a fully featured blogging platform built with the **MERN stack**, designed for writers, creators, and readers. It offers a rich writing experience, profile management, likes, comments, blog saving, and more — all wrapped in a clean, responsive interface.

---

## 🚀 Features

- ![write](https://img.icons8.com/material-outlined/24/write.png) Write, edit, and delete blogs with Markdown support  
- ![lock](https://img.icons8.com/material-outlined/24/lock.png) JWT-based user authentication  
- ![save](https://img.icons8.com/material-outlined/24/bookmark-ribbon.png) Save/unsave blogs for later  
- ![like](https://img.icons8.com/material-outlined/24/like--v1.png) Like and comment on blogs  
- ![search](https://img.icons8.com/material-outlined/24/search--v1.png) Search and filter by tags  
- ![user](https://img.icons8.com/material-outlined/24/user.png) View public and personal profile pages  
- ![publish](https://img.icons8.com/material-outlined/24/upload.png) Blog publish and draft control  
- ![responsive](https://img.icons8.com/material-outlined/24/device.png) Fully responsive UI (mobile + desktop)  
- ![sync](https://img.icons8.com/material-outlined/24/synchronize.png) Real-time UI updates with React Query  
- ![toast](https://img.icons8.com/material-outlined/24/appointment-reminders--v1.png) Toast notifications for user feedback

---

## 🛠️ Tech Stack

**Frontend**  
- React 18 + Vite  
- Tailwind CSS  
- React Router  
- React Query  
- Context API

**Backend**  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT + bcrypt  
- Nodemailer

---

## 🗂️ Project Structure

```
blogging-platform/
│
├── client/                 # React frontend
│   ├── components/         # Reusable UI components
│   ├── context/            # Auth & Blog contexts
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Routes (Home, Blog, Profile, etc.)
│   ├── services/           # API utilities (axios)
│   └── App.jsx
│
├── server/                 # Express backend
│   ├── controllers/        # Logic for handling routes
│   ├── models/             # MongoDB schemas
│   ├── routes/             # REST API endpoints
│   ├── middlewares/        # Auth, error handling
│   └── index.js
│
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hardik-gojiya/blogging-platform.git
cd blogging-platform
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:5173
```

Run the backend server:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create the `.env` file in `/server` and configure:

```env
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:5173
```

---

## 🖼 Screenshots

Add screenshots here for:
- Homepage
- Blog Editor
- Blog Details
- Profile Page

---

## 📌 To-Do / Upcoming Features

- 🌙 Dark Mode  
- 🔔 Notification System  
- 🤖 AI Blog Assistant  
- 📊 Admin Dashboard  
- 🌍 Multi-language Support

---

## 👨‍💻 Author

**Hardik Gojiya**  
📧 [hardikgojiya143@gmail.com](mailto:hardikgojiya143@gmail.com)  
🔗 [GitHub](https://github.com/hardik-gojiya)

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome!  
To contribute:

1. Fork the repo  
2. Create a new branch (`git checkout -b feature-name`)  
3. Commit your changes (`git commit -m "Added feature"`)  
4. Push to the branch (`git push origin feature-name`)  
5. Open a Pull Request ✅

---

## ⭐ Support

If you found this project helpful or inspiring, please give it a ⭐ on GitHub! It motivates and helps others discover the project too.
