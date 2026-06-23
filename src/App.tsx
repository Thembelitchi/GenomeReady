import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { EnvSetup } from "./components/EnvSetup";
import { DataValidation } from "./components/DataValidation";
import { WorkflowRunner } from "./components/WorkflowRunner";
import { LecturePortal } from "./components/LecturePortal";
import { MentorSupport } from "./components/MentorSupport";
import { OrganizerDashboard } from "./components/OrganizerDashboard";
import { PostArchive } from "./components/PostArchive";
import { User, UserRole, LectureModule, DataUpload, Workflow, WorkflowRun, HelpTicket, ProjectShowcase } from "./types";
import { RefreshCw, Leaf } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [modules, setModules] = useState<LectureModule[]>([]);
  const [uploads, setUploads] = useState<DataUpload[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const [showcases, setShowcases] = useState<ProjectShowcase[]>([]);

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);

  // Synchronize state from Express backend json db
  const fetchAllState = async (userIdToLoad?: string) => {
    try {
      // 1. Fetch current user metadata
      const userRes = await fetch(userIdToLoad ? `/api/auth/me?userId=${userIdToLoad}` : "/api/auth/me");
      const userData = await userRes.json();
      if (userData.success) {
        setCurrentUser(userData.user);
        setAllUsers(userData.allUsers);
      }

      // 2. Fetch academic lecture modules
      const modRes = await fetch("/api/lectures/modules");
      const modData = await modRes.json();
      if (modData.success) {
        setModules(modData.modules);
      }

      // 3. Fetch data uploads
      const upRes = await fetch("/api/data/uploads");
      const upData = await upRes.json();
      if (upData.success) {
        setUploads(upData.uploads);
      }

      // 4. Fetch workflows metadata
      const wfRes = await fetch("/api/workflows");
      const wfData = await wfRes.json();
      if (wfData.success) {
        setWorkflows(wfData.workflows);
      }

      // 5. Fetch executions runs
      const runRes = await fetch("/api/workflows/runs");
      const runData = await runRes.json();
      if (runData.success) {
        setRuns(runData.runs);
      }

      // 6. Fetch support tickets
      const tickRes = await fetch("/api/tickets");
      const tickData = await tickRes.json();
      if (tickData.success) {
        setTickets(tickData.tickets);
      }

      // 7. Fetch published showcase projects
      const scRes = await fetch("/api/projects/showcases");
      const scData = await scRes.json();
      if (scData.success) {
        setShowcases(scData.showcases);
      }

    } catch (err) {
      console.error("Failed to parse backend fullstack state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllState();

    const handleSafeToast = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setToast(customEvent.detail);
      setTimeout(() => {
        setToast(prev => prev === customEvent.detail ? null : prev);
      }, 4000);
    };

    window.addEventListener("safe-toast", handleSafeToast);
    return () => {
      window.removeEventListener("safe-toast", handleSafeToast);
    };
  }, []);

  // Handler: Instructor Role Switcher emulator
  const handleUserSwitch = async (userId: string) => {
    setLoading(true);
    await fetchAllState(userId);
  };

  // Handler: Add points directly to readiness
  const handleUpdateReadiness = async (scoreToAdd: number) => {
    if (!currentUser) return;
    try {
      const response = await fetch("/api/auth/update-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          scoreToAdd
        })
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        setAllUsers(prev => prev.map(u => u.id === data.user.id ? data.user : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Completing lecture modules
  const handleCompleteModule = async (moduleId: string, status: "locked" | "unlocked" | "completed", progressPercent: number, notebookCells: any[]) => {
    try {
      const response = await fetch(`/api/lectures/${moduleId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          progressPercent,
          notebookCells
        })
      });
      const data = await response.json();
      if (data.success) {
        // Reload global states to unlock the sequentially locked modules
        await fetchAllState(currentUser?.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Reset Notebook template back to default
  const handleResetModule = async (moduleId: string) => {
    try {
      const response = await fetch(`/api/lectures/${moduleId}/reset`, { method: "POST" });
      const data = await response.json();
      if (data.success) {
        await fetchAllState(currentUser?.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Submit mentor help ticket
  const handleSubmitTicket = async (category: "setup" | "data" | "analysis" | "interpretation", description: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          category,
          description
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchAllState(currentUser.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Comment on ticket
  const handleAddComment = async (ticketId: string, text: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/tickets/${ticketId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          text
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchAllState(currentUser.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Resolve Ticket status
  const handleResolveTicket = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}/resolve`, { method: "POST" });
      const data = await response.json();
      if (data.success) {
        await fetchAllState(currentUser?.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Organizer manual score tweak
  const handleBoostStudent = async (studentId: string) => {
    try {
      const response = await fetch("/api/auth/update-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: studentId,
          scoreToAdd: 15
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchAllState(currentUser?.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Post Completed Project Showcase manuscript
  const handleAddShowcase = async (sc: ProjectShowcase) => {
    try {
      const response = await fetch("/api/projects/showcases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sc)
      });
      const data = await response.json();
      if (data.success) {
        await fetchAllState(currentUser?.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] text-[#3D3D33] flex flex-col justify-center items-center h-screen space-y-4">
        <RefreshCw className="h-10 w-10 text-[#839337] animate-spin" />
        <div className="text-center">
          <p className="text-sm font-mono font-bold text-[#5A5A40]">Synchronizing Agri-Informatics companion database...</p>
          <p className="text-[11px] text-[#5A5A40]/70 font-mono mt-1">Booting microservices container &amp; initial seeds</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] text-[#D4A373] flex flex-col justify-center items-center h-screen">
        <p className="text-lg font-bold">Authentication Failure</p>
        <p className="text-xs text-[#5A5A40] mt-1">Failed to initialize user context. Reload your sandbox window.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#3D3D33] font-sans selection:bg-[#CCD5AE]/40">
      
      {/* Global Header */}
      <Header
        currentUser={currentUser}
        allUsers={allUsers}
        onUserSwitch={handleUserSwitch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container Stage */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Render Tab Views dynamically based on active selected index */}
        {activeTab === "dashboard" && (
          <Dashboard
            currentUser={currentUser}
            modules={modules}
            setActiveTab={setActiveTab}
            uploadsCount={uploads.length}
            runsCount={runs.length}
          />
        )}

        {activeTab === "setup" && (
          <EnvSetup
            currentUser={currentUser}
            onUpdateReadiness={handleUpdateReadiness}
          />
        )}

        {activeTab === "validation" && (
          <DataValidation
            currentUser={currentUser}
            uploads={uploads}
            onAddUpload={(newUp) => setUploads(prev => [...prev, newUp])}
            onUploadSuccess={() => handleUpdateReadiness(20)}
          />
        )}

        {activeTab === "workflows" && (
          <WorkflowRunner
            workflows={workflows}
            uploads={uploads}
            runs={runs}
            onAddRun={(newRun) => setRuns(prev => [newRun, ...prev])}
          />
        )}

        {activeTab === "lectures" && (
          <LecturePortal
            currentUser={currentUser}
            modules={modules}
            onCompleteModule={handleCompleteModule}
            onResetModule={handleResetModule}
          />
        )}

        {activeTab === "tickets" && (
          <MentorSupport
            currentUser={currentUser}
            tickets={tickets}
            onSubmitTicket={handleSubmitTicket}
            onAddComment={handleAddComment}
            onResolveTicket={handleResolveTicket}
          />
        )}

        {activeTab === "mentor_dash" && (
          <MentorSupport
            currentUser={currentUser}
            tickets={tickets}
            onSubmitTicket={handleSubmitTicket}
            onAddComment={handleAddComment}
            onResolveTicket={handleResolveTicket}
          />
        )}

        {activeTab === "organizer_dash" && (
          <OrganizerDashboard
            users={allUsers}
            onBoostStudent={handleBoostStudent}
          />
        )}

        {activeTab === "showcase" && (
          <PostArchive
            currentUser={currentUser}
            showcases={showcases}
            onAddShowcase={handleAddShowcase}
          />
        )}

      </main>

      {/* Global Footer */}
      <footer className="border-t border-[#E6E6E0] bg-[#F5F5F0] text-[#5A5A40] py-6 text-center text-xs font-sans mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="flex items-center gap-1.5 font-mono text-[10px]">
            🌾
            Designed specifically for APBA/ABI 2026 Hackathon participants.
          </p>
          <p className="text-[10px] font-mono">
            Powered by GenomeReady under Biocollaborator
          </p>
        </div>
      </footer>

      {/* Floating Custom Toast notifications */}
      {toast && (
        <div 
          id="custom-toast-bubble"
          className="fixed bottom-6 right-6 z-[9999] bg-[#2C2C2C] text-[#FDFCF9] py-3.5 px-6 rounded-2xl shadow-2xl border border-[#CCD5AE]/30 max-w-sm flex items-start gap-3 transition-opacity duration-300 animate-slide-in"
        >
          <span className="text-base select-none mt-0.5">🌾</span>
          <div className="text-left space-y-0.5">
            <h5 className="text-[10px] font-mono font-bold text-[#D4A373] uppercase tracking-wider">Companion Notification</h5>
            <p className="text-xs font-semibold leading-relaxed font-sans">{toast}</p>
          </div>
        </div>
      )}

    </div>
  );
}
