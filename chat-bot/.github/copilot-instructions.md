# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js project with TypeScript, Tailwind CSS, and ESLint configuration. The project uses:

- **Framework**: Next.js 15.x with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Google Genkit for AI functionality
- **UI Components**: Radix UI primitives with custom styling
- **Form Handling**: React Hook Form with Zod validation
- **Database**: Firebase integration
- **Icons**: Lucide React icons
- **Charts**: Recharts for data visualization
- **Markdown**: React Markdown with GitHub Flavored Markdown support

## Development Guidelines
- Use TypeScript for all new files
- Follow Next.js App Router conventions for routing and layouts
- Use Tailwind CSS classes for styling with shadcn/ui components
- Use React Server Components by default, mark as 'use client' only when necessary
- Implement form validation using React Hook Form with Zod schemas
- Use Radix UI primitives for accessible component building blocks
- Leverage Google Genkit for AI-powered features
- Follow proper error handling and loading states patterns

## Available Scripts
- `npm run dev` - Start development server on port 9002 with Turbopack
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit in watch mode
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## File Structure
- `src/app/` - App Router pages and layouts
- `src/components/` - Reusable React components
- `src/ai/` - Google Genkit AI configuration and flows
- `src/lib/` - Utility functions and configurations
- `public/` - Static assets
- Configuration files at project root

## Key Dependencies
- **UI Framework**: Next.js 15.x with React 18
- **Styling**: Tailwind CSS with tailwindcss-animate
- **UI Components**: Radix UI primitives (@radix-ui/react-*)
- **AI Integration**: Google Genkit (@genkit-ai/*)
- **Forms**: React Hook Form with Hookform Resolvers
- **Validation**: Zod for schema validation
- **Database**: Firebase for backend services
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Utilities**: class-variance-authority, clsx, tailwind-merge
- **Development**: TypeScript, ESLint, tsx for running TypeScript files
