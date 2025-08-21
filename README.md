SecureDocAI
SecureDocAI is an all-in-one platform designed to eliminate digital chaos and act as your single source of truth. It provides a secure, intelligent hub for individuals and teams to manage, edit, and gain insights from all their files—from business contracts and financial receipts to medical records and creative projects. Interact with your documents via an AI-powered chat to get summaries, find answers, and automate your workflow.

Key Features
Universal Document Hub: Upload files of any type or connect to existing services like Google Drive and Dropbox to manage everything in one place.

AI-Powered Intelligence: Chat with your documents, get instant summaries, extract key data, and let the AI automatically tag and organize your entire library.

Real-Time Collaborative Editor: Edit documents with your team in real-time using a powerful and intuitive editor, similar to Notion or Google Docs.

Team Workspaces: Create secure spaces for teams to collaborate, chat, and share knowledge around your documents.

Smart Questionnaires: Build and deploy intelligent forms for client onboarding, research, health assessments, and more.

Privacy and Security First: Designed to give you complete control and ownership of your data with robust security and self-hosting options.

## Tech Stack

- **Frontend**: React 19, TypeScript, Redux Toolkit
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Form Handling**: React Hook Form with Zod for validation
- **Testing**: Vitest for unit tests and Playwright for end-to-end testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/securedocaiapp.git
   cd securedocaiapp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the necessary environment variables.

### Development

- **Run the development server**:
  ```bash
  npm run dev
  ```
  The application will be available at `http://localhost:5173`.

- **Run tests**:
  ```bash
  npm run test
  ```

- **Run end-to-end tests**:
  ```bash
  npx playwright test
  ```

- **Lint the codebase**:
  ```bash
  npm run lint
  ```

## License

This project is licensed under the MIT License.