const fs = require('fs');

const filesToRename = {
  "wiki/sources/summary-2017-Alexandros Chrysikos-Analysis of Tinto-s student integration .md": "wiki/sources/summary-2017-chrysikos-analysis-of-tinto.md",
  "wiki/sources/summary-2017-Corriveau-Secondary-to-tertiary comparison through.md": "wiki/sources/summary-2017-corriveau-secondary-to-tertiary-comparison.md",
  "wiki/sources/summary-2017-Jablonka-First Year Engineering Students- Recogni.md": "wiki/sources/summary-2017-jablonka-first-year-engineering-students.md",
  "wiki/sources/summary-2017-Liebendorfer-Interest development during the first ye.md": "wiki/sources/summary-2017-liebendorfer-interest-development.md",
  "wiki/sources/summary-2017-Thoma-Transition from School to University Mat.md": "wiki/sources/summary-2017-thoma-transition-from-school-to-university.md"
};

Object.keys(filesToRename).forEach(oldPath => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, filesToRename[oldPath]);
    console.log("Renamed: " + filesToRename[oldPath]);
  } else {
    console.log("File not found: " + oldPath);
  }
});
