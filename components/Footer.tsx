import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/10 bg-white/75 text-sm text-slate-700 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-semibold text-emerald-950">AN NOUR BIEN-ÊTRE</h4>
          <p className="mt-2">Téléphone: 78 216 07 41</p>
          <p className="mt-1">Adresse : Keur Massar, Dakar, Sénégal</p>
        </div>
        <div>
          <h5 className="font-semibold text-emerald-950">Horaires</h5>
          <p className="mt-2">Lun - Ven: 9h - 19h</p>
        </div>
        <div>
          <h5 className="font-semibold text-emerald-950">Réseaux</h5>
          <ul className="mt-2 space-y-1">
            <li>
              <a href="https://wa.me/221782160741" target="_blank" rel="noreferrer" className="hover:underline">WhatsApp</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Facebook</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Instagram</a>
            </li>
            <li>
              <a href="#" className="hover:underline">TikTok</a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-emerald-950">Légal</h5>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/privacy">Politique de confidentialité</Link>
            </li>
            <li>
              <Link href="/legal">Mentions légales</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-emerald-900/10 py-4 text-center text-xs text-slate-600">© {new Date().getFullYear()} AN NOUR BIEN-ÊTRE</div>
    </footer>
  );
}
