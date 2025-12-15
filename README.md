# 🚀 Termfa

<div align="center">

![Termfa Logo](public/tauri.svg)

**A modern and elegant terminal emulator built with Tauri and React**

[![Version](https://img.shields.io/badge/version-0.0.6-blue.svg)](https://github.com/Foshati/terminal-tauri)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-orange.svg)](https://tauri.app)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://reactjs.org)

</div>

---

## 📖 About the Project

**Termfa** is a modern, lightweight, and visually refined terminal emulator built using cutting-edge **Tauri** and **React** technologies. It focuses on performance, aesthetics, and developer experience, offering a smooth and professional terminal environment with a modern UI.

---

## ✨ Key Features

* 🎨 **Modern UI** with gradients and subtle animations
* ⚡ **High performance** powered by Tauri and Rust
* 🎯 **Custom window controls** (minimize, maximize, close)
* 🌙 **Professional dark theme** optimized for long sessions
* 🔤 **Nerd Font support** for rich icon rendering
* 📦 **Lightweight & efficient** with minimal resource usage
* 🔧 **Highly customizable** themes, fonts, and settings

---

## 🛠️ Tech Stack

### Frontend

* **React 19.1** – Modern UI library
* **TypeScript** – Type safety and scalability
* **Tailwind CSS 4.1** – Utility-first styling
* **Xterm.js 5.3** – Powerful terminal engine
* **Vite 7.0** – Fast development and build tool

### Backend

* **Tauri 2.0** – Secure and fast desktop framework
* **Rust** – High performance and memory safety

---

## 📋 Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) (v18 or higher)
* [Bun](https://bun.sh/) (package manager)
* [Rust](https://www.rust-lang.org/)
* [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Foshati/terminal-tauri.git
cd termfa
```

### 2. Install dependencies

```bash
bun install
```

### 3. Run in development mode

```bash
bun run tauri:dev
# or
bun run start
```

### 4. Build for production

```bash
bun run build
bun run tauri build
```

---

## 📁 Project Structure

```text
termfa/
├── src/                    # React source code
│   ├── App.tsx            # Main component
│   ├── App.css            # Global styles
│   └── main.tsx           # Entry point
├── src-tauri/             # Tauri (Rust) backend
│   ├── src/               # Rust source files
│   └── tauri.conf.json    # Tauri configuration
├── public/                # Static assets
│   └── fonts/             # Nerd Fonts
├── index.html             # Main HTML file
├── package.json           # Project dependencies
└── vite.config.ts         # Vite configuration
```

---

## 🎨 Customization

### Change the Color Theme

Edit the `theme` configuration in `src/App.tsx`:

```ts
theme: {
  background: "#0a0e14",
  foreground: "#e6edf3",
  cursor: "#58d1eb",
  // ...other colors
}
```

### Change the Font

Modify `src/App.css` and include your preferred font (Nerd Fonts recommended).

---

## ⌨️ Keyboard Shortcuts

* `Ctrl / Cmd + C` – Copy selected text
* `Ctrl / Cmd + V` – Paste text
* `Ctrl / Cmd + Shift + C` – Copy
* `Ctrl / Cmd + Shift + V` – Paste

---

## 🤝 Contributing

Contributions are very welcome and appreciated.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to your branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Foshati**

* GitHub: [@Foshati](https://github.com/Foshati)
* Email: [your.email@example.com](mailto:your.email@example.com)

---

## 🙏 Acknowledgments

* [Tauri](https://tauri.app/) – Desktop framework
* [React](https://reactjs.org/) – UI library
* [Xterm.js](https://xtermjs.org/) – Terminal engine
* [Tailwind CSS](https://tailwindcss.com/) – CSS framework

---

<div align="center">

⭐ If you like this project, please give it a star!

Made with ❤️ by Foshati

</div>
