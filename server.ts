import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { UserRole, User, LectureModule, HelpTicket, WorkflowRun, ProjectShowcase } from "./src/types";

// Setup express app
const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: any = null;
if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API initialized successfully inside backend.");
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
  }
}

// Database folder and file configuration
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Seed Data
const defaultUsers: User[] = [
  {
    id: "amina_e",
    email: "amina@eiardata.org",
    name: "Amina Edossa",
    role: UserRole.PARTICIPANT,
    institution: "Ethiopian Institute of Agricultural Research (EIAR)",
    country: "Ethiopia",
    cropFocus: "Durum Wheat Drought Tolerance",
    rLevel: "Advanced",
    pythonLevel: "Beginner",
    unixLevel: "Intermediate",
    readinessScore: 78,
    createdAt: new Date().toISOString()
  },
  {
    id: "john_k",
    email: "john.k@iita.org",
    name: "John Kamau",
    role: UserRole.PARTICIPANT,
    institution: "International Institute of Tropical Agriculture (IITA)",
    country: "Kenya",
    cropFocus: "Cassava Mosaic Disease (CMD) Resistance",
    rLevel: "Intermediate",
    pythonLevel: "Beginner",
    unixLevel: "Beginner",
    readinessScore: 45,
    createdAt: new Date().toISOString()
  },
  {
    id: "sarah_m",
    email: "sarah.m@icrisat.org",
    name: "Sarah Mwangi",
    role: UserRole.PARTICIPANT,
    institution: "ICRISAT",
    country: "Nairobi",
    cropFocus: "Chickpea Heat Resilience",
    rLevel: "Advanced",
    pythonLevel: "Intermediate",
    unixLevel: "Advanced",
    readinessScore: 92,
    createdAt: new Date().toISOString()
  },
  {
    id: "osei_abi",
    email: "osei@abi-mentor.org",
    name: "Dr. Osei Koffi",
    role: UserRole.MENTOR,
    institution: "Alliance for a Green Revolution (AGRA) / ABI",
    country: "Ghana",
    cropFocus: "Genomics & Cowpea Breeding",
    rLevel: "Advanced",
    pythonLevel: "Advanced",
    unixLevel: "Advanced",
    readinessScore: 100,
    createdAt: new Date().toISOString()
  },
  {
    id: "organizer_abi",
    email: "organizer@apba-abi.org",
    name: "Dr. Charles APBA",
    role: UserRole.ORGANIZER,
    institution: "APBA Secretariat / African Breeding Institute (ABI)",
    country: "South Africa",
    cropFocus: "All Crops",
    rLevel: "Advanced",
    pythonLevel: "Advanced",
    unixLevel: "Advanced",
    readinessScore: 100,
    createdAt: new Date().toISOString()
  }
];

