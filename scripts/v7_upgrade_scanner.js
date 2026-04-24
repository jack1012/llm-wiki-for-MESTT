const fs = require('fs');
const path = require('path');

const SOURCES_DIR = 'wiki/sources';
const TRACKER_FILE = 'scratch/v7_upgrade_tracker.json';

function scanForUpgrade() {
    const files = fs.readdirSync(SOURCES_DIR).filter(f => f.endsWith('.md'));
    let tracker = [];

    files.forEach(file => {
        const content = fs.readFileSync(path.join(SOURCES_DIR, file), 'utf8');
        const isV7 = content.includes('V7_Atomic') || content.includes('Career Development Analysis');
        
        tracker.push({
            filename: file,
            status: isV7 ? 'COMPLETED' : 'PENDING',
            last_checked: new Date().toISOString()
        });
    });

    fs.writeFileSync(TRACKER_FILE, JSON.stringify(tracker, null, 2));
    const pending = tracker.filter(t => t.status === 'PENDING').length;
    console.log(`📊 Scan Complete:`);
    console.log(`- Total Files: ${tracker.length}`);
    console.log(`- V7 Completed: ${tracker.length - pending}`);
    console.log(`- V7 Pending: ${pending}`);
}

scanForUpgrade();
