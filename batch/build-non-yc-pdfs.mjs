#!/usr/bin/env node
/**
 * Tailored CV PDFs for the non-YC apply batch (2026-05-13, second wave).
 */
import { readFile, writeFile, mkdir } from 'fs/promises';
import { execSync } from 'child_process';
import { homedir } from 'os';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const BASE_HTML = await readFile(resolve(ROOT, 'output/001-anthropic-fullstack.html'), 'utf8');
const SUMMARY_OPEN = '<div class="summary-text">';

const jobs = [
  {
    slug: 'sierra',
    summary: `AI product engineer with 8+ years shipping production software and 2+ years specifically building AI agents in production. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> solo and scaled it to 100K+ users — designed semantic retrieval pipelines, built multi-step agent workflows with OpenAI and Claude function-calling, and shipped real conversational UX over PDFs at scale. Sierra's bet on conversational AI agents for the enterprise is exactly the surface I want to be building on next, and the IC/Agent track is the most interesting engineering work in the field today. Open to relocating to Toronto and would need visa sponsorship from India.`
  },
  {
    slug: 'spotify',
    summary: `Full-stack engineer with 8+ years shipping production TypeScript across consumer products. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> solo and grew it to 100K+ users — built the Next.js + Node.js + MongoDB stack, optimized Core Web Vitals for mobile, and shipped real-time collaboration features over WebSockets. Spotify Audiobooks is a consumer product category where small full-stack engineering wins translate directly into listener engagement, and the discipline of shipping in a large org while keeping a product mindset is exactly the kind of role I'm looking for next. Open to relocating to London on a UK Skilled Worker visa.`
  },
  {
    slug: 'gitlab',
    summary: `Forward-deployed engineer profile with 8+ years shipping production full-stack systems and 2+ years building LLM/AI features in production. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> solo to 100K+ users — owned the entire customer surface from inbound to onboarding to feature shipping, integrated OpenAI/Claude into core workflows, and supported real users debugging real problems daily. The FDE role's mix of "deep technical work" + "talk to customers" + "make AI actually useful in regulated enterprise environments" maps cleanly onto what I do best. Remote-first by default; based in IST with strong async track record across US/EU clients.`
  },
  {
    slug: 'pigment',
    summary: `Senior AI/GenAI engineer with 8+ years on production full-stack systems and 2+ years shipping LLM-backed products to real users. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> solo to 100K+ users — designed semantic chunking, vector retrieval, prompt orchestration over OpenAI and Claude, and shipped agentic features (follow-ups, multi-step Q&A, image extraction) end-to-end. Bringing GenAI into a business-planning platform like Pigment is exactly the kind of high-leverage work where AI moves from demo to daily-use. Open to relocating; based in IST with strong async EU/US overlap.`
  },
  {
    slug: 'replit',
    summary: `Product-minded engineer with 8+ years shipping production full-stack software and 2+ years building AI products. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> solo to 100K+ users — entire developer-facing surface (auth, onboarding, in-product help, error surfacing) was mine to design and ship across Next.js + Node.js + MongoDB. Replit's bet on AI-native developer experience is the most exciting thing happening in the IDE category right now, and shipping for developers is the most rewarding feedback loop in software. Fully remote-first; IST timezone with proven async track record.`
  },
];

const baseDownloads = resolve(homedir(), 'Downloads');

for (const job of jobs) {
  const outDir = resolve(baseDownloads, job.slug);
  await mkdir(outDir, { recursive: true });

  const start = BASE_HTML.indexOf(SUMMARY_OPEN);
  const after = BASE_HTML.indexOf('</div>', start);
  const innerStart = start + SUMMARY_OPEN.length;
  const innerEnd = after;
  const tailored = BASE_HTML.slice(0, innerStart) + '\n      ' + job.summary + '\n    ' + BASE_HTML.slice(innerEnd);

  const htmlPath = resolve(ROOT, `output/non-yc-${job.slug}.html`);
  const pdfPath = resolve(outDir, 'mihir_kanzariya.pdf');
  await writeFile(htmlPath, tailored, 'utf8');

  console.log(`[${job.slug}] PDF: ${pdfPath}`);
  execSync(`node "${resolve(ROOT, 'generate-pdf.mjs')}" "${htmlPath}" "${pdfPath}" --format=letter`, { stdio: 'inherit' });
}

console.log('\nAll 5 PDFs generated.');