const defaultModules: LectureModule[] = [
  {
    id: "mod_1",
    title: "Experimental Design & Phenology",
    sequence: 1,
    description: "Learn spatial control, augmented block layouts, and data cleanup in field phenotyping trials.",
    lectureUrl: "https://www.youtube.com/embed/sAOykZv78Zk",
    lectureUrls: [
      "https://www.youtube.com/embed/sAOykZv78Zk",
      "https://www.youtube.com/embed/ibApnjV_1wU"
    ],
    slidesUrl: "https://www.scribbr.com/methodology/experimental-design/",
    readList: [
      "Walsh & Lynch (1998) Genetics and Analysis of Quantitative Traits - Chapters 1-3",
      "Federer, W.T. (1956) Augmented (indigenous) designs (https://www.researchgate.net/publication/23544321_Augmented_indigenous_designs)",
      "Scribbr Academic Guide: Introduction to Experimental Design (https://www.scribbr.com/methodology/experimental-design/)"
    ],
    exerciseNotebookUrl: "Experimental_Design_Pre_Exercise.ipynb",
    status: "unlocked",
    progressPercent: 100,
    notebookCells: [
      {
        id: "m1_c1",
        type: "markdown",
        content: "# Pre-Exercise 1: Augmented Block Design Analysis\nThis exercise will teach you how to analyze an augmented randomized block design, common in breeding programs where seeds for new lines are highly limited and cannot be duplicated."
      },
      {
        id: "m1_c2",
        type: "code",
        content: `# Import necessary R libraries\nlibrary(survival)\nlibrary(lme4)\n# Create mockup dataset for 10 checks and 40 test entries\nset.seed(42)\nchecks_data <- data.frame(\n  Block = rep(1:4, each=3),\n  Entry = rep(paste("Check", 1:3), 4),\n  Yield = rnorm(12, mean=45, sd=4.2),\n  IsCheck = TRUE\n)\ntest_data <- data.frame(\n  Block = rep(1:4, each=10),\n  Entry = paste("Entry", 1:40),\n  Yield = rnorm(40, mean=42, sd=5.5) + rep(c(-2, 1, 3, -1), each=10),\n  IsCheck = FALSE\n)\ndataset <- rbind(checks_data, test_data)\nhead(dataset, n=12)`
      },
      {
        id: "m1_c3",
        type: "code",
        content: `# Run simple mixed model to compute Best Linear Unbiased Estimates (BLUEs)\nmodel <- lmer(Yield ~ Entry + (1|Block), data=dataset)\ncat("Augmented model convergence successful! \\nBLUEs generated for 40 test entrants.")`
      }
    ]
  },
  {
    id: "mod_2",
    title: "Quantitative Genetics & Association Mapping",
    sequence: 2,
    description: "Link genomic variants to phenotypes. Understand genetic correlations, kinship calculations, and linear models.",
    lectureUrl: "https://www.youtube.com/embed/FN7EKo0T524",
    lectureUrls: [
      "https://www.youtube.com/embed/FN7EKo0T524",
      "https://www.youtube.com/embed/8ZR1_umGFe8"
    ],
    slidesUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6431252/",
    readList: [
      "Yu et al. (2006) A unified mixed-model method for association mapping (https://www.nature.com/articles/ng1702)",
      "Price et al. (2006) Principal components analysis corrects for stratification in GWAS (https://pubmed.ncbi.nlm.nih.gov/16862161/)",
      "NIH PMC Review: Quantitative Genetics in the Era of High-Throughput Phenotyping & Genotyping (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6431252/)"
    ],
    exerciseNotebookUrl: "QuantGentics_Kinship_Pre_Exercise.ipynb",
    status: "unlocked",
    progressPercent: 50,
    notebookCells: [
      {
        id: "m2_c1",
        type: "markdown",
        content: "# Pre-Exercise 2: Calculating Genomic Relationship Matrix (Kinship)\nIn this exercise, we compute a baseline realized kinship matrix (A-matrix) using simulated SNP markers."
      },
      {
        id: "m2_c2",
        type: "code",
        content: `# Step 1: Simulate genotyping matrix (SNP matrix: 0, 1, 2 representing reference alleles)\nset.seed(123)\nn_samples <- 50\nn_markers <- 100\nM <- matrix(sample(0:2, n_samples * n_markers, replace=TRUE), nrow=n_samples)\nrownames(M) <- paste("Sample", 1:n_samples)\ncolnames(M) <- paste("SNP_Marker", 1:n_markers)\n\n# Step 2: Display Genotype matrix subset\nM[1:6, 1:8]`
      },
      {
        id: "m2_c3",
        type: "code",
        content: `# Compute kinship matrix G using VanRaden framework (2008)\np <- colMeans(M) / 2\nP <- matrix(rep(2 * p, each = n_samples), nrow = n_samples)\nZ <- (M - P)\ndenominator <- 2 * sum(p * (1 - p))\nG <- (Z %*% t(Z)) / denominator\ndiag(G)[1:5] # Display diagonal entries (self-relatedness)`
      }
    ]
  },
  {
    id: "mod_3",
    title: "Practical GWAS Pipelines",
    sequence: 3,
    description: "Execute end-to-end GWAS mapping on breeder datasets. Interpret Manhattan plots and identify significant candidate genes.",
    lectureUrl: "https://www.youtube.com/embed/9yt7Y8KQMGA",
    lectureUrls: [
      "https://www.youtube.com/embed/9yt7Y8KQMGA",
      "https://www.youtube.com/embed/nrbgly0Bcv8",
      "https://www.youtube.com/embed/PaFPbb66DxQ"
    ],
    slidesUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6822637/",
    readList: [
      "Lipka et al. (2012) GAPIT: genome association and prediction integrated tool (https://pubmed.ncbi.nlm.nih.gov/22796954/)",
      "Zhou & Stephens (2012) GEMMA: Genome-wide efficient mixed-model association (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3384594/)",
      "NIH PMC Tutorial: A Guide to Conducting Genome-Wide Association Studies (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6822637/)"
    ],
    exerciseNotebookUrl: "GWAS_Pipeline_StepByStep.ipynb",
    status: "locked",
    progressPercent: 0,
    notebookCells: [
      {
        id: "m3_c1",
        type: "markdown",
        content: "# Exercise 3: GWAS on Wheat Drought Tolerances\nLoading your filtered VCF genotypes along with the drought-responsive phenotypes to initiate EMMAX analysis."
      }
    ]
  },
  {
    id: "mod_4",
    title: "Machine Learning in Agriculture",
    sequence: 4,
    description: "Deploy Random Forests, gradient boosting (XGBoost), and deep learning to model agronomic features and complex GxE interactions.",
    lectureUrl: "https://www.youtube.com/embed/QHMBx8P_Cnk",
    lectureUrls: [
      "https://www.youtube.com/embed/QHMBx8P_Cnk",
      "https://www.youtube.com/embed/uyDfWIbNFWo",
      "https://www.youtube.com/embed/4n3iSxfXM3g"
    ],
    slidesUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8242082/",
    readList: [
      "Howard et al. (2014) Robustness of ML for genomic prediction (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3931566/)",
      "Crossa et al. (2017) Genomic selection in plant breeding: methods, models, and perspectives (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5523933/)",
      "Frontiers in Plant Science: Machine Learning in Plant Breeding (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8242082/)"
    ],
    exerciseNotebookUrl: "ML_Agriculture_Predictions.ipynb",
    status: "locked",
    progressPercent: 0,
    notebookCells: [
      {
        id: "m4_c1",
        type: "markdown",
        content: "# Exercise 4: Random Forest for Breeding Value Classification\nLet's use random forest regression to predict grain yields based on dynamic crop reflectance traits."
      }
    ]
  },
  {
    id: "mod_5",
    title: "Genomic Selection & Breeding value Prediction",
    sequence: 5,
    description: "Learn rrBLUP, GBLUP, and genomic ranking metrics. Predict performance of unphenotyped segregating offspring to accelerate selection cycles.",
    lectureUrl: "https://www.youtube.com/embed/VwFnWTcGrZU",
    lectureUrls: [
      "https://www.youtube.com/embed/VwFnWTcGrZU"
    ],
    slidesUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5829110/",
    readList: [
      "Meuwissen et al. (2001) Prediction of total genetic value using dense marker maps (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1461589/)",
      "Endelman, J.B. (2011) Ridge regression with R package rrBLUP (https://onlinelibrary.wiley.com/doi/abs/10.3835/plantgenome2011.08.0024)",
      "Frontiers Review: Genomic Selection in Plant Breeding (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5829110/)"
    ],
    exerciseNotebookUrl: "Genomic_Selection_rrBLUP.ipynb",
    status: "locked",
    progressPercent: 0,
    notebookCells: [
      {
        id: "m5_c1",
        type: "markdown",
        content: "# Exercise 5: Single and Multi-environment Genomic Selection\nCalculate genomic breeding values (GEBVs) and practice five-fold cross-validation."
      }
    ]
  }
];

