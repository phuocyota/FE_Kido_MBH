set -e

echo "🚀 Starting deployment process..."

# Check if git is clean
echo "📋 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Uncommitted changes found. Please commit or stash them first."
  git status
  exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes from remote..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build project
echo "🔨 Building project..."
npm run build

# Check if build successful
if [ ! -d "dist" ]; then
  echo "❌ Build failed - dist folder not found"
  exit 1
fi

echo "✅ Build successful!"
echo "📂 Build output: dist/"
echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "  - Copy dist/ folder to your web server"
echo "  - Or use your hosting platform's deployment method"
echo ""
