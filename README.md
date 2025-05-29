# ZenType

Ultimate minimal typing practice web application focused on distraction-free typing improvement.

## Features ✨

- **Minimal Design**: Clean, distraction-free interface focused purely on typing practice
- **Real-time Metrics**: Live WPM and accuracy tracking during practice sessions
- **Progress Tracking**: Detailed performance history and improvement analytics
- **Keyboard-Friendly**: Complete keyboard navigation with essential shortcuts
- **Google Authentication**: Simple sign-in with Google account
- **Cross-Platform**: Works seamlessly on Windows, Mac, and Linux

## Tech Stack 🚀

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js v5 with Google OAuth
- **Deployment**: Vercel

## Getting Started 🏃‍♂️

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[username]/zentype.git
cd zentype
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Keyboard Shortcuts ⌨️

- `Enter`: Start typing practice
- `Esc`: Stop current session
- `Tab`: Navigate to next element
- `Ctrl+R`: Restart current session

## Contributing 🤝

This is an MVP project focused on core typing practice functionality. Future enhancements welcome!

## License 📄

MIT License - see LICENSE file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
