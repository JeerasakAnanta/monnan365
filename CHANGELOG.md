# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- Share and print trip plans with Supabase persistence (`/api/plan/share`)
- Shared plan view route (`/share/[id]`)
- Print stylesheet for saving plans as PDF
- NanIcon component system replacing emoji with lucide-react icons
- `APP_VERSION` constant in layout metadata and footer
- Scroll position memory (`ScrollRestoration`)
- Server housekeeping workflow for automated Docker cleanup
- CI/CD concurrency settings and improved deployment steps
- `SITE_URL` constant and `metadataBase` for absolute OG URLs
- Google Maps link button on each attraction card
- Print header with branding, footer with attribution, and page break controls for PDF export

### Fixed

- Mobile navbar responsiveness (hamburger menu, logo visibility)
- Hero and highlights section mobile layout
- Custom icon props (`size`/`color`/`strokeWidth`) honoring
- Footer copyright text format and version display
- CI/CD deploy job image pull (403 Forbidden)
- `.env` sourcing before image verification in deploy step
- `NEXT_PUBLIC_APP_VERSION` wired through Docker build
- Leaflet Map container reuse error by adding key prop
- GPS coordinates for 5 attractions (Wat Phra That Chae Haeng, Doi Samer Dao, Bo Kluea, Wat Phra That Khao Noi, Wat Nong Bua)
- Badge text from "แหล่งรอง" to "แหล่งท่องเที่ยวรอง" for clarity
- Replaced unused `vercel.svg` with Nan-themed mountain/temple icon

### Changed

- CI/CD migrated from GitLab CI to GitHub Actions
- Refactored all components to use NanIcon system instead of emoji
- Doi Samer Dao metadata corrected to Si Nan National Park (was incorrectly listed as Doi Phu Kha)

## [0.1.0] - 2025-01-01

### Added

- Initial scaffold of MonNan365 AI trip planner
- Supabase dataset with attractions schema + RLS policies
- OpenRouter GPT-OSS-120B structured output for trip planning
- Leaflet / OpenStreetMap interactive map integration
- Landing page with form, timeline, and map UI
- Season-based attraction filtering with community quota (>=35%)
- Docker multi-stage build (Next.js standalone)
- GitLab CI/CD pipeline
- Seed script for attractions data
