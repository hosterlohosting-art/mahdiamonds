import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const date = searchParams.get("date");

  // Single appointment lookup
  if (id) {
    const appointment = serverStore.getAppointmentById(id);
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    return NextResponse.json(appointment);
  }

  // Live slot availability lookup for specific date
  if (date) {
    const availableSlots = serverStore.getAvailableSlots(date);
    const bookedAppointments = serverStore.getAppointments(date);
    const bookedSlots = bookedAppointments.map((a) => a.timeSlot);

    return NextResponse.json({
      date,
      availableSlots,
      bookedSlots,
      timezone: "Europe/London (GMT/BST)",
    });
  }

  // All active appointments
  const appointments = serverStore.getAppointments();
  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json();
    const consultationType = body.consultationType || body.type || "In Person";
    const consultationSubject = body.consultationSubject || body.subject || "Engagement Rings";
    const date = body.date;
    const timeSlot = body.timeSlot || body.time;
    const clientName = body.clientName || body.name || "";
    const clientEmail = body.clientEmail || body.email || "";
    const clientPhone = body.clientPhone || body.phone || "";
    const notes = body.notes || "";

    // 1. Validate Required Fields
    if (!clientName.trim() || !clientEmail.trim() || !date || !timeSlot) {
      return NextResponse.json(
        { error: "Full Name, Email Address, Date, and Time Slot are required." },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address format." },
        { status: 400 }
      );
    }

    // 2. Final Availability Recheck (Double-Booking Prevention per Section 19 Mandate)
    const isAvailable = serverStore.isSlotAvailable(date, timeSlot);
    if (!isAvailable) {
      const alternatives = serverStore.getAvailableSlots(date);
      return NextResponse.json(
        {
          error: "The selected appointment slot has just been reserved. Please select an alternative time.",
          isUnavailable: true,
          availableAlternatives: alternatives,
        },
        { status: 409 }
      );
    }

    const isInPerson = consultationType.toLowerCase().includes("in person") || consultationType.toLowerCase().includes("person");

    const appointment = serverStore.addAppointment({
      consultationType: isInPerson ? "In Person" : "Online Consultation",
      consultationSubject,
      salonName: isInPerson ? "MAH Flagship Salon, London" : "Virtual Consultation Suite",
      salonAddress: isInPerson
        ? "Private Salon Suites, Mayfair, London W1S"
        : "Secure High-Definition Video Suite",
      date,
      timeSlot,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      clientPhone: clientPhone.trim(),
      notes: notes.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        appointment,
        message: `Your ${appointment.consultationType} for ${consultationSubject} is confirmed for ${date} at ${timeSlot}.`,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to schedule appointment. Please try again.", details: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body: any = await request.json();
    const { id, action, newDate, newTime } = body;

    if (!id) {
      return NextResponse.json({ error: "Appointment reference ID is required." }, { status: 400 });
    }

    if (action === "cancel") {
      const updated = serverStore.updateAppointmentStatus(id, "cancelled");
      if (!updated) {
        return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: "Your appointment has been cancelled.",
        appointment: updated,
      });
    }

    if (action === "reschedule") {
      if (!newDate || !newTime) {
        return NextResponse.json({ error: "New date and time are required to reschedule." }, { status: 400 });
      }

      const isSlotFree = serverStore.isSlotAvailable(newDate, newTime);
      if (!isSlotFree) {
        return NextResponse.json(
          {
            error: "The requested reschedule slot is already booked. Please choose another time.",
            availableAlternatives: serverStore.getAvailableSlots(newDate),
          },
          { status: 409 }
        );
      }

      const updated = serverStore.updateAppointmentStatus(id, "rescheduled", newDate, newTime);
      return NextResponse.json({
        success: true,
        message: `Your appointment has been rescheduled to ${newDate} at ${newTime}.`,
        appointment: updated,
      });
    }

    return NextResponse.json({ error: "Invalid action. Supported actions: cancel, reschedule" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update appointment.", details: err.message }, { status: 500 });
  }
}
