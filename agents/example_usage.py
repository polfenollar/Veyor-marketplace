"""Example usage of the Customer Support Agent."""
from customer_support_agent import agent


def example_booking_status():
    """Example: Check booking status."""
    print("\n" + "="*60)
    print("Example 1: Checking Booking Status")
    print("="*60)
    
    query = "What's the status of booking 1?"
    print(f"\nCustomer: {query}")
    
    response = agent.chat(query, session_id="example_1")
    print(f"\nAgent: {response}")


def example_tracking():
    """Example: Get shipment tracking."""
    print("\n" + "="*60)
    print("Example 2: Shipment Tracking")
    print("="*60)
    
    query = "Where is my shipment #5? I need to know the current location."
    print(f"\nCustomer: {query}")
    
    response = agent.chat(query, session_id="example_2")
    print(f"\nAgent: {response}")


def example_surcharge_explanation():
    """Example: Explain surcharges."""
    print("\n" + "="*60)
    print("Example 3: Surcharge Explanation")
    print("="*60)
    
    query = "I see a BAF charge on my quote. What does that mean and why am I being charged?"
    print(f"\nCustomer: {query}")
    
    response = agent.chat(query, session_id="example_3")
    print(f"\nAgent: {response}")


def example_location_search():
    """Example: Search for locations."""
    print("\n" + "="*60)
    print("Example 4: Location Search")
    print("="*60)
    
    query = "What's the port code for Shanghai, China?"
    print(f"\nCustomer: {query}")
    
    response = agent.chat(query, session_id="example_4")
    print(f"\nAgent: {response}")


def example_with_metadata():
    """Example: Using metadata for LangSmith tracking."""
    print("\n" + "="*60)
    print("Example 5: With Metadata (LangSmith Tracking)")
    print("="*60)
    
    query = "Can you help me understand the total cost of my quote?"
    print(f"\nCustomer: {query}")
    
    result = agent.invoke(
        query=query,
        metadata={
            "user_id": "customer_12345",
            "session_id": "web_session_abc",
            "channel": "web_chat",
            "priority": "high"
        }
    )
    
    print(f"\nAgent: {result['output']}")
    print(f"\nMetadata tracked in LangSmith:")
    print(f"  - User ID: customer_12345")
    print(f"  - Session: web_session_abc")
    print(f"  - Channel: web_chat")


def example_conversation_flow():
    """Example: Multi-turn conversation."""
    print("\n" + "="*60)
    print("Example 6: Multi-Turn Conversation")
    print("="*60)
    
    session_id = "conversation_example"
    
    queries = [
        "I need help with my booking",
        "It's booking number 1",
        "When will it be shipped?",
        "Thanks for your help!"
    ]
    
    for query in queries:
        print(f"\nCustomer: {query}")
        response = agent.chat(query, session_id=session_id)
        print(f"Agent: {response}")


if __name__ == "__main__":
    print("\n" + "="*60)
    print("VEYOR CUSTOMER SUPPORT AGENT - EXAMPLES")
    print("="*60)
    print("\nThese examples demonstrate the agent's capabilities.")
    print("Make sure the backend is running (./start.sh) before testing.")
    print("\nNote: Some examples may fail if the backend doesn't have")
    print("the referenced bookings/shipments. That's expected!")
    
    # Run examples
    try:
        example_booking_status()
        example_tracking()
        example_surcharge_explanation()
        example_location_search()
        example_with_metadata()
        example_conversation_flow()
        
        print("\n" + "="*60)
        print("All examples completed!")
        print("="*60)
        print("\nCheck LangSmith (https://smith.langchain.com) to see:")
        print("  - Full conversation traces")
        print("  - Tool calls and responses")
        print("  - Performance metrics")
        print("  - Cost analysis")
        
    except Exception as e:
        print(f"\n❌ Error running examples: {e}")
        print("\nMake sure:")
        print("  1. Backend is running (./start.sh)")
        print("  2. .env file is configured with API keys")
        print("  3. Dependencies are installed (pip install -r requirements.txt)")
