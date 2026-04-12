# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Trello automation agent for interacting with boards, lists, and cards — supporting both single-ticket adjustments and bulk operations.

## MCP Server (Trello)

This project uses the `@delorenj/mcp-server-trello` MCP server for direct Trello API access. It should already be registered in the local Claude Code config (`.claude.json`). If the trello MCP tools are not available on session start:

1. Verify it's registered: `claude mcp list`
2. If missing, re-add it:
   ```
   claude mcp add trello -e TRELLO_API_KEY=<key> -e TRELLO_TOKEN=<token> -- npx -y @delorenj/mcp-server-trello
   ```
3. Credentials are stored in `.env` in the project root.
4. Restart the Claude Code session after adding.

## Testing

Run these to verify the setup is working:

- **API connectivity:** `bash test-connection.sh` — confirms credentials work and lists your boards
- **MCP server health:** `claude mcp list` — should show `trello` as connected
- **MCP tools smoke test:** Use the trello MCP tools to call `list_boards`, then pick a board and call `get_lists`. If both return data, the integration is fully working.

## Protected Files

- The `Critical Backup Files` directory must NEVER be deleted or modified. Treat it as fully read-only.

## Change Control

- Before executing any change to the Trello board (card creates, updates, moves, deletes, bulk operations), present a clear visual diff showing exactly what will change — GitHub-style diff or a side-by-side before/after table.
- Never rely solely on a bash command or MCP tool call as the only thing the user reviews. The user must see the substance of the change, not just the command.
- Wait for explicit user approval before running any write/update operations.

## Communication Style

- Single user system — be direct, brief, and concise. No politeness filler.

## Card Descriptions

- Never overwrite existing card descriptions unless explicitly asked.
- Descriptions have two sections:
  1. **User notes** (top) — written by the user (manual notes, transcribed voice memos). No header needed.
  2. **Assistant-generated content** (below) — must be clearly demarcated with a plaintext header like `--- Assistant Notes ---` or similar. This may include auto-generated subtasks, analysis, or recommendations.

## Custom Fields

- **Duration** (Number) — Expected hours to complete. Use decimals: `0.25` = 15 min, `0.5` = 30 min, `1` = 1 hour.
- **Importance** (Number) — 1 to 5. 5 = most important, 1 = least important.
- **Urgency** (Number) — 1 to 5. 5 = most urgent, 1 = least urgent.

## Card Filtering Defaults

- Ignore archived cards unless explicitly asked.
- Ignore cards in the **Completed** and **Ignore** lists unless explicitly asked.

## Git

- Do not include `Co-Authored-By: Claude` or any Claude/AI attribution in commit messages.

## Environment

- Credentials: `.env` file at project root (do NOT commit this file)
- Runtime: Node.js (npx runs the MCP server)
- Package: `@delorenj/mcp-server-trello` installed globally via npm
