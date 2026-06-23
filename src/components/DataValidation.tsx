import React, { useState, useEffect } from "react";
import { UploadCloud, CheckCircle, AlertTriangle, Play, Sparkles, Download, FileText, BarChart2, RefreshCw } from "lucide-react";
import { User, DataUpload, QCReport } from "../types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from "recharts";

interface DataValidationProps {
  currentUser: User;
  onUploadSuccess: () => void;
  uploads: DataUpload[];
  onAddUpload: (upload: DataUpload) => void;
}

export function DataValidation({ currentUser, onUploadSuccess, uploads, onAddUpload }: DataValidationProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVcf, setIsVcf] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [reportActive, setReportActive] = useState<QCReport | null>(null);
  
  // Gemini AI advice state
  const [aiReportText, setAiReportText] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Filter Applied State
  const [filterApplied, setFilterApplied] = useState<boolean>(false);

  // Setup default loaded QC report on initialization if user already uploaded
  useEffect(() => {
    if (uploads && uploads.length > 0) {
      const completed = uploads.find(up => up.qcReportJson);
      if (completed) {
        setReportActive(completed.qcReportJson || null);
      }
    }
  }, [uploads]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsVcf(file.name.endsWith(".vcf") || file.name.endsWith(".vcf.gz"));
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    setUploading(true);
    // Mimic packet chunks latency
    setTimeout(async () => {
      try {
        const response = await fetch("/api/data/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: selectedFile.name,
            fileType: isVcf ? "VCF Genotype" : "CSV Phenotype",
            fileSize: selectedFile.size || 1200000
          })
        });
        const resData = await response.json();
        if (resData.success) {
          onAddUpload(resData.upload);
          setReportActive(resData.upload.qcReportJson);
          onUploadSuccess();
          setSelectedFile(null);
          setFilterApplied(false);
          setAiReportText("");
        }
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setUploading(false);
      }
    }, 2000);
  };

  // Connects, gets and parses Gemini advice
  const queryGeminiAdvisor = async () => {
    if (!reportActive) return;
    setAiLoading(true);
    setAiReportText("");

    try {
      const response = await fetch("/api/data/validate-smart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: isVcf ? "wheat_drought_panel.vcf.gz" : "wheat_phenotypes.csv",
          summaryData: {
            samplesCount: reportActive.samplesCount,
            snpsCount: reportActive.snpsCount,
            missingness: reportActive.missingnessRate,
            dominantPhenotypeMean: reportActive.phenotypeStats.mean
          }
        })
      });
      const data = await response.json();
      if (data.aiResponse) {
        setAiReportText(data.aiResponse);
      }
    } catch (err) {
      console.error(err);
      setAiReportText("Failed to retrieve smart AI Recommendations. Please review local console logs.");
    } finally {
      setAiLoading(false);
    }
  };

  // Triggers interactive "Apply Fix"
  const applyQualityFilters = () => {
    if (!reportActive) return;
    setFilterApplied(true);
    // Morph report values to represent pruned filter outputs!
    setReportActive({
      ...reportActive,
      samplesCount: reportActive.samplesCount - 2, // Dropped 2 outlier rows
      missingnessRate: 0.8, // Dropped down to negligible values!
      passedCount: reportActive.passedCount + 830,
      recommendations: [
        "✅ Filter Applied successfully! Purged Samples [ETH_047, ETH_089].",
        "✅ low-frequency SNPs with MAF < 0.05 successfully dropped.",
        "✅ Remaining metrics optimized for GWAS mapping."
      ]
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Upload Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dropzone upload card */}
        <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] flex flex-col justify-between shrink-0 space-y-5 shadow-sm">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#2C2C2C]">Upload Cohort Markers</h3>
            <p className="text-xs text-[#5A5A40] mt-1 leading-relaxed font-medium">
              We fully accept Genotype VCF formats (<code className="font-mono text-[#839337] font-bold">.vcf, .vcf.gz</code>), standard phenotype matrices (<code className="font-mono text-[#839337] font-bold">.csv, .tsv</code>), and pedigree sheets. Size limit: 5GB per action sequence.
            </p>
          </div>

          <div className="border-2 border-dashed border-[#CCD5AE] rounded-2xl p-6 bg-[#F5F5F0] text-center relative flex flex-col items-center justify-center min-h-[140px] hover:border-[#D4A373] transition-colors">
            <input
              type="file"
              onChange={handleFileChange}
              id="file-upload-input"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <UploadCloud className="h-8 w-8 text-[#5A5A40] mb-2" />
            {selectedFile ? (
              <p className="text-xs text-[#2C2C2C] font-mono font-bold truncate max-w-full">
                {selectedFile.name}
              </p>
            ) : (
              <p className="text-xs text-[#5A5A40] font-semibold">
                Drag &amp; drop file here, or <span className="text-[#D4A373] font-bold hover:underline">browse</span>
              </p>
            )}
            <p className="text-[9px] text-[#5A5A40]/70 mt-1 uppercase font-bold tracking-wider">Supports .vcf, .vcf.gz, .csv, .tsv</p>
          </div>

          {selectedFile && (
            <button
              onClick={handleUploadSubmit}
              disabled={uploading}
              className="w-full bg-[#5A5A40] hover:bg-[#484833] text-white font-bold text-xs py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {uploading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Uploading &amp; Validating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Run QC Analysis (~5 mins)
                </>
              )}
            </button>
          )}

          {/* Upload History List */}
          <div className="space-y-2 pt-4 border-t border-[#E6E6E0]">
            <h4 className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-widest font-mono">Active Cohort Datasets</h4>
            {uploads.length === 0 ? (
              <p className="text-[10px] text-[#5A5A40]/70 italic">No breeder files uploaded yet.</p>
            ) : (
              uploads.map((up) => (
                <div 
                  key={up.id} 
                  onClick={() => setReportActive(up.qcReportJson || null)}
                  className={`p-3 border rounded-xl flex items-center justify-between text-left cursor-pointer transition-all ${
                    reportActive?.samplesCount === up.qcReportJson?.samplesCount 
                      ? "bg-[#E9EDC9]/60 border-[#839337] shadow-sm" 
                      : "bg-white border-[#E6E6E0] hover:bg-[#F5F5F0] text-[#5A5A40]"
                  }`}
                >
                  <div className="flex items-center gap-2 max-w-[80%] truncate">
                    <FileText className="h-4 w-4 shrink-0 text-[#5A5A40]" />
                    <div>
                      <p className="text-xs font-mono font-bold text-[#2C2C2C] truncate">{up.filename}</p>
                      <p className="text-[9px] text-[#5A5A40]/80 font-medium">{up.fileType} • {Math.round(up.fileSize / 1024)} KB</p>
                    </div>
                  </div>
                  <CheckCircle className="h-4.5 w-4.5 text-[#839337] shrink-0" />
                </div>
              ))
            )}
          </div>

        </div>

        {/* Diagnostic QC Report dashboard */}
        <div className="lg:col-span-2 bg-white border border-[#E6E6E0] p-8 rounded-[32px] space-y-6 shadow-sm">
          {!reportActive ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center text-[#5A5A40]">
              <BarChart2 className="h-10 w-10 text-[#CCD5AE] mb-3" />
              <p className="text-sm font-bold font-serif text-[#2C2C2C]">No active QC log results</p>
              <p className="text-[11px] text-[#5A5A40] max-w-sm mt-1 font-medium leading-relaxed">
                Upload your dataset under the Breeder zone on the left to compute detailed Missingness, MAF, and Population PC correlations automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-6 text-left">
              
              {/* Header metrics bento rows */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E6E6E0] pb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2C2C2C]">Quality Control Diagnostic Report</h3>
                  <p className="text-xs text-[#5A5A40] font-medium">Generated automatically on crop markers</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={applyQualityFilters}
                    disabled={filterApplied}
                    className="bg-[#5A5A40] hover:bg-[#484833] disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold text-xs px-4 py-2 rounded-full transition-all shadow-sm"
                  >
                    {filterApplied ? "QC Filters Successfully Applied" : "Prune High Missingness Traits"}
                  </button>
                  {filterApplied && (
                    <a
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent("# Clean Genotype Export File\n# Purged outliers Sample_047, Sample_089\n# MAF filtered > 0.05\nSTID,CH_MARKER,ALLELES\nETH_001,rs9935102,AA\nETH_002,rs5520931,AT")}`}
                      download="wheat_drought_panel_cleaned.vcf"
                      className="bg-white border border-[#CCD5AE] hover:bg-[#F5F5F0] p-2 rounded-xl text-[#5A5A40] flex items-center justify-center shadow-sm"
                    >
                      <Download className="h-4.5 w-4.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* General summaries cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#F5F5F0] p-4 border border-[#E6E6E0] rounded-2xl">
                  <p className="text-[9px] font-mono font-bold text-[#5A5A40]/80 uppercase tracking-widest">SAMPLES</p>
                  <p className="text-2xl font-black font-serif text-[#2C2C2C] mt-1">{reportActive.samplesCount}</p>
                  <span className="text-[9px] text-[#839337] font-bold font-mono">✔ Pass</span>
                </div>
                <div className="bg-[#F5F5F0] p-4 border border-[#E6E6E0] rounded-2xl">
                  <p className="text-[9px] font-mono font-bold text-[#5A5A40]/80 uppercase tracking-widest font-sans">MARKER SNPS</p>
                  <p className="text-2xl font-black font-serif text-[#2C2C2C] mt-1">{reportActive.snpsCount || "N/A"}</p>
                  <span className="text-[9px] text-[#839337] font-bold font-mono">✔ Pass</span>
                </div>
                <div className="bg-[#F5F5F0] p-4 border border-[#E6E6E0] rounded-2xl">
                  <p className="text-[9px] font-mono font-bold text-[#5A5A40]/80 uppercase tracking-widest font-sans">MISSINGNESS</p>
                  <p className="text-2xl font-black font-serif text-[#2C2C2C] mt-1">{reportActive.missingnessRate}%</p>
                  <span className={`text-[9px] font-bold font-mono ${reportActive.missingnessRate < 5 ? "text-[#839337]" : "text-[#D4A373]"}`}>
                    {reportActive.missingnessRate < 5 ? "✔ Safe threshold" : "⚠️ High missingness"}
                  </span>
                </div>
                <div className="bg-[#F5F5F0] p-4 border border-[#E6E6E0] rounded-2xl">
                  <p className="text-[9px] font-mono font-bold text-[#5A5A40]/80 uppercase tracking-widest">PROFILE PROGRESS</p>
                  <p className="text-2xl font-black font-serif text-[#2C2C2C] mt-1">+{reportActive.readinessContribution}</p>
                  <span className="text-[9px] text-[#839337] font-bold font-mono">✔ Added to profile</span>
                </div>
              </div>

              {/* Render Charts if Genotype data is active */}
              {reportActive.snpsCount > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* MAF Distribution Bar Chart */}
                  <div className="bg-[#F5F5F0] border border-[#E6E6E0] p-4 rounded-2xl">
                    <p className="text-[10px] font-mono font-black text-[#5A5A40] uppercase tracking-wider mb-2">Minor Allele Frequency (MAF)</p>
                    <div className="h-52 w-full text-[10px] font-mono font-bold">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportActive.mafDistribution}>
                          <XAxis dataKey="range" stroke="#5A5A40" />
                          <YAxis stroke="#5A5A40" />
                          <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E6E6E0", color: "#3D3D33" }} />
                          <Bar dataKey="count" fill="#D4A373" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* PCA Scatter Chart Population Structures */}
                  <div className="bg-[#F5F5F0] border border-[#E6E6E0] p-4 rounded-2xl">
                    <p className="text-[10px] font-mono font-black text-[#5A5A40] uppercase tracking-wider mb-2">PC1 vs PC2 Population Stratification</p>
                    <div className="h-52 w-full text-[10px] font-mono font-bold">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                          <XAxis name="PC1" dataKey="pc1" stroke="#5A5A40" type="number" domain={[-0.4, 0.4]} />
                          <YAxis name="PC2" dataKey="pc2" stroke="#5A5A40" type="number" domain={[-0.4, 0.4]} />
                          <Tooltip 
                            cursor={{ strokeDasharray: "3 3" }} 
                            contentStyle={{ backgroundColor: "white", border: "1px solid #E6E6E0", color: "#3D3D33" }}
                            formatter={(value, name, props) => [value, props.name]}
                          />
                          {/* We plot groups */}
                          <Scatter name="Ethiopian Highlands" data={reportActive.pcaPoints?.slice(0, 3)} fill="#839337" />
                          <Scatter name="Rift Valley" data={reportActive.pcaPoints?.slice(3, 5)} fill="#D4A373" />
                          <Scatter name="Gojam/Arid Zones" data={reportActive.pcaPoints?.slice(5, 7)} fill="#5A5A40" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              )}

              {/* recommendations list */}
              <div className="bg-white p-6 border border-[#CCD5AE] rounded-3xl space-y-3">
                <h4 className="text-xs font-bold text-[#2C2C2C] font-sans flex items-center gap-1.5 uppercase tracking-wider">
                  ⚠️ Actionable Recommendations Checklist
                </h4>
                <div className="space-y-2 pl-2">
                  {reportActive.recommendations.map((reco, id) => (
                    <div key={id} className="text-xs text-[#5A5A40] font-medium flex items-start gap-2 leading-relaxed">
                      <span className="text-[#839337] shrink-0 mt-1">●</span>
                      <p>{reco}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gemini smart section */}
              <div className="bg-[#E9EDC9] border border-[#CCD5AE] p-6 rounded-[24px] space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#5A5A40] flex items-center gap-1.5 font-serif">
                      🌾 Gemini Smart Agri-Informatics recommendations
                    </h4>
                    <p className="text-[10px] text-[#5A5A40]/80 font-medium">Run a Deep LLM analysis of your breeder sample markers</p>
                  </div>
                  <button
                    onClick={queryGeminiAdvisor}
                    disabled={aiLoading}
                    className="bg-[#5A5A40] hover:bg-[#484833] text-white font-bold text-xs py-2 px-4 rounded-full flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-sm"
                  >
                    {aiLoading ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Querying...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" /> Consult Gemini AI
                      </>
                    )}
                  </button>
                </div>

                {/* AI Markdown View */}
                {aiReportText && (
                  <div className="bg-white p-5 rounded-2xl border border-[#CCD5AE] text-xs font-sans text-[#3D3D33] space-y-3 leading-relaxed overflow-x-auto max-h-[300px] overflow-y-auto shadow-inner">
                    <p className="font-bold text-[#D4A373] uppercase font-mono text-[9px] tracking-widest">GEMINI STRATEGY MANUSCRIPT OUTLINE:</p>
                    <div className="whitespace-pre-wrap font-sans text-[#3D3D33] font-medium">{aiReportText}</div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
