# DevHub Agency - Landing Page & Estimate System

Site public de l'agence DevHub : landing page, formulaire de devis avec estimation automatique, et portfolio.

## 🚀 Démarrage rapide

### Développement local

```bash
# Cloner le projet
cd ~/Projects/devhub-agency

# Serveur local (avec Python)
cd frontend && python3 -m http.server 8000

# Ou avec Node.js (npx)
npx serve frontend

# Ouvrir http://localhost:8000
```

### Structure du projet

```
devhub-agency/
├── frontend/
│   ├── index.html           # Landing page principale
│   ├── devis.html           # Formulaire de devis + estimation
│   ├── portfolio.html       # Portfolio des réalisations
│   ├── mentions-legales.html # Mentions légales & confidentialité
│   ├── css/
│   │   └── style.css        # Styles complets (responsive)
│   ├── js/
│   │   ├── main.js          # Navigation, FAQ, smooth scroll
│   │   ├── estimate.js      # Logique formulaire + pricing
│   │   └── portfolio.js     # Filtres portfolio
│   └── assets/
│       └── images/          # Images et screenshots
├── backend/                  # (Prévu pour API future)
├── docs/                     # Documentation
└── README.md
```

## 💰 Logique d'estimation (modifiable)

Les prix sont calculés automatiquement dans `frontend/js/estimate.js`.

### Prix de base par type de projet

| Type | Fourchette |
|------|-----------|
| Site vitrine | 400€ - 800€ |
| Base de données | 500€ - 1000€ |
| Outil interne | 800€ - 1500€ |
| Recréation de site | 500€ - 1000€ |

### Modificateurs

| Critère | Modificateur |
|---------|-------------|
| Objectif "Vendre" | +20% |
| Objectif "Gagner du temps" | +10% |
| Délai "Urgent" | +30% |
| Délai "Flexible" | -10% |
| Secteur E-commerce | +15% |
| Secteur Santé | +15% |

### Personnaliser les prix

Modifier `PRICING_CONFIG` dans `frontend/js/estimate.js` :

```javascript
const PRICING_CONFIG = {
    projectTypes: {
        'site-vitrine': [400, 800],  // [min, max]
        // ...
    },
    objectives: {
        'vendre': 1.20,  // +20%
        // ...
    },
    // etc.
};
```

## 🌐 Déploiement sur DevHub.wiki

### Option 1 : Upload direct (recommandé)

1. Zipper le dossier `frontend/`
2. Uploader sur l'hébergement DevHub.wiki
3. Extraire à la racine du sous-domaine

### Option 2 : FTP/SFTP

```bash
# Avec lftp (exemple)
lftp -u username,password ftp.devhub.wiki
mirror -R frontend/ /public_html/agency/
```

### Option 3 : Git deployment

```bash
# Si DevHub.wiki supporte Git
git init
git add .
git commit -m "Initial release"
git remote add devhub git@devhub.wiki:agency.git
git push devhub main
```

## 📦 Build production (optionnel)

Le site fonctionne en statique pur. Pour optimiser :

```bash
# Minifier CSS (avec csso)
npx csso frontend/css/style.css -o frontend/css/style.min.css

# Minifier JS (avec terser)
npx terser frontend/js/main.js -o frontend/js/main.min.js
npx terser frontend/js/estimate.js -o frontend/js/estimate.min.js

# Puis mettre à jour les références dans les HTML
```

## 🔧 Configuration future

### Backend (à venir)

Prévu pour recevoir les demandes de devis :

```javascript
// POST /api/estimates
{
    "projectType": "site-vitrine",
    "objective": "vendre",
    "timeline": "standard",
    "sector": "restauration",
    "name": "Jean Dupont",
    "email": "jean@exemple.com",
    "description": "...",
    "estimate": { "min": 480, "max": 960 }
}
```

### Email de confirmation

À intégrer : envoi automatique d'email au client avec récapitulatif + "validation sous 24h".

### Paiement

À intégrer : lien de paiement (Stripe, PayPal, ou autre) généré après validation du devis.

## 📋 Pages du site

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` | Landing page avec services, process, FAQ |
| Estimation | `/devis.html` | Formulaire progressif + résultat |
| Portfolio | `/portfolio.html` | Réalisations avec filtres |
| Mentions légales | `/mentions-legales.html` | Légal + confidentialité |

## ✅ Fonctionnalités

- [x] Landing page moderne et responsive
- [x] Formulaire de devis multi-étapes
- [x] Estimation automatique basée sur critères
- [x] Portfolio avec filtres par catégorie
- [x] FAQ accordéon
- [x] Navigation mobile (hamburger)
- [x] Mentions légales / Politique de confidentialité
- [x] Stockage localStorage (offline-first)
- [ ] Backend API (à venir)
- [ ] Envoi d'emails automatiques (à venir)
- [ ] Intégration paiement (à venir)

## 📝 Notes

- **Code 100% propriétaire** : Aucune dépendance externe bloquante
- **Hébergement flexible** : Fonctionne sur n'importe quel serveur statique
- **Pas de framework** : HTML/CSS/JS vanilla pour simplicité maximale
- **Responsive** : Mobile-first, testé sur tous écrans

## 🎨 Design

- Police : Inter (Google Fonts)
- Couleur primaire : `#2563eb` (bleu)
- Radius : 12px (cartes), 6px (inputs)
- Approche : minimaliste, professionnel, rassurant

---

**DevHub Agency** — Solutions numériques clé en main  
© 2025 - Code propriétaire, aucun enfermement
