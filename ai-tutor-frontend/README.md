# AI Tutor - Next.js Frontend

A modern, responsive AI tutoring application built with Next.js 16, React 19, and Tailwind CSS.

## Features

- **Real-time Chat Interface** - Interactive chat with AI tutor
- **File Upload Support** - Drag & drop multiple files with progress tracking
- **Chat History** - View and manage previous chat sessions
- **Responsive Design** - Mobile-first design with adaptive sidebar
- **Toast Notifications** - User feedback for all actions
- **Error Boundaries** - Graceful error handling
- **Loading States** - Skeleton loaders for better UX

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **React:** 19.2 with Canary features
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **TypeScript:** Full type safety
- **Icons:** Lucide React

## Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd ai-tutor-frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API Configuration
BACKEND_API_URL=http://localhost:8000/api/v1

# Optional: For Supabase development redirects
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### 4. Backend Integration

The frontend is ready but requires backend integration. Update the following files to connect to your backend:

#### API Route Files (app/api/v1/\*\*/\*.ts)

All API routes currently return placeholder responses. Replace the TODO comments with actual backend API calls:

- `app/api/v1/chats/route.ts` - Create new chat sessions
- `app/api/v1/chats/history/route.ts` - Fetch chat history
- `app/api/v1/chats/[session_id]/messages/route.ts` - Get and send messages
- `app/api/v1/files/upload/[session_id]/route.ts` - Upload files

#### Example Backend Integration

```typescript
// app/api/v1/chats/route.ts
const response = await fetch(`${process.env.BACKEND_API_URL}/chats`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id, title })
})
const data = await response.json()
return NextResponse.json(data)
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
# or
pnpm build
pnpm start
```

## Project Structure

```
ai-tutor-frontend/
├── app/
│   ├── api/v1/              # API routes (Next.js route handlers)
│   ├── chats/[id]/          # Chat session pages
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles and design tokens
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── app-layout.tsx       # Main layout wrapper
│   ├── sidebar.tsx          # Navigation sidebar
│   ├── chat-*.tsx           # Chat-related components
│   ├── file-upload.tsx      # File upload component
│   └── error-boundary.tsx   # Error handling
├── lib/
│   ├── api.ts              # API client with TypeScript types
│   └── utils.ts            # Utility functions
└── hooks/
    ├── use-toast.ts        # Toast notification hook
    └── use-mobile.tsx      # Mobile detection hook
```

## API Client Usage

The project includes a typed API client (`lib/api.ts`) for backend communication:

```typescript
import { apiClient } from '@/lib/api'

// Create a new chat
const chat = await apiClient.createChat(1, 'My Chat Title')

// Send a message
const response = await apiClient.sendMessage('session-id', 'Hello!')

// Upload files
const result = await apiClient.uploadFiles(
  'session-id', 
  files, 
  (progress) => console.log(`Upload: ${progress}%`)
)
```

## Customization

### Design Tokens

Customize colors and theme in `app/globals.css`:

```css
@theme inline {
  --color-primary: oklch(0.55 0.25 250);
  --color-secondary: oklch(0.65 0.15 270);
  /* ... more tokens */
}
```

### Components

All UI components are in `components/ui/` and can be customized using Tailwind classes.

## Deployment

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables

Don't forget to add your environment variables in your deployment platform:

- `BACKEND_API_URL` - Your production backend API URL

## Troubleshooting

### Common Issues

1. **API calls failing**
   - Check that `BACKEND_API_URL` is set correctly
   - Verify backend is running and accessible
   - Check CORS configuration on backend

2. **Styles not loading**
   - Clear `.next` folder: `rm -rf .next`
   - Restart dev server

3. **TypeScript errors**
   - Run `npm run type-check`
   - Check for missing dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on GitHub.
```

```json file="" isHidden
