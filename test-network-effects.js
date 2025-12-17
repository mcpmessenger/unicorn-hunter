// Test Network Effects scores across different repositories
const testNetworkEffects = async () => {
  const repos = ['facebook/react', 'vercel/next.js', 'microsoft/vscode'];
  
  for (const repo of repos) {
    try {
      console.log(`\nTesting ${repo}...`);
      const response = await fetch('https://valuation-mcp-server-554655392699.us-central1.run.app/mcp/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: 'agent_executor',
          arguments: {
            input: `what is the unicorn score for ${repo} with codebase analysis?`,
          },
        }),
      });

      const data = await response.json();
      if (data.content && data.content[0]) {
        const text = data.content[0].text;
        const parsed = JSON.parse(text);
        if (parsed.unicorn_hunter && parsed.unicorn_hunter.component_scores) {
          const scores = parsed.unicorn_hunter.component_scores;
          console.log(`  Network Effects: ${scores.network_effects}`);
          console.log(`  Market Potential: ${scores.market_potential}`);
          console.log(`  Community Momentum: ${scores.community_momentum}`);
        }
      }
    } catch (error) {
      console.error(`Error testing ${repo}:`, error.message);
    }
  }
};

testNetworkEffects();

