# QUIZZ_ME

QUIZZ_ME is an AI-powered desktop application designed to facilitate learning through interactive quizzes. By leveraging artificial intelligence, it can generate quizzes on any subject you provide, making it a powerful tool for students, hobbyists, or anyone looking to test their knowledge.

## Features

- **Dynamic Quiz Generation**: Powered by the Groq API (using Llama 3), generate quizzes on any topic instantly.
- **Difficulty Levels**: Choose between Easy, Good, and Hardcore to match your learning pace.
- **Modern Aesthetic**: A sleek, neon-inspired dark theme designed for a premium user experience.
- **Cross-Platform**: Built with Tauri for a lightweight and fast desktop application.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend/Desktop Layer**: Tauri (Rust)
- **AI Integration**: Groq API (gsk-...)

## Installation

To get started with the development environment:

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd Quizz_me
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Key**:
   Create a `.env` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```

## Running the Application

### Development Mode

To launch the application in development mode with hot-reloading:

```bash
npm run tauri dev
```

### Building for Production

To create a production-ready installer:

```bash
npm run tauri build
```

## Architecture & Code Style

### Project Structure

- `src/`: Contains the React frontend logic and components.
  - `components/`: Modular UI components (HUD, Quiz, Result).
  - `App.tsx`: Main application state management and routing.
- `src-tauri/`: Contains the Rust backend logic, responsible for secure API calls and system integrations.

### Coding Philosophy

The project follows modern best practices:

- **Type Safety**: TypeScript is used throughout the project to ensure robust code and catch errors early.
- **Functional Components**: React functional components with Hooks (useState, useEffect) are used for clean and maintainability.
- **Aesthetic First**: A custom design system was implemented using Tailwind CSS to provide a unique, "cyberpunk" style that stands out from generic applications.
- **Separation of Concerns**: UI logic is kept in React, while sensitive operations (like API calls and file saving) are handled by the Rust backend for security and performance.

## License

[MIT](LICENSE)
