# 🚀 NovaGen AI — Intelligent Content Generator

NovaGen AI is a full-stack AI-powered content generation platform that allows users to create high-quality articles, blogs, and social media posts using state-of-the-art Large Language Models (LLMs) like **Google Gemini**, **Groq LLaMA**, or **OpenAI GPT models**.

This project is designed with **modular AI model integration**, seamless frontend-backend communication, and a visually appealing UI. It supports model fallback handling, ensuring continuous uptime even when the preferred API is unavailable.

---

## 🧠 Features

- ⚡ **AI Content Generation** via Gemini, Groq, or OpenAI APIs  
- 🔄 **Automatic Fallback Handling** between available models  
- 🔐 **Environment Variable Security** using `.env` (ignored in git)  
- 🧩 **Modular Architecture** for easy model switching or extension  
- 🎨 **Beautiful UI** built with React + Tailwind CSS  
- 🗃️ **MongoDB Integration** for prompt and history storage  
- 🔑 **JWT Authentication** for secure user sessions  
- 💬 **Error Handling + Logging System**  
- 🌐 **Fully Responsive Frontend** (Desktop & Mobile)  

---

## 🧰 Tech Stack

### **Frontend**
- ⚛️ React.js (with Hooks and Context API)
- 🎨 Tailwind CSS (for modern, responsive design)
- 🌀 Axios (for API requests)
- ⚡ Framer Motion (for animations)
- 🔄 React Router DOM (for navigation)

### **Backend**
- 🟩 Node.js (JavaScript runtime)
- 🚀 Express.js (for REST API endpoints)
- 🔐 JWT (JSON Web Token Authentication)
- 🗃️ MongoDB + Mongoose (for data storage)
- 🌍 CORS + dotenv (environment and request configuration)
- 🪶 Multer / Body-Parser (for handling user inputs, if needed)

### **AI Integrations**
- 🤖 **Google Gemini API** — Advanced text generation  
- ⚙️ **Groq API** — Free, fast LLM alternative (supports LLaMA 3.1)  
- 🧩 **OpenAI API** — GPT-4/GPT-3.5 models (optional fallback)

### **Deployment**
- 🎯 Frontend → Vercel  
- ☁️ Backend → Render / Railway  
- 🗄️ Database → MongoDB Atlas  

---

## ⚙️ Project Architecture

```plaintext
Frontend (React + Tailwind)
   ↓ Axios Requests
Backend (Node + Express)
   ↓
AI Controller (Gemini / Groq / OpenAI)
   ↓
Response Handler → Frontend UI
   ↓
MongoDB (Store history, users, settings)
