// gatsby-node.js - Minimal working version
exports.onPreBuild = () => {
  console.log('M.E.G.A.: Build hook active.');
  return Promise.resolve();
};