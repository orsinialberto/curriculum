// ============================================
// UTILITY FUNCTIONS
// ============================================

// Helper per inizializzazione DOM
function onDOMReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// ============================================
// INTERNATIONALIZATION (i18n)
// ============================================

let currentLanguage = localStorage.getItem('language') || 'it';

// Funzione per ottenere una traduzione
function getTranslation(key, lang = currentLanguage) {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
        value = value?.[k];
    }
    return value || key;
}

// Funzione per impostare la lingua
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    // Aggiorna tutti gli elementi con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key, lang);
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else if (element.hasAttribute('aria-label')) {
                element.setAttribute('aria-label', translation);
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // Aggiorna i pulsanti lingua
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Aggiorna contenuti dinamici
    updateDynamicContent(lang);
}

// Funzione per aggiornare contenuti dinamici
function updateDynamicContent(lang) {
    // Aggiorna i contenuti dell'esperienza terminal se già caricati
    const experienceSection = document.getElementById('experience');
    if (experienceSection) {
        const terminalOutput = document.getElementById('experience-terminal-output');
        if (terminalOutput) {
            // Reset del terminal per riavviare con la nuova lingua
            terminalOutput.innerHTML = '';
            experienceSection.classList.remove('terminal-started');
            delete experienceSection.dataset.terminalLang;
            window.experienceTerminalStarted = false;
            // Riavvia il terminal con la nuova lingua
            setTimeout(() => typeExperienceTerminal(lang), 100);
        }
    }
    
    // Ricrea il grafo delle skills con la nuova lingua
    if (typeof d3 !== 'undefined') {
        initSkillsNetwork(lang);
    }
    
    // Aggiorna il pannello skills se aperto (chiudilo per evitare inconsistenze)
    const panel = document.getElementById('skill-details-panel');
    if (panel && !panel.classList.contains('hidden')) {
        panel.classList.add('hidden');
        // Aggiorna le etichette nel pannello
        document.querySelectorAll('#skill-details-panel [data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                const translation = getTranslation(key, lang);
                if (translation && el.tagName !== 'BUTTON') {
                    el.textContent = translation;
                }
            }
        });
    }
    
    // I progetti GitHub non necessitano di aggiornamento immediato
    // Le etichette dei progetti vengono aggiornate quando vengono creati
}

// Inizializza la lingua al caricamento del DOM
function initLanguage() {
    setLanguage(currentLanguage);
    
    // Event listeners per i pulsanti lingua
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
}

// Esegui quando il DOM è pronto
onDOMReady(() => {
    initLanguage();
    initHamburgerMenu();
});

// Hamburger Menu Toggle
function initHamburgerMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });
    
    // Chiudi menu quando si clicca su un link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Chiudi menu quando si clicca fuori
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Chiudi menu con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            navToggle.focus();
        }
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Unified scroll handler
let scrollTicking = false;

function handleScroll() {
    if (scrollTicking) return;
    
    scrollTicking = true;
    window.requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Update scroll progress bar
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = scrollPercent + '%';
        }
        
        // Highlight active navigation item
        const sections = document.querySelectorAll('section[id], header[id], footer[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollTop >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Update navbar scroll state
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        scrollTicking = false;
    });
}

window.addEventListener('scroll', handleScroll, { passive: true });

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Unobserve after animation to prevent re-triggering
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Skills section - le competenze sono ora mostrate direttamente nell'HTML

// Experience terminal commands data generator
function getExperienceCommands(lang = currentLanguage) {
    const t = translations[lang].experience;
    
    // Funzione helper per wrappare il testo in righe da 70 caratteri
    function wrapText(text, prefix = '|     ') {
        const maxLength = 70 - prefix.length;
        const words = text.split(' ');
        let lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            if ((currentLine + word).length <= maxLength) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) lines.push(prefix + currentLine);
                currentLine = word;
            }
        });
        if (currentLine) lines.push(prefix + currentLine);
        
        return lines.join('\n');
    }
    
    const desc1 = wrapText(t.description1);
    const desc2 = wrapText(t.description2);
    const desc3 = wrapText(t.description3, '      ');
    
    return [
        {
            command: getTranslation('experience.command', lang),
            output: '* commit 2077c89411067468a44ad143d4e0de30263d0a3a (HEAD -> main, origin/main) (tag: 2.1.0)\n' +
                '| Author:   Alberto Orsini <orsini.alberto@hotmail.it>\n' +
                `| Role:     ${t.role1}\n` +
                `| Company:  ${t.company1}\n` +
                '| Tags:     Java 17 · Spring Boot 2.5 · Jmx · MySQL · Elasticsearch · Kafka · ActiveMQ ·\n' + 
                '|           Redis · Docker · Kubernetes · Azure · Maven · Git · Linux/Windows\n' +
                '| Date:     Mon Nov 07 09:00:00 2022 +0100\n' +
                '|\n' +
                desc1 + '\n' +
                '|\n' +
                '* commit 7b257fc96ce8f12c0e996a6945b71879a0db4ee4 (2.0.0)\n' +
                '| Author:   Alberto Orsini <orsini.alberto@hotmail.it>\n' +
                `| Role:     ${t.role2}\n` +
                `| Company:  ${t.company2}\n` +
                '| Tags:     Java 8 · Springboot 1.5 · Akka · Apache Camel · MySQL · HBase · Vertica ·\n' +
                '|           Docker ·Maven · Git · Linux\n' +
                '| Date:     Mon Jul 03 09:00:00 2017 +0100\n' +
                '|\n' +
                desc2 + '\n' +
                '|\n' +
                '* commit 6683c591d5e2485085cfd68bfafd5a082443b979 (1.0.0)\n' +
                '  Author:   Alberto Orsini <orsini.alberto@hotmail.it>\n' +
                `  Role:     ${t.role3}\n` +
                `  Company:  ${t.company3}\n` +
                '  Tags:     Java 8 · Spring · Hibernate · SQL Server · JSP · JavaScript · jQuery · HTML · \n' +
                '            CSS · Git · Windows\n' +
                '  Date:     Mon Oct 10 09:00:00 2016 +0100\n' +
                '\n' +
                desc3
        }
    ];
}

// Skeleton Loading per Progetti
function createSkeletonLoader(count = 4) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'project-skeleton visible';
        skeleton.innerHTML = `
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
        `;
        skeleton.style.transitionDelay = `${i * 0.1}s`;
        projectsGrid.appendChild(skeleton);
    }
}

