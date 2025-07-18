
# 🎯 IntelliView: AI-Powered Interview Platform

IntelliView is an intelligent, full-stack interview platform that records audio and video responses from candidates, stores them securely, and provides an admin dashboard for reviewing and managing interviews. Ideal for hiring teams who want to automate and scale their initial screening process with AI assistance.

---

<img width="1920" height="907" alt="Screenshot (280)" src="https://github.com/user-attachments/assets/371b827d-483e-428d-8169-34d7cbee6e24" />


## 🚀 Features

- 🎥 **Webcam + Microphone Recording** (using MediaRecorder API)
- ☁️ **Firebase Integration** for authentication, Firestore database, and storage
- 📤 **Cloudinary Uploads** for high-speed media storage and CDN access
- 📋 **Metadata Storage** in Firestore (timestamps, candidate info, interview data)
- 📄 **PDF Report Generation** post interview
- 📊 **Admin Analytics Dashboard** with filters, download, and insights
- 🔐 **Secure API Key Handling** with `.env.local`

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), React, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage), Cloudinary API
- **Media Handling**: MediaRecorder API, Blob handling, base64 conversion
- **PDF Generation**: jsPDF / react-pdf (based on your choice)
- **Deployment**: Vercel (optional)
---

## ⚙️ Getting Started (Run Locally)

### 1. Clone the Repository

```bash
git clone https://github.com/adwait-bhavthankar/intelliview.git
cd intelliview
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file at the root:

```env
# Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to view the app.

---

## 📦 Deployment (Optional)

You can deploy this project seamlessly on [Vercel](https://vercel.com):

1. Push your repo to GitHub
2. Import to Vercel
3. Set up environment variables on the Vercel dashboard
4. Deploy 🚀

---

## 🧠 Future Enhancements

- 💬 AI question generation using LLMs (OpenAI / Mistral / Gemini)
- 🧠 NLP-based semantic analysis of responses
- ✅ Auto-evaluation and match scoring
- 📈 Interview analytics with charts
- 🔎 Smart search and tagging in admin panel

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT License © 2025 Adwait Bhavthankar

---

## 🙌 Credits

- Developed by Adwait Bhavthankar
- Powered by Firebase, Cloudinary, and Next.js
