const { spawn } = require("child_process");
const express = require("express");
const { resolve } = require("path")

const child = spawn("npx", ["vite", "build", "--watch"], {  env: process.env  })

child.stdout.on('data', (data) => {
  console.log(data);
});

// Listen for the stderr data event
child.stderr.on('data', (data) => {
  console.error(data);
});

child.on('error', (data) => {
  console.error(data);
});

// Listen for the close event
child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

const app = express();

app.use(express.static("dist"));

app.use((req, res) => {
  res.sendFile(resolve(process.cwd(), "dist/index.html"));
});

const port = process.env.PORT || 5173

app.listen(port, () => {
  console.log(`Workaround server ready on http://localhost:${port}`)
})