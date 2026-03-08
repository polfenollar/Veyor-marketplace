# GitHub MCP Server Setup

I have created a configuration file `github_mcp_config.json` with your API key.

## For Cursor
1. Go to **Settings** (Cmd+,) > **General** > **MCP Servers**.
2. Click **Add New**.
3. Fill in the details:
   - **Name**: `github`
   - **Type**: `command`
   - **Command**: `npx -y @modelcontextprotocol/server-github`
   - **Environment Variables**:
     - Key: `GITHUB_PERSONAL_ACCESS_TOKEN`
     - Value: `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`

## For Claude Desktop
1. Locate your configuration file at `~/Library/Application Support/Claude/claude_desktop_config.json`.
   - If the folder does not exist, create it: `mkdir -p "~/Library/Application Support/Claude"`
2. Copy the contents of `github_mcp_config.json` into that file.

## Testing
Once configured, you should be able to ask your agent to use GitHub tools (e.g., search repositories, create issues).
