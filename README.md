# Complete Authentication System with Better Auth

This is a comprehensive authentication system built with Next.js and Better Auth, featuring all essential auth pages and functionality.

## Features

### 🔐 Authentication Pages

- **Sign In** (`/auth/signin`) - Email/password and social login (Google, GitHub)
- **Sign Up** (`/auth/signup`) - User registration with email/password and social login
- **Forgot Password** (`/auth/forgot-password`) - Password reset request
- **Reset Password** (`/auth/reset-password`) - Password reset with token validation

### 👤 Profile Management (`/profile`)

- **Profile Information** - View and update user name and email
- **Password Change** - Secure password update with current password verification
- **Session Management** - View active sessions and revoke individual sessions
- **Sign Out** - Sign out from current session or all devices

### 🛡️ Security Features

- Protected routes with middleware
- Session management and validation
- Password strength requirements
- Secure password reset flow
- Social authentication (Google, GitHub)

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Better Auth** - Modern authentication library
- **Prisma** - Database ORM with SQLite
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with:

   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # Social Auth (optional)
   GITHUB_CLIENT_ID="your_github_client_id"
   GITHUB_CLIENT_SECRET="your_github_client_secret"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   ```

3. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/auth/[...all]/route.ts    # Better Auth API handler
│   ├── auth/
│   │   ├── signin/page.tsx           # Sign in page
│   │   ├── signup/page.tsx           # Sign up page
│   │   ├── forgot-password/page.tsx   # Forgot password page
│   │   └── reset-password/page.tsx    # Reset password page
│   ├── profile/page.tsx              # User profile page
│   ├── page.tsx                      # Home page
│   └── layout.tsx                    # Root layout with navigation
├── components/
│   ├── Navigation.tsx                 # Main navigation component
│   └── Logout.tsx                    # Logout component
├── lib/
│   ├── auth.ts                       # Better Auth configuration
│   ├── auth-client.ts                # Client-side auth instance
│   └── prisma.ts                     # Prisma client
├── middleware.ts                     # Route protection middleware
└── prisma/
    └── schema.prisma                 # Database schema
```

## Authentication Flow

1. **Registration**: Users can sign up with email/password or social providers
2. **Login**: Users can sign in with their credentials or social providers
3. **Password Reset**: Users can request password reset via email
4. **Profile Management**: Authenticated users can update their profile and manage sessions
5. **Session Management**: Users can view and revoke active sessions

## API Endpoints

Better Auth automatically provides these endpoints:

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `POST /api/auth/forget-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/session` - Get current session
- `POST /api/auth/update-user` - Update user profile
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/sessions` - Get user sessions
- `POST /api/auth/revoke-session` - Revoke specific session

## Security Considerations

- All password operations are handled securely by Better Auth
- Sessions are validated on each request
- Protected routes use middleware for authentication checks
- Password reset tokens are time-limited and single-use
- Social authentication follows OAuth 2.0 standards

## Customization

You can customize the authentication system by:

- Modifying the Better Auth configuration in `lib/auth.ts`
- Updating the UI components in the `app/auth/` directory
- Adding additional social providers
- Customizing the profile page functionality
- Adding email verification if needed

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
