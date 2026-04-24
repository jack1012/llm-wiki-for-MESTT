const fs = require('fs');

const filesToRename = {
  "wiki/sources/summary-2018-Andrijana Burazin & Miroslav Lovric-Transition from Secondary to Tertiary Ma.md": "wiki/sources/summary-2018-burazin-transition-from-secondary-to-tertiary.md",
  "wiki/sources/summary-2018-Carmen Aina-The Economics of University Dropouts and.md": "wiki/sources/summary-2018-aina-economics-of-university-dropouts.md",
  "wiki/sources/summary-2018-Pietro Di Martino-The Mathematical Crisis in Secondary-Ter.md": "wiki/sources/summary-2018-di-martino-mathematical-crisis.md",
  "wiki/sources/summary-2019-Kosiol-Mathematics Interest is Important for a .md": "wiki/sources/summary-2019-kosiol-mathematics-interest.md",
  "wiki/sources/summary-2019-Lima-Difficulties in basic concepts of mathem.md": "wiki/sources/summary-2019-lima-difficulties-in-basic-concepts.md"
};

Object.keys(filesToRename).forEach(oldPath => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, filesToRename[oldPath]);
    console.log("Renamed: " + filesToRename[oldPath]);
  } else {
    console.log("File not found: " + oldPath);
  }
});
