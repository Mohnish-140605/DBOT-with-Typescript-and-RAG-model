# Vercel Deployment Guide

This guide will help you deploy the Figmenta AI Admin Dashboard to Vercel.

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Supabase project set up
- All required API keys

## Step 1: Environment Variables

Before deploying, you need to add the following environment variables in Vercel:

### Required Environment Variables

Add these in **Vercel Dashboard → Your Project → Settings → Environment Variables**:

#### Supabase (Required)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### OpenAI (Required for RAG functionality)
```
OPENAI_API_KEY=your_openai_api_key
```

#### Optional (if using Groq)
```
GROQ_API_KEY=your_groq_api_key
```

### Important Notes:
- **NEXT_PUBLIC_** prefix is required for client-side accessible variables
- Never commit `.env` files to GitHub
- Add environment variables in Vercel dashboard, not in code

## Step 2: Deploy to Vercel

### Option A: GitHub Integration (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository:
   - Find `Mohnish-140605/DBOT-with-Typescript-and-RAG-model`
   - Click **"Import"**
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
5. Add environment variables (see Step 1)
6. Click **"Deploy"**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# For production deployment
vercel --prod
```

## Step 3: Post-Deployment

After deployment:

1. **Update Supabase Auth URLs**:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL to allowed redirect URLs:
     - `https://your-project.vercel.app/auth/callback`
     - `https://your-project.vercel.app/login`

2. **Test the deployment**:
   - Visit your Vercel URL
   - Test login/signup functionality
   - Verify API routes are working

## Important Notes

### Discord Bot
- **The Discord bot (`bot/` directory) cannot run on Vercel**
- Vercel uses serverless functions which don't support persistent connections
- Deploy the bot separately on:
  - Railway.app
  - Render.com
  - A VPS (DigitalOcean, AWS EC2, etc.)
  - Or any service that supports long-running processes

### File Uploads
- File uploads are configured with a 10MB limit
- For larger files, consider using Supabase Storage or AWS S3

### API Routes
- API routes have timeout limits (30-60 seconds)
- Long-running operations should be moved to background jobs

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify Node.js version (Vercel uses Node 18+ by default)
- Check build logs in Vercel dashboard

### Authentication Issues
- Verify Supabase URLs are correct
- Check that redirect URLs are configured in Supabase
- Ensure cookies are enabled in browser

### API Routes Not Working
- Check function timeout settings in `vercel.json`
- Verify environment variables are accessible server-side
- Check Vercel function logs

## Support

For issues, check:
- Vercel documentation: https://vercel.com/docs
- Next.js documentation: https://nextjs.org/docs
- Supabase documentation: https://supabase.com/docs
