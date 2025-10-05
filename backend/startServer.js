const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the process ID using port 3000
async function getProcessIdByPort(port) {
  return new Promise((resolve) => {
    const netstat = spawn('netstat', ['-ano']);
    let output = '';

    netstat.stdout.on('data', (data) => {
      output += data.toString();
    });

    netstat.on('close', () => {
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.includes(`:${port}`)) {
          const pid = line.trim().split(/\s+/).pop();
          resolve(pid);
          return;
        }
      }
      resolve(null);
    });
  });
}

// Kill process by ID
async function killProcess(pid) {
  return new Promise((resolve) => {
    const taskkill = spawn('taskkill', ['/F', '/PID', pid]);
    taskkill.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

// Main function to start the server
async function startServer() {
  try {
    // Check if port 3000 is in use
    const pid = await getProcessIdByPort(3000);
    if (pid) {
      console.log(`Port 3000 is in use by process ${pid}. Attempting to kill...`);
      const killed = await killProcess(pid);
      if (killed) {
        console.log('Successfully killed previous process');
        // Wait a moment for the port to be fully released
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        throw new Error('Failed to kill process using port 3000');
      }
    }

    // Start the server
    const serverPath = path.join(__dirname, 'server.js');
    if (!fs.existsSync(serverPath)) {
      throw new Error('server.js not found!');
    }

    console.log('Starting server...');
    const server = spawn('node', ['server.js'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, PORT: 3000 }
    });

    let startupTimeout = setTimeout(() => {
      console.error('Server failed to start within 10 seconds');
      server.kill();
    }, 10000);

    server.on('error', (error) => {
      console.error('Failed to start server:', error);
      clearTimeout(startupTimeout);
      setTimeout(startServer, 2000);
    });

    // Handle server exit
    server.on('exit', (code) => {
      clearTimeout(startupTimeout);
      if (code !== 0 && code !== null) {
        console.log(`Server exited with code ${code}. Restarting in 2 seconds...`);
        setTimeout(startServer, 2000);
      } else if (code === null) {
        console.log('Server was killed. Restarting in 2 seconds...');
        setTimeout(startServer, 2000);
      }
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Start the server
startServer();