// Helper function per processare output con colori
function processTerminalOutputWithColors(text) {
    // Divide in righe per processare meglio
    const lines = text.split('\n');
    let result = '';
    
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx];
        const isLastLine = lineIdx === lines.length - 1;
        
        // Se la riga inizia con * commit, colora tutto in giallo e gestisci HEAD/tag
        if (line.startsWith('* commit')) {
            let processedLine = '<span class="git-commit">* commit';
            let restOfLine = line.substring(8);
            
            // Processa HEAD e tag nella riga originale (prima di aggiungere markup)
            const originalLine = line;
            
            // Trova tutte le occorrenze di (HEAD e (tag: nella riga originale
            let parts = [];
            let lastIndex = 0;
            
            // Trova HEAD
            const headMatch = originalLine.match(/\(HEAD[^)]*\)/);
            // Trova tag
            const tagMatch = originalLine.match(/\(tag:[^)]*\)/);
            
            // Costruisci la riga processata
            let lineAfterCommit = originalLine.substring(8);
            
            if (headMatch && tagMatch) {
                // Entrambi presenti, processa nell'ordine in cui appaiono
                const headIndex = originalLine.indexOf(headMatch[0]);
                const tagIndex = originalLine.indexOf(tagMatch[0]);
                
                if (headIndex < tagIndex) {
                    // HEAD prima di tag
                    const beforeHead = lineAfterCommit.substring(0, headIndex - 8);
                    const headPart = lineAfterCommit.substring(headIndex - 8, headIndex - 8 + headMatch[0].length);
                    const between = lineAfterCommit.substring(headIndex - 8 + headMatch[0].length, tagIndex - 8);
                    const tagPart = lineAfterCommit.substring(tagIndex - 8, tagIndex - 8 + tagMatch[0].length);
                    const after = lineAfterCommit.substring(tagIndex - 8 + tagMatch[0].length);
                    
                    processedLine += beforeHead + '<span class="git-head">' + headPart + '</span>' + between + '<span class="git-tag">' + tagPart + '</span>' + after;
                } else {
                    // Tag prima di HEAD
                    const beforeTag = lineAfterCommit.substring(0, tagIndex - 8);
                    const tagPart = lineAfterCommit.substring(tagIndex - 8, tagIndex - 8 + tagMatch[0].length);
                    const between = lineAfterCommit.substring(tagIndex - 8 + tagMatch[0].length, headIndex - 8);
                    const headPart = lineAfterCommit.substring(headIndex - 8, headIndex - 8 + headMatch[0].length);
                    const after = lineAfterCommit.substring(headIndex - 8 + headMatch[0].length);
                    
                    processedLine += beforeTag + '<span class="git-tag">' + tagPart + '</span>' + between + '<span class="git-head">' + headPart + '</span>' + after;
                }
            } else if (headMatch) {
                // Solo HEAD
                const headIndex = originalLine.indexOf(headMatch[0]);
                const beforeHead = lineAfterCommit.substring(0, headIndex - 8);
                const headPart = lineAfterCommit.substring(headIndex - 8, headIndex - 8 + headMatch[0].length);
                const after = lineAfterCommit.substring(headIndex - 8 + headMatch[0].length);
                processedLine += beforeHead + '<span class="git-head">' + headPart + '</span>' + after;
            } else if (tagMatch) {
                // Solo tag
                const tagIndex = originalLine.indexOf(tagMatch[0]);
                const beforeTag = lineAfterCommit.substring(0, tagIndex - 8);
                const tagPart = lineAfterCommit.substring(tagIndex - 8, tagIndex - 8 + tagMatch[0].length);
                const after = lineAfterCommit.substring(tagIndex - 8 + tagMatch[0].length);
                processedLine += beforeTag + '<span class="git-tag">' + tagPart + '</span>' + after;
            } else {
                processedLine += lineAfterCommit;
            }
            
            processedLine += '</span>';
            result += processedLine;
        } else {
            // Per le altre righe, processa i pipe
            let processedLine = '';
            for (let i = 0; i < line.length; i++) {
                if (line[i] === '|') {
                    processedLine += '<span class="git-pipe">|</span>';
                } else {
                    processedLine += line[i];
                }
            }
            result += processedLine;
        }
        
        if (!isLastLine) {
            result += '\n';
        }
    }
    
    return result;
}

// Helper function per inizializzare terminal observer
function initTerminalObserver(experienceSection, lang, typeNextChar) {
    if (experienceSection && !experienceSection.dataset.terminalLang) {
        experienceSection.dataset.terminalLang = lang;
        const terminalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('terminal-started')) {
                    entry.target.classList.add('terminal-started');
                    setTimeout(() => typeNextChar(), 200);
                    terminalObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        terminalObserver.observe(experienceSection);
    } else if (experienceSection && experienceSection.dataset.terminalLang !== lang) {
        experienceSection.classList.remove('terminal-started');
        experienceSection.dataset.terminalLang = lang;
        setTimeout(() => typeNextChar(), 200);
    }
}

