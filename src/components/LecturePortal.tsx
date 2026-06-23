import React, { useState, useEffect } from "react";
import { GraduationCap, Play, Lock, CheckCircle2, ChevronRight, FileCode, RefreshCw, Save, ArrowRight, HelpCircle } from "lucide-react";
import { User, LectureModule, NotebookCell } from "../types";

interface LecturePortalProps {
  currentUser: User;
  modules: LectureModule[];
  onCompleteModule: (moduleId: string, status: "locked" | "unlocked" | "completed", progressPercent: number, cells: NotebookCell[]) => void;
  onResetModule: (moduleId: string) => void;
}

export function LecturePortal({ currentUser, modules, onCompleteModule, onResetModule }: LecturePortalProps) {
  const [activeModule, setActiveModule] = useState<LectureModule | null>(modules && modules.length > 0 ? modules[0] : null);
  const [notebookCells, setNotebookCells] = useState<NotebookCell[]>(modules && modules.length > 0 && modules[0] ? (modules[0].notebookCells || []) : []);
  const [activeCellId, setActiveCellId] = useState<string | null>(null);
  const [executingCellId, setExecutingCellId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>("");

  // Synchronize state when modules prop loads asynchronously
  useEffect(() => {
    if (modules && modules.length > 0) {
      if (!activeModule) {
        const firstMod = modules[0];
        setActiveModule(firstMod);
        setNotebookCells(firstMod.notebookCells || []);
        setActiveVideoUrl(firstMod.lectureUrls && firstMod.lectureUrls.length > 0 ? firstMod.lectureUrls[0] : firstMod.lectureUrl);
      } else {
        const found = modules.find(m => m.id === activeModule.id);
        if (found) {
          // Keep internal state updated if lecture progress changes
          setActiveModule(found);
          setNotebookCells(found.notebookCells || []);
          // Only update active video if it's currently empty or doesn't belong to the found module
          const belongs = found.lectureUrls ? found.lectureUrls.includes(activeVideoUrl) : (found.lectureUrl === activeVideoUrl);
          if (!activeVideoUrl || !belongs) {
            setActiveVideoUrl(found.lectureUrls && found.lectureUrls.length > 0 ? found.lectureUrls[0] : found.lectureUrl);
          }
        }
      }
    }
  }, [modules, activeModule?.id]);

  if (!modules || modules.length === 0 || !activeModule) {
    return (
      <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] shadow-sm text-center">
        <p className="text-sm font-semibold text-[#5A5A40]">No academic modules catalogued. Please contact your administrator.</p>
      </div>
    );
  }

  // Switch modules internally
  const selectModule = (m: LectureModule) => {
    setActiveModule(m);
    setNotebookCells(m.notebookCells || []);
    setActiveCellId(null);
    setActiveVideoUrl(m.lectureUrls && m.lectureUrls.length > 0 ? m.lectureUrls[0] : m.lectureUrl);
  };

  // Run Jupyter cell simulation
  const runCell = (cellId: string) => {
    setExecutingCellId(cellId);
    
    setTimeout(() => {
      // Find the cell state
      setNotebookCells(prev => prev.map(c => {
        if (c.id === cellId) {
          // Execute code printouts based on our seed database patterns
          let finalOutput = c.output || "";
          if (c.content.includes("M[1:6, 1:8]")) {
            finalOutput = "            SNP_Marker 1 SNP_Marker 2 SNP_Marker 3 SNP_Marker 4 SNP_Marker 5 SNP_Marker 6\nSample 1            0            2            1            0            1            2\nSample 2            2            1            1            0            2            0\nSample 3            1            0            0            2            1            1\nSample 4            0            1            2            1            0            2\nSample 5            2            2            1            0            1            1\nSample 6            1            0            2            1            2            0";
          } else if (c.content.includes("diag(G)")) {
            finalOutput = "Sample 1 Sample 2 Sample 3 Sample 4 Sample 5\n1.048    0.985    1.012    0.973    1.032 \n[INFO] Realized kinship diagonal indicates self-variance represents expected model parameters.";
          }
          return {
            ...c,
            isExecuted: true,
            output: finalOutput || "Execution successful! Output generated on server."
          };
        }
        return c;
      }));
      setExecutingCellId(null);
    }, 1200);
  };

  // Edit cell value on keyboard inputs
  const handleCellEdit = (cellId: string, val: string) => {
    setNotebookCells(prev => prev.map(c => {
      if (c.id === cellId) {
        return { ...c, content: val, isExecuted: false };
      }
      return c;
    }));
  };

  // Submit hand-in exercises to mentors
  const handleNotebookSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      // Update module in database state
      onCompleteModule(activeModule.id, "completed", 100, notebookCells);
      
      // Update active local state representation
      setActiveModule({
        ...activeModule,
        status: "completed",
        progressPercent: 100
      });

      setSubmitting(false);
      alert(`Jupyter Notebook (${activeModule.exerciseNotebookUrl}) Submitted successfully for mentor evaluation! +10 score points awarded.`);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Upper header */}
      <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-[#5A5A40]" />
          APBA/ABI Lectures &amp; Pre-Exercises
        </h2>
        <p className="text-xs text-[#5A5A40] mt-1.5 max-w-3xl font-medium leading-relaxed">
          Follow the pre-hackathon curriculum chronologically. Study interactive slide decks, watch recorded lecture feeds, and complete the Jupyter Notebook exercises below to prepare your baseline metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar Module selectors */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold font-mono text-[#5A5A40] uppercase tracking-widest px-1">Curriculum Roadmap</h3>
          <div className="space-y-2.5">
            {modules.map((m) => {
              const isCompleted = m.status === "completed";
              const isUnlocked = m.status === "unlocked" || isCompleted;
              const isActive = activeModule.id === m.id;

              return (
                <button
                  key={m.id}
                  disabled={!isUnlocked}
                  onClick={() => selectModule(m)}
                  className={`w-full p-4 border rounded-xl text-left transition-all flex items-center justify-between ${
                    isActive 
                      ? "bg-[#E9EDC9]/60 border-[#839337] text-[#2C2C2C] shadow-sm font-semibold"
                      : isUnlocked 
                        ? "bg-white border-[#E6E6E0] text-[#5A5A40] hover:bg-[#F5F5F0]" 
                        : "bg-gray-50 border-gray-150 text-gray-300 cursor-not-allowed opacity-60"
                  }`}
                >
                  <div className="space-y-0.5 max-w-[80%]">
                    <span className="text-[9px] font-mono font-bold uppercase block text-[#5A5A40]/80">Module {m.sequence}</span>
                    <p className="text-xs font-bold truncate">{m.title}</p>
                  </div>
                  {isCompleted ? (
                    <span className="h-5.5 w-5.5 bg-[#E9EDC9] rounded-full border border-[#CCD5AE] flex items-center justify-center text-[#839337] text-[10px] font-bold">✓</span>
                  ) : !isUnlocked ? (
                    <Lock className="h-4 w-4 text-gray-300" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-[#D4A373] animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Module Resources & Jupyter workspace */}
        <div className="lg:col-span-3 bg-white border border-[#E6E6E0] p-8 rounded-[32px] space-y-6 shadow-sm">
          
          {/* Module Title / Description row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6E6E0] pb-5">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#839337] uppercase tracking-wider block">Academic Syllabus</span>
              <h3 className="text-lg font-serif font-bold text-[#2C2C2C] mt-0.5">{activeModule.title}</h3>
              <p className="text-xs text-[#5A5A40] mt-1 font-medium">{activeModule.description}</p>
            </div>
            
            <span className={`text-xs px-3.5 py-1.5 rounded-full font-sans font-bold self-start md:self-auto ${
              activeModule.status === "completed" 
                ? "bg-[#E9EDC9] text-[#839337] border border-[#CCD5AE]" 
                : "bg-[#FEF6E4] text-[#D4A373] border border-[#E6E6E0]"
            }`}>
              {activeModule.status === "completed" ? "✓ Module Completed" : "Under review"}
            </span>
          </div>

          {/* References & Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Embedded Lecture Recording player mockup */}
            <div className="bg-[#F5F5F0] border border-[#CCD5AE] rounded-2xl p-5 space-y-3.5 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CCD5AE]/40 pb-2">
                <h4 className="text-xs font-serif font-bold text-[#2C2C2C]">Official Lecture Video</h4>
                {activeModule.lectureUrls && activeModule.lectureUrls.length > 1 && (
                  <div className="flex flex-wrap gap-1">
                    {activeModule.lectureUrls.map((_, vidx) => (
                      <button
                        key={vidx}
                        onClick={() => setActiveVideoUrl(activeModule.lectureUrls![vidx])}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold transition-all cursor-pointer ${
                          activeVideoUrl === activeModule.lectureUrls![vidx]
                            ? "bg-[#839337] text-white shadow-sm"
                            : "bg-white text-[#5A5A40] border border-[#CCD5AE]/60 hover:bg-[#F5F5F0]"
                        }`}
                      >
                        Part {vidx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative rounded-xl overflow-hidden bg-white h-40 flex items-center justify-center border border-[#E6E6E0]">
                <iframe
                  className="w-full h-full"
                  src={activeVideoUrl || activeModule.lectureUrl}
                  title="Lecture Video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Slides & literature documents list */}
            <div className="bg-[#F5F5F0] border border-[#CCD5AE] rounded-2xl p-5 space-y-4 shadow-inner">
              <h4 className="text-xs font-serif font-bold text-[#2C2C2C]">Module Material &amp; Reading List</h4>
              
              <div className="space-y-3.5 text-xs pl-1 text-[#3D3D33] font-medium leading-relaxed">
                {activeModule.readList.map((book, id) => {
                  const urlRegex = /(https?:\/\/[^\s\)]+)/g;
                  const parts = book.split(urlRegex);
                  return (
                    <div key={id} className="flex items-start gap-1.5">
                      <span className="text-[#839337] shrink-0 select-none">●</span>
                      <div className="font-sans italic">
                        {parts.map((part, index) => {
                          if (part.match(/^https?:\/\//)) {
                            return (
                              <a
                                key={index}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#839337] font-bold hover:underline hover:text-[#5A5A40] ml-1 inline-flex items-center gap-0.5"
                              >
                                [Access Training Material]
                              </a>
                            );
                          }
                          return part;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2.5 border-t border-[#CCD5AE] flex justify-between items-center">
                <a
                  href={activeModule.slidesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold font-sans text-[#839337] hover:text-[#5A5A40] transition-colors hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Download Lectures Slides.pdf
                </a>
              </div>
            </div>

          </div>

          {/* Jupyter Notebook Environment Area */}
          <div className="border border-[#CCD5AE] rounded-2xl overflow-hidden bg-white shadow-sm">
            
            {/* Jupyter header ribbon */}
            <div className="bg-[#F5F5F0] border-b border-[#CCD5AE] px-5 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-[#D4A373]" />
                <span className="text-[#2C2C2C] font-bold">{activeModule.exerciseNotebookUrl}</span>
                <span className="text-[10px] bg-white text-[#5A5A40] border border-[#CCD5AE] px-2 py-0.5 rounded font-bold">Kernel: R 4.4 Realized Matrix</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                {showResetConfirm ? (
                  <div className="flex items-center gap-1 bg-[#FEF6E4] border border-[#CCD5AE] px-2.5 py-1 rounded-lg">
                    <span className="text-xs font-bold text-[#D4A373]">Reset cells?</span>
                    <button
                      onClick={() => {
                        onResetModule(activeModule.id);
                        setNotebookCells(modules.find(m => m.id === activeModule.id)?.notebookCells || []);
                        setShowResetConfirm(false);
                      }}
                      className="bg-[#D4A373] hover:bg-[#b58353] text-white font-bold px-2 py-1 rounded text-[9px] transition-colors"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="bg-white hover:bg-gray-150 text-gray-700 border border-gray-300 font-bold px-2 py-1 rounded text-[9px] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowResetConfirm(true);
                    }}
                    className="bg-white border border-[#CCD5AE] hover:bg-[#FDFCF9] text-[#5A5A40] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Reload Template
                  </button>
                )}
                <button
                  disabled={submitting}
                  onClick={handleNotebookSubmit}
                  className="bg-[#5A5A40] hover:bg-[#484833] disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                >
                  {submitting ? "Submitting..." : "Submit to Mentor"}
                </button>
              </div>
            </div>

            {/* Jupyter Notebook Cells Body */}
            <div className="p-5 space-y-5 max-h-[450px] overflow-y-auto bg-white">
              {notebookCells.map((cell, idx) => {
                const isActive = activeCellId === cell.id;
                const isCode = cell.type === "code";

                return (
                  <div
                    key={cell.id}
                    onClick={() => setActiveCellId(cell.id)}
                    className={`border rounded-xl overflow-hidden transition-all text-left bg-[#F5F5F0] ${
                      isActive 
                        ? "border-[#839337] ring-1 ring-[#839337] shadow-sm" 
                        : "border-[#E6E6E0]"
                    }`}
                  >
                    
                    {/* Cell title tag */}
                    <div className="bg-white px-4 py-2.5 flex justify-between items-center text-[10px] font-mono border-b border-[#CCD5AE] text-[#5A5A40]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase text-[9px] tracking-wider">{cell.type} cell</span>
                        {isCode && (
                          <span className="text-[#839337] font-bold">
                            In [{cell.isExecuted ? idx + 1 : " "}]
                          </span>
                        )}
                      </div>
                      {isCode && (
                        <button
                          disabled={executingCellId === cell.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            runCell(cell.id);
                          }}
                          className="bg-[#5A5A40] hover:bg-[#484833] text-white px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 text-[9px] font-bold shadow-sm"
                        >
                          {executingCellId === cell.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin text-white" />
                          ) : (
                            <Play className="h-3 w-3 text-white" />
                          )}
                          Execute
                        </button>
                      )}
                    </div>

                    {/* Cell Editor Text area */}
                    <div className="p-4 bg-[#F5F5F0] font-mono text-xs focus-within:outline-none">
                      {isCode ? (
                        <textarea
                          value={cell.content}
                          onChange={(e) => handleCellEdit(cell.id, e.target.value)}
                          className="w-full bg-transparent text-[#2C2C2C] focus:outline-none font-mono text-[11px] leading-relaxed resize-none h-24 font-bold"
                          style={{ tabSize: 2 }}
                        />
                      ) : (
                        <div className="prose text-[#3D3D33] font-sans text-xs whitespace-pre-wrap leading-relaxed outline-none font-medium">
                          {cell.content}
                        </div>
                      )}
                    </div>

                    {/* Code Results stdout output area */}
                    {isCode && cell.output && (
                      <div className="bg-white text-[10px] font-mono p-4 leading-loose border-t border-[#CCD5AE] text-[#3D3D33] font-semibold overflow-x-auto whitespace-pre-wrap select-all">
                        <span className="text-[9px] font-bold text-[#5A5A40] uppercase font-mono block mb-1">Standard Console Output:</span>
                        {cell.output}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
