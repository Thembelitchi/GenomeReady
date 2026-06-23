# 🧬 GenomeReady
### *APBA/ABI Bring Your Own Data (BYOD) Hackathon Companion Platform*

GenomeReady is a robust full-stack digital companion platform designed to empower agricultural breeders, geneticists, and researchers participating in the APBA/ABI Bring Your Own Data (BYOD) Hackathon. It bridges the gap between raw field datasets and high-impact biological insights by providing real-time data validation, guided containerized environment setups, dynamic workflow simulations, and mixed-model bioinformatics learning modules.

---

## 📋 Table of Contents
1. [Platform Overview & Philosophy](#-platform-overview--philosophy)
2. [Core Architecture & Technology Stack](#%EF%B8%8F-core-architecture--technology-stack)
3. [Subsystems & Interactive Features](#-subsystems--interactive-features)
   - [Role-Based Simulation Dashboard](#1-role-based-simulation-dashboard)
   - [BYOD Data Validation & Quality Control (QC)](#2-byod-data-validation--quality-control-qc)
   - [Docker & Container Environment Guide](#3-docker--container-environment-guide)
   - [Curriculum & Interactive Lecture Portal](#4-curriculum--interactive-lecture-portal)
   - [Reproducible Bioinformatics Workflow Runner](#5-reproducible-bioinformatics-workflow-runner)
   - [Mentor Support Desk & Gemini AI Agent](#6-mentor-support-desk--gemini-ai-agent)
   - [Organizer Diagnostic Center](#7-organizer-diagnostic-center)
   - [Project Showcase & Publication Tracker](#8-project-showcase--publication-tracker)
4. [Environment Configuration](#%EF%B8%8F-environment-configuration)
5. [Development & Build Operations](#%EF%B8%8F-development--build-operations)
6. [Bioinformatics Reference & Standards](#-bioinformatics-reference--standards)

---

## 🌟 Platform Overview & Philosophy

Breeder datasets are inherently messy—characterized by inconsistent sample IDs, spatial field variation, genotype-phenotype mismatching, and missing genotype matrix elements. Transitioning these datasets into state-of-the-art Mixed Linear Models (MLMs) or Genomic Selection pipelines often triggers system crashes, memory overruns, or biological misinterpretations.

GenomeReady is engineered to resolve these friction points before and during active workshops:
- **Architectural Honesty**: High-fidelity diagnostics without "tech-larping." No fake telemetry or logs—only precise scientific metrics (e.g., Hardy-Weinberg p-values, Minor Allele Frequency curves, heritability estimates).
- **Aesthetic Pairings**: Framed on a modern Slate-themed interface with high-contrast typography, utilizing elegant negative space, standard responsive touchpoints, and smooth micro-animations.
- **Fail-Safe Onboarding**: Translates dense bioinformatics manuals into interactive checkers, ensuring absolute project readiness before expensive computational runs are initiated.

---

## 🛠️ Core Architecture & Technology Stack

GenomeReady is a unified **Full-Stack (Vite + Express)** application running in a high-performance containerized environment.

```
       [ Client Side (Single Page Application) ]
    +-----------------------------------------------+
    |   React 19 + Vite + Tailwind CSS v4           |
    |   Interactive Recharts (PCA, MAF, Manhattan)  |
    |   Framer Motion Transitions & Video Player    |
    +-----------------------------------------------+
                           |
                     (HTTP/JSON)
                           v
         [ Server Side (Node.js Express App) ]
    +-----------------------------------------------+
    |   Express API Router (/api/tickets, etc.)     |
    |   Google Gemini AI SDK Integration            |
    |   Atomic JSON File Database Engine            |
    +-----------------------------------------------+
```

- **Frontend Core**: **React 19** compiled via **Vite** for optimized, high-speed UI responsiveness.
- **Styling**: **Tailwind CSS v4** utilizing component utility structures, customized theme tokens, and dynamic layouts.
- **Data Visualization**: Customized **Recharts** charts rendering biological distributions:
  - Manhattan & Q-Q Plots for GWAS results.
  - Interactive Scatter Plots for Principal Component Analysis (PCA) population stratification.
  - Histogram distributions for Minor Allele Frequency (MAF) and phenotypic metrics.
- **Backend Services**: **Express** server acting as a secure gateway for API routing and file persistence.
- **AI Triage Agent**: Powered by **Gemini 2.5/Flash** via the `@google/genai` TypeScript SDK. The agent is strictly server-side, protecting API credentials and proxying responses.
- **Production Bundler**: Configured with a specialized **esbuild** bundler producing a single, bundled CJS file (`dist/server.cjs`) to ensure perfect compatibility with containerized Node runtimes.

---

## 🔌 Subsystems & Interactive Features

### 1. Role-Based Simulation Dashboard
The interface includes a multi-view perspective selector to simulate three key hackathon roles:
- **Participant**: View personal bio-profiles, check overall readiness scores, upload/QC raw crop datasets, and track active workflow results.
- **Mentor**: Access the ticket board, review assigned support queues, and run AI-assisted reviews on mixed-model convergence errors.
- **Organizer**: Review cohort-wide statistics, inspect overall participant readiness, and flag at-risk candidates for targeted intervention.

### 2. BYOD Data Validation & Quality Control (QC)
A client-side analysis engine built to validate breeder phenotype and genotype data:
- **ID Matcher**: Checks exact match congruence between genotype sample registers and phenotype observation sheets to highlight missing rows or misspelled taxon names.
- **Variant Filtering**: Simulates filtering by SNP missingness (e.g., `< 0.1`) and Minor Allele Frequency (MAF) thresholds.
- **HWE P-Value Tester**: Generates Hardy-Weinberg Equilibrium distributions to isolate genotyping errors from biological signals.
- **Interactive PCA scatterplot**: Visualizes population stratification using dynamic sample grouping.

### 3. Docker & Container Environment Guide
Provides system-specific setups (Windows with WSL2, MacOS memory thresholds, RedHat/Debian Linux packages) to run heavy GWAS container layers:
- **WSL2 Verification**: Highlights common pathing and engine activation instructions for Windows users.
- **Memory Guard Calculator**: Guides users to allocate **at least 8GB of RAM** in Docker Desktop settings to prevent Out-of-Memory (OOM) failures during kinship calculations.
- **Embedded Walkthrough Video**: Features a direct, embedded video player streaming an in-depth Docker installation and Dockerfile configuration tutorial.

### 4. Curriculum & Interactive Lecture Portal
An educational suite containing structured curricular modules:
1. **Experimental Design & Phenology**: Focusing on spatial control, augmented block layouts, and phenotyping trials. Includes walk-through tutorials.
2. **Quantitative Genetics & Association Mapping**: Covering genetic variance partitioning, kinship matrices, and mixed linear models.
3. **Practical GWAS Pipelines**: Guiding participants through end-to-end GWAS mapping, Manhattan plots, and candidate gene identification.
*Includes active video playlists, scientific slides, reading list lists, and an integrated, runnable Jupyter-style exercise cell environment.*

### 5. Reproducible Bioinformatics Workflow Runner
A simulation sandbox allowing users to configure parameters and run pipelines:
- **GWAS Mapping (GAPIT / TASSEL)**: Configure covariates (PCA coordinates), kinship methods (VanRaden vs. Centered IBS), and MAF filters. Outputs high-resolution Manhattan plots and Q-Q plots.
- **Genomic Selection (rrBLUP / GBLUP)**: Tune cross-validation folds, training set percentages, and heritability priors. Outputs dynamic prediction accuracy fold-charts.
- **Population Structure (ADMIXTURE / fastSTRUCTURE)**: Set target K-clusters and review interactive Ancestry Coefficients bar charts.

### 6. Mentor Support Desk & Gemini AI Agent
A ticket queue designed for bioinformatics troubleshooting:
- Users open tickets categorized by Setup, Data, Analysis, or Interpretation.
- Threaded peer-to-peer discussion logs allow collaborative debugging.
- **Dr. Koffi's Automated Assistant**: Powered by server-side Gemini, the assistant reads incoming tickets (such as mixed-model convergence failures or Singularity container crashes) and returns immediate, contextual diagnostic actions.

### 7. Organizer Diagnostic Center
Enables hackathon organizers to evaluate workshop readiness before on-site travel:
- **Readiness Score Tracking**: Aggregate metrics measuring completed modules, environment checks, and data uploads.
- **At-Risk Triage**: Automatic red flags for participants with `<50%` scores two weeks before the event, facilitating immediate follow-up.

### 8. Project Showcase & Publication Tracker
Enables participants to archive their validated crop research results:
- Catalogues crop focus, institutional affiliations, and custom abstracts.
- Maps outcomes to standard digital identifiers (DOIs) and potential open-access scientific journals.

---

## ⚙️ Environment Configuration

GenomeReady utilizes standard configuration files at the root level. To run the server-side AI triage and locate endpoints, declare the following variables:

1. Copy the example configuration template:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and fill in your variables:
   ```env
   # GEMINI_API_KEY: Secret key retrieved from Google AI Studio.
   # This secret key remains server-side and is never sent to the browser.
   GEMINI_API_KEY="AIzaSyYourActualKeyGoesHere"

   # APP_URL: The hosting domain for your server, used for self-referential links.
   APP_URL="http://localhost:3000"
   ```

---

## 🛠️ Development & Build Operations

### Prerequisites
Ensure you have **Node.js** (v18 or higher) and **NPM** installed locally.

### 1. Installation
Install core project dependencies and dev utilities:
```bash
npm install
```

### 2. Development Mode
Start the full-stack development environment. Vite and Express are orchestrated concurrently on a single port via the dev server script:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Compilation & Building for Production
The production build compiles the client application into optimized static assets and packages the Express TypeScript backend into a CJS bundle using `esbuild`.

To compile:
```bash
npm run build
```
This writes the client files to `/dist` and creates the production server entry point at `dist/server.cjs`.

### 4. Running the Production Server
Start the production-ready compiled backend server:
```bash
npm run start
```

---

## 🧬 Bioinformatics Reference & Standards

For participants preparing their files for the workflow engines, please adhere to the following file-format standards:

### Genotype Formats
- **VCF (Variant Call Format v4.2)**: Must include a header block and contain sample column IDs matching the phenotype file. Ensure physical genomic coordinates match reference genome assemblies (e.g., B73 RefGen_v4 for maize, IRGSP-1.0 for rice).
- **HapMap (.hmp.txt)**: Standard 11-column header format.
- **PLINK Binary (BED/BIM/FAM)**: FAM file IDs must match row labels in your phenotype dataset.

### Phenotype Formats
- **CSV / TXT**: Long or wide formats. Ensure missing records are explicitly represented with `NA` (not left as blank fields) to prevent model conversion script crashes.
- **Spatial Metadata**: If utilizing spatial adjustment models (e.g., SpATS or Spatially Adjusted Mixed Models), your spreadsheet must contain columns labeled `Row`, `Col` (or `Range`), and `Block`.

### VanRaden Kinship Calculation Matrix Formula
The Genomic Relationship Matrix (GRM) implemented in our Genomic Selection workflow utilizes the VanRaden (2008) framework:

$$G = \frac{Z Z'}{2 \sum p_i (1 - p_i)}$$

Where:
- $Z = M - P$, where $M$ is the marker matrix encoded as $0, 1, 2$ (representing homozygote, heterozygote, alternate homozygote).
- $P$ is a matrix where column $i$ contains the value $2(p_i - 0.5)$ (with $p_i$ representing the allele frequency of marker $i$).
- The denominator normalizes the matrix, scaling relationship values to correspond to the classical pedigree-based relationship matrix.

---

*Developed in support of APBA/ABI BYOD Workshops to accelerate agricultural breeding advancements through open, accessible, and reproducible science.*
