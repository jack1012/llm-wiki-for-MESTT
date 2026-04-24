const fs = require('fs');

const filesToRename = {
  "wiki/sources/summary-2022-Martion-The transition from school to university.md": "wiki/sources/summary-2022-martino-transition-from-school.md"
};

Object.keys(filesToRename).forEach(oldPath => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, filesToRename[oldPath]);
    console.log("Renamed: " + filesToRename[oldPath]);
  } else {
    console.log("File not found: " + oldPath);
  }
});