// Experience terminal typing effect
function typeExperienceTerminal(lang = currentLanguage) {
    const terminalOutput = document.getElementById('experience-terminal-output');
    if (!terminalOutput) return;
    
    // Svuota l'output precedente se esiste
    terminalOutput.innerHTML = '';
    
    const experienceCommands = getExperienceCommands(lang);
    window.experienceTerminalStarted = true;
    
    let commandIndex = 0;
    let charIndex = 0;
    let isTypingCommand = true;
    let currentCommand = '';
    
    function typeNextChar() {
        if (commandIndex >= experienceCommands.length) {
            // Aggiungi cursore finale
            const cursor = document.createElement('span');
            cursor.className = 'terminal-cursor';
            terminalOutput.appendChild(cursor);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            return;
        }
        
        const cmd = experienceCommands[commandIndex];
        
        if (isTypingCommand) {
            if (charIndex === 0) {
                // Crea nuova riga per il comando
                const line = document.createElement('div');
                line.className = 'terminal-line';
                terminalOutput.appendChild(line);
                
                const prompt = document.createElement('span');
                prompt.className = 'terminal-prompt';
                prompt.textContent = '$ ';
                line.appendChild(prompt);
                
                currentCommand = '';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
            
            const line = terminalOutput.lastElementChild;
            if (charIndex < cmd.command.length) {
                currentCommand += cmd.command[charIndex];
                let commandSpan = line.querySelector('.terminal-command');
                if (!commandSpan) {
                    commandSpan = document.createElement('span');
                    commandSpan.className = 'terminal-command';
                    line.appendChild(commandSpan);
                }
                commandSpan.textContent = currentCommand;
                charIndex++;
                // Scroll automatico
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                setTimeout(typeNextChar, 20); // Velocità typing (ridotta da 50ms)
            } else {
                // Comando completato, mostra output
                isTypingCommand = false;
                charIndex = 0;
                setTimeout(typeNextChar, 150); // Pausa dopo comando (ridotta da 500ms)
            }
        } else {
            // Typing output con colorazione
            if (charIndex === 0) {
                const outputContainer = document.createElement('div');
                outputContainer.className = 'terminal-line terminal-output';
                terminalOutput.appendChild(outputContainer);
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
            
            const outputContainer = terminalOutput.lastElementChild;
            if (charIndex < cmd.output.length) {
                const textToProcess = cmd.output.substring(0, charIndex + 1);
                const processedText = processTerminalOutputWithColors(textToProcess);
                outputContainer.innerHTML = processedText;
                charIndex++;
                // Scroll automatico
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                setTimeout(typeNextChar, 10); // Velocità output (ridotta da 30ms)
            } else {
                // Output completato, passa al prossimo comando
                isTypingCommand = true;
                charIndex = 0;
                commandIndex++;
                setTimeout(typeNextChar, 250); // Pausa tra comandi (ridotta da 800ms)
            }
        }
    }
    
    // Inizia il typing quando la sezione è visibile
    const experienceSection = document.getElementById('experience');
    initTerminalObserver(experienceSection, lang, typeNextChar);
}

// Inizializza quando il DOM è pronto
onDOMReady(typeExperienceTerminal);

// GitHub Projects Loader con cache e gestione rate limit
async function loadGitHubProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    const username = 'orsinialberto';
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=4`;
    const CACHE_KEY = 'github_projects_cache';
    const CACHE_TIMESTAMP_KEY = 'github_projects_cache_timestamp';
    const CACHE_DURATION = 60 * 60 * 1000; // 1 ora in millisecondi
    
    // Controlla se ci sono dati in cache validi
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    const now = Date.now();
    
    if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION) {
        try {
            const projects = JSON.parse(cachedData);
            projectsGrid.innerHTML = '';
            projects.forEach((repo, index) => {
                const card = createProjectCard(repo, index);
                projectsGrid.appendChild(card);
            });
            
            // Anima le card
            animateProjectCards();
            return;
        } catch (e) {
            // Se la cache è corrotta, procedi con il fetch
            console.warn('Cache corrotta, procedo con fetch:', e);
        }
    }
    
    try {
        // Mostra skeleton loader
        createSkeletonLoader(4);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const response = await fetch(apiUrl);
        
        // Gestione specifica per rate limit
        if (response.status === 403) {
            const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
            const rateLimitReset = response.headers.get('X-RateLimit-Reset');
            
            // Se abbiamo dati in cache (anche scaduti), usali
            if (cachedData) {
                try {
                    const projects = JSON.parse(cachedData);
                    projectsGrid.innerHTML = '';
                    projects.forEach((repo, index) => {
                        const card = createProjectCard(repo, index);
                        projectsGrid.appendChild(card);
                    });
                    animateProjectCards();
                    
                    // Mostra un avviso che stiamo usando dati in cache
                    const warning = document.createElement('div');
                    warning.className = 'projects-warning';
                    const t = translations[currentLanguage].projects.error;
                    warning.innerHTML = `
                        <p>⚠️ ${t.usingCache}</p>
                        <p class="warning-subtitle">${t.cacheWarning}</p>
                    `;
                    projectsGrid.parentElement.insertBefore(warning, projectsGrid);
                    window.projectsLoaded = true;
                    return;
                } catch (e) {
                    // Cache non valida, mostra messaggio di errore
                }
            }
            
            // Calcola quando il limite si resetta
            let resetMessage = '';
            if (rateLimitReset) {
                const resetTime = new Date(parseInt(rateLimitReset) * 1000);
                const hours = resetTime.getHours();
                const minutes = resetTime.getMinutes();
                const locale = currentLanguage === 'en' ? 'en-US' : 'it-IT';
                if (currentLanguage === 'en') {
                    resetMessage = `The limit resets at ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}.`;
                } else {
                    resetMessage = `Il limite si resetta alle ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}.`;
                }
            }
            
            const t = translations[currentLanguage].projects.error;
            projectsGrid.innerHTML = `
                <div class="projects-error">
                    <p><strong>${t.rateLimit}</strong></p>
                    <p>${t.rateLimitMessage}</p>
                    ${resetMessage ? `<p class="error-subtitle">${resetMessage}</p>` : ''}
                    <p class="error-subtitle">${currentLanguage === 'en' 
                        ? `Visit my <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color);">GitHub profile</a> to see the projects.`
                        : `Visita il mio <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color);">profilo GitHub</a> per vedere i progetti.`}</p>
                </div>
            `;
            window.projectsLoaded = true;
            return;
        }
        
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // Filtra solo i repository pubblici e non fork
        const projects = repos
            .filter(repo => !repo.fork && repo.private === false)
            .slice(0, 4);
        
        if (projects.length === 0) {
            const t = translations[currentLanguage].projects.error;
            projectsGrid.innerHTML = `<div class="projects-error">${t.title}</div>`;
            window.projectsLoaded = true;
            return;
        }
        
        projectsGrid.innerHTML = '';
        
        // Carica i linguaggi per ogni progetto (con gestione errori)
        const projectsWithLanguages = await Promise.all(
            projects.map(async (repo) => {
                try {
                    const langResponse = await fetch(repo.languages_url);
                    if (!langResponse.ok) {
                        // Se anche questa chiamata fallisce per rate limit, usa dati vuoti
                        return { ...repo, languages: {} };
                    }
                    const languages = await langResponse.json();
                    return { ...repo, languages };
                } catch {
                    return { ...repo, languages: {} };
                }
            })
        );
        
        // Salva in cache
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(projectsWithLanguages));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
        } catch (e) {
            console.warn('Impossibile salvare in cache:', e);
        }
        
        projectsWithLanguages.forEach((repo, index) => {
            const card = createProjectCard(repo, index);
            projectsGrid.appendChild(card);
        });
        
        // Anima le card
        animateProjectCards();
        window.projectsLoaded = true;
        
    } catch (error) {
        console.error('Errore nel caricamento progetti:', error);
        
        // Prova a usare la cache anche se scaduta come fallback
        if (cachedData) {
            try {
                const projects = JSON.parse(cachedData);
                projectsGrid.innerHTML = '';
                projects.forEach((repo, index) => {
                    const card = createProjectCard(repo, index);
                    projectsGrid.appendChild(card);
                });
                animateProjectCards();
                
                const warning = document.createElement('div');
                warning.className = 'projects-warning';
                const t = translations[currentLanguage].projects.error;
                warning.innerHTML = `
                    <p>⚠️ ${t.errorCache}</p>
                `;
                projectsGrid.parentElement.insertBefore(warning, projectsGrid);
                window.projectsLoaded = true;
                return;
            } catch (e) {
                // Cache non valida
            }
        }
        
        const t = translations[currentLanguage].projects.error;
        projectsGrid.innerHTML = `
            <div class="projects-error">
                <p><strong>${t.title}</strong></p>
                <p>${currentLanguage === 'en' 
                    ? `Visit my <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color);">GitHub profile</a> to see the projects.`
                    : `Visita il mio <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color);">profilo GitHub</a> per vedere i progetti.`}</p>
            </div>
        `;
        window.projectsLoaded = true;
    }
}

// Funzione helper per animare le card dei progetti
function animateProjectCards() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(projectsSection);
    }
}

function createProjectCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.transitionDelay = `${index * 0.1}s`;
    
    // Formatta la data in base alla lingua corrente
    const updatedDate = new Date(repo.updated_at);
    const locale = currentLanguage === 'en' ? 'en-US' : 'it-IT';
    const formattedDate = updatedDate.toLocaleDateString(locale, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    // Prepara i linguaggi
    const languages = Object.keys(repo.languages || {});
    const totalBytes = Object.values(repo.languages || {}).reduce((a, b) => a + b, 0);
    
    // Colori comuni per i linguaggi
    const languageColors = {
        'Java': '#f89820',
        'JavaScript': '#f7df1e',
        'TypeScript': '#3178c6',
        'Python': '#3776ab',
        'HTML': '#e34c26',
        'CSS': '#1572b6',
        'Shell': '#89e051',
        'Dockerfile': '#384d54',
        'Kotlin': '#7F52FF',
        'Go': '#00ADD8',
        'Rust': '#000000',
        'C++': '#00599C',
        'C': '#A8B9CC',
        'PHP': '#777BB4',
        'Ruby': '#CC342D',
        'Swift': '#FA7343',
        'Scala': '#DC322F',
        'R': '#276DC3'
    };
    
    const noDescription = getTranslation('common.noDescription');
    const updated = getTranslation('common.updated');
    const seeOnGithub = getTranslation('common.seeOnGithub');
    
    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-name">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                    ${repo.name}
                </a>
            </h3>
            <div class="project-stats">
                <div class="project-stat" title="Stars">
                    <svg fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                    </svg>
                    <span>${repo.stargazers_count}</span>
                </div>
                <div class="project-stat" title="Forks">
                    <svg fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                    </svg>
                    <span>${repo.forks_count}</span>
                </div>
            </div>
        </div>
        <p class="project-description">${repo.description || noDescription}</p>
        ${languages.length > 0 ? `
            <div class="project-languages">
                ${languages.slice(0, 4).map(lang => {
                    const color = languageColors[lang] || '#FAF0E6';
                    return `
                        <span class="language-badge">
                            <span class="language-color" style="background-color: ${color}"></span>
                            <span>${lang}</span>
                        </span>
                    `;
                }).join('')}
            </div>
        ` : ''}
        <div class="project-footer">
            <span class="project-updated">${updated}: ${formattedDate}</span>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                ${seeOnGithub}
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14L21 3"></path>
                </svg>
            </a>
        </div>
    `;
    
    return card;
}