const defaultWorkflows = [
  {
    id: "wf_gwas",
    name: "GWAS EMMAX & GEMMA Pipe",
    description: "Calculates principal components, builds relationship/kinship matrices, runs mixed linear models, and formats significant locus candidates into Manhattan plots.",
    category: "GWAS",
    dockerImage: "mbhewoo/hackathon-env:2026",
    sampleDataUrl: "wheat_drought_panel.vcf.gz",
    readmeUrl: "GWAS_README.md",
    status: "stable",
    durationSec: 15
  },
  {
    id: "wf_gs",
    name: "Genomic Selection rrBLUP Engine",
    description: "Calibrates Ridge Regression Best Linear Unbiased Prediction model across multiple environmental subsets and computes validation prediction accuracies.",
    category: "Genomic Selection",
    dockerImage: "mbhewoo/hackathon-env:2026",
    sampleDataUrl: "wheat_phenotypes.csv",
    readmeUrl: "GS_README.md",
    status: "stable",
    durationSec: 18
  },
  {
    id: "wf_pop",
    name: "Population Structure (Admixture + PCA)",
    description: "Runs linkage disequilibrium (LD) pruning, spawns fastSTRUCTURE-like Ancestry Matrix (K=2 to K=6), and maps primary clusters into PCA space.",
    category: "Population Structure",
    dockerImage: "mbhewoo/hackathon-env:2026",
    sampleDataUrl: "wheat_drought_panel.vcf.gz",
    readmeUrl: "POP_README.md",
    status: "stable",
    durationSec: 12
  }
];

const defaultHelpTickets: HelpTicket[] = [
  {
    id: "tk_1",
    userId: "amina_e",
    userName: "Amina Edossa",
    userInstitution: "EIAR",
    category: "analysis",
    description: "I am trying to run GEMMA using my Durum Wheat crop matrix but keep getting a singular matrix warning when constructing kinship. I have 198 samples and 45k SNPs. Is this caused by high sample missingness (some test rows are missing >20% values)?",
    status: "open",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    comments: [
      {
        id: "com_1",
        userId: "osei_abi",
        userName: "Dr. Osei Koffi",
        userRole: UserRole.MENTOR,
        text: "Hi Amina, yes! High missingness causes issues inside GEMMA's relationship matrix calculation. Please check your data upload QC dashboard, apply the recommended missingness filter (threshold to <10%), re-download the cleaned VCF export, and retry. It should solve the matrix singularities.",
        createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
      }
    ]
  },
  {
    id: "tk_2",
    userId: "john_k",
    userName: "John Kamau",
    userInstitution: "IITA",
    category: "setup",
    description: "I cannot get Docker to spin up on my Windows machine. 'docker: command not found' inside raw PowerShell. I downloaded Docker Desktop. Do I need to enable WSL2 kernel integration manually?",
    status: "open",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    comments: [
      {
        id: "com_2",
        userId: "osei_abi",
        userName: "Dr. Osei Koffi",
        userRole: UserRole.MENTOR,
        text: "Hello John, make sure you start Docker Desktop first. Also inside Docker Desktop Settings, go to General and check 'Use the WSL 2 based engine'. Then reboot your powershell terminal.",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ]
  },
  {
    id: "tk_3",
    userId: "sarah_m",
    userName: "Sarah Mwangi",
    userInstitution: "ICRISAT",
    category: "data",
    description: "How strictly should phenotype column naming match the expected template for the Genomic Selection runner? The runner expects 'Env' and 'Yield_kg_ha' but my column is named 'Yield_KG_HECTARE' with some missing NA cells.",
    status: "resolved",
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    resolvedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    comments: [
      {
        id: "com_3",
        userId: "osei_abi",
        userName: "Dr. Osei Koffi",
        userRole: UserRole.MENTOR,
        text: "Hi Sarah! Yes, the companion model parses column headers literally. I added a mapping resolver so you can rename it during dataset configuration, or you can use the interactive fix button inside our validation screen to auto-format it.",
        createdAt: new Date(Date.now() - 3600000 * 19).toISOString()
      }
    ]
  }
];

const defaultShowcase: ProjectShowcase[] = [
  {
    id: "proj_1",
    userId: "sarah_m",
    ownerName: "Sarah Mwangi",
    institution: "ICRISAT",
    cropFocus: "Chickpea Heat Resilience",
    title: "Identifying Heat Tolerance Genomic Regions in Sahelian Chickpeas",
    description: "Conducted GWAS mapping across 500 dryland check lines. Discovered three significant SNP nodes on Chromosome 4 associated with robust biomass production under ambient heat conditions.",
    showcaseStatus: true,
    doi: "10.5281/zenodo.10824823",
    publicationsMapped: [
      "Sahelian Chickpea Panel GWAS (Preprint draft)",
      "APBA Abstract Submission: Oct 2026"
    ],
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
  }
];

// Helper to Load/Save Database JSON
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const freshDB = {
      users: defaultUsers,
      modules: defaultModules,
      workflows: defaultWorkflows,
      helpTickets: defaultHelpTickets,
      runs: [] as WorkflowRun[],
      uploads: [] as any[],
      showcases: defaultShowcase
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(freshDB, null, 2));
    return freshDB;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, regenerating defaults...", err);
    const freshDB = {
      users: defaultUsers,
      modules: defaultModules,
      workflows: defaultWorkflows,
      helpTickets: defaultHelpTickets,
      runs: [] as WorkflowRun[],
      uploads: [] as any[],
      showcases: defaultShowcase
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(freshDB, null, 2));
    return freshDB;
  }
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to database file:", err);
  }
}

// Ensure database registers initial data immediately
loadDB();

// -------------------------------------------------------------
// backend api endpoints
// -------------------------------------------------------------

// Active user session emulation
let currentUserSession: User = defaultUsers[0]; // Amina by default for instantaneous dashboard onboarding

