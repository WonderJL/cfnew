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

let obfuscatedCode = JavaScriptObfuscator.obfuscate(originalCode, obfuscationOptions).getObfuscatedCode();

// Restore the import specifier to ensure Cloudflare Workers can parse it correctly
// Replace hex-escaped 'cloudflare:sockets' with the plain string
obfuscatedCode = obfuscatedCode.replace(
    /import\s*\{[^}]+\}\s*from\s*['"]\\x63\\x6c\\x6f\\x75\\x64\\x66\\x6c\\x61\\x72\\x65\\x3a\\x73\\x6f\\x63\\x6b\\x65\\x74\\x73['"]/g,
    "import{connect}from'cloudflare:sockets'"
);

fs.writeFileSync(outputFilePath, obfuscatedCode, 'utf8');
console.log('成功将 \'' + sourceFileName + '\' 混淆并保存至 \'' + outputFilePath + '\'。');
