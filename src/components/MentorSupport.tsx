import React, { useState } from "react";
import { MessageSquare, HeartHandshake, Eye, Send, Sparkles, CheckCircle2, Search, ArrowRight, ShieldAlert, Check, ChevronRight } from "lucide-react";
import { User, UserRole, HelpTicket, TicketComment } from "../types";

interface MentorSupportProps {
  currentUser: User;
  tickets: HelpTicket[];
  onSubmitTicket: (category: "setup" | "data" | "analysis" | "interpretation", description: string) => void;
  onAddComment: (ticketId: string, text: string) => void;
  onResolveTicket: (ticketId: string) => void;
}

export function MentorSupport({ currentUser, tickets, onSubmitTicket, onAddComment, onResolveTicket }: MentorSupportProps) {
  const [selectedTicket, setSelectedTicket] = useState<HelpTicket | null>(null);
  
  // Participant State
  const [category, setCategory] = useState<"setup" | "data" | "analysis" | "interpretation">("analysis");
  const [description, setDescription] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [faqKeyword, setFaqKeyword] = useState<string>("");

  // FAQ suggestions pre-submission matching US-7
  const faqItems = [
    {
      keywords: ["matrix", "convergence", "singular", "gemma", "kinship"],
      q: "Why does GEMMA warn about Singular Kinship Matrix or divergence?",
      a: "This happens when sample missingness exceeds 10% or when clones/duplicates are present in your VCF. Apply quality filters under 'Data QC' to prune out highly missing samples like ETH_047 or duplicate check cohorts."
    },
    {
      keywords: ["docker", "install", "wsl", "windows", "powershell"],
      q: "Docker command fails with 'daemon not running' on Windows PowerShell?",
      a: "You must manually activate Docker Desktop first. Also, open Docker Desktop Settings, navigate to 'General', and ensure both 'Use the WSL 2 based engine' and 'Integrate with default WSL distro' are enabled."
    },
    {
      keywords: ["header", "tsv", "csv", "yield", "phenotype"],
      q: "LMM models crash during phenotyping coordinate lookup?",
      a: "Mixed model packages (R lme4, GAPIT, GEMMA) parse column headers literally and are casesensitive. Standardize headers. Phenotype labels must are fully contiguous with your genotyping FAM sequences."
    }
  ];

  // Filters FAQS matching typed description or search keyword
  const getSuggestions = () => {
    const textToCheck = (description + " " + faqKeyword).toLowerCase();
    if (!textToCheck.trim()) return [];
    return faqItems.filter(item => 
      item.keywords.some(kw => textToCheck.includes(kw))
    );
  };

  const activeSuggestions = getSuggestions();

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmitTicket(category, description);
    setDescription("");
    setCategory("analysis");
    alert("Help Request submitted to APBA/ABI Mentor Desk. AI advisor and mentors notified!");
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedTicket) return;

    onAddComment(selectedTicket.id, commentText);
    setCommentText("");
    
    // Refresh active selected view
    const updated = tickets.find(t => t.id === selectedTicket.id);
    if (updated) {
      setSelectedTicket(updated);
    }
  };

  // Switch role-views inside component to represent Dr. Osei's view
  const isMentorView = currentUser.role === UserRole.MENTOR;

  return (
    <div className="space-y-8">
      
      {/* SUPPORT INTRO BANNER */}
      <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] flex items-center gap-2">
            <HeartHandshake className="h-7 w-7 text-[#5A5A40]" />
            Bioinformatics Mentoring Desk
          </h2>
          <p className="text-xs text-[#5A5A40] mt-1.5 max-w-xl font-medium leading-relaxed">
            Stuck on a mixed-model convergence problem, genotyping file error, or Docker daemon configuration hurdle? 
            Ask our global instructors or get immediate troubleshooting advice compiled by our Gemini AI advisor.
          </p>
        </div>
        <span className="text-xs bg-[#F5F5F0] text-[#5A5A40] px-4 py-2 rounded-xl border border-[#CCD5AE] font-mono font-bold self-start md:self-auto shadow-inner">
          Avg Response: &lt;2 hours
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Ticket filing / Active List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* MENTOR VIEW: INSTRUCTOR QUEUE */}
          {isMentorView ? (
            <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-[#E6E6E0] pb-4">
                <h3 className="text-sm font-bold font-sans text-[#2C2C2C] uppercase tracking-wider">Active Student Help Request Queue</h3>
                <span className="text-[10px] bg-[#E9EDC9] text-[#839337] border border-[#CCD5AE] px-3 py-1 rounded-lg font-mono font-bold">INSTRUCTOR QUEUE ADMIN</span>
              </div>

              <div className="space-y-3">
                {tickets.length === 0 ? (
                  <p className="text-xs text-[#5A5A40]/60 italic text-center py-6 font-semibold">No pending support queues.</p>
                ) : (
                  tickets.map((t) => (
                    <div 
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`p-4 border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer transition-all ${
                        selectedTicket?.id === t.id 
                          ? "bg-[#E9EDC9]/60 border-[#839337] shadow-sm" 
                          : "bg-white border-[#E6E6E0] text-[#5A5A40] hover:bg-[#F5F5F0]"
                      }`}
                    >
                      <div className="space-y-1 text-left max-w-[80%]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-[#2C2C2C]">{t.userName}</span>
                          <span className="text-[9px] text-[#5A5A40] font-mono font-bold">({t.userInstitution})</span>
                          <span className="text-[9px] bg-[#F5F5F0] border border-[#CCD5AE] text-[#5A5A40] px-1.5 rounded uppercase font-bold">{t.category}</span>
                        </div>
                        <p className="text-[11px] text-[#5A5A40] font-semibold line-clamp-1 leading-normal">{t.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          t.status === "resolved" 
                            ? "bg-[#E9EDC9] text-[#839337] border border-[#CCD5AE]" 
                            : "bg-[#FEF6E4] text-[#D4A373] border border-[#E6E6E0]"
                        }`}>
                          {t.status}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[#CCD5AE]" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* PARTICIPANT CONTEXT: SUBMIT TICKET FORM & FAQS SUGGESTION */
            <div className="space-y-6">
              
              {/* Submission Form */}
              <form onSubmit={handleTicketSubmit} className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] space-y-4 shadow-sm">
                <div className="border-b border-[#E6E6E0] pb-3">
                  <h3 className="text-sm font-bold font-sans text-[#2C2C2C] uppercase tracking-wider">Create a New Help Request Ticket</h3>
                  <p className="text-xs text-[#5A5A40] font-semibold">Describe the diagnostic warning code or pipeline failure precisely.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-[#5A5A40] font-bold">Request Category</label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="w-full bg-[#F5F5F0] border border-[#CCD5AE] text-[#3D3D33] font-mono p-2.5 rounded-xl shadow-inner focus:outline-none focus:border-[#5A5A40]"
                    >
                      <option value="setup">Docker Setup &amp; Configuration</option>
                      <option value="data">Data Validation &amp; Formats</option>
                      <option value="analysis">Pipeline Modeling Analysis</option>
                      <option value="interpretation">Statistical Interpretation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-[10px] uppercase font-mono text-[#5A5A40] font-bold">Describe Your Problem</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter warning/error logs or genotype FAM formatting."
                    className="w-full bg-white border border-[#CCD5AE] text-[#3D3D33] font-sans p-3 rounded-xl focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] shadow-sm"
                  />
                </div>

                {/* Interactive FAQ suggestions as they type description matching US-7 */}
                {activeSuggestions.length > 0 && (
                  <div className="bg-[#E9EDC9]/40 border border-[#CCD5AE] p-5 rounded-2xl space-y-3.5 shadow-sm">
                    <h4 className="text-xs font-bold text-[#839337] flex items-center gap-1.5">
                      <ShieldAlert className="h-4.5 w-4.5 text-[#839337]" />
                      Auto-Suggested FAQ Solutions
                    </h4>
                    <div className="space-y-3 divide-y divide-[#CCD5AE]/30">
                      {activeSuggestions.slice(0, 3).map((faq, id) => (
                        <div key={id} className="text-xs space-y-1 text-left pt-2 first:pt-0">
                          <p className="font-bold text-[#2C2C2C] flex items-center gap-1">
                            <span className="text-[#839337] font-black">Q:</span> {faq.q}
                          </p>
                          <p className="text-[#5A5A40] font-medium leading-relaxed pl-4">
                            <span className="text-[#D4A373] font-bold">A:</span> {faq.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-[#5A5A40] hover:bg-[#484833] text-white font-bold text-xs py-3 px-8 rounded-full shadow-sm transition-all self-start"
                >
                  Submit Ticket to Mentors
                </button>
              </form>

              {/* Active Ticket Feed for Participants */}
              <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] space-y-4 text-left shadow-sm">
                <h3 className="text-sm font-bold text-[#2C2C2C] border-b border-[#E6E6E0] pb-3 uppercase tracking-wider">My Support History</h3>
                {tickets.filter(t => t.userId === currentUser.id).length === 0 ? (
                  <p className="text-xs text-[#5A5A40]/60 italic py-4 font-semibold text-center">You have filed zero support tickets.</p>
                ) : (
                  tickets.filter(t => t.userId === currentUser.id).map(t => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedTicket?.id === t.id 
                          ? "bg-[#E9EDC9]/60 border-[#839337] shadow-sm font-semibold" 
                          : "bg-[#F5F5F0] border border-[#CCD5AE] hover:bg-white text-[#3D3D33]"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#2C2C2C]">Ticket #{t.id.slice(3, 7)}</span>
                          <span className="text-[9px] bg-white border border-[#CCD5AE] text-[#5A5A40] px-1.5 rounded uppercase font-bold">{t.category}</span>
                        </div>
                        <p className="text-[11px] text-[#5A5A40] font-semibold line-clamp-1">{t.description}</p>
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        t.status === "resolved" 
                          ? "bg-[#E9EDC9] text-[#839337] border border-[#CCD5AE]" 
                          : "bg-[#FEF6E4] text-[#D4A373] border border-[#E6E6E0]"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Ticket Chat Comment Detail panel */}
        <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] shadow-sm flex flex-col justify-between min-h-[450px]">
          {!selectedTicket ? (
            <div className="flex flex-col items-center justify-center text-center text-[#5A5A40] h-full my-auto space-y-2">
              <MessageSquare className="h-8.5 w-8.5 text-[#CCD5AE]" />
              <p className="text-xs font-bold text-[#2C2C2C]">No Ticket selected</p>
              <p className="text-[11px] text-[#5A5A40]/70 max-w-[190px] font-semibold mt-0.5 leading-normal">Toggle a support ticket on the left to evaluate active discussions.</p>
            </div>
          ) : (
            <div className="flex flex-col justify-between h-full space-y-4 text-left">
              
              {/* Selected Ticket header */}
              <div className="border-b border-[#E6E6E0] pb-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-serif font-bold text-[#2C2C2C] uppercase tracking-wider">Ticket discussion</span>
                  {selectedTicket.status !== "resolved" && (
                    <button
                      onClick={() => {
                        onResolveTicket(selectedTicket.id);
                        alert("Ticket status resolved successfully.");
                        setSelectedTicket(null);
                      }}
                      className="text-[9px] bg-[#E9EDC9] text-[#839337] hover:bg-[#CCD5AE] font-bold p-1 rounded-lg uppercase px-2 shadow-sm border border-[#CCD5AE]"
                    >
                      Resolve
                    </button>
                  )}
                </div>
                <div className="bg-[#F5F5F0] border border-[#CCD5AE] p-4 rounded-xl text-xs shadow-inner italic font-semibold text-[#5A5A40]">
                  <p className="leading-normal">"{selectedTicket.description}"</p>
                </div>
              </div>

              {/* Chat timeline logs */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[250px]">
                {selectedTicket.comments.length === 0 ? (
                  <p className="text-[10px] text-[#5A5A40]/60 italic text-center pt-8 font-semibold">Instructors are reviewing your diagnostics log. Standby.</p>
                ) : (
                  selectedTicket.comments.map((comment) => {
                    const isAi = comment.userId.includes("copilot");
                    const isMentor = comment.userRole === UserRole.MENTOR;

                    return (
                      <div 
                        key={comment.id}
                        className={`p-3.5 rounded-xl text-xs space-y-1 h-fit select-text shadow-sm ${
                          isAi 
                            ? "bg-[#FEF6E4] border border-[#E6E6E0]" 
                            : isMentor 
                              ? "bg-[#E9EDC9]/60 border border-[#CCD5AE]" 
                              : "bg-[#F5F5F0] border border-[#CCD5AE]"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${isAi ? "text-[#D4A373]" : isMentor ? "text-[#839337]" : "text-[#2C2C2C]"}`}>
                            {comment.userName}
                          </span>
                          <span className="text-[8px] text-[#5A5A40]">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <div className="text-[#3D3D33] leading-relaxed font-sans font-medium mt-1 whitespace-pre-wrap">
                          {comment.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Post comment input */}
              <form onSubmit={handleAddCommentSubmit} className="flex gap-2 border-t border-[#E6E6E0] pt-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ask a refinement comment..."
                  className="w-full bg-[#F5F5F0] border border-[#CCD5AE] text-xs font-semibold text-[#3D3D33] p-2.5 rounded-xl shadow-inner focus:outline-none focus:border-[#5A5A40]"
                />
                <button
                  type="submit"
                  className="bg-[#5A5A40] hover:bg-[#484833] text-white p-2.5 rounded-xl shrink-0 flex items-center justify-center shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