// LOGIN/REGISTER & ME
app.post("/api/auth/register", (req, res) => {
  const { email, password, name, institution, country, cropFocus, rLevel, pythonLevel, unixLevel } = req.body;
  const db = loadDB();

  const exists = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "User already registered under this email." });
  }

  const newUser: User = {
    id: "user_" + Date.now(),
    email,
    name,
    role: UserRole.PARTICIPANT,
    institution,
    country,
    cropFocus,
    rLevel: rLevel || "Intermediate",
    pythonLevel: pythonLevel || "Beginner",
    unixLevel: unixLevel || "Beginner",
    readinessScore: 10, // Starting score of profile completed
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);
  currentUserSession = newUser;
  res.json({ user: newUser, token: "mock-jwt-token" });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  const db = loadDB();

  // Find user or create/use standard session
  const user = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "Authentication failed. User not registered." });
  }

  currentUserSession = user;
  res.json({ user, token: "mock-jwt-token" });
});

app.get("/api/auth/me", (req, res) => {
  const db = loadDB();
  const queryUserId = req.query.userId as string;
  if (queryUserId) {
    const user = db.users.find((u: User) => u.id === queryUserId);
    if (user) {
      currentUserSession = user;
    }
  }
  res.json({
    success: true,
    user: currentUserSession,
    allUsers: db.users
  });
});

app.post("/api/auth/update-score", (req, res) => {
  const { userId, scoreToAdd } = req.body;
  const db = loadDB();
  const user = db.users.find((u: User) => u.id === userId);
  if (user) {
    user.readinessScore = Math.min(100, user.readinessScore + scoreToAdd);
    saveDB(db);
    if (currentUserSession.id === userId) {
      currentUserSession.readinessScore = user.readinessScore;
    }
    return res.json({ success: true, user });
  }
  res.status(404).json({ error: "User or score parameter not registered." });
});

app.post("/api/auth/switch-role", (req, res) => {
  const { userId } = req.body;
  const db = loadDB();
  const target = db.users.find((u: User) => u.id === userId);
  if (target) {
    currentUserSession = target;
    return res.json({ success: true, user: target });
  }
  res.status(404).json({ error: "Selected account structure not found." });
});

// COHORTS & MEMBERS
app.get("/api/cohorts", (req, res) => {
  res.json({
    cohort: {
      id: "cohort_apba_2026",
      name: "APBA/ABI Hackathon 2026 (Oct 5 - Oct 9)",
      status: "active",
      startDate: "2026-10-05",
      endDate: "2026-10-09"
    }
  });
});

app.get("/api/cohorts/members", (req, res) => {
  const db = loadDB();
  // Return all users that are participants
  res.json({
    members: db.users.filter((u: User) => u.role === UserRole.PARTICIPANT)
  });
});

app.get("/api/cohorts/dashboard", (req, res) => {
  const db = loadDB();
  const participants = db.users.filter((u: User) => u.role === UserRole.PARTICIPANT);
  const total = participants.length;

  const setupComplete = participants.filter((p: User) => p.readinessScore >= 50).length;
  // Let's assume some simulated numbers of data uploaded
  const dataUploaded = db.uploads && db.uploads.length ? db.uploads.length : 2;
  const exercisesComplete = participants.filter((p: User) => p.readinessScore > 80).length;

  res.json({
    cohortName: "APBA/ABI Hackathon 2026 Cohort",
    metrics: {
      totalParticipants: total,
      setupCompletedPercent: Math.round((setupComplete / (total || 1)) * 100),
      dataUploadedPercent: Math.round((dataUploaded / (total || 1)) * 100),
      preExercisesCompletedPercent: Math.round((exercisesComplete / (total || 1)) * 100),
      atRiskTotal: participants.filter((p: User) => p.readinessScore < 50).length
    },
    students: participants
  });
});

