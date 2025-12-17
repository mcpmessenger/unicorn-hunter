// Test endpoint to see full response structure and check for natural language analysis
const testEndpoint = async () => {
  const repo = 'facebook/react';
  
  console.log(`Testing endpoint with ${repo}...\n`);
  
  try {
    const response = await fetch('https://valuation-mcp-server-554655392699.us-central1.run.app/mcp/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'agent_executor',
        arguments: {
          input: `what's the unicorn score for ${repo} with codebase analysis?`,
        },
      }),
    });

    const data = await response.json();
    
    console.log('=== RAW RESPONSE ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n');
    
    if (data.content && data.content[0]) {
      const textItem = data.content[0];
      console.log('=== CONTENT[0] TYPE ===');
      console.log('Type:', typeof textItem.text);
      console.log('Is string?', typeof textItem.text === 'string');
      console.log('\n');
      
      // Try to parse as JSON
      let parsed;
      try {
        parsed = JSON.parse(textItem.text);
        console.log('=== PARSED JSON ===');
        console.log(JSON.stringify(parsed, null, 2));
        console.log('\n');
        
        // Check for natural language fields
        console.log('=== CHECKING FOR NATURAL LANGUAGE ===');
        if (parsed.unicorn_hunter) {
          console.log('unicorn_hunter.interpretation:', parsed.unicorn_hunter.interpretation);
          console.log('unicorn_hunter.score_meaning:', parsed.unicorn_hunter.score_meaning);
          console.log('unicorn_hunter.valuation_note:', parsed.unicorn_hunter.valuation_note);
          console.log('unicorn_hunter.factors_considered:', parsed.unicorn_hunter.factors_considered);
        }
        if (parsed.summary) {
          console.log('summary:', parsed.summary);
        }
        if (parsed.analysis) {
          console.log('analysis keys:', Object.keys(parsed.analysis));
        }
        
        // Check component scores
        console.log('\n=== COMPONENT SCORES ===');
        if (parsed.unicorn_hunter && parsed.unicorn_hunter.component_scores) {
          const scores = parsed.unicorn_hunter.component_scores;
          Object.entries(scores).forEach(([key, value]) => {
            console.log(`${key}: ${value} (${typeof value})`);
          });
        }
        
        // Check codebase analysis
        console.log('\n=== CODEBASE ANALYSIS ===');
        if (parsed.codebase_analysis) {
          console.log('codebase_analysis keys:', Object.keys(parsed.codebase_analysis));
          console.log(JSON.stringify(parsed.codebase_analysis, null, 2));
        }
        if (parsed.unicorn_hunter && parsed.unicorn_hunter.codebase_analysis) {
          console.log('unicorn_hunter.codebase_analysis keys:', Object.keys(parsed.unicorn_hunter.codebase_analysis));
          console.log(JSON.stringify(parsed.unicorn_hunter.codebase_analysis, null, 2));
        }
        
      } catch (parseError) {
        console.log('=== NOT JSON - PLAIN TEXT ===');
        console.log('Text content:', textItem.text);
        console.log('Parse error:', parseError.message);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
};

testEndpoint();

