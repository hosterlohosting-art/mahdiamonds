"use client";

import { useState } from "react";
import { X, Check, Ruler, HelpCircle, Package, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface RingSizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSize?: string;
  onSelectSize?: (size: string) => void;
}

interface SizeRow {
  uk: string;
  us: string;
  eu: string;
  diameterMm: number;
  circumferenceMm: number;
}

const SIZE_CHART: SizeRow[] = [
  { uk: "G", us: "3.5", eu: "45.5", diameterMm: 14.5, circumferenceMm: 45.5 },
  { uk: "H", us: "4.0", eu: "46.8", diameterMm: 14.9, circumferenceMm: 46.8 },
  { uk: "I", us: "4.5", eu: "48.0", diameterMm: 15.3, circumferenceMm: 48.0 },
  { uk: "J", us: "5.0", eu: "49.3", diameterMm: 15.7, circumferenceMm: 49.3 },
  { uk: "K", us: "5.5", eu: "50.6", diameterMm: 16.1, circumferenceMm: 50.6 },
  { uk: "L", us: "6.0", eu: "51.9", diameterMm: 16.5, circumferenceMm: 51.9 },
  { uk: "M", us: "6.5", eu: "53.1", diameterMm: 16.9, circumferenceMm: 53.1 },
  { uk: "N", us: "7.0", eu: "54.4", diameterMm: 17.3, circumferenceMm: 54.4 },
  { uk: "O", us: "7.5", eu: "55.7", diameterMm: 17.7, circumferenceMm: 55.7 },
  { uk: "P", us: "8.0", eu: "57.0", diameterMm: 18.1, circumferenceMm: 57.0 },
  { uk: "Q", us: "8.5", eu: "58.3", diameterMm: 18.5, circumferenceMm: 58.3 },
  { uk: "R", us: "9.0", eu: "59.5", diameterMm: 18.9, circumferenceMm: 59.5 },
  { uk: "S", us: "9.5", eu: "60.8", diameterMm: 19.3, circumferenceMm: 60.8 },
  { uk: "T", us: "10.0", eu: "62.1", diameterMm: 19.7, circumferenceMm: 62.1 },
  { uk: "U", us: "10.5", eu: "63.4", diameterMm: 20.1, circumferenceMm: 63.4 },
  { uk: "V", us: "11.0", eu: "64.6", diameterMm: 20.5, circumferenceMm: 64.6 },
];

