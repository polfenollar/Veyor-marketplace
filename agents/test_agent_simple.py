"""
Simple test script for Customer Support Agent
This version works WITHOUT LangSmith/OpenAI for basic testing
"""
import sys

print("=" * 60)
print("CUSTOMER SUPPORT AGENT - SIMPLE TEST")
print("=" * 60)
print()

# Test 1: Check imports
print("Test 1: Checking imports...")
try:
    from config import config
    print("✅ Config loaded")
except Exception as e:
    print(f"❌ Error loading config: {e}")
    sys.exit(1)

try:
    from api_client import api_client
    print("✅ API client loaded")
except Exception as e:
    print(f"❌ Error loading API client: {e}")
    sys.exit(1)

print()

# Test 2: Check backend connectivity
print("Test 2: Checking backend connectivity...")
print(f"Backend URL: {config.VEYOR_api.base_url}")

try:
    # Try to get a booking (this will fail if backend is not running)
    result = api_client.get_booking(1)
    
    if "error" in result:
        print(f"⚠️  Backend returned error: {result['error']}")
        print("   Make sure backend is running: cd .. && ./start.sh")
    else:
        print(f"✅ Backend is responding!")
        print(f"   Sample booking data: {result}")
except Exception as e:
    print(f"❌ Cannot connect to backend: {e}")
    print("   Make sure backend is running: cd .. && ./start.sh")

print()

# Test 3: Check API keys
print("Test 3: Checking API keys...")

if config.langsmith.api_key:
    print(f"✅ LangSmith API key found (starts with: {config.langsmith.api_key[:10]}...)")
else:
    print("⚠️  LangSmith API key not found in .env")
    print("   Get your key from: https://smith.langchain.com/settings")

if config.openai.api_key:
    print(f"✅ OpenAI API key found (starts with: {config.openai.api_key[:10]}...)")
else:
    print("⚠️  OpenAI API key not found in .env")
    print("   Get your key from: https://platform.openai.com/api-keys")

print()

# Test 4: Try to load agent (only if API keys are present)
if config.openai.api_key and config.langsmith.api_key:
    print("Test 4: Loading Customer Support Agent...")
    try:
        from customer_support_agent import agent
        print("✅ Agent loaded successfully!")
        print()
        
        # Test 5: Try a simple query
        print("Test 5: Testing agent with a simple query...")
        print("Query: 'What does BAF mean?'")
        print()
        
        response = agent.chat("What does BAF mean?", session_id="test")
        print(f"Agent Response: {response}")
        print()
        print("✅ Agent is working!")
        print()
        print("🎉 All tests passed! You can now:")
        print("   - Run: python customer_support_agent.py (interactive mode)")
        print("   - Run: python example_usage.py (see examples)")
        print("   - Check LangSmith: https://smith.langchain.com")
        
    except Exception as e:
        print(f"❌ Error loading/testing agent: {e}")
        import traceback
        traceback.print_exc()
else:
    print("⚠️  Skipping agent test - API keys not configured")
    print()
    print("To test the agent:")
    print("1. Add your API keys to .env file")
    print("2. Run this script again: python test_agent_simple.py")

print()
print("=" * 60)
