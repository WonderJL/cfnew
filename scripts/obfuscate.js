const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const sourceFileName = 'main.ts';
const outputFileName = 'worker.js';
const distDir = path.join(process.cwd(), 'dist');
const srcDir = path.join(process.cwd(), 'src');
const sourceFilePath = path.join(srcDir, sourceFileName);
const outputFilePath = path.join(distDir, outputFileName);

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (!fs.existsSync(sourceFilePath)) {
  console.error('错误：在路径 \'' + sourceFilePath + '\' 未找到源文件。请确保 src 目录下有名为 \'main.ts\' 的文件。');
  process.exit(1);
}

const originalCode = fs.readFileSync(sourceFilePath, 'utf8');

if (!originalCode || originalCode.trim().length === 0) {
  console.error('错误：源文件 ' + sourceFileName + ' 为空。');
  process.exit(1);
}

const obfuscationOptions = {
    compact: true,
    controlFlowFlattening: false,
    controlFlowFlatteningThreshold: 0,
    deadCodeInjection: false,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 1.0,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: false,
    stringArrayWrappersParametersMaxCount: 3,
    renameGlobals: true,
    identifierNamesGenerator: 'mangled-shuffled',
    identifierNamesCache: null,
    identifiersPrefix: '',
    renameProperties: false,
    renamePropertiesMode: 'safe',
    ignoreImports: false,
    target: 'browser',
    numbersToExpressions: false,
    simplify: false,
    splitStrings: true,
    splitStringsChunkLength: 1,
    transformObjectKeys: false,
    unicodeEscapeSequence: true,
    selfDefending: false,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: true,
    domainLock: []
};

const obfuscatedCode = JavaScriptObfuscator.obfuscate(originalCode, obfuscationOptions).getObfuscatedCode();

fs.writeFileSync(outputFilePath, obfuscatedCode, 'utf8');
console.log('成功将 \'' + sourceFileName + '\' 混淆并保存至 \'' + outputFilePath + '\'。');
