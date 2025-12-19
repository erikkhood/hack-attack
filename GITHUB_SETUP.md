# Step-by-Step Guide: Getting Your Game on GitHub

## Part 1: Create a GitHub Repository

1. **Go to GitHub.com** and sign in (or create an account if you don't have one)

2. **Click the "+" icon** in the top right corner of the page

3. **Select "New repository"** from the dropdown menu

4. **Fill in the repository details:**
   - **Repository name**: `hack-attack-adventure` (or any name you like)
   - **Description**: "Interactive cybersecurity educational game"
   - **Visibility**: Choose **Public** (so you can use GitHub Pages for free) or **Private**
   - **IMPORTANT**: Do NOT check any of these boxes:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
   (We already have these files!)

5. **Click "Create repository"**

6. **After creating, GitHub will show you setup instructions.** You'll see a page with commands. **DON'T run those yet** - we'll use slightly different commands below.

## Part 2: Connect Your Local Code to GitHub

After creating the repository, GitHub will show you a URL like:
`https://github.com/YOUR_USERNAME/hack-attack-adventure.git`

**Copy that URL**, then come back here and I'll help you connect it!

---

## Part 3: Push Your Code (After you create the repo)

Once you have your repository URL, we'll run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Part 4: Deploy to GitHub Pages (Make it Live on the Web!)

After your code is on GitHub:

1. **Go to your repository page** on GitHub
2. **Click "Settings"** (top menu of your repo)
3. **Scroll down to "Pages"** in the left sidebar
4. **Under "Source"**, select:
   - Source: **GitHub Actions**
5. **Create a workflow file** (I'll help you with this!)

---

## Quick Reference Commands

**To add changes later:**
```bash
git add .
git commit -m "Description of your changes"
git push
```

**To see what changed:**
```bash
git status
```

