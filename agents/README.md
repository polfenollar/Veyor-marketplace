# VEYOR LangChain Agents

This directory contains LangChain agents for the VEYOR Marketplace with LangSmith monitoring integration.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd agents
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add:
- `LANGCHAIN_API_KEY`: Your LangSmith API key (get from https://smith.langchain.com)
- `OPENAI_API_KEY`: Your OpenAI API key

**Important:** Never commit `.env`. It is gitignored. If `.env` was ever committed or leaked, rotate all API keys immediately (OpenAI: https://platform.openai.com/api-keys, LangSmith: https://smith.langchain.com).

### 3. Start the Backend

Make sure the VEYOR backend is running:

```bash
cd ..
./start.sh
```

### 4. Test the Customer Support Agent

#### Interactive Mode

```bash
python customer_support_agent.py
```

Example conversation:
```
Customer: What's the status of booking 123?
Agent: Let me check that for you...

Customer: Can you explain what BAF means?
Agent: BAF stands for Bunker Adjustment Factor...
```

#### Programmatic Usage

```python
from customer_support_agent import agent

# Simple query
response = agent.chat("Where is my shipment #456?")
print(response)

# With metadata for LangSmith tracking
result = agent.invoke(
    query="Explain the surcharges on quote ABC123",
    metadata={
        "user_id": "user_789",
        "session_id": "session_xyz"
    }
)
print(result["output"])
```

## 📊 Monitoring with LangSmith

### View Traces

1. Go to https://smith.langchain.com
2. Select project: `VEYOR-marketplace-agents`
3. View all agent interactions with:
   - Full conversation traces
   - Tool calls and responses
   - Latency metrics
   - Error tracking

### Key Metrics to Monitor

- **Success Rate**: % of queries successfully resolved
- **Average Latency**: Time from query to response
- **Tool Usage**: Which tools are called most frequently
- **Error Rate**: Failed tool calls or agent errors
- **Cost per Query**: OpenAI API costs

### Custom Metadata

All agent calls include metadata tags:
- `user_id`: Customer identifier
- `session_id`: Conversation session
- `agent`: Agent type (e.g., "customer_support")

## 🛠️ Available Tools

The Customer Support Agent has access to:

1. **get_booking_status**: Retrieve booking details and status
2. **get_shipment_tracking**: Get real-time tracking events
3. **explain_quote_breakdown**: Show detailed cost breakdown with surcharge explanations
4. **search_shipments**: Find shipments by query
5. **get_invoice_details**: Retrieve invoice information
6. **search_locations**: Find ports and locations

## 🧪 Testing

### Unit Tests

```bash
pytest tests/
```

### Example Queries to Test

```python
# Booking status
agent.chat("What's the status of booking 1?")

# Tracking
agent.chat("Where is shipment 5?")

# Pricing explanation
agent.chat("Why is there a BAF surcharge on my quote?")

# Location search
agent.chat("What's the port code for Shanghai?")
```

## 📁 Project Structure

```
agents/
├── config.py                    # Configuration management
├── api_client.py                # VEYOR API client
├── tools.py                     # LangChain tools
├── customer_support_agent.py    # Customer Support Agent
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment template
└── README.md                    # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LANGCHAIN_TRACING_V2` | Enable LangSmith tracing | `true` |
| `LANGCHAIN_API_KEY` | LangSmith API key | Required |
| `LANGCHAIN_PROJECT` | LangSmith project name | `VEYOR-marketplace-agents` |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-4-turbo-preview` |
| `VEYOR_API_BASE_URL` | Backend API URL | `http://localhost:8080/api` |
| `AGENT_TEMPERATURE` | LLM temperature | `0.0` |
| `AGENT_MAX_ITERATIONS` | Max agent iterations | `10` |

### Customizing the Agent

Edit `customer_support_agent.py` to:
- Modify the system prompt
- Add new tools
- Change LLM model or temperature
- Adjust max iterations

## 🚨 Troubleshooting

### "Error retrieving booking"

- Ensure the backend is running (`./start.sh`)
- Check `VEYOR_API_BASE_URL` in `.env`
- Verify the booking ID exists in the database

### "LangSmith API key not found"

- Add `LANGCHAIN_API_KEY` to `.env`
- Get your key from https://smith.langchain.com/settings

### "OpenAI API key not found"

- Add `OPENAI_API_KEY` to `.env`
- Get your key from https://platform.openai.com/api-keys

## 📈 Next Steps

1. **Deploy to Production**: Integrate agent into your frontend or API
2. **Add More Agents**: Implement Pricing, Delay Prediction, etc.
3. **Fine-tune Prompts**: Use LangSmith data to optimize prompts
4. **Add RAG**: Integrate vector database for knowledge base
5. **Implement Feedback**: Add thumbs up/down for continuous improvement

## 🔗 Resources

- [LangChain Documentation](https://python.langchain.com/)
- [LangSmith Documentation](https://docs.smith.langchain.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [VEYOR Architecture](../docs/adr/nfr.md)
