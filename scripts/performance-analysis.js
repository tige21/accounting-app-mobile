#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class PerformanceAnalyzer {
  constructor() {
    this.metrics = {};
    this.startTime = Date.now();
  }

  // Simple file analysis avoiding complex directory traversals
  analyzeBundleSize() {
    const projectRoot = path.resolve(__dirname, '..');
    
    const countFilesSimple = (dirPath, extensions = ['.tsx', '.ts']) => {
      let count = 0;
      let totalLines = 0;
      
      if (!fs.existsSync(dirPath)) {
        return { count: 0, totalLines: 0 };
      }
      
      try {
        const entries = fs.readdirSync(dirPath);
        
        for (const entry of entries) {
          if (entry.startsWith('.') || entry === 'node_modules') continue;
          
          const fullPath = path.join(dirPath, entry);
          
          try {
            const stat = fs.statSync(fullPath);
            
            if (stat.isFile() && extensions.some(ext => entry.endsWith(ext))) {
              count++;
              const content = fs.readFileSync(fullPath, 'utf8');
              totalLines += content.split('\n').length;
            }
          } catch (err) {
            // Skip files that can't be read
          }
        }
      } catch (err) {
        // Skip directories that can't be read
      }
      
      return { count, totalLines };
    };

    // Analyze source files
    const appFiles = countFilesSimple(path.join(projectRoot, 'app'));
    const componentFiles = countFilesSimple(path.join(projectRoot, 'components'));
    const hooksFiles = countFilesSimple(path.join(projectRoot, 'hooks'));
    const storeFiles = countFilesSimple(path.join(projectRoot, 'store'));

    this.metrics.sourceFiles = {
      app: appFiles,
      components: componentFiles,
      hooks: hooksFiles,
      store: storeFiles,
      total: {
        count: appFiles.count + componentFiles.count + hooksFiles.count + storeFiles.count,
        lines: appFiles.totalLines + componentFiles.totalLines + hooksFiles.totalLines + storeFiles.totalLines
      }
    };

    return this.metrics.sourceFiles;
  }

  // Analyze dependencies
  analyzeDependencies() {
    const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
    let packageJson = {};
    
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (err) {
      console.error('Could not read package.json:', err.message);
    }
    
    const dependencies = Object.keys(packageJson.dependencies || {}).length;
    const devDependencies = Object.keys(packageJson.devDependencies || {}).length;
    
    this.metrics.dependencies = {
      production: dependencies,
      development: devDependencies,
      total: dependencies + devDependencies
    };

    return this.metrics.dependencies;
  }

  // Find large files that could be optimized
  findLargeFiles() {
    const projectRoot = path.resolve(__dirname, '..');
    const largeFiles = [];
    const directories = ['app', 'components', 'hooks', 'store'];
    
    for (const dir of directories) {
      const dirPath = path.join(projectRoot, dir);
      
      if (!fs.existsSync(dirPath)) continue;
      
      try {
        const entries = fs.readdirSync(dirPath);
        
        for (const entry of entries) {
          if (entry.startsWith('.')) continue;
          
          const fullPath = path.join(dirPath, entry);
          
          try {
            const stat = fs.statSync(fullPath);
            
            if (stat.isFile() && (entry.endsWith('.tsx') || entry.endsWith('.ts'))) {
              const content = fs.readFileSync(fullPath, 'utf8');
              const lines = content.split('\n').length;
              
              if (lines > 300) { // Files larger than 300 lines
                largeFiles.push({
                  path: path.relative(projectRoot, fullPath),
                  lines,
                  size: stat.size
                });
              }
            }
          } catch (err) {
            // Skip files that can't be read
          }
        }
      } catch (err) {
        // Skip directories that can't be read
      }
    }
    
    largeFiles.sort((a, b) => b.lines - a.lines);
    
    this.metrics.largeFiles = largeFiles;
    return largeFiles;
  }

  // Generate performance report
  generateReport() {
    const analysisTime = Date.now() - this.startTime;
    
    console.log('📊 PERFORMANCE ANALYSIS REPORT');
    console.log('==================================\n');
    
    console.log('📁 Source Files:');
    console.log(`   App Files: ${this.metrics.sourceFiles?.app.count || 0} files (${this.metrics.sourceFiles?.app.totalLines || 0} lines)`);
    console.log(`   Components: ${this.metrics.sourceFiles?.components.count || 0} files (${this.metrics.sourceFiles?.components.totalLines || 0} lines)`);
    console.log(`   Hooks: ${this.metrics.sourceFiles?.hooks.count || 0} files (${this.metrics.sourceFiles?.hooks.totalLines || 0} lines)`);
    console.log(`   Store: ${this.metrics.sourceFiles?.store.count || 0} files (${this.metrics.sourceFiles?.store.totalLines || 0} lines)`);
    console.log(`   Total: ${this.metrics.sourceFiles?.total.count || 0} files (${this.metrics.sourceFiles?.total.lines || 0} lines)\n`);
    
    console.log('📦 Dependencies:');
    console.log(`   Production: ${this.metrics.dependencies?.production || 0}`);
    console.log(`   Development: ${this.metrics.dependencies?.development || 0}`);
    console.log(`   Total: ${this.metrics.dependencies?.total || 0}\n`);
    
    console.log('🔍 Large Files (>300 lines):');
    if (this.metrics.largeFiles && this.metrics.largeFiles.length > 0) {
      this.metrics.largeFiles.slice(0, 10).forEach(file => {
        console.log(`   ${file.path}: ${file.lines} lines (${(file.size / 1024).toFixed(1)}KB)`);
      });
    } else {
      console.log('   No large files found');
    }
    console.log('');
    
    console.log(`⏱️  Analysis completed in ${analysisTime}ms\n`);
    
    // Performance recommendations
    this.generateRecommendations();
    
    return this.metrics;
  }

  generateRecommendations() {
    console.log('💡 Performance Recommendations:');
    console.log('==================================\n');
    
    const largeFileCount = this.metrics.largeFiles?.length || 0;
    if (largeFileCount > 0) {
      console.log(`⚠️  Found ${largeFileCount} large files that could be split into smaller components`);
    }
    
    const totalLines = this.metrics.sourceFiles?.total.lines || 0;
    if (totalLines > 10000) {
      console.log('⚠️  Large codebase - consider implementing code splitting');
    }
    
    const totalDeps = this.metrics.dependencies?.total || 0;
    if (totalDeps > 50) {
      console.log('⚠️  High dependency count - audit for unused dependencies');
    }
    
    console.log('✅ Completed structural optimizations:');
    console.log('   - Consolidated hooks directory structure');
    console.log('   - Updated component index exports');
    console.log('   - Fixed import paths');
    console.log('   - Added performance monitoring script');
    console.log('');

    console.log('🚀 Next optimization opportunities:');
    console.log('   - Fix TypeScript compilation errors');
    console.log('   - Remove unused dependencies');
    console.log('   - Split large components (>500 lines)');
    console.log('   - Implement lazy loading for heavy components');
    console.log('   - Add bundle analysis with Metro bundler');
    console.log('');
  }

  async run() {
    console.log('Starting performance analysis...\n');
    
    this.analyzeBundleSize();
    this.analyzeDependencies();
    this.findLargeFiles();
    
    return this.generateReport();
  }
}

// Run the analysis
if (require.main === module) {
  const analyzer = new PerformanceAnalyzer();
  analyzer.run().catch(console.error);
}

module.exports = PerformanceAnalyzer;