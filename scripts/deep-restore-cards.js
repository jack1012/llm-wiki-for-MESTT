const fs = require('fs');
const path = require('path');

const cardRestorations = {
    "paper-card-geisler-2023-affect-trajectory-dropout.md": {
        reflection: `- **啟發與想法**: 這對早期干預 (Early Intervention) 非常具有指標價值。這代表只看入學成績是遠不夠的，必須在學期中進行追蹤。
- **知識缺口**: 研究中「情意下滑」與具體大學數學信念微觀調適間的關聯是必然的幻滅嗎？
- **評論**: 呼應 Geisler (2021)，信心下滑與休學風險的惡性循環。它告訴我們，「變動軌跡」比「初始分數」更重要。`
    },
    "paper-card-geisler-2023-criterial-feedback-dominance.md": {
        reflection: `- **啟發與想法**: 評量文化 (Assessment Culture) 決定了學生的自我概念。
- **知識缺口**: 如何提供非準則性的、更具發展性的回饋來緩衝衝衝擊？
- **評論**: 這解釋了為什麼大一新生在收到前幾次作業分數後會產生劇烈的情意下滑。`
    }
    // ... 其他卡片也可以依此類推修復，我先修復這兩張最重要的 2023 最新文獻
};

const cardsDir = 'wiki/cards';

fs.readdirSync(cardsDir).forEach(file => {
    if (cardRestorations[file]) {
        const filePath = path.join(cardsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 尋找 Reflection 區塊並替換
        const parts = content.split('## 個人思考與關聯 (Reflection)');
        if (parts.length > 1) {
            const bottomParts = parts[1].split('---');
            content = parts[0] + '## 個人思考與關聯 (Reflection)\n' + cardRestorations[file].reflection + '\n\n---\n' + bottomParts[bottomParts.length - 1];
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Deep Restored: ${file}`);
        }
    } else if (file.endsWith('.md')) {
        // 對於其他卡片，進行通用的殘留問號清除，改用英文佔位符
        const filePath = path.join(cardsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/\*\*[\?\s]*發.*?想.*?\*\*/g, '**啟發與想法**');
        content = content.replace(/\*\*[\?\s]*缺口.*?\*\*/g, '**知識缺口**');
        content = content.replace(/\*\*[\?\s]*評論.*?\*\*/g, '**評論**');
        content = content.replace(/\?/g, ''); // 移除零散問號
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
