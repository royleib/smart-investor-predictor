# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b979800e-f822-4fc5-93bf-018828dca8d4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b979800e-f822-4fc5-93bf-018828dca8d4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Option 1: Deploy with Lovable

Simply open [Lovable](https://lovable.dev/projects/b979800e-f822-4fc5-93bf-018828dca8d4) and click on Share -> Publish.

### Option 2: Deploy with Netlify (Recommended for custom domains)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Deploy on Netlify:
   - Sign up/Login to [Netlify](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your Git repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. Set up your custom domain:
   - Go to "Domain settings" in your Netlify site dashboard
   - Click "Add custom domain"
   - Follow Netlify's DNS configuration instructions
   - Update your domain's DNS settings as per Netlify's instructions

4. Environment Variables:
   Make sure to add these environment variables in your Netlify dashboard (Site settings > Environment variables):
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Important Notes:
- Always ensure your environment variables are properly set in your deployment platform
- Make sure your Supabase project's URL is allowed in the API settings
- Test the deployment in a staging environment first if possible

For more detailed deployment instructions, visit our docs: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)