export function RingSizeGuideModal({
  isOpen,
  onClose,
  initialSize = "M",
  onSelectSize,
}: RingSizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<"gauge" | "chart" | "tips" | "kit">("gauge");
  const [selectedSizeUk, setSelectedSizeUk] = useState<string>(initialSize);
  const [searchFilter, setSearchFilter] = useState<string>("");
  
  // Kit Request state
  const [kitName, setKitName] = useState("");
  const [kitEmail, setKitEmail] = useState("");
  const [kitAddress, setKitAddress] = useState("");
  const [kitPostalCode, setKitPostalCode] = useState("");
  const [kitSubmitted, setKitSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentSizeObj = SIZE_CHART.find((s) => s.uk === selectedSizeUk) || SIZE_CHART[6];

  const filteredSizes = SIZE_CHART.filter(
    (s) =>
      s.uk.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.us.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.eu.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleApplySize = (size: string) => {
    setSelectedSizeUk(size);
    if (onSelectSize) {
      onSelectSize(size);
      toast.success(`Ring size updated to UK Size ${size}`);
      onClose();
    }
  };

  const handleKitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kitName || !kitAddress || !kitPostalCode) {
      toast.error("Please provide your name and delivery address.");
      return;
    }
    setKitSubmitted(true);
    toast.success("Complimentary Ring Sizer Kit Dispatched", {
      description: `Sent to ${kitName} via 1st Class Royal Mail.`,
    });
  };

  return (
    <div className="bespoke-modal-backdrop size-guide-backdrop" onClick={onClose}>
      <div
        className="bespoke-modal-card facet-oct size-guide-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="size-guide-header">
          <div>
            <span className="eyebrow">Maison Precision · Fit & Sizing</span>
            <h2>Haute Joaillerie Ring Size Guide</h2>
            <p>
              Accurate sizing ensures optimal balance, comfort, and safety for your diamond solitaire.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close size guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="size-guide-tabs">
          <button
            type="button"
            className={`size-tab-btn ${activeTab === "gauge" ? "active" : ""}`}
            onClick={() => setActiveTab("gauge")}
          >
            <Ruler size={14} /> Interactive Gauge
          </button>
          <button
            type="button"
            className={`size-tab-btn ${activeTab === "chart" ? "active" : ""}`}
            onClick={() => setActiveTab("chart")}
          >
            International Conversion
          </button>
          <button
            type="button"
            className={`size-tab-btn ${activeTab === "tips" ? "active" : ""}`}
            onClick={() => setActiveTab("tips")}
          >
            <HelpCircle size={14} /> Expert Advice
          </button>
          <button
            type="button"
            className={`size-tab-btn ${activeTab === "kit" ? "active" : ""}`}
            onClick={() => setActiveTab("kit")}
          >
            <Package size={14} /> Request Free Sizer Kit
          </button>
        </div>

        {/* Tab 1: Interactive Gauge */}
        {activeTab === "gauge" && (
          <div className="size-guide-body gauge-view">
            <div className="gauge-explainer">
              <p>
                Place an existing, well-fitting ring directly against the circle below. Align the <em>inside edge</em> of your ring with the gold circumference ring.
              </p>
            </div>

            <div className="gauge-interactive-stage">
              {/* Virtual Ring Circle calibrated roughly at 3.78px per mm */}
              <div
                className="gauge-circle-container"
                style={{
                  width: `${currentSizeObj.diameterMm * 6}px`,
                  height: `${currentSizeObj.diameterMm * 6}px`,
                }}
              >
                <div className="gauge-circle-inner">
                  <span className="gauge-circle-diameter">
                    {currentSizeObj.diameterMm.toFixed(1)} mm
                  </span>
                  <span className="gauge-circle-size">UK Size {currentSizeObj.uk}</span>
                </div>
                <div className="gauge-crosshair-h" />
                <div className="gauge-crosshair-v" />
              </div>
            </div>

            <div className="gauge-size-slider-wrap">
              <label htmlFor="ring-size-slider">
                <span>Select UK Size: <strong>{currentSizeObj.uk}</strong> (US {currentSizeObj.us} · EU {currentSizeObj.eu})</span>
                <span className="gauge-dim-text">Inside Circumference: {currentSizeObj.circumferenceMm} mm</span>
              </label>
              <div className="gauge-size-chips">
                {SIZE_CHART.map((s) => (
                  <button
                    key={s.uk}
                    type="button"
                    className={`gauge-chip ${selectedSizeUk === s.uk ? "active" : ""}`}
                    onClick={() => setSelectedSizeUk(s.uk)}
                  >
                    {s.uk}
                  </button>
                ))}
              </div>
            </div>

            {onSelectSize && (
              <div className="size-guide-actions">
                <button
                  type="button"
                  className="button button-dark facet-oct-sm"
                  onClick={() => handleApplySize(selectedSizeUk)}
                >
                  Confirm Size {selectedSizeUk} for this Ring
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: International Conversion Table */}
        {activeTab === "chart" && (
          <div className="size-guide-body chart-view">
            <div className="chart-filter-bar">
              <input
                type="text"
                placeholder="Filter sizes (e.g. M, 6.5, 52)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="size-search-input"
              />
              <span className="chart-count-label">
                Showing {filteredSizes.length} standard sizes
              </span>
            </div>

            <div className="size-table-container">
              <table className="size-matrix-table">
                <thead>
                  <tr>
                    <th>UK / Australia</th>
                    <th>US / Canada</th>
                    <th>EU / ISO</th>
                    <th>Inside Diameter</th>
                    <th>Inside Circumference</th>
                    {onSelectSize && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredSizes.map((row) => (
                    <tr
                      key={row.uk}
                      className={selectedSizeUk === row.uk ? "selected-row" : ""}
                    >
                      <td>
                        <strong>UK {row.uk}</strong>
                      </td>
                      <td>US {row.us}</td>
                      <td>EU {row.eu}</td>
                      <td>{row.diameterMm.toFixed(1)} mm</td>
                      <td>{row.circumferenceMm.toFixed(1)} mm</td>
                      {onSelectSize && (
                        <td>
                          <button
                            type="button"
                            className="button button-sm button-ghost facet-oct-sm"
                            onClick={() => handleApplySize(row.uk)}
                          >
                            Choose {row.uk}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Expert Advice */}
        {activeTab === "tips" && (
          <div className="size-guide-body tips-view">
            <div className="tips-grid">
              <div className="tip-card facet-oct-sm">
                <span className="tip-num">01</span>
                <h4>Measure at Room Temperature</h4>
                <p>
                  Finger circumference fluctuates throughout the day based on hydration, exercise, and ambient warmth. We advise taking your measurement in the evening when hands are at standard room temperature.
                </p>
              </div>

              <div className="tip-card facet-oct-sm">
                <span className="tip-num">02</span>
                <h4>Consider Band Width</h4>
                <p>
                  Wider bands (such as 4mm or 5mm wedding rings) fit more snugly than delicate 1.8mm solitaire bands. When ordering a band 4mm or wider, the Maison recommends ordering a half size larger.
                </p>
              </div>

              <div className="tip-card facet-oct-sm">
                <span className="tip-num">03</span>
                <h4>The Knuckle Rule</h4>
                <p>
                  If the base of your finger is noticeably slimmer than your knuckle, choose a size that slides smoothly over the knuckle with gentle resistance, ensuring it will never slip off during daily wear.
                </p>
              </div>

              <div className="tip-card facet-oct-sm">
                <span className="tip-num">04</span>
                <h4>Surprise Proposal Guarantee</h4>
                <p>
                  If you are proposing in secret, choose our standard sample size (UK M / US 6.5). MAH Diamonds includes one complimentary resizing within 90 days of delivery, performed by our Hatton Garden atelier goldsmiths.
                </p>
              </div>
            </div>

            <div className="guarantee-ribbon facet-oct-sm">
              <ShieldCheck size={20} />
              <div>
                <strong>Maison 90-Day Complimentary Resizing</strong>
                <p>
                  Every engagement ring and wedding band includes complimentary insured transit and resizing by our master bench jewellers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Complimentary Sizer Kit */}
        {activeTab === "kit" && (
          <div className="size-guide-body kit-view">
            {kitSubmitted ? (
              <div className="kit-confirmation facet-oct-sm">
                <div className="kit-success-icon">
                  <Check size={28} />
                </div>
                <h3>Sizer Kit Order Confirmed</h3>
                <p>
                  Your complimentary MAH multisizer ring gauge will arrive in a discreet, unbranded envelope within 2-3 business days.
                </p>
                <div className="kit-details">
                  <span>Recipient: <strong>{kitName}</strong></span>
                  <span>Destination: <strong>{kitAddress}, {kitPostalCode}</strong></span>
                </div>
                <button
                  type="button"
                  className="button button-dark facet-oct-sm"
                  onClick={onClose}
                >
                  Return to Creation
                </button>
              </div>
            ) : (
              <form onSubmit={handleKitSubmit} className="kit-form">
                <div className="kit-intro">
                  <Package size={22} />
                  <div>
                    <h4>Request a Complimentary Ring Sizer Kit</h4>
                    <p>
                      Receive an easy-to-use precision multisizer belt delivered to your doorstep free of charge. Packaged in a discreet white envelope without brand markings to keep proposals confidential.
                    </p>
                  </div>
                </div>

                <div className="kit-form-fields">
                  <div className="kit-form-row">
                    <label>
                      <span>Full Name</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lady Amelia Hart"
                        value={kitName}
                        onChange={(e) => setKitName(e.target.value)}
                      />
                    </label>
                    <label>
                      <span>Email Address</span>
                      <input
                        type="email"
                        required
                        placeholder="amelia@example.com"
                        value={kitEmail}
                        onChange={(e) => setKitEmail(e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="kit-form-row">
                    <label style={{ flex: 2 }}>
                      <span>Postal Address</span>
                      <input
                        type="text"
                        required
                        placeholder="Street address & Flat / House number"
                        value={kitAddress}
                        onChange={(e) => setKitAddress(e.target.value)}
                      />
                    </label>
                    <label style={{ flex: 1 }}>
                      <span>Postcode / Zip</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. W1S 3PF"
                        value={kitPostalCode}
                        onChange={(e) => setKitPostalCode(e.target.value)}
                      />
                    </label>
                  </div>
                </div>

                <div className="kit-form-footer">
                  <div className="kit-discreet-note">
                    <Sparkles size={14} />
                    <small>Discreet Packaging · Free Worldwide Royal Mail Dispatch</small>
                  </div>
                  <button type="submit" className="button button-dark facet-oct-sm">
                    Dispatch Free Ring Sizer
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
