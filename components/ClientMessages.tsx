"use client";

import { useCallback, useEffect, useState } from "react";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../lib/firebase";

type Reply = { author?: "client" | "admin"; body?: string; createdAt?: { toDate?: () => Date } | Date | string; authorEmail?: string };
type ClientMessage = { id: string; email?: string; message?: string; createdAt?: Reply["createdAt"]; updatedAt?: Reply["createdAt"]; response?: string; respondedAt?: Reply["createdAt"]; status?: string; readByClient?: boolean; replies?: Reply[] };

function toDate(value?: Reply["createdAt"]) {
  return value instanceof Date ? value : typeof value === "string" ? new Date(value) : value?.toDate?.();
}

function formatDate(value?: Reply["createdAt"]) {
  const date = toDate(value);
  return date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(date) : "Date inconnue";
}

function timeline(message: ClientMessage) {
  const items: Reply[] = [{ author: "client", body: message.message, createdAt: message.createdAt }];
  if (message.response) items.push({ author: "admin", body: message.response, createdAt: message.respondedAt });
  return [...items, ...(message.replies || [])].sort((a, b) => (toDate(a.createdAt)?.getTime() || 0) - (toDate(b.createdAt)?.getTime() || 0));
}

export default function ClientMessages({ user }: { user: User }) {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ClientMessage | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!db) return [];
    const messagesQuery = query(collection(db, "messages"), where("uid", "==", user.uid));
    const snapshot = await getDocs(messagesQuery);
    return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<ClientMessage, "id">) })).sort((first, second) => (toDate(second.updatedAt || second.createdAt)?.getTime() || 0) - (toDate(first.updatedAt || first.createdAt)?.getTime() || 0));
  }, [user.uid]);

  useEffect(() => {
    let active = true;
    void loadMessages().then((items) => { if (active) { setMessages(items); setLoading(false); } }).catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [loadMessages]);

  const openMessage = async (message: ClientMessage) => {
    setSelected(message);
    if (db && !message.readByClient) {
      await updateDoc(doc(db, "messages", message.id), { readByClient: true, updatedAt: serverTimestamp() });
      setMessages(await loadMessages());
    }
  };

  const sendReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!db || !selected || !reply.trim()) return;
    setSending(true); setFeedback(null);
    try {
      await updateDoc(doc(db, "messages", selected.id), { replies: arrayUnion({ author: "client", authorEmail: user.email || "", body: reply.trim(), createdAt: Timestamp.now() }), status: "Non lu", readByAdmin: false, readByClient: true, updatedAt: serverTimestamp() });
      const refreshed = await loadMessages();
      setMessages(refreshed); setSelected(refreshed.find((item) => item.id === selected.id) || null); setReply(""); setFeedback("Votre message a été envoyé.");
    } catch { setFeedback("Impossible d’envoyer votre message. Veuillez réessayer."); }
    finally { setSending(false); }
  };

  const unreadCount = messages.filter((message) => message.status === "Répondu" && message.readByClient === false).length;

  return (
    <section className="mt-8 rounded-[24px] border border-emerald-900/10 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,118,110,0.1)] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold text-slate-900">💬 Mes messages</h2><p className="mt-1 text-sm text-slate-600">Retrouvez vos conversations avec AN NOUR BIEN-ÊTRE.</p></div>{unreadCount > 0 && <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-800">🔴 Nouvelle réponse · {unreadCount}</span>}</div>
      {loading ? <p className="mt-5 text-sm text-slate-600">Chargement des conversations...</p> : messages.length === 0 ? <p className="mt-5 rounded-2xl bg-emerald-50/70 p-4 text-sm text-slate-600">Vous n’avez pas encore de conversation.</p> : <div className="mt-5 grid gap-3">{messages.map((message) => <button key={message.id} type="button" onClick={() => void openMessage(message)} className="w-full rounded-2xl border border-emerald-900/10 bg-emerald-50/45 p-4 text-left transition hover:bg-emerald-50"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold text-slate-900">{message.message?.slice(0, 80) || "Votre message"}</span>{message.status === "Répondu" && message.readByClient === false && <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-800">Nouvelle réponse</span>}</div><span className="mt-1 block text-sm text-slate-600">Dernière activité : {formatDate(message.updatedAt || message.createdAt)}</span></button>)}</div>}
      {selected && <div className="mt-6 rounded-2xl border border-emerald-900/10 bg-emerald-50/35 p-4 sm:p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-semibold text-slate-900">Conversation</h3><p className="mt-1 text-sm text-slate-600">{selected.email}</p></div><button type="button" onClick={() => setSelected(null)} className="rounded-full border border-emerald-900/15 px-3 py-2 text-sm font-semibold text-slate-700">Fermer</button></div><div className="mt-5 grid gap-3">{timeline(selected).map((item, index) => <div key={`${selected.id}-${index}`} className={`rounded-2xl p-4 ${item.author === "admin" ? "bg-white text-slate-700" : "ml-4 bg-emerald-100/70 text-slate-800 sm:ml-12"}`}><p className="text-sm font-semibold">{item.author === "admin" ? "Administration" : "Votre message"}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{item.body}</p><p className="mt-2 text-xs text-slate-500">📅 {formatDate(item.createdAt)}</p></div>)}</div><form onSubmit={sendReply} className="mt-5"><label className="text-sm font-semibold text-slate-700">Rédigez votre message<textarea value={reply} onChange={(event) => setReply(event.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-emerald-900/20 px-4 py-3 font-normal" placeholder="Rédigez votre message..." /></label><div className="mt-3 flex flex-wrap items-center gap-3"><button type="submit" disabled={sending || !reply.trim()} className="rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white disabled:opacity-60">{sending ? "Envoi..." : "Envoyer"}</button>{feedback && <span role="status" className="text-sm font-medium text-emerald-800">{feedback}</span>}</div></form></div>}
    </section>
  );
}
