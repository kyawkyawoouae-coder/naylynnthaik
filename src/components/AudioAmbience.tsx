import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const AudioAmbience: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleAudio = () => {
    if (isPlaying) {
      // Stop
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      }
      setTimeout(() => {
        try {
          osc1Ref.current?.stop();
          osc2Ref.current?.stop();
        } catch {}
        setIsPlaying(false);
      }, 500);
    } else {
      // Start Web Audio
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2); // very subtle
        gainNode.connect(ctx.destination);
        gainNodeRef.current = gainNode;

        // Warm sub-bass planetary hum (55 Hz - A1)
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(55, ctx.currentTime);

        // Slow harmonic overtone (110 Hz - A2) with soft detune
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(110, ctx.currentTime);
        osc2.detune.setValueAtTime(4, ctx.currentTime);

        // Lowpass filter for smooth ambient warmth
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(240, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);

        osc1.start();
        osc2.start();

        osc1Ref.current = osc1;
        osc2Ref.current = osc2;
        setIsPlaying(true);
      } catch (err) {
        console.error("Audio ambience failed to start:", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      try {
        osc1Ref.current?.stop();
        osc2Ref.current?.stop();
        audioCtxRef.current?.close();
      } catch {}
    };
  }, []);

  return (
    <button
      id="btn-toggle-ambience"
      onClick={toggleAudio}
      title={isPlaying ? "Mute Atmospheric Soundscape" : "Enable Atmospheric Soundscape"}
      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all backdrop-blur-md border flex items-center gap-2 shadow-sm ${
        isPlaying
          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
          : "bg-slate-900/80 text-slate-400 border-slate-700/60 hover:text-slate-200"
      }`}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">Ambience: On</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ambience: Off</span>
        </>
      )}
    </button>
  );
};
