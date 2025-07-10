# ✍️ Writly – Modern Blogging Platform

[![License](https://img.shields.io/github/license/hardik-gojiya/blogging-platform?color=blue)](LICENSE)
[![Issues](https://img.shields.io/github/issues/hardik-gojiya/blogging-platform)](https://github.com/hardik-gojiya/blogging-platform/issues)
[![Forks](https://img.shields.io/github/forks/hardik-gojiya/blogging-platform)](https://github.com/hardik-gojiya/blogging-platform/network)
[![Stars](https://img.shields.io/github/stars/hardik-gojiya/blogging-platform)](https://github.com/hardik-gojiya/blogging-platform/stargazers)

**Writly** is a modern, full-featured blogging platform built with the MERN stack. It allows users to write, publish, bookmark, and explore blogs with a beautiful, fast, and responsive UI.

---

## 🚀 Features

- 📝 Create, edit & delete blogs with Markdown support
- 🔐 User registration & JWT-based login
- 💾 Save/unsave blogs
- ❤️ Like & comment on blogs
- 🔍 Search & explore blogs by tags
- 🧑‍💻 User profile pages (yours & others)
- 📌 Admin features like publish/unpublish
- 💬 Realtime feedback via toast messages
- 🌐 Fully responsive UI with Tailwind CSS

---

## 🛠 Tech Stack

### Frontend:
- ⚛️ React 18 + Vite
- 🌪 Tailwind CSS
- 🔄 React Query
- 🔐 JWT Auth
- 🧠 Context API

### Backend:
- 🟢 Node.js
- ⚡ Express.js
- 🗃 MongoDB + Mongoose
- 🔐 JWT, bcrypt
- 📩 Nodemailer

---

## 📁 Folder Structure

blogging-platform/
│
├── client/ # React frontend
│ ├── components/ # Shared UI components
│ ├── context/ # Auth & Blog context
│ ├── hooks/ # Custom hooks
│ ├── pages/ # Routes (Home, Blog, etc.)
│ ├── services/ # API utils
│ └── App.jsx
│
├── server/ # Express backend
│ ├── controllers/ # Logic handlers
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API endpoints
│ ├── middlewares/ # Auth + error handling
│ └── index.js
│
└── README.md

yaml
Copy
Edit

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/hardik-gojiya/blogging-platform.git
cd blogging-platform
2. Install server dependencies
bash
Copy
Edit
cd server
npm install
Create a .env file in /server and add:

ini
Copy
Edit
MONGO_URI=your_mongo_db_url
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:5173
Then run the server:

bash
Copy
Edit
npm run dev
3. Install client dependencies
bash
Copy
Edit
cd ../client
npm install
npm run dev
🖼 Screenshots
Add screenshots here of your home page, blog view, editor, and profile page for better presentation.

📌 Upcoming Features
🌙 Dark Mode

🔔 Notifications

✍️ Rich text editor with preview

🧠 AI-based blog suggestions

📊 Admin dashboard

🌍 Internationalization (i18n)

🙋‍♂️ Author
Hardik Gojiya
📧 hardikgojiya143@gmail.com
🔗 GitHub Profile

📝 License
This project is licensed under the MIT License.
See the LICENSE file for more info.

🙌 Contribute
Feel free to fork this repo, raise issues, and create pull requests.
Check the issues page to get started.

⭐ Show Your Support
If you like the project, please consider starring ⭐ the repo — it really helps!

yaml
Copy
Edit

---

✅ You can now copy this **entire block** and paste it directly into your `README.md`.

Let me know if you want me to add:
- Shields for deployment (like Render/Vercel)
- A contributing section
- Dynamic per-blog SEO setup (with Helmet or SSR)








Ask ChatGPT
