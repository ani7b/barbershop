const { spawn } = require("child_process");

const serverScript = "server.js";
const restartInterval = 15000;

let serverProcess;

function startServer() {
  console.log("Starting server...");
  const server = spawn("node", [serverScript]);

  server.stdout.on("data", (data) => {
    console.log(`Server output: ${data}`);
  });

  server.stderr.on("data", (data) => {
    console.error(`Server error: ${data}`);
  });

  server.on("close", (code) => {
    console.log(`Server process exited with code ${code}`);
  });

  return server;
}

function stopServer() {
  if (serverProcess) {
    console.log("Stopping server...");
    serverProcess.kill();
    serverProcess = null;
  }
}

function restartServer() {
  stopServer();
  serverProcess = startServer();
  setTimeout(restartServer, restartInterval);
}

// Start the server initially
serverProcess = startServer();

// Schedule restarts
setTimeout(restartServer, restartInterval);
