<div align="center">

# ✨ Rajashekhar — Engineering & Creative Development Portfolio

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An interactive, physics-driven software engineering portfolio built with **React 19**, **TypeScript**, and **Three.js**. Engineered with a strong focus on spatial design, tactile physics micro-interactions, and 60 FPS performance optimization.

[🌐 Live Demo](https://rajashekhar.dev) · [🐙 GitHub Repository](https://github.com/rajashekharexe/Rajashekhar_Portfolio)

</div>

---

## 🚀 Key Highlights & Interactive Features

### 🪪 1. 3D Physics Lanyard & ID Badge (`/src/components/Lanyard.tsx`)
- **Physics Engine:** Powered by `@react-three/rapier` (Wasm-compiled Rapier physics).
- **Verlet Rope Dynamics:** Simulates a physical fabric lanyard using segmented rigid bodies linked by spherical joints (`useRopeJoint`).
- **UV Texture Atlasing:** Dynamically composites custom front and back badge graphics onto a single 3D `.glb` mesh with zero aspect ratio distortion.
- **Kinetic Interaction:** Real-time mouse raycasting enables users to grab, throw, and swing the ID badge with realistic inertia and restitution.

### 🧲 2. Kinetic Text Repel Engine (`/src/components/TextRepel.tsx`)
- Letters organically scatter away from the cursor using continuous Euclidean distance & angle vector calculations ($d = \sqrt{\Delta x^2 + \Delta y^2}$, $\theta = \text{atan2}(\Delta y, \Delta x)$).
- **Anti-Thrashing Cache:** Letter anchor coordinates are cached in `useRef` instances, eliminating repeated `getBoundingClientRect()` DOM queries and preserving smooth frame rates.

### 💻 3. Interactive Unix Terminal (`/src/components/Terminal.tsx`)
- Functional in-browser shell featuring command parsing, autocomplete (Tab), history navigation buffer (Up/Down arrows), and Web Audio API-driven keyboard acoustics.
- Built-in command suite (`whoami`, `skills`, `projects`, `experience`, `contact`, `clear`).

### 📊 4. Real-Time GitHub Contributions Graph (`/src/components/GitHubStats.tsx`)
- Fetches live 365-day commit history dynamically via REST API.
- Re-chunks daily activity arrays into a synchronized weekly matrix with responsive layout centering.

### 🌌 5. High-Density Canvas Dot Matrix (`/src/components/DotField.tsx`)
- Custom HTML5 2D Canvas rendering hundreds of particle nodes simulating tactile surface tension and cursor proximity bulges.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Core Framework** | React 19, TypeScript 5, Vite 8 |
| **3D & Physics** | Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei`, `@react-three/rapier` |
| **Motion & Interaction**| Framer Motion 12, GSAP, Lenis (Smooth Scroll) |
| **Typography & Styling**| Tailwind CSS, PostCSS, Custom Display Fonts (`Lastoria Bold`, `Outfit`, `Inter`) |
| **Audio & Graphics** | Web Audio API (tactile sound design), HTML5 Canvas 2D |

---

## ⚡ Performance Engineering

- **Off-Thread Motion Values:** High-frequency cursor tracking and progress indicators utilize Framer Motion's `useMotionValue` to bypass React reconciliation cycles entirely.
- **Hardware-Accelerated Compositing:** Layout transitions are constrained to GPU-friendly `transform: translate3d()` and `opacity` properties to prevent costly browser reflows.
- **Dynamic Code-Splitting:** Heavy 3D modules and terminal shells are split into asynchronous chunks via `React.lazy()` and `Suspense`, keeping the critical first-contentful-paint (FCP) bundle minimal.

---

## 📂 Project Structure

```text
├── public/                  # Static assets (fonts, icons, project previews)
├── src/
│   ├── assets/              # Texture maps, 3D models (.glb), badge images
│   ├── components/          # Modular UI & canvas components
│   │   ├── AboutMe.tsx      # Lanyard integration & typewriter bio
│   │   ├── Contact.tsx      # Contact form & DotField particle matrix
│   │   ├── Experience.tsx   # Interactive manifesto & history timeline
│   │   ├── GitHubStats.tsx  # Live GitHub metrics & contribution heatmap
│   │   ├── Hero.tsx         # Staggered typography entrance & parallax hero
│   │   ├── Lanyard.tsx      # Three.js + Rapier physics canvas
│   │   ├── Navbar.tsx       # Sticky dynamic navigation bar
│   │   ├── Preloader.tsx    # Hardware-accelerated vault door entrance
│   │   ├── Projects.tsx     # Project showcases with interactive media
│   │   ├── Skills.tsx       # Tech stack cards & animated AI core widget
│   │   ├── Terminal.tsx     # Interactive bash shell emulator
│   │   └── TextRepel.tsx    # Physics-based letter scattering component
│   ├── hooks/               # Custom hooks (e.g., useSoundEffects)
│   ├── App.tsx              # Root orchestration, preloader & scroll coordination
│   ├── main.tsx             # Application entry point
│   └── index.css            # Tailwind directives, font definitions, custom scrollbars
├── package.json             # Dependencies & build scripts
├── tsconfig.json            # Strict TypeScript configuration
└── vite.config.ts           # Vite bundler & asset plugins
```

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/rajashekharexe/Rajashekhar_Portfolio.git

# Navigate to the project directory
cd Rajashekhar_Portfolio

# Install dependencies
npm install

# Start the local development server
npm run dev
```

### Production Build
```bash
# Type-check and compile optimized production assets
npm run build

# Preview the production build locally
npm run preview
```

---

## 📬 Contact & Connect

- **Name:** Rajashekhar
- **Email:** [amogsiddaamarappagol@gmail.com](mailto:amogsiddaamarappagol@gmail.com)
- **LinkedIn:** [linkedin.com/in/rajashekhar-exe](https://www.linkedin.com/in/rajashekhar-exe/)
- **GitHub:** [@rajashekharexe](https://github.com/rajashekharexe)

---

<div align="center">
  <sub>Built with modern AI-first workflows, precision design, and physics engineering. © 2026 Rajashekhar.</sub>
</div>
