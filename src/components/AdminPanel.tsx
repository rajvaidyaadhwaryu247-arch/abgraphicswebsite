import React, { useState, useEffect } from "react";
import { 
  X, Lock, ShieldCheck, LogOut, Upload, Plus, Trash2, 
  Settings, FolderKanban, Film, Sparkles, CheckCircle2, 
  AlertCircle, Loader2, Image as ImageIcon
} from "lucide-react";
import { auth, db, storage, googleProvider, handleFirestoreError, OperationType } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdate: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onSettingsUpdate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"settings" | "portfolio" | "reels">("settings");

  // Settings State
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [heroTitle, setHeroTitle] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [logoUploadProgress, setLogoUploadProgress] = useState<number | null>(null);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);

  // Portfolio State
  const [portfolioList, setPortfolioList] = useState<any[]>([]);
  const [portTitle, setPortTitle] = useState<string>("");
  const [portCategory, setPortCategory] = useState<string>("Graphics");
  const [portImgUrl, setPortImgUrl] = useState<string>("");
  const [portUploadProgress, setPortUploadProgress] = useState<number | null>(null);
  const [savingPortfolio, setSavingPortfolio] = useState<boolean>(false);

  // Reels State
  const [reelsList, setReelsList] = useState<any[]>([]);
  const [reelTitle, setReelTitle] = useState<string>("");
  const [reelInstagramUrl, setReelInstagramUrl] = useState<string>("");
  const [reelThumbnailUrl, setReelThumbnailUrl] = useState<string>("");
  const [reelUploadProgress, setReelUploadProgress] = useState<number | null>(null);
  const [savingReel, setSavingReel] = useState<boolean>(false);

  // Track Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Enforce owner email as defined in user requirements
        const isOwnerEmail = currentUser.email === "rajvaidyaadhwaryu247@gmail.com";
        setIsAdmin(isOwnerEmail);
        
        if (isOwnerEmail) {
          setErrorMsg(null);
          // Load settings and collections
          await loadAllAdminData();
        } else {
          setErrorMsg("Access Denied: Only rajvaidyaadhwaryu247@gmail.com can manage settings.");
          await signOut(auth);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadAllAdminData = async () => {
    try {
      // 1. Fetch settings
      const settingsDocRef = doc(db, "settings", "website");
      const settingsSnap = await getDoc(settingsDocRef);
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        setLogoUrl(data.logoUrl || "");
        setHeroTitle(data.heroTitle || "");
        setContactNumber(data.contactNumber || "");
        setWhatsappNumber(data.whatsappNumber || "");
      }

      // 2. Fetch portfolio items
      const portSnap = await getDocs(collection(db, "Portfolio"));
      const ports = portSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPortfolioList(ports);

      // 3. Fetch reels items
      const reelsSnap = await getDocs(collection(db, "Reels"));
      const reels = reelsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setReelsList(reels);
    } catch (err) {
      console.error("Error loading admin data: ", err);
    }
  };

  const clearNotifications = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleGoogleLogin = async () => {
    clearNotifications();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isOwnerEmail = result.user.email === "rajvaidyaadhwaryu247@gmail.com";
      if (!isOwnerEmail) {
        setErrorMsg("Access Denied: Unauthorized admin profile.");
        await signOut(auth);
      } else {
        setSuccessMsg("Logged in successfully as AB Graphics Administrator!");
        await loadAllAdminData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in via Google.");
    }
  };

  const handleLogout = async () => {
    clearNotifications();
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      setSuccessMsg("Administrator signed out successfully.");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign out.");
    }
  };

  // Image Upload helper using Firebase Storage
  const handleFileUpload = (
    file: File, 
    folder: string, 
    setProgress: (progress: number | null) => void,
    setUrl: (url: string) => void
  ) => {
    clearNotifications();
    const uniqueFilename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const storageRef = ref(storage, `${folder}/${uniqueFilename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(percent);
      },
      (error) => {
        setErrorMsg(`Critical Upload Failure: ${error.message}`);
        setProgress(null);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(downloadUrl);
        setProgress(null);
        setSuccessMsg(`Image uploaded successfully! Preview is active.`);
      }
    );
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    clearNotifications();
    setSavingSettings(true);

    try {
      const settingsDocRef = doc(db, "settings", "website");
      const cleanPayload = {
        logoUrl: logoUrl.trim(),
        heroTitle: heroTitle.trim(),
        contactNumber: contactNumber.trim(),
        whatsappNumber: whatsappNumber.trim()
      };

      await setDoc(settingsDocRef, cleanPayload);
      setSuccessMsg("Branding and active support parameters deployed successfully!");
      onSettingsUpdate(); // Notify main component to re-fetch settings
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "settings/website");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    clearNotifications();
    
    if (!portTitle.trim()) {
      setErrorMsg("Please specify a portfolio title.");
      return;
    }
    if (!portImgUrl.trim()) {
      setErrorMsg("Please upload an image or insert a valid resource URL.");
      return;
    }

    setSavingPortfolio(true);
    try {
      const portfolioColRef = collection(db, "Portfolio");
      const payload = {
        title: portTitle.trim(),
        category: portCategory,
        imageUrl: portImgUrl.trim(),
        createdAt: new Date().toISOString()
      };

      await addDoc(portfolioColRef, payload);
      setSuccessMsg("Perfect! Portfolio artwork added dynamically.");
      setPortTitle("");
      setPortImgUrl("");
      
      // Reload Portfolio items list
      await loadAllAdminData();
      onSettingsUpdate(); // Notify website to reload
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "Portfolio");
    } finally {
      setSavingPortfolio(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    clearNotifications();
    if (!window.confirm("Are you sure you want to delete this portfolio item?")) return;

    try {
      await deleteDoc(doc(db, "Portfolio", id));
      setSuccessMsg("Portfolio item deleted successfully.");
      await loadAllAdminData();
      onSettingsUpdate();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `Portfolio/${id}`);
    }
  };

  const handleAddReel = async (e: React.FormEvent) => {
    e.preventDefault();
    clearNotifications();

    if (!reelTitle.trim()) {
      setErrorMsg("Please specify a video reel title.");
      return;
    }
    if (!reelInstagramUrl.trim()) {
      setErrorMsg("Please provide the Instagram Reel URL.");
      return;
    }
    if (!reelThumbnailUrl.trim()) {
      setErrorMsg("Please upload a thumbnail poster or type a valid image URL.");
      return;
    }

    setSavingReel(true);
    try {
      const reelsColRef = collection(db, "Reels");
      
      // Parse Instagram URL to a direct embed or standard link structures
      let parsedUrl = reelInstagramUrl.trim();
      if (parsedUrl.includes("instagram.com/p/") || parsedUrl.includes("instagram.com/reel/")) {
        // Clean any parameters
        const cleanPathEnd = parsedUrl.split("?")[0];
        parsedUrl = `${cleanPathEnd.replace(/\/$/, "")}/embed`;
      }

      const payload = {
        reelTitle: reelTitle.trim(),
        instagramReelUrl: parsedUrl,
        thumbnailUrl: reelThumbnailUrl.trim(),
        createdAt: new Date().toISOString()
      };

      await addDoc(reelsColRef, payload);
      setSuccessMsg("Fantastic! New Instagram video reel is live on display.");
      setReelTitle("");
      setReelInstagramUrl("");
      setReelThumbnailUrl("");
      
      await loadAllAdminData();
      onSettingsUpdate();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "Reels");
    } finally {
      setSavingReel(false);
    }
  };

  const handleDeleteReel = async (id: string) => {
    clearNotifications();
    if (!window.confirm("Are you sure you want to delete this video reel?")) return;

    try {
      await deleteDoc(doc(db, "Reels", id));
      setSuccessMsg("Instagram video reel removed successfully.");
      await loadAllAdminData();
      onSettingsUpdate();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `Reels/${id}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="relative glass-panel rounded-3xl border border-white/10 overflow-hidden w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl bg-slate-950/95 animate-fadeIn">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-extrabold text-white tracking-wide leading-none">
                AB Graphics Admin Control
              </h2>
              <p className="text-[10px] font-mono tracking-widest text-[#a78bfa] uppercase mt-1">
                Zero-Trust Firebase CMS Portal
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full border border-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-all bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status bars for Alert and Success */}
        <div className="px-6 pt-4 flex flex-col gap-2">
          {errorMsg && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 p-3.5 rounded-xl text-xs text-red-400 font-sans">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="leading-normal">{errorMsg}</p>
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-2.5 bg-green-500/10 border border-green-500/25 p-3.5 rounded-xl text-xs text-green-400 font-mono">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="leading-normal">{successMsg}</p>
            </div>
          )}
        </div>

        {/* Content body based on Authentication */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
            <span className="font-mono text-xs tracking-wider">Validating connection credentials...</span>
          </div>
        ) : !isAdmin ? (
          /* Authentication Gate */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-16 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-orange-500 p-0.5 shadow-2xl mb-6">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-orange-400">
                <Lock className="w-7 h-7" />
              </div>
            </div>
            <h3 className="text-xl font-display font-extrabold text-white mb-2">
              Identity Verification Key Required
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-8">
              This terminal is strictly secured using standard Firebase authorization filters. Security rules verify administrative email claims dynamically before unlocking writing layers.
            </p>
            <button
              onClick={handleGoogleLogin}
              className="px-6 py-3 rounded-xl bg-white border border-transparent hover:bg-gray-100 text-black font-semibold text-xs tracking-wide uppercase transition-all flex items-center gap-3 shadow-xl"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Verify with Google Account
            </button>
          </div>
        ) : (
          /* Authenticated Dashboard Core */
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left sidebar nav tabs */}
            <div className="md:w-56 border-b md:border-b-0 md:border-r border-white/10 bg-slate-900/30 p-4.5 flex flex-col justify-between">
              <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0">
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-left text-xs font-mono font-bold transition-all w-full whitespace-nowrap ${
                    activeTab === "settings"
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-inner"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  Branding Settings
                </button>
                <button
                  onClick={() => setActiveTab("portfolio")}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-left text-xs font-mono font-bold transition-all w-full whitespace-nowrap ${
                    activeTab === "portfolio"
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-inner"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <FolderKanban className="w-4 h-4 flex-shrink-0" />
                  Portfolio Work
                </button>
                <button
                  onClick={() => setActiveTab("reels")}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-left text-xs font-mono font-bold transition-all w-full whitespace-nowrap ${
                    activeTab === "reels"
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-inner"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Film className="w-4 h-4 flex-shrink-0" />
                  Instagram Reels
                </button>
              </div>

              {/* Connected user admin footer */}
              <div className="border-t border-white/5 pt-4 mt-4 text-center mt-auto flex md:flex-col items-center md:items-start justify-between gap-3 bg-[#0a0f1d] md:bg-transparent -mx-4.5 -mb-4.5 p-4.5 md:m-0 md:p-0">
                <div className="flex items-center gap-2">
                  <img
                    src={user.photoURL || "/assets/ab-graphics-logo.png"}
                    alt="Current Admin Avatar"
                    className="w-7.5 h-7.5 rounded-full border border-white/10 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col text-left leading-none max-w-[120px]">
                    <span className="text-[11px] font-sans font-bold text-white truncate">
                      {user.displayName || "Administrator"}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500 mt-1 truncate">
                      Owner Active
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-mono uppercase tracking-widest transition-colors border border-red-500/15"
                >
                  <LogOut className="w-3 h-3" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Right Scrollable Config Frame */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40">
              
              {/* Tab Content: Settings */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-display font-extrabold text-white mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4.5 h-4.5 text-orange-400" />
                      Dynamic Agency Parameters
                    </h3>
                    <p className="text-gray-400 text-xs">
                      Updates here instantly modify branding assets, primary headlines, contact logs, and auto-generated links throughout the website.
                    </p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-5">
                    {/* Logo upload wrapper */}
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                      <div className="relative w-20 h-20 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt="Agency Active Logo"
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-500" />
                        )}
                        {logoUploadProgress !== null && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-orange-400 font-mono text-xs font-bold font-black">
                            {logoUploadProgress}%
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <span className="block text-xs font-mono font-bold text-gray-200">
                          Upload Custom Logo
                        </span>
                        <p className="text-[11px] text-gray-400 mt-1 mb-2.5 max-w-sm">
                          Upload your corporate identification logo files (.png, .jpeg, .svg supported). Stored securely within Firebase Storage.
                        </p>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(e.target.files[0], "settings", setLogoUploadProgress, setLogoUrl);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Logo Url Direct fallbacks */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono font-bold text-gray-300">
                        Active Logo URL
                      </label>
                      <input
                        type="text"
                        placeholder="Automatic logo upload link details"
                        className="bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl font-mono text-xs text-gray-200 focus:outline-none focus:border-orange-500/40"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                      />
                    </div>

                    {/* Dynamic Hero Title field */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono font-bold text-gray-300">
                        Dynamic Hero Title Text
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Designing Ideas, Creating Impact"
                        className="bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-orange-500/40 leading-normal"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Contact support number */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono font-bold text-gray-300">
                          Primary Contact Support Tel
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 9307643461"
                          className="bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl font-mono text-xs text-gray-200 focus:outline-none focus:border-orange-500/40"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          required
                        />
                      </div>

                      {/* WhatsApp support number */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono font-bold text-gray-300">
                          Target WhatsApp Support Number
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 919307643461"
                          className="bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl font-mono text-xs text-gray-200 focus:outline-none focus:border-orange-500/40"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-orange-600 text-white font-display font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-opacity disabled:opacity-50 inline-shadow"
                    >
                      {savingSettings ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save and Live Deploy Settings"
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab Content: Portfolio Upload */}
              {activeTab === "portfolio" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-display font-extrabold text-white mb-1 flex items-center gap-1.5">
                      <FolderKanban className="w-4.5 h-4.5 text-orange-400" />
                      Dynamic Portfolio Manager
                    </h3>
                    <p className="text-gray-400 text-xs">
                      Manage visual project elements. Items added appear instantly on the grid with filters ready.
                    </p>
                  </div>

                  {/* Add Portfolio Item block */}
                  <form onSubmit={handleAddPortfolio} className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4">
                    <span className="block text-xs font-mono text-orange-400 uppercase tracking-widest font-black">
                      UPLOAD NEW WORK
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-gray-400">Artwork Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Royal Invitation suite design"
                          className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-xs text-gray-200 focus:outline-none"
                          value={portTitle}
                          onChange={(e) => setPortTitle(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-gray-400">Category Selection</label>
                        <select
                          className="bg-slate-900 border border-white/10 px-3.5 py-2 rounded-xl text-xs text-gray-200 focus:outline-none"
                          value={portCategory}
                          onChange={(e) => setPortCategory(e.target.value)}
                        >
                          <option value="Graphics">Graphics</option>
                          <option value="Social Media">Social Media</option>
                          <option value="Video">Video</option>
                          <option value="Print">Print</option>
                        </select>
                      </div>
                    </div>

                    {/* File uploading of portfolio artwork */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      <div className="sm:col-span-2 flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-gray-400">Direct Artwork Image URL</label>
                        <input
                          type="text"
                          placeholder="Use file uploader or enter manual link"
                          className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl font-mono text-[11px] text-gray-300 focus:outline-none"
                          value={portImgUrl}
                          onChange={(e) => setPortImgUrl(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-gray-400">File Attachment Upload</label>
                        <label className="cursor-pointer flex items-center justify-center gap-1 px-3 py-2 border border-white/10 bg-white/5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-mono text-[10px] uppercase font-bold relative">
                          <Upload className="w-3 h-3 text-orange-400" />
                          {portUploadProgress !== null ? `${portUploadProgress}%` : "Upload File"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={portUploadProgress !== null}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(e.target.files[0], "Portfolio", setPortUploadProgress, setPortImgUrl);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingPortfolio || portUploadProgress !== null}
                      className="w-fit px-5 py-2 hover:opacity-90 bg-orange-500 text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center gap-1.5"
                    >
                      {savingPortfolio ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add To Portfolio
                        </>
                      )}
                    </button>
                  </form>

                  {/* Portfolio list for dynamic deletes */}
                  <div className="space-y-3">
                    <span className="block text-xs font-mono text-gray-500 uppercase tracking-widest">
                      ACTIVE DYNAMIC PROJECTS ({portfolioList.length})
                    </span>

                    {portfolioList.length === 0 ? (
                      <p className="text-gray-500 text-xs italic font-mono py-4">No custom dynamic upload items to list; loading baseline default designs.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {portfolioList.map((item) => (
                          <div key={item.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-11 h-11 object-cover rounded-lg border border-white/10"
                                referrerPolicy="no-referrer"
                              />
                              <div className="text-left">
                                <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{item.title}</h4>
                                <span className="text-[9px] font-mono text-orange-400 uppercase">{item.category}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeletePortfolio(item.id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-white transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab Content: Reels Showcase */}
              {activeTab === "reels" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-display font-extrabold text-white mb-1 flex items-center gap-1.5">
                      <Film className="w-4.5 h-4.5 text-orange-400" />
                      Dynamic Video Reels Manager
                    </h3>
                    <p className="text-gray-400 text-xs">
                      Embed and control Instagram videos on the homepage. Video triggers open safe embedding widgets instantly on click.
                    </p>
                  </div>

                  {/* Add Reels Item block */}
                  <form onSubmit={handleAddReel} className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4">
                    <span className="block text-xs font-mono text-orange-400 uppercase tracking-widest font-black">
                      EMBED COLD INSTAGRAM REEL
                    </span>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-gray-400">Reel Slogan Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Interactive SMM Video Edit Showcase"
                        className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-xs text-gray-200 focus:outline-none"
                        value={reelTitle}
                        onChange={(e) => setReelTitle(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-gray-400">Instagram Reel URL</label>
                      <input
                        type="text"
                        placeholder="e.g. https://www.instagram.com/reel/CmD0Uu4AhKz/"
                        className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl font-mono text-[11px] text-gray-300 focus:outline-none"
                        value={reelInstagramUrl}
                        onChange={(e) => setReelInstagramUrl(e.target.value)}
                      />
                    </div>

                    {/* File uploading of Reel Thumbnails */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      <div className="sm:col-span-2 flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-gray-400">Thumbnail Cover Link</label>
                        <input
                          type="text"
                          placeholder="Automatic image cover upload helper"
                          className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl font-mono text-[11px] text-gray-300 focus:outline-none"
                          value={reelThumbnailUrl}
                          onChange={(e) => setReelThumbnailUrl(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-gray-400">Cover Upload</label>
                        <label className="cursor-pointer flex items-center justify-center gap-1 px-3 py-2 border border-white/10 bg-white/5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-mono text-[10px] uppercase font-bold relative">
                          <Upload className="w-3 h-3 text-orange-400" />
                          {reelUploadProgress !== null ? `${reelUploadProgress}%` : "Upload File"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={reelUploadProgress !== null}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(e.target.files[0], "Reels", setReelUploadProgress, setReelThumbnailUrl);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingReel || reelUploadProgress !== null}
                      className="w-fit px-5 py-2 hover:opacity-90 bg-orange-500 text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center gap-1.5"
                    >
                      {savingReel ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Video Reel
                        </>
                      )}
                    </button>
                  </form>

                  {/* Reels list for dynamic deletes */}
                  <div className="space-y-3">
                    <span className="block text-xs font-mono text-gray-500 uppercase tracking-widest">
                      ACTIVE HOMEPAGE REELS ({reelsList.length})
                    </span>

                    {reelsList.length === 0 ? (
                      <p className="text-gray-500 text-xs italic font-mono py-4">No active video reels designed yet on Firebase database.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {reelsList.map((item) => (
                          <div key={item.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.thumbnailUrl}
                                alt={item.reelTitle}
                                className="w-11 h-11 object-cover rounded-lg border border-white/10"
                                referrerPolicy="no-referrer"
                              />
                              <div className="text-left">
                                <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{item.reelTitle}</h4>
                                <span className="text-[9px] font-mono text-gray-400 block truncate max-w-[150px]">{item.instagramReelUrl}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteReel(item.id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-white transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
