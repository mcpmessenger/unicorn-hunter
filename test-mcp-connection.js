// Test script to demonstrate MCP server connection
// Run with: node test-mcp-connection.js

const MCP_SERVER_URL = 'https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app';

async function testHealthCheck() {
  console.log('\n=== Testing Health Check ===');
  try {
    const response = await fetch(`${MCP_SERVER_URL}/health`);
    const data = await response.json();
    console.log('Health Status:', data);
  } catch (error) {
    console.error('Health check failed:', error.message);
  }
}

async function testManifest() {
  console.log('\n=== Testing Manifest Endpoint ===');
  try {
    const response = await fetch(`${MCP_SERVER_URL}/mcp/manifest`);
    const data = await response.json();
    console.log('Available tools:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Manifest check failed:', error.message);
  }
}

async function testAgentExecutor(owner, repo) {
  console.log(`\n=== Testing Agent Executor with ${owner}/${repo} ===`);
  try {
    const response = await fetch(`${MCP_SERVER_URL}/mcp/invoke`, {
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('\nRaw Response Structure:');
    console.log('- Has content:', !!data.content);
    console.log('- Content length:', data.content?.length || 0);
    
    if (data.content && data.content[0]) {
      const textItem = data.content[0];
      console.log('- Content[0] type:', textItem.type);
      console.log('- Content[0] has text:', !!textItem.text);
      
      if (textItem.text) {
        try {
          const parsed = JSON.parse(textItem.text);
          console.log('\nParsed Response Keys:', Object.keys(parsed));
          
          if (parsed.unicorn_hunter) {
            console.log('\nUnicorn Hunter Results:');
            console.log('- Unicorn Score:', parsed.unicorn_hunter.unicorn_score);
            console.log('- Status:', parsed.unicorn_hunter.status);
            console.log('- Component Scores:', Object.keys(parsed.unicorn_hunter.component_scores || {}).length, 'scores');
          }
          
          if (parsed.codebase_analysis) {
            console.log('\nCodebase Analysis:', 'Available');
          }
          
          if (parsed.summary) {
            console.log('\nSummary:', parsed.summary.substring(0, 100) + '...');
          }
        } catch (parseError) {
          console.error('Failed to parse JSON:', parseError.message);
          console.log('Raw text (first 500 chars):', textItem.text.substring(0, 500));
        }
      }
    } else {
      console.log('Unexpected response format:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Agent executor test failed:', error.message);
  }
}

async function testAnalyzeRepository(owner, repo) {
  console.log(`\n=== Testing Analyze Repository with ${owner}/${repo} ===`);
  try {
    const response = await fetch(`${MCP_SERVER_URL}/mcp/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'analyze_github_repository',
        arguments: {
          owner: owner,
          repo: repo,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.content && data.content[0]?.text) {
      const repoData = JSON.parse(data.content[0].text);
      console.log('\nRepository Data Keys:', Object.keys(repoData));
      console.log('- Stars:', repoData.metrics?.stars);
      console.log('- Forks:', repoData.metrics?.forks);
      console.log('- Language:', repoData.basic_info?.primary_language);
    }
  } catch (error) {
    console.error('Analyze repository test failed:', error.message);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Testing MCP Server Connection');
  console.log('Server URL:', MCP_SERVER_URL);
  
  await testHealthCheck();
  await testManifest();
  await testAnalyzeRepository('facebook', 'react');
  await testAgentExecutor('facebook', 'react');
  
  console.log('\n✅ Tests completed!');
}

// Run tests
runTests().catch(console.error);
