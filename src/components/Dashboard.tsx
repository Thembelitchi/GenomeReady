import React from "react";
import { CheckCircle, Circle, ArrowRight, ShieldAlert, Laptop, Database, BookOpen, HeartHandshake, Award } from "lucide-react";
import { User, LectureModule } from "../types";

interface DashboardProps {
  currentUser: User;
  modules: LectureModule[];
  setActiveTab: (tab: string) => void;
  uploadsCount: number;
  runsCount: number;
}

export function Dashboard({ currentUser, modules, setActiveTab, uploadsCount, runsCount }: DashboardProps) {
  // Compute checklist triggers based on state metrics
  const envChecklistCompleted = currentUser.readinessScore > 30; // completed setup
  const dataChecklistCompleted = uploadsCount > 0;
  const lectureChecklistCompleted = modules.filter(m => m.status === "completed").length >= 2;
  const workflowChecklistCompleted = runsCount > 0;

  // Compute completed exercises
  const completedModulesCount = modules.filter(m => m.status === "completed").length;
  const totalModulesCount = modules.length;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#2C2C2C]">Welcome Back, {currentUser.name}!</h2>
          <p className="text-sm text-[#5A5A40] mt-1 font-sans font-medium">
            Ready to analyze <span className="text-[#D4A373] font-bold">{currentUser.cropFocus}</span> trial data at the 2026 APBA/ABI Companion Hub.
          </p>
          <p className="text-[11px] text-[#5A5A40]/80 font-mono mt-1">Institution: {currentUser.institution}</p>
        </div>
        <div className="bg-[#F5F5F0] border border-[#E6E6E0] px-5 py-3 rounded-2xl text-left md:text-right">
          <p className="text-[10px] text-[#5A5A40] font-bold tracking-wider font-mono">HACKATHON COMMENCES IN</p>
          <p className="text-base font-serif italic font-black text-[#D4A373]">12 Days (Oct 5, 2026)</p>
        </div>
      </div>

      {/* Main Stats Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Readiness Score Ring */}
        <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] shadow-sm flex flex-col items-center justify-between text-center min-h-[340px]">
          <div>
            <h3 className="text-sm font-bold font-sans text-[#5A5A40] uppercase tracking-widest">Readiness Score</h3>
            <p className="text-[11px] text-[#5A5A40]/80 mt-1">Target: 90+ for Hackathon Access</p>
          </div>

          <div className="relative flex items-center justify-center my-6">
            {/* SVG Progress Circle */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-[#F5F5F0] fill-none"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-[#D4A373] fill-none transition-all duration-500 ease-out"
                strokeWidth="12"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * currentUser.readinessScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-serif font-bold text-[#2C2C2C]">{currentUser.readinessScore}</span>
              <span className="text-[10px] text-[#5A5A40] uppercase font-bold tracking-widest mt-1">Points</span>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab("setup")}
            className="w-full bg-[#5A5A40] hover:bg-[#484833] text-white rounded-full font-semibold text-xs py-3 transition-colors shadow-sm"
          >
            Improve Score
          </button>
        </div>

        {/* Column 2: Onboarding Pre-Hackathon Checklist */}
        <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] shadow-sm col-span-1 lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#2C2C2C]">Pre-Hackathon Onboarding Milestones</h3>
            <p className="text-xs text-[#5A5A40] mt-1 font-medium">Ensure all boxes are green prior to Oct 5 to bypass registration delays.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Item 1 */}
            <div className="flex items-start gap-3 p-4 bg-[#F5F5F0] rounded-2xl border border-[#E6E6E0] hover:border-[#D4A373] transition-colors">
              {envChecklistCompleted ? (
                <CheckCircle className="h-5 w-5 text-[#839337] shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-[#5A5A40]/40 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#2C2C2C]">1. Setup Analysis Environment</p>
                <p className="text-[10px] text-[#5A5A40]/90 leading-relaxed">Download and run the Docker development engine container.</p>
                <button 
                  onClick={() => setActiveTab("setup")}
                  className="text-[10px] text-[#D4A373] hover:underline flex items-center gap-0.5 font-bold"
                >
                  Configure Workspace <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start gap-3 p-4 bg-[#F5F5F0] rounded-2xl border border-[#E6E6E0] hover:border-[#D4A373] transition-colors">
              {dataChecklistCompleted ? (
                <CheckCircle className="h-5 w-5 text-[#839337] shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-[#5A5A40]/40 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#2C2C2C]">2. Upload Genotypes & Traits</p>
                <p className="text-[10px] text-[#5A5A40]/90 leading-relaxed">Validate Crop VCF or CSV Phenotype data tables.</p>
                <button 
                  onClick={() => setActiveTab("validation")}
                  className="text-[10px] text-[#D4A373] hover:underline flex items-center gap-0.5 font-bold"
                >
                  Upload Dataset <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start gap-3 p-4 bg-[#F5F5F0] rounded-2xl border border-[#E6E6E0] hover:border-[#D4A373] transition-colors">
              {lectureChecklistCompleted ? (
                <CheckCircle className="h-5 w-5 text-[#839337] shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-[#5A5A40]/40 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#2C2C2C]">3. Pre-Exercise Lectures</p>
                <p className="text-[10px] text-[#5A5A40]/90 leading-relaxed">Complete pre-exercises mapped to academic modules.</p>
                <button 
                  onClick={() => setActiveTab("lectures")}
                  className="text-[10px] text-[#D4A373] hover:underline flex items-center gap-0.5 font-bold"
                >
                  Open Learning Portal <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-start gap-3 p-4 bg-[#F5F5F0] rounded-2xl border border-[#E6E6E0] hover:border-[#D4A373] transition-colors">
              {workflowChecklistCompleted ? (
                <CheckCircle className="h-5 w-5 text-[#839337] shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-[#5A5A40]/40 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#2C2C2C]">4. Run Breeding pipelines</p>
                <p className="text-[10px] text-[#5A5A40]/90 leading-relaxed">Practice GWAS, Genomic prediction models ahead of time.</p>
                <button 
                  onClick={() => setActiveTab("workflows")}
                  className="text-[10px] text-[#D4A373] hover:underline flex items-center gap-0.5 font-bold"
                >
                  Run Pipeline templates <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Lectures Progression Bar */}
      <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#2C2C2C]">Lecture Series Integration Progress</h3>
            <p className="text-xs text-[#5A5A40] mt-0.5 font-medium">Sequentially unlock and complete five foundational genomics modules.</p>
          </div>
          <span className="text-xs font-bold uppercase text-[#5A5A40] bg-[#CCD5AE]/30 px-3.5 py-1.5 rounded-full">
            {completedModulesCount} of {totalModulesCount} Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#F5F5F0] rounded-full h-3 overflow-hidden">
          <div 
            className="bg-[#839337] h-full rounded-full transition-all duration-500"
            style={{ width: `${(completedModulesCount / (totalModulesCount || 1)) * 100}%` }}
          />
        </div>

        {/* Mini Module Cards representing current course pathway */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {modules.map((m) => {
            const isCompleted = m.status === "completed";
            const isUnlocked = m.status === "unlocked" || isCompleted;

            return (
              <div 
                key={m.id} 
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all ${
                  isCompleted 
                    ? "bg-[#E9EDC9]/50 border-[#839337]" 
                    : isUnlocked 
                      ? "bg-white border-[#E6E6E0] hover:border-[#CCD5AE]" 
                      : "bg-[#F5F5F0]/60 border-[#E6E6E0] opacity-60"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono font-black text-[#5A5A40] bg-[#E9EDC9] px-1.5 py-0.5 rounded uppercase">Module {m.sequence}</span>
                    {isCompleted && (
                      <span className="text-[8px] text-[#839337] font-bold font-mono">COMPLETE</span>
                    )}
                    {isUnlocked && !isCompleted && (
                      <span className="text-[8px] text-[#D4A373] font-bold font-mono">RUNNING</span>
                    )}
                    {!isUnlocked && (
                      <span className="text-[8px] text-gray-400 font-bold font-mono">LOCKED</span>
                    )}
                  </div>
                  <h4 className="text-[11px] font-mono font-bold text-[#2C2C2C] line-clamp-2 leading-snug">{m.title}</h4>
                </div>
                {isUnlocked ? (
                  <button 
                    onClick={() => setActiveTab("lectures")}
                    className="text-[10px] text-[#5A5A40] hover:text-[#D4A373] font-bold hover:underline self-start flex items-center gap-0.5 mt-2"
                  >
                    View Class <ArrowRight className="h-3 w-3" />
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-400 mt-2">Finish prior module</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <button 
          onClick={() => setActiveTab("setup")}
          className="p-5 bg-white hover:bg-[#F5F5F0] border border-[#E6E6E0] rounded-[24px] flex items-center gap-4 transition-all text-left shadow-sm hover:translate-y-[-1px]"
        >
          <div className="bg-[#E9EDC9]/60 p-3 rounded-2xl text-[#5A5A40] shrink-0">
            <Laptop className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2C2C2C]">1. Setup Environment</h4>
            <p className="text-[10px] text-[#5A5A40]/80 mt-0.5">Instructions &amp; docker checks</p>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab("validation")}
          className="p-5 bg-white hover:bg-[#F5F5F0] border border-[#E6E6E0] rounded-[24px] flex items-center gap-4 transition-all text-left shadow-sm hover:translate-y-[-1px]"
        >
          <div className="bg-[#E9EDC9]/60 p-3 rounded-2xl text-[#5A5A40] shrink-0">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2C2C2C]">2. Validate Crop Data</h4>
            <p className="text-[10px] text-[#5A5A40]/80 mt-0.5">Upload VCF, run QC reports</p>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab("workflows")}
          className="p-5 bg-white hover:bg-[#F5F5F0] border border-[#E6E6E0] rounded-[24px] flex items-center gap-4 transition-all text-left shadow-sm hover:translate-y-[-1px]"
        >
          <div className="bg-[#E9EDC9]/60 p-3 rounded-2xl text-[#5A5A40] shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2C2C2C]">3. Run Pipelines</h4>
            <p className="text-[10px] text-[#5A5A40]/80 mt-0.5">GWAS EMMAX &amp; predictions</p>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab("tickets")}
          className="p-5 bg-white hover:bg-[#F5F5F0] border border-[#E6E6E0] rounded-[24px] flex items-center gap-4 transition-all text-left shadow-sm hover:translate-y-[-1px]"
        >
          <div className="bg-[#E9EDC9]/60 p-3 rounded-2xl text-[#5A5A40] shrink-0">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2C2C2C]">4. Ask a Mentor</h4>
            <p className="text-[10px] text-[#5A5A40]/80 mt-0.5">Get help on coding failures</p>
          </div>
        </button>

      </div>

      {/* Advisory Note */}
      <div className="bg-[#E9EDC9] rounded-[32px] p-6 border border-[#CCD5AE] flex items-center gap-6">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm shrink-0">⚠️</div>
        <div className="flex-1">
          <h4 className="font-bold text-[#5A5A40]">Data Validation Action Required</h4>
          <p className="text-sm text-[#5A5A40]/80">
            Ensure you have run clean genotype missingness checks (<span className="font-semibold text-[#5A5A40]">MAF &gt; 5%, missingness per sample/SNP &lt; 10%</span>) before traveling to UCT in October. High-bandwidth files (VCFs larger than 1.2GB) must be pre-pruned or pre-filtered using our companion tool.
          </p>
        </div>
        <button 
          onClick={() => setActiveTab("validation")}
          className="px-6 py-2 bg-white text-[#5A5A40] rounded-full font-bold text-sm border border-[#CCD5AE] hover:shadow-md transition-shadow shrink-0"
        >
          Fix Now
        </button>
      </div>

    </div>
  );
}
