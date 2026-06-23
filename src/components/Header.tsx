import React, { useState } from "react";
import { Leaf, Users, UserCheck, ShieldAlert, Award, GraduationCap, Compass, Menu, X } from "lucide-react";
import { User, UserRole } from "../types";

interface HeaderProps {
  currentUser: User;
  onUserSwitch: (userId: string) => void;
  allUsers: User[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ currentUser, onUserSwitch, allUsers, activeTab, setActiveTab }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigation tabs vary slightly based on role
  const getNavItems = () => {
    if (currentUser.role === UserRole.MENTOR) {
      return [
        { id: "mentor_dash", label: "Mentor Board", icon: Users },
        { id: "tickets", label: "Help Tickets", icon: GraduationCap },
        { id: "showcase", label: "Post-Hackathon Showcase", icon: Award }
      ];
    }
    if (currentUser.role === UserRole.ORGANIZER) {
      return [
        { id: "organizer_dash", label: "Organizer Central", icon: ShieldAlert },
        { id: "tickets", label: "All Tickets", icon: GraduationCap },
        { id: "showcase", label: "All Projects", icon: Award }
      ];
    }
    return [
      { id: "dashboard", label: "My Dashboard", icon: Compass },
      { id: "setup", label: "Docker Setup", icon: GraduationCap },
      { id: "validation", label: "Data QC", icon: Leaf },
      { id: "workflows", label: "Workflow Library", icon: GraduationCap },
      { id: "lectures", label: "Lectures & Exercises", icon: GraduationCap },
      { id: "tickets", label: "Mentor Help Desk", icon: GraduationCap },
      { id: "showcase", label: "Archive & Showcase", icon: Award }
    ];
  };

  return (
    <header className="bg-[#5A5A40] border-b border-[#CCD5AE]/30 text-[#FDFCF9] px-6 py-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand logo & Mobile Menu Trigger */}
        <div className="flex items-center justify-between gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="bg-[#CCD5AE] p-2 rounded-lg text-[#5A5A40] font-bold text-xl shadow-sm select-none">
              🌾
            </div>
            <div>
              <h1 className="font-serif italic font-bold tracking-tight text-xl text-white flex items-center gap-1.5">
                GenomeReady <span className="font-sans text-[10px] not-italic px-1.5 py-0.5 rounded-full bg-[#CCD5AE]/20 text-[#CCD5AE] border border-[#CCD5AE]/30 font-semibold tracking-normal">MVP</span>
              </h1>
              <p className="text-[11px] font-mono text-[#CCD5AE] font-semibold uppercase tracking-wider">
                APBA/ABI BYOD Hackathon Companion
              </p>
            </div>
          </div>

          {/* Burger menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-white hover:bg-[#FDFCF9]/10 focus:outline-none transition-colors border border-[#CCD5AE]/20 flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Desktop/Tablet Horizontal Navigation */}
        <nav className="hidden md:flex flex-wrap items-center gap-1">
          {getNavItems().map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-[#FDFCF9] text-[#5A5A40] border-b-2 border-[#D4A373] shadow-sm font-bold"
                    : "hover:bg-[#FDFCF9]/10 text-[#FDFCF9]/80 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Vertical Navigation Dropdown */}
        {isMenuOpen && (
          <nav className="flex flex-col gap-1 w-full mt-2 py-3 border-t border-[#CCD5AE]/20 md:hidden animate-fade-in">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 text-left w-full cursor-pointer ${
                    isSelected
                      ? "bg-[#FDFCF9] text-[#5A5A40] border-l-4 border-[#D4A373] shadow-sm font-bold"
                      : "hover:bg-[#FDFCF9]/10 text-[#FDFCF9]/85 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-[#CCD5AE]" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Role manager & avatar */}
        <div className="flex items-center justify-between md:justify-start gap-4 border-t border-[#CCD5AE]/20 pt-3 md:pt-0 md:border-t-0 w-full md:w-auto">
          <div className="text-right">
            <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
            <p className="text-[10px] font-mono text-[#CCD5AE]/90 capitalize">
              Role: <span className="text-[#CCD5AE] font-bold">{currentUser.role}</span>
            </p>
          </div>

          {/* Quick switch emulator drop */}
          <div className="flex items-center gap-2 bg-[#FDFCF9]/10 px-2.5 py-1.5 rounded-lg border border-[#FDFCF9]/10">
            <UserCheck className="h-4 w-4 text-[#CCD5AE] shrink-0" />
            <select
              value={currentUser.id}
              onChange={(e) => {
                onUserSwitch(e.target.value);
                // Redirect back to default tab of the selected role
                const u = allUsers.find(x => x.id === e.target.value);
                if (u?.role === UserRole.MENTOR) setActiveTab("mentor_dash");
                else if (u?.role === UserRole.ORGANIZER) setActiveTab("organizer_dash");
                else setActiveTab("dashboard");
                setIsMenuOpen(false); // Close mobile menu upon switching role
              }}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-sans"
            >
              <optgroup label="Participants" className="bg-[#5A5A40] text-white">
                {allUsers.filter(u => u.role === UserRole.PARTICIPANT).map(u => (
                  <option key={u.id} value={u.id} className="bg-[#5A5A40] text-white">
                    {u.name} ({u.readinessScore}% Ready)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Staff Members" className="bg-[#5A5A40] text-white">
                {allUsers.filter(u => u.role !== UserRole.PARTICIPANT).map(u => (
                  <option key={u.id} value={u.id} className="bg-[#5A5A40] text-white">
                    {u.name} ({u.role})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

      </div>
    </header>
  );
}
