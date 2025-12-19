# MCP Server Usage Guide

## Server Information

**Base URL:** `https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app`  
**Version:** 1.3.0  
**Description:** Valuation Analysis MCP Server with Unicorn Hunter 🦄

## Available Endpoints

### 1. `/mcp/invoke` - Main Tool Invocation Endpoint

This is the primary endpoint for interacting with the MCP server. It accepts POST requests with JSON payloads.

**Request Format:**
```http
POST https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app/mcp/invoke
Content-Type: application/json
```

**JSON Body Structure:**
```json
{
  "tool": "tool_name",
  "arguments": {
    // Tool-specific arguments
  }
}
```

### 2. `/mcp/manifest` - Server Manifest

Returns information about available tools and server capabilities.

**Request:**
```http
GET https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app/mcp/manifest
```

### 3. `/health` - Health Check

Check if the server is running and healthy.

**Request:**
```http
GET https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app/health
```

## Available Tools

### 1. `agent_executor` - Comprehensive Analysis Tool

**Best for:** Full analysis including codebase analysis in a single request.

**Request Example:**
```json
{
  "tool": "agent_executor",
  "arguments": {
    "input": "what's the unicorn score for facebook/react with codebase analysis?"
  }
}
```

**Response Format:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"analysis\": {...}, \"unicorn_hunter\": {...}, \"codebase_analysis\": {...}, \"summary\": \"...\"}"
    }
  ]
}
```

**Note:** The `text` field contains a JSON string that needs to be parsed.

### 2. `analyze_github_repository` - Repository Analysis Tool

**Best for:** Getting basic repository data and metrics.

**Request Example:**
```json
{
  "tool": "analyze_github_repository",
  "arguments": {
    "owner": "facebook",
    "repo": "react"
  }
}
```

**Response Format:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"basic_info\": {...}, \"metrics\": {...}, \"development\": {...}}"
    }
  ]
}
```

### 3. `unicorn_hunter` - Valuation Calculation Tool

**Best for:** Calculating unicorn scores and valuations from existing repo data.

**Request Example:**
```json
{
  "tool": "unicorn_hunter",
  "arguments": {
    "repo_data": {
      // Repository data from analyze_github_repository
    }
  }
}
```

**Response Format:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"unicorn_score\": 85.5, \"component_scores\": {...}, \"speculative_valuation_ranges\": {...}, \"interpretation\": {...}}"
    }
  ]
}
```

## Complete Usage Examples

### Example 1: Using `agent_executor` (Recommended)

```javascript
const analyzeRepo = async (owner, repo) => {
  const response = await fetch(
    'https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app/mcp/invoke',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'agent_executor',
        arguments: {
          input: `what's the unicorn score for "${owner}/${repo}" with codebase analysis?`,
        },
      }),
    }
  );

  const data = await response.json();
  
  // Parse the JSON string from the text field
  if (data.content && data.content[0]?.type === 'text') {
    const result = JSON.parse(data.content[0].text);
    return result;
  }
  
  throw new Error('Invalid response format');
};

// Usage
const result = await analyzeRepo('facebook', 'react');
console.log('Unicorn Score:', result.unicorn_hunter?.unicorn_score);
```

### Example 2: Two-Step Process (analyze + unicorn_hunter)

```javascript
// Step 1: Analyze repository
const analyzeResponse = await fetch(
  'https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app/mcp/invoke',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tool: 'analyze_github_repository',
      arguments: {
        owner: 'facebook',
        repo: 'react',
      },
    }),
  }
);

const analyzeData = await analyzeResponse.json();
const repoData = JSON.parse(analyzeData.content[0].text);

// Step 2: Calculate unicorn score
const unicornResponse = await fetch(
  'https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app/mcp/invoke',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tool: 'unicorn_hunter',
      arguments: {
        repo_data: repoData,
      },
    }),
  }
);

const unicornData = await unicornResponse.json();
const unicornResult = JSON.parse(unicornData.content[0].text);

console.log('Unicorn Score:', unicornResult.unicorn_score);
```

### Example 3: Using cURL

```bash
# Agent executor (single request)
curl -X POST https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app/mcp/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "agent_executor",
    "arguments": {
      "input": "what'\''s the unicorn score for facebook/react with codebase analysis?"
    }
  }'

# Analyze repository
curl -X POST https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app/mcp/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "analyze_github_repository",
    "arguments": {
      "owner": "facebook",
      "repo": "react"
    }
  }'

# Health check
curl https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app/health
```

## Response Structure

All responses follow the MCP (Model Context Protocol) format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "JSON string containing the actual data"
    }
  ]
}
```

**Important:** The actual data is nested inside `content[0].text` as a JSON string, so you need to:
1. Access `response.content[0].text`
2. Parse it with `JSON.parse()`

## Error Handling

The server returns standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid arguments)
- `404` - Tool not found
- `500` - Server error

**Error Response Example:**
```json
{
  "error": "Error message here"
}
```

## Tips

1. **Use `agent_executor`** for the simplest integration - it handles everything in one request
2. **Parse the response** - Remember to parse the JSON string from `content[0].text`
3. **Handle timeouts** - Some analyses can take 30+ seconds, implement proper timeout handling
4. **Repository format** - You can use either `"owner/repo"` format or full GitHub URLs in the input string

## Current Implementation

The application currently uses this endpoint in `app/actions.ts`:
- Base URL: `https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app`
- Primary tool: `agent_executor` (when codebase analysis is requested)
- Fallback: Two-step process with `analyze_github_repository` + `unicorn_hunter`
