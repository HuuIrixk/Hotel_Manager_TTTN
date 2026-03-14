// ai/src/rag/ingest-hotel-knowledge.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { embedText } from './embedder.js';
import { query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knowledgeDir = path.join(__dirname, '../../knowledge');
const knowledgeFile = path.join(knowledgeDir, 'hotel_knowledge.txt');

// Cắt text thành các chunk ~maxLen ký tự, ưu tiên cắt theo đoạn
function splitIntoChunks(text, maxLen = 800) {
  if (!text) return [];

  const paragraphs = text.split(/\n\s*\n/g);
  const chunks = [];
  let current = '';

  for (const pRaw of paragraphs) {
    const p = pRaw.trim();
    if (!p) continue;

    // nếu thêm đoạn này vào mà vượt maxLen thì push chunk cũ
    if ((current + '\n\n' + p).length > maxLen && current) {
      chunks.push(current);
      current = p;
    } else {
      current = current ? current + '\n\n' + p : p;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

async function main() {
  if (!fs.existsSync(knowledgeFile)) {
    console.error('[ingest] Không tìm thấy file:', knowledgeFile);
    process.exit(1);
  }

  const raw = fs.readFileSync(knowledgeFile, 'utf8');
  const trimmed = raw.trim();
  if (!trimmed) {
    console.error('[ingest] File hotel_knowledge.txt rỗng');
    process.exit(1);
  }

  console.log('[ingest] Đang ingest từ:', knowledgeFile);

  // Lấy dòng tiêu đề đầu tiên nếu có
  const firstLine = trimmed.split('\n').find((l) => l.trim());
  let title =
    firstLine?.replace(/^Tên hệ thống:\s*/i, '').trim() ||
    'Hotel Manager – VAA Hotel';

  const source = 'seed';

  const chunks = splitIntoChunks(trimmed, 800);
  console.log(`[ingest] Tổng số chunk: ${chunks.length}`);

  const insertSql = `
    INSERT INTO knowledge_chunks (
      id,
      title,
      source,
      chunk_index,
      content,
      embedding,
      created_at
    )
    VALUES (
      gen_random_uuid(),
      $1,
      $2,
      $3,
      $4,
      $5::vector,
      NOW()
    );
  `;

  for (let i = 0; i < chunks.length; i++) {
    const content = chunks[i].trim();
    if (!content) continue;

    try {
      console.log(`[ingest] Chunk ${i + 1}/${chunks.length}...`);
      const emb = await embedText(content);
      const embLiteral = '[' + emb.join(',') + ']';

      await query(insertSql, [title, source, i, content, embLiteral]);
    } catch (err) {
      console.error(`[ingest] Lỗi chunk ${i}:`, err);
    }
  }

  console.log('[ingest] Hoàn thành ingest hotel_knowledge.txt.');
  process.exit(0);
}

main().catch((err) => {
  console.error('[ingest] Fatal error:', err);
  process.exit(1);
});
