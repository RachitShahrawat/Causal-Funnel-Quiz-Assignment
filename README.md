# React Quiz Application - CausalFunnel Internship Task

**Hosted Link:** [PASTE YOUR VERCEL LINK HERE]

## 🚀 Overview
A responsive, feature-rich quiz application built with React.js and Tailwind CSS. The app features a 30-minute timer, question navigation (Attempted/Visited logic), and a detailed report card.

## 🛠 Tech Stack
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS + Framer Motion (Animations)
* **State Management:** React Context API
* **Language:** JavaScript (ES6+)

## ⚙️ Setup Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local server.

## 🧠 Assumptions & Challenges
* **API Stability:** The OpenTDB API frequently limits requests or times out.
* **The Fix:** I implemented a **Robust Fallback System**. If the API fails or takes longer than 4 seconds, the app automatically switches to a local dataset. This ensures the reviewer (you) can always test the app without getting stuck on a loading screen.
* **Timer Logic:** The timer persists across questions but resets on a full page reload (browser refresh).

## ✨ Bonus Features
* **Mobile Responsiveness:** Sidebar toggles on small screens.
* **Animations:** Smooth question transitions and confetti on completion.
* **Validation:** Email input is validated before starting.

