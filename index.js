// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
require("@babel/polyfill");
require("@babel/register")({
  presets: ["@babel/preset-env"]
});

// Import the rest of our application.
module.exports = { entry: ["@babel/polyfill", require("./src/server.js")] };
