"use client";

import React from "react";
import { Mic, Square } from "lucide-react";

interface VoiceVisualizerProps {
  isListening: boolean;
  transcript: string;
  onStop: () => void;
}

export default function VoiceVisualizer({
  isListening,
  transcript,
  onStop,
}: VoiceVisualizerProps) {
  if (!isListening) return null;

  return (
    <div className="absolute inset-x-0 bottom-24 mx-auto max-w-xl px-4 z-30 animate-fade-in">
      <div className="bg-slate-900/95 backdrop-blur-md border border-red-500/40 rounded-2xl p-4 shadow-2xl shadow-red-500/10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 w-full justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute" />
              <span className="w-3 h-3 rounded-full bg-red-500 relative" />
            </div>
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Listening to voice input...
            </span>
          </div>

          <button
            onClick={onStop}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 text-xs font-medium transition-colors"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop Recording</span>
          </button>
        </div>

        {/* Animated Sound Wave Bars */}
        <div className="flex items-center gap-1.5 h-8 my-1">
          {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 65, 35].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-red-500 to-pink-400 rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 0.08}s`,
                animationDuration: "0.6s",
              }}
            />
          ))}
        </div>

        {/* Real-time Transcription text preview */}
        <div className="w-full text-center px-4 text-xs text-slate-200 italic min-h-[20px] truncate">
          {transcript || "Speak now in English, Telugu, or Hindi..."}
        </div>
      </div>
    </div>
  );
}