// Inizializza il caricamento progetti
onDOMReady(loadGitHubProjects);

// PDF Download Function
function downloadPDF() {
    const downloadBtn = document.getElementById('download-pdf');
    if (!downloadBtn) return;
    
    // Crea un link temporaneo per scaricare il PDF
    const link = document.createElement('a');
    link.href = 'Curriculum.pdf';
    link.download = 'Alberto_Orsini_CV.pdf';
    link.style.display = 'none';
    
    // Aggiungi al body, clicca e rimuovi
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Aggiungi event listener al pulsante di download
onDOMReady(() => {
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadPDF);
    }
});

// Smooth reveal per elementi che entrano nel viewport
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Applica a tutti gli elementi con animazione
document.querySelectorAll('.section, .project-card').forEach(el => {
    revealObserver.observe(el);
});

// ============================================
// ANIMAZIONI AVANZATE
// ============================================

// Scroll Progress Bar initialization (handled by unified scroll handler)
function initScrollProgress() {
    // Progress bar is now handled by the unified scroll handler
    // This function is kept for compatibility but does nothing
}

// Particelle Animate
function createParticles() {
    const particleCount = 25;
    const particles = document.createElement('div');
    particles.className = 'particles-container';
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = 2 + Math.random() * 2;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = 6 + Math.random() * 8;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            top: ${top}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        particles.appendChild(particle);
    }
    
    document.body.appendChild(particles);
}

