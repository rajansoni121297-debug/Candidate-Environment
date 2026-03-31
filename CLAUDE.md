# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React + TypeScript assessment portal (CPE/tax exam simulator) built with Vite. Originally generated via Google AI Studio. The app walks candidates through a multi-section test: MCQ → SIM (task-based simulations) → Subjective → Video Interview, with proctoring verification, timer, and post-assessment feedback.

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Production build via Vite
- `npm run lint` — Type-check only (`tsc --noEmit`); no ESLint configured
- `npm run preview` — Preview production build

## Architecture

**Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS (via CDN in index.html), Motion (Framer Motion), Lucide React icons.

**Path alias:** `@/*` maps to the project root (configured in both tsconfig.json and vite.config.ts).

**Entry point:** `index.html` → `index.tsx` → `App.tsx`. All state lives in `App.tsx` — there is no state management library; everything is useState/useMemo in the root component, passed down as props.

**Assessment flow** is controlled by two key state variables in App.tsx:
- `flowStep: FlowStep` — controls which screen is shown: `LANDING` → `PROCTORING` → `ASSESSMENT` → `RESULTS`
- `currentSection: AssessmentSection` — which test section is active: `MCQ` → `SIM` → `SUBJECTIVE` → `VIDEO`

Sections are completed sequentially. After submitting one section, the flow returns to LANDING for the next section.

**Types** are centralized in `types.ts` (MCQQuestion, SIMQuestion, SIMTask, SubjectiveQuestion, etc.).

**Components** (all in `components/`):
- `LandingScreen` — instructions and section overview before each section
- `ProctoringVerification` — camera/identity check before first section
- `AssessmentView` — renders MCQ and Subjective questions with navigation sidebar
- `SimulationEnvironment` — renders SIM task-based questions (spreadsheets, tables)
- `QuestionNavigation` — top navigation bar for SIM section
- `Calculator`, `Spreadsheet` — floating tool windows available during assessment
- `SubmitConfirmationModal` — warns about skipped/flagged questions before submission
- `FeedbackStepper` — post-assessment feedback flow
- `ResultsView` — final results display

**Environment:** `GEMINI_API_KEY` is loaded from `.env.local` and exposed as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` via Vite's define config.

## Key Patterns

- No test framework is configured. There are no unit or integration tests.
- Tailwind is loaded via CDN (`<script src="https://cdn.tailwindcss.com">`), not as a PostCSS plugin — no `tailwind.config.js` exists.
- Question data (MCQ, SIM, Subjective) is hardcoded in `App.tsx` via `useMemo`, not fetched from an API.
- Answer state is split per section type (mcqAnswers/mcqFlags/mcqSkipped, simAnswers/simFlags/simSkipped, etc.) with parallel structures.
