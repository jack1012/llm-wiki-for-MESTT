const fs = require('fs');

const filesToRename = {
  "wiki/sources/summary-2010-OECD-How Many Students Drop Out of Tertiary E.md": "wiki/sources/summary-2010-oecd-how-many-students-drop-out.md",
  "wiki/sources/summary-2013-Xianglei Chen-STEM Attrition- College Students' Paths .md": "wiki/sources/summary-2013-chen-stem-attrition-paths.md",
  "wiki/sources/summary-2013-Hernandez-Against the odds resilience in mathemati.md": "wiki/sources/summary-2013-hernandez-against-the-odds-resilience.md",
  "wiki/sources/summary-2013-David Tall-The transition to formal knowledge in ma.md": "wiki/sources/summary-2013-tall-transition-to-formal-knowledge.md",
  "wiki/sources/summary-2015-Sebastian Geisler & Katrin Rolka-The role of beliefs for the transition f.md": "wiki/sources/summary-2015-geisler-beliefs-in-transition.md"
};

Object.keys(filesToRename).forEach(oldPath => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, filesToRename[oldPath]);
    console.log("Renamed: " + filesToRename[oldPath]);
  } else {
    console.log("File not found: " + oldPath);
  }
});
