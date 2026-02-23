# QUIZZ_ME - AI-Powered Intelligence Quizzer

**QUIZZ_ME** is a high-performance desktop application designed for interactive learning and knowledge testing. Leveraging the **Groq API** with **Llama 3**, it generates dynamic quizzes on any subject instantly. Built with **Tauri**, **Rust**, and **React**, it offers a lightweight, secure, and premium user experience.

## Summary
- [Description](#description)
- [Features](#features)
- [Difficulty Levels](#difficulty-levels)
- [AI Engine (Groq Integration)](#ai-engine-groq-integration)
- [Structure-Project](#structure-project)
- [Installation](#installation)
- [Technologies used](#technologies-used)
- [Authors](#authors)

---

## Description
QUIZZ_ME transforms any topic into a structured learning experience. Whether you're studying for an exam or just testing your general culture, the app generates 10 tailored questions with detailed feedback. By utilizing a Rust-based backend (Tauri), all API interactions and local data management are handled with maximum efficiency and security.

The application features a sleek, neon-inspired dark theme that prioritizes focus and visual excellence.

---

## Features
* **Dynamic Generation**: Instant quiz creation on any subject via Llama 3.
* **Intelligent Explanations**: Every answer (correct or incorrect) is followed by a pedagogical explanation.
* **Advanced Difficulty Logic**: Heuristics-driven prompt engineering to scale difficulty from "Easy" to "Hell".
* **Cross-Platform**: Lightweight desktop execution thanks to the Tauri framework.
* **Auto-Saving**: Quizzes are automatically saved locally for future reference.

---

## Difficulty Levels
The app features four distinct difficulty levels designed to challenge everyone from beginners to world-class experts.

| Mode | Target Audience | Logic |
| --- | --- | --- |
| **Easy** | Beginners | Basic concepts and straightforward questions. |
| **Good** | Intermediate | Standard knowledge with common terminology. |
| **Hardcore** | Professionals | Technical questions with highly plausible distractors. |
| **🔥 HELL** | World Experts | Extreme obscurity, 4 choices, and "cruel" technical nuances. |

---

## AI Engine (Groq Integration)
The "brain" of QUIZZ_ME is powered by the **Groq Llama-3-70b** model, chosen for its exceptional inference speed and technical accuracy.

* **Contextual Inference**: The prompt adapts dynamically to the chosen subject and level.
* **Strict JSON Output**: The Rust backend enforces schema validation to ensure quiz stability.
* **Distractor Refinement**: In higher difficulties, the AI is explicitly tasked with creating "evil" incorrect answers that mislead even experienced users.

---

## Structure-project
```
Quizz_me/
├── .env                # Groq API Configuration
├── data/               # Local quiz persistence (JSON)
├── src/                # Frontend (React 19 + TypeScript)
│   ├── components/     # Modular UI (HUD, Quiz, Result)
│   ├── App.tsx         # State management & Game loop
│   └── types.ts        # Shared interfaces
└── src-tauri/          # Backend (Rust)
    ├── src/            # API integration & File I/O
    └── tauri.conf.json # Desktop configuration
```

---

## Installation

### 1. Prerequisites
* **Operating System**: Windows, macOS, or Linux.
* **Environment**: [Rust stable](https://www.rust-lang.org/), [Node.js LTS](https://nodejs.org/).

### 2. Setup Procedure
Clone the repository:
```bash
git clone https://github.com/Loic2888/Quizz_me.git
cd Quizz_me
```

Install dependencies:
```bash
npm install
```

### 3. API Configuration
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Launch
Start the application in development mode:
```bash
npm run tauri dev
```

---

## Technologies Used
<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" height="40" alt="rust logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="typescript logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo" />
  <img width="12" />
  <img src="https://raw.githubusercontent.com/tauri-apps/tauri/dev/app-icon.png" height="40" alt="tauri logo" />
  <img width="12" />
  <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" height="40" alt="tailwind logo" />
</div>

---

## Authors
- [**Loïc Cerqueira**](https://github.com/Loic2888)
