import React from "react";
import { Users, CheckCircle2, ShieldAlert, Award, FileSpreadsheet, Send, TrendingUp, AlertTriangle } from "lucide-react";
import { User, UserRole } from "../types";

interface OrganizerDashboardProps {
  users: User[];
  onBoostStudent: (userId: string) => void;
}

export function OrganizerDashboard({ users, onBoostStudent }: OrganizerDashboardProps) {
  const participants = users.filter((u: User) => u.role === UserRole.PARTICIPANT);
  const totalCount = participants.length;

  const setupCompletedCount = participants.filter((p: User) => p.readinessScore >= 50).length;
  const dataUploadedCount = 3; // Amina, Sarah, and mockup
  const exercisesCompletedCount = participants.filter((p: User) => p.readinessScore >= 80).length;

  // At Risk list (readinessScore < 50%)
  const atRiskStudents = participants.filter((p: User) => p.readinessScore < 50);

  // Generate real inline CSV data block for download
  const handleCSVExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Participant ID,Name,Email,Institution,Country,Crop Focus,Readiness Score (Points / 100),R-Level,Python-Level,Unix-Level,Registered At\n";
    
    participants.forEach((p) => {
      const row = `"${p.id}","${p.name}","${p.email}","${p.institution}","${p.country}","${p.cropFocus}",${p.readinessScore},"${p.rLevel}","${p.pythonLevel}","${p.unixLevel}","${p.createdAt}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "APBA_ABI_2026_Participants_Readiness_Report.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      
      {/* Overall Header */}
      <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#2C2C2C]">APBA/ABI Organizer Central</h2>
          <p className="text-xs text-[#5A5A40] mt-1.5 font-medium leading-relaxed">
            Supervise pre-hackathon participant readiness scores and run CSV reports for ABI/APBA Secretaries.
          </p>
        </div>
        <button
          onClick={handleCSVExport}
          className="bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold py-2.5 px-5 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
        >
          <FileSpreadsheet className="h-4.5 w-4.5" /> Export Cohort CSV
        </button>
      </div>

      {/* Cohort overview Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-[#E6E6E0] p-6 rounded-[24px] flex items-center gap-4 text-left shadow-sm">
          <div className="bg-[#F5F5F0] border border-[#CCD5AE] p-3 rounded-xl text-[#839337] shadow-inner">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#5A5A40] font-bold">Total Enrolled</p>
            <p className="text-2xl font-black font-mono text-[#2C2C2C] mt-0.5">{totalCount}</p>
            <p className="text-[10px] text-[#5A5A40]/80 mt-0.5 font-medium">MSc/PhD Breeders</p>
          </div>
        </div>

        <div className="bg-white border border-[#E6E6E0] p-6 rounded-[24px] flex items-center gap-4 text-left shadow-sm">
          <div className="bg-[#F5F5F0] border border-[#CCD5AE] p-3 rounded-xl text-[#839337] shadow-inner">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#5A5A40] font-bold">% Setup Environment</p>
            <p className="text-2xl font-black font-mono text-[#2C2C2C] mt-0.5">
              {Math.round((setupCompletedCount / (totalCount || 1)) * 100)}%
            </p>
            <p className="text-[10px] text-[#5A5A40]/80 mt-0.5 font-medium">{setupCompletedCount} of {totalCount} Complete</p>
          </div>
        </div>

        <div className="bg-white border border-[#E6E6E0] p-6 rounded-[24px] flex items-center gap-4 text-left shadow-sm">
          <div className="bg-[#F5F5F0] border border-[#CCD5AE] p-3 rounded-xl text-[#839337] shadow-inner">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#5A5A40] font-bold">% Data Validated</p>
            <p className="text-2xl font-black font-mono text-[#2C2C2C] mt-0.5">
              {Math.round((dataUploadedCount / (totalCount || 1)) * 100)}%
            </p>
            <p className="text-[10px] text-[#5A5A40]/80 mt-0.5 font-medium">{dataUploadedCount} crop catalogs</p>
          </div>
        </div>

        <div className="bg-white border border-[#E6E6E0] p-6 rounded-[24px] flex items-center gap-4 text-left shadow-sm">
          <div className="bg-[#F5F5F0] border border-[#CCD5AE] p-3 rounded-xl text-[#839337] shadow-inner">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#5A5A40] font-bold">% Exercises completed</p>
            <p className="text-2xl font-black font-mono text-[#2C2C2C] mt-0.5">
              {Math.round((exercisesCompletedCount / (totalCount || 1)) * 100)}%
            </p>
            <p className="text-[10px] text-[#5A5A40]/80 mt-0.5 font-medium">{exercisesCompletedCount} of {totalCount} completed</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Participant list + At Risk Risk flagging */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1 & 2: Main Participant Database list */}
        <div className="lg:col-span-2 bg-white border border-[#E6E6E0] p-8 rounded-[32px] space-y-4 shadow-sm">
          <h3 className="text-sm font-bold font-sans text-[#2C2C2C] uppercase tracking-wider border-b border-[#E6E6E0] pb-3">Demographic Participant Registry</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F5F5F0] border-b border-[#CCD5AE] text-[#5A5A40] font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Breeder Name</th>
                  <th className="p-3">Institution &amp; Crop</th>
                  <th className="p-3">R / Python / Unix</th>
                  <th className="p-3 text-right">Readiness</th>
                  <th className="p-3 text-right">Interact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6E0] text-[#3D3D33] font-medium">
                {participants.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F5F5F0]/60 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-[#2C2C2C]">{p.name}</p>
                      <p className="text-[10px] text-[#5A5A40] font-mono italic">{p.country}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-[11px] leading-snug font-semibold text-[#3D3D33]">{p.institution}</p>
                      <span className="text-[10px] text-[#839337] font-mono font-bold">{p.cropFocus}</span>
                    </td>
                    <td className="p-3 font-mono text-[10px]">
                      R: <span className={p.rLevel === "Advanced" ? "text-[#839337] font-bold" : "text-[#D4A373] font-bold"}>{p.rLevel[0]}</span> • 
                      Py: <span className="text-[#5A5A40]">{p.pythonLevel[0]}</span> • 
                      Sh: <span className="text-[#5A5A40]">{p.unixLevel[0]}</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold">
                      <span className={p.readinessScore < 50 ? "text-rose-600" : p.readinessScore >= 80 ? "text-[#839337]" : "text-[#2C2C2C]"}>
                        {p.readinessScore}%
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {p.readinessScore < 90 ? (
                        <button
                          onClick={() => {
                            onBoostStudent(p.id);
                            alert(`Organizers provided manual mentoring boost to ${p.name}! +15 readiness score adjusted.`);
                          }}
                          className="bg-white border border-[#CCD5AE] hover:bg-[#F5F5F0] text-[10px] font-bold text-[#5A5A40] px-3 py-1.5 rounded-lg shadow-sm transition-all"
                        >
                          Boost
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#839337] font-bold">✔ READY</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 3: At-Risk Alerts and Intervention Panel */}
        <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-serif text-[#2C2C2C] border-b border-[#E6E6E0] pb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
              At-Risk Warning Panel
            </h3>
            <p className="text-xs text-[#5A5A40] font-medium leading-relaxed">
              Below are participants with <span className="text-rose-600 font-bold">&lt;50% readiness scores</span> 2 weeks prior to travel. These require urgent intervention to finalize Docker environment parameters.
            </p>

            <div className="space-y-3">
              {atRiskStudents.length === 0 ? (
                <p className="text-xs text-[#839337] font-bold text-center py-6">✔ Awesome! Zero participants are categorized at-risk.</p>
              ) : (
                atRiskStudents.map((ars) => (
                  <div key={ars.id} className="p-4 bg-[#FEF6E4] border border-[#CCD5AE] rounded-xl space-y-2 text-left shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-[#2C2C2C]">{ars.name}</p>
                        <p className="text-[10px] text-[#5A5A40] font-mono font-semibold truncate max-w-[150px]">{ars.institution}</p>
                      </div>
                      <span className="text-[10px] font-mono font-black text-[#D4A373] bg-white border border-[#CCD5AE]/60 px-2 py-0.5 rounded shadow-sm">
                        {ars.readinessScore}% Ready
                      </span>
                    </div>

                    <p className="text-[10px] text-[#5A5A40] font-medium leading-normal">
                      Missing Environment Check, Data Genotype validation, and Pre-Exercise 2 blueprints.
                    </p>

                    <button
                      onClick={() => alert(`Instruction reminder sent automatically to ${ars.email}.`)}
                      className="bg-[#5A5A40] hover:bg-[#484833] text-white text-[10px] font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 w-full mt-3.5 transition-all shadow-sm"
                    >
                      <Send className="h-3 w-3 text-white" /> Email Reminder Notification
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-[#F5F5F0] p-4.5 border border-[#CCD5AE] rounded-2.5xl space-y-1.5 text-left text-xs text-[#5A5A40] mt-4 shadow-inner leading-relaxed font-medium">
            <span className="font-bold text-[#2C2C2C] font-mono text-[10px] uppercase block tracking-wider">Securing ROI Metrics:</span>
            <p>
              Export results to track total publications generated per training dollar invested. This dataset helps APBA report directly to Wellcome Trust and Gates program officers.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
