import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FileSpreadsheet, Check, RefreshCw, Key, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, Lock } from "lucide-react";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App & Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const apiBase = (import.meta as any).env?.VITE_API_URL || "";

export default function SheetsAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch current Sheets Config from Server on load
  useEffect(() => {
    fetch(`${apiBase}/api/sheets/config`)
      .then((res) => res.json())
      .then((data) => {
        if (data.spreadsheetId) {
          setSpreadsheetId(data.spreadsheetId);
        }
        setIsConnected(data.isConnected);
      })
      .catch((err) => console.error("Failed to load Google Sheets config:", err));
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSaving(true);
    setFeedbackMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      // Add the sheets scope
      provider.addScope("https://www.googleapis.com/auth/spreadsheets");

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (!token) {
        throw new Error("Failed to retrieve Google Sheets access token from authentication.");
      }

      setUserEmail(result.user.email);

      // Now save config to server with token
      const response = await fetch(`${apiBase}/api/sheets/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetId: spreadsheetId.trim(),
          accessToken: token,
        }),
      });

      if (response.ok) {
        setIsConnected(true);
        setFeedbackMessage({
          type: "success",
          text: `Successfully authenticated as ${result.user.email || "Admin"}! Google Sheets linked.`,
        });
      } else {
        throw new Error("Failed to save credentials to the backend server.");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setFeedbackMessage({
        type: "error",
        text: error.message || "Sign-In or connection failed. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSpreadsheetIdOnly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spreadsheetId.trim()) return;

    setIsSaving(true);
    setFeedbackMessage(null);
    try {
      // Fetch currently stored config or just submit SpreadsheetId.
      // If we don't have token, we just update Spreadsheet ID
      const response = await fetch(`${apiBase}/api/sheets/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetId: spreadsheetId.trim(),
        }),
      });

      if (response.ok) {
        setFeedbackMessage({
          type: "success",
          text: "Spreadsheet ID updated! Note: You must also Sign In with Google to authorize saving data.",
        });
      } else {
        throw new Error("Server failed to update Spreadsheet ID.");
      }
    } catch (error: any) {
      setFeedbackMessage({
        type: "error",
        text: error.message || "Failed to update Spreadsheet ID.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkSync = async () => {
    setIsSyncing(true);
    setSyncStatus("Synchronizing current local database leads to Sheets...");
    try {
      const res = await fetch(`${apiBase}/api/sheets/sync-all`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncStatus(`Sync Success! Added ${data.count} lead rows to spreadsheet.`);
      } else {
        setSyncStatus(`Sync Failed: ${data.error || "Server error"}`);
      }
    } catch (err: any) {
      setSyncStatus(`Sync Failed: Network connection issue.`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="border-t-4 border-black bg-zinc-50 font-sans relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toggle Bar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-5 flex flex-col sm:flex-row sm:items-center justify-between text-left cursor-pointer hover:bg-zinc-100/80 transition-colors gap-4"
        >
          <div className="flex items-start space-x-3.5">
            <div className={`p-2.5 rounded-xl border-2 border-black shrink-0 ${isConnected ? "bg-emerald-400" : "bg-yellow-300"}`}>
              <FileSpreadsheet className="w-5.5 h-5.5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-zinc-950 text-white text-[9px] font-mono font-black uppercase tracking-wider rounded-sm">
                  System Admin
                </span>
                <h4 className="font-display font-black text-sm uppercase tracking-tight text-slate-950">
                  Google Sheets Lead Sync Console
                </h4>
                {isConnected && (
                  <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-500 text-emerald-800 text-[9px] font-mono font-black uppercase rounded-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                    Active Pipeline
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 font-bold mt-1 max-w-2xl leading-relaxed">
                Connect and sync dynamic estimate calculator inputs directly to your corporate Google Spreadsheet. Leads flow automatically, fully server-side.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 self-end sm:self-center">
            <span className="text-[10px] font-mono font-black uppercase text-zinc-400 tracking-wider">
              {isOpen ? "Collapse Panel" : "Open Console"}
            </span>
            <div className="p-1.5 border-2 border-black bg-white rounded-lg text-black shadow-[2px_2px_0px_#000000]">
              {isOpen ? <ChevronUp className="w-4 h-4 stroke-[3]" /> : <ChevronDown className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>
        </button>

        {/* Expandable Section */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="py-6 border-t-2 border-black grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
                
                {/* Connection Setup Card */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] p-5 sm:p-6 rounded-xl">
                    <h5 className="font-display font-black text-sm uppercase tracking-tight text-slate-950 mb-3 flex items-center space-x-2">
                      <Key className="w-4 h-4 text-[#3B82F6]" />
                      <span>Configure Sheet Credentials</span>
                    </h5>
                    
                    <form onSubmit={handleSaveSpreadsheetIdOnly} className="space-y-4">
                      <div>
                        <label className="block text-[9px] font-mono font-black text-zinc-500 uppercase tracking-wider mb-1.5">
                          Google Spreadsheet ID (Extract from sheet URL)
                        </label>
                        <input
                          type="text"
                          value={spreadsheetId}
                          onChange={(e) => setSpreadsheetId(e.target.value)}
                          placeholder="e.g. 1aBCdEfGhIjKlMnOpQrStUvWxYz1234567890"
                          className="w-full px-3 py-2 bg-zinc-50 border-2 border-black rounded-lg text-xs font-mono font-bold text-slate-950 focus:outline-none focus:bg-white"
                        />
                      </div>

                      {feedbackMessage && (
                        <div className={`p-3 rounded-lg border-2 border-black text-xs font-bold flex items-start space-x-2 ${
                          feedbackMessage.type === "success" 
                            ? "bg-emerald-50 border-emerald-500 text-emerald-800" 
                            : "bg-red-50 border-red-500 text-red-800"
                        }`}>
                          <div className="mt-0.5">
                            {feedbackMessage.type === "success" ? <Check className="w-4 h-4 shrink-0 stroke-[3]" /> : "⚠️"}
                          </div>
                          <span>{feedbackMessage.text}</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        {/* Custom Google Sign In button with material style */}
                        <button
                          type="button"
                          onClick={handleGoogleSignIn}
                          disabled={isSaving || !spreadsheetId}
                          className="flex-1 py-2.5 px-4 bg-yellow-300 hover:bg-black hover:text-white disabled:bg-zinc-200 disabled:text-zinc-400 text-black border-2 border-black rounded-lg font-black text-[11px] uppercase tracking-wider transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          {isSaving ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Connecting Google...</span>
                            </>
                          ) : (
                            <>
                              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 mr-1">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                              </svg>
                              <span>Authorize Google Sheets</span>
                            </>
                          )}
                        </button>

                        <button
                          type="submit"
                          disabled={isSaving || !spreadsheetId}
                          className="py-2.5 px-4 bg-white hover:bg-zinc-100 disabled:bg-zinc-50 border-2 border-black rounded-lg font-black text-[11px] uppercase tracking-wider text-black transition-all cursor-pointer"
                        >
                          Save ID
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="flex items-center space-x-2 bg-emerald-50 border-2 border-black p-3.5 rounded-xl text-emerald-800 font-bold">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 stroke-[2.5]" />
                    <span className="font-mono text-[9px] uppercase tracking-wider font-black">
                      🔒 Secured via official Google Workspace authentication framework.
                    </span>
                  </div>
                </div>

                {/* Operations & Information Panel */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Actions Box */}
                  <div className="bg-slate-900 border-2 border-black text-white p-5 rounded-xl space-y-4 shadow-[4px_4px_0px_#3B82F6]">
                    <h5 className="font-display font-black text-xs uppercase tracking-widest text-zinc-400">
                      SYNC OPERATIONS
                    </h5>
                    
                    <p className="text-xs text-zinc-300 leading-relaxed font-bold">
                      Run bulk uploads of any previously collected local leads to Google Sheets, or review connectivity logs.
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleBulkSync}
                        disabled={isSyncing || !isConnected}
                        className="w-full py-3 bg-emerald-400 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-700 text-black border-2 border-black rounded-lg font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_rgba(255,255,255,0.15)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        {isSyncing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-black" />
                            <span>Bulk Syncing...</span>
                          </>
                        ) : (
                          <>
                            <FileSpreadsheet className="w-4.5 h-4.5 text-black" />
                            <span>Sync Existing Leads to Sheet</span>
                          </>
                        )}
                      </button>
                    </div>

                    {syncStatus && (
                      <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-mono font-bold text-yellow-300 leading-relaxed">
                        {syncStatus}
                      </div>
                    )}
                  </div>

                  {/* Help Card */}
                  <div className="bg-blue-50 border-2 border-blue-500/30 p-4 rounded-xl text-xs text-blue-950 font-bold space-y-2">
                    <div className="flex items-center space-x-1.5 text-blue-800">
                      <HelpCircle className="w-4 h-4 shrink-0" />
                      <span className="font-mono text-[9px] uppercase tracking-wider font-black">Instruction Blueprint:</span>
                    </div>
                    <ul className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                      <li>Create a new spreadsheet in your Google Sheets account.</li>
                      <li>Copy the Spreadsheet ID from the URL (the long code between <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">/d/</code> and <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">/edit</code>).</li>
                      <li>Paste it into the ID input field and click "Authorize Google Sheets".</li>
                      <li>Accept permission requested by the Google verification screen. It's done!</li>
                    </ul>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
