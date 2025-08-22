# Guidance-Counseling-App – Complete Project Structure

```
c:/Users/kachi/guidance-counseling-app/
├── .gitignore
├── package-lock.json
├── package.json
├── setup.sh
├── TODO.md
├── bin/
│   └── atlas.exe
├── client/
│   ├── .eslintrc.js
│   ├── .gitignore
│   ├── cypress.config.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── jest.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   ├── cypress/
│   │   └── e2e/
│   │       └── auth.cy.js
│   ├── public/
│   │   ├── bg.jpg
│   │   ├── bg.png
│   │   ├── logo.png
│   │   └── vite.svg
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── setupTests.js
│       ├── __tests__/
│       │   └── components/
│       │       └── auth/
│       │           └── Login.test.jsx
│       ├── assets/
│       │   └── react.svg
│       ├── components/
│       │   ├── ChatBox.jsx
│       │   ├── Sidebar.jsx
│       │   ├── Topbar.jsx
│       │   ├── appointments/
│       │   │   └── Calendar.jsx
│       │   ├── auth/
│       │   │   └── ProtectedRoute.jsx
│       │   ├── chat/
│       │   │   └── ChatInterface.jsx
│       │   ├── common/
│       │   ├── forms/
│       │   │   ├── FormBuilder.jsx
│       │   │   └── FormRenderer.jsx
│       │   └── layout/
│       │       ├── DashboardLayout.jsx
│       │       ├── Header.jsx
│       │       └── Sidebar.jsx
│       ├── contexts/
│       │   ├── AuthContext.jsx
│       │   └── AuthProvider.jsx
│       ├── hooks/
│       │   └── useAuth.js
│       ├── pages/
│       │   ├── Appointments.jsx
│       │   ├── Forms.jsx
│       │   ├── NotFound.jsx
│       │   ├── Admin/
│       │   │   ├── AdminDashboard.css
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── AdminForms.jsx
│       │   │   ├── AdminFormViewer.css
│       │   │   ├── AdminFormViewer.jsx
│       │   │   ├── AdminSidebar.jsx
│       │   │   ├── AdminTopbar.jsx
│       │   │   ├── Announcements.jsx
│       │   │   ├── Appointments.jsx
│       │   │   ├── Chat.jsx
│       │   │   └── Students.jsx
│       │   ├── Auth/
│       │   │   ├── AdminForgotPassword.css
│       │   │   ├── AdminForgotPassword.jsx
│       │   │   ├── ForgotPassword.css
│       │   │   ├── ForgotPassword.jsx
│       │   │   ├── Login.css
│       │   │   ├── Login.jsx
│       │   │   ├── Signup.css
│       │   │   └── Signup.jsx
│       │   ├── Dashboard/
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── CounselorDashboard.jsx
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Home.jsx
│       │   │   └── StudentDashboard.jsx
│       │   ├── Forms/
│       │   ├── Shared/
│       │   │   └── AnswerForm.jsx
│       │   └── Student/
│       │       └── StudentFormsAnswer.jsx
│       ├── services/
│       │   ├── api.js
│       │   ├── appointmentService.js
│       │   ├── chatService.js
│       │   └── formService.js
│       ├── styles/
│       │   ├── custom.css
│       │   └── theme.css
│       └── utils/
│           └── validation.js
└── server/
    ├── index.js
    ├── package-lock.json
    ├── package.json
    ├── server.js
    ├── .env
    ├── answered_pdfs/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── formController.js
    ├── middleware/
    │   └── upload.js
    ├── models/
    ├── routes/
    │   ├── auth.routes.js
    │   ├── formRoutes.js
    │   └── index.js
    ├── scripts/
    │   └── addAdmin.js
    ├── submitted/
    └── uploads/
