import { initializeApp } from "firebase-admin/app";
import { FieldValue } from "firebase-admin/firestore";
import { defineSecret, defineString } from "firebase-functions/params";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";

initializeApp();

const resendApiKey = defineSecret("RESEND_API_KEY");
const adminEmail = defineString("ADMIN_EMAIL");
const fromEmail = defineString("FROM_EMAIL");

type Appointment = {
  name?: string;
  phone?: string;
  email?: string;
  date?: string;
  time?: string;
  service?: string;
  message?: string;
  status?: string;
  notificationSentAt?: unknown;
  confirmationSentAt?: unknown;
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

function appointmentSummary(data: Appointment) {
  return `
    <dl>
      <dt><strong>Nom</strong></dt><dd>${escapeHtml(data.name)}</dd>
      <dt><strong>Téléphone</strong></dt><dd>${escapeHtml(data.phone)}</dd>
      <dt><strong>E-mail</strong></dt><dd>${escapeHtml(data.email || "Non renseigné")}</dd>
      <dt><strong>Service</strong></dt><dd>${escapeHtml(data.service)}</dd>
      <dt><strong>Date</strong></dt><dd>${escapeHtml(data.date)}</dd>
      <dt><strong>Heure</strong></dt><dd>${escapeHtml(data.time)}</dd>
      <dt><strong>Message</strong></dt><dd>${escapeHtml(data.message || "Aucun commentaire")}</dd>
    </dl>
  `;
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = resendApiKey.value();
  const from = fromEmail.value();

  if (!apiKey || !from || !to) {
    throw new Error("RESEND_API_KEY, FROM_EMAIL et le destinataire sont requis.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  if (!response.ok) {
    throw new Error(`Resend a répondu avec le statut ${response.status}.`);
  }
}

export const notifyAdminOfNewAppointment = onDocumentCreated(
  {
    document: "appointments/{appointmentId}",
    region: "europe-west1",
    retry: true,
    secrets: [resendApiKey],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const appointment = snapshot.data() as Appointment;
    if (appointment.status !== "pending" || appointment.notificationSentAt) return;

    await sendEmail(
      adminEmail.value(),
      "Nouvelle demande de rendez-vous – AN NOUR BIEN-ÊTRE",
      `<h1>Nouvelle demande de rendez-vous</h1><p>Une demande vient d'être reçue et reste en attente de confirmation.</p>${appointmentSummary(appointment)}<p><strong>Statut :</strong> En attente de confirmation.</p>`,
    );

    await snapshot.ref.update({ notificationSentAt: FieldValue.serverTimestamp() });
    logger.info("Appointment notification sent", { appointmentId: event.params.appointmentId });
  },
);

export const notifyClientOfConfirmedAppointment = onDocumentUpdated(
  {
    document: "appointments/{appointmentId}",
    region: "europe-west1",
    retry: true,
    secrets: [resendApiKey],
  },
  async (event) => {
    const before = event.data?.before.data() as Appointment | undefined;
    const afterSnapshot = event.data?.after;
    if (!before || !afterSnapshot) return;

    const appointment = afterSnapshot.data() as Appointment;
    const wasConfirmed = before.status === "Confirmé" || before.status === "confirmed";
    const isConfirmed = appointment.status === "Confirmé" || appointment.status === "confirmed";
    if (!isConfirmed || wasConfirmed || appointment.confirmationSentAt || !appointment.email) return;

    await sendEmail(
      appointment.email,
      "Rendez-vous confirmé – AN NOUR BIEN-ÊTRE",
      `<h1>Rendez-vous confirmé</h1><p>Bonjour ${escapeHtml(appointment.name)},</p><p>Nous avons le plaisir de confirmer votre rendez-vous.</p>${appointmentSummary(appointment)}<p>Merci pour votre confiance.<br />AN NOUR BIEN-ÊTRE<br />Prendre soin de vous, naturellement.</p>`,
    );

    await afterSnapshot.ref.update({ confirmationSentAt: FieldValue.serverTimestamp() });
    logger.info("Appointment confirmation sent", { appointmentId: event.params.appointmentId });
  },
);
