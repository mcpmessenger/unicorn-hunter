// Test endpoint to verify package stats integration
const testPackageStats = async () => {
  const repos = [
    { name: 'facebook/react', expected: 'npm' },
    { name: 'vercel/next.js', expected: 'npm' },
  ];
  
  for (const { name, expected } of repos) {
    console.log(`\n=== Testing ${name} ===`);
    
    try {
      const response = await fetch('https://valuation-mcp-server-554655392699.us-central1.run.app/mcp/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: 'agent_executor',
          arguments: {
            input: `what is the unicorn score for ${name} with codebase analysis?`,
          },
        }),
      });

      const data = await response.json();
      if (data.content && data.content[0]) {
        const parsed = JSON.parse(data.content[0].text);
        
        console.log('Has package_stats:', !!parsed.package_stats);
        console.log('Has ecosystem_adoption_score:', parsed.ecosystem_adoption_score !== undefined);
        console.log('Has summary:', !!parsed.summary);
        
        if (parsed.package_stats) {
          console.log('Package Stats:', {
            status: parsed.package_stats.status,
            package_manager: parsed.package_stats.package_manager,
            package_name: parsed.package_stats.package_name,
            weekly_downloads: parsed.package_stats.stats?.weekly_downloads,
          });
        }
        
        if (parsed.ecosystem_adoption_score !== undefined) {
          console.log('Ecosystem Adoption Score:', parsed.ecosystem_adoption_score);
        }
        
        if (parsed.summary) {
          console.log('Summary:', parsed.summary);
        }
      }
    } catch (error) {
      console.error(`Error testing ${name}:`, error.message);
    }
  }
};

testPackageStats();

