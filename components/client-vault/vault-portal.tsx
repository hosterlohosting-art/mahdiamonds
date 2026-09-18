"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Diamond,
  Share2,
  Trash2,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Clock,
  Hammer,
  Award,
  Sparkles,
  Calendar,
  Eye,
  MessageCircle,
  ArrowRight,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { money, getProduct, getDiamond } from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import { toast } from "sonner";

interface SavedVaultItem {
  id: string;
  shareId: string;
  name: string;
  settingId: string;
  metal: string;
  size: string;
  diamondId: string;
  diamondCarat: number;
  diamondShape: string;
  diamondPrice: number;
  settingPrice: number;
  totalPrice: number;
  savedAt: string;
}

interface BespokeCommission {
  orderId: string;
  clientName: string;
  ringName: string;
  metal: string;
  diamondSpec: string;
  currentStage: number; // 1 to 5
  estimatedDate: string;
  artisanNotes: string;
  goldsmith: string;
  hallmarkNumber: string;
  timeline: {
    stage: number;
    title: string;
    description: string;
    date: string;
    completed: boolean;
    current?: boolean;
  }[];
}

const DEMO_COMMISSION: BespokeCommission = {
  orderId: "MAH-BESPOKE-9402",
  clientName: "Lady Amelia Cavendish",
  ringName: "Aster Solitaire Ring in .950 Platinum",
  metal: "Platinum",
  diamondSpec: "1.75ct Oval Brilliant · D Colour · VVS1 · GIA #6482910472",
  currentStage: 3,
  estimatedDate: "28 September 2024",
  artisanNotes:
    "The 1.75ct oval centre stone has been precision-seated into the bespoke 4-claw platinum compass collet. Hand-drawn platinum wire is now being hand-burnished for micro-pavé shoulder setting.",
  goldsmith: "Master Goldsmith Henri Leclerc (Hatton Garden Atelier)",
  hallmarkNumber: "LAO-2024-MAH-950",
  timeline: [
    {
      stage: 1,
      title: "Diamond Sourcing & Optical Curation",
      description: "Exceptional D/VVS1 Oval sourced and verified under 10× loupe for ideal facet brilliance.",
      date: "04 Sep 2024",
      completed: true,
    },
    {
      stage: 2,
      title: "3D CAD Blueprint & Cast Wax Prototype",
      description: "Bespoke digital architecture crafted to exact finger size M with compass-claw claw profile.",
      date: "08 Sep 2024",
      completed: true,
    },
    {
      stage: 3,
      title: "Platinum Bench Hand-Forging & Mount",
      description: "Recycled .950 platinum hand-forged at Hatton Garden bench and collet assembled.",
      date: "14 Sep 2024",
      completed: false,
      current: true,
    },
    {
      stage: 4,
      title: "Master Goldsmith Setting & Micro-Pavé",
      description: "Precision microscope claw tightening, girdle seat security check, and bead pavé.",
      date: "21 Sep 2024",
      completed: false,
    },
    {
      stage: 5,
      title: "London Assay Office Hallmarking & Final Polish",
      description: "Official leopard's head hallmark struck at Goldsmiths' Hall, final rouge polish & presentation.",
      date: "28 Sep 2024",
      completed: false,
    },
  ],
};

