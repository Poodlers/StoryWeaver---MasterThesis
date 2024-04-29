const fs = require("fs");

// Time threshold (in milliseconds) for file cleanup
const timeThreshold = 24 * 60 * 60 * 1000; // 24 hours
// Function to cleanup files
const cleanupFiles = (directory) => {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = `${directory}/${file}`;
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error reading file stats for ${file}:`, err);
          return;
        }
        const lastAccessTime = new Date(stats.atime).getTime();
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - lastAccessTime;
        if (elapsedTime > timeThreshold) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${file}:`, err);
            } else {
              console.log(`File ${file} deleted successfully.`);
            }
          });
        }
      });
    });
  });
};

module.exports = cleanupFiles;
