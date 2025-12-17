# Unicorn Hunter 🦄

A Next.js application that analyzes GitHub repositories and provides speculative valuation estimates based on codebase metrics. Discover the unicorn potential of any open-source project!

> **Latest Update**: Enhanced with codebase analysis including code quality, test coverage, security, and architecture metrics.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/sentilabs/v0-unicorn-hunter-frontend)

## Overview

Unicorn Hunter analyzes GitHub repositories using codebase metrics (stars, forks, commits, contributors, etc.) to calculate:
- **Unicorn Score** (0-100) - A speculative score indicating potential valuation
- **Valuation Estimates** - Conservative, realistic, and optimistic valuation ranges
- **Component Scores** - Breakdown by community momentum, development velocity, technology quality, market potential, and network effects
- **Natural Language Interpretation** - AI-generated explanations of scores and factors

## Features

- 🎯 **Flexible Input** - Accepts both GitHub URLs (`https://github.com/owner/repo`) and owner/repo format (`owner/repo`)
- 📊 **Comprehensive Analysis** - Detailed metrics and component score breakdowns
- 🔍 **Codebase Analysis** - Deep code quality, test coverage, security, and architecture analysis (when requested)
- 💬 **Natural Language Insights** - AI-powered interpretation of results
- 🎨 **Beautiful UI** - Modern design with dark/light theme support
- ⚡ **Fast Analysis** - Real-time repository analysis via MCP backend

## Important Disclaimer

**This analysis is based solely on GitHub activity metrics and does NOT consider:**
- Actual codebase content or code quality
- Code complexity or architecture
- Test coverage or documentation quality
- Daily Active Users (DAU)
- Revenue or business metrics
- User engagement data
- Market conditions

**What is analyzed:**
- GitHub metrics (stars, forks, watchers, issues)
- Development activity (commits, contributors, commit frequency)
- Repository metadata (language, age, description)
- **Codebase Analysis** (when requested with keywords like "codebase", "deep", or "code"):
  - Code complexity and quality scores
  - Test coverage analysis
  - Dependency and security scanning
  - Architecture and design patterns
  - Documentation quality

**Valuations are purely speculative estimates** based on GitHub activity patterns and codebase analysis. These should not be considered financial advice.

## Tech Stack

- **Framework**: Next.js 16
- **UI**: React 19, Tailwind CSS, Radix UI
- **Backend**: MCP (Model Context Protocol) Server
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### Development

```bash
# Start development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Build for production
npm run build
# or
pnpm build
```

## Usage

1. Enter a GitHub repository URL or owner/repo format
   - Examples:
     - `https://github.com/facebook/react`
     - `facebook/react`
     - `vercel/next.js`
2. Click "Hunt Unicorn" to analyze
3. View comprehensive results including:
   - Unicorn score and status
   - Valuation estimates (conservative, realistic, optimistic)
   - Component score breakdown
   - Repository metrics
   - Natural language interpretation

## Backend Integration

This app connects to an MCP (Model Context Protocol) server for repository analysis:

- **Endpoint**: `https://valuation-mcp-server-554655392699.us-central1.run.app`
- **Tools Used**:
  - `analyze_github_repository` - Fetches repository data and metrics
  - `unicorn_hunter` - Calculates unicorn scores and valuations

## Project Structure

```
├── app/
│   ├── actions.ts          # Server actions for MCP API calls
│   ├── page.tsx             # Main page component
│   └── layout.tsx           # Root layout
├── components/
│   ├── interpretation-display.tsx  # Natural language results
│   ├── repo-input.tsx       # Repository input component
│   ├── score-display.tsx    # Score visualization
│   ├── valuation-cards.tsx  # Valuation cards
│   └── ui/                  # Reusable UI components
└── public/                  # Static assets
```

## Deployment

The project is configured for deployment on Vercel. The repository is automatically synced with v0.app deployments.

## License

This project is open source and available for use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.