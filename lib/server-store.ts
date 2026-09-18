import { diamonds, products, type Diamond, type Product } from "./demo-data";

export type SalonLocation = "mayfair" | "hatton-garden" | "virtual";

export type Appointment = {
  id: string;
  salon?: SalonLocation;
  salonName?: string;
  salonAddress?: string;
  consultationType: "In Person" | "Online Consultation" | string;
  consultationSubject: "Engagement Rings" | "Wedding Rings" | "Diamonds" | "Jewellery" | "MAH Bespoke" | "Other" | string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  ringSize?: string;
  notes?: string;
  meetingLink?: string;
  status: "confirmed" | "completed" | "rescheduled" | "cancelled";
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  category: string;
  metal: string;
  size?: string;
  diamondId?: string;
  diamondCarat?: number;
  diamondShape?: string;
  diamondCert?: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  deliveryType: "insured-courier" | "salon-collection";
  salonLocation?: SalonLocation;
  shippingAddress?: {
    line1: string;
    city: string;
    postcode: string;
    country: string;
  };
  packaging: {
    signatureBox: boolean;
    waxSealedDossier: boolean;
    calligraphyGiftCard?: string;
  };
  paymentMethod: "card" | "apple-pay" | "bank-wire";
  subtotal: number;
  vat: number;
  total: number;
  status: "confirmed" | "in-atelier" | "hallmarked" | "dispatched" | "ready-in-salon";
  trackingCode: string;
  items: OrderItem[];
  createdAt: string;
};

export type SavedConfiguration = {
  id: string;
  clientEmail: string;
  title: string;
  product: Product;
  selectedMetal: string;
  selectedSize: string;
  diamond?: Diamond;
  totalPrice: number;
  notes?: string;
  shareId: string;
  savedAt: string;
};

export type BespokeMilestone = {
  step: number;
  title: string;
  subtitle: string;
  status: "completed" | "active" | "upcoming";
  dateCompleted?: string;
  artisanNote?: string;
};

export type BespokeCommission = {
  id: string;
  commissionRef: string;
  clientName: string;
  clientEmail: string;
  pieceTitle: string;
  leadAtelier: string;
  masterGoldsmith: string;
  estimatedCompletion: string;
  currentMilestone: number;
  milestones: BespokeMilestone[];
  createdAt: string;
};

export type Enquiry = {
  id: string;
  enquiryRef: string;
  fullName: string;
  email: string;
  phone?: string;
  interest?: string;
  message: string;
  status: "received" | "reviewed" | "archived";
  createdAt: string;
};

const initialEnquiries: Enquiry[] = [
  {
    id: "ENQ-101",
    enquiryRef: "MAH-ENQ-2026-4821",
    fullName: "Lady Genevieve Sterling",
    email: "genevieve.sterling@example.com",
    phone: "+44 7700 900543",
    interest: "MAH Bespoke",
    message: "Inquiring about creating a bespoke platinum octagonal halo mounting for an heirloom emerald-cut diamond.",
    status: "received",
    createdAt: new Date().toISOString(),
  },
];