// DATA UPLOADS + QC REPORT ROUTING
app.post("/api/data/upload", (req, res) => {
  const { filename, fileType, fileSize } = req.body;
  const db = loadDB();

  // Basic simulated validation and immediate parsing
  const isVcf = filename.endsWith(".vcf") || filename.endsWith(".vcf.gz");
  const isCsv = filename.endsWith(".csv") || filename.endsWith(".tsv");

  let mockReport: any = null;

  if (isVcf) {
    mockReport = {
      samplesCount: 198,
      snpsCount: 45203,
      missingnessRate: 3.2,
      passedCount: 43710,
      mafDistribution: [
        { range: "0.0 - 0.05", count: 830 },
        { range: "0.05 - 0.1", count: 1840 },
        { range: "0.1 - 0.2", count: 6500 },
        { range: "0.2 - 0.3", count: 12300 },
        { range: "0.3 - 0.4", count: 14200 },
        { range: "0.4 - 0.5", count: 9533 }
      ],
      hwePvalues: [
        { range: "< 1e-6", count: 420 },
        { range: "1e-6 - 1e-4", count: 1250 },
        { range: "1e-4 - 0.01", count: 3200 },
        { range: "0.01 - 0.05", count: 6813 },
        { range: "> 0.05", count: 33520 }
      ],
      pcaPoints: [
        { pc1: -0.15, pc2: 0.22, sampleId: "ETH_001", group: "Highlands (East)" },
        { pc1: -0.12, pc2: 0.19, sampleId: "ETH_002", group: "Highlands (East)" },
        { pc1: -0.14, pc2: 0.21, sampleId: "ETH_003", group: "Highlands (East)" },
        { pc1: 0.02, pc2: -0.05, sampleId: "ETH_047", group: "Rift Valley (North)" },
        { pc1: 0.05, pc2: -0.09, sampleId: "ETH_048", group: "Rift Valley (North)" },
        { pc1: 0.26, pc2: 0.12, sampleId: "ETH_089", group: "Dryland Arid zones" },
        { pc1: 0.29, pc2: 0.09, sampleId: "ETH_090", group: "Dryland Arid zones" }
      ],
      phenotypeStats: {
        name: "Grain Yield (yield_kg_ha)",
        mean: 3412.5,
        sd: 420.2,
        missingCount: 12,
        distribution: [
          { value: "1000-2000", count: 8 },
          { value: "2000-2500", count: 24 },
          { value: "2500-3000", count: 65 },
          { value: "3000-3500", count: 82 },
          { value: "3500-4000", count: 15 },
          { value: "4000+", count: 4 }
        ]
      },
      readinessContribution: 30,
      recommendations: [
        "Genotype filter: Filter out SNPs with MAF < 0.05 (830 SNPs found in low frequency).",
        "Sample outliers: Eth_047 and Eth_089 have extreme heterozygosity missingness rates (>10%). Consider dropping these 2 samples.",
        "Missing phenotypes: 'yield_kg_ha' has 12 unrecorded coordinates. Correct these with mean imputation or EM-algorithm priors."
      ]
    };
  } else if (isCsv) {
    mockReport = {
      samplesCount: 150,
      snpsCount: 0,
      missingnessRate: 8.5,
      passedCount: 150,
      mafDistribution: [],
      hwePvalues: [],
      phenotypeStats: {
        name: "CMD Severity (disease_index)",
        mean: 2.8,
        sd: 0.9,
        missingCount: 5,
        distribution: [
          { value: "1 (Resistant)", count: 45 },
          { value: "2 (Moderate)", count: 60 },
          { value: "3 (Susceptible)", count: 35 },
          { value: "4-5 (Extreme)", count: 10 }
        ]
      },
      readinessContribution: 25,
      recommendations: [
        "Headings validator: Core columns parsed. Discovered non-standard casing (Yield_KG_HECTARE was remapped).",
        "Imputation proposal: Impute 5 absent index ratings using nearest-neighbor sibling replicates."
      ]
    };
  } else {
    mockReport = {
      samplesCount: 50,
      snpsCount: 0,
      missingnessRate: 0,
      passedCount: 50,
      mafDistribution: [],
      hwePvalues: [],
      phenotypeStats: {
        name: "Unknown Traits",
        mean: 10,
        sd: 2,
        missingCount: 0,
        distribution: [{ value: "0-20", count: 50 }]
      },
      readinessContribution: 10,
      recommendations: [
        "Upload verified. Non-genotyping template registered. Ensure pedigree is mapped."
      ]
    };
  }

  const newUpload = {
    id: "up_" + Date.now(),
    userId: currentUserSession.id,
    filename,
    fileType,
    fileSize,
    uploadStatus: "completed",
    qcReportJson: mockReport,
    createdAt: new Date().toISOString()
  };

  db.uploads.push(newUpload);

  // Boost active user readiness score upon data upload completion
  const userToUpdate = db.users.find((u: User) => u.id === currentUserSession.id);
  if (userToUpdate) {
    userToUpdate.readinessScore = Math.min(100, userToUpdate.readinessScore + mockReport.readinessContribution);
    currentUserSession.readinessScore = userToUpdate.readinessScore;
  }

  saveDB(db);
  res.json({ success: true, upload: newUpload });
});

app.get("/api/data/uploads", (req, res) => {
  const db = loadDB();
  const userUploads = db.uploads.filter((u: any) => u.userId === currentUserSession.id);
  res.json({ success: true, uploads: userUploads });
});

