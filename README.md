# Universal File Converter SaaS

A production-ready SaaS application built with Next.js 15, TypeScript, Tailwind CSS, MongoDB, and Cloudinary for seamless file conversion.

## 🚀 Architecture Overview

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Next.js API Routes (Serverless)
- **Database**: MongoDB Atlas (Mongoose) - Stores conversion metadata and status, no actual files.
- **Storage**: Cloudinary - Cloud-based asset management for secure, temporary file holding.
- **Styling**: Tailwind CSS configured with a modern SaaS color palette.

## 📁 Project Structure

```
/src
  /app                  # Next.js App Router pages and API routes
  /components
    /layout             # Navbar, Footer
    /ui                 # Reusable UI components (Button, Card, etc.)
  /lib
    /mongodb            # MongoDB connection utility
    /cloudinary         # Cloudinary integration
  /models               # Mongoose schemas (Conversion)
  /utils                # Utility functions (cn for Tailwind)
```

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js 18+
- MongoDB Atlas Account (Free tier works)
- Cloudinary Account (Free tier works)

### 2. Environment Variables

Create a `.env.local` file in the root of the project using the provided `.env.example` as a template:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/universal-file-converter
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Installation

```bash
npm install
```

### 4. Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## ☁️ Deployment to Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add all variables from your `.env.local` file.
5. Click **Deploy**.

Vercel will automatically detect Next.js and configure the build settings.

## 🔄 File Retention System

The MongoDB schema uses a TTL (Time-To-Live) index on the `expiresAt` field. By default, records are set to expire 24 hours after creation, and MongoDB will automatically delete them. 

To clean up the actual files in Cloudinary, you should configure a **Media Library Upload Preset** or use a scheduled background task to delete assets older than 1 day using the Cloudinary Admin API.

## 🔮 Future Expansion

The architecture is designed to support:
- User Authentication (NextAuth.js or Clerk)
- Stripe Subscriptions (Limits on file size/count)
- Background Queue Workers (using Redis or Upstash) for heavy conversions.
