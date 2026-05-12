import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_KEY = process.env.TRELLO_API_KEY;
const TOKEN = process.env.TRELLO_TOKEN;

if (!API_KEY || !TOKEN) {
  console.error("TRELLO_API_KEY and TRELLO_TOKEN environment variables are required");
  process.exit(1);
}

const FIELD_IDS = {
  duration: "69dbe1556ae01ac739c3a387",
  importance: "69dbf89c568c3c4c16cc2af9",
  urgency: "69dbf8a38d5211ad34fcafff",
  effort: "69d3ed58a781d2ece1046e70",
  priority: "69dbc0f2168ed7bbdfc9956a",
};

async function trelloFetch(method, path, body) {
  const url = `https://api.trello.com/1${path}?key=${API_KEY}&token=${TOKEN}`;
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Trello API ${method} ${path}: ${res.status} ${text}`);
  }
  return res.json();
}

const server = new McpServer({
  name: "trello-custom-fields",
  version: "1.0.0",
});

server.tool(
  "get_board_custom_fields",
  "List all custom field definitions for a board",
  { boardId: z.string().describe("Trello board ID") },
  async ({ boardId }) => {
    const fields = await trelloFetch("GET", `/boards/${boardId}/customFields`);
    return { content: [{ type: "text", text: JSON.stringify(fields, null, 2) }] };
  }
);

server.tool(
  "get_card_custom_field_items",
  "Get all custom field values set on a card",
  { cardId: z.string().describe("Trello card ID") },
  async ({ cardId }) => {
    const items = await trelloFetch("GET", `/cards/${cardId}/customFieldItems`);
    return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] };
  }
);

server.tool(
  "update_card_custom_fields",
  "Update number custom fields (duration, importance, urgency, effort, priority) on a card. Pass only the fields you want to change.",
  {
    cardId: z.string().describe("Trello card ID"),
    duration: z.number().optional().describe("Expected hours to complete (decimals ok: 0.25 = 15min)"),
    importance: z.number().optional().describe("1-5, where 5 is most important"),
    urgency: z.number().optional().describe("1-5, where 5 is most urgent"),
    effort: z.number().optional().describe("Effort estimate (number)"),
    priority: z.number().optional().describe("Priority number"),
  },
  async ({ cardId, ...fields }) => {
    const results = [];
    for (const [name, value] of Object.entries(fields)) {
      if (value == null) continue;
      const fieldId = FIELD_IDS[name];
      if (!fieldId) {
        results.push({ field: name, error: "Unknown field" });
        continue;
      }
      await trelloFetch("PUT", `/cards/${cardId}/customField/${fieldId}/item`, {
        value: { number: String(value) },
      });
      results.push({ field: name, value, status: "updated" });
    }
    if (results.length === 0) {
      return { content: [{ type: "text", text: "No fields provided to update." }] };
    }
    return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