// CALLING GEMINI PROMPTS FOR COMPANION QC RECO
app.post("/api/data/validate-smart", async (req, res) => {
  const { fileName, summaryData } = req.body;

  if (!aiClient) {
    // Return friendly local response and fallback recommendation if no key present
    return res.json({
      recommendations: [
        "🚨 Genotyping: Filter out ultra-rare SNPs with Minor Allele Frequency (MAF) $<0.05$ using PLINK `--maf 0.05` to avoid inflated false discoveries.",
        "🚨 Missingness: Keep sample missingness rate below 10% (PLINK `--mind 0.1`) to ensure matrix stability. Reject samples `ETH_047` and `ETH_089`.",
        "🚨 Phenotype Control: Ensure the 'yield_kg_ha' covariate is model-adjusted for spatial block gradients inside your augmented experimental R matrix.",
        "🚨 Advice: Pre-impute the 12 missing values with localized average coordinates before initiating GEMMA ridge parameters."
      ],
      aiResponse: "### Local ABI Bioinformatics Advisor\n\nNo active APBA-ABI Gemini Hub Secret found. Spawning preset rules based on typical crop association models:\n\n1. **MAF Filter**: Filter rare SNPs where `MAF < 0.05` using PLINK: \n   ```bash\n   plink2 --vcf wheat_drought_panel.vcf.gz --maf 0.05 --make-bed --out wheat_filtered\n   ```\n2. **Missingness Filter**: Target samples with high missing genotype data. Sample `ETH_047` has a missingness score of 12.4%.\n   ```bash\n   plink2 --bfile wheat_filtered --mind 0.1 --recode vcf --out wheat_clean\n   ```\n3. **Spatial R Analysis**: Clean phenotypic indices through Best Linear Unbiased Estimates (BLUEs) using the R `lme4` package."
    });
  }

  try {
    const prompt = `You are an elite Agri-informatics quantitative geneticist assisting a participant of the 2026 APBA/ABI Plant Breeding Hackathon closely studying target traits of African crops (such as Drought tolerance wheat, Cassava Mosaic, Chickpea heat resistance, etc.).
    The user uploaded a file named: "${fileName}" with summary metrics: ${JSON.stringify(summaryData)}.
    Analyze this genotype/phenotype setup and generate:
    1. A list of 3-4 specific scientific quality control recommendations.
    2. A short paragraph of encouragement identifying how these QC steps maximize GWAS/rrBLUP success and prevent "spurious associations".
    3. Include exact, ready-to-run PLINK 2.0, R, or Python snippets.
    Ensure your response is readable in GitHub Flavored Markdown.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    const markdownText = response.text || "";

    // Extract guidelines asynchronously
    const recs = [
      "Filter low-quality markers where MAF < 0.05 to enhance statistical statistical power.",
      "Drop specific samples showing missingness rates exceeding 10% tolerance thresholds.",
      "Adjust phenotypic columns dynamically to standard kilograms-per-hectare scaling.",
      "Check population structures using the PCA cluster map prior to fixed covariate assignment."
    ];

    res.json({
      recommendations: recs,
      aiResponse: markdownText
    });
  } catch (error: any) {
    console.error("Gemini analytical recommendation error:", error);
    res.status(500).json({ error: "Gemini generation failed", details: error.message });
  }
});

// LECTURE MODULES & SEQUENTIAL PROGRESSIONS
app.get("/api/lectures/modules", (req, res) => {
  const db = loadDB();
  res.json({ success: true, modules: db.modules });
});

app.get("/api/modules", (req, res) => {
  const db = loadDB();
  res.json({ success: true, modules: db.modules });
});

const handleProgressUpdate = (req: any, res: any) => {
  const { id } = req.params;
  const { status, progressPercent, notebookCells } = req.body;
  const db = loadDB();

  const idx = db.modules.findIndex((m: LectureModule) => m.id === id);
  if (idx !== -1) {
    db.modules[idx].status = status;
    db.modules[idx].progressPercent = progressPercent;
    if (notebookCells) {
      db.modules[idx].notebookCells = notebookCells;
    }

    // Sequential Unlock Logic
    if (status === "completed" && idx + 1 < db.modules.length) {
      db.modules[idx + 1].status = "unlocked";
    }

    // Boost active readiness score upon completing a learning module
    if (status === "completed") {
      const userToUpdate = db.users.find((u: User) => u.id === currentUserSession.id);
      if (userToUpdate) {
        userToUpdate.readinessScore = Math.min(100, userToUpdate.readinessScore + 10);
        currentUserSession.readinessScore = userToUpdate.readinessScore;
      }
    }

    saveDB(db);
    return res.json({ success: true, modules: db.modules });
  }
  res.status(404).json({ error: "Module not found." });
};

app.post("/api/modules/:id/progress", handleProgressUpdate);
app.post("/api/lectures/:id/progress", handleProgressUpdate);

const handleReset = (req: any, res: any) => {
  const { id } = req.params;
  const db = loadDB();
  // Return the original seed notebook cells
  const seedModule = defaultModules.find(m => m.id === id);
  const idx = db.modules.findIndex((m: LectureModule) => m.id === id);
  if (seedModule && idx !== -1) {
    db.modules[idx].notebookCells = seedModule.notebookCells;
    db.modules[idx].progressPercent = 0;
    saveDB(db);
    return res.json({ success: true, module: db.modules[idx] });
  }
  res.status(404).json({ error: "Module lookup error" });
};

app.post("/api/modules/:id/reset", handleReset);
app.post("/api/lectures/:id/reset", handleReset);

// WORKFLOW PIPELINES RUN COMPILER (Simulating Snakemake execution logs dynamically!)
app.get("/api/workflows", (req, res) => {
  const db = loadDB();
  res.json({ success: true, workflows: db.workflows });
});

app.get("/api/workflows/runs", (req, res) => {
  const db = loadDB();
  const userRuns = db.runs.filter((r: WorkflowRun) => r.userId === currentUserSession.id);
  res.json({ success: true, runs: userRuns });
});

app.post("/api/workflows/:id/run", (req, res) => {
  const { id } = req.params;
  const { inputDataId, parameters } = req.body;
  const db = loadDB();

  const wf = db.workflows.find((w: any) => w.id === id);
  if (!wf) {
    return res.status(404).json({ error: "Specified pipeline workflow not registered." });
  }

  // Construct fake but highly technical logs that stream progressively
  const pipelineCategory = wf.category;
  let pipelineLogs: string[] = [];
  let resMetadata: any = {};

  if (pipelineCategory === "GWAS") {
    pipelineLogs = [
      `[ABI GWAS ENGINE] Booting container: ${wf.dockerImage}`,
      `[ABI GWAS ENGINE] Loading VCF Genotypes target chromosome alignments... Loaded 45,203 SNPs.`,
      `[ABI GWAS ENGINE] Parsing phenotype matrix... Loaded 198 field plots under 'yield_kg_ha'.`,
      `[INFO] Recalculating Minor Allele Frequency filter. MAF threshold requested=${parameters.maf || 0.05}.`,
      `[INFO] Filtering out low MAF loci... Dropped 830 rare variants. Remaining: 44,373 markers.`,
      `[INFO] Imputing genotype gaps via local population haplotype priors. Missingness tolerance=${parameters.missingness || 0.1}.`,
      `[INFO] Computing Multi-dimensional Scaling (MDS) Principal Components for population stratification... PC1, PC2 resolved.`,
      `[GEMMA RUNNER] Standardizing kinship kinship/relatedness G-matrix (VanRaden framework)...`,
      `[GEMMA RUNNER] Executing Univariate Mixed Linear Model EMMAX association tests...`,
      `[PLOTTER] Generating Manhattan layout... Core Chromosome coordinates projected.`,
      `[PLOTTER] Generating Quantile-Quantile (Q-Q) reliability ratios...`,
      `[ABI GWAS ENGINE] Compilation complete. Significant loci tabulated successfully! Duration: 8 minutes.`
    ];

    resMetadata = {
      gwasSnps: [
        { snpId: "rs7491274", chr: 1, pos: 12591203, pvalue: 4.8e-9 },
        { snpId: "rs4203112", chr: 2, pos: 5801931, pvalue: 1.2e-8 },
        { snpId: "rs9935102", chr: 4, pos: 14209489, pvalue: 5.5e-14 }, // Chromosome 4 target!
        { snpId: "rs1004821", chr: 4, pos: 14210340, pvalue: 8.9e-11 },
        { snpId: "rs5520931", chr: 7, pos: 94810232, pvalue: 2.1e-7 }
      ]
    };
  } else if (pipelineCategory === "Genomic Selection") {
    pipelineLogs = [
      `[ABI GS ENGINE] Booting container: ${wf.dockerImage}`,
      `[ABI GS ENGINE] Activating rrBLUP training parameters on wheat environments...`,
      `[INFO] Setting up fold partition cross validation. Folds requested=5.`,
      `[INFO] Generating ridge prediction parameters. Heritability estimate configured.`,
      `[rrBLUP] Executing Fold 1 training... Accuracy correlation achieved r=0.58.`,
      `[rrBLUP] Executing Fold 2 training... Accuracy correlation achieved r=0.62.`,
      `[rrBLUP] Executing Fold 3 training... Accuracy correlation achieved r=0.55.`,
      `[rrBLUP] Executing Fold 4 training... Accuracy correlation achieved r=0.61.`,
      `[rrBLUP] Executing Fold 5 training... Accuracy correlation achieved r=0.59.`,
      `[INFO] Scoring unphenotyped breeding lines... Computed 40 Genomic Estimated Breeding Values (GEBVs).`,
      `[ABI GS ENGINE] Completed genomic selection runs. Prediction accuracy metrics generated! Duration: 12 minutes.`
    ];

    resMetadata = {
      selectionAccuracy: [
        { fold: 1, accuracy: 0.58, heritability: 0.45 },
        { fold: 2, accuracy: 0.62, heritability: 0.45 },
        { fold: 3, accuracy: 0.55, heritability: 0.45 },
        { fold: 4, accuracy: 0.61, heritability: 0.45 },
        { fold: 5, accuracy: 0.59, heritability: 0.45 }
      ]
    };
  } else {
    // Population Structure
    pipelineLogs = [
      `[ABI POP ENGINE] Booting container: ${wf.dockerImage}`,
      `[INFO] Running Linkage Disequilibrium (LD) pruning (PLINK --indep-pairwise 50 5 0.2)...`,
      `[INFO] Pruned 32,100 high-correlation markers. 13,103 markers retained.`,
      `[ADMIXTURE] Sweeping structure coefficients across K value range ${parameters.kRangeStart || 2} to ${parameters.kRangeEnd || 6}...`,
      `[ADMIXTURE] Log-likelihood evaluations: K=2 (L=-4200.2), K=3 (L=-3200.5), K=4 (L=-2900.1), K=5 (L=-2850.3), K=6 (L=-2910.4)`,
      `[PCA] Deriving structural principal coordinates... PC1=32.4% variance explained, PC2=18.5%.`,
      `[ABI POP ENGINE] Optimal Ancestry composition clusters resolved (Optimal K=4). Structure charts rendered!`
    ];

    resMetadata = {
      optimalK: 4
    };
  }

  const newRun: WorkflowRun = {
    id: "run_" + Date.now(),
    userId: currentUserSession.id,
    workflowId: id,
    inputDataId: inputDataId || "up_sample_wheat_vcf",
    status: "completed",
    startedAt: new Date().toISOString(),
    completedAt: new Date(Date.now() + 3000).toISOString(), // Completed almost instantly in compiler for visual snappy UX
    parameters: parameters || {},
    logs: pipelineLogs,
    results: resMetadata,
    outputUrl: `/api/workflows/download/${id}`
  };

  db.runs.push(newRun);

  // Boost active user readiness score upon running pipelines
  const userToUpdate = db.users.find((u: User) => u.id === currentUserSession.id);
  if (userToUpdate) {
    userToUpdate.readinessScore = Math.min(100, userToUpdate.readinessScore + 15);
    currentUserSession.readinessScore = userToUpdate.readinessScore;
  }

  saveDB(db);
  res.json({ success: true, run: newRun });
});

// MENTOR HELP TICKETS & AUTO-FAQ GEMINI INTEGRATIONS
app.get("/api/tickets", (req, res) => {
  const db = loadDB();
  res.json({ success: true, tickets: db.helpTickets });
});

app.post("/api/tickets", async (req, res) => {
  const { category, description } = req.body;
  const db = loadDB();

  // Create physical ticket
  const newTicket: HelpTicket = {
    id: "tk_" + Date.now(),
    userId: currentUserSession.id,
    userName: currentUserSession.name,
    userInstitution: currentUserSession.institution,
    category,
    description,
    status: "open",
    comments: [],
    createdAt: new Date().toISOString()
  };

  db.helpTickets.push(newTicket);

  // Boost readiness as they interact with support channels
  const userToUpdate = db.users.find((u: User) => u.id === currentUserSession.id);
  if (userToUpdate) {
    userToUpdate.readinessScore = Math.min(100, userToUpdate.readinessScore + 5);
    currentUserSession.readinessScore = userToUpdate.readinessScore;
  }

  // GEMINI AUTO-ADVISOR COPILOT RESPONSE - Runs instantly if ticket is filed so participant has a draft helper!
  if (aiClient) {
    try {
      const gemmaPrompt = `You are "Dr. Osei's AI Copilot Assistant" at the 2026 APBA/ABI Plant Breeding Hackathon Support Desk.
      An elite bioinformatician. A participant named ${currentUserSession.name} from ${currentUserSession.institution} filed a support ticket under category "${category}".
      Ticket Problem: "${description}"
      Provide a highly target bioinformatic response in Markdown. Include:
      1. A short, friendly greeting starting with "Hello ${currentUserSession.name}!"
      2. Clear diagnostic steps to analyze what went wrong.
      3. A sample code block (bash plink commands, R model syntax, or python scripts) that typically resolves this bug.
      Keep the tone encouraging, technical, professional, and dry.`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: gemmaPrompt
      });

      const adviceText = response.text || "";

      newTicket.comments.push({
        id: "com_ai_" + Date.now(),
        userId: "osei_ai_copilot",
        userName: "Dr. Koffi's AI Advisor",
        userRole: UserRole.MENTOR,
        text: adviceText,
        createdAt: new Date(Date.now() + 1000).toISOString()
      });
    } catch (e) {
      console.error("Gemini failed resolving automated copilot response:", e);
    }
  } else {
    // Local pre-baked diagnostic responses
    let helperComment = "";
    if (category === "setup") {
      helperComment = `Hello ${currentUserSession.name}! I am Dr. Koffi's automated support assistant. For Docker workspace command failures: 
      \n1. Ensure Docker daemon is actively running in the background.
      \n2. Attempt explicit memory assignment increases inside your Docker configs (aim for >8GB Allocation).
      \n3. Run: \`docker run -p 8888:8888 mbhewoo/hackathon-env:2026\` to confirm correct mounting.`;
    } else {
      helperComment = `Hello ${currentUserSession.name}! I am Dr. Koffi's automated support assistant. To solve this Quantitative Genotyping or modeling bug:
      \n1. Confirm you don't contain formatting characters in your phenotype TSV headers.
      \n2. Standardize covariate inputs such as Principal Component scales (PC1, PC2).
      \n3. Sample check: Verify your Plink FAM genotyping headers conform precisely with your phenotype ID sequences.`;
    }

    newTicket.comments.push({
      id: "com_local_ai_" + Date.now(),
      userId: "osei_ai_copilot",
      userName: "Dr. Koffi's AI Advisor (Local)",
      userRole: UserRole.MENTOR,
      text: helperComment,
      createdAt: new Date().toISOString()
    });
  }

  saveDB(db);
  res.json({ success: true, ticket: newTicket });
});

