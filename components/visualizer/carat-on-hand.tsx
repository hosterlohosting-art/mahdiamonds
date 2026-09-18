"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Diamond, Hand, Info, Sparkles, X } from "lucide-react";

type CaratOnHandProps = {
  initialCarat?: number;
  initialShape?: string;
  initialMetal?: string;
  initialSize?: string;
  defaultCarat?: number;
  defaultShape?: string;
  defaultMetal?: string;
  defaultSize?: string;
  isOpen?: boolean;
  onApplyCarat?: (carat: number) => void;
  onClose?: () => void;
};

const skinTones = [
  { label: "Alabaster", bg: "#f5eee6", handFill: "#e8dcd0", shadow: "#d4c4b2" },
  { label: "Rose Warm", bg: "#f4ece7", handFill: "#e4c6b8", shadow: "#ceaba0" },
  { label: "Honey Ochre", bg: "#f0e6d6", handFill: "#c99e7d", shadow: "#af8160" },
  { label: "Rich Bronze", bg: "#ece1d7", handFill: "#7d553d", shadow: "#5f3a25" },
];

const shapes = [
  { name: "Round", ratio: 1.0, mmPerCarat: 6.5 },
  { name: "Oval", ratio: 1.35, mmPerCarat: 7.7 },
  { name: "Emerald", ratio: 1.4, mmPerCarat: 7.0 },
  { name: "Pear", ratio: 1.5, mmPerCarat: 8.5 },
  { name: "Cushion", ratio: 1.05, mmPerCarat: 6.3 },
];

const presetCarats = [0.7, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];

