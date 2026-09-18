import React, { useEffect, useRef, useState, useCallback } from "react";
import { Hotspot, ScenarioId } from "../types";
import { CONTINENTS } from "../data/geoData";
import { RotateCw, ZoomIn, ZoomOut, Eye, Layers, Compass } from "lucide-react";

interface EarthGlobeCanvasProps {
  scenario: ScenarioId;
  year: number;
  hotspots: Hotspot[];
  selectedHotspot: Hotspot | null;
  onSelectHotspot: (hotspot: Hotspot) => void;
  showSeaLevelRise: boolean;
  showHeatAnomaly: boolean;
  onToggleSeaLevel: () => void;
  onToggleHeatAnomaly: () => void;
}

export const EarthGlobeCanvas: React.FC<EarthGlobeCanvasProps> = ({
  scenario,
  year,
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  showSeaLevelRise,
  showHeatAnomaly,
  onToggleSeaLevel,
  onToggleHeatAnomaly,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Globe orientation in degrees
  const [centerLng, setCenterLng] = useState<number>(20);
  const [centerLat, setCenterLat] = useState<number>(15);
  const [zoom, setZoom] = useState<number>(1.05);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);

  // Center on selected hotspot if provided
  useEffect(() => {
    if (selectedHotspot) {
      setCenterLng(selectedHotspot.lng);
      setCenterLat(Math.max(-65, Math.min(65, selectedHotspot.lat)));
      setIsAutoRotate(false);
    }
  }, [selectedHotspot]);

  // Auto-rotation loop
  useEffect(() => {
    let lastTime = performance.now();
    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isAutoRotate && !isDraggingRef.current) {
        setCenterLng((prev) => (prev + 9 * delta) % 360);
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isAutoRotate]);

  // Main canvas render pass
  const renderGlobe = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const baseRadius = Math.min(width, height) * 0.42;
    const radius = baseRadius * zoom;

    const lambda0 = (centerLng * Math.PI) / 180;
    const phi0 = (centerLat * Math.PI) / 180;

    // Project [lng, lat] (deg) to screen [x, y], with visibility flag
    const project = (lng: number, lat: number): { x: number; y: number; visible: boolean; distToLimb: number } => {
      const lambda = (lng * Math.PI) / 180;
      const phi = (lat * Math.PI) / 180;

      const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0);
      const visible = cosC >= 0;

      const x = radius * Math.cos(phi) * Math.sin(lambda - lambda0);
      const y = -radius * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0));

      return {
        x: cx + x,
        y: cy + y,
        visible,
        distToLimb: cosC,
      };
    };

    // 1. Draw outer celestial glow / atmosphere halo
    const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.95, cx, cy, radius * 1.25);
    if (scenario === "green") {
      glowGrad.addColorStop(0, "rgba(16, 185, 129, 0.28)");
      glowGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.12)");
      glowGrad.addColorStop(1, "rgba(6, 182, 212, 0)");
    } else if (scenario === "middle") {
      glowGrad.addColorStop(0, "rgba(56, 189, 248, 0.25)");
      glowGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.1)");
      glowGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
    } else {
      glowGrad.addColorStop(0, "rgba(244, 63, 94, 0.32)");
      glowGrad.addColorStop(0.5, "rgba(234, 88, 12, 0.15)");
      glowGrad.addColorStop(1, "rgba(234, 88, 12, 0)");
    }

    ctx.save();
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Draw Ocean Sphere Disk
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Ocean gradient with depth & spherical curvature
    const oceanGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
    if (scenario === "green") {
      oceanGrad.addColorStop(0, "#083344");
      oceanGrad.addColorStop(0.7, "#0f172a");
      oceanGrad.addColorStop(1, "#020617");
    } else if (scenario === "middle") {
      oceanGrad.addColorStop(0, "#072b42");
      oceanGrad.addColorStop(0.7, "#0c1729");
      oceanGrad.addColorStop(1, "#020617");
    } else {
      // Hotter, stressed oceans
      oceanGrad.addColorStop(0, "#132738");
      oceanGrad.addColorStop(0.7, "#171424");
      oceanGrad.addColorStop(1, "#09050d");
    }

    ctx.fillStyle = oceanGrad;
    ctx.fill();

    // 3. Draw Graticule Lines (Latitude & Longitude)
    ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
    ctx.lineWidth = 0.75;

    // Latitudes: every 30 deg from -60 to 60
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let started = false;
      for (let lng = -180; lng <= 180; lng += 5) {
        const p = project(lng, lat);
        if (p.visible) {
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // Longitudes: every 30 deg
    for (let lng = -180; lng < 180; lng += 30) {
      ctx.beginPath();
      let started = false;
      for (let lat = -80; lat <= 80; lat += 4) {
        const p = project(lng, lat);
        if (p.visible) {
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // 4. Draw Continents
    CONTINENTS.forEach((continent) => {
      ctx.beginPath();
      let anyPointVisible = false;

      continent.coords.forEach((coord, i) => {
        const p = project(coord[0], coord[1]);
        if (p.visible) anyPointVisible = true;

        if (i === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      });
      ctx.closePath();

      if (anyPointVisible) {
        // Continent land fill according to scenario & biome
        let landFill = "#1e293b";
        let landStroke = "#334155";

        if (continent.name === "Antarctica" || continent.name === "Greenland") {
          // Polar Ice Sheets
          if (scenario === "green") {
            landFill = "#e2e8f0";
            landStroke = "#94a3b8";
          } else if (scenario === "middle") {
            landFill = "#cbd5e1";
            landStroke = "#64748b";
          } else {
            // Fragmented / shrunken ice under fossil scenario
            landFill = "#94a3b8";
            landStroke = "#475569";
          }
        } else {
          if (scenario === "green") {
            landFill = "#064e3b"; // Lush regenerated green
            landStroke = "#059669";
          } else if (scenario === "middle") {
            landFill = "#1e293b"; // Temperate / urbanized
            landStroke = "#38bdf8";
          } else {
            landFill = "#382314"; // Arid / stressed
            landStroke = "#e11d48";
          }
        }

        ctx.fillStyle = landFill;
        ctx.fill();

        ctx.strokeStyle = landStroke;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 5. Optional Sea Level Rise Coastline Inundation Overlay
        if (showSeaLevelRise && continent.name !== "Antarctica") {
          ctx.save();
          ctx.strokeStyle = scenario === "fossil" ? "rgba(244, 63, 94, 0.7)" : "rgba(6, 182, 212, 0.75)";
          ctx.lineWidth = scenario === "fossil" ? 3.5 : 2;
          ctx.stroke();

          // Coastal drowned shelf highlight
          ctx.fillStyle = scenario === "fossil" ? "rgba(244, 63, 94, 0.25)" : "rgba(6, 182, 212, 0.25)";
          ctx.fill();
          ctx.restore();
        }
      }
    });

    // 6. Optional Heat Anomaly Heatmap Bands
    if (showHeatAnomaly) {
      const anomalyGrad = ctx.createLinearGradient(0, cy - radius, 0, cy + radius);
      if (scenario === "green") {
        anomalyGrad.addColorStop(0, "rgba(56, 189, 248, 0.2)");
        anomalyGrad.addColorStop(0.3, "rgba(16, 185, 129, 0.15)");
        anomalyGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.25)");
        anomalyGrad.addColorStop(0.7, "rgba(16, 185, 129, 0.15)");
        anomalyGrad.addColorStop(1, "rgba(56, 189, 248, 0.2)");
      } else if (scenario === "middle") {
        anomalyGrad.addColorStop(0, "rgba(245, 158, 11, 0.35)");
        anomalyGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.35)");
        anomalyGrad.addColorStop(1, "rgba(245, 158, 11, 0.35)");
      } else {
        // Severe heat anomaly
        anomalyGrad.addColorStop(0, "rgba(239, 68, 68, 0.55)");
        anomalyGrad.addColorStop(0.5, "rgba(185, 28, 28, 0.7)");
        anomalyGrad.addColorStop(1, "rgba(239, 68, 68, 0.55)");
      }

      ctx.save();
      ctx.fillStyle = anomalyGrad;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.restore();
    }

    // 7. Spherical shading & Fresnel edge rim
    const sphereShader = ctx.createRadialGradient(
      cx - radius * 0.35,
      cy - radius * 0.35,
      radius * 0.2,
      cx,
      cy,
      radius
    );
    sphereShader.addColorStop(0, "rgba(255, 255, 255, 0.04)");
    sphereShader.addColorStop(0.65, "rgba(0, 0, 0, 0)");
    sphereShader.addColorStop(0.92, "rgba(2, 6, 23, 0.5)");
    sphereShader.addColorStop(1, "rgba(2, 6, 23, 0.95)");

    ctx.fillStyle = sphereShader;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // 8. Draw Hotspot Markers (Megacities & Tipping Points)
    hotspots.forEach((spot) => {
      const p = project(spot.lng, spot.lat);
      if (!p.visible) return;

      const isSelected = selectedHotspot?.id === spot.id;
      const isHovered = hoveredHotspot?.id === spot.id;

      // Pulse ring
      const time = performance.now() / 1000;
      const pulse = (Math.sin(time * 3 + spot.lat) + 1) / 2;

      ctx.save();
      ctx.beginPath();
      const markerRadius = isSelected ? 8 : isHovered ? 6 : 4;

      let markerColor = "#38bdf8";
      if (spot.category === "megacity") markerColor = "#a855f7";
      else if (spot.category === "tipping-point") markerColor = "#f43f5e";
      else if (spot.category === "innovation") markerColor = "#eab308";
      else if (spot.category === "ecology") markerColor = "#10b981";

      // Outer ripple
      ctx.arc(p.x, p.y, markerRadius + 3 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = markerColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5 - pulse * 0.3;
      ctx.stroke();

      // Solid center dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, markerRadius, 0, Math.PI * 2);
      ctx.fillStyle = markerColor;
      ctx.globalAlpha = 1;
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();

      // Text label for selected or hovered
      if (isSelected || isHovered) {
        ctx.font = "600 11px 'Space Grotesk', system-ui, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.85)";
        ctx.shadowBlur = 6;
        ctx.fillText(spot.name, p.x, p.y - 12);
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    });

    ctx.restore(); // end clip
  }, [
    centerLng,
    centerLat,
    zoom,
    scenario,
    hotspots,
    selectedHotspot,
    hoveredHotspot,
    showSeaLevelRise,
    showHeatAnomaly,
  ]);

  // Keep re-rendering whenever state updates
  useEffect(() => {
    renderGlobe();
  }, [renderGlobe]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      renderGlobe();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [renderGlobe]);

  // Mouse drag handlers for smooth rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    setIsAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setMousePos({ x: e.clientX, y: e.clientY });

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;

      const sensitivity = 0.35 / zoom;
      setCenterLng((prev) => (prev - dx * sensitivity) % 360);
      setCenterLat((prev) => Math.max(-75, Math.min(75, prev + dy * sensitivity)));

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Check for hotspot hovering
      const width = rect.width;
      const height = rect.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.42 * zoom;

      const lambda0 = (centerLng * Math.PI) / 180;
      const phi0 = (centerLat * Math.PI) / 180;

      let found: Hotspot | null = null;
      for (const spot of hotspots) {
        const lambda = (spot.lng * Math.PI) / 180;
        const phi = (spot.lat * Math.PI) / 180;
        const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0);

        if (cosC >= 0) {
          const x = cx + radius * Math.cos(phi) * Math.sin(lambda - lambda0);
          const y = cy - radius * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0));
          const dist = Math.hypot(mouseX - x, mouseY - y);
          if (dist <= 16) {
            found = spot;
            break;
          }
        }
      }
      setHoveredHotspot(found);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredHotspot) {
      onSelectHotspot(hoveredHotspot);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.max(0.7, Math.min(2.4, prev + delta)));
  };

  return (
    <div
      ref={containerRef}
      id="globe-container"
      className="relative w-full h-full min-h-[440px] flex items-center justify-center overflow-hidden select-none bg-radial from-slate-900/60 via-slate-950 to-slate-950 rounded-2xl border border-slate-800/80 shadow-2xl"
    >
      <canvas
        ref={canvasRef}
        id="earth-canvas-3d"
        className="cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      />

      {/* Floating Globe HUD Overlay Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs font-mono text-cyan-300 shadow-lg">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>
            {Math.abs(Math.round(centerLat))}°{centerLat >= 0 ? "N" : "S"},{" "}
            {Math.abs(Math.round(centerLng))}°{centerLng >= 0 ? "E" : "W"}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">{Math.round(zoom * 100)}%</span>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap gap-1.5 max-w-[280px]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/15 border border-purple-500/30 text-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Megacity
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/15 border border-rose-500/30 text-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Tipping Point
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Ecology
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Innovation
          </span>
        </div>
      </div>

      {/* Layer Toggles & Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-auto">
        <button
          id="btn-toggle-autorotate"
          onClick={() => setIsAutoRotate((prev) => !prev)}
          title={isAutoRotate ? "Pause Orbit" : "Auto Orbit"}
          className={`p-2.5 rounded-xl text-xs font-medium transition-all backdrop-blur-md border shadow-lg flex items-center justify-center ${
            isAutoRotate
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
              : "bg-slate-900/80 text-slate-400 border-slate-700/60 hover:text-slate-200"
          }`}
        >
          <RotateCw className={`w-4 h-4 ${isAutoRotate ? "animate-spin" : ""}`} />
        </button>

        <button
          id="btn-toggle-sealevel"
          onClick={onToggleSeaLevel}
          title="Toggle Sea Level Rise Flooding Map"
          className={`px-2.5 py-2 rounded-xl text-xs font-medium transition-all backdrop-blur-md border shadow-lg flex items-center gap-1.5 ${
            showSeaLevelRise
              ? "bg-cyan-500/25 text-cyan-200 border-cyan-400"
              : "bg-slate-900/80 text-slate-400 border-slate-700/60 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline text-[11px]">Sea Rise Layer</span>
        </button>

        <button
          id="btn-toggle-heatanomaly"
          onClick={onToggleHeatAnomaly}
          title="Toggle Planetary Heat Anomaly"
          className={`px-2.5 py-2 rounded-xl text-xs font-medium transition-all backdrop-blur-md border shadow-lg flex items-center gap-1.5 ${
            showHeatAnomaly
              ? "bg-rose-500/25 text-rose-200 border-rose-400"
              : "bg-slate-900/80 text-slate-400 border-slate-700/60 hover:text-slate-200"
          }`}
        >
          <Eye className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline text-[11px]">Heat Anomaly</span>
        </button>

        <div className="flex flex-col rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 overflow-hidden shadow-lg mt-1">
          <button
            id="btn-zoom-in"
            onClick={() => setZoom((prev) => Math.min(2.4, prev + 0.2))}
            title="Zoom In"
            className="p-2 text-slate-300 hover:bg-slate-800 transition-colors border-b border-slate-800"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="btn-zoom-out"
            onClick={() => setZoom((prev) => Math.max(0.7, prev - 0.2))}
            title="Zoom Out"
            className="p-2 text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredHotspot && !isDraggingRef.current && (
        <div
          id="globe-hover-tooltip"
          className="absolute pointer-events-none z-30 px-3.5 py-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl text-xs max-w-xs transition-opacity duration-150"
          style={{
            left: `${Math.min(window.innerWidth - 280, mousePos.x - (containerRef.current?.getBoundingClientRect().left || 0) + 16)}px`,
            top: `${Math.min(window.innerHeight - 140, mousePos.y - (containerRef.current?.getBoundingClientRect().top || 0) + 16)}px`,
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-slate-100 font-sans">{hoveredHotspot.name}</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
              {hoveredHotspot.region}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
            {hoveredHotspot.year2100Summary[scenario]}
          </p>
          <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>{hoveredHotspot.statusTag}</span>
            <span className="text-cyan-400">Click to explore →</span>
          </div>
        </div>
      )}

      {/* Bottom hint banner */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-400 pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Drag to rotate globe • Scroll to zoom • Click any node to inspect 2100 outlook</span>
      </div>
    </div>
  );
};
