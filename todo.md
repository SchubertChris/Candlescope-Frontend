1. Pages Ordner [Service & Types aufteilen]
2. Types aus der Kontaktseite und so filtern
3. Routing und Layout Checken





---

# Allgemein zu tun 

- Loading Übergänge mit großen Animationen von DB zu LP und LP zu DB 
- Landingpage überlegen
- Allgemeines Dynamisches Modal erstellen und dann überall nutzen genauso wie eigenes Dynamisches Dropdown für Select und Option - Daten vom BE später
- Animatedbackground - duplicate in Lightmode
- SCCS Base für lightmode selbe aktzente nur mit weißen ANMT-BG

## Noch zu machen LP 

- Navigation / Layout volle Seitenhöhe nutzen - wo ist der User gerade Nav muss mit wandern + Auf Pc Mobile Toggle oben auf telefon wie jetzt 

- Verlinkung Kontakt geht ---> ABER auf Telefon macht es Probleme und führt wieder zurück [Besser Umsetzen]
-  

## Noch zu machen DB

- Navigation auch mitwandern VH
- Wireframes für kommende Seiten anlegen und dann Step by Step anbinden [BE dann Seite für Seite]
- 




# Aufbaugedanken einzelner Seiten

## Layout Dashboard

    1. Header wie gehabt nav zu Nachrichten Logout Settings oder Profil [Dort dann nur kleines Modal öffnen für Status Name und email - leitet dann aber weiter]
    2. Rolle soll nicht sichtbar sein [Nur für Admin das er weiß wo er ist]
    3. Logo und Text anders gestalten

### Sidebar

    1. Padding oder sowas darf nicht ändern beim öffnen das es mehr nach aufziehen auussieht [links nach rechts]
    2. Sichbar für Kunde = Übersicht, Projekt [seine eigenen nicht alle nur die ich ihm zuteile als Admin der Admin sieht alle und hat ein editor], Nachrichten [den Kontakt zu mir und die Organisation / Gruppe], Rechnungen [nur die ich Ihm zuteile/ gebe/ erstelle für Kunden und für Admin alle plus Editor], Newsletter [Nur für ADMIN sichtbar ist ein Editor], Einstellungen & Profil [Für Alle],  
    3. ZUSATZ --> Userverwaltung & Support müssen noch erstellt werden

## Übersicht Dashboard
    
    1. Inhalt/ Role [USER/Kunde]
        - Begrüßung
        - Projekt Titel
        - Beschreibung
        - Neue Updates zum aktuellen Projekt in Schriftform von Admin als Kommentar [currentupdatecommit]
        - Bild/Video Vorschau vom Projekt   
        - Verweis auf bezahlte Rechnugen und Offene
        - Schnellaktionen wie Nachricht verfassen Projektlink - was ein Kunde halt machen kann 

    2. Inhalt/ Role [ADMIN]
        - Begrüßung
        - Schnellaktionen [Neues Projekt anlegen, soft oder hard deleten, Nachricht verfassen, Rechnung erstellen, Zur Userverwaltung usw.]
        - Alle Projekte Vorschau max 3 dann zugriff auf Bibliothek wo alle sind auch gelöschte /soft  

    