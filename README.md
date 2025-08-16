# SecureDocAI

SecureDocAI is a secure healthcare document AI application designed to streamline patient onboarding, document management, and personalized health assessments. This platform allows patients to complete health questionnaires, upload medical documents, and interact with an AI-powered chat for insights.

## Key Features

- **Document Management**: Upload, view, and manage medical documents securely.
- **AI Chat**: An interactive chat interface for discussing document contents with AI.
- **Health Questionnaires**: A flexible system for creating and completing patient questionnaires.
- **User Management**: Robust authentication, user profiles, and role-based access control.
- **Report Generation**: Dynamically generate and view patient reports.
- **Partner Integrations**: Seamlessly connect with healthcare partners like Fullscript and PureInsight.

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
