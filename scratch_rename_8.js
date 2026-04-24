const fs = require('fs');

const filesToRename = {
  "wiki/sources/summary-2021-sebastian-students-beliefs-during-the-transition.md": "wiki/sources/summary-2021-geisler-students-beliefs.md"
};

Object.keys(filesToRename).forEach(oldPath => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, filesToRename[oldPath]);
    console.log("Renamed: " + filesToRename[oldPath]);
  } else {
    console.log("File not found: " + oldPath);
  }
});
