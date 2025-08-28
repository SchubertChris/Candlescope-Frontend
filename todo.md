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

## Farben etc. 

    - MultiTheme - Design möglich via Primary Color Settings
    - Font Sizing & Theme in Settings
    - Lupe aktivieren Seitenübergreifend
    - Vorlese Funktion - falls nötig und möglich
    - Multi-Language DE/EN reicht aus wenn nötig
    - Logos ---> webp und Backend Seite von CDN + DB
    - Größen allgemein etwas begrenzen und kleiner halten da es sonst so gestopft aussieht etwas luftiger gestalten wenn nötig bessere Animationen mit GSAP oder Framer


## Landingpage 

    - Parallax effekte im vollen Umfang
    - Cards im 100vw 70 vh oder so look mega parallax mit zoom in und out das es wie im 3D Kino wirkt Opacity irgendwas krasses
    - Darunter alles zu mir mit Timeline Small und big width cards rechtecke und immer einem angelehnten Bild Badge wie Story Cards
    - Darunter Werbung für meine Finance App Candlescope Programm mit Stick offline, dezentral --> per Datei csv und pdf extrahierbar

## LP - NAVIGATION DESKTOP

    - Mobile bleibt genau so
    - Desktop soll komplett anders sein und muss mit der Seite wandern, den User nicht beinträchtigen um scrollen und den Seiten fortschritt soll getrackt werden und dem User ein animiertes Feedback geben 

## Kontaktseite

    - Oben ein Bild [NOCH UNKLAR - eventuell Dashboard Candlescope Werbung]
    - Werbung kommt bon oben rein das es den user nicht nervt auch kein blur oder ähnliches es soll ihn nicht behindern und er kann es wegklicken entweder ins bild irgendwo oder das kreit am auf dem rand des borders O.R.
    - Newsletter Werbe Idee gut Newsletter aber nur auf Angebote oder mir spezifische Informationen bezogen
    - DSirekte kontaktaufname professionell verlinken/ auf meinen Kontaktkanal nach Anmeldung im Dashboard hinweisen aktive werbung mit CTA zur anmeldung leitung auf LP öffnen der Nav und fokus auf EMail input
    - Preise anpassen mit Angebot "Rabatt" Symbolik durchgestrichen usw.
    - Keine Textarea eher kurzes "Quiz" abfragen je nachdem was er vorher angeklickt hat wichtige erste infos die ich benötige um ein angebot machen zu können
    - Newsletter doppelt sich Umsetzung anders gestalten eventuell nur auf Anmeldung Verweisen
    - Fortschrittsbalken eleganter umsetzen flache zugespitze linie LR wird breiter oben nur Prozente kein text

## Layout Dashboard

    1. Header wie gehabt nav zu Nachrichten leiten, Logout und Settings leiten und Avatar [Dort dann nur kleines Modal öffnen/ oder am besten das fenster vom avatar so formen beim draufklicken für Status Name und email - leitet dann aber weiter wenn man bearbeiten will zu Profilsettings]
    2. Rolle soll nicht sichtbar sein [Nur für Admin das er weiß wo er ist]
    3. Logo und Text anders gestalten
    4. Wenn auf LP zurück via Logo dann nach oben Scrollen und bei Reload LP nicht auf DB leiten wenn eingeloggt nur wenn OAUTH
    5. Zum Dashboard oben wo abmelden steht mit einbauen so springt es dem user eher ins gesicht und lässt sich intuitiver navigieren

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



        Fortsetzung folgt ...

    