"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  Building2,
  Video,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Phone,
  Mail,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  HelpCircle,
  RotateCcw,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export type ConsultationType = "In Person" | "Online Consultation";

export type ConsultationSubject =
  | "Engagement Rings"
  | "Wedding Rings"
  | "Diamonds"
  | "Jewellery"
  | "MAH Bespoke"
  | "Other";

const CONSULTATION_TYPES_CONFIG: {
  id: ConsultationType;
  title: string;
  description: string;
  icon: typeof Building2;
}[] = [
  {
    id: "In Person",
    title: "In Person",
    description: "Meet with an MAH expert for a dedicated consultation.",
    icon: Building2,
  },
  {
    id: "Online Consultation",
    title: "Online Consultation",
    description: "A virtual consultation from wherever you are.",
    icon: Video,
  },
];

const CONSULTATION_SUBJECTS_CONFIG: ConsultationSubject[] = [
  "Engagement Rings",
  "Wedding Rings",
  "Diamonds",
  "Jewellery",
  "MAH Bespoke",
  "Other",
];

const STANDARD_TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function SalonBooking() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | "confirmed">(1);
  const [consultationType, setConsultationType] = useState<ConsultationType>("In Person");
  const [consultationSubject, setConsultationSubject] = useState<ConsultationSubject>("Engagement Rings");

  // Date selection state
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  // Default selected date: tomorrow
  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(defaultDate);
  const [selectedTime, setSelectedTime] = useState<string>("11:00");
  const [availableSlots, setAvailableSlots] = useState<string[]>(STANDARD_TIME_SLOTS);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);

  // Client Details Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  // Reschedule & Cancel Modal States
  const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [rescheduleDate, setRescheduleDate] = useState<string>(selectedDate);
  const [rescheduleTime, setRescheduleTime] = useState<string>("14:00");
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  // Timezone display
  const [clientTimezone, setClientTimezone] = useState<string>("United Kingdom Time (GMT+1 / BST)");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        setClientTimezone(tz.includes("Europe/London") ? "United Kingdom Time (GMT+1 / BST)" : `UK Time (GMT+1) · Detected: ${tz}`);
      }
    } catch {}
  }, []);

  // Live Slot Availability Query
  useEffect(() => {
    if (selectedDate) {
      setIsLoadingSlots(true);
      fetch(`/api/appointments?date=${encodeURIComponent(selectedDate)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: any) => {
          if (data && Array.isArray(data.availableSlots)) {
            setAvailableSlots(data.availableSlots);
            // If current selected time is not in available slots, fallback to first available
            if (!data.availableSlots.includes(selectedTime) && data.availableSlots.length > 0) {
              setSelectedTime(data.availableSlots[0]);
            }
          } else {
            setAvailableSlots(STANDARD_TIME_SLOTS);
          }
        })
        .catch(() => {
          setAvailableSlots(STANDARD_TIME_SLOTS);
        })
        .finally(() => {
          setIsLoadingSlots(false);
        });
    }
  }, [selectedDate]);

  // Calendar calculations
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Monday-based day of week (0 = Mon, 6 = Sun)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days: Array<{
      dayNumber: number;
      dateString: string;
      isCurrentMonth: boolean;
      isPast: boolean;
      isSelected: boolean;
      isToday: boolean;
    }> = [];

    // Previous month padding
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevDate = new Date(currentYear, currentMonth - 1, dayNum);
      const dateStr = prevDate.toISOString().split("T")[0];
      days.push({
        dayNumber: dayNum,
        dateString: dateStr,
        isCurrentMonth: false,
        isPast: true,
        isSelected: false,
        isToday: false,
      });
    }

    // Current month days
    const todayStr = new Date().toISOString().split("T")[0];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      // Format as YYYY-MM-DD using local time
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const d = String(dateObj.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${d}`;

      const isPast = dateStr < todayStr;
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === todayStr;

      days.push({
        dayNumber: day,
        dateString: dateStr,
        isCurrentMonth: true,
        isPast,
        isSelected,
        isToday,
      });
    }

    // Next month padding to complete 35 or 42 grid slots
    const totalSlots = days.length <= 35 ? 35 : 42;
    const remainingSlots = totalSlots - days.length;
    for (let day = 1; day <= remainingSlots; day++) {
      const nextDate = new Date(currentYear, currentMonth + 1, day);
      const dateStr = nextDate.toISOString().split("T")[0];
      days.push({
        dayNumber: day,
        dateString: dateStr,
        isCurrentMonth: false,
        isPast: false,
        isSelected: false,
        isToday: false,
      });
    }

    return days;
  }, [currentMonth, currentYear, selectedDate]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Step 4 Validation -> Go to Step 5 Review
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Please provide your full name.";
    }

    if (!formData.email.trim()) {
      errors.email = "Please provide your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email address (e.g. name@domain.com).";
      }
    }

    if (!selectedDate) {
      errors.date = "Please select an appointment date.";
    }

    if (!selectedTime) {
      errors.time = "Please select an appointment time slot.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Please complete the required details before continuing.");
      return;
    }

    setFieldErrors({});
    setBookingError(null);
    setCurrentStep(5);
  };

  // Step 5: Final Submission with Recheck
  const handleFinalBookingSubmission = async () => {
    setIsSubmitting(true);
    setBookingError(null);

    try {
      const payload = {
        consultationType,
        consultationSubject,
        date: selectedDate,
        timeSlot: selectedTime,
        clientName: formData.fullName.trim(),
        clientEmail: formData.email.trim(),
        clientPhone: formData.phone.trim(),
        notes: formData.notes.trim(),
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: any = await res.json();

      if (res.status === 409 || data.isUnavailable) {
        // Double booking detected
        setBookingError(
          data.error || "The selected slot has just been booked. Please choose an alternative time."
        );
        if (Array.isArray(data.availableAlternatives)) {
          setAvailableSlots(data.availableAlternatives);
          if (data.availableAlternatives.length > 0) {
            setSelectedTime(data.availableAlternatives[0]);
          }
        }
        toast.error("Time slot no longer available. Please select an alternative time.");
        setCurrentStep(3); // Jump back to Date & Time while preserving other details
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to schedule appointment.");
      }

      setConfirmedBooking(data.appointment);
      setCurrentStep("confirmed");
      toast.success("Your private appointment has been confirmed.");
    } catch (err: any) {
      setBookingError(err.message || "An error occurred while connecting to the booking engine.");
      toast.error(err.message || "Booking submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reschedule Action
  const handleExecuteReschedule = async () => {
    if (!confirmedBooking) return;
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: confirmedBooking.id,
          action: "reschedule",
          newDate: rescheduleDate,
          newTime: rescheduleTime,
        }),
      });
      const data: any = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Reschedule failed.");
      }
      setConfirmedBooking(data.appointment);
      setShowRescheduleModal(false);
      toast.success(`Appointment rescheduled to ${rescheduleDate} at ${rescheduleTime}.`);
    } catch (err: any) {
      toast.error(err.message || "Reschedule failed.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Cancel Action
  const handleExecuteCancel = async () => {
    if (!confirmedBooking) return;
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: confirmedBooking.id,
          action: "cancel",
        }),
      });
      const data: any = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Cancellation failed.");
      }
      setConfirmedBooking({
        ...confirmedBooking,
        status: "cancelled",
      });
      setShowCancelModal(false);
      toast.success("Your appointment has been cancelled.");
    } catch (err: any) {
      toast.error(err.message || "Cancellation failed.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Render Confirmation Screen
  if (currentStep === "confirmed" && confirmedBooking) {
    const isOnline =
      confirmedBooking.consultationType.toLowerCase().includes("online") ||
      confirmedBooking.consultationType.toLowerCase().includes("virtual");

    return (
      <div className="appointment-confirmation-view">
        <div className="conf-card facet-oct">
          <div className="conf-header">
            <span className="conf-icon-badge facet-oct">
              <Check size={32} />
            </span>
            <p className="eyebrow">Section 19 · Appointment Confirmation</p>
            <h1>
              {confirmedBooking.status === "cancelled"
                ? "Appointment Cancelled"
                : "Your Consultation is Confirmed"}
            </h1>
            <p className="conf-sub">
              {confirmedBooking.status === "cancelled"
                ? `Booking reference ${confirmedBooking.id} has been cancelled. If you wish to rebook, you may begin a new reservation below.`
                : `Thank you, ${confirmedBooking.clientName}. Your reservation reference is ${confirmedBooking.id}. A complete appointment pass and calendar invite have been transmitted to ${confirmedBooking.clientEmail}.`}
            </p>
          </div>

          <div className="conf-summary-box facet-oct-sm">
            <div className="conf-summary-grid">
              <div className="conf-summary-item">
                <span className="conf-item-label">Consultation Type</span>
                <strong>{confirmedBooking.consultationType}</strong>
              </div>
              <div className="conf-summary-item">
                <span className="conf-item-label">Subject</span>
                <strong>{confirmedBooking.consultationSubject}</strong>
              </div>
              <div className="conf-summary-item">
                <span className="conf-item-label">Date & Time</span>
                <strong>
                  {formatDisplayDate(confirmedBooking.date)} at {confirmedBooking.timeSlot}
                </strong>
                <small>{clientTimezone}</small>
              </div>
              <div className="conf-summary-item">
                <span className="conf-item-label">Reference ID</span>
                <strong className="tracking-num">{confirmedBooking.id}</strong>
              </div>
            </div>

            <div className="conf-location-banner">
              {isOnline ? (
                <div>
                  <div className="loc-title">
                    <Video size={18} />
                    <span>Virtual Consultation Suite</span>
                  </div>
                  <p className="loc-desc">
                    Your secure high-definition video consultation link has been generated. Joining details and a reminder will be dispatched to {confirmedBooking.clientEmail} 15 minutes before your scheduled appointment.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="loc-title">
                    <Building2 size={18} />
                    <span>{confirmedBooking.salonName || "MAH Flagship Salon, London"}</span>
                  </div>
                  <p className="loc-desc">
                    {confirmedBooking.salonAddress || "Private Salon Suites, Mayfair, London W1S"}. Our salon concierge will greet you upon arrival. Dedicated private viewing rooms and gemmological loupe facilities are prepared for your appointment.
                  </p>
                </div>
              )}
            </div>
          </div>

          {confirmedBooking.status !== "cancelled" && (
            <div className="conf-action-strip">
              <a
                href={`/api/appointments/${confirmedBooking.id}/ics`}
                download
                className="button button-dark facet-oct-sm"
              >
                <Download size={15} /> Download Calendar Pass (.ICS)
              </a>
              <button
                type="button"
                onClick={() => {
                  setRescheduleDate(confirmedBooking.date);
                  setRescheduleTime(confirmedBooking.timeSlot);
                  setShowRescheduleModal(true);
                }}
                className="button button-outline-dark facet-oct-sm"
              >
                <RotateCcw size={15} /> Reschedule Appointment
              </button>
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="button button-ghost-cancel"
              >
                Cancel Appointment
              </button>
            </div>
          )}

          {/* Section 18 Connection */}
          <div className="section-18-link-card facet-oct-sm">
            <div>
              <strong>Prefer Guidance Without an Appointment?</strong>
              <p>For immediate answers, bespoke gemstone questions, or 4Cs guidance, speak directly with an MAH expert.</p>
            </div>
            <Link href="/expert" className="button button-dark facet-oct-sm">
              Speak to an MAH Expert →
            </Link>
          </div>

          <div className="conf-return-home">
            <Link href="/" className="text-link">
              ← Return to Maison Home
            </Link>
          </div>
        </div>

        {/* Reschedule Modal */}
        {showRescheduleModal && (
          <div className="apt-modal-overlay">
            <div className="apt-modal-content facet-oct">
              <div className="apt-modal-header">
                <h3>Reschedule Consultation</h3>
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="modal-close-btn"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="modal-sub">
                Select a new date and time for reference <strong>{confirmedBooking.id}</strong>.
              </p>
              <div className="form-grid">
                <label>
                  New Date
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </label>
                <label>
                  New Time Slot
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                  >
                    {STANDARD_TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="button button-ghost"
                >
                  Keep Existing
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReschedule}
                  disabled={isActionLoading}
                  className="button button-dark facet-oct-sm"
                >
                  {isActionLoading ? "Rescheduling..." : "Confirm New Date & Time"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="apt-modal-overlay">
            <div className="apt-modal-content facet-oct">
              <div className="apt-modal-header">
                <h3>Cancel Appointment</h3>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="modal-close-btn"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="modal-sub">
                Are you sure you wish to cancel your private consultation ({confirmedBooking.id}) on{" "}
                <strong>
                  {formatDisplayDate(confirmedBooking.date)} at {confirmedBooking.timeSlot}
                </strong>
                ?
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="button button-ghost"
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  onClick={handleExecuteCancel}
                  disabled={isActionLoading}
                  className="button button-danger facet-oct-sm"
                >
                  {isActionLoading ? "Cancelling..." : "Yes, Cancel Appointment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Step 5: Review & Confirm
  if (currentStep === 5) {
    return (
      <div className="appointment-review-view">
        <div className="review-card facet-oct">
          <div className="review-header">
            <p className="eyebrow">Step 05 of 05 · Review & Confirm</p>
            <h2>Review Your Consultation Details</h2>
            <p className="review-sub">
              Please verify your consultation selections before confirming your reservation.
            </p>
          </div>

          {bookingError && (
            <div className="booking-error-banner">
              <AlertCircle size={18} />
              <span>{bookingError}</span>
            </div>
          )}

          <div className="review-blocks-grid">
            {/* Block 1: Type */}
            <div className="review-block facet-oct-sm">
              <div className="review-block-top">
                <span className="block-label">01 · Consultation Type</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="edit-step-btn"
                >
                  Edit
                </button>
              </div>
              <strong className="block-val">{consultationType}</strong>
              <p className="block-desc">
                {consultationType === "In Person"
                  ? "Dedicated salon consultation with private viewing suite."
                  : "High-definition virtual consultation via private video link."}
              </p>
            </div>

            {/* Block 2: Subject */}
            <div className="review-block facet-oct-sm">
              <div className="review-block-top">
                <span className="block-label">02 · Consultation Subject</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="edit-step-btn"
                >
                  Edit
                </button>
              </div>
              <strong className="block-val">{consultationSubject}</strong>
              <p className="block-desc">Guidance tailored to {consultationSubject.toLowerCase()}.</p>
            </div>

            {/* Block 3: Date & Time */}
            <div className="review-block facet-oct-sm">
              <div className="review-block-top">
                <span className="block-label">03 · Date & Time</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="edit-step-btn"
                >
                  Edit
                </button>
              </div>
              <strong className="block-val">
                {formatDisplayDate(selectedDate)} at {selectedTime}
              </strong>
              <p className="block-desc">{clientTimezone}</p>
            </div>

            {/* Block 4: Client Info */}
            <div className="review-block facet-oct-sm">
              <div className="review-block-top">
                <span className="block-label">04 · Client Details</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="edit-step-btn"
                >
                  Edit
                </button>
              </div>
              <strong className="block-val">{formData.fullName}</strong>
              <p className="block-desc">
                {formData.email}
                {formData.phone ? ` · ${formData.phone}` : ""}
              </p>
              {formData.notes && (
                <p className="block-notes">
                  <em>Notes: “{formData.notes}”</em>
                </p>
              )}
            </div>
          </div>

          <div className="review-footer-actions">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="button button-outline-dark facet-oct-sm"
            >
              <ArrowLeft size={15} /> Back to Details
            </button>
            <button
              type="button"
              onClick={handleFinalBookingSubmission}
              disabled={isSubmitting}
              className="button button-dark facet-oct-sm"
            >
              {isSubmitting ? "Verifying Availability..." : "Confirm Booking"} <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Steps 1-4: The Wireframe Unified 4-Column Layout (Matching Section 19 Mockup)
  return (
    <div className="appointment-booking-experience">
      {/* 1. Header Banner (Matching Wireframe in PDF) */}
      <section className="apt-hero-banner facet-oct">
        <Image
          src="/images/bespoke-artisan.jpg"
          alt="MAH Private Salon consultation table with loupe and dossier"
          fill
          priority
          sizes="100vw"
          className="apt-hero-bg"
        />
        <div className="apt-hero-overlay" />
        <div className="apt-hero-content shell">
          <div className="apt-hero-left">
            <span className="apt-eyebrow">BOOK AN APPOINTMENT</span>
            <h1>A More Personal Experience</h1>
            <p>
              Speak with an MAH expert and receive guidance tailored to your needs.
            </p>
          </div>
          <div className="apt-hero-badges">
            <div className="apt-badge-item">
              <span className="badge-bullet">◆</span>
              <span>EXPERTISE</span>
            </div>
            <div className="apt-badge-item">
              <span className="badge-bullet">◆</span>
              <span>CRAFTSMANSHIP</span>
            </div>
            <div className="apt-badge-item">
              <span className="badge-bullet">◆</span>
              <span>PERSONAL GUIDANCE</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 5-Step Stepper Bar (Matching Wireframe in PDF) */}
      <div className="apt-stepper-bar">
        <div className="shell">
          <ol className="apt-stepper-list">
            <li className={`apt-step-item ${(typeof currentStep === "number" ? currentStep : 5) >= 1 ? "active" : ""}`}>
              <span className="step-number">1</span>
              <span className="step-title">Consultation Type</span>
            </li>
            <li className="step-divider" />
            <li className={`apt-step-item ${(typeof currentStep === "number" ? currentStep : 5) >= 2 ? "active" : ""}`}>
              <span className="step-number">2</span>
              <span className="step-title">What Would You Like to Discuss</span>
            </li>
            <li className="step-divider" />
            <li className={`apt-step-item ${(typeof currentStep === "number" ? currentStep : 5) >= 3 ? "active" : ""}`}>
              <span className="step-number">3</span>
              <span className="step-title">Date & Time</span>
            </li>
            <li className="step-divider" />
            <li className={`apt-step-item ${(typeof currentStep === "number" ? currentStep : 5) >= 4 ? "active" : ""}`}>
              <span className="step-number">4</span>
              <span className="step-title">Your Details</span>
            </li>
            <li className="step-divider" />
            <li className="apt-step-item">
              <span className="step-number">5</span>
              <span className="step-title">Confirm</span>
            </li>
          </ol>
        </div>
      </div>

      {/* 3. Main 4-Column Booking Grid Form */}
      <form onSubmit={handleProceedToReview} className="apt-form-section">
        <div className="shell">
          {bookingError && (
            <div className="booking-error-banner mb-6">
              <AlertCircle size={18} />
              <span>{bookingError}</span>
            </div>
          )}

          <div className="apt-columns-grid">
            {/* COLUMN 1: Consultation Type */}
            <div className="apt-col col-type">
              <div className="col-header">
                <h3>How would you like to meet?</h3>
                <p>Choose the consultation option that suits you.</p>
              </div>

              <div className="type-options-stack">
                {CONSULTATION_TYPES_CONFIG.map((item) => {
                  const Icon = item.icon;
                  const isSelected = consultationType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setConsultationType(item.id);
                        if (typeof currentStep === "number" && currentStep < 2) setCurrentStep(2);
                      }}
                      className={`type-card facet-oct-sm ${isSelected ? "selected" : ""}`}
                    >
                      <div className="type-card-icon">
                        <Icon size={24} />
                      </div>
                      <div className="type-card-body">
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                      </div>
                      <div className="type-radio-indicator">
                        <span className={`radio-dot ${isSelected ? "checked" : ""}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2: Consultation Subject */}
            <div className="apt-col col-subject">
              <div className="col-header">
                <h3>What would you like to discuss?</h3>
                <p>Select the area you are most interested in.</p>
              </div>

              <div className="subject-options-stack">
                {CONSULTATION_SUBJECTS_CONFIG.map((subject) => {
                  const isSelected = consultationSubject === subject;
                  return (
                    <div
                      key={subject}
                      onClick={() => {
                        setConsultationSubject(subject);
                        if (typeof currentStep === "number" && currentStep < 3) setCurrentStep(3);
                      }}
                      className={`subject-pill-row facet-oct-sm ${isSelected ? "selected" : ""}`}
                    >
                      <span className={`radio-dot-sm ${isSelected ? "checked" : ""}`} />
                      <span className="subject-label">{subject}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 3: Date & Time */}
            <div className="apt-col col-datetime">
              <div className="col-header">
                <h3>Select a date and time</h3>
                <p>Choose a date, then view available times.</p>
              </div>

              {/* Interactive Calendar Widget */}
              <div className="apt-calendar-card facet-oct-sm">
                <div className="cal-nav-header">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    aria-label="Previous month"
                    className="cal-nav-arrow"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <strong className="cal-current-month">
                    {MONTH_NAMES[currentMonth]} {currentYear}
                  </strong>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    aria-label="Next month"
                    className="cal-nav-arrow"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="cal-weekdays-grid">
                  {DAYS_OF_WEEK.map((day) => (
                    <span key={day} className="cal-weekday-label">
                      {day}
                    </span>
                  ))}
                </div>

                <div className="cal-days-grid">
                  {calendarDays.map((dayItem, index) => {
                    const isDisabled = !dayItem.isCurrentMonth || dayItem.isPast;
                    return (
                      <button
                        key={`${dayItem.dateString}-${index}`}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedDate(dayItem.dateString);
                            if (typeof currentStep === "number" && currentStep < 4) setCurrentStep(4);
                          }
                        }}
                        className={`cal-day-cell ${
                          dayItem.isSelected ? "selected" : ""
                        } ${dayItem.isToday ? "today" : ""} ${
                          !dayItem.isCurrentMonth ? "other-month" : ""
                        } ${dayItem.isPast ? "past-day" : ""}`}
                      >
                        <span>{dayItem.dayNumber}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Available Times Slot Grid */}
              <div className="available-times-block">
                <span className="times-label">Available times</span>
                <div className="times-pills-grid">
                  {isLoadingSlots ? (
                    <div className="loading-slots-notice">Updating live availability...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="loading-slots-notice">No remaining slots on this date.</div>
                  ) : (
                    availableSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedTime(slot);
                            if (typeof currentStep === "number" && currentStep < 4) setCurrentStep(4);
                          }}
                          className={`time-pill-btn facet-oct-sm ${isSelected ? "selected" : ""}`}
                        >
                          {slot}
                        </button>
                      );
                    })
                  )}
                </div>
                <div className="timezone-notice">
                  <span>All times are in {clientTimezone}.</span>
                </div>
              </div>
            </div>

            {/* COLUMN 4: Your Details */}
            <div className="apt-col col-details">
              <div className="col-header">
                <h3>Your details</h3>
                <p>Please provide your information to confirm your appointment.</p>
              </div>

              <div className="details-form-fields">
                <div className="field-group">
                  <label htmlFor="fullName">FULL NAME *</label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: "" });
                    }}
                    className={fieldErrors.fullName ? "input-error" : ""}
                  />
                  {fieldErrors.fullName && (
                    <span className="error-text">{fieldErrors.fullName}</span>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="email">EMAIL ADDRESS *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                    }}
                    className={fieldErrors.email ? "input-error" : ""}
                  />
                  {fieldErrors.email && (
                    <span className="error-text">{fieldErrors.email}</span>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="phone">PHONE NUMBER (OPTIONAL)</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="notes">ADDITIONAL NOTES (OPTIONAL)</label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Let us know if there is anything specific you would like to discuss."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="button button-dark button-wide facet-oct-sm submit-continue-btn"
                >
                  CONTINUE TO CONFIRM →
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* 4. Section 19 Bottom Banner (Matching Wireframe in PDF) */}
      <section className="apt-bottom-welcome">
        <div className="shell centred">
          <p className="bottom-eyebrow">WE LOOK FORWARD TO WELCOMING YOU</p>
          <div className="bottom-gold-line" />
          <h2>Extraordinary Pieces Begin with a Conversation</h2>
        </div>
      </section>
    </div>
  );
}
