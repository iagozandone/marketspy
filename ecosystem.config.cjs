module.exports = {
  apps: [
    {
      name: "marketspy",
      script: "api/index.ts",
      interpreter: "node",
      interpreter_args: "--loader ts-node/esm",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
