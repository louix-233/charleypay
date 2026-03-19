const nodeAbi = require('node-abi');
try {
  console.log('ABI for Electron 39.2.7:', nodeAbi.getAbi('39.2.7', 'electron'));
} catch (e) {
  console.error(e.message);
}
