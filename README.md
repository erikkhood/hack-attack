# Hack Attack Adventure 🎮

An interactive cybersecurity educational game that simulates common online threats and teaches players how to stay safe online. Navigate through scenarios involving potential hacking attempts, suspicious messages, and deceptive pop-ups.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build with:

```bash
npm run preview
```

## 🎯 How to Play

1. Click "START SIMULATION" on the start screen
2. Read the messages and make choices based on the scenarios
3. **WARNING**: The game will try to trick you with pop-ups and deceptive elements!
4. Be careful what you click - even seemingly harmless elements can lead to getting "hacked"
5. Learn from your mistakes and try different paths to see different outcomes

## 📦 Project Structure

```
hack-attack/
├── src/
│   ├── App.jsx          # Main game component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## 🛠️ Technologies Used

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📤 Pushing to GitHub

Here's how to get your project on GitHub:

### Option 1: Create a New Repository on GitHub

1. **Create a new repository on GitHub:**
   - Go to [github.com](https://github.com)
   - Click the "+" icon in the top right
   - Select "New repository"
   - Name it (e.g., "hack-attack-adventure")
   - Choose public or private
   - **Don't** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Initialize git and push (if not already done):**
   ```bash
   # Initialize git repository (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit your files
   git commit -m "Initial commit: Hack Attack Adventure game"
   
   # Add your GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

### Option 2: If You Already Have a GitHub Repository

```bash
# Add the remote (if not already added)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push your code
git branch -M main
git push -u origin main
```

### Option 3: Using GitHub CLI (if installed)

```bash
# Create and push in one command
gh repo create hack-attack-adventure --public --source=. --remote=origin --push
```

### Future Updates

When you make changes and want to push them:

```bash
# Check what files changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Description of your changes"

# Push to GitHub
git push
```

## 🎨 Features

- Interactive cybersecurity scenarios
- Multiple choice decision-making
- Deceptive pop-ups and banners (educational purpose)
- Mini-games (Pong) integrated into the experience
- Matrix-style start screen
- Responsive design
- Multiple story paths and outcomes

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and make it your own! Add new scenarios, improve the UI, or enhance the educational content.

---

**Remember**: This is an educational game designed to teach cybersecurity awareness. The "hacking" elements are simulated for learning purposes only.