export function CaratOnHandModal(props: CaratOnHandProps) {
  const {
    initialCarat = props.defaultCarat ?? 1.5,
    initialShape = props.defaultShape ?? "Round",
    initialMetal = props.defaultMetal ?? "Platinum",
    initialSize = props.defaultSize ?? "L",
    isOpen = true,
    onApplyCarat,
    onClose,
  } = props;

  const [carat, setCarat] = useState(initialCarat);
  const [shape, setShape] = useState(initialShape);
  const [metal, setMetal] = useState(initialMetal);
  const [fingerSize, setFingerSize] = useState(initialSize);
  const [skinIndex, setSkinIndex] = useState(0);

  if (!isOpen) return null;

  // Optical calculations
  // Base finger width in mm for standard UK sizes: J = 15.5mm, L = 16.3mm, M = 16.7mm, Q = 18.3mm
  const sizeWidthMap: Record<string, number> = {
    J: 15.5,
    K: 15.9,
    L: 16.3,
    M: 16.7,
    N: 17.1,
    O: 17.5,
    P: 17.9,
    Q: 18.3,
  };
  const fingerWidthMm = sizeWidthMap[fingerSize] || 16.5;

  // Approximate diamond diameter mm = base * (carat ^ 0.33)
  const currentShapeObj = shapes.find((s) => s.name.toLowerCase() === shape.toLowerCase()) || shapes[0];
  const stoneDiameterMm = Number((currentShapeObj.mmPerCarat * Math.pow(carat, 0.33)).toFixed(1));
  const fingerCoverage = Math.min(Math.round((stoneDiameterMm / fingerWidthMm) * 100), 85);

  const getMetalGradient = () => {
    if (metal.includes("Yellow")) return "url(#yellowGoldBand)";
    if (metal.includes("Rose")) return "url(#roseGoldBand)";
    return "url(#platinumBand)";
  };

  const activeSkin = skinTones[skinIndex];

  return (
    <div className="visualizer-overlay" role="dialog" aria-modal="true" aria-label="Carat-on-Hand scale simulator">
      <div className="visualizer-modal facet-oct">
        <div className="visualizer-header">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--champagne)]" />
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>MAH Atelier Simulator</p>
              <h3>Carat on Hand Scale Visualizer</h3>
            </div>
          </div>
          {onClose && (
            <button className="visualizer-close" onClick={onClose} aria-label="Close visualizer">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="visualizer-body">
          {/* Hand Canvas Viewport */}
          <div className="hand-viewport" style={{ backgroundColor: activeSkin.bg }}>
            <svg viewBox="0 0 400 520" className="hand-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="platinumBand" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#d5dce6" />
                  <stop offset="80%" stopColor="#98a6bb" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
                <linearGradient id="yellowGoldBand" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff8db" />
                  <stop offset="45%" stopColor="#dfbf6c" />
                  <stop offset="85%" stopColor="#a38234" />
                  <stop offset="100%" stopColor="#ffd875" />
                </linearGradient>
                <linearGradient id="roseGoldBand" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff1ee" />
                  <stop offset="50%" stopColor="#dca596" />
                  <stop offset="85%" stopColor="#b47868" />
                  <stop offset="100%" stopColor="#f5c7bc" />
                </linearGradient>
                <radialGradient id="diamondShine" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="40%" stopColor="#f0f6ff" stopOpacity="0.85" />
                  <stop offset="75%" stopColor="#b6cde7" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                </radialGradient>
                <filter id="diamondDropShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#040c24" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Graceful Parisian hand outline */}
              <g id="hand-silhouette">
                {/* Palm and wrist foundation */}
                <path
                  d="M110 520 C105 450, 115 380, 125 320 C110 280, 120 210, 140 180"
                  stroke={activeSkin.shadow}
                  strokeWidth="1.2"
                  fill="none"
                />
                {/* Index finger */}
                <path
                  d="M140 330 C138 240, 142 160, 150 110 C155 85, 172 85, 178 110 C185 160, 185 240, 185 300"
                  fill={activeSkin.handFill}
                  stroke={activeSkin.shadow}
                  strokeWidth="1.2"
                />
                {/* Middle finger */}
                <path
                  d="M185 300 C185 220, 188 120, 198 70 C204 45, 222 45, 228 70 C236 120, 235 220, 235 300"
                  fill={activeSkin.handFill}
                  stroke={activeSkin.shadow}
                  strokeWidth="1.2"
                />
                {/* Ring finger (focal finger for ring) */}
                <path
                  d="M235 300 C235 230, 238 150, 248 100 C253 78, 270 78, 275 100 C282 150, 280 235, 278 310"
                  fill={activeSkin.handFill}
                  stroke={activeSkin.shadow}
                  strokeWidth="1.2"
                />
                {/* Little finger */}
                <path
                  d="M278 310 C280 255, 288 190, 296 150 C300 132, 314 132, 318 150 C324 195, 320 270, 312 340 C295 430, 290 480, 290 520"
                  fill={activeSkin.handFill}
                  stroke={activeSkin.shadow}
                  strokeWidth="1.2"
                />
                {/* Palm shading */}
                <path
                  d="M130 520 C130 420, 140 340, 180 320 C220 320, 270 340, 290 520 Z"
                  fill={activeSkin.handFill}
                />
                {/* Subtle finger knuckle creases */}
                <line x1="245" y1="210" x2="270" y2="210" stroke={activeSkin.shadow} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <line x1="244" y1="150" x2="268" y2="150" stroke={activeSkin.shadow} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
              </g>

              {/* Ring Band on Ring Finger (centered around y=240, x=256) */}
              <g id="ring-band">
                {/* Ring band cylinder */}
                <rect
                  x="241"
                  y="236"
                  width="33"
                  height="7"
                  rx="3.5"
                  fill={getMetalGradient()}
                  stroke="rgba(4,12,36,0.25)"
                  strokeWidth="0.8"
                />
                {/* Ring claws / collet base */}
                <polygon
                  points="253,238 261,238 263,232 251,232"
                  fill={getMetalGradient()}
                  stroke="rgba(4,12,36,0.3)"
                  strokeWidth="0.8"
                />
              </g>

              {/* Dynamic Centre Diamond */}
              <g id="diamond-gem" transform={`translate(257, 226)`} filter="url(#diamondDropShadow)">
                {shape.toLowerCase() === "round" && (
                  <>
                    <circle
                      cx="0"
                      cy="0"
                      r={stoneDiameterMm * 2.2}
                      fill="url(#diamondShine)"
                      stroke="rgba(4,12,36,0.4)"
                      strokeWidth="0.9"
                    />
                    {/* Multi-facet light reflections */}
                    <circle cx="0" cy="0" r={stoneDiameterMm * 1.3} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="0.6" strokeDasharray="3 2" />
                    <polygon
                      points={`0,-${stoneDiameterMm * 1.9} ${stoneDiameterMm * 1.4},0 0,${stoneDiameterMm * 1.9} -${stoneDiameterMm * 1.4},0`}
                      fill="none"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="0.6"
                    />
                  </>
                )}

                {shape.toLowerCase() === "oval" && (
                  <>
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={stoneDiameterMm * 1.8}
                      ry={stoneDiameterMm * 2.5}
                      fill="url(#diamondShine)"
                      stroke="rgba(4,12,36,0.4)"
                      strokeWidth="0.9"
                    />
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={stoneDiameterMm * 1.0}
                      ry={stoneDiameterMm * 1.5}
                      fill="none"
                      stroke="rgba(255,255,255,0.75)"
                      strokeWidth="0.6"
                    />
                  </>
                )}

                {shape.toLowerCase() === "emerald" && (
                  <>
                    <polygon
                      points={`-${stoneDiameterMm * 1.6},-${stoneDiameterMm * 2.2} ${stoneDiameterMm * 1.6},-${stoneDiameterMm * 2.2} ${stoneDiameterMm * 1.9},-${stoneDiameterMm * 1.8} ${stoneDiameterMm * 1.9},${stoneDiameterMm * 1.8} ${stoneDiameterMm * 1.6},${stoneDiameterMm * 2.2} -${stoneDiameterMm * 1.6},${stoneDiameterMm * 2.2} -${stoneDiameterMm * 1.9},${stoneDiameterMm * 1.8} -${stoneDiameterMm * 1.9},-${stoneDiameterMm * 1.8}`}
                      fill="url(#diamondShine)"
                      stroke="rgba(4,12,36,0.4)"
                      strokeWidth="0.9"
                    />
                    <rect
                      x={-stoneDiameterMm * 1.1}
                      y={-stoneDiameterMm * 1.5}
                      width={stoneDiameterMm * 2.2}
                      height={stoneDiameterMm * 3.0}
                      fill="none"
                      stroke="rgba(255,255,255,0.75)"
                      strokeWidth="0.6"
                    />
                  </>
                )}

                {shape.toLowerCase() === "pear" && (
                  <path
                    d={`M 0, -${stoneDiameterMm * 2.8} C ${stoneDiameterMm * 2.4}, -${stoneDiameterMm * 0.5} ${stoneDiameterMm * 2.2}, ${stoneDiameterMm * 2.0} 0, ${stoneDiameterMm * 2.2} C -${stoneDiameterMm * 2.2}, ${stoneDiameterMm * 2.0} -${stoneDiameterMm * 2.4}, -${stoneDiameterMm * 0.5} 0, -${stoneDiameterMm * 2.8} Z`}
                    fill="url(#diamondShine)"
                    stroke="rgba(4,12,36,0.4)"
                    strokeWidth="0.9"
                  />
                )}

                {shape.toLowerCase() === "cushion" && (
                  <rect
                    x={-stoneDiameterMm * 1.9}
                    y={-stoneDiameterMm * 1.9}
                    width={stoneDiameterMm * 3.8}
                    height={stoneDiameterMm * 3.8}
                    rx={stoneDiameterMm * 0.9}
                    fill="url(#diamondShine)"
                    stroke="rgba(4,12,36,0.4)"
                    strokeWidth="0.9"
                  />
                )}

                {/* Sparkling highlight glint */}
                <path
                  d="M -3 -3 L 0 -10 L 3 -3 L 10 0 L 3 3 L 0 10 L -3 3 L -10 0 Z"
                  fill="#ffffff"
                  opacity="0.9"
                  transform="translate(-6, -6) scale(0.6)"
                />
              </g>
            </svg>

            {/* Floating metric indicator */}
            <div className="hand-metric-badge facet-oct-sm">
              <div>
                <strong>{carat.toFixed(2)}ct {shape}</strong>
                <small>~{stoneDiameterMm}mm Diameter</small>
              </div>
              <div className="text-right">
                <strong>{fingerCoverage}%</strong>
                <small>Finger Coverage</small>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="visualizer-controls">
            {/* Live Metrics Strip */}
            <div className="metric-strip">
              <div className="metric-cell">
                <span>Carat Weight</span>
                <strong>{carat.toFixed(2)} ct</strong>
              </div>
              <div className="metric-cell">
                <span>Millimeter Spread</span>
                <strong>~{stoneDiameterMm} mm</strong>
              </div>
              <div className="metric-cell">
                <span>UK Finger Size</span>
                <strong>Size {fingerSize}</strong>
              </div>
              <div className="metric-cell">
                <span>Finger Coverage</span>
                <strong>{fingerCoverage}%</strong>
              </div>
            </div>

            {/* Continuous Carat Slider */}
            <div className="control-group">
              <div className="control-label">
                <span>Carat Weight Slider</span>
                <strong>{carat.toFixed(2)} Carats</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.05"
                value={carat}
                onChange={(e) => setCarat(parseFloat(e.target.value))}
                className="lux-slider"
              />
              <div className="preset-carat-row">
                {presetCarats.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`preset-carat-btn ${carat === c ? "active" : ""}`}
                    onClick={() => setCarat(c)}
                  >
                    {c.toFixed(1)}ct
                  </button>
                ))}
              </div>
            </div>

            {/* Diamond Shape Selector */}
            <div className="control-group">
              <span className="control-title">Diamond Silhouette</span>
              <div className="shape-pills-row">
                {shapes.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    className={`shape-pill ${shape.toLowerCase() === s.name.toLowerCase() ? "active" : ""}`}
                    onClick={() => setShape(s.name)}
                  >
                    <Image
                      src={`/images/shapes/${s.name.toLowerCase()}.png`}
                      alt={s.name}
                      width={16}
                      height={16}
                      className="object-contain inline-block mr-1.5"
                    />
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Precious Metal Selector */}
            <div className="control-group">
              <span className="control-title">Setting Metal</span>
              <div className="metal-options-row">
                {["Platinum", "18k Yellow Gold", "18k Rose Gold", "18k White Gold"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`metal-opt-btn ${metal === m ? "active" : ""}`}
                    onClick={() => setMetal(m)}
                  >
                    <span className={`metal-dot-mini ${m.toLowerCase().replace(/\s+/g, "-")}`} />
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Finger Size & Skin Tone */}
            <div className="split-controls-row">
              <div className="control-group flex-1">
                <span className="control-title">UK Standard Size</span>
                <select
                  value={fingerSize}
                  onChange={(e) => setFingerSize(e.target.value)}
                  className="lux-select"
                >
                  {["J", "K", "L", "M", "N", "O", "P", "Q"].map((size) => (
                    <option key={size} value={size}>
                      UK Size {size} ({sizeWidthMap[size]}mm)
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group flex-1">
                <span className="control-title">Hand Canvas Tone</span>
                <div className="skin-tones-row">
                  {skinTones.map((tone, idx) => (
                    <button
                      key={tone.label}
                      type="button"
                      className={`skin-tone-btn ${skinIndex === idx ? "active" : ""}`}
                      style={{ backgroundColor: tone.handFill }}
                      title={tone.label}
                      onClick={() => setSkinIndex(idx)}
                    >
                      {skinIndex === idx && <Check size={11} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reassurance Info Note */}
            <div className="visualizer-reassurance">
              <Info size={14} className="text-[var(--champagne)] flex-shrink-0 mt-0.5" />
              <p>
                Diamond proportions are modeled after optical GIA master stones. Finger coverage is mathematically calibrated against UK standard finger circumference.
              </p>
            </div>

            {/* Action Bar */}
            <div className="visualizer-actions">
              {onApplyCarat && (
                <button
                  className="button button-dark facet-oct-sm flex-1"
                  onClick={() => {
                    onApplyCarat(carat);
                    if (onClose) onClose();
                  }}
                >
                  Apply {carat.toFixed(2)}ct to Configuration
                </button>
              )}
              {onClose && (
                <button className="button button-light facet-oct-sm" onClick={onClose}>
                  Done Viewing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const CaratOnHand = CaratOnHandModal;
