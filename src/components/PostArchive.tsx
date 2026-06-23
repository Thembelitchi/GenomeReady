import React, { useState } from "react";
import { Award, Briefcase, FileText, Download, Share2, Shield, Eye, Bookmark, Upload, RefreshCw } from "lucide-react";
import { User, ProjectShowcase } from "../types";

interface PostArchiveProps {
  currentUser: User;
  showcases: ProjectShowcase[];
  onAddShowcase: (showcase: ProjectShowcase) => void;
}

export function PostArchive({ currentUser, showcases, onAddShowcase }: PostArchiveProps) {
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleCreateShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      onAddShowcase({
        id: "proj_" + Date.now(),
        userId: currentUser.id,
        ownerName: currentUser.name,
        institution: currentUser.institution,
        cropFocus: currentUser.cropFocus,
        title,
        description: desc,
        showcaseStatus: true,
        createdAt: new Date().toISOString(),
        doi: "10.5281/zenodo." + Math.floor(10000000 + Math.random() * 90000000),
        publicationsMapped: ["Preprint abstract: " + currentUser.cropFocus]
      });

      setTitle("");
      setDesc("");
      setSubmitting(false);
      alert("Project compiled, DOI reserved, and published to the Showcase Gallery successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-8">
      
      {/* Upper header */}
      <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] flex items-center gap-2">
          <Award className="h-7 w-7 text-[#5A5A40]" />
          Archive &amp; Showcase Gallery
        </h2>
        <p className="text-xs text-[#5A5A40] mt-1.5 max-w-3xl font-medium leading-relaxed">
          At the conclusion of the October Hackathon, preserve your analysis scripts, genotype matrices, plots, and models. 
          Generate a publication-ready ZIP package archive and acquire a reserved Zenodo DOI identifier for reproducibility compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: ARCHIVE FORMS CREATION */}
        <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] space-y-4 h-fit shadow-sm">
          <div className="border-b border-[#E6E6E0] pb-3">
            <h3 className="text-sm font-bold font-sans text-[#2C2C2C] flex items-center gap-1.5 uppercase tracking-wider">
              <Briefcase className="h-4.5 w-4.5 text-[#5A5A40]" />
              Compile &amp; Archive Project
            </h3>
            <p className="text-xs text-[#5A5A40] font-semibold mt-1">Bundle active notebooks and genotypes into a secure ZIP download.</p>
          </div>

          <form onSubmit={handleCreateShowcase} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-[#5A5A40] font-bold">Project Manuscript Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. GWAS identification of Chrome-4 drought genes"
                className="w-full bg-white border border-[#CCD5AE] text-[#3D3D33] font-semibold rounded-xl p-2.5 focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] shadow-sm font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-[#5A5A40] font-bold">Abstract Description of Methods</label>
              <textarea
                rows={5}
                required
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Detail crop model configurations, heritabilities, and quantitative outcomes achieved."
                className="w-full bg-white border border-[#CCD5AE] text-[#3D3D33] font-semibold rounded-xl p-3 focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] shadow-sm font-sans leading-relaxed text-xs"
              />
            </div>

            <div className="bg-[#E9EDC9]/40 border border-[#CCD5AE] p-4 rounded-xl space-y-1 leading-relaxed text-[11px] text-[#5A5A40] font-medium shadow-inner">
              <p className="font-bold text-[#839337] flex items-center gap-1">
                <Shield className="h-4 w-4 text-[#839337]" /> Zenodo DOI reserved instantly
              </p>
              <p>The platform compiles your finalized R script files, PCA coordinate variables, and Manhattan plots into a self-documenting ZIP.</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#5A5A40] hover:bg-[#484833] text-white font-bold text-xs py-3 rounded-full transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" /> Compiling ZIP...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 text-white" /> Compile &amp; Publish Showcase
                </>
              )}
            </button>
          </form>

        </div>

        {/* RIGHT COLUMN: MANUSCRIPT SHOWCASE GALLERY */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-bold font-mono text-[#5A5A40] uppercase tracking-widest pl-1">APBA/ABI Breeder Showcase Gallery</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showcases.map((sc) => (
              <div key={sc.id} className="bg-white border border-[#E6E6E0] p-6 rounded-[24px] flex flex-col justify-between space-y-4 text-left shadow-sm hover:shadow-md transition-shadow">
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold text-[#839337] uppercase bg-[#E9EDC9] border border-[#CCD5AE] px-2.5 py-0.5 rounded">
                      {sc.cropFocus}
                    </span>
                    <span className="text-[9px] text-[#5A5A40] font-mono font-bold tracking-wider">
                      {new Date(sc.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold font-serif text-[#2C2C2C] leading-snug">{sc.title}</h4>
                  <p className="text-xs text-[#5A5A40] leading-relaxed font-sans line-clamp-4 font-medium">{sc.description}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#E6E6E0] text-xs">
                  
                  {/* Investigator detail */}
                  <div className="flex justify-between items-center text-[11px] font-sans">
                    <span className="text-[#5A5A40] font-bold">Investigator:</span>
                    <span className="font-bold text-[#2C2C2C]">{sc.ownerName}</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-sans">
                    <span className="text-[#5A5A40] font-bold">Institution:</span>
                    <span className="text-[#5A5A40]/90 font-mono text-[10px] font-semibold truncate max-w-[170px]">{sc.institution}</span>
                  </div>

                  {/* DOI badge mock */}
                  {sc.doi && (
                    <div className="bg-[#F5F5F0] border border-[#CCD5AE] p-3 rounded-lg flex items-center justify-between text-[10px] font-mono text-[#5A5A40] font-semibold shadow-inner leading-relaxed">
                      <span>DOI REGISTRY NO:</span>
                      <span className="text-[#839337] font-extrabold">{sc.doi}</span>
                    </div>
                  )}

                  {/* Attachment outputs downloader */}
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                    <a
                      href={`/api/projects/${sc.id}/archive`}
                      className="bg-[#F5F5F0] border border-[#CCD5AE] hover:bg-white p-2.5 rounded-lg text-[#5A5A40] text-center font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5 text-[#5A5A40]" /> Download ZIP
                    </a>
                    <button
                      onClick={() => alert(`Manuscript link shared with team workspace users.`)}
                      className="bg-white border border-[#CCD5AE] hover:bg-[#F5F5F0] p-2.5 rounded-lg text-[#5A5A40] text-center font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Share2 className="h-3.5 w-3.5 text-[#5A5A40]" /> Share Abstract
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
