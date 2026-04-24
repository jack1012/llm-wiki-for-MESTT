const fs = require('fs');

const filesToRename = {
  "wiki/sources/summary-2015-Ria J. Symonds-Support measures in the first year of un.md": "wiki/sources/summary-2015-symonds-support-measures.md",
  "wiki/sources/summary-2016-Ghislaine Gueudet-Transitions in Mathematics Education (IC.md": "wiki/sources/summary-2016-gueudet-transitions-in-mathematics-education.md",
  "wiki/sources/summary-2016-Irene Biza-The secondary-tertiary transition in mat.md": "wiki/sources/summary-2016-biza-secondary-tertiary-transition.md",
  "wiki/sources/summary-2016-Jooganah-Contradictions between andwithin school .md": "wiki/sources/summary-2016-jooganah-contradictions.md",
  "wiki/sources/summary-2016-Paul Hernandez-Martinez-Lost in Transition- Alienation and Drop .md": "wiki/sources/summary-2016-hernandez-lost-in-transition.md"
};

Object.keys(filesToRename).forEach(oldPath => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, filesToRename[oldPath]);
    console.log("Renamed: " + filesToRename[oldPath]);
  } else {
    console.log("File not found: " + oldPath);
  }
});
