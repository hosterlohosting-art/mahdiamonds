"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Diamond,
  Search,
  Award,
  Download,
  ShieldCheck,
  Eye,
  Maximize2,
  Sparkles,
  ExternalLink,
  X,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { money, type Diamond as DiamondType } from "@/lib/demo-data";
import { toast } from "sonner";

interface DiamondLoupeProps {
  diamond?: DiamondType;
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean;
}

const defaultShowcaseStone: DiamondType = {
  id: "MAH-D-8821",
  shape: "Round",
  carat: 1.50,
  colour: "D",
  clarity: "VVS1",
  cut: "Excellent",
  certificate: "GIA",
  type: "Natural",
  price: 9400,
};

export function DiamondLoupe({
  diamond = defaultShowcaseStone,
  isOpen = true,
  onClose,
  inline = false,
}: DiamondLoupeProps) {
  const [zoomLevel, setZoomLevel] = useState<1 | 5 | 10>(10);
  const [showInclusions, setShowInclusions] = useState(true);
  const [showInscription, setShowInscription] = useState(true);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Certificate serial numbers
  const certNumber =
    diamond.certificate === "GIA"
      ? `6482910${diamond.id.replace(/\D/g, "").slice(0, 3) || "472"}`
      : `LG592019${diamond.id.replace(/\D/g, "").slice(0, 3) || "48"}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setMousePos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
    setIsHovering(true);
  };

  const downloadDossier = () => {
    const certText = `
=====================================================
MAH DIAMONDS LONDON — ATELIER GRADING DOSSIER
Maison Graded Diamond Verification & Provenance
=====================================================

Certificate Authority: ${diamond.certificate}
Certificate Report No: ${certNumber}
Maison Reference:      ${diamond.id}
Date of Grading:       15 August 2024

SPECIFICATIONS:
-----------------------------------------------------
Shape & Cutting Style: ${diamond.shape} Brilliant
Measurements:          ${(Math.sqrt(diamond.carat) * 6.5).toFixed(2)} x ${(Math.sqrt(diamond.carat) * 6.48).toFixed(2)} x ${(Math.sqrt(diamond.carat) * 3.98).toFixed(2)} mm
Carat Weight:          ${diamond.carat.toFixed(2)} carat
Colour Grade:          ${diamond.colour} (Exceptional White +)
Clarity Grade:         ${diamond.clarity}
Cut Grade:             ${diamond.cut}
Polish:                Excellent
Symmetry:              Excellent
Fluorescence:          None

PROPORTIONS:
-----------------------------------------------------
Table Diameter:        57.0%
Total Depth:           61.5%
Crown Angle:           34.5°
Pavilion Angle:        40.8°
Girdle Thickness:      Medium to Slightly Thick, Faceted
Culet:                 None (Pointed)

INSCRIPTION & SECURITY:
-----------------------------------------------------
Laser Inscription:     ${diamond.certificate} ${certNumber}
Atelier Micro-Hallmark: MAH LONDON .950 PLATINUM

Registered Atelier: 14 New Bond Street, Mayfair, London
London Assay Office Hallmarked

(C) MAH Diamonds London. Certified Authentic.
=====================================================
    `.trim();

    const blob = new Blob([certText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MAH_Diamonds_${diamond.certificate}_${certNumber}_Dossier.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Maison Diamond Dossier downloaded successfully");
  };

  const content = (
    <div className="diamond-loupe-card">
      <div className="loupe-header">
        <div className="loupe-title-wrap">
          <span className="loupe-badge facet-oct-sm">10× Precision Loupe</span>
          <h3 className="loupe-title">
            {diamond.carat.toFixed(2)}ct {diamond.shape} · {diamond.clarity} Clarity
          </h3>
          <p className="loupe-subtitle">
            Hover or touch to inspect facet symmetry, microscopic inclusions, and laser girdle inscription.
          </p>
        </div>
        {onClose && !inline && (
          <button
            type="button"
            className="loupe-close-btn"
            onClick={onClose}
            aria-label="Close Inspector"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="loupe-body-grid">
        {/* Interactive Viewer Stage */}
        <div className="loupe-stage-container">
          <div
            ref={containerRef}
            className={`loupe-viewport ${isHovering ? "active-inspect" : ""}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsHovering(true)}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setIsHovering(false)}
          >
            {/* Ambient Background Grid */}
            <div className="loupe-grid-bg" />

            {/* Base Diamond Render */}
            <div className="diamond-facets-base">
              <svg viewBox="0 0 300 300" className="diamond-svg-render">
                <defs>
                  <radialGradient id="loupeDiamondShine" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="40%" stopColor="#e8f0fe" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="#c5d7f2" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#0a1931" stopOpacity="0.85" />
                  </radialGradient>
                  <linearGradient id="facetHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#b3c5e6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Outer Facet Silhouette (Octagonal Brilliant) */}
                <polygon
                  points="150,20 235,55 270,140 235,225 150,260 65,225 30,140 65,55"
                  fill="url(#loupeDiamondShine)"
                  stroke="#c5d7f2"
                  strokeWidth="1.5"
                />

                {/* Star & Kite Facets */}
                <polygon
                  points="150,20 185,85 150,95 115,85"
                  fill="url(#facetHighlight)"
                  stroke="#8fa8cc"
                  strokeWidth="0.8"
                />
                <polygon
                  points="235,55 205,115 185,85 220,70"
                  fill="#ffffff"
                  fillOpacity="0.25"
                  stroke="#8fa8cc"
                  strokeWidth="0.8"
                />
                <polygon
                  points="270,140 205,150 205,115 255,130"
                  fill="url(#facetHighlight)"
                  stroke="#8fa8cc"
                  strokeWidth="0.8"
                />
                <polygon
                  points="235,225 185,195 205,150 240,190"
                  fill="#ffffff"
                  fillOpacity="0.2"
                  stroke="#8fa8cc"
                  strokeWidth="0.8"
                />
                <polygon
                  points="150,260 150,205 185,195 160,240"
                  fill="url(#facetHighlight)"
                  stroke="#8fa8cc"
                  strokeWidth="0.8"
                />
                <polygon
                  points="65,225 115,195 150,205 90,240"
                  fill="#ffffff"
                  fillOpacity="0.25"
                  stroke="#8fa8cc"
                  strokeWidth="0.8"
                />
                <polygon
                  points="30,140 95,150 115,195 45,190"
                  fill="url(#facetHighlight)"
                  stroke="#8fa8cc"
                  strokeWidth="0.8"
                />
                <polygon
                  points="65,55 115,85 95,115 45,70"
                  fill="#ffffff"
                  fillOpacity="0.2"
                  stroke="#8fa8cc"
                  strokeWidth="0.8"
                />

                {/* Central Table Facet */}
                <polygon
                  points="150,95 195,120 195,160 150,185 105,160 105,120"
                  fill="#ffffff"
                  fillOpacity="0.35"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />

                {/* Internal Culet Reflection */}
                <circle cx="150" cy="140" r="3.5" fill="#ffffff" />

                {/* Laser Inscription on Girdle */}
                {showInscription && (
                  <g className="laser-inscription-group">
                    <text
                      x="150"
                      y="26"
                      textAnchor="middle"
                      fill="#e2ecfb"
                      fontSize="5"
                      fontFamily="monospace"
                      letterSpacing="0.6"
                      opacity="0.9"
                    >
                      {diamond.certificate} • {certNumber}
                    </text>
                  </g>
                )}

                {/* Microscopic Inclusions (Clarity Plot) */}
                {showInclusions && (
                  <g className="clarity-plot-inclusions">
                    {/* Minute natural pinpoints typical of VVS1 / VS1 */}
                    <circle cx="138" cy="132" r="1" fill="#e74c3c" opacity="0.75" />
                    <circle cx="170" cy="148" r="0.8" fill="#e74c3c" opacity="0.7" />
                    <line
                      x1="120"
                      y1="152"
                      x2="124"
                      y2="155"
                      stroke="#e74c3c"
                      strokeWidth="0.6"
                      opacity="0.65"
                    />
                  </g>
                )}
              </svg>
            </div>

            {/* Magnifying Loupe Lens (Cursor Tracking or Fixed Focus) */}
            {isHovering && (
              <div
                className="loupe-lens"
                style={{
                  left: `${mousePos.x}%`,
                  top: `${mousePos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Loupe Chrome Bezel */}
                <div className="loupe-bezel">
                  <span className="loupe-magnification-indicator">{zoomLevel}×</span>
                </div>

                {/* Magnified Diamond Interior */}
                <div
                  className="loupe-zoom-target"
                  style={{
                    transform: `translate(${-(mousePos.x * (zoomLevel === 10 ? 3.5 : 2) - 80)}px, ${-(
                      mousePos.y * (zoomLevel === 10 ? 3.5 : 2) -
                      80
                    )}px) scale(${zoomLevel === 10 ? 3.2 : 1.8})`,
                  }}
                >
                  <svg viewBox="0 0 300 300" className="diamond-svg-zoomed">
                    <polygon
                      points="150,20 235,55 270,140 235,225 150,260 65,225 30,140 65,55"
                      fill="#eaf2fc"
                      stroke="#8eb1e0"
                      strokeWidth="1.2"
                    />
                    <polygon
                      points="150,95 195,120 195,160 150,185 105,160 105,120"
                      fill="#ffffff"
                      stroke="#4278c2"
                      strokeWidth="1"
                    />
                    <circle cx="150" cy="140" r="4" fill="#ffffff" />
                    {showInclusions && (
                      <g>
                        <circle cx="138" cy="132" r="1.8" fill="#e74c3c" />
                        <text x="142" y="132" fontSize="4" fill="#e74c3c" fontWeight="bold">
                          Feather (0.01mm)
                        </text>
                        <circle cx="170" cy="148" r="1.4" fill="#e74c3c" />
                        <line
                          x1="120"
                          y1="152"
                          x2="124"
                          y2="155"
                          stroke="#e74c3c"
                          strokeWidth="1"
                        />
                      </g>
                    )}
                    {showInscription && (
                      <g>
                        <rect x="95" y="21" width="110" height="9" fill="#0C1B54" rx="2" />
                        <text
                          x="150"
                          y="27"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="5.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {diamond.certificate} {certNumber}
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>
            )}

            {/* Instruction Callout */}
            {!isHovering && (
              <div className="loupe-prompt">
                <Search size={14} />
                <span>Move cursor over stone for 10× optical inspection</span>
              </div>
            )}
          </div>

          {/* Loupe Controls */}
          <div className="loupe-controls-bar">
            <div className="loupe-mag-buttons">
              <span className="control-label">Magnification:</span>
              {([1, 5, 10] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`mag-btn ${zoomLevel === lvl ? "active" : ""}`}
                  onClick={() => setZoomLevel(lvl)}
                >
                  {lvl}×
                </button>
              ))}
            </div>

            <div className="loupe-toggle-buttons">
              <button
                type="button"
                className={`toggle-feature-btn ${showInclusions ? "active" : ""}`}
                onClick={() => setShowInclusions(!showInclusions)}
              >
                <Eye size={13} />
                <span>Clarity Plot</span>
              </button>
              <button
                type="button"
                className={`toggle-feature-btn ${showInscription ? "active" : ""}`}
                onClick={() => setShowInscription(!showInscription)}
              >
                <Award size={13} />
                <span>Laser Girdle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Diamond Specification & Certificate Dossier Column */}
        <div className="loupe-sidebar">
          <div className="cert-identity-header">
            <div className="cert-laboratory-tag">
              <Award size={16} />
              <span>{diamond.certificate} Verified Dossier</span>
            </div>
            <p className="cert-report-num">Report #{certNumber}</p>
          </div>

          <div className="loupe-spec-table">
            <div className="loupe-spec-row">
              <span>Carat Weight</span>
              <strong>{diamond.carat.toFixed(2)} ct</strong>
            </div>
            <div className="loupe-spec-row">
              <span>Shape & Cut</span>
              <strong>{diamond.shape} ({diamond.cut})</strong>
            </div>
            <div className="loupe-spec-row">
              <span>Colour Grade</span>
              <strong>{diamond.colour} · Exceptional White</strong>
            </div>
            <div className="loupe-spec-row">
              <span>Clarity Grade</span>
              <strong>{diamond.clarity}</strong>
            </div>
            <div className="loupe-spec-row">
              <span>Polish & Symmetry</span>
              <strong>Triple Excellent</strong>
            </div>
            <div className="loupe-spec-row">
              <span>Fluorescence</span>
              <strong>None (Faint Free)</strong>
            </div>
            <div className="loupe-spec-row">
              <span>Diamond Origin</span>
              <strong>{diamond.type} Mined</strong>
            </div>
            <div className="loupe-spec-row">
              <span>Table / Depth Ratio</span>
              <strong>57.0% / 61.5%</strong>
            </div>
          </div>

          <div className="loupe-authenticity-card">
            <div className="auth-row">
              <ShieldCheck size={18} className="text-gold" />
              <div>
                <strong>Atelier Inscription Verified</strong>
                <p>Micro-inscribed on the girdle with laboratory serial number.</p>
              </div>
            </div>
            <div className="auth-row">
              <CheckCircle2 size={18} className="text-gold" />
              <div>
                <strong>London Assay Hallmarked</strong>
                <p>Guaranteed ethical sourcing & strict Kimberley compliance.</p>
              </div>
            </div>
          </div>

          <div className="loupe-action-buttons">
            <button
              type="button"
              className="button button-dark button-wide facet-oct-sm"
              onClick={() => setShowDossierModal(true)}
            >
              <FileText size={15} /> View Full Laboratory Certificate
            </button>
            <button
              type="button"
              className="button button-ghost button-wide"
              onClick={downloadDossier}
            >
              <Download size={14} /> Download Digital Certificate Dossier
            </button>
          </div>
        </div>
      </div>

      {/* Full Certificate Modal */}
      {showDossierModal && (
        <div className="cert-modal-backdrop" onClick={() => setShowDossierModal(false)}>
          <div
            className="cert-modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Laboratory Grading Dossier"
          >
            <div className="cert-modal-header">
              <div className="cert-modal-logo">
                <Image
                  src="/images/brand/mah-emblem.png"
                  alt="MAH Hallmark"
                  width={26}
                  height={39}
                  className="cert-emblem-img"
                />
                <div>
                  <h4>MAH DIAMONDS LONDON</h4>
                  <small>OFFICIAL LABORATORY GRADING REPORT</small>
                </div>
              </div>
              <button
                type="button"
                className="cert-close-btn"
                onClick={() => setShowDossierModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="cert-modal-content">
              <div className="cert-report-header">
                <div className="report-main-info">
                  <span className="report-authority">{diamond.certificate} Report</span>
                  <h2>Report #{certNumber}</h2>
                  <p>Grading Date: 15 August 2024 · Natural Diamond Origin</p>
                </div>
                <div className="cert-qr-box">
                  <div className="cert-qr-placeholder">
                    <span className="qr-sim">■ ■ ■<br />■ □ ■<br />■ ■ ■</span>
                    <small>Scan to Verify</small>
                  </div>
                </div>
              </div>

              <div className="cert-anatomy-grid">
                <div className="cert-proportions-diagram">
                  <h5>Optical Proportions</h5>
                  <div className="proportions-svg-wrap">
                    <svg viewBox="0 0 240 140" className="proportions-svg">
                      {/* Table line */}
                      <line x1="80" y1="25" x2="160" y2="25" stroke="#0C1B54" strokeWidth="2" />
                      <text x="120" y="20" textAnchor="middle" fontSize="10" fontWeight="bold">Table 57%</text>

                      {/* Crown angle lines */}
                      <line x1="80" y1="25" x2="40" y2="60" stroke="#0C1B54" strokeWidth="1.5" />
                      <line x1="160" y1="25" x2="200" y2="60" stroke="#0C1B54" strokeWidth="1.5" />
                      <text x="50" y="42" fontSize="9">34.5°</text>

                      {/* Girdle */}
                      <line x1="40" y1="60" x2="200" y2="60" stroke="#0C1B54" strokeWidth="2.5" />
                      <text x="205" y="63" fontSize="8">Med-Thick</text>

                      {/* Pavilion */}
                      <line x1="40" y1="60" x2="120" y2="120" stroke="#0C1B54" strokeWidth="1.5" />
                      <line x1="200" y1="60" x2="120" y2="120" stroke="#0C1B54" strokeWidth="1.5" />
                      <text x="75" y="98" fontSize="9">40.8°</text>

                      {/* Depth indicator */}
                      <line x1="25" y1="25" x2="25" y2="120" stroke="#888" strokeDasharray="2,2" />
                      <text x="20" y="75" textAnchor="end" fontSize="9">61.5% Depth</text>
                    </svg>
                  </div>
                </div>

                <div className="cert-ratings-list">
                  <h5>Diamond 4Cs Grading Results</h5>
                  <div className="cert-rating-item">
                    <span>Carat Weight</span>
                    <strong>{diamond.carat.toFixed(2)} ct</strong>
                  </div>
                  <div className="cert-rating-item">
                    <span>Colour Grade</span>
                    <strong>{diamond.colour}</strong>
                  </div>
                  <div className="cert-rating-item">
                    <span>Clarity Grade</span>
                    <strong>{diamond.clarity}</strong>
                  </div>
                  <div className="cert-rating-item">
                    <span>Cut Grade</span>
                    <strong>{diamond.cut}</strong>
                  </div>
                  <div className="cert-rating-item">
                    <span>Polish</span>
                    <strong>Excellent</strong>
                  </div>
                  <div className="cert-rating-item">
                    <span>Symmetry</span>
                    <strong>Excellent</strong>
                  </div>
                  <div className="cert-rating-item">
                    <span>Fluorescence</span>
                    <strong>None</strong>
                  </div>
                </div>
              </div>

              <div className="cert-security-footer">
                <div className="security-emblem">
                  <ShieldCheck size={24} />
                  <div>
                    <h6>Tamper-Evident Security Seal</h6>
                    <p>Protected by cryptographic watermark and laser inscription verified under 10× magnification.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="button button-dark facet-oct-sm"
                  onClick={downloadDossier}
                >
                  <Download size={14} /> Download Official Dossier (.txt)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  if (!isOpen) return null;

  return (
    <div className="visualizer-modal-overlay" onClick={onClose}>
      <div className="visualizer-modal-card" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>
  );
}
