# 📝 Blogging Platform (MERN)

A full-stack blogging platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Users can sign up, publish posts, comment, like, and manage their blogs—all with a smooth, intuitive interface.

---

## 🛠 Tech Stack

| Layer       | Tools & Technologies              |
|-------------|-----------------------------------|
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT |
| **Frontend**| React.js, Vite (or CRA), Tailwind CSS or CSS |
| **Auth**    | JSON Web Tokens (JWT), bcrypt hashing |
| **Extras**  | Rich Text Editor |

---

## ✨ Features

- ✅ User Registration & Secure Login (JWT)
- 🖋️ Create, Read, Update, Delete Blog
- 🖋️ Create Blog using Rich Text Editor
- 💬 Comment on Blog
- ❤️ Like / Unlike Blog
- 🔍 Search & Filter blog
- 🛠️ Edit or Delete your own blog
- 🔐 Protected Routes for users-only areas
- ☁️ MongoDB Atlas Integration (or local MongoDB)

---

## 📁 Project Structure

```
blogging-platform/
├── backend/        # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/       # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── public/
└── README.md
```

---

## ⚙️ Environment Variables

### Backend – `backend/.env`

```env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
CLOUDINARY_URL=optional-if-uploading-images
```

### Frontend – `frontend/.env.local`

```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Installation & Setup

```bash
git clone https://github.com/hardik-gojiya/blogging-platform.git
cd blogging-platform
```

### 🌀 Backend

```bash
cd backend
npm install
# Add .env as above
npm run dev
```

### 🌀 Frontend

```bash
cd ../frontend
npm install
# Add .env.local as above
npm run dev
```

Your apps will be running at:

- **Frontend**: http://localhost:5173 (or CRA default)
- **Backend**: http://localhost:5000

---

## 🔄 API Endpoints & Routes

| Method | Path                       | Description                      |
|--------|----------------------------|----------------------------------|
| POST   | `/auth/register`           | Register a new user              |
| POST   | `/auth/login`              | Login & receive JWT              |
| GET    | `/posts`                   | Fetch all posts                  |
| POST   | `/posts`                   | Create a new post (auth only)    |
| GET    | `/posts/:id`               | View a specific post             |
| PUT    | `/posts/:id`               | Update your own post             |
| DELETE | `/posts/:id`               | Delete your own post             |
| POST   | `/posts/:id/comment`       | Comment on a post (auth only)    |
| POST   | `/posts/:id/like`          | Like/Unlike a post (auth only)   |

---

## 🧭 Roadmap

- [ ] Add image upload with Cloudinary  
- [ ] Edit & delete comments  
- [ ] Pagination & search  
- [ ] User profiles with avatars  
- [ ] Docker support & CI/CD  
- [ ] Deploy to Vercel/Heroku/Render  

---

## 🤝 Contributing

- Fork the repository  
- Create a feature branch  
- Commit your changes  
- Submit a PR! 🛠️

---

## 🧑‍💻 Author

**Hardik Gojiya**  
🔗 GitHub: [@hardik-gojiya](https://github.com/hardik-gojiya)  
🌐 Portfolio: [hardik-gojiya-portfolio.netlify.app](https://hardik-gojiya-portfolio.netlify.app)

---
