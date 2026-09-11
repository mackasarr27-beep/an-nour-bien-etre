import "server-only";

import { Resend } from "resend";
import { NextResponse } from "next/server";

type AppointmentEmailType = "pending" | "confirmed";

type AppointmentPayload = {
  name?: string;
  phone?: string;
  email?: string;
  date?: string;
  time?: string;
  service?: string;
  message?: string;
  status?: string;
};

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function appointmentDetails(appointment: AppointmentPayload) {
  return `
    <dl>
      <dt><strong>Nom</strong></dt><dd>${escapeHtml(appointment.name)}</dd>
      <dt><strong>Téléphone</strong></dt><dd>${escapeHtml(appointment.phone)}</dd>
      <dt><strong>E-mail</strong></dt><dd>${escapeHtml(appointment.email || "Non renseigné")}</dd>
      <dt><strong>Service</strong></dt><dd>${escapeHtml(appointment.service)}</dd>
      <dt><strong>Date</strong></dt><dd>${escapeHtml(appointment.date)}</dd>
      <dt><strong>Heure</strong></dt><dd>${escapeHtml(appointment.time)}</dd>
      <dt><strong>Message</strong></dt><dd>${escapeHtml(appointment.message || "Aucun commentaire")}</dd>
    </dl>
  `;
}

function isValidAppointment(appointment: AppointmentPayload) {
  return Boolean(
    appointment.name?.trim()
      && appointment.phone?.trim()
      && appointment.date?.trim()
      && appointment.time?.trim()
      && appointment.service?.trim(),
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { type?: AppointmentEmailType; appointment?: AppointmentPayload };
    const type = body.type;
    const appointment = body.appointment;
    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || process.env.FROM_EMAIL?.trim();
    const apiKey = process.env.RESEND_API_KEY?.trim();

    if ((type !== "pending" && type !== "confirmed") || !appointment || !isValidAppointment(appointment)) {
      console.error("Appointment email rejected: invalid request payload", {
        type,
        hasAppointment: Boolean(appointment),
      });
      return NextResponse.json({ error: "Données de rendez-vous invalides." }, { status: 400 });
    }

    const missingVariables = [
      !apiKey ? "RESEND_API_KEY" : null,
      !fromEmail ? "RESEND_FROM_EMAIL" : null,
      type === "pending" && !adminEmail ? "ADMIN_EMAIL" : null,
    ].filter((variable): variable is string => Boolean(variable));

    if (missingVariables.length > 0) {
      console.error("Appointment email variables are not configured on Vercel.", {
        missingVariables,
        hasResendApiKey: Boolean(apiKey),
        hasResendFromEmail: Boolean(fromEmail),
        hasAdminEmail: Boolean(adminEmail),
        fromVariable: process.env.RESEND_FROM_EMAIL ? "RESEND_FROM_EMAIL" : process.env.FROM_EMAIL ? "FROM_EMAIL" : "missing",
      });
      return NextResponse.json({ error: "Le service e-mail n’est pas configuré." }, { status: 503 });
    }

    const isPending = type === "pending";

    let recipient: string;

    if (isPending) {
      if (!adminEmail) {
        return NextResponse.json({ error: "Le service e-mail n’est pas configuré." }, { status: 503 });
      }
      recipient = adminEmail;
    } else {
      const clientEmail = appointment.email?.trim();
      if (!clientEmail) {
        console.warn("Appointment confirmation skipped because client email is missing.", {
          type,
          appointmentDate: appointment.date,
          appointmentTime: appointment.time,
          appointmentName: appointment.name,
        });
        return NextResponse.json({ sent: false, skipped: true, reason: "client_email_missing" }, { status: 200 });
      }
      recipient = clientEmail;
    }

    if (!apiKey || !fromEmail) {
      return NextResponse.json({ error: "Le service e-mail n’est pas configuré." }, { status: 503 });
    }

    const resend = new Resend(apiKey);
    const subject = isPending
      ? "Nouvelle demande de rendez-vous – AN NOUR BIEN-ÊTRE"
      : "Rendez-vous confirmé – AN NOUR BIEN-ÊTRE";
    const html = isPending
      ? `<h1>Nouvelle demande de rendez-vous</h1><p>Une demande vient d’être reçue et reste en attente de confirmation.</p>${appointmentDetails(appointment)}<p><strong>Statut :</strong> En attente de confirmation.</p>`
      : `<h1>Rendez-vous confirmé</h1><p>Bonjour ${escapeHtml(appointment.name)},</p><p>Nous avons le plaisir de confirmer votre rendez-vous.</p>${appointmentDetails(appointment)}<p>Merci pour votre confiance.<br />AN NOUR BIEN-ÊTRE<br />Prendre soin de vous, naturellement.</p>`;

    console.info("Sending appointment email", {
      type,
      recipient,
      from: fromEmail,
      appointmentDate: appointment.date,
      appointmentTime: appointment.time,
    });

    const { error } = await resend.emails.send({ from: fromEmail, to: [recipient], subject, html });

    if (error) {
      console.error("Resend appointment email error", {
        type,
        recipient,
        from: fromEmail,
        error,
      });
      return NextResponse.json({ error: "L’e-mail n’a pas pu être envoyé." }, { status: 502 });
    }

    console.info("Appointment email sent", { type, recipient });
    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Appointment email route error", {
      error: error instanceof Error ? error.message : error,
    });
    return NextResponse.json({ error: "Erreur du service e-mail." }, { status: 500 });
  }
}
