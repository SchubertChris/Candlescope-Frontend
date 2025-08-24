<!-- Modernisiertes, einheitliches README-Layout -->

<div align="center">

# 🚀 Portfolio 2.0 – Chris Schubert

_Ein moderner, modularer Projektüberblick_

</div>

---

## 📁 Projektstruktur generieren

```bash
find . -type d \( -name node_modules -o -name .git \) -prune -o -print \
| sed -e 's/[^-][^/]*\//   │/g' -e 's/│\([^│]\)$/└── \1/' \
> Projektstruktur.txt
```

---

## 🛠️ Workbench

> **Nutze diesen Bereich für Experimente, Code-Snippets & Notizen, bevor sie ins Hauptprojekt wandern.**

<table align="center">
  <thead>
    <tr>
      <th>🚀 Experiment</th>
      <th>⏳ Status</th>
      <th>📝 Notizen</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🧪 Neues UI-Element</td>
      <td><img src="https://img.shields.io/badge/In%20Arbeit-yellow" alt="In Arbeit"></td>
      <td>Testweise im Dashboard eingebunden</td>
    </tr>
    <tr>
      <td>📝 Markdown Parser</td>
      <td><img src="https://img.shields.io/badge/Fertig-brightgreen" alt="Fertig"></td>
      <td>Wird im nächsten Release integriert</td>
    </tr>
    <tr>
      <td>🔒 Auth-Flow</td>
      <td><img src="https://img.shields.io/badge/Review-orange" alt="Review"></td>
      <td>OAuth-Redirect prüfen</td>
    </tr>
  </tbody>
</table>

<details>
  <summary>💡 Tipps</summary>

  - Nutze diesen Bereich für schnelle Ideen, ohne die Hauptstruktur zu stören.
  - Lösche erledigte Experimente regelmäßig, um Übersicht zu behalten.
</details>

---

## 📊 Dashboard Tasks

- [ ] Newsletter-Bereich anbinden
- [ ] Dashboard-Styles modularisieren
- [ ] Navigation & Newsletter testen
- [ ] OAuth: Google nach Auth auf Dashboard leiten
- [ ] **Architektur ggf. neu denken**

---

## 🚀 Deployment

- [ ] Vercel-Deployment reparieren

---

## 📋 Weitere Aufgaben

- [ ] Seiten anbinden & Backend funktionsfähig machen
- [ ] Profil-Einstellungen (Passwortverwaltung)
- [ ] 2FA & Push-Benachrichtigungen integrieren

---

## 🃏 OfferSection

- [ ] Karten mit `clip-path` exakt 3px größer gestalten
- [ ] Animierten Farbverlauf als BG für Karten hinzufügen
- [ ] Alternative Card-Backgrounds (Texturen etc.)

---

## 🎨 Glasmorphismus-Stil (CSS-Beispiel)

```css
/* Moderner Glasmorphismus */
backdrop-filter: blur(25px) saturate(1.5);
filter: blur(0.5px) saturate(1.5);
-webkit-backdrop-filter: blur(25px) saturate(1.5);
```

---

# ⏭️ Nächste Schritte

## Hauptziele bis 01.10

- **Landingpage**
  - [ ] Links, Responsiveness, Inhalt prüfen
- **Kontaktpage**
  - [ ] Funktionstest, Validierung, Backend-Anbindung
  - [ ] Email-Design modular & clean gestalten
- **Dashboard**
  - [ ] Komponenten modularisieren
  - [ ] Authentifizierung (Refresh Token, Cookies)
  - [ ] Newsletter-System & Unterseiten überarbeiten

---

<div align="center">

<img src="https://img.shields.io/badge/Status-Work%20in%20Progress-blueviolet?style=for-the-badge&logo=github" alt="Status: Work in Progress">

</div>
