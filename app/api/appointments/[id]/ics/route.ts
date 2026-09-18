import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appointment = serverStore.getAppointmentById(id);

  if (!appointment) {
    return new NextResponse("Appointment not found", { status: 404 });
  }

  // Parse date and time into iCal format (YYYYMMDDTHHMMSS)
  const dateClean = appointment.date.replace(/-/g, "");
  const timeClean = appointment.timeSlot.replace(/:/g, "") + "00";
  const dtStart = `${dateClean}T${timeClean}`;

  // 1 hour appointment
  const hourNum = parseInt(appointment.timeSlot.split(":")[0], 10) + 1;
  const endHourStr = hourNum < 10 ? `0${hourNum}` : `${hourNum}`;
  const dtEnd = `${dateClean}T${endHourStr}${appointment.timeSlot.split(":")[1]}00`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MAH Diamonds London//Salon Appointments//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:MAH-APT-${appointment.id}@mahdiamonds.co.uk`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART;TZID=Europe/London:${dtStart}`,
    `DTEND;TZID=Europe/London:${dtEnd}`,
    `SUMMARY:MAH Diamonds — ${appointment.consultationType}`,
    `DESCRIPTION:Private Consultation for ${appointment.clientName}.\nVenue: ${appointment.salonName}\nAddress: ${appointment.salonAddress}\nRef: ${appointment.id}\nConcierge: +44 (0)20 7946 0920`,
    `LOCATION:${appointment.salonAddress}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: MAH Diamonds Salon Appointment in 2 hours",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="mah-appointment-${appointment.id}.ics"`,
    },
  });
}
