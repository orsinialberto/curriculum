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

// Highlight active navigation item on scroll
const sections = document.querySelectorAll('section[id], header[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

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

// Animate progress bars when languages section is visible
function animateProgressBars() {
    const languagesSection = document.getElementById('languages');
    if (!languagesSection) return;
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('progress-animated')) {
                entry.target.classList.add('progress-animated');
                
                const progressBars = entry.target.querySelectorAll('.progress-fill');
                progressBars.forEach(bar => {
                    const percentage = bar.getAttribute('data-percentage');
                    setTimeout(() => {
                        bar.style.width = percentage + '%';
                    }, 300);
                });
                
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    progressObserver.observe(languagesSection);
}

// Initialize progress bars animation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateProgressBars);
} else {
    animateProgressBars();
}

// Skills section - le competenze sono ora mostrate direttamente nell'HTML

// Experience terminal commands data
const experienceCommands = [
    {
        command: 'git log --graph --decorate --all',
        output: '* commit 2077c89411067468a44ad143d4e0de30263d0a3a (HEAD -> main, origin/main) (tag: 2.1.0)\n' +
            '| Author:   Alberto Orsini <orsini.alberto@hotmail.it>\n' +
            '| Role:     Software Developer / Scrum Master\n' +
            '| Company:  ContactLab / Team System \n' +
            '| Tech:     Java 17 · Spring Boot 2.5 · Jmx · MySQL · Elasticsearch · Kafka · ActiveMQ ·\n' + 
            '|           Redis · Docker · Kubernetes · Azure · Maven · Git · Linux/Windows\n' +
            '| Date:     Mon Nov 07 09:00:00 2022 +0100\n' +
            '|\n' +
            '|     Sviluppo back-end della Customer Data Platform Contactlab, \n' +
            '|     piattaforma di marketing automation ad alta scalabilità.\n' +
            '|     Contributo ai moduli Hub, Plan, Flow e a componenti del sistema Send. \n' +
            '|     Attività di analisi, sviluppo, testing e \n' +
            '|     rilascio di API REST in Java in contesto Continuous Delivery. \n' +
            '|     Facilitazione delle cerimonie Scrum e supporto al team come Scrum Master. \n' +
            '|     Collaborazione con Customer Service per analisi e risoluzione ticket. \n' +
            '|     Adozione di best practice su qualità, performance e monitoraggio.\n' +
            '|\n' +
            '* commit 7b257fc96ce8f12c0e996a6945b71879a0db4ee4 (2.0.0)\n' +
            '| Author:   Alberto Orsini <orsini.alberto@hotmail.it>\n' +
            '| Role:     Software Developer\n' +
            '| Company:  Anoki Srl / Consulenza presso ContactLab\n' +
            '| Tech:     Java 8 · Springboot 1.5 · Akka · Apache Camel · MySQL · HBase · Vertica ·\n' +
            '|           Docker ·Maven · Git · Linux\n' +
            '| Date:     Mon Jul 03 09:00:00 2017 +0100\n' +
            '|\n' +
            '|     Consulenza presso Contactlab con focus su sviluppo back-end e API REST. \n' +
            '|     Attività simili alla posizione attuale con focus su sviluppo e \n' +
            '|     manutenzione della piattaforma.\n' +
            '|\n' +
            '* commit 6683c591d5e2485085cfd68bfafd5a082443b979 (1.0.0)\n' +
            '  Author:   Alberto Orsini <orsini.alberto@hotmail.it>\n' +
            '  Role:     Fullstack Developer\n' +
            '  Company:  Anoki Srl / Consulenza presso Binari Sonori  \n' +
            '  Tech:     Java 8 · Spring · Hibernate · SQL Server · JSP · JavaScript · jQuery · HTML · \n' +
            '            CSS · Git · Windows\n' +
            '  Date:     Mon Oct 10 09:00:00 2016 +0100\n' +
            '\n' +
            '      Initial commit: Sviluppo del sistema BPS (Business Production System) \n' +
            '      per gestione progetti di traduzione multimediale. \n' +
            '      Implementazione back-end (Java) e front-end (JSP, JavaScript). \n' +
            '      Manutenzione applicativa e supporto diretto al cliente. Refactoring \n' +
            '      e ottimizzazione del codice seguendo SonarQube.'
    }
];

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

