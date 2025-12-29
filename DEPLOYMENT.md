# Deployment Guide

This project is built with Next.js and is optimized for deployment on [Vercel](https://vercel.com).

## Prerequisites

1.  A [GitHub](https://github.com) account.
2.  A [Vercel](https://vercel.com) account.
3.  An [OpenAI API Key](https://platform.openai.com) (for the AI features).

## Steps to Deploy

1.  **Push to GitHub**:
    - Ensure your code is pushed to a GitHub repository.
    ```bash
    git add .
    git commit -m "Ready for deployment"
    git push origin main
    ```

2.  **Import to Vercel**:
    - Go to your Vercel Dashboard.
    - Click **"Add New..."** -> **"Project"**.
    - Select your GitHub repository.

3.  **Configure Environment Variables**:
    - In the "Environment Variables" section, add:
        - `OPENAI_API_KEY`: Your OpenAI API Key.
        - `GOOGLE_CLIENT_ID`: From Google Cloud Console.
        - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console.
        - `NEXTAUTH_SECRET`: Generate one (e.g. `openssl rand -base64 32`).
        - `NEXTAUTH_URL`: Your Vercel domain (e.g. `https://your-app.vercel.app`).

4.  **Deploy**:
    - Click **"Deploy"**.
    - Vercel will build your application. This usually takes 1-2 minutes.

5.  **Verify**:
    - Once deployed, visit the provided URL.
    - Test the AI generation (Create Skill) to ensure the API Key is working.
    - Test the Clubs feature to ensure images load correctly (we configured `next.config.ts` for this).

## Troubleshooting

- **AI not working?**: Check your `OPENAI_API_KEY` in Vercel settings.
- **Images not loading?**: Ensure the domain is allowed in `next.config.ts`.
- **Build fails?**: Check the build logs on Vercel for linting or type errors.
