import './config';
import { startServer } from './server';

async function main() {
  try {
    // Start the server
    await startServer();
  } catch (error) {
    console.error("Fatal error in main:", error);
    process.exit(1);
  }
}

main();
