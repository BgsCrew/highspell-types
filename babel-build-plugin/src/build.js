const babel = require('@babel/core');
const fs = require('fs').promises;
const path = require('path');

async function build(inputFile, outputFile) {
  try {
    const inputCode = await fs.readFile(inputFile, 'utf-8');

    const result = await babel.transformAsync(inputCode, {
      plugins: [require.resolve('./babel-plugin-highspell.js')],
      sourceMaps: 'inline',
    });

    if (result && result.code) {
      await fs.writeFile(outputFile, result.code);
      console.log(`Successfully built ${inputFile} to ${outputFile}`);
    }
  } catch (error) {
    console.error('Error during build:', error);
  }
}

module.exports = { build };