app.post("/api/tickets/:id/comment", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const db = loadDB();

  const ticketObj = db.helpTickets.find((t: HelpTicket) => t.id === id);
  if (!ticketObj) {
    return res.status(404).json({ error: "Help ticket not found." });
  }

  const commentObj = {
    id: "com_" + Date.now(),
    userId: currentUserSession.id,
    userName: currentUserSession.name,
    userRole: currentUserSession.role,
    text,
    createdAt: new Date().toISOString()
  };

  ticketObj.comments.push(commentObj);
  saveDB(db);
  res.json({ success: true, comment: commentObj });
});

app.post("/api/tickets/:id/resolve", (req, res) => {
  const { id } = req.params;
  const db = loadDB();

  const ticketObj = db.helpTickets.find((t: HelpTicket) => t.id === id);
  if (ticketObj) {
    ticketObj.status = "resolved";
    ticketObj.resolvedAt = new Date().toISOString();
    saveDB(db);
    return res.json({ success: true, ticket: ticketObj });
  }
  res.status(404).json({ error: "Help Ticket not found." });
});

// PROJECTS POST-HACKATHON ARCHIVER & ARCHIVE ZIP GENERATOR!
app.get("/api/projects/showcases", (req, res) => {
  const db = loadDB();
  res.json({ success: true, showcases: db.showcases });
});

