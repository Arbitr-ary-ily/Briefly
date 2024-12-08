# Briefly Self-Hosting Guide 🚀

## Prerequisites
- [x] Git
- [x] Node.js (latest LTS version)
- [x] GitHub Account
- [x] Supabase Account
- [x] Clerk Account
- [x] Google AI Studio Account
- [ ] (Optional) NewsAPI Account

## 1. Clone Repository

```bash
git clone https://github.com/Arbitr-ary-ily/Briefly
cd Briefly
npm install
```

## 2. Environment Configuration

Create a `.env.local` file with the following configurations:

### Authentication (Clerk)
1. Visit [clerk.com](https://clerk.com) and create an account
2. Add these environment variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/news
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### AI Integration
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Generate and add your API key:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### Supabase Configuration
*(Supabase setup)*

### Optional: News API
```bash
NEWS_API_KEY_ONE=your_optional_newsapi_key
```

## 3. Run Application

```bash
npm run dev
```

## 4. Deployment Options

### Recommended Platforms
- Vercel
- Netlify
- Supabase
- Render

**Tip**: Ensure all environment variables are configured in your deployment settings.

## 🛠 Troubleshooting

### Common Issues
- Verify all API keys are correctly entered
- Check console for specific error messages
- Ensure Node.js is updated to latest LTS version

### Debugging
```bash
# Check Node version
node -v

# Check npm version
npm -v
```

## 📚 Additional Resources
- [Briefly GitHub Repository](https://github.com/Arbitr-ary-ily/Briefly)
- [Clerk Documentation](https://clerk.dev/docs)
- [Google AI Studio Docs](https://ai.google.dev)

---

**Happy Hosting!** 🎉 If you encounter any issues, please open an issue on the GitHub repository.
