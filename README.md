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

Il sito è configurato per essere pubblicato su GitHub Pages come sottodirectory `/curriculum` del dominio principale `www.albertorsini.it`.

### Configurazione

1. Il repository è configurato con percorsi assoluti che includono il basePath `/curriculum`
2. Il deploy avviene automaticamente tramite GitHub Actions quando si fa push sul branch `main`
3. Vai su Settings > Pages nel repository GitHub
4. Seleziona "GitHub Actions" come source
5. Il sito sarà disponibile su `https://www.albertorsini.it/curriculum/`

### Struttura URL

- **Homepage principale**: `https://www.albertorsini.it/`
- **Blog**: `https://www.albertorsini.it/blog/`
- **Curriculum**: `https://www.albertorsini.it/curriculum/`

## Sviluppo Locale

Per testare localmente con il basePath `/curriculum`, usa un server locale che supporti routing:

```bash
# Con Python (serve dalla root del progetto)
python -m http.server 8000

# Poi apri http://localhost:8000/curriculum/index.html
# oppure configura un server che serva dalla root del dominio
```

**Nota**: I percorsi nel codice sono configurati con `/curriculum/` come basePath, quindi per testare correttamente è necessario servire il sito dalla root del dominio o configurare un server che gestisca il routing.

