# Random-Intro

A simple web app that chooses a random activity from a preset list of activities.

## Running Locally

No build step or dependencies required — it's a plain static site.

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/Random-Intro.git
   cd Random-Intro
   ```
2. Open `index.html` directly in your browser, **or** serve it with any local static server to avoid potential CORS issues. For example, with the VS Code [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `index.html` and select **Open with Live Server**.

   Alternatively, using Python:

   ```bash
   python -m http.server 8080
   ```

   Then visit `http://localhost:8080` in your browser.

## Deploying to GitHub Pages

1. Push your code to a GitHub repository (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<your-username>/Random-Intro.git
   git push -u origin main
   ```
2. In your repository on GitHub, go to **Settings → Pages**.
3. Under **Branch**, select `main` (or whichever branch holds your code) and set the folder to `/ (root)`, then click **Save**.
4. GitHub will provide a URL in the format `https://<your-username>.github.io/Random-Intro/` — your site will be live there within a minute or two.
