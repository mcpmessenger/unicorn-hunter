// Test script to verify endpoint returns codebase analysis scores
const testEndpoint = async () => {
  try {
    console.log('Testing endpoint with facebook/react...\n');
    
    const response = await fetch('https://valuation-mcp-server-554655392699.us-central1.run.app/mcp/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'agent_executor',
        arguments: {
          input: 'what is the unicorn score for facebook/react with codebase analysis?',
        },
      }),
    });

    const data = await response.json();
    
    if (data.content && data.content[0]) {
      const text = data.content[0].text;
      const parsed = JSON.parse(text);
      
      console.log('=== Response Structure ===');
      console.log('Top level keys:', Object.keys(parsed));
      console.log('\n=== Component Scores ===');
      
      if (parsed.unicorn_hunter && parsed.unicorn_hunter.component_scores) {
        const scores = parsed.unicorn_hunter.component_scores;
        console.log('All component scores:');
        Object.entries(scores).forEach(([key, value]) => {
          console.log(`  ${key}: ${value} (${typeof value})`);
        });
        
        console.log('\n=== Codebase Analysis Scores ===');
        const codebaseScores = {
          code_quality: scores.code_quality,
          maintainability: scores.maintainability,
          test_reliability: scores.test_reliability,
          security_posture: scores.security_posture,
        };
        
        Object.entries(codebaseScores).forEach(([key, value]) => {
          if (value !== undefined) {
            console.log(`  ${key}: ${value}`);
          } else {
            console.log(`  ${key}: NOT FOUND`);
          }
        });
      } else {
        console.log('ERROR: No component_scores found in unicorn_hunter');
        console.log('unicorn_hunter keys:', parsed.unicorn_hunter ? Object.keys(parsed.unicorn_hunter) : 'unicorn_hunter is missing');
      }
    } else {
      console.log('ERROR: No content in response');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
};

testEndpoint();

