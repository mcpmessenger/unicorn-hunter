// Script to get Vercel project ID using the API
const https = require('https');

// First, we need to get the auth token from Vercel config
const fs = require('fs');
const path = require('path');
const os = require('os');

// Try to read Vercel config
const vercelConfigPath = path.join(os.homedir(), '.vercel', 'auth.json');
let token = null;

try {
  if (fs.existsSync(vercelConfigPath)) {
    const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    token = config.token;
  }
} catch (e) {
  console.log('Could not read Vercel auth token');
}

if (!token) {
  console.log('Please run: npx vercel login');
  console.log('Then run this script again');
  process.exit(1);
}

// Get projects
const options = {
  hostname: 'api.vercel.com',
  path: '/v9/projects?teamId=sentilabs',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const projects = JSON.parse(data);
      const project = projects.projects?.find(p => p.name === 'unicorn-hunter-main');
      
      if (project) {
        console.log('\n✅ Found Project:');
        console.log('Project Name:', project.name);
        console.log('Project ID:', project.id);
        console.log('Team ID:', project.teamId);
        console.log('\n📝 Add this to .vercel/project.json:');
        console.log(JSON.stringify({
          projectId: project.id,
          orgId: project.teamId
        }, null, 2));
      } else {
        console.log('Project "unicorn-hunter-main" not found');
        console.log('Available projects:');
        projects.projects?.forEach(p => {
          console.log(`  - ${p.name} (${p.id})`);
        });
      }
    } catch (e) {
      console.error('Error parsing response:', e.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();

