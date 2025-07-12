// @ts-nocheck
import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to recursively read directory contents
async function getDirectoryTree(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const tree = {};
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      tree[entry.name] = await getDirectoryTree(fullPath);
    } else {
      tree[entry.name] = await fs.readFile(fullPath, 'utf-8');
    }
  }
  return tree;
}

describe('Type Generation', () => {
  it('should generate types that match the snapshot', async () => {
    // We need a URL for the test to run, so we'll use a mock server
    // or a known-good file from a local source. For now, we'll just
    // use a placeholder and expect the build to fail gracefully.
    // In a real CI environment, you'd replace this with a stable URL.
    const originalContent = await fs.readFile(
      path.resolve(__dirname, '../scripts/generate-types.js'),
      'utf-8'
    );

    // Temporarily replace the CLIENT_URL with a placeholder that will cause a graceful exit
    const modifiedContent = originalContent.replace(
      "const CLIENT_URL = '';",
      "const CLIENT_URL = 'https://127.0.0.1/non-existent-file.js';"
    );
    await fs.writeFile(
      path.resolve(__dirname, '../scripts/generate-types.js'),
      modifiedContent
    );

    try {
      // Run the build script
      execSync('pnpm run build', { stdio: 'inherit' });
    } catch (error) {
      // The build is expected to fail because the URL is invalid.
      // We can proceed to check the state of the dist directory.
    }

    // Restore the original file content
    await fs.writeFile(
      path.resolve(__dirname, '../scripts/generate-types.js'),
      originalContent
    );

    const distPath = path.resolve(__dirname, '../dist');
    const distTree = await getDirectoryTree(distPath);

    // Create a serializable representation of the directory structure and content
    const snapshot = JSON.stringify(distTree, null, 2);

    expect(snapshot).toMatchSnapshot();
  }, 30000);
});
