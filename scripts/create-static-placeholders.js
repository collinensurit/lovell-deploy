#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create placeholder index/dashboard pages
const placeholders = [
  {
    path: path.join(__dirname, '..', 'src', 'app', 'page.tsx'),
    content: `
export const dynamic = 'force-static';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Lovell</h1>
      <p className="text-xl mb-8">This is a static export of the application.</p>
      <p className="mb-4">
        Dynamic features are not available in this preview mode.
      </p>
      <a 
        href="/dashboard" 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        View Dashboard
      </a>
    </div>
  );
}
`
  },
  {
    path: path.join(__dirname, '..', 'src', 'app', '(dashboard)', 'page.tsx'),
    content: `
export const dynamic = 'force-static';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      <p className="text-xl mb-8">Static Dashboard Preview</p>
      <p className="mb-4">
        This is a static preview of the dashboard. Dynamic features require server functionality.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i}
            className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">Sample Project {i + 1}</h2>
            <p className="text-gray-600 mb-4">This is a placeholder project card</p>
          </div>
        ))}
      </div>
    </div>
  );
}
`
  }
];

// Function to create/update placeholder files
function createPlaceholders() {
  console.log('Creating static placeholder pages...');
  
  placeholders.forEach(({ path: filePath, content }) => {
    // Create backup if file exists
    if (fs.existsSync(filePath)) {
      const backupPath = `${filePath}.bak`;
      console.log(`Backing up original file: ${filePath} -> ${backupPath}`);
      fs.copyFileSync(filePath, backupPath);
    }
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the placeholder content
    console.log(`Creating placeholder: ${filePath}`);
    fs.writeFileSync(filePath, content.trim());
  });
}

createPlaceholders();
console.log('Done creating static placeholders!');
