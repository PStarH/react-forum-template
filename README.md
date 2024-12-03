# ForumFlow

ForumFlow is a modern, responsive forum template that can be used and edited by everyone built with React and TypeScript. It provides a clean and intuitive interface for community discussions.

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:**
  - Headless UI for accessible components
  - Lucide React for icons
- **Type Safety:** TypeScript

## Features

- 📱 Responsive design optimized for all devices
- 🎨 Modern and clean UI inspired by contemporary platforms
- 📑 Category-based post organization
- ⬆️ Upvoting system for posts
- 💬 Comment counter
- 🔍 Search functionality
- 👋 First-time user welcome modal
- 📱 Mobile-friendly floating action button for creating posts

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd forumflow
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will start running at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── CreatePostButton.tsx
│   ├── Header.tsx
│   ├── PostCard.tsx
│   ├── Sidebar.tsx
│   └── WelcomeModal.tsx
├── types.ts           # TypeScript interfaces
├── App.tsx           # Main application component
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## Contributing

Feel free to submit issues and pull requests to improve the application.

## License

This project is open source and available under the MIT license.