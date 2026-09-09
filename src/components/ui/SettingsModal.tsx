import React, { useState } from "react";
import { X, Key, Check } from "lucide-react";
import { getStoredApiKey, setStoredApiKey } from "../../services/aiService";
import { soundEngine } from "../../services/soundService";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    soundEngine.playClick();
    setStoredApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-300"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold font-mono tracking-wider text-cyan-300 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-cyan-400" />
          Settings & Gemini API Setup
        </h3>

        <div className="space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Configure your Google Gemini API Key to enable live conversational
            AI Q&A and dynamic space quiz generation.
          </p>

          <div>
            <label className="text-slate-400 font-semibold mb-1 block">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-2.5 bg-slate-950 border border-cyan-500/30 rounded-xl text-cyan-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : null}
            {saved ? "Key Saved Successfully!" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};