// In-memory data store with initial seed data
const initialAppointments: Appointment[] = [
  {
    id: "MAH-APT-2026-8012",
    consultationType: "In Person",
    consultationSubject: "Engagement Rings",
    salonName: "MAH Flagship Salon, London",
    salonAddress: "Private Salon Suites, Mayfair, London W1S",
    date: "2026-09-18",
    timeSlot: "14:00",
    clientName: "Eleanor Vance",
    clientEmail: "eleanor.vance@example.com",
    clientPhone: "+44 7700 900123",
    ringSize: "L",
    notes: "Interested in pairing the Aster Solitaire with a 1.50ct Round GIA diamond.",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
];

const initialOrders: Order[] = [
  {
    id: "ORD-901",
    orderNumber: "MAH-2026-7814",
    clientName: "Harrison Croft",
    clientEmail: "harrison.croft@example.com",
    clientPhone: "+44 7700 900456",
    deliveryType: "salon-collection",
    salonLocation: "mayfair",
    packaging: {
      signatureBox: true,
      waxSealedDossier: true,
      calligraphyGiftCard: "For our next chapter together.",
    },
    paymentMethod: "card",
    subtotal: 7850,
    vat: 0,
    total: 7850,
    status: "in-atelier",
    trackingCode: "GB-MAH-992144",
    items: [
      {
        productId: "ER-001",
        productName: "The Aster Solitaire",
        category: "engagement",
        metal: "Platinum",
        size: "M",
        diamondId: "DIA-001",
        diamondCarat: 1.02,
        diamondShape: "Round",
        diamondCert: "GIA",
        price: 7850,
        quantity: 1,
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const initialVault: SavedConfiguration[] = [
  {
    id: "CFG-101",
    clientEmail: "client@mah.luxury",
    title: "Aster Solitaire in Solid Platinum with 1.50ct Oval",
    product: products[0],
    selectedMetal: "Platinum",
    selectedSize: "L",
    diamond: diamonds.find((d) => d.shape === "Oval"),
    totalPrice: 1850 + (diamonds.find((d) => d.shape === "Oval")?.price || 5600),
    notes: "Considered for London autumn anniversary.",
    shareId: "vlt-ast-oval-92",
    savedAt: new Date().toISOString(),
  },
  {
    id: "CFG-102",
    clientEmail: "client@mah.luxury",
    title: "Elara Trilogy in 18k Yellow Gold with Round Brilliant",
    product: products[2],
    selectedMetal: "18k Yellow Gold",
    selectedSize: "M",
    diamond: diamonds[0],
    totalPrice: 2850 + diamonds[0].price,
    notes: "Bespoke three-stone tribute.",
    shareId: "vlt-elr-rnd-88",
    savedAt: new Date().toISOString(),
  },
];

const initialBespokeCommissions: BespokeCommission[] = [
  {
    id: "BSP-301",
    commissionRef: "MAH-ROYAL-742",
    clientName: "Lady Genevieve Sterling",
    clientEmail: "client@mah.luxury",
    pieceTitle: "The Imperial Cartouche Solitaire with Tapered Baguettes",
    leadAtelier: "London Mayfair & Hatton Garden Atelier",
    masterGoldsmith: "Master Artisan Robert Saint-Clair",
    estimatedCompletion: "24 October 2026",
    currentMilestone: 3,
    milestones: [
      {
        step: 1,
        title: "Initial Salon Consultation & Gouache Sketches",
        subtitle: "Hand-rendered artwork exploring royal cut-corner octagonal motifs.",
        status: "completed",
        dateCompleted: "02 September 2026",
        artisanNote: "Gouache paintings approved with 2.20ct D-Flawless centre diamond pairing.",
      },
      {
        step: 2,
        title: "3D Computer-Aided Design & Wax Carving",
        subtitle: "Micro-tolerance digital sculpting and lost-wax investment model.",
        status: "completed",
        dateCompleted: "08 September 2026",
        artisanNote: "Claw tolerances refined to 0.45mm for maximal diamond light transmission.",
      },
      {
        step: 3,
        title: "950 Platinum Casting & Master Claw Setting",
        subtitle: "Bench casting in solid platinum followed by microscopic pavé bead setting.",
        status: "active",
        artisanNote: "Platinum ring mount cast successfully; centre stone collet undergoing microscope setting.",
      },
      {
        step: 4,
        title: "London Assay Office British Hallmarking & Certification",
        subtitle: "Official British hallmark applied alongside the authentic MAH cartouche mark.",
        status: "upcoming",
      },
      {
        step: 5,
        title: "Final High Polish & Signature Presentation",
        subtitle: "Encased in midnight-blue velvet box with wax-sealed authenticity dossier.",
        status: "upcoming",
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

// In-memory runtime cache with process lifecycle persistence
const store = {
  enquiries: [...initialEnquiries],
  appointments: [...initialAppointments],
  orders: [...initialOrders],
  vault: [...initialVault],
  bespoke: [...initialBespokeCommissions],
  diamonds: [...diamonds],
  processedWebhookEvents: new Set<string>(),
};

// Auto-cleanup helper for expired diamond reservations
function cleanupExpiredReservations() {
  const now = new Date().toISOString();
  for (const diamond of store.diamonds) {
    if (diamond.status === "reserved" && diamond.reservedUntil && diamond.reservedUntil < now) {
      diamond.status = "available";
      diamond.reservedUntil = undefined;
    }
  }
}

const ALL_STANDARD_SLOTS = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

export const serverStore = {
  // Enquiries (Section 18)
  getEnquiries: () => store.enquiries,
  getEnquiryByRef: (ref: string) => store.enquiries.find((e) => e.enquiryRef.toLowerCase() === ref.toLowerCase()),
  addEnquiry: (data: { fullName: string; email: string; phone?: string; interest?: string; message: string }) => {
    const enquiryRef = `MAH-ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEnquiry: Enquiry = {
      id: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
      enquiryRef,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || undefined,
      interest: data.interest?.trim() || "General Enquiry",
      message: data.message.trim(),
      status: "received",
      createdAt: new Date().toISOString(),
    };
    store.enquiries.unshift(newEnquiry);
    return newEnquiry;
  },

  // Appointments
  getAppointments: (date?: string) => {
    if (date) {
      return store.appointments.filter((a) => a.date === date && a.status !== "cancelled");
    }
    return store.appointments;
  },
  getAppointmentById: (id: string) => store.appointments.find((a) => a.id === id),
  isSlotAvailable: (date: string, timeSlot: string): boolean => {
    const booked = store.appointments.some(
      (a) => a.date === date && a.timeSlot === timeSlot && a.status !== "cancelled"
    );
    return !booked;
  },
  getAvailableSlots: (date: string, customSlots?: string[]): string[] => {
    const baseSlots = customSlots || ALL_STANDARD_SLOTS;
    const booked = new Set(
      store.appointments
        .filter((a) => a.date === date && a.status !== "cancelled")
        .map((a) => a.timeSlot)
    );
    return baseSlots.filter((slot) => !booked.has(slot));
  },
  addAppointment: (data: Omit<Appointment, "id" | "createdAt" | "status">) => {
    const aptRef = `MAH-APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isOnline = data.consultationType.toLowerCase().includes("online") || data.consultationType.toLowerCase().includes("virtual");
    const meetingLink = isOnline ? `https://concierge.mahdiamonds.co.uk/v/${Math.random().toString(36).substring(2, 9)}` : undefined;

    const newAppointment: Appointment = {
      ...data,
      id: aptRef,
      meetingLink,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    store.appointments.unshift(newAppointment);
    return newAppointment;
  },
  updateAppointmentStatus: (id: string, status: Appointment["status"], newDate?: string, newTime?: string) => {
    const appointment = store.appointments.find((a) => a.id === id);
    if (appointment) {
      appointment.status = status;
      if (newDate) appointment.date = newDate;
      if (newTime) appointment.timeSlot = newTime;
      return appointment;
    }
    return null;
  },

  // Orders
  getOrders: () => store.orders,
  getOrderById: (id: string) => store.orders.find((o) => o.id === id || o.orderNumber === id),
  addOrder: (data: Omit<Order, "id" | "orderNumber" | "createdAt" | "status" | "trackingCode">) => {
    const orderNumber = `MAH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...data,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber,
      trackingCode: `GB-MAH-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Mark any associated diamonds as sold
    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item.diamondId) {
          serverStore.markDiamondSold(item.diamondId, newOrder.orderNumber);
        }
      }
    }

    store.orders.unshift(newOrder);
    return newOrder;
  },
  updateOrderStatus: (id: string, status: Order["status"]) => {
    const order = store.orders.find((o) => o.id === id || o.orderNumber === id);
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  },

  // Vault
  getVaultItems: (email?: string) => {
    if (!email) return store.vault;
    return store.vault.filter((v) => v.clientEmail.toLowerCase() === email.toLowerCase());
  },
  getVaultItemByShareId: (shareId: string) => store.vault.find((v) => v.shareId === shareId),
  addVaultItem: (data: Omit<SavedConfiguration, "id" | "shareId" | "savedAt">) => {
    const shareId = `vlt-${Math.random().toString(36).substring(2, 9)}`;
    const newItem: SavedConfiguration = {
      ...data,
      id: `CFG-${Math.floor(100 + Math.random() * 900)}`,
      shareId,
      savedAt: new Date().toISOString(),
    };
    store.vault.unshift(newItem);
    return newItem;
  },
  removeVaultItem: (id: string) => {
    store.vault = store.vault.filter((v) => v.id !== id);
    return true;
  },

  // Bespoke
  getBespokeCommissions: (email?: string) => {
    if (!email) return store.bespoke;
    return store.bespoke.filter((b) => b.clientEmail.toLowerCase() === email.toLowerCase());
  },
  getBespokeByRef: (ref: string) => store.bespoke.find((b) => b.commissionRef.toLowerCase() === ref.toLowerCase()),

  // Diamond Inventory & Live Reservation Persistence
  getDiamonds: (filters?: {
    type?: string;
    shape?: string;
    minCarat?: number;
    maxCarat?: number;
    includeReserved?: boolean;
  }) => {
    cleanupExpiredReservations();
    return store.diamonds.filter((d) => {
      if (!filters?.includeReserved && d.status === "sold") return false;
      if (filters?.type && filters.type !== "All" && d.type.toLowerCase() !== filters.type.toLowerCase()) return false;
      if (filters?.shape && filters.shape !== "All" && d.shape.toLowerCase() !== filters.shape.toLowerCase()) return false;
      if (filters?.minCarat && d.carat < filters.minCarat) return false;
      if (filters?.maxCarat && d.carat > filters.maxCarat) return false;
      return true;
    });
  },

  getDiamondById: (id: string) => {
    cleanupExpiredReservations();
    return store.diamonds.find((d) => d.id === id);
  },

  reserveDiamond: (id: string, durationMinutes: number = 30) => {
    cleanupExpiredReservations();
    const diamond = store.diamonds.find((d) => d.id === id);
    if (!diamond) {
      return { success: false, error: "Diamond not found in inventory." };
    }
    if (diamond.status === "sold") {
      return { success: false, error: "Diamond has already been acquired." };
    }
    if (diamond.status === "reserved") {
      return { success: false, error: "Diamond is currently reserved by another client." };
    }

    diamond.status = "reserved";
    diamond.reservedUntil = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
    return { success: true, diamond };
  },

  releaseDiamond: (id: string) => {
    const diamond = store.diamonds.find((d) => d.id === id);
    if (diamond && diamond.status === "reserved") {
      diamond.status = "available";
      diamond.reservedUntil = undefined;
      return true;
    }
    return false;
  },

  markDiamondSold: (id: string, orderId?: string) => {
    const diamond = store.diamonds.find((d) => d.id === id);
    if (diamond) {
      diamond.status = "sold";
      diamond.reservedUntil = undefined;
      return true;
    }
    return false;
  },

  syncDiamonds: (newDiamonds: Diamond[]) => {
    if (Array.isArray(newDiamonds) && newDiamonds.length > 0) {
      store.diamonds = newDiamonds.map(d => ({
        ...d,
        status: d.status || "available",
      }));
      return store.diamonds.length;
    }
    return 0;
  },

  // Authoritative Server-Side Selection Revalidation
  revalidateSelection: (items: Array<{
    productId?: string;
    name?: string;
    category?: string;
    metal?: string;
    diamondId?: string;
    price?: number;
    quantity?: number;
  }>) => {
    cleanupExpiredReservations();
    const errors: string[] = [];
    let authoritativeSubtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const quantity = Math.max(1, item.quantity || 1);
      let calculatedItemPrice = 0;

      // 1. Validate Product
      const prod = products.find((p) => p.id === item.productId || p.name === item.name);
      if (prod) {
        calculatedItemPrice += prod.price;
      } else if (item.price) {
        calculatedItemPrice += item.price;
      }

      // 2. Validate Diamond if attached
      let diamondInfo: Diamond | undefined;
      if (item.diamondId) {
        const foundDiamond = store.diamonds.find((d) => d.id === item.diamondId);
        if (!foundDiamond) {
          errors.push(`Diamond ${item.diamondId} could not be located in live inventory.`);
        } else if (foundDiamond.status === "sold") {
          errors.push(`Diamond ${item.diamondId} (${foundDiamond.carat}ct ${foundDiamond.shape}) is no longer available.`);
        } else {
          diamondInfo = foundDiamond;
          calculatedItemPrice += foundDiamond.price;
        }
      }

      authoritativeSubtotal += calculatedItemPrice * quantity;
      validatedItems.push({
        ...item,
        productId: prod?.id || item.productId || "BESPOKE",
        productName: prod?.name || item.name || "MAH Creation",
        price: calculatedItemPrice,
        diamond: diamondInfo,
        quantity,
      });
    }

    const authoritativeVat = 0; // Included in luxury pricing
    const authoritativeTotal = authoritativeSubtotal + authoritativeVat;

    return {
      valid: errors.length === 0,
      errors,
      authoritativeSubtotal,
      authoritativeVat,
      authoritativeTotal,
      items: validatedItems,
    };
  },

  // Webhook Idempotency Tracking
  hasProcessedWebhook: (eventId: string) => {
    return store.processedWebhookEvents.has(eventId);
  },

  recordWebhookEvent: (eventId: string) => {
    store.processedWebhookEvents.add(eventId);
  },
};
