#!/usr/bin/env node
/**
 * One-shot: generate 10 tailored CV PDFs for YC apply batch (2026-05-13).
 * Reads output/001-anthropic-fullstack.html as base, swaps the Professional
 * Summary block per company, writes a tailored HTML + PDF to ~/Downloads/{slug}/.
 */
import { readFile, writeFile, mkdir } from 'fs/promises';
import { execSync } from 'child_process';
import { homedir } from 'os';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const BASE_HTML = await readFile(resolve(ROOT, 'output/001-anthropic-fullstack.html'), 'utf8');

const SUMMARY_OPEN = '<div class="summary-text">';
const SUMMARY_CLOSE = '</div>\n  </div>';

const jobs = [
  {
    slug: 'gogograndparent',
    summary: `Backend engineer with 8+ years building production Node.js + TypeScript systems. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> and scaled it to 100K+ users solo -- architecting the full Node.js backend, MongoDB schema, WebSocket layer, and Stripe-based monetization. Strong owner mindset: comfortable across feature delivery, code review, production debugging, and architecture. Used to async cross-timezone client work and 4+ hour US daily overlap from IST. Seeks a remote backend role at a profitable, mission-driven company shipping real product to real users.`
  },
  {
    slug: 'aurelian',
    summary: `Senior product engineer with 8+ years shipping full-stack AI products end-to-end. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> and grew it to 100K+ users as the sole engineer -- defined the roadmap, did the customer research, built the React + Next.js + Node.js platform, and shipped the OpenAI + Claude integrations. Comfortable owning product outcomes without pre-written specs and shipping features that touch real users. Excited by mission-driven AI applied to high-stakes domains like 911 dispatch where reliability and empathy matter as much as the model.`
  },
  {
    slug: 'campfire',
    summary: `Full-stack engineer with 8+ years shipping production NextJS/React/TypeScript and Python-friendly Node.js backends. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> solo and grew it to 100K+ paying-capable users -- owning the React + Next.js + Tailwind frontend, Node.js APIs, MongoDB schema, and Stripe integration for free-trial-to-paid conversion. Self-driven, comfortable leading projects in lean, fast-moving teams. Drawn to Campfire because modern accounting plus AI workflows is exactly the kind of mission-critical SaaS where product engineering compounds.`
  },
  {
    slug: 'vooma',
    summary: `Full-stack engineer with 8+ years shipping production Node.js + TypeScript + Python systems and deep hands-on AI integration. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> solo (100K+ users) -- architected the full stack on Next.js + Node.js + MongoDB, built RAG pipelines, integrated OpenAI and Claude, and wired up Stripe for monetization. Comfortable wearing many hats in early-stage environments and translating customer needs directly into shippable AI features. Drawn to Vooma because applying agents to logistics is one of the highest-leverage AI surface areas right now.`
  },
  {
    slug: 'weekend',
    summary: `Senior software engineer with 8+ years shipping production TypeScript and React at scale. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> and scaled it to 100K+ users solo -- built the React/Next.js frontend, optimized LCP and CLS for mobile Core Web Vitals, and shipped real-time collaboration over WebSockets. Comfortable across the full product lifecycle from architecture to CI/CD to multi-device QA. Excited by Weekend because voice-controlled AI gaming on TV is a hard, fun consumer surface that rewards real-time engineering.`
  },
  {
    slug: 'runway',
    summary: `Full-stack engineer with 8+ years shipping production TypeScript across web and AI products. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> solo (100K+ users) -- owning Next.js + Node.js + MongoDB, OpenAI/Claude integrations, payments, and growth. Strong async, remote-first operator with a track record of delivering across timezones for US and EU clients. Excited by Runway because mobile release infrastructure is exactly the kind of unglamorous lever that lets every product team ship faster.`
  },
  {
    slug: 'coverage-cat',
    summary: `Growth-minded full-stack engineer who built and grew <a href="https://pdfgpt.io">PdfGPT.io</a> from zero to 100K+ users solo. Comfortable across the entire growth surface: React/Next.js frontend, Node.js backend, Stripe trial-to-paid funnels, SEO, organic acquisition, and conversion optimization (LCP/CLS). Available for contract work, remote, with full ownership of growth experiments and engineering execution. Drawn to Coverage Cat because price transparency and risk optimization in insurance is exactly the kind of product where a single growth engineer can move a real needle.`
  },
  {
    slug: 'raven',
    summary: `Backend engineer based in Ahmedabad with 8+ years shipping production systems and deep AI integration experience. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> solo and grew it to 100K+ users -- built the Node.js + MongoDB backend, document ingestion + semantic chunking pipelines, vector retrieval (LlamaIndex), and OpenAI/Claude integrations. Comfortable extracting structured data from messy documents and building AI agents on top. Open to relocating to Bengaluru and excited about Raven because AI for industrial operations is a real, high-stakes problem where domain depth compounds.`
  },
  {
    slug: 'peakflo',
    summary: `Backend engineer with 8+ years shipping production systems and 2+ years building AI agents in production. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> solo (100K+ users) -- built the Node.js backend, MongoDB schema, semantic retrieval pipelines, and OpenAI/Claude integrations including LLM-driven diagnostics. Comfortable using Claude Code and Cursor as everyday tools, debugging production payment and data issues, and turning recurring incidents into automated workflows. Open to relocating to Bangkok and excited about Peakflo because agentic back-office automation is exactly where SaaS becomes infrastructure.`
  },
  {
    slug: 'poly',
    summary: `AI product engineer with 8+ years shipping production software and 2+ years building real AI products. Founded <a href="https://pdfgpt.io">PdfGPT.io</a> solo and scaled it to 100K+ users -- designed semantic chunking, vector retrieval, and multimodal document Q&A with image extraction. Comfortable with agentic workflows, prompt design, function calling, and shipping LLM-backed features to real users. Drawn to Poly because multimodal personal cloud storage is one of the most exciting AI surfaces -- and joining a founding team to expand from 3 to ~8 is exactly the stage I do my best work.`
  },
];

const baseDownloads = resolve(homedir(), 'Downloads');

for (const job of jobs) {
  const outDir = resolve(baseDownloads, job.slug);
  await mkdir(outDir, { recursive: true });

  const start = BASE_HTML.indexOf(SUMMARY_OPEN);
  const after = BASE_HTML.indexOf('</div>', start);
  const close = BASE_HTML.indexOf('</div>', after + 6);
  // Replace the inner content of summary-text div
  const innerStart = start + SUMMARY_OPEN.length;
  const innerEnd = after;
  const tailored = BASE_HTML.slice(0, innerStart) + '\n      ' + job.summary + '\n    ' + BASE_HTML.slice(innerEnd);

  const htmlPath = resolve(ROOT, `output/yc-${job.slug}.html`);
  const pdfPath = resolve(outDir, 'mihir_kanzariya.pdf');
  await writeFile(htmlPath, tailored, 'utf8');

  console.log(`[${job.slug}] HTML: ${htmlPath}`);
  console.log(`[${job.slug}] PDF:  ${pdfPath}`);
  execSync(`node "${resolve(ROOT, 'generate-pdf.mjs')}" "${htmlPath}" "${pdfPath}" --format=letter`, { stdio: 'inherit' });
}

console.log('\nAll 10 PDFs generated.');
