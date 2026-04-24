const fs = require('fs');

const filesToRename = {
  "wiki/sources/summary-2018-Camelia-University dropout Causes and solution.md": "wiki/sources/summary-2018-camelia-university-dropout.md",
  "wiki/sources/summary-2018-Kouvela-an analysis of messages received by firs.md": "wiki/sources/summary-2018-kouvela-analysis-of-messages.md",
  "wiki/sources/summary-2019-Bergsten-Understanding the secondary-tertiary tra.md": "wiki/sources/summary-2019-bergsten-understanding-the-transition.md",
  "wiki/sources/summary-2019-Dibbs-Forged in failure engagement patterns fo.md": "wiki/sources/summary-2019-dibbs-forged-in-failure.md",
  "wiki/sources/summary-2019-Gregorio-The Secondary-Tertiary Transition in Mat.md": "wiki/sources/summary-2019-gregorio-secondary-tertiary-transition.md"
};

Object.keys(filesToRename).forEach(oldPath => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, filesToRename[oldPath]);
    console.log("Renamed: " + filesToRename[oldPath]);
  } else {
    console.log("File not found: " + oldPath);
  }
});
