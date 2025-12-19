// Test different formats for vercel/next.js
const testFormats = async () => {
  const formats = [
    'what is the unicorn score for vercel/next.js with codebase analysis?',
    'what is the unicorn score for "vercel/next.js" with codebase analysis?',
    'what is the unicorn score for vercel/nextjs with codebase analysis?',
    'what is the unicorn score for vercel nextjs with codebase analysis?',
  ];

  for (const format of formats) {
    console.log(`\nTesting: ${format}`);
    try {
      const res = await fetch('https://valuation-mcp-server-lwo3sf5jba-uc.a.run.app/mcp/invoke', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          tool: 'agent_executor',
          arguments: { input: format }
        })
      });
      const data = await res.json();
      if (data.content && data.content[0]) {
        const parsed = JSON.parse(data.content[0].text);
        if (parsed.unicorn_hunter) {
          console.log(`✅ SUCCESS - Score: ${parsed.unicorn_hunter.unicorn_score}`);
          break;
        } else {
          console.log(`❌ Failed: ${parsed.error || 'Unknown error'}`);
        }
      }
    } catch(e) {
      console.log(`❌ Error: ${e.message}`);
    }
  }
};

testFormats();

