import React, { useState, useEffect } from "react";
import { Terminal, Settings, Play, CheckCircle2, RefreshCw, ChevronRight, FileText, Download, Share2, Award } from "lucide-react";
import { Workflow, WorkflowRun, DataUpload } from "../types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";

interface WorkflowRunnerProps {
  workflows: Workflow[];
  uploads: DataUpload[];
  runs: WorkflowRun[];
  onAddRun: (run: WorkflowRun) => void;
}

export function WorkflowRunner({ workflows, uploads, runs, onAddRun }: WorkflowRunnerProps) {
  const [selectedWf, setSelectedWf] = useState<Workflow | null>(workflows && workflows.length > 0 ? workflows[0] : null);
  const [running, setRunning] = useState<boolean>(false);
  const [activeRun, setActiveRun] = useState<WorkflowRun | null>(null);

  // Synchronize state when workflows load asynchronously
  useEffect(() => {
    if (workflows && workflows.length > 0 && !selectedWf) {
      setSelectedWf(workflows[0]);
    }
  }, [workflows, selectedWf]);

  // Parameter states
  const [maf, setMaf] = useState<number>(0.05);
  const [missingness, setMissingness] = useState<number>(0.10);
  const [modelType, setModelType] = useState<string>("EMMAX");
  const [folds, setFolds] = useState<number>(5);
  const [kRangeEnd, setKRangeEnd] = useState<number>(6);

  if (!workflows || workflows.length === 0 || !selectedWf) {
    return (
      <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] shadow-sm text-center">
        <p className="text-sm font-semibold text-[#5A5A40]">No workflows catalogued. Please contact your administrator.</p>
      </div>
    );
  }

  // Execution triggers
  const executePipeline = async (type: "sample" | "mydata") => {
    setRunning(true);
    setActiveRun(null);

    const inputDataId = type === "sample" ? "up_sample_seed" : uploads[0]?.id || "up_sample_seed";
    const parameters = {
      maf,
      missingness,
      modelType,
      folds,
      kRangeEnd
    };

    // Post to Express backend to execute and log
    try {
      const response = await fetch(`/api/workflows/${selectedWf.id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputDataId,
          parameters
        })
      });
      const res = await response.json();
      if (res.success) {
        // Latency simulation for logs stream
        setTimeout(() => {
          onAddRun(res.run);
          setActiveRun(res.run);
          setRunning(false);
        }, 3000);
      }
    } catch (e) {
      console.error(e);
      setRunning(false);
    }
  };

  // Helper to compile Manhattan plot SVG data points
  // We'll generate realistic chromosome layout points
  const gwasData = [
    { snp: "rs1001", chr: 1, pos: 1000, value: 1.2 },
    { snp: "rs1002", chr: 1, pos: 5000, value: 2.1 },
    { snp: "rs1003", chr: 1, pos: 12000, value: 4.8 }, // peak 
    { snp: "rs2001", chr: 2, pos: 3000, value: 0.5 },
    { snp: "rs2002", chr: 2, pos: 9000, value: 2.9 },
    { snp: "rs3001", chr: 3, pos: 1000, value: 3.1 },
    { snp: "rs3002", chr: 3, pos: 7000, value: 1.8 },
    { snp: "rs4001", chr: 4, pos: 2000, value: 8.9 }, // Huge peak! drought candidate locus
    { snp: "rs4002", chr: 4, pos: 14000, value: 12.4 }, // SIGNIFICANT BONFERRONI Locus!
    { snp: "rs4003", chr: 4, pos: 18000, value: 5.5 },
    { snp: "rs5001", chr: 5, pos: 5000, value: 2.4 },
    { snp: "rs6001", chr: 6, pos: 8000, value: 1.9 },
    { snp: "rs7001", chr: 7, pos: 11000, value: 4.1 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Intro info banner */}
      <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#2C2C2C]">🌾 APBA/ABI Pipeline Workflows</h2>
          <p className="text-xs text-[#5A5A40] mt-1.5 max-w-xl font-medium leading-relaxed">
            Execute high-performance quantitative genetics pipelines in real-time. Avoid manual CLI scripts – configure sliders, initiate container execution, and visualize output plots.
          </p>
        </div>
        <span className="text-xs bg-[#F5F5F0] text-[#5A5A40] px-4 py-2 rounded-xl border border-[#CCD5AE] font-mono font-bold self-start md:self-auto shadow-inner">
          Backend Node: AWS Cape Town EC2
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Selected workflow overview & parameter sliders */}
        <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-5">
            
            {/* Pipeline Selector buttons */}
            <div>
              <h3 className="text-xs font-bold font-mono text-[#5A5A40] uppercase tracking-widest mb-3 px-1">Select Pipeline</h3>
              <div className="space-y-2.5">
                {workflows.map((wf) => (
                  <button
                    key={wf.id}
                    onClick={() => {
                      setSelectedWf(wf);
                      setActiveRun(runs.find(r => r.workflowId === wf.id) || null);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedWf.id === wf.id
                        ? "bg-[#E9EDC9]/60 border-[#839337] shadow-sm"
                        : "bg-white border-[#E6E6E0] text-[#5A5A40] hover:bg-[#F5F5F0]"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-[#2C2C2C]">{wf.name}</p>
                      <p className="text-[10px] text-[#5A5A40]/80 font-mono mt-0.5 font-bold uppercase">{wf.category}</p>
                    </div>
                    <ChevronRight className={`h-4.5 w-4.5 ${selectedWf.id === wf.id ? "text-[#839337]" : "text-[#CCD5AE]"}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Config Sliders */}
            <div className="border-t border-[#E6E6E0] pt-4 space-y-4">
              <h4 className="text-xs font-bold font-sans text-[#2C2C2C] flex items-center gap-1.5 uppercase tracking-wider">
                <Settings className="h-4.5 w-4.5 text-[#5A5A40]" />
                Pipeline Parameters
              </h4>

              {/* Genotype parameters (MAF, missingness) for GWAS / Population */}
              {selectedWf.category !== "Genomic Selection" && (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between items-center text-[#5A5A40] font-mono text-[10px] mb-1 font-semibold">
                      <span>MAF threshold</span>
                      <span className="text-[#839337] font-bold">{maf}</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.2"
                      step="0.01"
                      value={maf}
                      onChange={(e) => setMaf(parseFloat(e.target.value))}
                      className="w-full accent-[#5A5A40]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[#5A5A40] font-mono text-[10px] mb-1 font-semibold">
                      <span>Max Missingness per locus</span>
                      <span className="text-[#839337] font-bold">{missingness * 100}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.02"
                      max="0.2"
                      step="0.01"
                      value={missingness}
                      onChange={(e) => setMissingness(parseFloat(e.target.value))}
                      className="w-full accent-[#5A5A40]"
                    />
                  </div>
                </div>
              )}

              {/* Model selection for GWAS */}
              {selectedWf.category === "GWAS" && (
                <div className="space-y-1.5 text-xs">
                  <label className="text-[10px] font-mono text-[#5A5A40] uppercase font-semibold">Analysis Mixed Model</label>
                  <select 
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value)}
                    className="w-full bg-[#F5F5F0] border border-[#CCD5AE] text-[#3D3D33] font-mono text-xs rounded-xl p-2.5 outline-none focus:border-[#5A5A40]"
                  >
                    <option value="EMMAX">EMMAX (Fast Mixed Model LMM)</option>
                    <option value="GEMMA">GEMMA (Multivariate LMM Solver)</option>
                    <option value="GAPIT_MLM">GAPIT MLM (vanRaden Realized matrix)</option>
                  </select>
                </div>
              )}

              {/* Folds parameters for Genomic selection */}
              {selectedWf.category === "Genomic Selection" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between items-center text-[#5A5A40] font-mono text-[10px] mb-1 font-semibold">
                      <span>Cross-validation Folds</span>
                      <span className="text-[#839337] font-bold">{folds}-Fold</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="10"
                      step="1"
                      value={folds}
                      onChange={(e) => setFolds(parseInt(e.target.value))}
                      className="w-full accent-[#5A5A40]"
                    />
                  </div>
                </div>
              )}

              {/* fastSTRUCTURE sweep K parameters */}
              {selectedWf.category === "Population Structure" && (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[#5A5A40] font-mono text-[10px] mb-1 font-semibold">
                    <span>Ancestry clusters range</span>
                    <span className="text-[#839337] font-bold">K=2 to K={kRangeEnd}</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="1"
                    value={kRangeEnd}
                    onChange={(e) => setKRangeEnd(parseInt(e.target.value))}
                    className="w-full accent-[#5A5A40]"
                  />
                </div>
              )}

            </div>
          </div>

          {/* Core Run Commands */}
          <div className="space-y-2 pt-4 border-t border-[#E6E6E0]">
            <button
              onClick={() => executePipeline("sample")}
              disabled={running}
              className="w-full bg-white hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#CCD5AE] font-bold text-xs py-2.5 rounded-full shadow-sm transition-all"
            >
              Run on Included Sample Data
            </button>
            <button
              onClick={() => executePipeline("mydata")}
              disabled={running || uploads.length === 0}
              className="w-full bg-[#5A5A40] hover:bg-[#484833] disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold text-xs py-3 rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              {running ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Pipeline running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Run on My Uploaded Data
                </>
              )}
            </button>
            {uploads.length === 0 && (
              <p className="text-[10px] text-[#D4A373] bg-[#FEF6E4] leading-normal text-center p-2.5 rounded-xl border border-[#E6E6E0] font-semibold">
                ⚠️ Upload your own VCF dataset in the "Data QC" tab first to enable direct execution on your data.
              </p>
            )}
          </div>

        </div>

        {/* Runtime log output terminal & resulting genetic plots */}
        <div className="lg:col-span-2 bg-white border border-[#E6E6E0] p-8 rounded-[32px] space-y-6 flex flex-col justify-between shadow-sm">
          
          {/* Output Terminal Console */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-sans text-[#5A5A40] uppercase tracking-widest flex items-center gap-2">
              🌾 Runtime Pipeline Execution Logs
            </h3>

            <div className="bg-[#F5F5F0] border border-[#CCD5AE] p-4 rounded-2xl font-mono text-[11px] leading-relaxed select-text min-h-[170px] max-h-[170px] overflow-y-auto text-[#2C2C2C] shadow-inner">
              {running && (
                <div className="space-y-1.5 animate-pulse">
                  <p className="text-[#839337] font-bold">[SPAWN] Initializing Snakemake orchestrator container...</p>
                  <p className="text-[#5A5A40]">[INFO] Mapping input data files: {selectedWf.sampleDataUrl}</p>
                  <p className="text-[#5A5A40]">[INFO] Sweeping variant configurations...</p>
                  <p className="text-[#5A5A40]">[PLINK] Executing genotype quality thresholds...</p>
                  <p className="text-[#5A5A40]">[EMMAX] Regressing phenotypes against markers kinship covariates...</p>
                </div>
              )}
              {!running && activeRun && (
                <div className="space-y-1.5 font-medium">
                  {activeRun.logs.map((log, idx) => (
                    <p key={idx} className={log.includes("[ERROR]") ? "text-[#D4A373] font-bold" : log.includes("✔") ? "text-[#839337] font-bold" : "text-[#5A5A40]"}>
                      {log}
                    </p>
                  ))}
                </div>
              )}
              {!running && !activeRun && (
                <p className="text-[#5A5A40]/60 italic text-center pt-10 font-sans font-semibold">Terminal inactive. Configure parameters and activate pipeline.</p>
              )}
            </div>
          </div>

          {/* Genetic Result visualizations section */}
          <div className="bg-[#F5F5F0] border border-[#CCD5AE] p-5 rounded-2xl min-h-[290px] flex flex-col justify-center shadow-inner">
            {running && (
              <div className="flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="h-9 w-9 animate-spin text-[#839337]" />
                <p className="text-xs font-sans text-[#5A5A40] font-bold animate-pulse">Crunching genomic parameters inside container...</p>
              </div>
            )}
            {!running && !activeRun && (
              <p className="text-[#5A5A40]/70 text-xs text-center font-sans font-semibold leading-relaxed">Pipeline execution results will plot dynamically here upon completion.</p>
            )}
            {!running && activeRun && (
              <div className="space-y-4 text-left">
                
                {/* Result header navigation options */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-[#CCD5AE]">
                  <div>
                    <h4 className="text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">Execution Output Files</h4>
                    <p className="text-[10px] text-[#5A5A40] font-semibold">Completed in {selectedWf.durationSec}s</p>
                  </div>
                  <div className="flex gap-2 text-[10px] font-mono">
                    <button className="flex items-center gap-1 bg-white border border-[#CCD5AE] hover:bg-[#FDFCF9] font-bold text-[#5A5A40] py-1.5 px-3 rounded-xl shadow-sm transition-all scale-95">
                      <Download className="h-3.5 w-3.5" /> Export Peak CSV
                    </button>
                    <button className="flex items-center gap-1 bg-white border border-[#CCD5AE] hover:bg-[#FDFCF9] font-bold text-[#5A5A40] py-1.5 px-3 rounded-xl shadow-sm transition-all scale-95">
                      <Share2 className="h-3.5 w-3.5" /> Share with mentor
                    </button>
                  </div>
                </div>

                {/* Plot 1: GWAS Manhattan scatter layout */}
                {selectedWf.category === "GWAS" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-sans font-semibold text-[#5A5A40]">
                      <span>MANHATTAN PLOT: Loci peak targeting Chromosome 4</span>
                      <span className="text-[#D4A373] font-bold">Bonferroni Limit (P &lt; 1e-8)</span>
                    </div>

                    {/* Manhattan custom chart */}
                    <div className="h-44 w-full text-[10px] font-mono bg-white rounded-xl p-2 border border-[#E6E6E0]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={gwasData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E0" />
                          <XAxis dataKey="chr" stroke="#5A5A40" label={{ value: 'Chromosome Sequence', position: 'insideBottom', offset: -5, fill: "#5A5A40" }} />
                          <YAxis stroke="#5A5A40" label={{ value: '-log10(p-value)', angle: -90, position: 'insideLeft', fill: "#5A5A40" }} />
                          <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E6E6E0" }} />
                          <Line type="monotone" dataKey="value" stroke="#D4A373" strokeWidth={0} dot={{ r: 4, fill: "#839337", strokeWidth: 1 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Table of significant alleles */}
                    <div className="bg-white border border-[#E6E6E0] rounded-xl max-h-[140px] overflow-y-auto shadow-sm">
                      <table className="w-full text-left text-[11px] font-mono">
                        <thead className="bg-[#F5F5F0] text-[#5A5A40] font-bold uppercase text-[9px] tracking-wider sticky top-0 border-b border-[#E6E6E0]">
                          <tr>
                            <th className="p-2">SNP ID</th>
                            <th className="p-2">Chr</th>
                            <th className="p-2">Position</th>
                            <th className="p-2">p-value</th>
                            <th className="p-2">Inference</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6E6E0] text-[#3D3D33] font-semibold">
                          {activeRun.results?.gwasSnps?.map((snp, id) => (
                            <tr key={id} className={snp.pvalue < 1e-8 ? "bg-[#E9EDC9]/60 text-[#839337]" : ""}>
                              <td className="p-2 font-bold">{snp.snpId}</td>
                              <td className="p-2">{snp.chr}</td>
                              <td className="p-2">{snp.pos.toLocaleString()}</td>
                              <td className="p-2">{snp.pvalue.toExponential(2)}</td>
                              <td className="p-2 text-[10px]">
                                {snp.pvalue < 1e-8 ? "★ HIGHLY SIGNIFICANT" : "Suggestive"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Plot 2: rrBLUP predictive accuracies */}
                {selectedWf.category === "Genomic Selection" && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-mono text-[#5A5A40] uppercase tracking-widest font-semibold">5-Fold Ridge Regression prediction accuracy (r scores)</p>
                    
                    <div className="h-44 w-full text-[10px] font-mono bg-white p-2 rounded-xl border border-[#E6E6E0]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activeRun.results?.selectionAccuracy}>
                          <XAxis dataKey="fold" stroke="#5A5A40" label={{ value: "Fold Partition" }} />
                          <YAxis stroke="#5A5A40" domain={[0, 1]} />
                          <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E6E6E0" }} />
                          <Bar dataKey="accuracy" fill="#839337" radius={[4, 4, 0, 0]} label={{ position: 'top', fill: '#5A5A40' }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-[#E9EDC9] border border-[#CCD5AE] p-4 rounded-2xl flex items-center gap-3">
                      <Award className="h-6 w-6 text-[#839337] shrink-0" />
                      <div className="text-xs">
                        <p className="font-bold text-[#2C2C2C]">Realized Marker Heritability (h²): 0.45</p>
                        <p className="text-[11px] text-[#5A5A40] mt-0.5 font-medium leading-relaxed">Average target prediction accuracy r=0.59 demonstrates solid capability to pre-score segregating lines prior to field planting.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Plot 3: fastSTRUCTURE Ancestral structure bar rows */}
                {selectedWf.category === "Population Structure" && (
                  <div className="space-y-4 text-center">
                    <div className="flex justify-between items-center text-[10px] font-sans font-semibold text-[#5A5A40]">
                      <span>Ancestry Fraction Q-Matrix (Swiped at optimal K=4)</span>
                      <span className="font-bold text-[#839337]">K=4 clusters optimal</span>
                    </div>

                    {/* Bar stacking visual representation */}
                    <div className="h-14 w-full flex rounded-xl overflow-hidden border border-[#CCD5AE] font-mono text-[9px] text-white shadow-sm font-bold">
                      <div className="bg-[#839337] flex items-center justify-center p-1" style={{ width: "32%" }}>Cluster 1</div>
                      <div className="bg-[#D4A373] flex items-center justify-center p-1" style={{ width: "26%" }}>Cluster 2</div>
                      <div className="bg-[#5A5A40] flex items-center justify-center p-1" style={{ width: "24%" }}>Cluster 3</div>
                      <div className="bg-[#BBA580] flex items-center justify-center p-1" style={{ width: "18%" }}>Cluster 4</div>
                    </div>

                    <p className="text-[11px] text-[#5A5A40] leading-relaxed text-left font-medium">
                      Structure evaluations reveal distinctive genetic lineages corresponding precisely to geographical crop zones. These four covariate indices should accompany your final GWAS fixed model equations.
                    </p>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
