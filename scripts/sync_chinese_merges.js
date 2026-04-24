const fs = require('fs');
const path = require('path');

const WIKI_DIR = 'd:/llm-wiki-en/wiki';

const mapping = {
    'summary-2022-何文略-從Tinto輟學歷程模式淺談學業成績以外的輟學因素': 'summary-2022-何文略-輟學與社會自殺',
    'summary-2022-何溫略-從 Tinto 輟學歷程模型淺析學業成就以外之退學因素': 'summary-2022-何文略-輟學與社會自殺',
    'summary-2022-洪如玉-生涯諮商典範轉移': 'summary-2022-洪瑞謙-生涯諮商典範轉移',
    'summary-2022-洪瑞謙-生涯諮商典範轉移新趨勢對生涯轉換的啟發': 'summary-2022-洪瑞謙-生涯諮商典範轉移',
    'summary-2022-郭忠潔-原住民族大專學生退學現況以大數據分析之必要性': 'summary-2022-郭李宗文-原民大專生大數據',
    'summary-2022-郭李宗文-原住民大專學生休退學現況以大數據分析之必要性': 'summary-2022-郭李宗文-原民大專生大數據',
    'summary-2022-李世勇-高等教育大專學生供給因素對於學校退學資源投入之影響': 'summary-2022-李文基-高教退學供給面分析',
    'summary-2022-李文基-高等教育退學之供給面因素分析-學校教學資源和入學管道招生名額配置對大學退學人數的': 'summary-2022-李文基-高教退學供給面分析'
};

function walkDir(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.md')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let changed = false;
            
            for (const [oldName, newName] of Object.entries(mapping)) {
                if (content.includes(`[[${oldName}]]`)) {
                    content = content.split(`[[${oldName}]]`).join(`[[${newName}]]`);
                    changed = true;
                }
                if (content.includes(`[[${oldName}|`)) {
                    content = content.split(`[[${oldName}|`).join(`[[${newName}|`);
                    changed = true;
                }
            }
            
            if (changed) {
                console.log(`✅ Synced: ${filePath}`);
                fs.writeFileSync(filePath, content);
            }
        }
    });
}

walkDir(WIKI_DIR);
console.log('--- CHINESE MERGE SYNC COMPLETE ---');
