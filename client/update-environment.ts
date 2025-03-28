import * as fs from 'fs';
import * as path from 'path';

// Path to the production environment file (adjust the path if needed)
const environmentProdPath = path.resolve(__dirname, 'src/environments/environment.prod.ts');

// Retrieve the backend URL from an environment variable
const backendUrl = process.env.BACKEND_URL || 'https://localhost:7021';

// Create/update the environment configuration content
const environmentProdContent = `export const environment = {
    production: true,
    apiEndpoint: '${backendUrl}/api',
    wsEndpoint: '${backendUrl}',
    dynamicMenuEnabled: true
};
`;

// Write the file content
fs.writeFileSync(environmentProdPath, environmentProdContent, { encoding: 'utf8' });
console.log(`Updated ${environmentProdPath} with backend URL: ${backendUrl}`);
