# Guidance Counseling Portal - Cavite State University CCAT

This is a comprehensive web application designed to streamline the guidance and counseling services at Cavite State University - CCAT Campus. It provides a secure and efficient platform for students to interact with the guidance counselor, manage appointments, and access important resources.

## ✨ Features

### For Students
- **Secure Registration & Login**: Students can register with their student number and create a secure profile.
- **Password Reset**: A secure, multi-step password reset process using security questions.
- **Dashboard**: A central hub for students to see notifications and navigate the portal.
- **Appointment Scheduling**: Request appointments with the guidance counselor.
- **Form Submissions**: Fill out and submit guidance forms (e.g., Student Profile, Counseling Intake) electronically.
- **Real-time Chat**: Secure, one-on-one chat with the admin/counselor.
- **Resource Access**: View and download resources shared by the guidance office.

### For Administrators (Guidance Counselor)
- **Admin Dashboard**: An overview of recent activities, appointments, and student sign-ups.
- **Student Management**: View a list of all registered students and their profiles.
- **Appointment Management**: View, approve, or reschedule student appointment requests.
- **Form Management**: Upload new form templates (.docx) which are automatically parsed.
- **Submission Review**: View and filter all student form submissions. Submitted forms are stored as PDFs.
- **Real-time Chat**: Manage multiple student conversations from a central interface.
- **Resource Management**: Upload and manage resources available to students.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Real-time Communication**: Socket.IO
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Cloudinary (for form templates and PDF submissions)
- **Form Processing**: `mammoth` for reading .docx templates, `pdf-lib` for generating PDFs.
- **Styling**: CSS

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn
- MongoDB (local instance or a cloud service like MongoDB Atlas)
- A Cloudinary account for file storage.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/osasguidancecounselling-spec/Guidance-Website.git
    cd Guidance-Website
    ```

2.  **Install server dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install client dependencies:**
    ```bash
    cd ../client
    npm install
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the `server` directory and add the following variables:

    ```env
    # Server Configuration
    PORT=5000
    NODE_ENV=development

    # MongoDB Connection
    MONGO_URI=your_mongodb_connection_string

    # JWT Secret
    JWT_SECRET=your_super_secret_jwt_key

    # Cloudinary Credentials
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # Client URL for CORS
    CLIENT_URL=http://localhost:5173
    ```

### Running the Application

1.  **Start the backend server:**
    ```bash
    # From the server directory
    npm run dev
    ```

2.  **Start the frontend client:**
    ```bash
    # From the client directory
    npm run dev
    ```

The application should now be running at `http://localhost:5173`.

## ☁️ Deployment

This application is configured for easy deployment to Render using the `render.yaml` file in the root directory.

### Steps to Deploy on Render

1.  **Fork this repository** to your own GitHub account.
2.  Go to the Render Dashboard and create a new **Blueprint**.
3.  Connect the GitHub repository you just forked. Render will automatically detect and use the `render.yaml` file.
4.  **Add Secret Environment Variables:** Before the first deployment, you must manually add the following environment variables in the Render dashboard for your `guidance-counseling-api` service.
    -   `MONGO_URI`: Your MongoDB connection string.
    -   `JWT_SECRET`: A long, random, and secret string for signing tokens.
    -   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
    -   `CLOUDINARY_API_KEY`: Your Cloudinary API key.
    -   `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.

5.  Render will automatically build and deploy both the backend API and the frontend static site. The services will be linked, and the correct URLs will be injected as environment variables.