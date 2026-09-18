import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function GET() {
  const enquiries = serverStore.getEnquiries();
  return NextResponse.json({ success: true, enquiries });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, any>;
    const { fullName, email, phone, interest, message } = body;

    const errors: Record<string, string> = {};

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      errors.fullName = "Please enter your full name.";
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      errors.email = "Please enter your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      errors.message = "Please enter your message or enquiry.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors, message: "Validation failed." },
        { status: 400 }
      );
    }

    const newEnquiry = serverStore.addEnquiry({
      fullName,
      email,
      phone,
      interest,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        enquiry: newEnquiry,
        enquiryRef: newEnquiry.enquiryRef,
        message: "Enquiry successfully received.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing enquiry submission:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred while processing your enquiry." },
      { status: 500 }
    );
  }
}