// Experience terminal typing effect
function typeExperienceTerminal() {
    const terminalOutput = document.getElementById('experience-terminal-output');
    if (!terminalOutput) return;
    
    let commandIndex = 0;
    let charIndex = 0;
    let isTypingCommand = true;
    let currentCommand = '';
    
    function processOutputWithColors(text) {
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
                setTimeout(typeNextChar, 50); // Velocità typing
            } else {
                // Comando completato, mostra output
                isTypingCommand = false;
                charIndex = 0;
                setTimeout(typeNextChar, 500);
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
                const processedText = processOutputWithColors(textToProcess);
                outputContainer.innerHTML = processedText;
                charIndex++;
                // Scroll automatico
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                setTimeout(typeNextChar, 30); // Velocità output
            } else {
                // Output completato, passa al prossimo comando
                isTypingCommand = true;
                charIndex = 0;
                commandIndex++;
                setTimeout(typeNextChar, 800);
            }
        }
    }
    
    // Inizia il typing quando la sezione è visibile
    const experienceSection = document.getElementById('experience');
    if (experienceSection) {
        const terminalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('terminal-started')) {
                    entry.target.classList.add('terminal-started');
                    setTimeout(() => typeNextChar(), 500);
                    terminalObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        terminalObserver.observe(experienceSection);
    }
}

// Inizializza quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', typeExperienceTerminal);
} else {
    typeExperienceTerminal();
}

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
                    warning.innerHTML = `
                        <p>⚠️ Limite API GitHub raggiunto. Mostro progetti dalla cache.</p>
                        <p class="warning-subtitle">I dati potrebbero non essere aggiornati.</p>
                    `;
                    projectsGrid.parentElement.insertBefore(warning, projectsGrid);
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
                resetMessage = `Il limite si resetta alle ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}.`;
            }
            
            projectsGrid.innerHTML = `
                <div class="projects-error">
                    <p><strong>Limite API GitHub raggiunto</strong></p>
                    <p>Hai superato il limite di chiamate giornaliere all'API di GitHub.</p>
                    <p class="error-subtitle">${resetMessage}</p>
                    <p class="error-subtitle">Visita il mio <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color);">profilo GitHub</a> per vedere i progetti.</p>
                </div>
            `;
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
            projectsGrid.innerHTML = '<div class="projects-error">Nessun progetto trovato</div>';
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
                warning.innerHTML = `
                    <p>⚠️ Errore nel caricamento. Mostro progetti dalla cache.</p>
                `;
                projectsGrid.parentElement.insertBefore(warning, projectsGrid);
                return;
            } catch (e) {
                // Cache non valida
            }
        }
        
        projectsGrid.innerHTML = `
            <div class="projects-error">
                <p><strong>Errore nel caricamento dei progetti</strong></p>
                <p>Visita il mio <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color);">profilo GitHub</a> per vedere i progetti.</p>
            </div>
        `;
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
    
    // Formatta la data
    const updatedDate = new Date(repo.updated_at);
    const formattedDate = updatedDate.toLocaleDateString('it-IT', { 
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
    
    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-name">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                    ${repo.name}
                </a>
            </h3>
            <div class="project-stats">
                <div class="project-stat" title="Stelle">
                    <svg fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                    </svg>
                    <span>${repo.stargazers_count}</span>
                </div>
                <div class="project-stat" title="Fork">
                    <svg fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                    </svg>
                    <span>${repo.forks_count}</span>
                </div>
            </div>
        </div>
        <p class="project-description">${repo.description || 'Nessuna descrizione disponibile'}</p>
        ${languages.length > 0 ? `
            <div class="project-languages">
                ${languages.slice(0, 4).map(lang => {
                    const color = languageColors[lang] || '#3b82f6';
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
            <span class="project-updated">Aggiornato: ${formattedDate}</span>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                Vedi su GitHub
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGitHubProjects);
} else {
    loadGitHubProjects();
}

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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const downloadBtn = document.getElementById('download-pdf');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', downloadPDF);
        }
    });
} else {
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadPDF);
    }
}

// Animazioni più fluide per soft skills cards
function animateSoftSkillsCards() {
    const softSkillsSection = document.getElementById('soft-skills');
    if (!softSkillsSection) return;
    
    const cards = softSkillsSection.querySelectorAll('.soft-skill-card');
    
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            // Aggiungi un leggero delay per effetto cascata
            this.style.transitionDelay = `${index * 0.05}s`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transitionDelay = '0s';
        });
    });
}

// Inizializza animazioni soft skills
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateSoftSkillsCards);
} else {
    animateSoftSkillsCards();
}

// Miglioramento animazioni scroll con requestAnimationFrame
let ticking = false;

function updateScrollAnimations() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Le animazioni sono gestite da IntersectionObserver
            ticking = false;
        });
        ticking = true;
    }
}

// Throttle per scroll events
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (Math.abs(scrollTop - lastScrollTop) > 5) {
        updateScrollAnimations();
        lastScrollTop = scrollTop;
    }
}, { passive: true });

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
document.querySelectorAll('.section, .soft-skill-card, .project-card').forEach(el => {
    revealObserver.observe(el);
});

// ============================================
// ANIMAZIONI AVANZATE
// ============================================

// Scroll Progress Bar
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
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

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
}

// Inizializza tutte le animazioni
function initAllAnimations() {
    initScrollProgress();
    createParticles();
    addMagneticEffect();
    initNavbarScroll();
}

// Esegui quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
} else {
    initAllAnimations();
}

