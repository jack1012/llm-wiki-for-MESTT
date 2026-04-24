#!/usr/bin/env node

/**
 * LLM-Wiki Ingest Orchestrator V7 (Knowledge-Aware)
 * -----------------------------------------------
 * Purpose: Automatically process academic papers with context injection.
 *          Prevents duplicate concepts and red-links by informing AI of existing nodes.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- Configuration ---
const CONFIG = {
    RAW_DIR: path.join(__dirname, 'raw', '01-articles'),
    WIKI_DIR: path.join(__dirname, 'wiki'),
    CONCEPTS_DIR: path.join(__dirname, 'wiki', 'concepts'),
    ENTITIES_DIR: path.join(__dirname, 'wiki', 'entities'),
    PROMPT_FILE: path.join(__dirname, 'templets', 'Prompt_Paper_Analysis_V7.md'),
    TEMP_DIR: path.join(__dirname, 'scratch', 'v7_temp')
};

// --- Helper Functions ---

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getExistingNodes() {
    const concepts = fs.existsSync(CONFIG.CONCEPTS_DIR) ? fs.readdirSync(CONFIG.CONCEPTS_DIR).map(f => f.replace('.md', '')) : [];
    const entities = fs.existsSync(CONFIG.ENTITIES_DIR) ? fs.readdirSync(CONFIG.ENTITIES_DIR).map(f => f.replace('.md', '')) : [];
    return { concepts, entities };
}

function extractText(pdfPath) {
    console.log(`🔍 Extracting text from: ${path.basename(pdfPath)}`);
    try {
        // Extracting more text and focusing on front matter + references
        const text = execSync(`pdftotext -l 10 "${pdfPath}" -`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
        return text; 
    } catch (err) {
        console.error(`❌ PDF extraction failed for ${pdfPath}.`);
        return null;
    }
}

function prepareAIPrompt(text, filename, context) {
    const promptTemplate = fs.readFileSync(CONFIG.PROMPT_FILE, 'utf8');
    return `
${promptTemplate}

---
KNOWLEDGE CONTEXT (EXISTING NODES):
Existing Concepts: ${context.concepts.join(', ')}
Existing Entities: ${context.entities.join(', ')}

---
INPUT DATA:
Filename: ${filename}
Extracted Content (First 12,000 chars):
${text.substring(0, 12000)}
---
OUTPUT INSTRUCTIONS:
Please provide the full V7_Atomic analysis. 
MANDATORY: 
1. Use the [card-YYYY-Author-Title] naming convention.
2. Link to EXISTING concepts/entities listed above whenever possible. 
3. Add "Career Development Analysis" based on your synthesis.
`;
}

// --- Main Execution Flow ---

async function runV7Ingest() {
    ensureDir(CONFIG.TEMP_DIR);
    const nodes = getExistingNodes();
    const pdfs = fs.readdirSync(CONFIG.RAW_DIR).filter(f => f.endsWith('.pdf'));
    
    console.log(`🚀 Found ${pdfs.length} articles. Knowledge Context: ${nodes.concepts.length} concepts, ${nodes.entities.length} entities.\n`);

    for (const pdf of pdfs) {
        const fullPath = path.join(CONFIG.RAW_DIR, pdf);
        const text = extractText(fullPath);
        if (!text) continue;

        const aiPrompt = prepareAIPrompt(text, pdf, nodes);
        const tempPromptPath = path.join(CONFIG.TEMP_DIR, `${pdf}.v7_prompt.txt`);
        fs.writeFileSync(tempPromptPath, aiPrompt);

        console.log(`✅ [V7_Atomic] Prepared Prompt for ${pdf}.`);
        console.log(`Location: ${tempPromptPath}`);
        console.log(`--------------------------------------------------------------------------------\n`);
        
        break; // Batch control
    }
}

runV7Ingest().catch(console.error);
