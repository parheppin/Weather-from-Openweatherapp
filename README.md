# Väderapp 🌤️

En enkel och snygg webbapplikation för att visa aktuellt väder i olika städer.

## Funktioner

- 🔍 Sök efter väder i valfri stad
- 🌡️ Visa aktuell temperatur och "känns som"-temperatur- 🗺️ Interaktiv karta som visar ortens geografiska position- � 5-dagars väderprognos (kan uppgraderas till 10 dagar med betald API-plan)
- �💨 Visa vind, luftfuktighet och lufttryck
- 🎨 Responsiv design som fungerar på alla enheter
- 🇸🇪 Svenskt språk och lokalisering

## Komma igång

### 1. Skaffa en API-nyckel

1. Gå till [OpenWeatherMap](https://openweathermap.org/api)
2. Skapa ett gratis konto
3. Generera en API-nyckel (kan ta några minuter innan den aktiveras)

### 2. Konfigurera projektet

1. Kopiera `config.example.js` och döp den till `config.js`:
   ```bash
   copy config.example.js config.js
   ```
   (på Mac/Linux:
   ```bash
   cp config.example.js config.js
   ```
   )

2. Öppna `config.js`
3. Ersätt `'DIN_API_NYCKEL_HÄR'` med din riktiga API-nyckel:
   ```javascript
   const API_KEY = 'din-faktiska-nyckel-här';
   ```

**Viktigt:** Filen `config.js` är redan i `.gitignore` och kommer inte att commitas till Git för att skydda din API-nyckel.

### 3. Kör applikationen

Öppna `index.html` i din webbläsare eller använd en lokal webbserver:

**Alternativ 1: Dubbelklicka på index.html**

**Alternativ 2: Använd Live Server i VS Code**
- Installera "Live Server"-tillägget
- Högerklicka på index.html
- Välj "Open with Live Server"

**Alternativ 3: Python HTTP-server**
```bash
python -m http.server 8000
```
Öppna sedan http://localhost:8000

## Användarguide

1. Skriv in namnet på en stad i sökfältet
2. Tryck på "Sök" eller Enter
3. Se aktuellt väder och prognos för staden!

### Uppgradera till 10-dagars prognos

Standardappen använder gratis API:t som ger 5 dagars prognos. För 10-dagars prognos:
1. Uppgradera din OpenWeatherMap-plan
2. API:t stöder redan längre prognoser när du har tillgång

## Vidareutveckling

Här är några förslag på hur du kan utveckla appen vidare:

- [x] Lägg till 5-dagars väderprognos
- [x] Lägg till väderkarta
- [ ] Spara favorit-städer i localStorage
- [ ] Lägg till geolokalisering för att automatiskt visa lokalt väder
- [ ] Visa soluppgång och solnedgång
- [ ] Byt färgschema baserat på väder (soligt, regnigt, etc.)
- [ ] Lägg till UV-index och pollennivåer
- [ ] Skapa en PWA (Progressive Web App) för offline-support

## Teknologi

- HTML5
- CSS3 (med gradients och animationer)
- Vanilla JavaScript (ES6+)
- OpenWeatherMap API
- Leaflet.js (interaktiva kartor)

## Projektstruktur

```
VIBE test/
├── index.html          # Huvudfil
├── app.js              # Applikationslogik
├── style.css           # Styling
├── config.js           # API-nyckel (skapas av dig, inte i Git)
├── config.example.js   # Mall för config.js
├── .gitignore          # Ignorerar känsliga filer
└── README.md           # Dokumentation
```

## Säkerhet

- API-nyckeln lagras i en separat `config.js`-fil
- `config.js` är inkluderad i `.gitignore` för att förhindra att nyckeln commitas till versionshantering
- Använd `config.example.js` som mall när du sätter upp projektet
- **OBS:** För produktion bör du använda en backend-server för att dölja API-nyckeln

## Licens

Fri att använda för personliga och kommersiella projekt.
