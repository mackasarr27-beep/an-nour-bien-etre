"use client";
import React, { useEffect, useState } from "react";
import { arrayUnion, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import useAuth from "../hooks/useAuth";
import ConfirmDialog from "./ConfirmDialog";

type MessageStatus = "Non lu" | "Lu" | "Répondu";
type Reply = { author?: "client" | "admin"; body?: string; createdAt?: { toDate?: () => Date } | Date | string; authorEmail?: string };

type Message = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  status?: MessageStatus;
  createdAt?: { toDate?: () => Date } | Date | string;
  response?: string;
  respondedAt?: { toDate?: () => Date } | Date | string;
  respondedBy?: string;
  replies?: Reply[];
  readByAdmin?: boolean;
  readByClient?: boolean;
  updatedAt?: { toDate?: () => Date } | Date | string;
};

function formatDate(value?: Message["createdAt"]) {
  if (!value) return "Date inconnue";
  const date = value instanceof Date ? value : typeof value === "string" ? new Date(value) : value.toDate?.();
  if (!date || Number.isNaN(date.getTime())) return "Date inconnue";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

async function fetchMessages(): Promise<Message[]> {
  if (!db) return [];
  const messagesQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  const snap = await getDocs(messagesQuery);
  return snap.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Message, "id">) }));
}

