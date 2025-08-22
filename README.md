SecureDocAI

SecureDocAI is an all-in-one platform designed to eliminate digital chaos and act as your single source of truth. It provides a secure, intelligent hub for individuals and teams to manage, edit, and gain insights from all their files—from business contracts and financial receipts to medical records and creative projects. Interact with your documents via an AI-powered chat to get summaries, find answers, and automate workflows.

While broadly useful for teams and individuals, SecureDocAI is especially designed for healthcare applications, streamlining patient onboarding, medical document management, and personalized health assessments.

Key Features

Universal Document Hub: Upload files of any type or connect to services like Google Drive and Dropbox to manage everything in one place.

AI-Powered Intelligence: Chat with your documents, get instant summaries, extract key data, and let the AI automatically tag and organize your library.

Real-Time Collaborative Editor: Edit documents with your team in real-time using a powerful editor, similar to Notion or Google Docs.

Team Workspaces: Create secure spaces for teams to collaborate, chat, and share knowledge around your documents.

Smart Questionnaires: Build and deploy intelligent forms for onboarding, research, health assessments, and more.

Healthcare-Specific Tools:

Patient health questionnaires (customizable, multi-page)

Secure medical document uploads & management

AI-driven patient insights and dynamic report generation

Partner integrations with healthcare providers (e.g., Fullscript, PureInsight)

User Management: Robust authentication, user profiles, and role-based access control.

Privacy & Security First: Complete control and ownership of your data with robust security and self-hosting options.

Tech Stack

Frontend: React 19, TypeScript, Redux Toolkit

Build Tool: Vite

Routing: React Router v7

Form Handling: React Hook Form with Zod for validation

Testing: Vitest (unit tests) and Playwright (end-to-end)

Getting Started
Prerequisites

Node.js (v18 or higher)

npm (v9 or higher)

Installation
git clone https://github.com/your-repo/securedocaiapp.git
cd securedocaiapp
npm install

Environment Variables

Create a .env file in the project root and configure required environment variables.

Development
npm run dev        # Start dev server (http://localhost:5173)
npm run test       # Run unit tests
npx playwright test # Run end-to-end tests
npm run lint       # Lint the codebase

License

This project is licensed under the MIT License.