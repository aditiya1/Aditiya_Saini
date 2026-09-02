# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary visitor: a full-stack / software-engineering recruiter or hiring manager scanning on a laptop to decide whether Aditiya (Adi) Saini is a credible mid-level SWE. AI engineering interest is real but secondary — it is the differentiator, not the headline.

Secondary visitor: a technical hiring manager who will go past the scan and judge how Adi thinks — architecture, stack choices, RAG and system design — not just titles and dates.

Situation: 60–90 seconds to form a first yes/no, then optional deeper reading or a conversation with the on-site assistant.

## Product Purpose

This is Adi’s public portfolio. It exists to convert that visitor into an interview by showing how he builds, not by restating his résumé.

Success: a technical reader leaves knowing who Adi is, what he has actually shipped, how he reasons about systems, and how to contact him.

## Positioning

A working full-stack engineer’s site whose AI work can be inspected in the product itself (live RAG assistant, system visualization, project write-ups). The lead story is SWE credibility. AI is proof of range, not a rebrand as an ML researcher.

A PDF résumé cannot demonstrate that. Neighboring portfolios that only list “OpenAI” as a skill cannot copy a working pipeline on the same page as the career history.

## Operating Context

Single-page React site (HashRouter) deployed to GitHub Pages, with a FastAPI RAG backend for the chatbot. Visitors arrive from LinkedIn, GitHub, or a job application. They scroll: hero → about → Building with AI → experience → education → skills → projects → recommendations → contact. A floating chatbot can interrupt the scan. Project detail is a secondary route.

Recruiters evaluate under time pressure, often with motion reduced or on mid-size laptops. The site must remain usable if WebGL or the chat API is unavailable.

## Capabilities and Constraints

Shipped today:

- Hero, about, Building with AI (Three.js workspace), experience timeline, education, skills, projects, recommendations, contact (mailto form)
- Live RAG chatbot over portfolio knowledge (FastAPI, embeddings, Chroma)
- Project detail pages; live and GitHub links for shipped work
- Profile photo, AS wordmark, GitHub / LinkedIn / email / phone

Must preserve: all factual copy — legal name Aditiya Saini, public name Adi, employers, titles, dates, education, recommendation quotes, contact details, project facts. Do not invent customers, metrics, awards, or capabilities.

Not locked as brand commitments: current visual look, slime background, glass cards, typefaces, and the present 3D scene. Building with AI may be redesigned; it is a product section, not a frozen asset. Chatbot and projects remain working product unless a later brief removes them.

Undecided: whether the chatbot or the 3D workspace is a required first-viewport proof versus a later demonstration.

## Brand Commitments

Name: Aditiya Saini; short form Adi. Wordmark: AS. Profile photograph is a required identity anchor.

Voice: direct, technical, first person. No hype adjectives that the work does not earn.

Visual standing preference (user-pinned, Aug 2026): stay on the incumbent dark portfolio — do not costume it. Keep the UI simple so the photo, facts, pipeline, projects, and contact stay the focus. Raise craft by distilling glass, gradient type, and identical cards, not by inventing a new metaphor.

Not locked: slime intensity, purple-pink gradients, spinning avatar ring, “coming soon” project tiles.

## Evidence on Hand

- Real employment: Global Travel Xperts, AK Smart Solution, Early Build internship
- Real education: Electronics Engineering bachelor’s; Master’s in IT, RMIT
- Real projects: AI chatbot with RAG pipeline; ASP.NET + Blazor task manager (live demo)
- Real recommendation quotes already on the site
- Assets: `src/assets/profile.png`, chatbot logo, GitHub `Adi1-git`, LinkedIn, email `aditiyasaini15@gmail.com`, phone `0433924783`
- Do not fabricate testimonials, logos of employers as endorsements, user counts, or performance claims not already in copy

## Product Principles

1. SWE first, AI as range — the site must still hire Adi if the visitor never opens the chatbot.
2. Show thinking, not slogans — architecture, stack, and tradeoffs belong on the page.
3. Facts are load-bearing — copy, dates, quotes, and links stay true; visuals may change.
4. Proof should be usable — demos degrade honestly when APIs or WebGL fail.
5. Fast scan, then depth — a hiring manager can leave after one viewport or keep reading.

## Accessibility & Inclusion

No product-specific standard was set. The site must remain operable with reduced motion, keyboard, and without WebGL. Do not rely on color alone for meaning.
