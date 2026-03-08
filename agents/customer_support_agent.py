"""Customer Support Agent for VEYOR Marketplace."""
import os
from typing import Dict, Any, Optional
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
from langsmith import Client

from config import config
from tools import customer_support_tools


# Initialize LangSmith client
langsmith_client = Client(
    api_key=config.langsmith.api_key,
    api_url=config.langsmith.endpoint
) if config.langsmith.api_key else None


# Define the agent prompt
CUSTOMER_SUPPORT_PROMPT = """You are a helpful customer support agent for VEYOR Marketplace, a freight forwarding platform.

Your role is to assist customers with:
- Checking booking and shipment status
- Explaining tracking information
- Answering questions about pricing and surcharges
- Providing information about invoices
- Helping find locations and ports

Guidelines:
1. Always be polite, professional, and empathetic
2. Use the available tools to retrieve accurate, real-time information
3. Explain technical terms (like BAF, CAF, PSS, OWS) in simple language
4. If you cannot help with something, politely explain the limitation and suggest contacting a human agent
5. Always confirm the customer's question before using tools
6. Provide clear, concise answers without overwhelming technical details

When explaining surcharges:
- BAF (Bunker Adjustment Factor): Covers fluctuating fuel costs
- CAF (Currency Adjustment Factor): Accounts for exchange rate changes
- PSS (Peak Season Surcharge): Additional fee during high-demand periods
- OWS (Overweight Surcharge): Fee for cargo exceeding standard weight limits
"""


class CustomerSupportAgent:
    """Customer Support Agent with LangSmith monitoring."""

    def __init__(
        self,
        model: str = None,
        temperature: float = None,
        verbose: bool = None
    ):
        """Initialize the customer support agent."""
        self.model = model or config.openai.model
        self.temperature = temperature or config.openai.temperature
        self.verbose = verbose if verbose is not None else config.agent.verbose

        # Initialize LLM
        self.llm = ChatOpenAI(
            model=self.model,
            temperature=self.temperature,
            api_key=config.openai.api_key
        )

        # Create agent using LangGraph
        self.agent_executor = create_react_agent(
            model=self.llm,
            tools=customer_support_tools,
            prompt=CUSTOMER_SUPPORT_PROMPT
        )

    def invoke(
        self,
        query: str,
        chat_history: Optional[list] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Process a customer query and return a response.

        Args:
            query: The customer's question
            chat_history: Optional conversation history (not used in current implementation)
            metadata: Optional metadata for LangSmith tracking

        Returns:
            Dictionary with 'output' key containing the response
        """
        try:
            # Invoke agent with LangGraph
            result = self.agent_executor.invoke({"messages": [("user", query)]})
            
            # Extract the final message
            messages = result.get("messages", [])
            if messages:
                final_message = messages[-1]
                output = final_message.content if hasattr(final_message, 'content') else str(final_message)
            else:
                output = "No response generated"
            
            return {"output": output}
        except Exception as e:
            error_msg = f"Error processing query: {str(e)}"
            print(error_msg)
            return {
                "output": "I apologize, but I encountered an error processing your request. Please try again or contact our support team for assistance.",
                "error": str(e)
            }

    def chat(self, query: str, session_id: str = "default") -> str:
        """
        Simple chat interface for testing.

        Args:
            query: The customer's question
            session_id: Session identifier for tracking

        Returns:
            The agent's response as a string
        """
        result = self.invoke(
            query=query,
            metadata={"session_id": session_id}
        )
        return result.get("output", "No response generated")


# Create a global agent instance
agent = CustomerSupportAgent()


if __name__ == "__main__":
    """Interactive testing mode."""
    print("=" * 60)
    print("VEYOR Customer Support Agent")
    print("=" * 60)
    print("Type 'quit' to exit\\n")

    session_id = "test_session"
    
    while True:
        user_input = input("\\nCustomer: ").strip()
        
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break
        
        if not user_input:
            continue
        
        print("\\nAgent: ", end="")
        response = agent.chat(user_input, session_id=session_id)
        print(response)
