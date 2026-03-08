"""Configuration management for VEYOR LangChain agents."""
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()


class LangSmithConfig(BaseModel):
    """LangSmith configuration."""
    tracing_enabled: bool = Field(default=True)
    endpoint: str = Field(default="https://api.smith.langchain.com")
    api_key: str = Field(default="")
    project_name: str = Field(default="VEYOR-marketplace-agents")


class OpenAIConfig(BaseModel):
    """OpenAI configuration."""
    api_key: str = Field(default="")
    model: str = Field(default="gpt-4-turbo-preview")
    temperature: float = Field(default=0.0)


class VEYORAPIConfig(BaseModel):
    """VEYOR backend API configuration."""
    base_url: str = Field(default="http://localhost:8080/api")
    api_key: str = Field(default="")
    timeout: int = Field(default=30)


class AgentConfig(BaseModel):
    """Agent runtime configuration."""
    max_iterations: int = Field(default=10)
    verbose: bool = Field(default=True)
    return_intermediate_steps: bool = Field(default=True)


class Config(BaseModel):
    """Main configuration object."""
    langsmith: LangSmithConfig = Field(default_factory=LangSmithConfig)
    openai: OpenAIConfig = Field(default_factory=OpenAIConfig)
    VEYOR_api: VEYORAPIConfig = Field(default_factory=VEYORAPIConfig)
    agent: AgentConfig = Field(default_factory=AgentConfig)

    @classmethod
    def from_env(cls) -> "Config":
        """Load configuration from environment variables."""
        return cls(
            langsmith=LangSmithConfig(
                tracing_enabled=os.getenv("LANGCHAIN_TRACING_V2", "true").lower() == "true",
                endpoint=os.getenv("LANGCHAIN_ENDPOINT", "https://api.smith.langchain.com"),
                api_key=os.getenv("LANGCHAIN_API_KEY", ""),
                project_name=os.getenv("LANGCHAIN_PROJECT", "VEYOR-marketplace-agents"),
            ),
            openai=OpenAIConfig(
                api_key=os.getenv("OPENAI_API_KEY", ""),
                model=os.getenv("OPENAI_MODEL", "gpt-4o"),
                temperature=float(os.getenv("AGENT_TEMPERATURE", "0.0")),
            ),
            VEYOR_api=VEYORAPIConfig(
                base_url=os.getenv("VEYOR_API_BASE_URL", "http://localhost:8080/api"),
                api_key=os.getenv("VEYOR_API_KEY", ""),
                timeout=int(os.getenv("API_TIMEOUT", "30")),
            ),
            agent=AgentConfig(
                max_iterations=int(os.getenv("AGENT_MAX_ITERATIONS", "10")),
                verbose=os.getenv("AGENT_VERBOSE", "true").lower() == "true",
                return_intermediate_steps=True,
            ),
        )


# Global config instance
config = Config.from_env()
