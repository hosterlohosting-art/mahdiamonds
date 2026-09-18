"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import {
  Diamond,
  Sparkles,
  Award,
  Eye,
  ArrowRight,
  ShieldCheck,
  Check,
  HelpCircle,
  Maximize2,
  SlidersHorizontal,
} from "lucide-react";

interface DiamondEducationSuiteProps {
  initialTab?: "cut" | "color" | "clarity" | "carat";
  compact?: boolean;
}

export function DiamondEducationSuite({
  initialTab = "cut",
  compact = false,
}: DiamondEducationSuiteProps) {
  const [activeTab, setActiveTab] = useState<"cut" | "color" | "clarity" | "carat">(initialTab);

  // Cut state
  const [cutGrade, setCutGrade] = useState<"ideal" | "shallow" | "deep">("ideal");

  // Color state
  const [colorGrade, setColorGrade] = useState<"D" | "F" | "G" | "H" | "I" | "J">("G");

  // Clarity state
  const [clarityGrade, setClarityGrade] = useState<"FL" | "VVS1" | "VS1" | "VS2" | "SI1">("VS1");

  // Carat state
  const [caratWeight, setCaratWeight] = useState<number>(1.5);

  // Color metadata
  const colorData = {
    D: { label: "Colourless (Icy Pure)", tint: "#F8FAFC", glow: "rgba(230, 240, 255, 0.6)", desc: "The highest grade attainable. Emits pure white brilliance with zero detectable tone under 10× gemmological inspection. Exceptional in solid Platinum." },
    F: { label: "Colourless (Maison Tier)", tint: "#F8F9FA", glow: "rgba(240, 245, 255, 0.5)", desc: "Still graded as completely colourless by GIA/IGI. Indistinguishable from D or E to the naked eye, representing supreme rarity." },
    G: { label: "Near Colourless (The Connoisseur's Choice)", tint: "#FAF9F4", glow: "rgba(255, 252, 240, 0.4)", desc: "The most sought-after grade at MAH Diamonds. Appears completely icy white once mounted, offering extraordinary value without compromise." },
    H: { label: "Near Colourless (Optimal Balance)", tint: "#FAF7EE", glow: "rgba(255, 249, 230, 0.35)", desc: "Shows exceptional optical fire. Slight warmth only detectable when compared loose side-by-side against a D colour master stone." },
    I: { label: "Faint Warmth (Subtle Luster)", tint: "#F7F2E2", glow: "rgba(245, 235, 205, 0.3)", desc: "Possesses a delicate warm glow. Highly recommended for 18k Yellow Gold and 18k Rose Gold settings where metal warmth flatters the stone." },
    J: { label: "Warm Brilliance", tint: "#F5ECD5", glow: "rgba(240, 225, 185, 0.3)", desc: "A soft, candlelit champagne character. Complements romantic vintage and three-stone trilogy designs in warm yellow golds." },
  };

  // Clarity metadata
  const clarityData = {
    FL: { label: "Flawless / Internally Flawless", inclusions: "None visible under 10× optical magnification", eyeClean: "100% Guaranteed", desc: "Less than 0.1% of all world gem-quality diamonds achieve this grade. Utterly free from any internal blemishes." },
    VVS1: { label: "Very Very Slightly Included", inclusions: "Microscopic pinpoints extremely difficult to detect at 10×", eyeClean: "100% Guaranteed", desc: "Minute characteristics invisible to the naked human eye. Reserved for the most discerning collectors." },
    VS1: { label: "Very Slightly Included (Head Gemmologist Choice)", inclusions: "Minor internal crystal characteristics at 10×", eyeClean: "100% Guaranteed", desc: "Our head gemmologist's premier recommendation: indistinguishable from Flawless to the naked eye with substantial investment savings." },
    VS2: { label: "Very Slightly Included (Excellent Value)", inclusions: "Small internal feathers or clouds easily located at 10×", eyeClean: "100% Guaranteed", desc: "Every VS2 stone selected by MAH is strictly verified as 100% eye-clean from every angle." },
    SI1: { label: "Slightly Included", inclusions: "Noticeable inclusions under 10×, typically eye-clean at arm's length", eyeClean: "Verified individually by MAH", desc: "Selected only when inclusions are positioned near the girdle where prongs can discreetly conceal them." },
  };

  // Carat metadata
  const caratData: Record<number, { diameter: string; coverage: string; desc: string }> = {
    0.5: { diameter: "5.15 mm", coverage: "32% finger coverage", desc: "Delicate, understated brilliance. Ideal for slender fingers and dainty pavé bands." },
    0.75: { diameter: "5.90 mm", coverage: "38% finger coverage", desc: "Remarkable everyday proportions with noticeable presence." },
    1.0: { diameter: "6.50 mm", coverage: "44% finger coverage", desc: "The iconic milestone size. Perfect optical balance between prominence and daily comfort." },
    1.5: { diameter: "7.40 mm", coverage: "51% finger coverage", desc: "Substantial finger coverage. Exceptional light refraction and commanding presence." },
    2.0: { diameter: "8.15 mm", coverage: "58% finger coverage", desc: "True Haute Joaillerie scale. Noticeable visual impact from across the room." },
    2.5: { diameter: "8.80 mm", coverage: "64% finger coverage", desc: "Extremely rare and magnificent. Commands attention with breathtaking light play." },
    3.0: { diameter: "9.35 mm", coverage: "70% finger coverage", desc: "Maison Masterpiece caliber. Uncompromising prestige and rare geological grandeur." },
  };

  return (
    <div className={`diamond-education-suite ${compact ? "compact" : ""} facet-oct`}>
      {/* Header */}
      <div className="edu-suite-header">
        <div className="edu-header-emblem">
          <Diamond size={18} />
          <span>The Gemmological Masterclass</span>
        </div>
        <h2>The 4Cs of Certified Diamonds</h2>
        <p>
          Master Cut proportions, Colour spectrums, Clarity benchmarks, and Carat scale to select your stone with total authority.
        </p>
      </div>

      {/* 4Cs Tab Selectors */}
      <div className="edu-tabs-row" role="tablist">
        <button
          type="button"
          className={`edu-tab-pill ${activeTab === "cut" ? "active" : ""}`}
          onClick={() => setActiveTab("cut")}
        >
          <span className="edu-tab-letter">C1</span>
          <span className="edu-tab-title">Cut & Light Performance</span>
        </button>
        <button
          type="button"
          className={`edu-tab-pill ${activeTab === "color" ? "active" : ""}`}
          onClick={() => setActiveTab("color")}
        >
          <span className="edu-tab-letter">C2</span>
          <span className="edu-tab-title">Colour & Purity</span>
        </button>
        <button
          type="button"
          className={`edu-tab-pill ${activeTab === "clarity" ? "active" : ""}`}
          onClick={() => setActiveTab("clarity")}
        >
          <span className="edu-tab-letter">C3</span>
          <span className="edu-tab-title">Clarity & 10× Loupe</span>
        </button>
        <button
          type="button"
          className={`edu-tab-pill ${activeTab === "carat" ? "active" : ""}`}
          onClick={() => setActiveTab("carat")}
        >
          <span className="edu-tab-letter">C4</span>
          <span className="edu-tab-title">Carat & Finger Scale</span>
        </button>
      </div>

      {/* Tab 1: Cut */}
      {activeTab === "cut" && (
        <div className="edu-panel cut-panel">
          <div className="edu-panel-grid">
            <div className="edu-visual-stage">
              <div className={`light-refraction-box cut-${cutGrade}`}>
                {/* SVG Light ray diagram */}
                <svg viewBox="0 0 280 200" className="light-ray-svg" aria-hidden="true">
                  <polygon
                    points={
                      cutGrade === "ideal"
                        ? "70,50 210,50 240,75 140,170 40,75"
                        : cutGrade === "shallow"
                        ? "60,65 220,65 250,80 140,140 30,80"
                        : "80,40 200,40 230,70 140,195 50,70"
                    }
                    className="diamond-facet-outline"
                  />
                  {/* Incident light rays entering crown */}
                  <line x1="100" y1="10" x2="100" y2="50" className="ray-incoming" />
                  <line x1="180" y1="10" x2="180" y2="50" className="ray-incoming" />
                  
                  {/* Refracted rays */}
                  {cutGrade === "ideal" && (
                    <>
                      <path d="M 100,50 L 80,110 L 190,105 L 170,50 L 175,10" className="ray-return" />
                      <path d="M 180,50 L 200,110 L 90,105 L 110,50 L 105,10" className="ray-return" />
                    </>
                  )}
                  {cutGrade === "shallow" && (
                    <>
                      <path d="M 100,65 L 85,105 L 110,140 L 105,185" className="ray-leak" />
                      <path d="M 180,65 L 195,105 L 170,140 L 175,185" className="ray-leak" />
                    </>
                  )}
                  {cutGrade === "deep" && (
                    <>
                      <path d="M 100,40 L 80,120 L 220,90 L 260,95" className="ray-leak" />
                      <path d="M 180,40 L 200,120 L 60,90 L 20,95" className="ray-leak" />
                    </>
                  )}
                </svg>

                <div className="refraction-legend">
                  <span className={`refraction-status status-${cutGrade}`}>
                    {cutGrade === "ideal"
                      ? "✦ Total Internal Reflection (98% Light Return)"
                      : cutGrade === "shallow"
                      ? "⚠ Light Leaks from Bottom (Dull Fish-Eye)"
                      : "⚠ Light Leaks from Sides (Dark Nail-Head)"}
                  </span>
                </div>
              </div>

              <div className="cut-selector-pills">
                <button
                  type="button"
                  className={`cut-btn ${cutGrade === "ideal" ? "active" : ""}`}
                  onClick={() => setCutGrade("ideal")}
                >
                  Triple Excellent (Ideal)
                </button>
                <button
                  type="button"
                  className={`cut-btn ${cutGrade === "shallow" ? "active" : ""}`}
                  onClick={() => setCutGrade("shallow")}
                >
                  Shallow Cut (Windowing)
                </button>
                <button
                  type="button"
                  className={`cut-btn ${cutGrade === "deep" ? "active" : ""}`}
                  onClick={() => setCutGrade("deep")}
                >
                  Deep Cut (Weight Waste)
                </button>
              </div>
            </div>

            <div className="edu-copy-stage">
              <span className="edu-kicker">The Primary Driver of Fire & Scintillation</span>
              <h3>Why Cut Trumps All Other Cs</h3>
              <p>
                Cut grade does not refer to the diamond's shape (such as Round or Oval), but to how masterfully its facets are cut and aligned to reflect light.
              </p>
              
              <div className="edu-specs-table">
                <div className="edu-spec-row">
                  <span>Ideal Table %</span>
                  <strong>54% – 57%</strong>
                </div>
                <div className="edu-spec-row">
                  <span>Ideal Depth %</span>
                  <strong>61.0% – 62.5%</strong>
                </div>
                <div className="edu-spec-row">
                  <span>Crown Angle</span>
                  <strong>34.0° – 35.0°</strong>
                </div>
                <div className="edu-spec-row">
                  <span>Pavilion Angle</span>
                  <strong>40.6° – 41.0°</strong>
                </div>
              </div>

              <div className="edu-maison-promise facet-oct-sm">
                <ShieldCheck size={16} />
                <p>
                  <strong>The MAH Standard:</strong> 100% of our round diamonds are graded <em>Triple Excellent</em> (Cut, Polish, Symmetry) by GIA or IGI.
                </p>
              </div>

              <Link
                href="/diamonds/search?cut=Excellent"
                className="button button-dark facet-oct-sm"
                style={{ marginTop: 16 }}
              >
                Browse Triple Excellent Diamonds <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Colour */}
      {activeTab === "color" && (
        <div className="edu-panel color-panel">
          <div className="edu-panel-grid">
            <div className="edu-visual-stage">
              <div
                className="color-gem-stage"
                style={{
                  background: `radial-gradient(circle, ${colorData[colorGrade].glow} 0%, rgba(255,255,255,0) 70%)`,
                }}
              >
                <div
                  className="color-gem-facet"
                  style={{ backgroundColor: colorData[colorGrade].tint, display: "grid", placeItems: "center" }}
                >
                  <Image
                    src="/images/shapes/round.png"
                    alt={`Colour Grade ${colorGrade} Diamond`}
                    width={84}
                    height={84}
                    className="object-contain"
                  />
                </div>
                <div className="color-grade-badge facet-oct-sm">
                  <strong>Grade {colorGrade}</strong>
                  <small>{colorData[colorGrade].label}</small>
                </div>
              </div>

              <div className="color-slider-track">
                {(["D", "F", "G", "H", "I", "J"] as const).map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    className={`color-step-btn ${colorGrade === grade ? "active" : ""}`}
                    onClick={() => setColorGrade(grade)}
                  >
                    <span>{grade}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="edu-copy-stage">
              <span className="edu-kicker">GIA Colour Grading Scale</span>
              <h3>Colour Grade: {colorGrade}</h3>
              <p>{colorData[colorGrade].desc}</p>

              <div className="metal-pairing-box facet-oct-sm">
                <strong>Recommended Metal Pairing:</strong>
                <p>
                  {colorGrade === "D" || colorGrade === "F"
                    ? "Solid 950 Platinum & 18k White Gold highlight the pristine, icy absence of body tone."
                    : colorGrade === "G" || colorGrade === "H"
                    ? "Flawlessly white in any precious metal: Platinum, White, Yellow, or Rose Gold."
                    : "Magnificent in 18k Yellow Gold or 18k Rose Gold, where the warm alloy enhances the diamond's golden warmth."}
                </p>
              </div>

              <Link
                href={`/diamonds/search?color=${colorGrade}`}
                className="button button-dark facet-oct-sm"
                style={{ marginTop: 16 }}
              >
                Search Grade {colorGrade} Diamonds <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Clarity */}
      {activeTab === "clarity" && (
        <div className="edu-panel clarity-panel">
          <div className="edu-panel-grid">
            <div className="edu-visual-stage">
              <div className="clarity-loupe-stage">
                <div className="loupe-reticle">
                  <div className="loupe-zoom-target">
                    <Image
                      src="/images/shapes/round.png"
                      alt={`Clarity Grade ${clarityGrade} Diamond at 10x`}
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                    {clarityGrade === "VS1" && (
                      <span className="loupe-inclusion pin-1" title="Microscopic pinpoint (invisible to naked eye)" />
                    )}
                    {clarityGrade === "VS2" && (
                      <>
                        <span className="loupe-inclusion pin-1" />
                        <span className="loupe-inclusion feath-1" />
                      </>
                    )}
                    {clarityGrade === "SI1" && (
                      <>
                        <span className="loupe-inclusion pin-1" />
                        <span className="loupe-inclusion pin-2" />
                        <span className="loupe-inclusion cloud-1" />
                      </>
                    )}
                  </div>
                  <span className="loupe-scale-tag">10× Precision Optical Loupe</span>
                </div>
              </div>

              <div className="clarity-step-row">
                {(["FL", "VVS1", "VS1", "VS2", "SI1"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`clarity-step-btn ${clarityGrade === c ? "active" : ""}`}
                    onClick={() => setClarityGrade(c)}
                  >
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="edu-copy-stage">
              <span className="edu-kicker">Internal Inclusions & Optical Purity</span>
              <h3>Clarity: {clarityData[clarityGrade].label}</h3>
              <p>{clarityData[clarityGrade].desc}</p>

              <div className="clarity-metrics-table">
                <div className="edu-spec-row">
                  <span>Microscopic Characteristics:</span>
                  <strong>{clarityData[clarityGrade].inclusions}</strong>
                </div>
                <div className="edu-spec-row">
                  <span>Eye-Clean Guarantee:</span>
                  <strong style={{ color: "#166534" }}>{clarityData[clarityGrade].eyeClean}</strong>
                </div>
              </div>

              <div className="edu-maison-promise facet-oct-sm">
                <Check size={16} />
                <p>
                  <strong>The "Eye-Clean" Secret:</strong> A VS1 or VS2 diamond looks identical to a Flawless stone without a microscope, freeing budget for a larger carat weight or finer cut.
                </p>
              </div>

              <Link
                href={`/diamonds/search?clarity=${clarityGrade}`}
                className="button button-dark facet-oct-sm"
                style={{ marginTop: 16 }}
              >
                Search Grade {clarityGrade} Diamonds <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Carat */}
      {activeTab === "carat" && (
        <div className="edu-panel carat-panel">
          <div className="edu-panel-grid">
            <div className="edu-visual-stage">
              <div className="carat-scale-stage">
                <div
                  className="carat-scale-circle"
                  style={{
                    width: `${parseFloat(caratData[caratWeight].diameter) * 11}px`,
                    height: `${parseFloat(caratData[caratWeight].diameter) * 11}px`,
                  }}
                >
                  <Image
                    src="/images/shapes/round.png"
                    alt={`${caratWeight}ct Diamond Carat Scale`}
                    width={Math.max(28, Math.round(parseFloat(caratData[caratWeight].diameter) * 7))}
                    height={Math.max(28, Math.round(parseFloat(caratData[caratWeight].diameter) * 7))}
                    className="object-contain"
                  />
                  <span className="carat-dim-label">{caratData[caratWeight].diameter}</span>
                </div>
                <span className="carat-note">Direct 1:1 Display Scale · Round Brilliant Profile</span>
              </div>

              <div className="carat-weight-chips">
                {[0.5, 0.75, 1.0, 1.5, 2.0, 2.5, 3.0].map((wt) => (
                  <button
                    key={wt}
                    type="button"
                    className={`carat-chip ${caratWeight === wt ? "active" : ""}`}
                    onClick={() => setCaratWeight(wt)}
                  >
                    {wt.toFixed(2)}ct
                  </button>
                ))}
              </div>
            </div>

            <div className="edu-copy-stage">
              <span className="edu-kicker">Weight & Millimeter Spread</span>
              <h3>{caratWeight.toFixed(2)} Carat Solitaire</h3>
              <p>{caratData[caratWeight].desc}</p>

              <div className="carat-metrics-table">
                <div className="edu-spec-row">
                  <span>Crown Diameter:</span>
                  <strong>{caratData[caratWeight].diameter}</strong>
                </div>
                <div className="edu-spec-row">
                  <span>Standard Finger Coverage:</span>
                  <strong>{caratData[caratWeight].coverage}</strong>
                </div>
              </div>

              <div className="edu-maison-promise facet-oct-sm">
                <Sparkles size={16} />
                <p>
                  <strong>Carat is Weight, Not Size:</strong> A poorly cut 1.50ct stone can appear smaller than an ideally proportioned 1.30ct diamond due to wasted depth. MAH guarantees optimal millimeter spread.
                </p>
              </div>

              <Link
                href={`/diamonds/search?minCarat=${caratWeight}&maxCarat=${caratWeight + 0.5}`}
                className="button button-dark facet-oct-sm"
                style={{ marginTop: 16 }}
              >
                Search {caratWeight.toFixed(2)}ct Diamonds <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
