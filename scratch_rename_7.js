const fs = require('fs');

const filesToRename = {
  "wiki/sources/summary-2020-Lerman-Encyclopedia of Mathematics Education S.md": "wiki/sources/summary-2020-lerman-encyclopedia-of-mathematics-education.md",
  "wiki/sources/summary-2020-Rach-Which Prior Mathematical Knowledge Is Ne.md": "wiki/sources/summary-2020-rach-prior-mathematical-knowledge.md",
  "wiki/sources/summary-2020-Tsai-Precision education with statistical lea.md": "wiki/sources/summary-2020-tsai-precision-education.md",
  "wiki/sources/summary-2020-Xavier-A LITERATURE REVIEW ON THE DEFINITIONS O.md": "wiki/sources/summary-2020-xavier-literature-review-on-definitions.md"
};

Object.keys(filesToRename).forEach(oldPath => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, filesToRename[oldPath]);
    console.log("Renamed: " + filesToRename[oldPath]);
  } else {
    console.log("File not found: " + oldPath);
  }
});
