# Trello Automation

Claude Code agent for managing Trello boards — supports single-card edits, bulk operations, custom field management, and board-wide reviews.

## Prerequisites

- [Claude Code](https://claude.ai/code)
- Node.js (v18+)
- Trello API key and token ([generate here](https://trello.com/power-ups/admin))

## Setup

1. **Clone and install dependencies:**

   ```sh
   git clone https://github.com/mboegner/trello-automation.git
   cd trello-automation
   npm install
   ```

2. **Create a `.env` file** in the project root:

   ```
   TRELLO_API_KEY=your_api_key
   TRELLO_TOKEN=your_token
   ```

3. **Register the MCP servers** with Claude Code:

   ```sh
   # Primary Trello server (board/list/card operations)
   claude mcp add trello -e TRELLO_API_KEY=<key> -e TRELLO_TOKEN=<token> -- npx -y @delorenj/mcp-server-trello

   # Custom fields server (duration, importance, urgency, etc.)
   claude mcp add custom-fields -e TRELLO_API_KEY=<key> -e TRELLO_TOKEN=<token> -- node mcp-custom-fields.mjs
   ```

4. **Verify the setup:**

   ```sh
   bash test-connection.sh   # API connectivity
   claude mcp list            # MCP servers registered
   ```

## MCP Servers

### `trello` — [@delorenj/mcp-server-trello](https://github.com/delorenj/mcp-server-trello)

Full Trello API access: boards, lists, cards, checklists, labels, comments, members, and more.

### `custom-fields` — mcp-custom-fields.mjs

Lightweight local server for reading and writing Trello custom fields. Provides three tools:

| Tool | Description |
|------|-------------|
| `get_board_custom_fields(boardId)` | List custom field definitions on a board |
| `get_card_custom_field_items(cardId)` | Get custom field values on a card |
| `update_card_custom_fields(cardId, { ... })` | Set number fields by name (duration, importance, urgency, effort, priority) |

## Custom Fields

| Field | Scale | Description |
|-------|-------|-------------|
| Duration | Hours (decimals) | `0.25` = 15 min, `0.5` = 30 min, `1` = 1 hr |
| Importance | 1–5 | 5 = most important |
| Urgency | 1–5 | 5 = most urgent |
| Effort | Number | Effort estimate |
| Priority | Number | Computed priority |

## Project Structure

```
.
├── CLAUDE.md               # Agent instructions and project conventions
├── mcp-custom-fields.mjs   # Custom fields MCP server
├── test-connection.sh       # API connectivity test
├── package.json
└── .env                     # Credentials (not committed)
```
