# Curriculum Web

Curriculum vitae interattivo sviluppato come pagina web statica.

## Caratteristiche

- Design minimale e moderno con tema scuro
- Layout lineare e pulito
- Responsive design
- Navigazione smooth scroll
- Sezioni: Profilo, Esperienze, Formazione, Competenze, Contatti

## Struttura

```
curriculum/
├── index.html          # Pagina principale
├── css/
│   └── style.css      # Stili dark theme
├── js/
│   └── main.js        # Script per navigazione
└── README.md
```

## Personalizzazione

1. Modifica `index.html` con i tuoi dati personali
2. Aggiorna i placeholder nelle sezioni:
   - Header: nome, ruolo, contatti
   - Profilo: testo introduttivo
   - Esperienze: ruoli e descrizioni
   - Formazione: titoli di studio
   - Competenze: tecnologie e tools

## Deploy su GitHub Pages

1. Crea un repository su GitHub
2. Carica i file del progetto
3. Vai su Settings > Pages
4. Seleziona il branch principale (main/master)
5. Il sito sarà disponibile su `https://username.github.io/repository-name`

## Sviluppo Locale

Apri semplicemente `index.html` nel browser o usa un server locale:

```bash
# Con Python
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```

Poi apri `http://localhost:8000` nel browser.

