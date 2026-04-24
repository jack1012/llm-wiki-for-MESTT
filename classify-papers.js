#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SOURCES_DIR = 'D:/llm-wiki-en/wiki/sources';
const files = fs.readdirSync(SOURCES_DIR).filter(f => f.endsWith('.md')).sort();

const papers = files.map(f => {
  const content = fs.readFileSync(path.join(SOURCES_DIR, f), 'utf8');
  const titleMatch = content.match(/^title:\s*"?([^"\n]+)"?/m);
  const authorMatch = content.match(/^author:\s*"?([^"\n]+)"?/m);
  const yearMatch = content.match(/^year:\s*(\d{4})/m);
  const tagsMatch = content.match(/^tags:\s*\[([^\]]*)\]/m);
  const isChinese = /[\u4e00-\u9fff]/.test(f);
  return {
    f,
    title: titleMatch ? titleMatch[1].trim() : '',
    author: authorMatch ? authorMatch[1].trim() : '',
    year: yearMatch ? parseInt(yearMatch[1]) : 0,
    tags: tagsMatch ? tagsMatch[1] : '',
    isChinese,
    titleLower: (titleMatch ? titleMatch[1] : f).toLowerCase()
  };
});

function classify(p) {
  const t = p.titleLower;
  const tags = p.tags.toLowerCase();
  const a = (p.author || '').toLowerCase();

  // A: STT Theoretical Frameworks
  if (
    (t.includes('theoretical') && (t.includes('model') || t.includes('synthesis'))) ||
    (t.includes('framework') && t.includes('transition')) ||
    (t.includes('comparing') && t.includes('framework')) ||
    (t.includes('investigating') && t.includes('secondary') && t.includes('tertiary')) ||
    (t.includes('difficulties') && t.includes('passage') && a.includes('guzm')) ||
    (t.includes('transition') && t.includes('mathematics education') && a.includes('gueudet')) ||
    (t.includes('new epistemology') && a.includes('chevallard')) ||
    (t.includes('transformation') && t.includes('fundamental idea')) ||
    (t.includes('new insights') && t.includes('secondary-tertiary')) ||
    (t.includes('encyclopedia') && t.includes('mathematics education')) ||
    (t.includes('trends') && t.includes('didactic research')) ||
    (t.includes('cerme') && t.includes('working group'))
  ) return 'A';

  // B: Cognitive & Mathematical Thinking
  if (
    (t.includes('concept') && (t.includes('math') || t.includes('equation'))) ||
    (t.includes('proof') && t.includes('proving')) ||
    (t.includes('acceptance criteria') && t.includes('proof')) ||
    t.includes('formal knowledge') ||
    t.includes('student perspectives on equation') ||
    t.includes('discourse change') || t.includes('commognition') ||
    t.includes('lens of the way of doing') ||
    t.includes('prerequisite') ||
    t.includes('prior mathematical knowledge') ||
    t.includes('mathematical prerequisites') ||
    (t.includes('basic concepts') && t.includes('obstacle')) ||
    (t.includes('patterns of change') && t.includes('transition')) ||
    t.includes('reducing the gap') ||
    t.includes('school-tertiary interface') ||
    (t.includes('cultural gap') && t.includes('lecturers')) ||
    (t.includes('university mathematics students') && t.includes('learning difficult')) ||
    (t.includes('upper secondary school') && t.includes('teacher') && t.includes('practices')) ||
    (t.includes('didactic') && t.includes('contract') && !t.includes('trends'))
  ) return 'B';

  // C: Affective, Motivational, Identity
  if (
    t.includes('affect') || t.includes('affective') ||
    (t.includes('attitude') && t.includes('math')) ||
    t.includes('belief') || t.includes('beliefs') ||
    (t.includes('interest') && (t.includes('math') || t.includes('development') || t.includes('important'))) ||
    t.includes('self-concept') || t.includes('selfconcept') ||
    (t.includes('crisis') && (t.includes('mathematical') || t.includes('stt'))) ||
    t.includes('identity') ||
    t.includes('motivation') || t.includes('motivational') ||
    t.includes('resilience') ||
    (t.includes('narrative') && t.includes('transition')) ||
    (t.includes('forged') && t.includes('failure')) ||
    (t.includes('messages') && t.includes('received')) ||
    (t.includes('task values') && t.includes('costs')) ||
    (t.includes('contradictions') && t.includes('within'))
  ) return 'C';

  // D: Institutional, Curricular, Pedagogical
  if (
    t.includes('bridging') || t.includes('bridge') ||
    (t.includes('support') && (t.includes('first year') || t.includes('measure'))) ||
    t.includes('adding structure') ||
    (t.includes('teacher') && t.includes('perspective')) ||
    (t.includes('comparison') && t.includes('teacher')) ||
    (t.includes('lecturers') && t.includes('views')) ||
    t.includes('making university mathematics') ||
    t.includes('secondary teacher preparation') ||
    t.includes('improving prospective teachers') ||
    t.includes('pedagogical') ||
    t.includes('holistic support') ||
    t.includes('mathematics education at tertiary') ||
    (t.includes('widening gap') && t.includes('swedish')) ||
    t.includes('mcmaster') ||
    t.includes('self-regulated learning')
  ) return 'D';

  // E: Dropout & Retention
  if (
    t.includes('dropout') || t.includes('drop out') || t.includes('drop-out') ||
    t.includes('attrition') || t.includes('retention') ||
    (t.includes('factors affecting success') && t.includes('higher education')) ||
    (t.includes('determinants') && t.includes('dropout')) ||
    (t.includes('factors influencing') && t.includes('dropout')) ||
    (t.includes('multicausal') && t.includes('dropout')) ||
    t.includes('university dropout') ||
    (t.includes('economics') && t.includes('dropout')) ||
    t.includes('stem attrition')
  ) return 'E';

  // F: International & Policy
  if (
    a.includes('oecd') || t.includes('oecd') ||
    t.includes('education at a glance') ||
    t.includes('how many students drop') ||
    (t.includes('higher education') && t.includes('taiwan') && !p.isChinese)
  ) return 'F';

  // G: Taiwan HE
  if (p.isChinese) return 'G';

  // H: Career Development
  if (t.includes('career') || t.includes('life-span') || t.includes('life span')) return 'H';

  // I: STT Empirical
  if (
    (t.includes('transition') && (t.includes('secondary') || t.includes('school') || t.includes('tertiary') || t.includes('university'))) ||
    t.includes('secondary-tertiary') || t.includes('secondarytertiary') ||
    (t.includes('first year') || t.includes('first-year')) ||
    t.includes('changing patterns')
  ) return 'I';

  // J: Reviews & Meta
  if (
    t.includes('review') || t.includes('systematic') || t.includes('literature') ||
    t.includes('bibliometric') || t.includes('survey')
  ) return 'J';

  return 'Z';
}

