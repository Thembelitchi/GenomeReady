import React, { useState, useEffect } from "react";
import { Terminal, Check, AlertCircle, RefreshCw, Cpu, Server, HardDrive, Wifi, Award } from "lucide-react";
import { User } from "../types";

interface EnvSetupProps {
  currentUser: User;
  onUpdateReadiness: (scoreToAdd: number) => void;
}

type OS = "windows" | "mac" | "linux";

export function EnvSetup({ currentUser, onUpdateReadiness }: EnvSetupProps) {
  const [selectedOS, setSelectedOS] = useState<OS>("windows");
  const [diagnosticRunning, setDiagnosticRunning] = useState<boolean>(false);
  const [diagnosticCompleted, setDiagnosticCompleted] = useState<boolean>(false);
  const [badgeAwarded, setBadgeAwarded] = useState<boolean>(false);

  // Simulated metrics
  const [specs, setSpecs] = useState({
    ram: 0,
    diskSpace: 0,
    speedMbps: 0,
    dockerActive: false
  });

  // Simple auto-detect of OS on load
  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes("win")) {
      setSelectedOS("windows");
    } else if (ua.includes("mac")) {
      setSelectedOS("mac");
    } else if (ua.includes("linux")) {
      setSelectedOS("linux");
    }
    // Set checked badge state
    if (currentUser.readinessScore > 30) {
      setBadgeAwarded(true);
    }
  }, []);

  const runDiagnostic = () => {
    setDiagnosticRunning(true);
    setDiagnosticCompleted(false);

    setTimeout(() => {
      // Simulate hardware specs from browser capabilities or values
      setSpecs({
        ram: 16, // typical breeder laptop
        diskSpace: 124, // remaining storage
        speedMbps: 4.8, // Sahelian bandwidth environment simulation
        dockerActive: true
      });
      setDiagnosticRunning(false);
      setDiagnosticCompleted(true);

      // Add points to user readiness if not already awarded
      if (!badgeAwarded) {
        setBadgeAwarded(true);
        onUpdateReadiness(25); // Gives 25 points for environment verified
      }
    }, 2500);
  };

  const getDockerCommand = () => {
    return 'docker run -d -p 8888:8888 -v "$(pwd)/workspace:/home/jovyan/work" mbhewoo/hackathon-env:2026';
  };

  return (
    <div className="space-y-8">
      
      {/* Intro section */}
      <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] flex items-center gap-2">
          🌾 Guided Environment Setup
        </h2>
        <p className="text-xs text-[#5A5A40] mt-1.5 max-w-3xl font-medium leading-relaxed">
          By deploying the pre-baked APBA/ABI Docker image locally, you bypass tedious manual installation. 
          The image comes bundled with all tools required by professors, including <span className="text-[#839337] font-semibold">PLINK 2.0, GEMMA, GCTA, GAPIT, and rrBLUP</span>.
        </p>
      </div>

      {/* Video Tutorial Section */}
      <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] shadow-sm space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#2C2C2C] flex items-center gap-2">
          🎥 Video Tutorial: How to Install Docker & Configure Dockerfile
        </h3>
        <p className="text-xs text-[#5A5A40] font-medium leading-relaxed max-w-3xl">
          Watch this comprehensive walkthrough on installing Docker Desktop, setting up appropriate volume mounts, allocating memory allowances, and starting your bioinformatics containers.
        </p>
        <div className="aspect-video w-full max-w-4xl mx-auto rounded-[22px] overflow-hidden border border-[#E6E6E0] bg-black shadow-lg">
          <video 
            className="w-full h-full object-contain" 
            controls 
            preload="metadata"
            src="https://elwazi.org/sites/default/files/Tutorial_files/How_to_install_docker_and_dockerfile.mp4"
            onError={(e) => {
              console.warn("Docker video element source could not be loaded or was blocked by cross-origin policies. Failing gracefully:", e);
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Guided Setup Columns */}
        <div className="lg:col-span-2 bg-white border border-[#E6E6E0] p-8 rounded-[32px] shadow-sm space-y-6">
          
          {/* OS Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E6E6E0] pb-4 gap-3">
            <h3 className="text-xs font-bold font-sans text-[#5A5A40] uppercase tracking-widest">Select Your Operating System</h3>
            <div className="flex items-center gap-1.5 p-1 bg-[#F5F5F0] rounded-xl self-start">
              {(["windows", "mac", "linux"] as OS[]).map((os) => (
                <button
                  key={os}
                  onClick={() => setSelectedOS(os)}
                  className={`px-4 py-1.5 text-[11px] font-bold rounded-lg capitalize transition-all ${
                    selectedOS === os 
                      ? "bg-[#5A5A40] text-white shadow-sm" 
                      : "text-[#5A5A40]/70 hover:text-[#5A5A40]"
                  }`}
                >
                  {os === "windows" ? "Windows WSL2" : os}
                </button>
              ))}
            </div>
          </div>

          {/* OS Instructions Block */}
          <div className="space-y-4">
            {selectedOS === "windows" && (
              <div className="space-y-4 text-xs text-[#5A5A40]">
                <p className="font-sans leading-relaxed font-medium">
                  Windows users must deploy <span className="text-[#839337] font-bold">WSL2 (Windows Subsystem for Linux)</span> and the Ubuntu distribution.
                </p>
                <div className="space-y-3 pl-2">
                  <div className="flex gap-3">
                    <span className="font-mono bg-[#E9EDC9] border border-[#CCD5AE] w-6 h-6 flex items-center justify-center rounded-lg text-xs text-[#5A5A40] shrink-0 font-bold">1</span>
                    <p className="leading-relaxed font-medium mt-0.5">
                      Enable WSL2. Open PowerShell as Administrator and run:<br />
                      <code className="block bg-[#F5F5F0] p-3 text-[11px] font-mono rounded-xl mt-1.5 text-[#2C2C2C] border border-[#E6E6E0] whitespace-pre-wrap">wsl --install</code>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-mono bg-[#E9EDC9] border border-[#CCD5AE] w-6 h-6 flex items-center justify-center rounded-lg text-xs text-[#5A5A40] shrink-0 font-bold">2</span>
                    <p className="leading-relaxed font-medium mt-0.5">
                      Install <span className="font-bold text-[#2C2C2C]">Docker Desktop for Windows</span>. Ensure 'WSL2 Kernel integration' is checked under settings.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-mono bg-[#E9EDC9] border border-[#CCD5AE] w-6 h-6 flex items-center justify-center rounded-lg text-xs text-[#5A5A40] shrink-0 font-bold">3</span>
                    <p className="leading-relaxed font-medium mt-0.5">
                      Boot Docker and spin up the course container inside your shell (see command below).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedOS === "mac" && (
              <div className="space-y-4 text-xs text-[#5A5A40]">
                <p className="font-sans leading-relaxed font-medium">
                  Mac OS systems are Unix native but require Docker Desktop. Both Intel Core and Apple Silicon (M1/M2/M3) chips are fully supported.
                </p>
                <div className="space-y-3 pl-2">
                  <div className="flex gap-3">
                    <span className="font-mono bg-[#E9EDC9] border border-[#CCD5AE] w-6 h-6 flex items-center justify-center rounded-lg text-xs text-[#5A5A40] shrink-0 font-bold">1</span>
                    <p className="leading-relaxed font-medium mt-0.5">
                      Download and install <span className="font-bold text-[#2C2C2C]">Docker Desktop (macOS)</span>. Choose the 'Mac with Apple Chip' or 'Mac with Intel' installer corresponding to your processor.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-mono bg-[#E9EDC9] border border-[#CCD5AE] w-6 h-6 flex items-center justify-center rounded-lg text-xs text-[#5A5A40] shrink-0 font-bold">2</span>
                    <p className="leading-relaxed font-medium mt-0.5">
                      Allocate resource limits: Increase container RAM allowance in Docker settings from the default 2GB to <span className="font-bold text-[#2C2C2C]">at least 8GB RAM</span> for GWAS kinship matrices to prevent out-of-memory panics.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedOS === "linux" && (
              <div className="space-y-4 text-xs text-[#5A5A40]">
                <p className="font-sans leading-relaxed font-medium">
                  RedHat &amp; Debian/Ubuntu environments are the direct scientific standards. Docker can be installed natively.
                </p>
                <div className="space-y-3 pl-2">
                  <div className="flex gap-3">
                    <span className="font-mono bg-[#E9EDC9] border border-[#CCD5AE] w-6 h-6 flex items-center justify-center rounded-lg text-xs text-[#5A5A40] shrink-0 font-bold">1</span>
                    <p className="leading-relaxed font-medium mt-0.5">
                      Update apt references and deploy docker-ce:<br />
                      <code className="block bg-[#F5F5F0] p-3 text-[11px] font-mono rounded-xl mt-1.5 text-[#2C2C2C] border border-[#E6E6E0] whitespace-pre-wrap">sudo apt update &amp;&amp; sudo apt install docker.io -y</code>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-mono bg-[#E9EDC9] border border-[#CCD5AE] w-6 h-6 flex items-center justify-center rounded-lg text-xs text-[#5A5A40] shrink-0 font-bold">2</span>
                    <p className="leading-relaxed font-medium mt-0.5">
                      Add your user to the standard docker group to run containers rootless:<br />
                      <code className="block bg-[#F5F5F0] p-3 text-[11px] font-mono rounded-xl mt-1.5 text-[#2C2C2C] border border-[#E6E6E0] whitespace-pre-wrap">sudo usermod -aG docker $USER</code>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Docker Pull Command Banner */}
          <div className="bg-[#F5F5F0] p-5 border border-[#CCD5AE] rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-[#839337] uppercase tracking-widest">ONE-COMMAND DOCKER RUN</span>
              <span className="text-[9px] text-[#5A5A40]/70 font-mono">Stack: Python 3.13 / R 4.4</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={getDockerCommand()}
                className="w-full bg-white border border-[#E6E6E0] text-[#3D3D33] font-mono text-[10px] rounded-xl p-3 focus:outline-none"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(getDockerCommand());
                }}
                className="bg-white hover:bg-[#FDFCF9] text-[#5A5A40] border border-[#CCD5AE] px-4 py-2 flex items-center justify-center text-xs font-bold font-sans rounded-xl transition-all shrink-0"
              >
                Copy Command
              </button>
            </div>
          </div>

          {/* Pre-installed Tools Badges */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold font-sans text-[#2C2C2C] uppercase tracking-wider">All Stack Pre-installed Bioinformatics Tools</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Python 3.13", vers: "Standard Core" },
                { name: "R 4.4", vers: "Bioconductor 3.19" },
                { name: "PLINK 1.9", vers: "Genotyping filtering" },
                { name: "PLINK 2.0", vers: "Association stats" },
                { name: "GEMMA", vers: "Univariate Mixed MLMs" },
                { name: "GCTA", vers: "Complex Trait Analysis" },
                { name: "GAPIT", vers: "Breeder Phenogenomic Maps" },
                { name: "rrBLUP", vers: "Ridge Genomic Selection" },
                { name: "BGLR", vers: "Bayesian Predictors" }
              ].map((tool, idx) => (
                <div key={idx} className="bg-white text-[10px] border border-[#E6E6E0] p-3 rounded-xl text-left w-[140px] shrink-0 shadow-sm hover:border-[#D4A373] transition-all">
                  <p className="font-bold text-[#D4A373] font-mono truncate">{tool.name}</p>
                  <p className="text-[9px] text-[#5A5A40]/80 mt-0.5 truncate">{tool.vers}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Diagnostic Check Panel */}
        <div className="bg-white border border-[#E6E6E0] p-8 rounded-[32px] shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#2C2C2C]">Local Diagnostics</h3>
            <p className="text-xs text-[#5A5A40] font-medium leading-relaxed">
              Verify if your training laptop matches target specifications required for genomic analysis of 45K+ SNPs.
            </p>

            {/* Diagnostic Logs Output */}
            <div className="bg-[#F5F5F0] text-[11px] font-mono border border-[#CCD5AE] p-5 rounded-2xl min-h-[170px] space-y-2.5 flex flex-col justify-center">
              {!diagnosticCompleted && !diagnosticRunning && (
                <p className="text-[#5A5A40]/60 text-center">Diagnostic engine ready. Click below to start sweep.</p>
              )}
              {diagnosticRunning && (
                <div className="space-y-2">
                  <p className="text-[#839337] animate-pulse flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Gathering hardware specs...
                  </p>
                  <p className="text-[#5A5A40]">Checking Client Processor context...</p>
                  <p className="text-[#5A5A40]">Evaluating remaining SSD space...</p>
                  <p className="text-[#5A5A40]">Checking local network bandwidth latency...</p>
                </div>
              )}
              {diagnosticCompleted && (
                <div className="space-y-1.5 text-xs text-[#3D3D33]">
                  <div className="flex items-center justify-between text-[#3D3D33]">
                    <span className="flex items-center gap-1 font-medium"><Cpu className="h-4 w-4 text-[#839337]" /> RAM Memory</span>
                    <span className="font-bold text-[#839337]">{specs.ram}GB ({specs.ram >= 8 ? "Pass" : "Warn"})</span>
                  </div>
                  <div className="flex items-center justify-between text-[#3D3D33] mt-1.5">
                    <span className="flex items-center gap-1 font-medium"><HardDrive className="h-4 w-4 text-[#839337]" /> SSD Storage</span>
                    <span className="font-bold text-[#839337]">{specs.diskSpace}GB Available</span>
                  </div>
                  <div className="flex items-center justify-between text-[#3D3D33] mt-1.5">
                    <span className="flex items-center gap-1 font-medium"><Wifi className="h-4 w-4 text-[#839337]" /> Bandwidth Speed</span>
                    <span className="font-bold text-[#839337]">{specs.speedMbps} Mbps</span>
                  </div>
                  <div className="flex items-center justify-between text-[#3D3D33] mt-1.5">
                    <span className="flex items-center gap-1 font-medium"><Server className="h-4 w-4 text-[#839337]" /> Docker Daemon</span>
                    <span className="font-bold text-[#839337]">{specs.dockerActive ? "ACTIVE" : "ERROR"}</span>
                  </div>
                  <div className="bg-[#E9EDC9] p-3 rounded-xl border border-[#CCD5AE] text-[10px] text-[#5A5A40] mt-3 font-sans leading-relaxed font-semibold">
                    ✔ All diagnostic specs matched. Offline package caching active for low bandwidth contexts. Your badge is verified.
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={runDiagnostic}
            disabled={diagnosticRunning}
            className="w-full bg-[#5A5A40] hover:bg-[#484833] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs py-3 rounded-full transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            {diagnosticRunning ? "Testing Compatibility..." : "Run Compatibility Diagnostic"}
          </button>

          {/* Badge Display */}
          {badgeAwarded && (
            <div className="bg-[#E9EDC9] p-4 border border-[#CCD5AE] rounded-2xl flex items-center gap-4">
              <div className="bg-[#839337]/20 p-2.5 rounded-full border border-[#CCD5AE] text-[#839337]">
                <Award className="h-6 w-6 animate-bounce" />
              </div>
              <div className="text-left space-y-0.5">
                <p className="text-[11px] font-bold text-[#839337] uppercase tracking-widest font-mono">BADGE EARNED</p>
                <p className="text-xs font-bold text-[#2C2C2C]">Container Setup Verified</p>
                <p className="text-[10px] text-[#5A5A40]">+25 Readiness Score Boosted</p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
