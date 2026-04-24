#!/usr/bin/env node

/**
 * LLM-Wiki Ingest Orchestrator V7 (Hardened & Optimized)
 * -----------------------------------------------
 * Purpose: Automatically process academic papers with context injection.
 *          Strictly enforces card/concept creation, PDF archiving,
 *          and deduplication/merging of existing summaries.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- Configuration ---
const CONFIG = {
    BASE_RAW_DIR: path.join(__dirname, '..', 'raw'),
    ARCHIVE_DIR: path.join(__dirname, '..', 'raw', '09-archive'),
    WIKI_DIR: path.join(__dirname, '..', 'wiki'),
    SOURCES_DIR: path.join(__dirname, '..', 'wiki', 'sources'),
    CONCEPTS_DIR: path.join(__dirname, '..', 'wiki', 'concepts'),
    ENTITIES_DIR: path.join(__dirname, '..', 'wiki', 'entities'),
    PROMPT_FILE: path.join(__dirname, '..', 'templets', 'Prompt_Paper_Analysis_V7.md'),
    TEMP_DIR: path.join(__dirname, '..', 'scratch', 'v7_temp')
};

// --- Helper Functions ---

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * Recursively find all PDF files in a directory, excluding archive.
 */
function findPdfs(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        if (filePath === CONFIG.ARCHIVE_DIR) return; // Skip archive
        
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findPdfs(filePath));
        } else if (file.toLowerCase().endsWith('.pdf')) {
            results.push(filePath);
        }
    });
    return results;
}

function getExistingNodes() {
    const concepts = fs.existsSync(CONFIG.CONCEPTS_DIR) ? fs.readdirSync(CONFIG.CONCEPTS_DIR).map(f => f.replace('.md', '')) : [];
    const entities = fs.existsSync(CONFIG.ENTITIES_DIR) ? fs.readdirSync(CONFIG.ENTITIES_DIR).map(f => f.replace('.md', '')) : [];
    return { concepts, entities };
}

/**
 * Try to find an existing summary for a given PDF filename pattern.
 */
function findExistingSummary(pdfFilename) {
    // pdfFilename usually YYYY_Author_Title.pdf
    const parts = pdfFilename.split('_');
    if (parts.length < 2) return null;
    
    const year = parts[0];
    const author = parts[1].toLowerCase();
    
    const summaries = fs.readdirSync(CONFIG.SOURCES_DIR);
    const match = summaries.find(s => {
        const lower = s.toLowerCase();
        return lower.includes(year) && lower.includes(author);
    });
    
    if (match) {
        return {
            filename: match,
            content: fs.readFileSync(path.join(CONFIG.SOURCES_DIR, match), 'utf8')
        };
    }
    return null;
}

function extractText(pdfPath) {
    console.log(`🔍 Extracting text from: ${path.basename(pdfPath)}`);
    try {
        // Since pdftotext might not be available, we recommend using 'view_file' in the instruction
        // But for automation, we try exec. If fails, we provide a placeholder.
        const text = execSync(`pdftotext -l 15 "${pdfPath}" -`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
        return text; 
    } catch (err) {
        console.warn(`⚠️ External pdftotext failed. AI will need to read PDF manually.`);
        return "READ_PDF_MANUALLY";
    }
}

function prepareAIPrompt(text, pdfPath, context, existingSummary) {
    const promptTemplate = fs.readFileSync(CONFIG.PROMPT_FILE, 'utf8');
    const filename = path.basename(pdfPath);
    
    let mergeInstructions = "";
    if (existingSummary) {
        mergeInstructions = `
⚠️ ALERT: AN EXISTING SUMMARY WAS FOUND: [[${existingSummary.filename}]]
Your task is to MERGE the new information from the PDF into the existing summary. 
DO NOT create a duplicate file. If there are multiple summaries for the same paper, CONSOLIDATE them into one.
Existing Summary Content:
---
${existingSummary.content}
---
`;
    }

    return `
${promptTemplate}

${mergeInstructions}

---
KNOWLEDGE CONTEXT (EXISTING NODES):
Existing Concepts: ${context.concepts.slice(0, 300).join(', ')} ...
Existing Entities: ${context.entities.slice(0, 300).join(', ')} ...

---
INPUT DATA:
Filename: ${filename}
Extracted Content (First 15,000 chars):
${text === "READ_PDF_MANUALLY" ? "Please use 'view_file' on the provided PDF path to read the content." : text.substring(0, 15000)}

---
HARDENED EXECUTION INSTRUCTIONS:
1.  **SINGLE SUMMARY DUTY**: Ensure there is exactly one summary in wiki/sources/. If you update an existing one, use 'replace_file_content'.
2.  **EVIDENCE-BASED CARDS**: Generate or update cards in wiki/cards/. If a card for this topic already exists, APPEND to it and explain the relationship between the new evidence and old evidence.
3.  **MATERIALIZE SIDE-EFFECTS**: You MUST create all linked cards, concepts, and entities. NO RED LINKS.
4.  **ARCHIVE DUTY**: Move the source PDF to raw/09-archive/ after completion.
5.  **INDEX SYNC**: Update wiki/index.md and wiki/log.md.

MANDATORY naming: 
- 英文文獻卡片: [card-YYYY-Author-ShortTitle]
- 中文文獻卡片: [card-YYYY-中文作者-中文標題] (例如: card-2023-吳明錡-大一意義感真空)
- **SIMPLE LINKS**: Internal links MUST NOT include path prefixes. Use `[[ConceptName]]` instead of `[[wiki/concepts/ConceptName]]`.

PDF PATH FOR VIEWING: ${pdfPath}
`;
}

// --- Main Execution Flow ---

async function runV7Ingest() {
    ensureDir(CONFIG.TEMP_DIR);
    ensureDir(CONFIG.ARCHIVE_DIR);
    
    const nodes = getExistingNodes();
    const pdfs = findPdfs(CONFIG.BASE_RAW_DIR);
    
    console.log(`🚀 Found ${pdfs.length} articles to process (recursively).`);
    
    if (pdfs.length === 0) {
        console.log("✅ No pending articles in raw/ folders.");
        return;
    }

    for (const pdfPath of pdfs) {
        const filename = path.basename(pdfPath);
        const existingSummary = findExistingSummary(filename);
        const text = extractText(pdfPath);

        const aiPrompt = prepareAIPrompt(text, pdfPath, nodes, existingSummary);
        const tempPromptPath = path.join(CONFIG.TEMP_DIR, `${filename}.v7_hardened_prompt.txt`);
        fs.writeFileSync(tempPromptPath, aiPrompt);

        console.log(`✅ [HARDENED] Prompt prepared for: ${filename}`);
        if (existingSummary) console.log(`🔄 Existing summary found: ${existingSummary.filename} (MERGE MODE)`);
        console.log(`📄 Instructions saved to: ${tempPromptPath}`);
        console.log(`⚠️  REMINDER: After finishing, move file to archive:`);
        console.log(`   mv "${pdfPath.replace(/\\/g, '/')}" "raw/09-archive/"`);
        console.log(`--------------------------------------------------------------------------------\n`);
    }
}

runV7Ingest().catch(console.error);