// Magnetic Effect per Bottoni
function addMagneticEffect() {
    const magneticElements = document.querySelectorAll('.contact-icon, .download-btn');
    
    magneticElements.forEach(element => {
        element.classList.add('magnetic');
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.15;
            const moveY = y * 0.15;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

// Navbar Scroll Effect (handled by unified scroll handler)
function initNavbarScroll() {
    // Navbar scroll is now handled by the unified scroll handler
    // This function is kept for compatibility but does nothing
}

// Inizializza tutte le animazioni
function initAllAnimations() {
    initScrollProgress();
    createParticles();
    addMagneticEffect();
    initNavbarScroll();
}

// Esegui quando il DOM è pronto
onDOMReady(initAllAnimations);

// ============================================
// SKILLS NETWORK GRAPH
// ============================================

// Funzioni helper per generare bandiere come SVG inline (in bianco e nero)
function getLanguageFlagIcon(languageId) {
    const flags = {
        // Bandiera Italia: verde, bianco, rosso (verticale)
        'italiano': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 18"><rect width="8" height="18" fill="#4a4a4a"/><rect width="8" height="18" x="8" fill="#d0d0d0"/><rect width="8" height="18" x="16" fill="#2a2a2a"/></svg>',
        // Bandiera Gran Bretagna: Union Jack in scala di grigi
        'inglese': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 18"><rect width="24" height="18" fill="#1a1a1a"/><path d="M0 0l24 18M24 0L0 18" stroke="#d0d0d0" stroke-width="3"/><path d="M0 0l24 18M24 0L0 18" stroke="#808080" stroke-width="2"/><path d="M12 0v18M0 9h24" stroke="#d0d0d0" stroke-width="4"/><path d="M12 0v18M0 9h24" stroke="#808080" stroke-width="2.5"/></svg>'
    };
    const svg = flags[languageId];
    if (!svg) return null;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Funzioni helper per generare SVG inline per soft skills
function getSoftSkillIcon(skillId) {
    const svgTemplates = {
        'leadership': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        'problem-solving': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',
        'communication': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
        'adaptability': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
        'teamwork': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        'quality': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    };
    const svg = svgTemplates[skillId];
    if (!svg) return null;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Genera i dati delle skills usando le traduzioni
function getSkillsData(lang = currentLanguage) {
    const t = translations[lang].skills;
    const skillTranslations = t.skills;
    
    return {
        nodes: [
            // Nodo centrale
            { id: 'center', name: t.center, category: 'center', type: 'center', size: 80, color: '#FAF0E6' },
            
            // Categorie con colori distinti
            { id: 'programming-languages', name: t.categoryNames['programming-languages'], category: 'programming-languages', type: 'category', size: 60, color: '#f89820' },
            { id: 'frameworks', name: t.categoryNames.frameworks, category: 'frameworks', type: 'category', size: 60, color: '#f89820' },
            { id: 'database', name: t.categoryNames.database, category: 'database', type: 'category', size: 60, color: '#6db33f' },
            { id: 'devops', name: t.categoryNames.devops, category: 'devops', type: 'category', size: 60, color: '#0078d4' },
            { id: 'development-tools', name: t.categoryNames['development-tools'], category: 'development-tools', type: 'category', size: 60, color: '#fa8072' },
            { id: 'messaging', name: t.categoryNames.messaging, category: 'messaging', type: 'category', size: 60, color: '#fa8072' },
            { id: 'monitoring', name: t.categoryNames.monitoring, category: 'monitoring', type: 'category', size: 60, color: '#fa8072' },
            { id: 'operating-systems', name: t.categoryNames['operating-systems'], category: 'operating-systems', type: 'category', size: 60, color: '#fa8072' },
            { id: 'softskills', name: t.categoryNames.softskills, category: 'softskills', type: 'category', size: 60, color: '#9b59b6' },
            { id: 'languages', name: t.categoryNames.languages, category: 'languages', type: 'category', size: 60, color: '#e74c3c' },
            
            // Programming Languages
            { id: 'java', name: 'Java', category: 'programming-languages', type: 'skill', size: 35,
              icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg',
              experience: skillTranslations.java.experience,
              description: skillTranslations.java.description },
            
            // Frameworks
            { id: 'springboot', name: 'Spring Boot', category: 'frameworks', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spring.svg',
              experience: skillTranslations.springboot.experience,
              description: skillTranslations.springboot.description },
            { id: 'camel', name: 'Apache Camel', category: 'frameworks', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apache.svg',
              experience: skillTranslations.camel.experience,
              description: skillTranslations.camel.description },
            
            // Database
            { id: 'mysql', name: 'MySQL', category: 'database', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mysql.svg',
              experience: skillTranslations.mysql.experience,
              description: skillTranslations.mysql.description },
            { id: 'vertica', name: 'Vertica', category: 'database', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/hp.svg',
              experience: skillTranslations.vertica.experience,
              description: skillTranslations.vertica.description },
            { id: 'elasticsearch', name: 'Elasticsearch', category: 'database', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/elasticsearch.svg',
              experience: skillTranslations.elasticsearch.experience,
              description: skillTranslations.elasticsearch.description },
            { id: 'redis', name: 'Redis', category: 'database', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/redis.svg',
              experience: skillTranslations.redis.experience,
              description: skillTranslations.redis.description },
            { id: 'sqlserver', name: 'SQL Server', category: 'database', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoftsqlserver.svg',
              experience: skillTranslations.sqlserver.experience,
              description: skillTranslations.sqlserver.description },
            { id: 'hbase', name: 'HBase', category: 'database', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apache.svg',
              experience: skillTranslations.hbase.experience,
              description: skillTranslations.hbase.description },
            
            // DevOps
            { id: 'docker', name: 'Docker', category: 'devops', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/docker.svg',
              experience: skillTranslations.docker.experience,
              description: skillTranslations.docker.description },
            { id: 'kubernetes', name: 'Kubernetes', category: 'devops', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/kubernetes.svg',
              experience: skillTranslations.kubernetes.experience,
              description: skillTranslations.kubernetes.description },
            { id: 'azure', name: 'Azure', category: 'devops', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoftazure.svg',
              experience: skillTranslations.azure.experience,
              description: skillTranslations.azure.description },
            
            // Development Tools
            { id: 'git', name: 'Git', category: 'development-tools', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/git.svg',
              experience: skillTranslations.git.experience,
              description: skillTranslations.git.description },
            { id: 'maven', name: 'Maven', category: 'development-tools', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apachemaven.svg',
              experience: skillTranslations.maven.experience,
              description: skillTranslations.maven.description },
            { id: 'intellij', name: 'IntelliJ', category: 'development-tools', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/intellijidea.svg',
              experience: skillTranslations.intellij.experience,
              description: skillTranslations.intellij.description },
            { id: 'vscode', name: 'VSCode', category: 'development-tools', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visualstudiocode.svg',
              experience: skillTranslations.vscode.experience,
              description: skillTranslations.vscode.description },
            { id: 'cursor', name: 'Cursor', category: 'development-tools', type: 'skill', size: 35,
              icon: 'images/cursor-2.png',
              experience: skillTranslations.cursor.experience,
              description: skillTranslations.cursor.description },
            
            // Messaging & Streaming
            { id: 'kafka', name: 'Kafka', category: 'messaging', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apachekafka.svg',
              experience: skillTranslations.kafka.experience,
              description: skillTranslations.kafka.description },
            { id: 'activemq', name: 'ActiveMQ', category: 'messaging', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apache.svg',
              experience: skillTranslations.activemq.experience,
              description: skillTranslations.activemq.description },
            
            // Monitoring & Logging
            { id: 'graylog', name: 'Graylog', category: 'monitoring', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/graylog.svg',
              experience: skillTranslations.graylog.experience,
              description: skillTranslations.graylog.description },
            { id: 'grafana', name: 'Grafana', category: 'monitoring', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/grafana.svg',
              experience: skillTranslations.grafana.experience,
              description: skillTranslations.grafana.description },
            
            // Operating Systems
            { id: 'linux', name: 'Linux', category: 'operating-systems', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linux.svg',
              experience: skillTranslations.linux.experience,
              description: skillTranslations.linux.description },
            { id: 'macos', name: 'macOS', category: 'operating-systems', type: 'skill', size: 35,
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg',
              experience: skillTranslations.macos.experience,
              description: skillTranslations.macos.description },
            { id: 'windows', name: 'Windows', category: 'operating-systems', type: 'skill', size: 35,
              icon: 'images/windows.png',
              experience: skillTranslations.windows.experience,
              description: skillTranslations.windows.description },
            
            // Soft Skills
            { id: 'leadership', name: skillTranslations.leadership.name, category: 'softskills', type: 'softskill', size: 35,
              icon: getSoftSkillIcon('leadership'),
              experience: skillTranslations.leadership.experience,
              description: skillTranslations.leadership.description },
            { id: 'problem-solving', name: skillTranslations['problem-solving'].name, category: 'softskills', type: 'softskill', size: 35,
              icon: getSoftSkillIcon('problem-solving'),
              experience: skillTranslations['problem-solving'].experience,
              description: skillTranslations['problem-solving'].description },
            { id: 'communication', name: skillTranslations.communication.name, category: 'softskills', type: 'softskill', size: 35,
              icon: getSoftSkillIcon('communication'),
              experience: skillTranslations.communication.experience,
              description: skillTranslations.communication.description },
            { id: 'adaptability', name: skillTranslations.adaptability.name, category: 'softskills', type: 'softskill', size: 35,
              icon: getSoftSkillIcon('adaptability'),
              experience: skillTranslations.adaptability.experience,
              description: skillTranslations.adaptability.description },
            { id: 'teamwork', name: skillTranslations.teamwork.name, category: 'softskills', type: 'softskill', size: 35,
              icon: getSoftSkillIcon('teamwork'),
              experience: skillTranslations.teamwork.experience,
              description: skillTranslations.teamwork.description },
            { id: 'quality', name: skillTranslations.quality.name, category: 'softskills', type: 'softskill', size: 35,
              icon: getSoftSkillIcon('quality'),
              experience: skillTranslations.quality.experience,
              description: skillTranslations.quality.description },
            
            // Lingue
            { id: 'italiano', name: 'Italiano', category: 'languages', type: 'language', size: 35,
              icon: getLanguageFlagIcon('italiano'),
              experience: skillTranslations.italiano.experience,
              description: skillTranslations.italiano.description },
            { id: 'inglese', name: 'Inglese', category: 'languages', type: 'language', size: 35,
              icon: getLanguageFlagIcon('inglese'),
              experience: skillTranslations.inglese.experience,
              description: skillTranslations.inglese.description }
        ],
        links: [
            // Collegamenti dal centro alle categorie
            { source: 'center', target: 'programming-languages' },
            { source: 'center', target: 'frameworks' },
            { source: 'center', target: 'database' },
            { source: 'center', target: 'devops' },
            { source: 'center', target: 'development-tools' },
            { source: 'center', target: 'messaging' },
            { source: 'center', target: 'monitoring' },
            { source: 'center', target: 'operating-systems' },
            
            // Collegamenti dalle categorie alle skills
            { source: 'programming-languages', target: 'java' },
            
            { source: 'frameworks', target: 'springboot' },
            { source: 'frameworks', target: 'camel' },
            
            { source: 'database', target: 'mysql' },
            { source: 'database', target: 'vertica' },
            { source: 'database', target: 'elasticsearch' },
            { source: 'database', target: 'redis' },
            { source: 'database', target: 'sqlserver' },
            { source: 'database', target: 'hbase' },
            
            { source: 'devops', target: 'docker' },
            { source: 'devops', target: 'kubernetes' },
            { source: 'devops', target: 'azure' },
            
            { source: 'development-tools', target: 'git' },
            { source: 'development-tools', target: 'maven' },
            { source: 'development-tools', target: 'intellij' },
            { source: 'development-tools', target: 'vscode' },
            { source: 'development-tools', target: 'cursor' },
            
            { source: 'messaging', target: 'kafka' },
            { source: 'messaging', target: 'activemq' },
            
            { source: 'monitoring', target: 'graylog' },
            { source: 'monitoring', target: 'grafana' },
            
            { source: 'operating-systems', target: 'linux' },
            { source: 'operating-systems', target: 'macos' },
            { source: 'operating-systems', target: 'windows' },
            
            // Collegamenti dal centro alle nuove categorie
            { source: 'center', target: 'softskills' },
            { source: 'center', target: 'languages' },
            
            // Collegamenti dalle categorie alle soft skills
            { source: 'softskills', target: 'leadership' },
            { source: 'softskills', target: 'problem-solving' },
            { source: 'softskills', target: 'communication' },
            { source: 'softskills', target: 'adaptability' },
            { source: 'softskills', target: 'teamwork' },
            { source: 'softskills', target: 'quality' },
            
            // Collegamenti dalle categorie alle lingue
            { source: 'languages', target: 'italiano' },
            { source: 'languages', target: 'inglese' }
        ]
    };
}

// Funzione per creare la lista mobile delle skills
function initSkillsMobileList(lang = currentLanguage) {
    const mobileList = document.getElementById('skills-mobile-list');
    if (!mobileList) return;
    
    const skillsData = getSkillsData(lang);
    
    // Raggruppa le skills per categoria
    const skillsByCategory = {};
    const categories = {};
    
    // Inizializza le categorie
    skillsData.nodes.forEach(node => {
        if (node.type === 'category') {
            categories[node.id] = node;
            skillsByCategory[node.id] = [];
        }
    });
    
    // Raggruppa le skills per categoria
    skillsData.links.forEach(link => {
        const sourceId = typeof link.source === 'string' ? link.source : (link.source?.id || link.source);
        const targetId = typeof link.target === 'string' ? link.target : (link.target?.id || link.target);
        
        const targetNode = skillsData.nodes.find(n => n.id === targetId);
        if (targetNode && (targetNode.type === 'skill' || targetNode.type === 'softskill' || targetNode.type === 'language')) {
            if (skillsByCategory[sourceId]) {
                skillsByCategory[sourceId].push(targetNode);
            }
        }
    });
    
    // Ordina le categorie in un ordine specifico
    const categoryOrder = [
        'programming-languages',
        'frameworks',
        'database',
        'devops',
        'development-tools',
        'messaging',
        'monitoring',
        'operating-systems',
        'softskills',
        'languages'
    ];
    
    mobileList.innerHTML = '';
    
    categoryOrder.forEach(categoryId => {
        if (!categories[categoryId] || !skillsByCategory[categoryId] || skillsByCategory[categoryId].length === 0) {
            return;
        }
        
        const category = categories[categoryId];
        const skills = skillsByCategory[categoryId];
        
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'mobile-skill-category';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'mobile-category-title';
        categoryTitle.textContent = category.name;
        categoryDiv.appendChild(categoryTitle);
        
        skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'mobile-skill-item';
            
            let itemHTML = '';
            
            if (skill.icon) {
                const iconSrc = skill.icon;
                // Cursor e Windows non devono avere il filtro di inversione colori
                const filterStyle = (skill.id === 'cursor' || skill.id === 'windows') ? '' : 'filter: brightness(0) invert(1);';
                itemHTML += `<img src="${iconSrc}" alt="${skill.name}" class="mobile-skill-icon" style="${filterStyle}">`;
            }
            
            itemHTML += `
                <div class="mobile-skill-content">
                    <h4 class="mobile-skill-name">${skill.name}</h4>
                    <p class="mobile-skill-description">${skill.description || getTranslation('common.noDescription')}</p>
                    ${skill.experience ? `<span class="mobile-skill-experience">${skill.experience}</span>` : ''}
                </div>
            `;
            
            skillItem.innerHTML = itemHTML;
            categoryDiv.appendChild(skillItem);
        });
        
        mobileList.appendChild(categoryDiv);
    });
}

// Skills Network Graph 2D migliorato con D3.js
function initSkillsNetwork(lang = currentLanguage) {
    const container = document.getElementById('skills-network-2d');
    const mobileList = document.getElementById('skills-mobile-list');
    
    // Controlla se siamo su mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Su mobile, mostra la lista invece del grafo
        if (mobileList) {
            initSkillsMobileList(lang);
        }
        return;
    }
    
    // Su desktop, mostra il grafo
    if (!container || typeof d3 === 'undefined') return;
    
    // Rimuovi contenuto precedente se esiste
    container.innerHTML = '';
    
    // Aumenta il padding per evitare che i nodi escano dai bordi
    const padding = 100; // Padding maggiore per contenere tutti i nodi
    const width = container.parentElement.clientWidth - (padding * 2);
    const height = container.parentElement.clientHeight - (padding * 2);
    
    // Dati delle competenze organizzate per categoria (usando traduzioni)
    const skillsData = getSkillsData(lang);
    
    // Crea SVG con dimensioni che includono il padding
    const svg = d3.select('#skills-network-2d')
        .attr('width', width + (padding * 2))
        .attr('height', height + (padding * 2));
    
    const g = svg.append('g');
    
    // Simulazione fisica con forze migliorate
    const simulation = d3.forceSimulation(skillsData.nodes)
        .force('link', d3.forceLink(skillsData.links)
            .id(d => d.id)
            .distance(d => {
                // Distanze diverse in base al tipo di collegamento (aumentate per più spazio)
                if (d.source.type === 'center') return 200;
                if (d.source.type === 'category') return 160;
                return 130;
            })
            .strength(0.5))
        .force('charge', d3.forceManyBody()
            .strength(d => {
                // Carica diversa in base al tipo (aumentata per più spazio)
                if (d.type === 'center') return -2500;
                if (d.type === 'category') return -1000;
                return -500;
            }))
        .force('center', d3.forceCenter(width / 2 + padding, height / 2 + padding))
        .force('collision', d3.forceCollide()
            .radius(d => (d.size || 40) + 20))
        .force('x', d3.forceX(width / 2 + padding).strength(0.15))
        .force('y', d3.forceY(height / 2 + padding).strength(0.15));
    
    // Disegna i collegamenti
    const link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(skillsData.links)
        .enter()
        .append('line')
        .attr('class', 'skill-link')
        .attr('stroke', d => {
            // Colore del collegamento basato sulla categoria
            if (d.target.type === 'category') {
                return d.target.color || '#FAF0E6';
            }
            return '#2a2a2a';
        })
        .attr('stroke-width', d => d.target.type === 'category' ? 3 : 2)
        .attr('stroke-opacity', d => d.target.type === 'category' ? 0.6 : 0.4);
    
    // Disegna i nodi
    const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(skillsData.nodes)
        .enter()
        .append('g')
        .attr('class', d => `skill-node ${d.type} ${d.category}`)
        .call(drag(simulation));
    
    // Cerchi di sfondo per center e category
    node.filter(d => d.type === 'center' || d.type === 'category')
        .append('circle')
        .attr('r', d => d.size || 40)
        .attr('fill', d => d.color || '#FAF0E6')
        .attr('stroke', d => d.color || '#FAF0E6')
        .attr('stroke-width', d => d.type === 'center' ? 0.8 : 0.5)
        .attr('opacity', 0.9);
    
    // Cerchi con contorno per i nodi skill, softskill e language (sfondo per l'icona)
    node.filter(d => d.type === 'skill' || d.type === 'softskill' || d.type === 'language')
        .append('circle')
        .attr('r', d => d.size || 40)
        .attr('fill', '#1a1a1a')
        .attr('stroke', '#FAF0E6')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.9);
    
    // Aggiungi filtro per rendere le icone visibili (inverti i colori)
    const defs = svg.append('defs');
    const filter = defs.append('filter')
        .attr('id', 'icon-filter');
    filter.append('feColorMatrix')
        .attr('type', 'matrix')
        .attr('values', '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'); // Inverte i colori (bianco)
    
    // Aggiungi icone per i nodi skill (con URL esterni) - lazy loading
    const skillImages = node.filter(d => d.type === 'skill' && d.icon)
        .append('image')
        .attr('href', d => d.icon)
        .attr('x', d => -(d.size || 40) * 0.6)
        .attr('y', d => -(d.size || 40) * 0.6)
        .attr('width', d => (d.size || 40) * 1.2)
        .attr('height', d => (d.size || 40) * 1.2)
        .attr('opacity', 0.9)
        .attr('loading', 'lazy');
    
    // Applica il filtro di inversione solo alle skill che non sono Cursor
    skillImages.filter(d => d.id !== 'cursor')
        .attr('filter', 'url(#icon-filter)');
    
    // Aggiungi bandiere per le lingue (senza filtro di inversione colori)
    node.filter(d => d.type === 'language' && d.icon)
        .append('image')
        .attr('href', d => d.icon)
        .attr('x', d => -(d.size || 40) * 0.6)
        .attr('y', d => -(d.size || 40) * 0.6)
        .attr('width', d => (d.size || 40) * 1.2)
        .attr('height', d => (d.size || 40) * 1.2)
        .attr('opacity', 0.9);
    
    // Aggiungi icone SVG inline per soft skills (create direttamente come path)
    const softSkillPaths = {
        'leadership': [
            { type: 'path', d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' },
            { type: 'circle', cx: 9, cy: 7, r: 4 },
            { type: 'path', d: 'M23 21v-2a4 4 0 0 0-3-3.87' },
            { type: 'path', d: 'M16 3.13a4 4 0 0 1 0 7.75' }
        ],
        'problem-solving': [
            { type: 'circle', cx: 12, cy: 12, r: 10 },
            { type: 'path', d: 'M12 16v-4' },
            { type: 'path', d: 'M12 8h.01' }
        ],
        'communication': [
            { type: 'path', d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }
        ],
        'adaptability': [
            { type: 'path', d: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }
        ],
        'teamwork': [
            { type: 'path', d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' },
            { type: 'circle', cx: 9, cy: 7, r: 4 },
            { type: 'path', d: 'M22 21v-2a4 4 0 0 0-3-3.87' },
            { type: 'path', d: 'M16 3.13a4 4 0 0 1 0 7.75' }
        ],
        'quality': [
            { type: 'polyline', points: '20 6 9 17 4 12' }
        ]
    };
    
    node.filter(d => d.type === 'softskill' && d.icon)
        .each(function(d) {
            const nodeGroup = d3.select(this);
            const size = d.size || 40;
            const iconSize = size * 1.2;
            const scale = iconSize / 24; // Scala da 24px a iconSize
            
            // Crea un gruppo per l'icona centrato rispetto al nodo
            // Il nodo è già centrato a (0,0), quindi scaliamo e spostiamo indietro di metà viewBox
            const iconGroup = nodeGroup.append('g')
                .attr('transform', `scale(${scale}) translate(-12, -12)`)
                .attr('fill', 'none')
                .attr('stroke', '#FAF0E6')
                .attr('stroke-width', '2')
                .attr('stroke-linecap', 'round')
                .attr('stroke-linejoin', 'round');
            
            const paths = softSkillPaths[d.id];
            if (paths) {
                paths.forEach(pathData => {
                    if (pathData.type === 'path') {
                        iconGroup.append('path').attr('d', pathData.d);
                    } else if (pathData.type === 'circle') {
                        iconGroup.append('circle')
                            .attr('cx', pathData.cx)
                            .attr('cy', pathData.cy)
                            .attr('r', pathData.r);
                    } else if (pathData.type === 'polyline') {
                        iconGroup.append('polyline')
                            .attr('points', pathData.points);
                    }
                });
            }
        });
    
    // Aggiungi testo per soft skills e lingue senza icone
    node.filter(d => (d.type === 'softskill' || d.type === 'language') && !d.icon)
        .append('text')
        .text(d => {
            // Abbrevia nomi lunghi
            if (d.name === 'Focus sulla Qualità') return 'Qualità';
            if (d.name === 'Problem Solving') return 'Problem Solving';
            return d.name;
        })
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('fill', '#e0e0e0')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('pointer-events', 'none');
    
    // Etichette testo solo per center e category (rimuoviamo quelle per skill)
    node.filter(d => d.type === 'center' || d.type === 'category')
        .append('text')
        .text(d => d.name)
        .attr('dy', 5)
        .attr('font-size', d => d.type === 'center' ? '18px' : '16px')
        .attr('font-weight', '600')
        .attr('fill', '#0a0a0a')
        .attr('text-anchor', 'middle')
        .attr('pointer-events', 'none');
    
    // Aggiorna posizioni durante la simulazione
    simulation.on('tick', () => {
        // Mantieni il nodo centrale fisso (con padding)
        skillsData.nodes.forEach(d => {
            if (d.type === 'center') {
                d.x = width / 2 + padding;
                d.y = height / 2 + padding;
                d.fx = width / 2 + padding;
                d.fy = height / 2 + padding;
            } else {
                // Mantieni tutti i nodi all'interno del container
                const radius = (d.size || 40) + 10;
                const minX = padding + radius;
                const maxX = width + padding - radius;
                const minY = padding + radius;
                const maxY = height + padding - radius;
                
                if (d.x < minX) {
                    d.x = minX;
                    d.vx = 0;
                }
                if (d.x > maxX) {
                    d.x = maxX;
                    d.vx = 0;
                }
                if (d.y < minY) {
                    d.y = minY;
                    d.vy = 0;
                }
                if (d.y > maxY) {
                    d.y = maxY;
                    d.vy = 0;
                }
            }
        });
        
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
    
    // Gestione click per aprire pannello dettagli
    node.on('click', (event, d) => {
        event.stopPropagation();
        if (d.type === 'skill' || d.type === 'softskill' || d.type === 'language') {
            showSkillDetails(d);
        } else if (d.type === 'category' || d.type === 'center') {
            showCategoryDetails(d, skillsData);
        }
    });
    
    // Hover effects - evidenzia nodo e collegamenti
    node.on('mouseenter', function(event, d) {
        if (d.type === 'skill' || d.type === 'softskill' || d.type === 'language') {
            const nodeGroup = d3.select(this);
            nodeGroup.select('circle')
                .transition()
                .duration(200)
                .attr('r', (d.size || 40) * 1.3)
                .attr('stroke-width', 0.8)
                .attr('opacity', 1);
            
            // Ingrandisci anche l'icona (se presente)
            const image = nodeGroup.select('image');
            if (!image.empty()) {
                image.transition()
                    .duration(200)
                    .attr('x', -(d.size || 40) * 0.6 * 1.3)
                    .attr('y', -(d.size || 40) * 0.6 * 1.3)
                    .attr('width', (d.size || 40) * 1.2 * 1.3)
                    .attr('height', (d.size || 40) * 1.2 * 1.3)
                    .attr('opacity', 1);
            }
            
            // Ingrandisci anche il testo (per soft skills e lingue)
            const text = nodeGroup.select('text');
            if (!text.empty()) {
                text.transition()
                    .duration(200)
                    .attr('font-size', '13px');
            }
            
            // Evidenzia collegamenti collegati
            link.style('stroke-opacity', l => {
                return (l.source === d || l.target === d) ? 0.8 : 0.1;
            });
            
            // Evidenzia nodi collegati
            node.style('opacity', n => {
                if (n === d) return 1;
                const isConnected = skillsData.links.some(l => 
                    (l.source === d && l.target === n) || (l.source === n && l.target === d)
                );
                return isConnected ? 1 : 0.3;
            });
        }
    });
    
    node.on('mouseleave', function(event, d) {
        if (d.type === 'skill' || d.type === 'softskill' || d.type === 'language') {
            const nodeGroup = d3.select(this);
            nodeGroup.select('circle')
                .transition()
                .duration(200)
                .attr('r', d.size || 40)
                .attr('stroke-width', 0.5)
                .attr('opacity', 0.9);
            
            // Ripristina dimensione icona (se presente)
            const image = nodeGroup.select('image');
            if (!image.empty()) {
                image.transition()
                    .duration(200)
                    .attr('x', -(d.size || 40) * 0.6)
                    .attr('y', -(d.size || 40) * 0.6)
                    .attr('width', (d.size || 40) * 1.2)
                    .attr('height', (d.size || 40) * 1.2)
                    .attr('opacity', 0.9);
            }
            
            // Ripristina dimensione testo (per soft skills e lingue)
            const text = nodeGroup.select('text');
            if (!text.empty()) {
                text.transition()
                    .duration(200)
                    .attr('font-size', '11px');
            }
            
            // Ripristina tutti i collegamenti
            link.style('stroke-opacity', l => {
                if (l.target.type === 'category') return 0.6;
                return 0.4;
            });
            
            // Ripristina tutti i nodi
            node.style('opacity', 0.9);
        }
    });
    
    // Funzione drag
    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            if (d.type !== 'center') {
                d.fx = null;
                d.fy = null;
            }
        }
        
        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }
}

// Mostra pannello dettagli per una singola skill
function showSkillDetails(skill) {
    const panel = document.getElementById('skill-details-panel');
    const icon = document.getElementById('panel-icon');
    const title = document.getElementById('panel-title');
    const description = document.getElementById('panel-description');
    const experience = document.getElementById('panel-experience');
    const category = document.getElementById('panel-category');
    const itemsList = document.getElementById('panel-items-list');
    
    if (!panel || !icon || !title || !description || !experience || !category || !itemsList) return;
    
    // Nascondi la lista di items (per singole skill)
    itemsList.innerHTML = '';
    itemsList.style.display = 'none';
    description.style.display = 'block';
    
    if (skill.icon) {
        icon.src = skill.icon;
        icon.style.display = 'block';
        // Rimuovi il filtro di inversione per Cursor per mantenere i colori originali
        if (skill.id === 'cursor') {
            icon.style.filter = 'none';
        } else {
            icon.style.filter = '';
        }
    } else {
        icon.style.display = 'none';
    }
    
    title.textContent = skill.name;
    description.textContent = skill.description || getTranslation('common.noDescription');
    experience.textContent = skill.experience || 'N/A';
    
    const categoryKey = `skills.categories.${skill.category}`;
    category.textContent = getTranslation(categoryKey) || skill.category;
    
    panel.classList.remove('hidden');
}

// Mostra pannello dettagli per una categoria o il nodo centrale
function showCategoryDetails(categoryNode, skillsData) {
    const panel = document.getElementById('skill-details-panel');
    const icon = document.getElementById('panel-icon');
    const title = document.getElementById('panel-title');
    const description = document.getElementById('panel-description');
    const experience = document.getElementById('panel-experience');
    const category = document.getElementById('panel-category');
    const itemsList = document.getElementById('panel-items-list');
    
    if (!panel || !icon || !title || !description || !experience || !category || !itemsList) return;
    
    // Nascondi descrizione e mostra lista
    description.style.display = 'none';
    itemsList.style.display = 'block';
    itemsList.innerHTML = '';
    
    // Nascondi icona per categorie
    icon.style.display = 'none';
    
    title.textContent = categoryNode.name;
    
    // Trova tutti i nodi collegati a questa categoria
    let childNodes = [];
    
    if (categoryNode.type === 'center') {
        // Se è il nodo centrale, mostra tutte le competenze tecniche (skill, softskill, language)
        childNodes = skillsData.nodes.filter(n => 
            n.type === 'skill' || n.type === 'softskill' || n.type === 'language'
        );
    } else {
        // Altrimenti mostra tutti i nodi figli della categoria
        // I link inizialmente hanno source e target come stringhe (ID)
        childNodes = skillsData.links
            .filter(link => {
                // Controlla se il link ha source come stringa o oggetto
                const sourceId = typeof link.source === 'string' ? link.source : (link.source?.id || link.source);
                return sourceId === categoryNode.id;
            })
            .map(link => {
                // Estrai l'ID del target
                const targetId = typeof link.target === 'string' ? link.target : (link.target?.id || link.target);
                return skillsData.nodes.find(n => n.id === targetId);
            })
            .filter(n => n && (n.type === 'skill' || n.type === 'softskill' || n.type === 'language'));
    }
    
    if (childNodes.length === 0) {
        const noItemsText = getTranslation('skills.noItems');
        itemsList.innerHTML = `<p style="color: var(--text-secondary);">${noItemsText}</p>`;
    } else {
        childNodes.forEach(child => {
            const item = document.createElement('div');
            item.className = 'category-item';
            
            let itemContent = '';
            if (child.icon) {
                // Don't apply filter to language flags, cursor, or windows icons
                const filterStyle = (child.type === 'language' || child.id === 'cursor' || child.id === 'windows') 
                    ? '' 
                    : 'filter: brightness(0) invert(1);';
                itemContent += `<img src="${child.icon}" alt="${child.name}" class="category-item-icon" style="width: 24px; height: 24px; ${filterStyle} margin-right: 0.75rem;">`;
            }
            itemContent += `
                <div class="category-item-content">
                    <h4 class="category-item-name">${child.name}</h4>
                    <p class="category-item-description">${child.description || getTranslation('common.noDescription')}</p>
                    ${child.experience ? `<span class="category-item-experience">${child.experience}</span>` : ''}
                </div>
            `;
            
            item.innerHTML = itemContent;
            itemsList.appendChild(item);
        });
    }
    
    // Aggiorna meta informazioni
    if (categoryNode.type === 'center') {
        const skillsCount = getTranslation('skills.skillsCount');
        experience.textContent = `${childNodes.length} ${skillsCount}`;
        category.textContent = getTranslation('skills.categories.all');
    } else {
        const itemsCount = getTranslation('skills.itemsCount');
        experience.textContent = `${childNodes.length} ${itemsCount}`;
        category.textContent = categoryNode.name;
    }
    
    panel.classList.remove('hidden');
}

// Chiudi pannello
function initSkillPanel() {
    const closeBtn = document.querySelector('.close-panel');
    const panel = document.getElementById('skill-details-panel');
    
    if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => {
            panel.classList.add('hidden');
        });
        
        // Chiudi cliccando fuori
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !e.target.closest('.skill-node') && !e.target.closest('#skills-network-2d')) {
                panel.classList.add('hidden');
            }
        });
    }
}

// Inizializza quando il DOM è pronto
onDOMReady(() => {
    initSkillsNetwork();
    initSkillPanel();
    
    // Gestisci il resize per passare da mobile a desktop e viceversa
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const lang = currentLanguage;
            initSkillsNetwork(lang);
        }, 250);
    });
});

