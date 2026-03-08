#!/bin/bash
# Quick setup script for testing the Customer Support Agent

echo "🚀 Setting up Customer Support Agent..."
echo ""

# Step 1: Create virtual environment
echo "📦 Step 1: Creating virtual environment..."
python3 -m venv venv
echo "✅ Virtual environment created"
echo ""

# Step 2: Activate and install dependencies
echo "📦 Step 2: Installing dependencies..."
source venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo "✅ Dependencies installed"
echo ""

# Step 3: Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  Step 3: Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "🔑 IMPORTANT: You need to add your API keys to .env file:"
    echo "   1. LANGCHAIN_API_KEY - Get from https://smith.langchain.com/settings"
    echo "   2. OPENAI_API_KEY - Get from https://platform.openai.com/api-keys"
    echo ""
    echo "📝 Edit the .env file and add your keys, then run:"
    echo "   source venv/bin/activate"
    echo "   python test_agent_simple.py"
else
    echo "✅ Step 3: .env file already exists"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your API keys to .env file"
echo "2. Make sure backend is running: cd .. && ./start.sh"
echo "3. Test the agent: python test_agent_simple.py"
