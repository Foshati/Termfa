(https://img.shields.io/badge/Tauri-2.0-orange.svg)](https://tauri.app)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://reactjs.org)

[English](#english) | [فارسی](#persian)

</div>

---

## <a name="persian"></a>🇮🇷 فارسی

### 📖 درباره پروژه

**Termfa** یک ترمینال مدرن و زیبا است که با استفاده از فناوری‌های پیشرفته Tauri و React ساخته شده است. این پروژه یک تجربه کاربری حرفه‌ای و روان را با طراحی مدرن و امکانات پیشرفته ارائه می‌دهد.

### ✨ ویژگی‌های کلیدی

- 🎨 **طراحی مدرن و زیبا**: رابط کاربری با گرادیانت‌های مدرن و انیمیشن‌های ظریف
- ⚡ **عملکرد بالا**: ساخته شده با Tauri برای سرعت و کارایی بهینه
- 🎯 **کنترل‌های پنجره**: دکمه‌های minimize، maximize و close با طراحی زیبا
- 🌈 **تم تیره حرفه‌ای**: رنگ‌بندی بهینه شده برای کار طولانی‌مدت
- 🔤 **فونت Nerd**: پشتیبانی کامل از فونت‌های Nerd برای نمایش آیکون‌ها
- 📦 **سبک‌وزن**: اندازه فایل کوچک و مصرف منابع کم
- 🔧 **قابل سفارشی‌سازی**: امکان تنظیم تم، فونت و سایر تنظیمات

### 🛠️ فناوری‌های استفاده شده

#### Frontend
- **React 19.1** - کتابخانه UI مدرن
- **TypeScript** - برای type safety و توسعه بهتر
- **Tailwind CSS 4.1** - فریمورک CSS مدرن
- **Xterm.js 5.3** - کتابخانه ترمینال قدرتمند
- **Vite 7.0** - ابزار build سریع

#### Backend
- **Tauri 2.0** - فریمورک دسکتاپ مدرن
- **Rust** - برای عملکرد بهینه و امنیت بالا

### 📋 پیش‌نیازها

قبل از شروع، مطمئن شوید که موارد زیر را نصب کرده‌اید:

- [Node.js](https://nodejs.org/) (نسخه 18 یا بالاتر)
- [Bun](https://bun.sh/) (مدیر پکیج سریع)
- [Rust](https://www.rust-lang.org/) (برای Tauri)
- [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

### 🚀 نصب و راه‌اندازی

#### 1. کلون کردن پروژه

```bash
git clone https://github.com/Foshati/terminal-tauri.git
cd termfa
```

#### 2. نصب وابستگی‌ها

```bash
bun install
```

#### 3. اجرای پروژه در حالت توسعه

```bash
bun run tauri:dev
# یا
bun run start
```

#### 4. ساخت نسخه نهایی

```bash
bun run build
bun run tauri build
```

### 📁 ساختار پروژه

```
termfa/
├── src/                    # کدهای React
│   ├── App.tsx            # کامپوننت اصلی
│   ├── App.css            # استایل‌های اصلی
│   └── main.tsx           # نقطه ورود
├── src-tauri/             # کدهای Tauri (Rust)
│   ├── src/               # کدهای منبع Rust
│   └── tauri.conf.json    # تنظیمات Tauri
├── public/                # فایل‌های استاتیک
│   └── fonts/             # فونت‌های Nerd
├── index.html             # HTML اصلی
├── package.json           # وابستگی‌های npm
└── vite.config.ts         # تنظیمات Vite
```

### 🎨 سفارشی‌سازی

#### تغییر تم رنگی

فایل `src/App.tsx` را باز کنید و تنظیمات `theme` را تغییر دهید:

```typescript
theme: {
  background: "#0a0e14",
  foreground: "#e6edf3",
  cursor: "#58d1eb",
  // ... سایر رنگ‌ها
}
```

#### تغییر فونت

فایل `src/App.css` را ویرایش کنید و فونت دلخواه خود را اضافه کنید.

### 🔑 میانبرهای کیبورد

- `Ctrl/Cmd + C` - کپی کردن متن انتخاب شده
- `Ctrl/Cmd + V` - چسباندن متن
- `Ctrl/Cmd + Shift + C` - کپی کردن
- `Ctrl/Cmd + Shift + V` - چسباندن

### 🤝 مشارکت

مشارکت شما در بهبود این پروژه بسیار ارزشمند است! لطفاً:

1. پروژه را Fork کنید
2. یک Branch جدید بسازید (`git checkout -b feature/AmazingFeature`)
3. تغییرات خود را Commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. به Branch خود Push کنید (`git push origin feature/AmazingFeature`)
5. یک Pull Request باز کنید

### 📝 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است. برای اطلاعات بیشتر فایل [LICENSE](LICENSE) را مشاهده کنید.

### 👨‍💻 توسعه‌دهنده

**Foshati**

- GitHub: [@Foshati](https://github.com/Foshati)
- Email: your.email@example.com

### 🙏 تشکر و قدردانی

- [Tauri](https://tauri.app/) - فریمورک دسکتاپ
- [React](https://reactjs.org/) - کتابخانه UI
- [Xterm.js](https://xtermjs.org/) - کتابخانه ترمینال
- [Tailwind CSS](https://tailwindcss.com/) - فریمورک CSS

---

## <a name="english"></a>🇬🇧 English

### 📖 About The Project

**Termfa** is a modern and beautiful terminal emulator built with cutting-edge Tauri and React technologies. This project provides a professional and smooth user experience with modern design and advanced features.

### ✨ Key Features

- 🎨 **Modern & Beautiful Design**: UI with modern gradients and subtle animations
- ⚡ **High Performance**: Built with Tauri for optimal speed and efficiency
- 🎯 **Window Controls**: Minimize, maximize, and close buttons with beautiful design
- 🌈 **Professional Dark Theme**: Optimized color scheme for long-term work
- 🔤 **Nerd Fonts**: Full support for Nerd Fonts to display icons
- 📦 **Lightweight**: Small file size and low resource consumption
- 🔧 **Customizable**: Ability to customize theme, font, and other settings

### 🛠️ Built With

#### Frontend
- **React 19.1** - Modern UI library
- **TypeScript** - For type safety and better development
- **Tailwind CSS 4.1** - Modern CSS framework
- **Xterm.js 5.3** - Powerful terminal library
- **Vite 7.0** - Fast build tool

#### Backend
- **Tauri 2.0** - Modern desktop framework
- **Rust** - For optimal performance and high security

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Bun](https://bun.sh/) (fast package manager)
- [Rust](https://www.rust-lang.org/) (for Tauri)
- [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

### 🚀 Installation & Setup

#### 1. Clone the repository

```bash
git clone https://github.com/Foshati/terminal-tauri.git
cd termfa
```

#### 2. Install dependencies

```bash
bun install
```

#### 3. Run in development mode

```bash
bun run tauri:dev
# or
bun run start
```

#### 4. Build for production

```bash
bun run build
bun run tauri build
```

### 📁 Project Structure

```
termfa/
├── src/                    # React code
│   ├── App.tsx            # Main component
│   ├── App.css            # Main styles
│   └── main.tsx           # Entry point
├── src-tauri/             # Tauri code (Rust)
│   ├── src/               # Rust source code
│   └── tauri.conf.json    # Tauri configuration
├── public/                # Static files
│   └── fonts/             # Nerd Fonts
├── index.html             # Main HTML
├── package.json           # npm dependencies
└── vite.config.ts         # Vite configuration
```

### 🎨 Customization

#### Change Color Theme

Open `src/App.tsx` and modify the `theme` settings:

```typescript
theme: {
  background: "#0a0e14",
  foreground: "#e6edf3",
  cursor: "#58d1eb",
  // ... other colors
}
```

#### Change Font

Edit `src/App.css` and add your desired font.

### 🔑 Keyboard Shortcuts

- `Ctrl/Cmd + C` - Copy selected text
- `Ctrl/Cmd + V` - Paste text
- `Ctrl/Cmd + Shift + C` - Copy
- `Ctrl/Cmd + Shift + V` - Paste

### 🤝 Contributing

Your contribution to improving this project is highly valued! Please:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

### 👨‍💻 Developer

**Foshati**

- GitHub: [@Foshati](https://github.com/Foshati)
- Email: your.email@example.com

### 🙏 Acknowledgments

- [Tauri](https://tauri.app/) - Desktop framework
- [React](https://reactjs.org/) - UI library
- [Xterm.js](https://xtermjs.org/) - Terminal library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

<div align="center">

**⭐ اگر این پروژه را دوست دارید، لطفاً یک ستاره بدهید! | If you like this project, please give it a star! ⭐**

Made with ❤️ by Foshati

</div>
