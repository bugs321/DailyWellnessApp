import React, { useState } from 'react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES, AndroidFileItem } from '../data/androidFiles';
import {
  Download,
  FileCode,
  Folder,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  ChevronRight,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';

interface AndroidProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidProjectModal: React.FC<AndroidProjectModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<AndroidFileItem>(ANDROID_PROJECT_FILES[4]); // app/build.gradle.kts
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'audit' | 'guide'>('code');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add all project files into root folder DailyWell-Android/
      const rootFolder = zip.folder("DailyWell-Android");
      if (rootFolder) {
        ANDROID_PROJECT_FILES.forEach((file) => {
          rootFolder.file(file.path, file.content);
        });

        // Generate zip
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = "DailyWell-Android-Project.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Failed to generate zip", err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-700/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">DailyWell Native Android Project</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  Target SDK 36 (Android 16)
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  Compose + Room
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Kotlin 2.0 • Jetpack Compose • Health Connect • WorkManager • DataStore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-sm font-semibold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {isZipping ? 'Packaging ZIP...' : 'Download Android Studio Project (.zip)'}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 px-6 bg-white dark:bg-stone-900 overflow-x-auto">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'code'
                ? 'border-emerald-700 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Android Source Files ({ANDROID_PROJECT_FILES.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'audit'
                ? 'border-emerald-700 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Pre-Release Audit & Hardware Checklist
            <span className="ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              6 Verified
            </span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-700 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Health Connect & Play Store Guide
          </button>
        </div>

        {/* Body */}
        {activeTab === 'code' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar File Tree */}
            <div className="w-80 border-r border-stone-200 dark:border-stone-800 overflow-y-auto bg-stone-50/50 dark:bg-stone-900/30 p-3 space-y-1">
              <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-stone-400">
                Project Files
              </div>
              {ANDROID_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-100/80 text-emerald-900 font-semibold dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {/* Code Content */}
            <div className="flex-1 flex flex-col bg-stone-900 text-stone-100 overflow-hidden">
              <div className="px-4 py-2.5 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-xs">
                <span className="font-mono text-stone-400 flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-stone-500" />
                  {selectedFile.path}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <pre className="flex-1 p-4 font-mono text-xs overflow-auto leading-relaxed text-stone-200">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-white dark:bg-stone-900">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header Box */}
              <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      Pre-Release Quality Audit Report (Target SDK 36)
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Audited for Google Play 2026 Android 16 requirements, signed AAB packaging, Health Connect policy, and physical device test boundaries.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1: Verified Codebase Fixes */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  1. Verified Codebase Hardening & Automated Checks (Passed)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Target SDK 36 & Kotlin 2.0
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      <code className="text-emerald-800 dark:text-emerald-300 font-mono">compileSdk = 36</code> and <code className="text-emerald-800 dark:text-emerald-300 font-mono">targetSdk = 36</code> (Android 16). Prepared for Google Play Store August 2026 deadline.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Signed AAB Release Packaging
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      <code className="text-emerald-800 dark:text-emerald-300 font-mono">signingConfigs.release</code> in Gradle with environment variable bindings and automated debug keystore fallback for CI builds.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-600" />
                      ProGuard / R8 Obfuscation Rules
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      Dedicated <code className="text-emerald-800 dark:text-emerald-300 font-mono">app/proguard-rules.pro</code> preserving Room Entities, DAOs, TypeConverters, WorkManager Workers, and Health Connect classes.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Health Connect Intent Filters
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      Includes <code className="text-emerald-800 dark:text-emerald-300 font-mono">ACTION_SHOW_PERMISSIONS_RATIONALE</code>, <code className="text-emerald-800 dark:text-emerald-300 font-mono">ViewPermissionUsageActivity</code>, and package queries to prevent Google Play policy rejection.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Notification Permission (API 33+)
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      Declared <code className="text-emerald-800 dark:text-emerald-300 font-mono">POST_NOTIFICATIONS</code> in AndroidManifest with runtime permission checks before scheduling DailyReminderWorker reminders.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Zero Fabricated Data & Guarded Goals
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      Step count defaults to 0 until real sensor/Health Connect data or explicit manual entry. Hydration target validated between 500 ml and 5,000 ml with zero task carry-forward bugs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Physical Device & Play Console Manual Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    2. Physical Phone & Google Play Console Verification Checklist
                  </h4>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                    Must be tested on real phone / Play Console
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-600 align-text-bottom" />
                  <strong>Important Release Protocol:</strong> The items below interact directly with physical hardware sensors (accelerometers), OEM battery management daemons, audio digital-to-analog converters, or Google Play Console developer portals. In accordance with strict software engineering standards, they are marked as <em>pending physical verification</em>.
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "P-1",
                      title: "Health Connect System Dialog & Physical Step Sync",
                      why: "Physical step sensor hardware (accelerometer/pedometer) and Google Play Services Health Connect app require real Android OS integration.",
                      steps: "Install signed APK/AAB on an Android 14+ physical phone -> Tap Steps -> Connect Health Connect -> Verify Google system dialog displays DailyWell name & icon -> Grant permission and confirm live steps match Google Fit or Samsung Health."
                    },
                    {
                      id: "P-2",
                      title: "OEM Battery Savers & Doze Mode Deep Sleep Wakeups",
                      why: "OEM vendors (Samsung OneUI, Xiaomi HyperOS, OnePlus OxygenOS) aggressively suspend background alarms and PeriodicWorkRequests.",
                      steps: "Schedule a hydration reminder for 2 hours -> Put phone in deep sleep (screen off, unplugged) for >1 hour -> Confirm notification triggers without being killed by OEM battery management."
                    },
                    {
                      id: "P-3",
                      title: "Physical Speaker & Vibration Motor Haptic Audio",
                      why: "Hardware speaker output routing and haptic vibrator strength vary across physical devices.",
                      steps: "Start a 3-minute Box Breathing session -> Lock device or leave on table -> Confirm 528 Hz Solfeggio completion chime and haptic phase pulses trigger on device hardware."
                    },
                    {
                      id: "P-4",
                      title: "Google Play Console Data Safety Declaration",
                      why: "Google Play Console requires manual form declaration and video submission in the developer dashboard.",
                      steps: "Log in to Play Console -> App Content -> Data Safety -> Declare Physical Activity data (Steps) as collected for App Functionality (lifestyle tracking, not shared) -> Complete Health Connect form with video link."
                    },
                    {
                      id: "P-5",
                      title: "Google Play App Signing & Pre-Launch Report",
                      why: "Play App Signing enrollment and 16 KB page-size compatibility verification require Google Play internal track ingestion.",
                      steps: "Upload app-release.aab to Play Console Internal Testing -> Verify 0 crashes or native library warnings in Google Pre-Launch Report -> Install test build via Play Store app."
                    },
                    {
                      id: "P-6",
                      title: "Offline Airplane Mode & SQLite Database Durability",
                      why: "Tests hardware NAND flash synchronization during sudden power cut or OS process kill.",
                      steps: "Turn on Airplane Mode -> Create 3 routines, log meals, log water -> Force stop app via Android Settings -> Reopen app -> Confirm all entries persist without SQLite corruption."
                    }
                  ].map((test) => (
                    <div key={test.id} className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono text-xs font-bold">
                            {test.id}
                          </span>
                          <span className="font-bold text-stone-900 dark:text-white text-sm">
                            {test.title}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                          Pending Physical Run
                        </span>
                      </div>
                      <div className="text-xs text-stone-600 dark:text-stone-400">
                        <strong className="text-stone-700 dark:text-stone-300">Why Hardware Required:</strong> {test.why}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-500 bg-stone-50 dark:bg-stone-950 p-2.5 rounded-lg font-mono">
                        {test.steps}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white dark:bg-stone-900">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Direct Android Studio Workflow
                </h3>
                <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  Click the <strong>Download Android Studio Project (.zip)</strong> button above. Unzip the archive, and open the folder directly in Android Studio Ladybug/Meerkat. Gradle will sync all dependencies automatically from Google Maven and Central repositories.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
                  <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Android 16 (API 36) Compliance
                  </h4>
                  <ul className="mt-3 text-xs space-y-2 text-stone-600 dark:text-stone-300">
                    <li>• <strong>compileSdk 36</strong> & <strong>targetSdk 36</strong> configured</li>
                    <li>• Edge-to-Edge display with Compose Material 3</li>
                    <li>• Notification runtime permission (<code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded">POST_NOTIFICATIONS</code>)</li>
                    <li>• Room 2.6.1 with TypeConverters for ISO local dates</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
                  <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-2 text-sm">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    Health Connect Integration
                  </h4>
                  <ul className="mt-3 text-xs space-y-2 text-stone-600 dark:text-stone-300">
                    <li>• Queries <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded">READ_STEPS</code> with on-device rationale</li>
                    <li>• Aggregates within local midnight-to-midnight boundary</li>
                    <li>• Includes <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded">ACTION_SHOW_PERMISSIONS_RATIONALE</code> filter</li>
                    <li>• Health Connect Toolbox emulator test compatibility</li>
                  </ul>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800">
                <h4 className="font-bold text-stone-900 dark:text-white text-sm">Generating Release App Bundle (AAB)</h4>
                <div className="mt-3 p-3 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs">
                  ./gradlew bundleRelease
                </div>
                <p className="mt-2 text-xs text-stone-500">
                  The signed AAB will be output to <code className="text-emerald-700 font-mono">app/build/outputs/bundle/release/app-release.aab</code> ready for Google Play Console upload.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