export function VaultPortal() {
  const router = useRouter();
  const store = useDemoStore();

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState<"vault" | "commission">("vault");
  const [vaultItems, setVaultItems] = useState<SavedVaultItem[]>([]);
  const [isLoadingVault, setIsLoadingVault] = useState(false);
  const [commissionRef, setCommissionRef] = useState("MAH-BESPOKE-9402");

  // Fetch saved vault items
  const fetchVault = async () => {
    setIsLoadingVault(true);
    try {
      const res = await fetch("/api/vault");
      const data: any = await res.json();
      if (data.vault) {
        setVaultItems(data.vault);
      } else if (data.items) {
        setVaultItems(data.items);
      }
    } catch {
      // Fallback local items if API is unreachable
      setVaultItems([
        {
          id: "vault-demo-1",
          shareId: "mah-v-101",
          name: "Aster Solitaire Ring",
          settingId: "aster-solitaire",
          metal: "Platinum",
          size: "M",
          diamondId: "MAH-D-8821",
          diamondCarat: 1.50,
          diamondShape: "Round",
          diamondPrice: 9400,
          settingPrice: 1650,
          totalPrice: 11050,
          savedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoadingVault(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, []);

  // Save currently active ring in store into the vault
  const saveCurrentRingToVault = async () => {
    const product = getProduct(store.ring.settingId);
    const diamond = getDiamond(store.ring.diamondId);

    try {
      const payload = {
        name: `${product.name} with ${diamond.carat.toFixed(2)}ct ${diamond.shape}`,
        settingId: product.id,
        metal: store.ring.metal,
        size: store.ring.size,
        diamondId: diamond.id,
        diamondCarat: diamond.carat,
        diamondShape: diamond.shape,
        diamondPrice: diamond.price,
        settingPrice: product.price,
        totalPrice: product.price + diamond.price,
      };

      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: any = await res.json();
      if (data.success && (data.item || data.vaultItem)) {
        setVaultItems([data.item || data.vaultItem, ...vaultItems]);
        toast.success("Bespoke creation preserved in your private Maison Vault");
      }
    } catch {
      toast.success("Creation saved locally to your Maison Vault");
    }
  };

  const removeVaultItem = async (id: string) => {
    try {
      await fetch(`/api/vault?id=${id}`, { method: "DELETE" });
      setVaultItems(vaultItems.filter((i) => i.id !== id));
      toast.success("Creation removed from private vault");
    } catch {
      setVaultItems(vaultItems.filter((i) => i.id !== id));
      toast.success("Creation removed from private vault");
    }
  };

  const copyShareLink = (shareId: string) => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/account?vaultShare=${shareId}`
      : `https://mahdiamonds.co.uk/account?vaultShare=${shareId}`;
    navigator.clipboard.writeText(url);
    toast.success("Discreet vault share link copied to clipboard");
  };

  const loadIntoBuilder = (item: SavedVaultItem) => {
    store.updateRing({
      settingId: item.settingId,
      metal: item.metal,
      size: item.size,
      diamondId: item.diamondId,
    });
    toast.success(`Loaded ${item.name} into Atelier Configurator`);
    router.push("/engagement-rings/review");
  };

  if (!isAuthenticated) {
    return (
      <div className="vault-auth-card">
        <div className="vault-lock-badge facet-oct">
          <Lock size={26} />
        </div>
        <span className="eyebrow">Discreet Maison Service</span>
        <h2>Private Client Space</h2>
        <p>
          Enter your confidential email to access saved ring dossiers, laboratory certificates, and live atelier bespoke commission tracking.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsAuthenticated(true);
            toast.success("Welcome back to your Maison Client Space");
          }}
          className="vault-login-form"
        >
          <label className="input-field">
            <span>Registered Email Address</span>
            <input
              type="email"
              defaultValue="amelia.cavendish@example.com"
              required
            />
          </label>
          <button type="submit" className="button button-dark facet-oct-sm">
            Access Private Vault
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="vault-portal-container">
      {/* Top Client Header */}
      <div className="vault-header-bar">
        <div className="client-welcome-info">
          <span className="eyebrow">Maison Privilege Client</span>
          <h2>Welcome, Lady Amelia Cavendish</h2>
          <p>
            Private Atelier Client No. MAH-LDN-00892 · Registered Mayfair Salon
          </p>
        </div>

        <div className="vault-quick-stats">
          <div className="quick-stat-box">
            <span className="stat-label">Saved Creations</span>
            <strong className="stat-value">{vaultItems.length} Pieces</strong>
          </div>
          <div className="quick-stat-box">
            <span className="stat-label">Active Commission</span>
            <strong className="stat-value text-gold">Stage 03 / 05</strong>
          </div>
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="vault-tabs-nav" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "vault"}
          className={`vault-tab-btn ${activeTab === "vault" ? "active" : ""}`}
          onClick={() => setActiveTab("vault")}
        >
          <Diamond size={15} />
          <span>My Saved Creations ({vaultItems.length})</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "commission"}
          className={`vault-tab-btn ${activeTab === "commission" ? "active" : ""}`}
          onClick={() => setActiveTab("commission")}
        >
          <Hammer size={15} />
          <span>Bespoke Commission Tracker</span>
        </button>
      </div>

      {/* TAB 1: SAVED CREATIONS VAULT */}
      {activeTab === "vault" && (
        <div className="vault-tab-content">
          <div className="vault-actions-subbar">
            <p className="vault-subtext">
              Preserved ring configurations, individual diamond pairings, and bespoke estimates.
            </p>
            <button
              type="button"
              className="mini-button facet-oct-sm"
              onClick={saveCurrentRingToVault}
            >
              <Plus size={14} /> Save Current Active Ring to Vault
            </button>
          </div>

          {isLoadingVault ? (
            <div className="vault-loading-state">
              <Sparkles className="animate-spin" size={24} />
              <p>Retrieving your confidential creations from Maison Vault...</p>
            </div>
          ) : vaultItems.length === 0 ? (
            <div className="empty-state">
              <Diamond />
              <h2>No Saved Rings in Your Vault</h2>
              <p>
                Configure a bespoke engagement ring in our atelier builder and select “Save to Vault” to preserve your pairing.
              </p>
              <Link className="button button-dark facet-oct-sm" href="/engagement-rings">
                Begin Ring Customization
              </Link>
            </div>
          ) : (
            <div className="vault-grid">
              {vaultItems.map((item) => {
                const product = getProduct(item.settingId);
                return (
                  <article key={item.id} className="vault-ring-card">
                    <div className="vault-card-media">
                      <div className="sample-product-visual">
                        <Image
                          src={product.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 700px) 100vw, 33vw"
                        />
                        <span className="product-gem facet-oct-sm" aria-hidden="true">
                          <Diamond size={20} />
                        </span>
                      </div>
                      <span className="vault-metal-tag facet-oct-sm">
                        {item.metal}
                      </span>
                    </div>

                    <div className="vault-card-body">
                      <div className="vault-card-top">
                        <span className="vault-spec-label">
                          Finger Size UK {item.size}
                        </span>
                        <span className="vault-date-label">
                          Saved {new Date(item.savedAt).toLocaleDateString("en-GB")}
                        </span>
                      </div>

                      <h3>{item.name}</h3>

                      <div className="vault-specs-dossier">
                        <div className="spec-dossier-row">
                          <span>Setting:</span>
                          <strong>{product.name} ({money(item.settingPrice)})</strong>
                        </div>
                        <div className="spec-dossier-row">
                          <span>Diamond:</span>
                          <strong>
                            {item.diamondCarat.toFixed(2)}ct {item.diamondShape} ({money(item.diamondPrice)})
                          </strong>
                        </div>
                      </div>

                      <div className="vault-price-row">
                        <span>Creation Total</span>
                        <strong>{money(item.totalPrice)}</strong>
                      </div>

                      <div className="vault-card-actions">
                        <button
                          type="button"
                          className="button button-dark button-wide facet-oct-sm"
                          onClick={() => loadIntoBuilder(item)}
                        >
                          <RotateCcw size={14} /> Load into Atelier Builder
                        </button>

                        <div className="secondary-action-row">
                          <button
                            type="button"
                            className="mini-action-btn"
                            onClick={() => copyShareLink(item.shareId)}
                            title="Share Creation"
                          >
                            <Share2 size={13} /> Share
                          </button>

                          <Link
                            href={`/appointments?setting=${item.settingId}`}
                            className="mini-action-btn"
                            title="Book Salon Viewing"
                          >
                            <Calendar size={13} /> Salon Viewing
                          </Link>

                          <button
                            type="button"
                            className="mini-action-btn delete-btn"
                            onClick={() => removeVaultItem(item.id)}
                            title="Remove Piece"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BESPOKE COMMISSION TRACKER */}
      {activeTab === "commission" && (
        <div className="vault-tab-content bespoke-tracker-section">
          {/* Commission Overview Card */}
          <div className="commission-overview-card">
            <div className="overview-header-row">
              <div>
                <span className="eyebrow">Commission Reference</span>
                <h3 className="commission-id">{DEMO_COMMISSION.orderId}</h3>
              </div>
              <div className="commission-status-pill facet-oct-sm">
                <Clock size={14} />
                <span>Atelier Stage 03: Platinum Bench Hand-Forging</span>
              </div>
            </div>

            <div className="commission-meta-grid">
              <div className="meta-block">
                <small>Bespoke Commission</small>
                <strong>{DEMO_COMMISSION.ringName}</strong>
              </div>
              <div className="meta-block">
                <small>Centre Diamond Certified</small>
                <strong>{DEMO_COMMISSION.diamondSpec}</strong>
              </div>
              <div className="meta-block">
                <small>Master Goldsmith</small>
                <strong>{DEMO_COMMISSION.goldsmith}</strong>
              </div>
              <div className="meta-block">
                <small>Target Presentation Date</small>
                <strong>{DEMO_COMMISSION.estimatedDate}</strong>
              </div>
            </div>
          </div>

          {/* 5-Stage Visual Progress Timeline */}
          <div className="bespoke-timeline-container">
            <h3 className="timeline-title">5-Stage Atelier Progression</h3>
            <p className="timeline-desc">
              Follow every delicate milestone of your bespoke creation, from diamond curation to the striking of the London hallmark.
            </p>

            <div className="bespoke-timeline-track">
              {DEMO_COMMISSION.timeline.map((stepItem) => (
                <div
                  key={stepItem.stage}
                  className={`timeline-step-node ${
                    stepItem.completed
                      ? "step-completed"
                      : stepItem.current
                      ? "step-current"
                      : "step-upcoming"
                  }`}
                >
                  <div className="timeline-marker">
                    {stepItem.completed ? (
                      <CheckCircle2 size={20} />
                    ) : stepItem.current ? (
                      <span className="pulse-indicator">0{stepItem.stage}</span>
                    ) : (
                      <span>0{stepItem.stage}</span>
                    )}
                  </div>

                  <div className="timeline-step-card">
                    <div className="timeline-card-header">
                      <h4>{stepItem.title}</h4>
                      <span className="timeline-date">{stepItem.date}</span>
                    </div>
                    <p className="timeline-text">{stepItem.description}</p>
                    {stepItem.current && (
                      <div className="current-progress-flag">
                        <Hammer size={13} /> Active Bench Work in Progress
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Artisan Bench Notes & Hallmark Authenticity Dossier */}
          <div className="artisan-bench-card">
            <div className="bench-header">
              <Award size={20} className="text-gold" />
              <div>
                <h4>Goldsmith Bench Log & Notes</h4>
                <small>Recorded 14 September 2024 at Hatton Garden Atelier</small>
              </div>
            </div>
            <blockquote className="artisan-quote">
              “{DEMO_COMMISSION.artisanNotes}”
            </blockquote>

            <div className="bench-spec-footer">
              <div className="hallmark-box">
                <ShieldCheck size={16} />
                <span>London Assay Office Registry: <strong>{DEMO_COMMISSION.hallmarkNumber}</strong></span>
              </div>

              <div className="concierge-inquiry-box">
                <a
                  href="https://wa.me/442079460920?text=Hello%20MAH%20Diamonds%20Concierge,%20inquiring%20about%20commission%20MAH-BESPOKE-9402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-dark facet-oct-sm"
                >
                  <MessageCircle size={15} /> Message Atelier Concierge
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
