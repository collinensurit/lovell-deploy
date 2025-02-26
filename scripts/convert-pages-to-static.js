#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Base app directory
const APP_DIR = path.join(__dirname, '..', 'src', 'app');

// Process all files in a directory recursively
function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory does not exist: ${dirPath}`);
    return;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      // Read the file
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if it uses force-dynamic
      if (content.includes("dynamic = 'force-dynamic'") || 
          content.includes('dynamic = "force-dynamic"')) {
        console.log(`- Converting to static mode: ${fullPath}`);
        
        // Replace force-dynamic with force-static
        const updatedContent = content
          .replace(/dynamic\s*=\s*['"]force-dynamic['"]/g, "dynamic = 'force-static'")
          .replace(/dynamic:\s*['"]force-dynamic['"]/g, "dynamic: 'force-static'");
        
        fs.writeFileSync(fullPath, updatedContent);
      }
    }
  }
}

console.log('Converting all pages to static mode...');
processDirectory(APP_DIR);
console.log('Done converting pages!');
