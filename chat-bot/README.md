# Chat Bot - Next.js AI Application

This is a [Next.js](https://nextjs.org) project with AI capabilities powered by Google Genkit, featuring a modern UI built with Tailwind CSS and shadcn/ui components.

## Features

- **Next.js 15.x** with App Router and TypeScript
- **Google Genkit** for AI functionality
- **Tailwind CSS** with shadcn/ui components
- **Radix UI** primitives for accessible components
- **React Hook Form** with Zod validation
- **Firebase** integration ready
- **Recharts** for data visualization
- **React Markdown** with GitHub Flavored Markdown

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start development server on port 9002 with Turbopack
- `npm run genkit:dev` - Start Genkit development server  
- `npm run genkit:watch` - Start Genkit in watch mode
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Add your Google AI API key for Genkit functionality
3. Configure Firebase credentials if using Firebase features

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components  
- `src/ai/` - Google Genkit AI flows and configuration
- `src/lib/` - Utility functions and configurations
- `src/hooks/` - Custom React hooks
- `public/` - Static assets

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Genkit Documentation](https://firebase.google.com/docs/genkit)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