export default function MessageAdminBoard() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"Tous" | MessageStatus>("Tous");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [selectedForDelete, setSelectedForDelete] = useState<Message | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void fetchMessages().then((items) => {
      if (active) {
        setMessages(items);
        setLoading(false);
      }
    }).catch(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const refreshMessages = async () => setMessages(await fetchMessages());
  const updateMessage = async (message: Message, data: Record<string, unknown>) => {
    if (!db) return;
    await updateDoc(doc(db, "messages", message.id), data);
    await refreshMessages();
  };
  const sendReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!db || !replyingTo || !reply.trim()) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "messages", replyingTo.id), { response: reply.trim(), respondedAt: serverTimestamp(), respondedBy: user?.email || "Administrateur", replies: arrayUnion({ author: "admin", authorEmail: user?.email || "", body: reply.trim(), createdAt: Timestamp.now() }), status: "Répondu", readByClient: false, readByAdmin: true, updatedAt: serverTimestamp() });
      await refreshMessages();
      setReplyingTo(null); setReply("");
      setFeedback({ type: "success", message: "Réponse enregistrée avec succès." });
    } catch { setFeedback({ type: "error", message: "Impossible d’enregistrer la réponse. Veuillez réessayer." }); }
    finally { setSaving(false); }
  };
  const deleteMessage = async () => {
    if (!db || !selectedForDelete) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, "messages", selectedForDelete.id));
      await refreshMessages(); setSelectedForDelete(null);
      setFeedback({ type: "success", message: "Le message a été supprimé avec succès." });
    } catch { setFeedback({ type: "error", message: "Impossible de supprimer le message. Veuillez réessayer." }); }
    finally { setSaving(false); }
  };
  const visibleMessages = messages.filter((message) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || `${message.name || ""} ${message.email || ""} ${message.message || ""}`.toLowerCase().includes(term);
    const status = message.status || "Non lu";
    return matchesSearch && (filter === "Tous" || status === filter);
  });

  return (
    <section className="rounded-3xl border border-emerald-900/10 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,118,110,0.08)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Communication</p><h3 className="mt-1 text-2xl font-semibold text-slate-900">Messages reçus</h3><p className="mt-2 text-sm text-slate-600">Consultez, classez et répondez aux demandes des clients.</p></div>
        <div className="grid w-full gap-3 sm:grid-cols-[minmax(0,1fr)_auto] lg:w-auto">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un client ou un message" className="w-full min-w-0 rounded-2xl border border-emerald-900/20 px-4 py-3 text-sm" />
          <select value={filter} onChange={(event) => setFilter(event.target.value as "Tous" | MessageStatus)} className="rounded-2xl border border-emerald-900/20 px-4 py-3 text-sm font-semibold text-slate-700"><option>Tous</option><option>Non lu</option><option>Lu</option><option>Répondu</option></select>
        </div>
      </div>
      {feedback && <div role="status" className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>{feedback.message}</div>}
      {loading ? <div className="mt-6 text-sm text-slate-600">Chargement...</div> : visibleMessages.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-emerald-900/15 bg-emerald-50/40 p-8 text-center text-sm text-slate-600">Aucun message ne correspond à cette recherche.</div> : <div className="mt-6 grid gap-4">
        {visibleMessages.map((message) => {
          const status = message.status || "Non lu"; const expanded = expandedId === message.id;
          return <article key={message.id} className="rounded-2xl border border-emerald-900/10 bg-emerald-50/35 p-5 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h4 className="text-lg font-semibold text-slate-900">👤 {message.name || "Client sans nom"}</h4><span className={`rounded-full px-3 py-1 text-xs font-semibold ${status === "Répondu" ? "bg-emerald-100 text-emerald-800" : status === "Lu" ? "bg-sky-100 text-sky-800" : "bg-amber-100 text-amber-800"}`}>{status}</span></div><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600"><span>📧 {message.email || "E-mail non renseigné"}</span><span>📱 {message.phone || "Téléphone non renseigné"}</span><span>📅 {formatDate(message.createdAt)}</span></div></div>
              <div className="flex flex-wrap gap-2 xl:justify-end"><button onClick={() => setExpandedId(expanded ? null : message.id)} className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white">{expanded ? "Masquer le message" : "Voir le message"}</button><button onClick={() => setReplyingTo(message)} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Répondre</button><button onClick={() => void updateMessage(message, { status: status === "Non lu" ? "Lu" : "Non lu", readByAdmin: status === "Non lu" })} className="rounded-full border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800">{status === "Non lu" ? "Marquer comme lu" : "Marquer comme non lu"}</button><button onClick={() => setSelectedForDelete(message)} className="rounded-full border border-rose-300 bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-900">Supprimer</button></div>
            </div>
            {expanded && <div className="mt-5 grid gap-4 border-t border-emerald-900/10 pt-5 lg:grid-cols-2"><div className="rounded-2xl bg-white/80 p-4"><h5 className="font-semibold text-slate-900">Conversation</h5><div className="mt-3 space-y-3"><div className="rounded-xl bg-emerald-50 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Client · {formatDate(message.createdAt)}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{message.message || "Aucun contenu."}</p></div>{message.replies?.map((item, index) => <div key={`${message.id}-reply-${index}`} className={`rounded-xl p-3 ${item.author === "admin" ? "bg-sky-50" : "bg-amber-50"}`}><p className="text-xs font-semibold uppercase tracking-wide text-slate-700">{item.author === "admin" ? "Administration" : "Client"} · {formatDate(item.createdAt)}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.body}</p></div>)}{message.response && !message.replies?.some((item) => item.body === message.response) && <div className="rounded-xl bg-sky-50 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Administration · {formatDate(message.respondedAt)}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{message.response}</p></div>}</div></div><div className="rounded-2xl bg-white/80 p-4"><h5 className="font-semibold text-slate-900">Réponse de l’administration</h5>{message.response ? <><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{message.response}</p><p className="mt-3 text-xs text-slate-500">{formatDate(message.respondedAt)} · {message.respondedBy || "Administrateur"}</p></> : <p className="mt-2 text-sm text-slate-600">Aucune réponse enregistrée.</p>}</div></div>}
          </article>;
        })}
      </div>}
      {replyingTo && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"><form onSubmit={sendReply} className="w-full max-w-2xl rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-2xl sm:p-8"><h3 className="text-xl font-semibold text-slate-900">Répondre à {replyingTo.name || "ce client"}</h3><div className="mt-4 rounded-2xl bg-emerald-50/70 p-4 text-sm text-slate-700"><p><strong>E-mail :</strong> {replyingTo.email || "Non renseigné"}</p><p><strong>Téléphone :</strong> {replyingTo.phone || "Non renseigné"}</p><p className="mt-3"><strong>Message original :</strong> {replyingTo.message || "Aucun contenu."}</p></div><label className="mt-5 block text-sm font-semibold text-slate-700">Votre réponse<textarea value={reply} onChange={(event) => setReply(event.target.value)} required rows={6} className="mt-2 w-full rounded-2xl border border-emerald-900/20 px-4 py-3 font-normal" placeholder="Écrivez votre réponse..." /></label><p className="mt-3 text-xs leading-5 text-slate-500">La réponse sera enregistrée dans le message Firestore et marquée comme répondue. Aucun secret d’e-mail n’est exposé dans le navigateur.</p><div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" onClick={() => { if (!saving) { setReplyingTo(null); setReply(""); } }} className="rounded-full border border-emerald-900/15 px-5 py-3 font-semibold text-slate-700">Annuler</button><button type="submit" disabled={saving} className="rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white">{saving ? "Enregistrement..." : "Envoyer la réponse"}</button></div></form></div>}
      <ConfirmDialog open={selectedForDelete !== null} title="Supprimer le message ?" message="Est-ce votre premier message ? Cette action est irréversible." confirmLabel={saving ? "Suppression..." : "Supprimer"} onCancel={() => { if (!saving) setSelectedForDelete(null); }} onConfirm={() => void deleteMessage()} />
    </section>
  );
}
