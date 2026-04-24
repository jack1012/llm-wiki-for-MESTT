const fs = require('fs');

const filesToRename = {
  "wiki/sources/summary-2023-martino-the-transition-from-school-to.md": "wiki/sources/summary-2023-martino-transition-from-school.md",
  "wiki/sources/summary-2023-pietro-transition-from-school-into-university.md": "wiki/sources/summary-2023-di-martino-transition-from-school-into-university.md",
  "wiki/sources/summary-2023-sebastian-development-of-affect-at-the.md": "wiki/sources/summary-2023-geisler-development-of-affect.md",
  "wiki/sources/summary-2023-stefanie-motivational-states-in-an-undergraduate.md": "wiki/sources/summary-2023-rach-motivational-states.md"
};

Object.keys(filesToRename).forEach(oldPath => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, filesToRename[oldPath]);
    console.log("Renamed: " + filesToRename[oldPath]);
  } else {
    console.log("File not found: " + oldPath);
  }
});