app.get("/api/projects", (req, res) => {
  const db = loadDB();
  res.json({ success: true, showcases: db.showcases });
});

app.post("/api/projects/showcases", (req, res) => {
  const { title, description, publicationsMapped } = req.body;
  const db = loadDB();

  const newShowcase: ProjectShowcase = {
    id: "proj_" + Date.now(),
    userId: currentUserSession.id,
    ownerName: currentUserSession.name,
    institution: currentUserSession.institution,
    cropFocus: currentUserSession.cropFocus,
    title,
    description,
    showcaseStatus: true,
    doi: "10.5281/zenodo." + Math.floor(10000000 + Math.random() * 90000000),
    publicationsMapped: publicationsMapped || [],
    createdAt: new Date().toISOString()
  };

  db.showcases.push(newShowcase);
  saveDB(db);
  res.json({ success: true, showcase: newShowcase });
});

app.post("/api/projects", (req, res) => {
  const { title, description, publicationsMapped } = req.body;
  const db = loadDB();

  const newShowcase: ProjectShowcase = {
    id: "proj_" + Date.now(),
    userId: currentUserSession.id,
    ownerName: currentUserSession.name,
    institution: currentUserSession.institution,
    cropFocus: currentUserSession.cropFocus,
    title,
    description,
    showcaseStatus: true,
    doi: "10.5281/zenodo." + Math.floor(10000000 + Math.random() * 90000000),
    publicationsMapped: publicationsMapped || [],
    createdAt: new Date().toISOString()
  };

  db.showcases.push(newShowcase);
  saveDB(db);
  res.json({ success: true, showcase: newShowcase });
});

// Real Archive downloader - auto compiles a mockup README and triggers direct downloading!
app.get("/api/projects/:id/archive", (req, res) => {
  const { id } = req.params;
  const db = loadDB();

  const showcase = db.showcases.find((s: ProjectShowcase) => s.id === id) || defaultShowcase[0];

  res.setHeader("Content-Disposition", `attachment; filename=${showcase.id}_hackathon_archive.zip`);
  res.setHeader("Content-Type", "application/zip");

  // Since we cannot spawn archiver easily or safely without heavy requirements, let's serve a lightweight binary placeholder stream
  const mockZip = Buffer.from("PK\x03\x04\n\x00\x00\x00\x00\x00\x00\x00\x00\x00SUMMARY_README.md" +
    `\n# Crop Breeding Analysis Hub: ${showcase.title}\n\nGenerated: ${new Date().toISOString()}\nOwner: ${showcase.ownerName} (${showcase.institution})\nCrop Subject: ${showcase.cropFocus}\n\nAnalysis workflows executed:\n- Multi-environment rrBLUP predictive accuracy\n- Mixed-linear EMMAX association mappings (Chromosome 4 loci targets)\n- Population PCA structure corrections\n\nPlatform DOI Reserved: ${showcase.doi || "N/A"}\n\nCompiled by GenomeReady and APBA/ABI under BioCollaborator.`);
  res.send(mockZip);
});


// -------------------------------------------------------------
// VITE CLIENT INTEGRATOR / STATIC SERVERS
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
