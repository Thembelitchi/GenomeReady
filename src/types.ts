export enum UserRole {
  PARTICIPANT = "participant",
  MENTOR = "mentor",
  ORGANIZER = "organizer"
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institution: string;
  country: string;
  cropFocus: string;
  rLevel: "Beginner" | "Intermediate" | "Advanced";
  pythonLevel: "Beginner" | "Intermediate" | "Advanced";
  unixLevel: "Beginner" | "Intermediate" | "Advanced";
  readinessScore: number;
  createdAt: string;
}

export interface Cohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed";
}

export interface DataUpload {
  id: string;
  userId: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadStatus: "uploading" | "completed" | "error";
  qcReportJson?: QCReport;
  createdAt: string;
}

export interface QCReport {
  samplesCount: number;
  snpsCount: number;
  missingnessRate: number;
  passedCount: number;
  mafDistribution: { range: string; count: number }[];
  hwePvalues: { range: string; count: number }[];
  phenotypeStats: {
    name: string;
    mean: number;
    sd: number;
    missingCount: number;
    distribution: { value: string; count: number }[];
  };
  pcaPoints?: { pc1: number; pc2: number; sampleId: string; group: string }[];
  readinessContribution: number;
  recommendations: string[];
}

export interface NotebookCell {
  id: string;
  type: "markdown" | "code";
  content: string;
  output?: string;
  isExecuted?: boolean;
}

export interface LectureModule {
  id: string;
  title: string;
  sequence: number;
  description: string;
  lectureUrl: string;
  lectureUrls?: string[];
  slidesUrl: string;
  readList: string[];
  exerciseNotebookUrl: string;
  status: "locked" | "unlocked" | "completed";
  notebookCells: NotebookCell[];
  progressPercent: number;
}

export interface ModuleProgress {
  userId: string;
  moduleId: string;
  status: "locked" | "unlocked" | "completed";
  completedAt?: string;
  savedNotebookCells?: NotebookCell[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: "GWAS" | "Genomic Selection" | "Population Structure";
  dockerImage: string;
  sampleDataUrl: string;
  readmeUrl: string;
  status: "stable" | "beta";
  durationSec: number;
}

export interface WorkflowRun {
  id: string;
  userId: string;
  workflowId: string;
  inputDataId: string;
  status: "pending" | "running" | "completed" | "failed";
  outputUrl?: string;
  startedAt: string;
  completedAt?: string;
  parameters: Record<string, string | number | boolean>;
  logs: string[];
  results?: {
    gwasSnps?: { snpId: string; chr: number; pos: number; pvalue: number }[];
    selectionAccuracy?: { fold: number; accuracy: number; heritability: number }[];
    optimalK?: number;
    pcaUrl?: string;
  };
}

export interface TicketComment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  text: string;
  createdAt: string;
}

export interface HelpTicket {
  id: string;
  userId: string;
  userName: string;
  userInstitution: string;
  category: "setup" | "data" | "analysis" | "interpretation";
  description: string;
  status: "open" | "assigned" | "resolved";
  mentorId?: string;
  mentorResponse?: string;
  comments: TicketComment[];
  createdAt: string;
  resolvedAt?: string;
  faqAdded?: boolean;
}

export interface ProjectShowcase {
  id: string;
  userId: string;
  ownerName: string;
  institution: string;
  cropFocus: string;
  title: string;
  description: string;
  archiveUrl?: string;
  showcaseStatus: boolean;
  createdAt: string;
  doi?: string;
  publicationsMapped?: string[];
}
