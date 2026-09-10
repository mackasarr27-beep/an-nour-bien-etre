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
      && appointment.email?.trim()
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
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL;
    const apiKey = process.env.RESEND_API_KEY;

    if ((type !== "pending" && type !== "confirmed") || !appointment || !isValidAppointment(appointment)) {
      return NextResponse.json({ error: "Données de rendez-vous invalides." }, { status: 400 });
    }

    if (!apiKey || !fromEmail || (type === "pending" && !adminEmail)) {
      console.error("Appointment email variables are not configured on Vercel.");
      return NextResponse.json({ error: "Le service e-mail n’est pas configuré." }, { status: 503 });
    }

    const recipient = type === "pending" ? adminEmail : appointment.email;
    if (!recipient) {
      return NextResponse.json({ error: "Aucun destinataire e-mail disponible." }, { status: 400 });
    }

    const resend = new Resend(apiKey);
    const isPending = type === "pending";
    const subject = isPending
      ? "Nouvelle demande de rendez-vous – AN NOUR BIEN-ÊTRE"
      : "Rendez-vous confirmé – AN NOUR BIEN-ÊTRE";
    const html = isPending
      ? `<h1>Nouvelle demande de rendez-vous</h1><p>Une demande vient d’être reçue et reste en attente de confirmation.</p>${appointmentDetails(appointment)}<p><strong>Statut :</strong> En attente de confirmation.</p>`
      : `<h1>Rendez-vous confirmé</h1><p>Bonjour ${escapeHtml(appointment.name)},</p><p>Nous avons le plaisir de confirmer votre rendez-vous.</p>${appointmentDetails(appointment)}<p>Merci pour votre confiance.<br />AN NOUR BIEN-ÊTRE<br />Prendre soin de vous, naturellement.</p>`;

    const { error } = await resend.emails.send({ from: fromEmail, to: [recipient], subject, html });
    if (error) {
      console.error("Resend appointment email error", error);
      return NextResponse.json({ error: "L’e-mail n’a pas pu être envoyé." }, { status: 502 });
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Appointment email route error", error);
    return NextResponse.json({ error: "Erreur du service e-mail." }, { status: 500 });
  }
}
