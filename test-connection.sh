#!/bin/bash
# Test Trello API connectivity using credentials from .env
set -e
source "$(dirname "$0")/.env"

echo "Testing Trello API connection..."
curl -s "https://api.trello.com/1/members/me?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" | python3 -c "
import sys,json
d=json.load(sys.stdin)
print(f\"Authenticated as: {d['fullName']} (@{d['username']})\")"

echo ""
echo "Listing boards..."
curl -s "https://api.trello.com/1/members/me/boards?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN&filter=open" | python3 -c "
import sys,json
boards=json.load(sys.stdin)
for b in boards:
    print(f\"  - {b['name']} (id: {b['id']})\")"
