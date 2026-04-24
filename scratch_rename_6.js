const fs = require('fs');

const filesToRename = {
  "wiki/sources/summary-2019-Rach-Self-concept inuniversitymathematicscour.md": "wiki/sources/summary-2019-rach-self-concept.md",
  "wiki/sources/summary-2019-Sommerhoff-Acceptance criteria for validating mathe.md": "wiki/sources/summary-2019-sommerhoff-acceptance-criteria.md",
  "wiki/sources/summary-2019-Valldosera-A Dropout Definition for Continuance Int.md": "wiki/sources/summary-2019-valldosera-dropout-definition.md",
  "wiki/sources/summary-2020-Sebastian Geisler-Early Dropout from University Mathematic.md": "wiki/sources/summary-2020-geisler-early-dropout.md",
  "wiki/sources/summary-2020-Deeken-Mathematical Prerequisites for STEM Prog.md": "wiki/sources/summary-2020-deeken-mathematical-prerequisites.md"
};

Object.keys(filesToRename).forEach(oldPath => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, filesToRename[oldPath]);
    console.log("Renamed: " + filesToRename[oldPath]);
  } else {
    console.log("File not found: " + oldPath);
  }
});
