

document.addEventListener("DOMContentLoaded", () => {
    
    const state = {
        theme: localStorage.getItem("theme") || "light",
        user: JSON.parse(localStorage.getItem("flashcard_user") || "null"),
        currentDeck: [],
        deckTitle: "Untitled Deck",
        deckDifficulty: "Medium",
        currentIndex: 0,
        uploadedTextContent: "",
        settings: {
            cardCount: 10,
            difficulty: "Medium",
            style: "Mixed",
            language: "English"
        },
        savedDecks: JSON.parse(localStorage.getItem("flashcard_decks") || "[]")
    };

    
    const screens = {
        create: document.getElementById("createScreen"),
        loading: document.getElementById("loadingScreen"),
        study: document.getElementById("studyScreen"),
        completion: document.getElementById("completionScreen"),
        decks: document.getElementById("decksScreen")
    };

    const navButtons = {
        create: document.getElementById("navCreate"),
        decks: document.getElementById("navDecks"),
        study: document.getElementById("navStudy")
    };

    const themeToggleBtn = document.getElementById("themeToggle");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");

    const profileAvatarBtn = document.getElementById("profileAvatarBtn");
    const authModal = document.getElementById("authModal");
    const closeAuthModalBtn = document.getElementById("closeAuthModalBtn");

    const authFormView = document.getElementById("authFormView");
    const authProfileView = document.getElementById("authProfileView");

    const tabLoginBtn = document.getElementById("tabLoginBtn");
    const tabRegisterBtn = document.getElementById("tabRegisterBtn");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const profileNameDisplay = document.getElementById("profileNameDisplay");
    const profileEmailDisplay = document.getElementById("profileEmailDisplay");
    const profileAvatarLarge = document.getElementById("profileAvatarLarge");
    const userDeckCount = document.getElementById("userDeckCount");
    const logoutBtn = document.getElementById("logoutBtn");

    const notesInput = document.getElementById("notesInput");
    const clearTextBtn = document.getElementById("clearTextBtn");
    const charCount = document.getElementById("charCount");
    const wordCount = document.getElementById("wordCount");
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const browseBtn = document.getElementById("browseBtn");
    const fileBadge = document.getElementById("fileBadge");
    const generateBtn = document.getElementById("generateBtn");

    const cardCountGroup = document.getElementById("cardCountGroup");
    const difficultyGroup = document.getElementById("difficultyGroup");
    const styleSelect = document.getElementById("styleSelect");
    const langSelect = document.getElementById("langSelect");

    const loadingStatusText = document.getElementById("loadingStatusText");
    const loadingProgress = document.getElementById("loadingProgress");

    const flashcard = document.getElementById("flashcard");
    const studyDeckTitle = document.getElementById("studyDeckTitle");
    const studyDeckBadge = document.getElementById("studyDeckBadge");
    const studyProgressText = document.getElementById("studyProgressText");
    const studyProgressFill = document.getElementById("studyProgressFill");
    const cardQuestionText = document.getElementById("cardQuestionText");
    const cardAnswerText = document.getElementById("cardAnswerText");
    const cardTopicTag = document.getElementById("cardTopicTag");
    const cardKeyConcept = document.getElementById("cardKeyConcept");

    const prevCardBtn = document.getElementById("prevCardBtn");
    const nextCardBtn = document.getElementById("nextCardBtn");
    const backToCreateBtn = document.getElementById("backToCreateBtn");
    
    // Rating Buttons
    const btnEasy = document.getElementById("btnEasy");
    const btnModerate = document.getElementById("btnModerate");
    const btnDifficult = document.getElementById("btnDifficult");

    const statTotalReviewed = document.getElementById("statTotalReviewed");
    const restartStudyBtn = document.getElementById("restartStudyBtn");
    const finishToCreateBtn = document.getElementById("finishToCreateBtn");
    const clearAllDecksBtn = document.getElementById("clearAllDecksBtn");
    const clearDecksHeaderBtn = document.getElementById("clearDecksHeaderBtn");
    const decksGrid = document.getElementById("decksGrid");

    // ==========================================
    // INITIALIZATION & THEME
    // ==========================================
    function initApp() {
        applyTheme(state.theme);
        updateUserUI();
        bindEvents();
        renderSavedDecks();
    }

    function applyTheme(theme) {
        state.theme = theme;
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        themeToggleBtn.innerHTML = theme === "dark" 
            ? '<i class="fa-solid fa-sun"></i>' 
            : '<i class="fa-solid fa-moon"></i>';
    }

    function updateUserUI() {
        if (!profileAvatarBtn) return;
        if (state.user) {
            profileAvatarBtn.textContent = state.user.name.charAt(0).toUpperCase();
            if (profileNameDisplay) profileNameDisplay.textContent = state.user.name;
            if (profileEmailDisplay) profileEmailDisplay.textContent = state.user.email;
            if (profileAvatarLarge) profileAvatarLarge.textContent = state.user.name.charAt(0).toUpperCase();
            if (userDeckCount) userDeckCount.textContent = state.savedDecks.length;

            if (authFormView) authFormView.classList.add("hidden");
            if (authProfileView) authProfileView.classList.remove("hidden");
        } else {
            profileAvatarBtn.innerHTML = '<i class="fa-solid fa-user"></i>';
            if (authFormView) authFormView.classList.remove("hidden");
            if (authProfileView) authProfileView.classList.add("hidden");
        }
    }

    function openModal() {
        if (authModal) authModal.classList.add("active");
    }

    function closeModal() {
        if (authModal) authModal.classList.remove("active");
    }

    function showScreen(targetScreenName) {
        Object.keys(screens).forEach(key => {
            if (screens[key]) {
                screens[key].classList.toggle("active", key === targetScreenName);
            }
        });

        if (navButtons.create) navButtons.create.classList.toggle("active", targetScreenName === "create");
        if (navButtons.decks) navButtons.decks.classList.toggle("active", targetScreenName === "decks");
        if (navButtons.study) navButtons.study.classList.toggle("active", targetScreenName === "study");
        
        if (navLinks) navLinks.classList.remove("show");
    }

    
    function bindEvents() {
        themeToggleBtn.addEventListener("click", () => {
            applyTheme(state.theme === "dark" ? "light" : "dark");
        });

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener("click", () => {
                navLinks.classList.toggle("show");
            });
        }

        if (profileAvatarBtn) profileAvatarBtn.addEventListener("click", openModal);
        if (closeAuthModalBtn) closeAuthModalBtn.addEventListener("click", closeModal);
        if (authModal) {
            authModal.addEventListener("click", (e) => {
                if (e.target === authModal) closeModal();
            });
        }

        if (tabLoginBtn && tabRegisterBtn) {
            tabLoginBtn.addEventListener("click", () => {
                tabLoginBtn.classList.add("active");
                tabRegisterBtn.classList.remove("active");
                loginForm.classList.add("active");
                registerForm.classList.remove("active");
            });

            tabRegisterBtn.addEventListener("click", () => {
                tabRegisterBtn.classList.add("active");
                tabLoginBtn.classList.remove("active");
                registerForm.classList.add("active");
                loginForm.classList.remove("active");
            });
        }

        if (loginForm) {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const email = document.getElementById("loginEmail").value;
                const name = email.split("@")[0];
                state.user = { name: name.charAt(0).toUpperCase() + name.slice(1), email: email };
                localStorage.setItem("flashcard_user", JSON.stringify(state.user));
                updateUserUI();
                closeModal();
            });
        }

        if (registerForm) {
            registerForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const name = document.getElementById("regName").value;
                const email = document.getElementById("regEmail").value;
                state.user = { name, email };
                localStorage.setItem("flashcard_user", JSON.stringify(state.user));
                updateUserUI();
                closeModal();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                state.user = null;
                localStorage.removeItem("flashcard_user");
                updateUserUI();
                closeModal();
            });
        }

        navButtons.create.addEventListener("click", () => showScreen("create"));
        navButtons.decks.addEventListener("click", () => showScreen("decks"));
        navButtons.study.addEventListener("click", () => {
            if (state.currentDeck.length > 0) showScreen("study");
        });

        notesInput.addEventListener("input", updateTextMetrics);
        clearTextBtn.addEventListener("click", resetInputs);

        if (browseBtn) browseBtn.addEventListener("click", () => fileInput.click());
        dropZone.addEventListener("click", (e) => {
            if (e.target !== browseBtn) fileInput.click();
        });
        fileInput.addEventListener("change", handleFileSelect);

        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.classList.add("dragover");
        });

        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("dragover");
        });

        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("dragover");
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect();
            }
        });

        setupPillGroup(cardCountGroup, (val) => {
            state.settings.cardCount = parseInt(val, 10);
        });

        setupPillGroup(difficultyGroup, (val) => {
            state.settings.difficulty = val;
        });

        if (styleSelect) styleSelect.addEventListener("change", (e) => state.settings.style = e.target.value);
        if (langSelect) langSelect.addEventListener("change", (e) => state.settings.language = e.target.value);

        generateBtn.addEventListener("click", startGenerationProcess);

        flashcard.addEventListener("click", toggleCardFlip);
        if (prevCardBtn) prevCardBtn.addEventListener("click", showPrevCard);
        if (nextCardBtn) nextCardBtn.addEventListener("click", showNextCard);
        if (backToCreateBtn) backToCreateBtn.addEventListener("click", () => showScreen("create"));

        // Rating Button Handlers
        if (btnEasy) btnEasy.addEventListener("click", (e) => { e.stopPropagation(); rateCard("Easy"); });
        if (btnModerate) btnModerate.addEventListener("click", (e) => { e.stopPropagation(); rateCard("Moderate"); });
        if (btnDifficult) btnDifficult.addEventListener("click", (e) => { e.stopPropagation(); rateCard("Difficult"); });

        if (restartStudyBtn) {
            restartStudyBtn.addEventListener("click", () => {
                state.currentIndex = 0;
                renderCurrentCard();
                showScreen("study");
            });
        }

        if (finishToCreateBtn) {
            finishToCreateBtn.addEventListener("click", () => showScreen("create"));
        }

        if (clearAllDecksBtn) clearAllDecksBtn.addEventListener("click", clearAllSavedDecks);
        if (clearDecksHeaderBtn) clearDecksHeaderBtn.addEventListener("click", clearAllSavedDecks);

        setupSwipeGestures();
        document.addEventListener("keydown", handleKeyboardShortcuts);
    }

    function setupPillGroup(container, callback) {
        if (!container) return;
        const buttons = container.querySelectorAll(".pill-btn");
        buttons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                buttons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const value = btn.getAttribute("data-value");
                callback(value);
            });
        });
    }

    function updateTextMetrics() {
        const text = notesInput.value.trim();
        charCount.textContent = `${text.length} characters`;
        const words = text ? text.split(/\s+/).length : 0;
        wordCount.textContent = `${words} words`;
    }

    function resetInputs() {
        notesInput.value = "";
        state.uploadedTextContent = "";
        fileInput.value = "";
        fileBadge.textContent = "PDF, TXT up to 20MB";
        fileBadge.style.background = "";
        fileBadge.style.color = "";
        updateTextMetrics();
    }

    function handleFileSelect() {
        const file = fileInput.files[0];
        if (file) {
            fileBadge.textContent = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            fileBadge.style.background = "var(--primary-light)";
            fileBadge.style.color = "var(--primary)";

            const reader = new FileReader();
            reader.onload = (e) => {
                state.uploadedTextContent = e.target.result;
            };
            if (file.type === "text/plain") {
                reader.readAsText(file);
            } else {
                state.uploadedTextContent = `Extracted contents from ${file.name}`;
            }
        }
    }

   
    const languageTemplates = {
        English: {
            patterns: [
                (term, snippet) => `What is defined as: "${snippet}"?`,
                (term, snippet) => `Fill in the blank: _____ is described as "${snippet}".`,
                (term, snippet) => `Explain the core function of "${term}".`,
                (term, snippet) => `Why is "${term}" important in this topic?`,
                (term, snippet) => `True or False: "${snippet}" accurately describes ${term}?`
            ],
            keyConceptLabel: "Key Focus",
            unrated: "Unrated"
        },
        Spanish: {
            patterns: [
                (term, snippet) => `¿Cómo se define: "${snippet}"?`,
                (term, snippet) => `Completa el espacio: _____ se describe como "${snippet}".`,
                (term, snippet) => `Explica la función principal de "${term}".`,
                (term, snippet) => `¿Por qué es importante "${term}" en este tema?`,
                (term, snippet) => `¿Verdadero o Falso?: "${snippet}" describe con precisión a ${term}?`
            ],
            keyConceptLabel: "Enfoque Clave",
            unrated: "Sin calificar"
        },
        French: {
            patterns: [
                (term, snippet) => `Qu'est-ce qui est défini par: "${snippet}"?`,
                (term, snippet) => `Remplissez le blanc: _____ est décrit comme "${snippet}".`,
                (term, snippet) => `Expliquez la fonction principale de "${term}".`,
                (term, snippet) => `Pourquoi "${term}" est-il important dans ce sujet?`,
                (term, snippet) => `Vrai ou Faux: "${snippet}" décrit avec précision ${term}?`
            ],
            keyConceptLabel: "Point Clé",
            unrated: "Non évalué"
        },
        German: {
            patterns: [
                (term, snippet) => `Was wird definiert als: "${snippet}"?`,
                (term, snippet) => `Fülle die Lücke aus: _____ wird beschrieben als "${snippet}".`,
                (term, snippet) => `Erkläre die Hauptfunktion von "${term}".`,
                (term, snippet) => `Warum ist "${term}" in diesem Thema wichtig?`,
                (term, snippet) => `Wahr oder Falsch: "${snippet}" beschreibt ${term} genau?`
            ],
            keyConceptLabel: "Schlüsselkonzept",
            unrated: "Unbewertet"
        }
    };

    function startGenerationProcess() {
        const textContent = notesInput.value.trim() || state.uploadedTextContent;
        const hasFile = fileInput.files.length > 0;

        if (!textContent && !hasFile) {
            alert("Please paste your lecture notes or select a file first!");
            return;
        }

        state.currentIndex = 0;
        state.currentDeck = [];

        showScreen("loading");

        const statusMessages = [
            "Analyzing note content...",
            "Translating to selected language...",
            "Structuring unique questions...",
            "Building customized cards...",
            "Finalizing deck..."
        ];

        let step = 0;
        loadingProgress.style.width = "0%";

        const interval = setInterval(() => {
            step++;
            const progress = (step / statusMessages.length) * 100;
            loadingProgress.style.width = `${progress}%`;

            if (step < statusMessages.length) {
                loadingStatusText.textContent = statusMessages[step];
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    generateUniqueCards(textContent);
                    state.currentIndex = 0;
                    navButtons.study.removeAttribute("disabled");
                    resetInputs();
                    showScreen("study");
                    renderCurrentCard();
                }, 400);
            }
        }, 300);
    }

    function generateUniqueCards(sourceText) {
        const count = state.settings.cardCount;
        const lang = state.settings.language || "English";
        const langData = languageTemplates[lang] || languageTemplates["English"];

        
        const rawSentences = sourceText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 8);
        const topic = extractTopicTitle(sourceText);

        const cards = [];

        for (let i = 0; i < count; i++) {
            let sentence = rawSentences[i % rawSentences.length] || `Core information point ${i + 1}`;
            let words = sentence.split(/\s+/).filter(w => w.length > 2);
            
            // Extract a key term dynamically from sentence
            let keyTerm = words.length > 0 ? words[Math.floor(words.length / 2)].replace(/[^a-zA-Z0-9]/g, "") : `Term ${i + 1}`;
            
            // Pick a rotating pattern function to avoid phrasing repetition
            const patternFn = langData.patterns[i % langData.patterns.length];
            
            let question = patternFn(keyTerm, sentence);
            let answer = sentence;
            let concept = `${langData.keyConceptLabel}: ${keyTerm}`;

            cards.push({
                id: Date.now() + i,
                question: question,
                answer: answer,
                keyConcept: concept,
                userRating: langData.unrated
            });
        }

        state.currentDeck = cards;
        state.deckTitle = `${topic} (${lang})`;
        state.deckDifficulty = state.settings.difficulty;

        saveDeckToLocalStorage(state.deckTitle, cards);
    }

    function extractTopicTitle(text) {
        if (!text || text.length < 3) return "General Lecture Notes";
        const words = text.split(/\s+/).slice(0, 3).join(" ");
        return words.replace(/[^a-zA-Z0-9 ]/g, "") + " Flashcards";
    }

    function saveDeckToLocalStorage(title, cards) {
        const newDeck = {
            id: Date.now(),
            title: title,
            cardCount: cards.length,
            difficulty: state.settings.difficulty,
            date: new Date().toLocaleDateString(),
            cards: cards
        };

        state.savedDecks.unshift(newDeck);
        localStorage.setItem("flashcard_decks", JSON.stringify(state.savedDecks));
        renderSavedDecks();
        updateUserUI();
    }

    function clearAllSavedDecks() {
        if (confirm("Are you sure you want to delete ALL saved decks?")) {
            state.savedDecks = [];
            state.currentDeck = [];
            state.currentIndex = 0;
            localStorage.removeItem("flashcard_decks");
            navButtons.study.setAttribute("disabled", "true");
            renderSavedDecks();
            updateUserUI();
            showScreen("create");
        }
    }

    window.deleteDeck = function(deckId) {
        state.savedDecks = state.savedDecks.filter(deck => deck.id !== deckId);
        localStorage.setItem("flashcard_decks", JSON.stringify(state.savedDecks));
        
        if (state.savedDecks.length === 0) {
            state.currentDeck = [];
            navButtons.study.setAttribute("disabled", "true");
        }
        
        renderSavedDecks();
        updateUserUI();
    };

    window.loadDeck = function(deckId) {
        const deck = state.savedDecks.find(d => d.id === deckId);
        if (deck) {
            state.currentDeck = deck.cards;
            state.deckTitle = deck.title;
            state.deckDifficulty = deck.difficulty;
            state.currentIndex = 0;
            navButtons.study.removeAttribute("disabled");
            showScreen("study");
            renderCurrentCard();
        }
    };

    function renderSavedDecks() {
        if (!decksGrid) return;
        if (state.savedDecks.length === 0) {
            decksGrid.innerHTML = "<p>No saved decks available.</p>";
            return;
        }

        decksGrid.innerHTML = state.savedDecks.map(deck => `
            <div class="deck-card" style="border: 1px solid #ccc; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; position: relative;">
                <h3>${deck.title}</h3>
                <p>${deck.cardCount} cards • ${deck.difficulty}</p>
                <small>Created: ${deck.date}</small>
                <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                    <button class="btn btn-primary btn-sm" onclick="loadDeck(${deck.id})">Study</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDeck(${deck.id})"><i class="fa-solid fa-trash"></i> Delete</button>
                </div>
            </div>
        `).join("");
    }

    // ==========================================
    // CARD RENDER & 3-BUTTON DIFFICULTY SYSTEM
    // ==========================================
    function rateCard(ratingLevel) {
        if (state.currentDeck[state.currentIndex]) {
            state.currentDeck[state.currentIndex].userRating = ratingLevel;
        }
        showNextCard();
    }

    function renderCurrentCard() {
        const card = state.currentDeck[state.currentIndex];
        if (!card) return;

        flashcard.classList.remove("flipped");

        studyDeckTitle.textContent = state.deckTitle;
        studyDeckBadge.textContent = state.deckDifficulty;
        studyProgressText.textContent = `Card ${state.currentIndex + 1} of ${state.currentDeck.length}`;
        
        const progressPercentage = ((state.currentIndex + 1) / state.currentDeck.length) * 100;
        studyProgressFill.style.width = `${progressPercentage}%`;

        cardQuestionText.textContent = card.question;
        cardAnswerText.textContent = card.answer;
        cardTopicTag.textContent = card.userRating;
        cardKeyConcept.textContent = card.keyConcept;
    }

    function toggleCardFlip() {
        flashcard.classList.toggle("flipped");
    }

    function showNextCard() {
        if (state.currentIndex < state.currentDeck.length - 1) {
            state.currentIndex++;
            renderCurrentCard();
        } else {
            if (statTotalReviewed) statTotalReviewed.textContent = state.currentDeck.length;
            showScreen("completion");
        }
    }

    function showPrevCard() {
        if (state.currentIndex > 0) {
            state.currentIndex--;
            renderCurrentCard();
        }
    }

    function setupSwipeGestures() {
        let touchStartX = 0;
        let touchEndX = 0;

        flashcard.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        flashcard.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            if (swipeDistance < -50) showNextCard();
            else if (swipeDistance > 50) showPrevCard();
        }
    }

    function handleKeyboardShortcuts(e) {
        if (!screens.study.classList.contains("active")) return;

        if (e.code === "Space") {
            e.preventDefault();
            toggleCardFlip();
        } else if (e.code === "ArrowRight") {
            showNextCard();
        } else if (e.code === "ArrowLeft") {
            showPrevCard();
        }
    }

    initApp();
});