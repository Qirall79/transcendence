import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration for important files and directories
const CONFIG = {
  // Core configuration files that contain project setup
  importantConfigFiles: [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'tailwind.config.js',
    'components.json'
  ],
  
  // Source file extensions to read content from
  sourceFilesToRead: [
    '.tsx',
    '.ts',
    '.jsx',
    '.js'
  ],
  
  // Important directories to analyze
  importantDirs: [
    'src/components',
    'src/pages',
    'src/contexts',
    'src/hooks',
    'src/utils',
    'src/actions'
  ],
  
  // Directories to exclude from analysis
  excludeDirs: [
    'node_modules',
    '.github',
    'dist',
    'build',
    'coverage',
    '.git',
    '.vscode',
    '.idea'
  ],
  
  // Files to exclude from analysis
  excludeFiles: [
    'README.md',
    'LICENSE',
    'analyze-project.js',
    '.gitignore',
    '.npmrc',
    '.prettierrc',
    '.eslintrc',
    '.env',
    '.env.example',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.dockerignore',
    'docker-compose.yml',
    'Dockerfile',
    '*.test.ts',
    '*.test.tsx',
    '*.spec.ts',
    '*.spec.tsx',
    '*.d.ts'
  ],
  
  // Valid file extensions for analysis
  validExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
};

function isExcludedFile(filename) {
  return CONFIG.excludeFiles.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(filename);
    }
    return filename === pattern;
  });
}

function isImportantFile(filePath) {
  const ext = extname(filePath);
  const filename = filePath.split('/').pop();
  
  if (isExcludedFile(filename)) {
    return false;
  }
  
  return CONFIG.validExtensions.includes(ext);
}

function readFileContent(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const ext = extname(filePath);
    if (ext === '.json') {
      return JSON.parse(content);
    }
    return content;
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
    return null;
  }
}

function analyzeDirectory(dir) {
  const result = {
    structure: {},
    dependencies: {},
    components: [],
    pages: [],
    hooks: [],
    contexts: [],
    utils: [],
    actions: [],
    fileContents: {}
  };

  // Read package.json
  const packageJson = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  result.dependencies = {
    dependencies: packageJson.dependencies || {},
    devDependencies: packageJson.devDependencies || {}
  };

  function analyzeDir(currentPath, structureObj) {
    const entries = readdirSync(currentPath, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = join(currentPath, entry.name);
      const relativePath = relative(dir, fullPath);

      // Skip excluded directories and files
      if (CONFIG.excludeDirs.some(excluded => relativePath.includes(excluded)) ||
          isExcludedFile(entry.name)) {
        return;
      }

      if (entry.isDirectory()) {
        structureObj[entry.name] = {};
        analyzeDir(fullPath, structureObj[entry.name]);

        // Analyze special directories and store their contents
        CONFIG.importantDirs.forEach(importantDir => {
          if (relativePath.includes(importantDir)) {
            const category = importantDir.split('/').pop();
            const files = readdirSync(fullPath)
              .filter(file => isImportantFile(file))
              .map(file => {
                const filePath = join(relativePath, file);
                result.fileContents[filePath] = readFileContent(join(dir, filePath));
                return filePath;
              });
            result[category]?.push(...files);
          }
        });
      } else if (isImportantFile(entry.name)) {
        structureObj[entry.name] = null;

        // Read content of important configuration files
        if (CONFIG.importantConfigFiles.includes(entry.name)) {
          result[entry.name] = readFileContent(fullPath);
        }
        
        // Store content of source files
        const ext = extname(entry.name);
        if (CONFIG.sourceFilesToRead.includes(ext)) {
          result.fileContents[relativePath] = readFileContent(fullPath);
        }
      }
    });
  }

  // Start analysis from root
  analyzeDir(dir, result.structure);

  return result;
}

// Execute analysis and write result
const projectDir = process.cwd();
const analysis = analyzeDirectory(projectDir);
writeFileSync('project-analysis.json', JSON.stringify(analysis, null, 2));

console.log('Analysis complete! Check project-analysis.json for results.');