function assignTier(p, cat) {
  const t = p.titleLower;
  const a = (p.author || '').toLowerCase();

  // Tier 1
  if (
    (a.includes('tinto') && (p.year === 1973 || p.year === 1975)) ||
    (a.includes('guzm') && p.year === 1998 && t.includes('difficulties')) ||
    (a.includes('crawford') && p.year === 1994) ||
    (a.includes('gueudet') && p.year === 2008 && t.includes('investigating')) ||
    (a.includes('di martino') && p.year === 2018 && t.includes('crisis'))
  ) return 'Tier-1';

  if (cat === 'A') return 'Tier-2';
  if (cat === 'B' && !p.isChinese) return 'Tier-2';
  if (cat === 'C' && !p.isChinese) return 'Tier-2';
  if (cat === 'I' && !p.isChinese) return 'Tier-2';
  if (cat === 'D') return 'Tier-3';
  if (cat === 'E') return 'Tier-3';
  if (cat === 'J') return 'Tier-3';

  return 'Tier-4';
}

const catLabels = {
  'A': 'A. STT Theoretical Frameworks',
  'B': 'B. Cognitive & Mathematical Thinking',
  'C': 'C. Affective, Motivational, Identity',
  'D': 'D. Institutional & Pedagogical',
  'E': 'E. Dropout & Retention',
  'F': 'F. International & Policy',
  'G': 'G. Taiwan Higher Education',
  'H': 'H. Career Development',
  'I': 'I. STT Empirical Studies',
  'J': 'J. Reviews & Meta-studies',
  'Z': 'Z. Uncategorized',
};

papers.forEach(p => {
  const cat = classify(p);
  p.category = cat;
  p.tier = assignTier(p, cat);
});

const categories = {};
papers.forEach(p => {
  if (!categories[p.category]) categories[p.category] = [];
  categories[p.category].push(p);
});

// OUTPUT
console.log('='.repeat(100));
console.log(' 187 Papers: Thematic Classification & Tier Reassignment Report');
console.log('='.repeat(100));

console.log('\n## Theme Distribution\n');
Object.keys(categories).sort().forEach(cat => {
  console.log(`  ${catLabels[cat]}: ${categories[cat].length} papers`);
});

const tierCounts = {};
papers.forEach(p => { tierCounts[p.tier] = (tierCounts[p.tier] || 0) + 1; });

console.log('\n## Tier Distribution\n');
Object.entries(tierCounts).sort().forEach(([tier, count]) => {
  console.log(`  ${tier}: ${count} papers`);
});

console.log('\n\n' + '='.repeat(100));
console.log(' Full Classification (by Theme x Tier)');
console.log('='.repeat(100));

Object.keys(categories).sort().forEach(cat => {
  const items = categories[cat].sort((a, b) => a.year - b.year);
  console.log(`\n### ${catLabels[cat]} (${items.length})\n`);

  const tiers = {};
  items.forEach(p => {
    if (!tiers[p.tier]) tiers[p.tier] = [];
    tiers[p.tier].push(p);
  });

  ['Tier-1', 'Tier-2', 'Tier-3', 'Tier-4'].forEach(tier => {
    if (tiers[tier]) {
      console.log(`  [${tier}]`);
      tiers[tier].forEach(p => {
        const lang = p.isChinese ? 'TW' : 'EN';
        console.log(`    ${lang} [${p.year}] ${p.author.substring(0, 25).padEnd(25)} | ${p.title.substring(0, 60)}`);
      });
    }
  });
});
