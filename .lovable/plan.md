## Goal

Take the uploaded `Kimi_Agent_✅Web Linux (1).zip` (a Vite + React "UbuntuOS" desktop simulator), rebrand it to **jcimlasOS**, remove all Kimi references, deliver the rebranded source as a downloadable zip artifact, and make it run inside the current Lovable preview.

## Scope of rebrand

Across the extracted project (~30 files contain `Ubuntu` and/or `Kimi`):

1. **Ubuntu → jcimlas** (case-preserving)
   - `UbuntuOS` → `jcimlasOS`
   - `Ubuntu` (standalone) → `jcimlas`
   - `ubuntu` (lowercase, in identifiers, filenames, comments, file paths inside the simulated FS) → `jcimlas`
   - Files with the highest counts: `apps/Email.tsx` (20), `apps/Browser.tsx` (7), `apps/Terminal.tsx` (6), `apps/ImageViewer.tsx` (6), `hooks/useOSStore.tsx` (4), `components/BootSequence.tsx`, `App.tsx`, `index.css`, etc.
   - Includes boot screen title, terminal `user@ubuntu` prompt, simulated `/home/ubuntu` paths, settings "About" panel, system monitor labels.

2. **Strip Kimi branding entirely**
   - Any "Kimi", "Kimi Agent", "Made by Kimi", "Powered by Kimi", author/footer credits, default contact entries, sample emails/notes referring to Kimi.
   - Replace with neutral equivalents (e.g., generic user "jcimlas", neutral sample content) — no replacement attribution.

3. **Non-text assets**: scan for any Ubuntu/Kimi logos in `public/` or `src/assets/`. If found, replace with a simple jcimlasOS text/SVG mark; otherwise leave alone.

4. **Metadata**: `index.html` `<title>`, `package.json` `name`, README headings, `plan.md` / `info.md` references.

## Deliverable 1 — Zip

- Apply the rename across all files using a scripted sed pass with case-preserving rules, then spot-check the high-count files.
- Repackage as `/mnt/documents/jcimlasOS.zip` (top-level folder `jcimlasOS/`) and surface via `<presentation-artifact>` for download.

## Deliverable 2 — Working Lovable preview

The uploaded app is **Vite + React Router + Zustand**; the current Lovable project is **TanStack Start**. To make it "work fully" in the preview without rewriting every app component, the cleanest approach is:

- Copy the rebranded `app/src/**` into the Lovable project under `src/jcimlas-os/` (components, hooks, apps, types, styles).
- Install the runtime deps the simulator needs (zustand, lucide-react, framer-motion, etc. — most are already present via shadcn).
- Merge `src/index.css` tokens into `src/styles.css` (scoped under a `.jcimlas-os` wrapper to avoid clobbering existing tokens).
- Replace `src/routes/index.tsx` with a route that mounts `<JcimlasOSShell />` full-screen, plus a proper `head()` (title "jcimlasOS", description, og tags).
- Remove the blank-app placeholder.
- Convert the old `react-router-dom` `Home` page (only one tiny page) into the TanStack route; the OS itself is a single-page shell so no further routing changes are needed.
- Verify build passes and the boot sequence + desktop render in the preview viewport.

### Technical notes

- React Router usage in the source is minimal (one `Home` page). No deep route migration required.
- Zustand store (`useOSStore`) is framework-agnostic and ports as-is.
- All app windows are client-only; wrap the mount in a `useEffect`/client guard if any code touches `window` at module scope.
- No backend / Lovable Cloud needed — everything is in-memory / localStorage.

## Order of operations (once approved)

1. Extract zip to a working dir, run rebrand script, manually fix any leftovers.
2. Build the downloadable `jcimlasOS.zip` artifact.
3. Copy rebranded sources into `src/jcimlas-os/`, install deps, wire up the index route, merge CSS tokens.
4. Run build, fix any TanStack/SSR-specific issues (window guards, import paths), confirm preview renders.
5. Reply with the artifact tag + a short confirmation.

## One question before I start

Do you want the downloadable zip to be the **standalone Vite project** (runs with `npm install && npm run dev` exactly like the original, just rebranded) — or a **TanStack Start version** matching what gets embedded in the Lovable preview? Standalone Vite is faster and matches the original upload's shape; I'll go with that unless you say otherwise.
