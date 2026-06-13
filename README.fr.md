# Kubi'or Mini-Shop 🇫🇷

Boutique React qui vend trois packs de bouillon naturel **Kubi'or** via **Stripe Checkout**. Démo d'un flux de paiement sécurisé : Stripe + webhook + base de données.

**Démo en ligne :** https://kubior.vercel.app
**Vidéo (90s) :** https://www.loom.com/share/16e82e2649f8446faee09dab36e45dca

🇬🇧 English version: [README.md](README.md)

---

## Ce que ça fait

- Une page produit avec 3 packs (Découverte, Famille, Mois)
- Paiement via Stripe Checkout (hébergé)
- Un webhook Stripe qui **vérifie la signature** et enregistre chaque commande payée dans Supabase
- Page de succès qui retrouve la commande via `session_id`
- Page d'annulation pour les paniers abandonnés

Pas de compte utilisateur, pas de panier, pas de gestion de stock — volontairement. L'objectif est un pipeline de paiement propre et sécurisé.

---

## Le flux

```
Visiteur → /                         (page produit, 3 packs)
   │  clic « Commander »
   ▼
POST /api/create-checkout-session    (crée la session Stripe Checkout)
   │  redirection
   ▼
Stripe Checkout (hébergé)            (le visiteur paie par carte)
   │
   ├─ redirection → /success?session_id=…  → GET /api/order → affiche la commande
   │
   └─ événement  → POST /api/webhook  (vérifie la signature → INSERT dans Supabase)
```

Le navigateur n'écrit **jamais** dans la base. Seul le webhook (signature vérifiée) crée une commande.

---

## Stack

React 18 + Vite + TypeScript + Tailwind · Stripe Checkout + Webhooks · Supabase (PostgreSQL) · Vercel Functions · framer-motion.

---

## Installation rapide

```bash
git clone https://github.com/Tsukuyomi260/Kubior.git
cd kubior
npm install
cp .env.example .env.local   # puis remplir les variables
npm run dev                  # http://localhost:5173
```

> `npm run dev` ne lance que le frontend. Les fonctions `/api/*` sont des fonctions serverless Vercel et ne tournent pas sous Vite. Pour tester le flux complet, utiliser le site déployé.

La configuration détaillée (Stripe, Supabase, variables d'environnement, déploiement) est dans le [README anglais](README.md).

---

## Sécurité (points clés)

- Signature du webhook vérifiée systématiquement (`stripe.webhooks.constructEvent`, corps brut).
- Clé `service_role` Supabase utilisée uniquement côté serveur, jamais exposée au navigateur.
- Aucune écriture côté client : seule l'écriture via webhook crée une commande.
- Idempotence : `stripe_session_id` est `UNIQUE` ; un événement rejoué renvoie `200` sans créer de doublon.
- Les logs ne contiennent que des messages d'erreur, jamais l'email, l'adresse ou les objets Stripe complets.

---

## Note sur la devise

Les prix sont affichés en **FCFA** pour le marché béninois, mais Stripe Checkout ne supporte pas le **XOF** : le paiement est donc facturé en **USD** (équivalent indiqué entre parenthèses sous chaque pack).
