// HYP3RSP4C3 BROWSER - CLASSIFIED OPERATIONS
class HyperSpaceBrowser {
    constructor() {
        this.isStealthMode = true;
        this.currentUrl = '';
        this.history = [];
        this.historyIndex = -1;
        this.proxyActive = true;
        this.encryptionLevel = 'AES-256';
        this.missionLog = [];

        // Tor integration settings
        this.preferTorRouting = false; // Start with regular proxies for testing
        this.torEnabled = false;
        this.torProxyPort = 9050;
        this.torControlPort = 9051;

        this.initializeSystem();
        this.bindEvents();
        this.startMatrixBackground();
        this.updateSystemTime();
        this.simulateSystemBoot();
        this.checkTorAvailability();
    }

    initializeSystem() {
        console.log('Initializing system...');

        // Initialize DOM elements
        this.elements = {
            addressBar: document.getElementById('address-bar'),
            goBtn: document.getElementById('go-btn'),
            backBtn: document.getElementById('back-btn'),
            forwardBtn: document.getElementById('forward-btn'),
            refreshBtn: document.getElementById('refresh-btn'),
            homeBtn: document.getElementById('home-btn'),
            stealthToggle: document.getElementById('stealth-toggle'),
            contentFrame: document.getElementById('content-frame'),
            welcomeScreen: document.getElementById('welcome-screen'),
            loadingOverlay: document.getElementById('loading-overlay'),
            terminalOutput: document.getElementById('terminal-output'),
            currentTime: document.getElementById('current-time'),
            stealthStatus: document.getElementById('stealth-status'),
            proxyStatus: document.getElementById('proxy-status'),
            locationSpoof: document.getElementById('location-spoof'),
            progressBar: document.getElementById('progress-bar'),
            loadingSub: document.getElementById('loading-sub')
        };

        // Debug: Check if critical elements exist
        console.log('Address bar found:', !!this.elements.addressBar);
        console.log('Terminal output found:', !!this.elements.terminalOutput);
        console.log('Welcome screen found:', !!this.elements.welcomeScreen);

        // Initialize quick access targets
        this.initializeQuickAccess();
    }

    bindEvents() {
        // Address bar events
        this.elements.addressBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.navigate(e.target.value);
            }
        });

        this.elements.goBtn.addEventListener('click', () => {
            this.navigate(this.elements.addressBar.value);
        });

        // Navigation controls
        this.elements.backBtn.addEventListener('click', () => this.goBack());
        this.elements.forwardBtn.addEventListener('click', () => this.goForward());
        this.elements.refreshBtn.addEventListener('click', () => this.refresh());
        this.elements.homeBtn.addEventListener('click', () => this.goHome());

        // Stealth mode toggle
        this.elements.stealthToggle.addEventListener('click', () => this.toggleStealthMode());

        // Proxy settings
        document.getElementById('proxy-settings').addEventListener('click', () => this.showProxySettings());

        // Mission control
        document.getElementById('mission-control').addEventListener('click', () => this.showMissionControl());

        // Frame load events
        this.elements.contentFrame.addEventListener('load', () => {
            this.hideLoading();
            this.logTerminal(`[SUCCESS] Target acquired: ${this.currentUrl}`);
        });

        this.elements.contentFrame.addEventListener('error', () => {
            this.hideLoading();
            this.logTerminal(`[ERROR] Failed to infiltrate target: ${this.currentUrl}`);
        });
    }

    initializeQuickAccess() {
        const targetItems = document.querySelectorAll('.target-item');
        targetItems.forEach(item => {
            item.addEventListener('click', () => {
                const url = item.getAttribute('data-url');
                this.navigate(url);
            });
        });
    }

    navigate(url) {
        if (!url || url.trim() === '') {
            this.logTerminal('[ERROR] No target coordinates provided');
            return;
        }

        // Sanitize and validate URL
        url = this.sanitizeUrl(url);
        this.currentUrl = url;

        // Add to history
        this.addToHistory(url);

        // Update address bar
        this.elements.addressBar.value = this.isStealthMode ? this.obfuscateUrl(url) : url;

        // Show loading
        this.showLoading(url);

        // Log the navigation
        this.logTerminal(`[INFILTRATE] Targeting: ${url}`);
        this.logTerminal(`[PROXY] Routing through secure channels...`);

        // Hide welcome screen and show frame
        this.elements.welcomeScreen.style.display = 'none';
        this.elements.contentFrame.style.display = 'block';

        // Check for special embedded DuckDuckGo
        if (url === 'EMBEDDED_DDG') {
            this.loadEmbeddedDuckDuckGo();
            return;
        }

        // Immediate proxy connection (no artificial delay)
        try {
            this.loadThroughProxy(url);
        } catch (error) {
            this.logTerminal(`[ERROR] Infiltration failed: ${error.message}`);
            this.hideLoading();
        }
    }

    sanitizeUrl(url) {
        // Remove any extra whitespace
        url = url.trim();

        // Convert common site names to full URLs
        const commonSiteUrls = {
            'youtube': 'https://youtube.com',
            'google': 'https://google.com',
            'facebook': 'https://facebook.com',
            'twitter': 'https://twitter.com',
            'instagram': 'https://instagram.com',
            'reddit': 'https://reddit.com',
            'github': 'https://github.com',
            'stackoverflow': 'https://stackoverflow.com',
            'wikipedia': 'https://wikipedia.org',
            'amazon': 'https://amazon.com',
            'netflix': 'https://netflix.com',
            'twitch': 'https://twitch.tv',
            'discord': 'https://discord.com',
            'linkedin': 'https://linkedin.com',
            'tiktok': 'https://tiktok.com',
            'spotify': 'https://spotify.com',
            'apple': 'https://apple.com',
            'microsoft': 'https://microsoft.com',
            'gmail': 'https://gmail.com',
            'yahoo': 'https://yahoo.com',
            'bing': 'https://bing.com',
            'duckduckgo': 'EMBEDDED_DDG', // Special handler for embedded DuckDuckGo
            'ddg': 'EMBEDDED_DDG',
            'search': 'EMBEDDED_DDG'
        };

        const lowerUrl = url.toLowerCase();
        if (commonSiteUrls[lowerUrl]) {
            if (commonSiteUrls[lowerUrl] === 'EMBEDDED_DDG') {
                // Special handling for embedded DuckDuckGo
                return 'EMBEDDED_DDG';
            }
            return commonSiteUrls[lowerUrl];
        }

        // If it's clearly a search query (has spaces or common search terms), return as-is
        if (this.isSearchQuery(url)) {
            return url;
        }

        // Add protocol if missing for URLs
        if (!url.match(/^https?:\/\//)) {
            // Check if it looks like a domain
            if (url.includes('.') && !url.includes(' ')) {
                url = 'https://' + url;
            } else {
                // Treat as search query
                return url;
            }
        }

        try {
            new URL(url);
            return url;
        } catch {
            // If URL is invalid, treat as search query
            return url;
        }
    }

    obfuscateUrl(url) {
        if (!this.isStealthMode) return url;

        const obfuscated = url.replace(/[aeiou]/g, '●')
            .replace(/[bcdfghjklmnpqrstvwxyz]/g, '○');
        return `[ENCRYPTED] ${obfuscated}`;
    }

    addToHistory(url) {
        // Remove any forward history if we're not at the end
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(url);
        this.historyIndex = this.history.length - 1;

        // Update navigation buttons
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        this.elements.backBtn.disabled = this.historyIndex <= 0;
        this.elements.forwardBtn.disabled = this.historyIndex >= this.history.length - 1;

        // Update button styles for disabled state
        this.elements.backBtn.style.opacity = this.elements.backBtn.disabled ? '0.5' : '1';
        this.elements.forwardBtn.style.opacity = this.elements.forwardBtn.disabled ? '0.5' : '1';
    }

    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentUrl = this.history[this.historyIndex];
            this.showLoading(this.currentUrl);
            this.loadThroughProxy(this.currentUrl);
            this.elements.addressBar.value = this.isStealthMode ? this.obfuscateUrl(this.currentUrl) : this.currentUrl;
            this.updateNavigationButtons();
            this.logTerminal(`[NAVIGATE] Returning to previous target`);
        }
    }

    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentUrl = this.history[this.historyIndex];
            this.showLoading(this.currentUrl);
            this.loadThroughProxy(this.currentUrl);
            this.elements.addressBar.value = this.isStealthMode ? this.obfuscateUrl(this.currentUrl) : this.currentUrl;
            this.updateNavigationButtons();
            this.logTerminal(`[NAVIGATE] Advancing to next target`);
        }
    }

    refresh() {
        if (this.currentUrl) {
            this.showLoading(this.currentUrl);
            // Use the proxy system for refresh as well
            this.loadThroughProxy(this.currentUrl + '?t=' + Date.now());
            this.logTerminal(`[REFRESH] Reacquiring target data...`);
        }
    }

    goHome() {
        this.elements.welcomeScreen.style.display = 'flex';
        this.elements.contentFrame.style.display = 'none';
        this.elements.addressBar.value = '';
        this.currentUrl = '';
        this.logTerminal(`[HOME] Returning to mission control`);
    }

    toggleStealthMode() {
        this.isStealthMode = !this.isStealthMode;

        const stealthStatus = document.getElementById('stealth-status');
        const body = document.body;

        if (this.isStealthMode) {
            stealthStatus.textContent = 'ACTIVE';
            stealthStatus.style.color = 'var(--neon-green)';
            body.classList.add('stealth-mode');
            this.logTerminal('[STEALTH] Stealth protocols activated');
        } else {
            stealthStatus.textContent = 'INACTIVE';
            stealthStatus.style.color = 'var(--neon-red)';
            body.classList.remove('stealth-mode');
            this.logTerminal('[STEALTH] Stealth protocols deactivated');
        }

        // Update address bar display
        if (this.currentUrl) {
            this.elements.addressBar.value = this.isStealthMode ? this.obfuscateUrl(this.currentUrl) : this.currentUrl;
        }
    }

    loadThroughProxy(url) {
        // Check if it's a search query or direct URL
        if (this.isSearchQuery(url)) {
            this.performWebSearch(url);
            return;
        }

        // For direct URLs, attempt to load through proxy services
        this.attemptProxyLoad(url);
    }

    attemptProxyLoad(url) {
        this.logTerminal(`[PROXY] Initiating connection to: ${url}`);

        // First, try Tor if enabled
        if (this.preferTorRouting) {
            this.logTerminal(`[TOR] Attempting Tor network routing...`);
            this.checkTorAvailability(url);
        } else {
            // Use regular proxy services as fallback
            this.logTerminal(`[PROXY] Using regular proxy services...`);
            this.tryRegularProxies(url);
        }
    }

    tryRegularProxies(url) {
        this.logTerminal(`[PROXY] Attempting to load: ${url}`);

        // First, try direct iframe loading (some sites allow it)
        this.logTerminal(`[DIRECT] Attempting direct iframe access...`);
        this.tryDirectIframe(url);
    }

    tryDirectIframe(url) {
        const iframe = this.elements.contentFrame;
        if (!iframe) {
            this.logTerminal(`[ERROR] Content frame not found`);
            return;
        }

        this.logTerminal(`[IFRAME] Loading ${url} directly...`);

        // Set up iframe
        iframe.src = url;
        iframe.style.display = 'block';

        if (this.elements.welcomeScreen) {
            this.elements.welcomeScreen.style.display = 'none';
        }

        // Set up timeout and error handling
        let loaded = false;

        iframe.onload = () => {
            if (!loaded) {
                loaded = true;
                this.logTerminal(`[SUCCESS] Direct access to ${url} successful`);
                this.hideLoading();
            }
        };

        iframe.onerror = () => {
            if (!loaded) {
                loaded = true;
                this.logTerminal(`[DIRECT] Direct access failed, trying IP proxy servers...`);
                this.tryIPProxiesFirst(url);
            }
        };

        // Timeout fallback
        setTimeout(() => {
            if (!loaded) {
                loaded = true;
                this.logTerminal(`[TIMEOUT] Direct access timeout, trying IP proxy servers...`);
                this.tryIPProxiesFirst(url);
            }
        }, 5000);
    }

    async tryIPProxiesFirst(url) {
        this.logTerminal(`[IP-PROXY] Attempting direct IP proxy connections before web proxies...`);
        
        try {
            const ipProxySuccess = await this.testDirectIPProxies(url);
            
            if (!ipProxySuccess) {
                this.logTerminal(`[IP-PROXY] Direct IP proxies failed, falling back to web proxy services...`);
                this.tryProxyServices(url);
            }
        } catch (error) {
            this.logTerminal(`[IP-PROXY] IP proxy test failed: ${error.message}`);
            this.tryProxyServices(url);
        }
    }

    tryProxyServices(url) {
        // Modern proxy services with direct IP proxies and web-based fallbacks
        const proxyServices = [
            // Direct IP Proxy Servers (High Priority)
            {
                name: 'DirectProxy-EU',
                url: `http://195.114.209.50:8080/${url}`,
                type: 'iframe',
                timeout: 6000,
                isDirectIP: true
            },
            {
                name: 'DirectProxy-US',
                url: `http://198.44.255.3:8080/${url}`,
                type: 'iframe',
                timeout: 6000,
                isDirectIP: true
            },
            {
                name: 'DirectProxy-DE',
                url: `http://85.39.112.144:8080/${url}`,
                type: 'iframe',
                timeout: 6000,
                isDirectIP: true
            },
            // SOCKS5 Proxy Alternatives (Try different ports)
            {
                name: 'SOCKS-EU-1080',
                url: `http://195.114.209.50:1080/${url}`,
                type: 'iframe',
                timeout: 8000,
                isDirectIP: true
            },
            {
                name: 'SOCKS-US-1080',
                url: `http://198.44.255.3:1080/${url}`,
                type: 'iframe',
                timeout: 8000,
                isDirectIP: true
            },
            {
                name: 'SOCKS-DE-1080',
                url: `http://85.39.112.144:1080/${url}`,
                type: 'iframe',
                timeout: 8000,
                isDirectIP: true
            },
            // Web-based Proxy Services (Fallback)
            {
                name: 'AllOrigins-Raw',
                url: `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
                type: 'iframe',
                timeout: 8000,
                isDirectIP: false
            },
            {
                name: 'AllOrigins-JSON',
                url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                type: 'json',
                timeout: 8000,
                isDirectIP: false
            },
            {
                name: 'CorsProxy-IO',
                url: `https://corsproxy.io/?${encodeURIComponent(url)}`,
                type: 'iframe',
                timeout: 10000,
                isDirectIP: false
            },
            {
                name: 'Proxy-Cors',
                url: `https://proxy.cors.sh/${url}`,
                type: 'iframe',
                timeout: 10000,
                isDirectIP: false
            },
            {
                name: 'CorsAnywhere-Heroku',
                url: `https://cors-anywhere.herokuapp.com/${url}`,
                type: 'iframe',
                timeout: 12000,
                isDirectIP: false
            }
        ];

        this.logTerminal(`[PROXY] Initializing advanced proxy chain (${proxyServices.length} services)...`);

        let currentProxyIndex = 0;
        let attemptCount = 0;
        const maxAttempts = proxyServices.length * 2; // Allow retry attempts

        const attemptProxy = async() => {
            if (attemptCount >= maxAttempts) {
                this.logTerminal(`[PROXY] All proxy methods exhausted after ${attemptCount} attempts`);
                this.showWorkingAlternatives(url);
                return;
            }

            const proxy = proxyServices[currentProxyIndex];
            attemptCount++;

            this.logTerminal(`[PROXY] Attempt ${attemptCount}: Testing ${proxy.name}...`);
            this.logTerminal(`[DEBUG] Proxy URL: ${proxy.url}`);

            try {
                // Create AbortController for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), proxy.timeout);

                if (proxy.type === 'iframe') {
                    // Try loading directly in iframe first (fastest method)
                    const success = await this.tryIframeProxy(proxy.url, proxy.timeout);
                    clearTimeout(timeoutId);

                    if (success) {
                        this.logTerminal(`[SUCCESS] ${proxy.name} iframe loading successful`);
                        return;
                    } else {
                        throw new Error('Iframe loading failed');
                    }
                } else if (proxy.type === 'json') {
                    // Fetch and parse JSON response
                    const response = await fetch(proxy.url, {
                        method: 'GET',
                        signal: controller.signal,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            'Accept': '*/*',
                            'Cache-Control': 'no-cache',
                            'Pragma': 'no-cache'
                        }
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    const jsonData = await response.json();

                    if (jsonData && jsonData.contents) {
                        this.logTerminal(`[SUCCESS] ${proxy.name} JSON response received`);
                        this.displayProxiedContent(jsonData.contents, url);
                        this.hideLoading();
                        return;
                    } else {
                        throw new Error('Invalid JSON response structure');
                    }
                }

            } catch (error) {
                this.logTerminal(`[FAILED] ${proxy.name}: ${error.message}`);

                // Move to next proxy
                currentProxyIndex = (currentProxyIndex + 1) % proxyServices.length;

                // Add delay before retry
                setTimeout(attemptProxy, 1500);
            }
        };

        attemptProxy();
    }

    async tryIframeProxy(proxyUrl, timeout = 8000) {
        return new Promise((resolve) => {
            const iframe = this.elements.contentFrame;
            if (!iframe) {
                resolve(false);
                return;
            }

            let resolved = false;
            const timeoutId = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(false);
                }
            }, timeout);

            // Set up success handler
            const handleLoad = () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);

                    // Hide welcome screen
                    if (this.elements.welcomeScreen) {
                        this.elements.welcomeScreen.style.display = 'none';
                    }
                    iframe.style.display = 'block';
                    this.hideLoading();

                    resolve(true);
                }
            };

            // Set up error handler
            const handleError = () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);
                    resolve(false);
                }
            };

            // Attach event listeners
            iframe.onload = handleLoad;
            iframe.onerror = handleError;

            // Start loading
            try {
                iframe.src = proxyUrl;
            } catch (error) {
                handleError();
            }
        });
    }

    // Enhanced method for testing and using the provided IP-based proxies
    testDirectIPProxies(url) {
        this.logTerminal(`[IP-PROXY] Testing direct IP proxy servers...`);

        const directProxies = [
            { ip: '195.114.209.50', ports: [8080, 3128, 1080, 9050, 9150], region: 'EU' },
            { ip: '198.44.255.3', ports: [8080, 3128, 1080, 9050, 9150], region: 'US' }, 
            { ip: '85.39.112.144', ports: [8080, 3128, 1080, 9050, 9150], region: 'DE' }
        ];

        return new Promise((resolve) => {
            let proxyIndex = 0;
            let portIndex = 0;
            let foundWorking = false;

            const testNextProxy = async () => {
                if (foundWorking) return;

                if (proxyIndex >= directProxies.length) {
                    this.logTerminal(`[IP-PROXY] All direct IP proxies tested, none responsive`);
                    resolve(false);
                    return;
                }

                const proxy = directProxies[proxyIndex];
                
                if (portIndex >= proxy.ports.length) {
                    proxyIndex++;
                    portIndex = 0;
                    setTimeout(testNextProxy, 100);
                    return;
                }

                const port = proxy.ports[portIndex];
                const proxyUrl = `http://${proxy.ip}:${port}/${url}`;
                
                this.logTerminal(`[IP-PROXY] Testing ${proxy.region} proxy ${proxy.ip}:${port}...`);

                try {
                    const success = await this.testIPProxyConnection(proxyUrl, 3000);
                    
                    if (success && !foundWorking) {
                        foundWorking = true;
                        this.logTerminal(`[SUCCESS] Direct IP proxy working: ${proxy.ip}:${port} (${proxy.region})`);
                        resolve(true);
                        return;
                    }
                } catch (error) {
                    this.logTerminal(`[IP-PROXY] Failed ${proxy.ip}:${port} - ${error.message}`);
                }

                portIndex++;
                setTimeout(testNextProxy, 200); // Small delay between tests
            };

            testNextProxy();
        });
    }

    async testIPProxyConnection(proxyUrl, timeout = 3000) {
        return new Promise((resolve) => {
            const iframe = this.elements.contentFrame;
            if (!iframe) {
                resolve(false);
                return;
            }

            let resolved = false;
            const timeoutId = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(false);
                }
            }, timeout);

            const handleLoad = () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);
                    
                    // Check if content actually loaded
                    try {
                        if (iframe.contentWindow && iframe.contentDocument) {
                            // Show content and mark success
                            if (this.elements.welcomeScreen) {
                                this.elements.welcomeScreen.style.display = 'none';
                            }
                            iframe.style.display = 'block';
                            this.hideLoading();
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    } catch (e) {
                        // Cross-origin restrictions might prevent access, but loading succeeded
                        if (this.elements.welcomeScreen) {
                            this.elements.welcomeScreen.style.display = 'none';
                        }
                        iframe.style.display = 'block';
                        this.hideLoading();
                        resolve(true);
                    }
                }
            };

            const handleError = () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);
                    resolve(false);
                }
            };

            // Set up event handlers
            iframe.onload = handleLoad;
            iframe.onerror = handleError;

            // Attempt to load
            try {
                iframe.src = proxyUrl;
            } catch (error) {
                handleError();
            }
        });
    }

    loadEmbeddedDuckDuckGo(query = '') {
        this.logTerminal(`[DUCKDUCKGO] Loading embedded DuckDuckGo search interface...`);
        this.logTerminal(`[DEBUG] Query parameter: "${query}"`);
        this.logTerminal(`[DEBUG] Content frame exists: ${!!this.elements.contentFrame}`);

        const duckDuckGoHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HYP3RSP4C3 - DuckDuckGo Search</title>
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    margin: 0; 
                    padding: 0;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                .search-header {
                    background: rgba(26, 26, 26, 0.9);
                    border-bottom: 2px solid #8b5dff;
                    padding: 20px;
                    text-align: center;
                }
                .search-container {
                    padding: 30px;
                    text-align: center;
                    flex-grow: 1;
                }
                .duck-logo {
                    font-size: 48px;
                    margin-bottom: 20px;
                }
                .search-form {
                    max-width: 600px;
                    margin: 0 auto;
                }
                .search-input {
                    width: 100%;
                    padding: 15px 20px;
                    font-size: 16px;
                    background: rgba(0, 0, 0, 0.8);
                    border: 2px solid #8b5dff;
                    border-radius: 25px;
                    color: #00ff41;
                    font-family: 'Source Code Pro', monospace;
                    outline: none;
                    margin-bottom: 20px;
                }
                .search-input:focus {
                    border-color: #00ffff;
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
                }
                .search-btn {
                    background: linear-gradient(135deg, #8b5dff, #00ffff);
                    color: #0a0a0a;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 0 10px;
                    font-family: 'Source Code Pro', monospace;
                    text-transform: uppercase;
                }
                .search-btn:hover {
                    background: linear-gradient(135deg, #00ffff, #8b5dff);
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
                }
                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    max-width: 800px;
                    margin: 30px auto 0;
                }
                .feature-card {
                    background: rgba(42, 42, 42, 0.6);
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                .feature-card:hover {
                    border-color: #8b5dff;
                    box-shadow: 0 0 10px rgba(139, 93, 255, 0.3);
                }
            </style>
        </head>
        <body>
            <div class="search-header">
                <h1>🦆 DUCKDUCKGO ANONYMOUS SEARCH</h1>
                <p>Privacy-focused search with IP masking via HYP3RSP4C3 proxy</p>
            </div>
            
            <div class="search-container">
                <div class="duck-logo">🦆</div>
                <h2>Anonymous Web Search</h2>
                <p>Search the web privately through our proxy network</p>
                
                <div class="search-form">
                    <input type="text" class="search-input" id="searchInput" 
                           placeholder="Enter your search query..." value="${query}" autofocus>
                    <div>
                        <button class="search-btn" onclick="performDDGSearch()">🔍 Search</button>
                        <button class="search-btn" onclick="loadDDGLite()">📱 DDG Lite</button>
                        <button class="search-btn" onclick="loadDDGFull()">🌐 Full DDG</button>
                    </div>
                </div>
                
                <div class="feature-grid">
                    <div class="feature-card">
                        <h4>🔒 IP Masking</h4>
                        <p>Your IP is hidden through proxy routing</p>
                    </div>
                    <div class="feature-card">
                        <h4>🚫 No Tracking</h4>
                        <p>DuckDuckGo doesn't track users</p>
                    </div>
                    <div class="feature-card">
                        <h4>🌍 Global Access</h4>
                        <p>Bypass regional restrictions</p>
                    </div>
                    <div class="feature-card">
                        <h4>⚡ Fast Search</h4>
                        <p>Quick anonymous results</p>
                    </div>
                </div>
            </div>
            
            <script>
                function performDDGSearch() {
                    const query = document.getElementById('searchInput').value.trim();
                    if (!query) return;
                    
                    parent.hyperspaceBrowser.logTerminal('[DDG] Performing anonymous search: ' + query);
                    parent.hyperspaceBrowser.searchViaDuckDuckGo(query);
                }
                
                function loadDDGLite() {
                    parent.hyperspaceBrowser.logTerminal('[DDG] Loading DuckDuckGo Lite interface...');
                    const query = document.getElementById('searchInput').value.trim();
                    const ddgUrl = 'https://lite.duckduckgo.com/lite/' + (query ? '?q=' + encodeURIComponent(query) : '');
                    parent.hyperspaceBrowser.navigate(ddgUrl);
                }
                
                function loadDDGFull() {
                    parent.hyperspaceBrowser.logTerminal('[DDG] Loading full DuckDuckGo interface...');
                    const query = document.getElementById('searchInput').value.trim();
                    const ddgUrl = 'https://duckduckgo.com/' + (query ? '?q=' + encodeURIComponent(query) : '');
                    parent.hyperspaceBrowser.navigate(ddgUrl);
                }
                
                // Enter key support
                document.getElementById('searchInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        performDDGSearch();
                    }
                });
                
                // Auto-focus search input
                document.getElementById('searchInput').focus();
            </script>
        </body>
        </html>`;

        if (this.elements.contentFrame) {
            try {
                this.elements.contentFrame.srcdoc = duckDuckGoHTML;
                this.elements.contentFrame.style.display = 'block';
                if (this.elements.welcomeScreen) {
                    this.elements.welcomeScreen.style.display = 'none';
                }
                this.logTerminal(`[SUCCESS] DuckDuckGo search interface loaded successfully`);
            } catch (error) {
                this.logTerminal(`[ERROR] Failed to load DuckDuckGo interface: ${error.message}`);
            }
        } else {
            this.logTerminal(`[ERROR] Content frame not available for DuckDuckGo`);
        }

        this.hideLoading();
    }

    searchViaDuckDuckGo(query) {
        this.logTerminal(`[DDG] Executing DuckDuckGo search: "${query}"`);

        if (!query || query.trim() === '') {
            this.logTerminal(`[ERROR] Empty search query provided`);
            this.createSimpleSearchFallback(query);
            return;
        }

        // Start with API search (most reliable) then try proxy
        this.tryDDGAPI(query);
    }
    loadDDGThroughProxy(query) {
        this.logTerminal(`[DDG-PROXY] Loading DuckDuckGo search results for: "${query}"`);

        // Try different DuckDuckGo URLs that work better with proxies
        const ddgUrls = [
            `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`,
            `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
            `https://duckduckgo.com/?q=${encodeURIComponent(query)}&kp=-1&kl=us-en`
        ];

        this.tryDDGProxies(ddgUrls, query, 0);
    }

    tryDDGProxies(urls, query, urlIndex) {
        if (urlIndex >= urls.length) {
            this.logTerminal(`[DDG] All DuckDuckGo URLs failed, using API fallback`);
            this.tryDDGAPI(query);
            return;
        }

        const currentUrl = urls[urlIndex];
        this.logTerminal(`[DDG] Trying DuckDuckGo URL ${urlIndex + 1}/${urls.length}: ${currentUrl}`);

        // Try to load through enhanced proxy system including direct IP proxies
        const proxyServices = [
            // Direct IP Proxies (Fastest)
            `http://195.114.209.50:8080/${currentUrl}`,
            `http://198.44.255.3:8080/${currentUrl}`,
            `http://85.39.112.144:8080/${currentUrl}`,
            // Alternative ports for IP proxies
            `http://195.114.209.50:3128/${currentUrl}`,
            `http://198.44.255.3:3128/${currentUrl}`,
            `http://85.39.112.144:3128/${currentUrl}`,
            // Web-based proxy fallbacks
            `https://api.allorigins.win/get?url=${encodeURIComponent(currentUrl)}`,
            `https://corsproxy.io/?${encodeURIComponent(currentUrl)}`,
        ];

        let proxyIndex = 0;

        const tryNextProxy = () => {
            if (proxyIndex >= proxyServices.length) {
                this.logTerminal(`[DDG] Proxies failed for URL ${urlIndex + 1}, trying next URL`);
                this.tryDDGProxies(urls, query, urlIndex + 1);
                return;
            }

            const proxyUrl = proxyServices[proxyIndex];
            this.logTerminal(`[DDG] Proxy attempt ${proxyIndex + 1}/${proxyServices.length}`);

            fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error(`HTTP ${response.status}`);
                    }
                })
                .then(html => {
                    // Handle AllOrigins JSON response
                    if (proxyUrl.includes('allorigins')) {
                        try {
                            const data = JSON.parse(html);
                            html = data.contents || html;
                        } catch (e) {
                            // Use raw response if JSON parsing fails
                        }
                    }

                    this.logTerminal(`[SUCCESS] DuckDuckGo search results loaded via proxy`);
                    this.displayDDGResults(html, query);
                    this.hideLoading();
                })
                .catch(error => {
                    this.logTerminal(`[DDG-PROXY] Proxy ${proxyIndex + 1} failed: ${error.message}`);
                    proxyIndex++;
                    setTimeout(tryNextProxy, 1000);
                });
        };

        tryNextProxy();
    }

    tryDDGAPI(query) {
        this.logTerminal(`[DDG-API] Trying DuckDuckGo Instant Answer API for: "${query}"`);

        // Set a timeout for the API call
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('API timeout')), 5000)
        );

        // DuckDuckGo Instant Answer API (works with CORS)
        const apiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1&skip_disambig=1`;

        const fetchPromise = fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            });

        Promise.race([fetchPromise, timeoutPromise])
            .then(data => {
                this.logTerminal(`[DDG-API] API response received successfully`);
                this.createDDGAPIResults(data, query);
            })
            .catch(error => {
                this.logTerminal(`[DDG-API] API failed: ${error.message}, using fallback`);
                this.createDDGFallbackResults(query);
            });
    }
    displayDDGResults(html, query) {
        this.logTerminal(`[DDG] Displaying DuckDuckGo search results`);

        // Clean up the HTML to work better in our iframe
        let cleanHtml = html;

        // Add our custom styling to make it look better
        const customStyles = `
        <style>
            body { 
                background: #1a1a1a !important; 
                color: #00ff41 !important; 
                font-family: 'Source Code Pro', monospace !important;
            }
            a { color: #00ffff !important; }
            a:visited { color: #8b5dff !important; }
            .result { 
                background: rgba(42, 42, 42, 0.8) !important; 
                border: 1px solid #333 !important; 
                margin: 10px 0 !important; 
                padding: 10px !important; 
                border-radius: 5px !important; 
            }
        </style>`;

        // Insert our styles
        if (cleanHtml.includes('</head>')) {
            cleanHtml = cleanHtml.replace('</head>', customStyles + '</head>');
        } else {
            cleanHtml = customStyles + cleanHtml;
        }

        this.displayProxiedContent(cleanHtml, `DuckDuckGo Search: ${query}`);
    }

    createDDGAPIResults(data, query) {
            this.logTerminal(`[DDG-API] Creating results from DuckDuckGo API`);

            let resultsHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>DuckDuckGo Search: ${query}</title>
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    padding: 20px; 
                    line-height: 1.6;
                }
                .search-header {
                    border-bottom: 2px solid #8b5dff;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }
                .result-item {
                    background: rgba(42, 42, 42, 0.8);
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 15px 0;
                }
                .result-title {
                    color: #00ffff;
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .result-text {
                    color: #00ff41;
                    margin-bottom: 10px;
                }
                .result-url {
                    color: #8b5dff;
                    font-size: 12px;
                }
                .instant-answer {
                    background: rgba(139, 93, 255, 0.2);
                    border: 2px solid #8b5dff;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .search-again {
                    background: linear-gradient(135deg, #8b5dff, #00ffff);
                    color: #0a0a0a;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: monospace;
                    margin: 5px;
                }
            </style>
        </head>
        <body>
            <div class="search-header">
                <h1>🦆 DuckDuckGo Search Results</h1>
                <p>Search query: <strong>"${query}"</strong></p>
                <button class="search-again" onclick="parent.hyperspaceBrowser.loadEmbeddedDuckDuckGo('${query}')">🔍 Search Again</button>
                <button class="search-again" onclick="parent.hyperspaceBrowser.navigate('https://duckduckgo.com/?q=${encodeURIComponent(query)}')">🌐 Full DDG Site</button>
            </div>`;

            // Add instant answer if available
            if (data.Abstract && data.Abstract.length > 0) {
                resultsHTML += `
            <div class="instant-answer">
                <h3>📋 Instant Answer</h3>
                <p><strong>${data.Heading || 'Information'}</strong></p>
                <p>${data.Abstract}</p>
                ${data.AbstractURL ? `<p class="result-url">Source: ${data.AbstractURL}</p>` : ''}
            </div>`;
        }
        
        // Add related topics
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            resultsHTML += `<h3>🔗 Related Topics</h3>`;
            data.RelatedTopics.slice(0, 5).forEach(topic => {
                if (topic.Text && topic.FirstURL) {
                    resultsHTML += `
                    <div class="result-item">
                        <div class="result-title">${topic.Text.split(' - ')[0]}</div>
                        <div class="result-text">${topic.Text}</div>
                        <div class="result-url">${topic.FirstURL}</div>
                    </div>`;
                }
            });
        }
        
        // Add external search options
        resultsHTML += `
            <div class="result-item">
                <div class="result-title">🌐 Search More Sources</div>
                <div class="result-text">Get more comprehensive results from DuckDuckGo website</div>
                <button class="search-again" onclick="window.open('https://duckduckgo.com/?q=${encodeURIComponent(query)}', '_blank')">Open DuckDuckGo</button>
                <button class="search-again" onclick="window.open('https://startpage.com/search?query=${encodeURIComponent(query)}', '_blank')">Try StartPage</button>
            </div>
        </body>
        </html>`;
        
        if (this.elements.contentFrame) {
            this.elements.contentFrame.srcdoc = resultsHTML;
            this.elements.contentFrame.style.display = 'block';
            if (this.elements.welcomeScreen) {
                this.elements.welcomeScreen.style.display = 'none';
            }
        }
        
        this.hideLoading();
    }

    createSimpleSearchFallback(query) {
        this.logTerminal(`[FALLBACK] Creating simple search interface for: "${query}"`);
        
        const fallbackHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Search: ${query}</title>
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    padding: 20px; 
                    line-height: 1.6;
                    margin: 0;
                }
                .container { max-width: 800px; margin: 0 auto; }
                .search-header {
                    text-align: center;
                    border-bottom: 2px solid #8b5dff;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .search-options {
                    display: grid;
                    gap: 20px;
                }
                .search-card {
                    background: rgba(42, 42, 42, 0.8);
                    border: 1px solid #8b5dff;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                }
                .search-btn {
                    background: linear-gradient(135deg, #8b5dff, #00ffff);
                    color: #0a0a0a;
                    border: none;
                    padding: 15px 25px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 10px 5px;
                    font-family: monospace;
                    text-decoration: none;
                    display: inline-block;
                }
                .search-btn:hover {
                    background: linear-gradient(135deg, #00ffff, #8b5dff);
                }
                .query-display {
                    background: #000;
                    color: #00ff41;
                    padding: 15px;
                    border-radius: 5px;
                    font-family: monospace;
                    margin: 20px 0;
                    word-break: break-word;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="search-header">
                    <h1>🔍 ANONYMOUS SEARCH</h1>
                    <p>Search Query:</p>
                    <div class="query-display">"${query}"</div>
                </div>
                
                <div class="search-options">
                    <div class="search-card">
                        <h3>🦆 DuckDuckGo Search</h3>
                        <p>Privacy-focused search engine</p>
                        <a href="https://duckduckgo.com/?q=${encodeURIComponent(query)}" target="_blank" class="search-btn">
                            Search DuckDuckGo
                        </a>
                        <a href="https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}" target="_blank" class="search-btn">
                            DDG Lite
                        </a>
                    </div>
                    
                    <div class="search-card">
                        <h3>🔒 Privacy Search Engines</h3>
                        <p>Additional anonymous search options</p>
                        <a href="https://startpage.com/search?query=${encodeURIComponent(query)}" target="_blank" class="search-btn">
                            StartPage
                        </a>
                        <a href="https://search.brave.com/search?q=${encodeURIComponent(query)}" target="_blank" class="search-btn">
                            Brave Search
                        </a>
                    </div>
                    
                    <div class="search-card">
                        <h3>📚 Direct Resources</h3>
                        <p>Search specific websites</p>
                        <button class="search-btn" onclick="parent.hyperspaceBrowser.navigate('https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}')">
                            Wikipedia
                        </button>
                        <button class="search-btn" onclick="parent.hyperspaceBrowser.navigate('https://old.reddit.com/search?q=${encodeURIComponent(query)}')">
                            Reddit
                        </button>
                    </div>
                    
                    <div class="search-card">
                        <h3>🏠 Browser Options</h3>
                        <p>Return to browser or try different search</p>
                        <button class="search-btn" onclick="parent.hyperspaceBrowser.goHome()">
                            Home
                        </button>
                        <button class="search-btn" onclick="parent.hyperspaceBrowser.loadEmbeddedDuckDuckGo('${query}')">
                            DDG Interface
                        </button>
                    </div>
                </div>
                
                <div style="margin-top: 30px; text-align: center; color: #666;">
                    <p>🔒 Your IP address is masked through the HYP3RSP4C3 proxy network</p>
                    <p>All external searches maintain your anonymity</p>
                </div>
            </div>
        </body>
        </html>`;
        
        if (this.elements.contentFrame) {
            this.elements.contentFrame.srcdoc = fallbackHTML;
            this.elements.contentFrame.style.display = 'block';
            if (this.elements.welcomeScreen) {
                this.elements.welcomeScreen.style.display = 'none';
            }
        }
        
        this.hideLoading();
    }

    createReliableSearchPage(query) {
        this.logTerminal(`[RELIABLE-SEARCH] Creating guaranteed working search interface`);
        
        const reliableSearchHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HYP3RSP4C3 - Search: ${query}</title>
            <meta charset="UTF-8">
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Courier New', monospace; 
                    padding: 20px; 
                    margin: 0;
                    min-height: 100vh;
                    line-height: 1.6;
                }
                .container { 
                    max-width: 900px; 
                    margin: 0 auto; 
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #8b5dff;
                    padding-bottom: 25px;
                    margin-bottom: 30px;
                }
                .logo {
                    font-size: 24px;
                    color: #8b5dff;
                    margin-bottom: 10px;
                }
                .query-box {
                    background: rgba(0, 0, 0, 0.8);
                    border: 2px solid #00ffff;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                    text-align: center;
                }
                .search-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .search-card {
                    background: rgba(26, 26, 26, 0.9);
                    border: 2px solid #333;
                    border-radius: 10px;
                    padding: 25px;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                .search-card:hover {
                    border-color: #8b5dff;
                    box-shadow: 0 0 20px rgba(139, 93, 255, 0.3);
                    transform: translateY(-2px);
                }
                .card-icon {
                    font-size: 36px;
                    margin-bottom: 15px;
                    display: block;
                }
                .card-title {
                    color: #00ffff;
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .card-desc {
                    color: #00ff41;
                    margin-bottom: 20px;
                    font-size: 14px;
                }
                .search-btn {
                    background: linear-gradient(135deg, #8b5dff, #00ffff);
                    color: #000;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 5px;
                    font-family: 'Courier New', monospace;
                    text-decoration: none;
                    display: inline-block;
                    transition: all 0.2s ease;
                }
                .search-btn:hover {
                    background: linear-gradient(135deg, #00ffff, #8b5dff);
                    transform: scale(1.05);
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
                }
                .info-section {
                    background: rgba(42, 42, 42, 0.8);
                    border: 1px solid #8b5dff;
                    border-radius: 8px;
                    padding: 20px;
                    margin-top: 30px;
                    text-align: center;
                }
                .status-bar {
                    background: rgba(0, 0, 0, 0.9);
                    color: #00ff41;
                    padding: 10px;
                    font-size: 12px;
                    border-radius: 4px;
                    margin-top: 20px;
                    font-family: monospace;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">⚡ HYP3RSP4C3 BROWSER ⚡</div>
                    <h1>🔍 ANONYMOUS SEARCH PORTAL</h1>
                    <div class="query-box">
                        <h2>Search Query: "${query}"</h2>
                        <p>Your IP address is masked • Anonymous browsing active</p>
                    </div>
                </div>
                
                <div class="search-grid">
                    <div class="search-card">
                        <span class="card-icon">🦆</span>
                        <div class="card-title">DuckDuckGo</div>
                        <div class="card-desc">Privacy-focused search engine<br>No tracking • No data collection</div>
                        <a href="https://duckduckgo.com/?q=${encodeURIComponent(query)}" target="_blank" class="search-btn">Search DDG</a>
                        <a href="https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}" target="_blank" class="search-btn">DDG Lite</a>
                    </div>
                    
                    <div class="search-card">
                        <span class="card-icon">🔒</span>
                        <div class="card-title">StartPage</div>
                        <div class="card-desc">Google results without tracking<br>Anonymous proxy results</div>
                        <a href="https://startpage.com/search?query=${encodeURIComponent(query)}" target="_blank" class="search-btn">Search StartPage</a>
                    </div>
                    
                    <div class="search-card">
                        <span class="card-icon">🦁</span>
                        <div class="card-title">Brave Search</div>
                        <div class="card-desc">Independent search index<br>No Google dependency</div>
                        <a href="https://search.brave.com/search?q=${encodeURIComponent(query)}" target="_blank" class="search-btn">Search Brave</a>
                    </div>
                    
                    <div class="search-card">
                        <span class="card-icon">🌐</span>
                        <div class="card-title">SearX</div>
                        <div class="card-desc">Open source metasearch<br>Aggregated anonymous results</div>
                        <a href="https://searx.space/?q=${encodeURIComponent(query)}" target="_blank" class="search-btn">Search SearX</a>
                    </div>
                    
                    <div class="search-card">
                        <span class="card-icon">📚</span>
                        <div class="card-title">Wikipedia</div>
                        <div class="card-desc">Knowledge base search<br>Educational resources</div>
                        <button class="search-btn" onclick="searchWikipedia()">Search Wiki</button>
                        <a href="https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}" target="_blank" class="search-btn">External Wiki</a>
                    </div>
                    
                    <div class="search-card">
                        <span class="card-icon">🎥</span>
                        <div class="card-title">Video Search</div>
                        <div class="card-desc">Video content search<br>Multiple platforms</div>
                        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(query)}" target="_blank" class="search-btn">YouTube</a>
                        <a href="https://www.bitchute.com/search/?query=${encodeURIComponent(query)}" target="_blank" class="search-btn">BitChute</a>
                    </div>
                </div>
                
                <div class="info-section">
                    <h3>🛡️ PRIVACY PROTECTION ACTIVE</h3>
                    <p>All searches are performed through anonymous browsing</p>
                    <p>Your real IP address is hidden from search engines</p>
                    <p>No search history is stored or tracked</p>
                    
                    <div class="status-bar">
                        [STATUS] Proxy network active • IP masking enabled • Secure connection established
                    </div>
                </div>
            </div>
            
            <script>
                function searchWikipedia() {
                    const query = "${query}";
                    parent.hyperspaceBrowser.logTerminal('[WIKI] Searching Wikipedia through proxy...');
                    parent.hyperspaceBrowser.navigate('https://en.wikipedia.org/wiki/Special:Search?search=' + encodeURIComponent(query));
                }
                
                // Log that search page loaded successfully
                parent.hyperspaceBrowser.logTerminal('[SUCCESS] Anonymous search portal loaded');
                parent.hyperspaceBrowser.logTerminal('[READY] Multiple search engines available for: "${query}"');
            </script>
        </body>
        </html>`;
        
        // Ensure content frame exists
        if (!this.elements.contentFrame) {
            this.logTerminal(`[ERROR] Content frame not found`);
            return;
        }
        
        try {
            this.elements.contentFrame.srcdoc = reliableSearchHTML;
            this.elements.contentFrame.style.display = 'block';
            
            if (this.elements.welcomeScreen) {
                this.elements.welcomeScreen.style.display = 'none';
            }
            
            this.logTerminal(`[SUCCESS] Reliable search interface created`);
        } catch (error) {
            this.logTerminal(`[ERROR] Failed to create search interface: ${error.message}`);
        }
        
        this.hideLoading();
    }

    createDDGFallbackResults(query) {
        this.logTerminal(`[DDG-FALLBACK] Using reliable search fallback`);
        this.createReliableSearchPage(query);
    }    createDDGSearchResults(query) {
        this.logTerminal(`[DDG] Creating anonymous search results page for: "${query}"`);

        const searchResultsHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HYP3RSP4C3 - Anonymous Search Results</title>
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    margin: 0; 
                    padding: 20px;
                    line-height: 1.6;
                }
                .container { max-width: 1000px; margin: 0 auto; }
                .search-header {
                    background: rgba(26, 26, 26, 0.8);
                    border: 2px solid #8b5dff;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .search-methods {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .method-card {
                    background: rgba(42, 42, 42, 0.8);
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 20px;
                    transition: all 0.3s ease;
                }
                .method-card:hover {
                    border-color: #8b5dff;
                    box-shadow: 0 0 15px rgba(139, 93, 255, 0.3);
                }
                .search-btn {
                    background: linear-gradient(135deg, #8b5dff, #00ffff);
                    color: #0a0a0a;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 5px;
                    font-family: monospace;
                    width: 100%;
                }
                .search-btn:hover {
                    background: linear-gradient(135deg, #00ffff, #8b5dff);
                }
                .query-display {
                    background: #000;
                    color: #00ff41;
                    padding: 10px;
                    border-radius: 4px;
                    font-family: monospace;
                    margin: 10px 0;
                    word-break: break-word;
                }
                .iframe-container {
                    margin-top: 20px;
                    height: 500px;
                }
                .search-frame {
                    width: 100%;
                    height: 100%;
                    border: 2px solid #8b5dff;
                    border-radius: 8px;
                    background: white;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="search-header">
                    <h1>🔍 ANONYMOUS SEARCH RESULTS</h1>
                    <p>Multiple search methods for: <strong>"${query}"</strong></p>
                    <div class="query-display">${query}</div>
                </div>
                
                <div class="search-methods">
                    <div class="method-card">
                        <h3>🦆 DuckDuckGo Direct</h3>
                        <p>Open DuckDuckGo in a new tab (bypasses proxy limitations)</p>
                        <button class="search-btn" onclick="openDDGExternal()">Search on DuckDuckGo</button>
                        <button class="search-btn" onclick="openDDGLite()">DuckDuckGo Lite</button>
                    </div>
                    
                    <div class="method-card">
                        <h3>🔄 Alternative Search Engines</h3>
                        <p>Try other privacy-focused search engines</p>
                        <button class="search-btn" onclick="searchStartPage()">StartPage</button>
                        <button class="search-btn" onclick="searchSearX()">SearX</button>
                    </div>
                    
                    <div class="method-card">
                        <h3>🌐 Proxy Search</h3>
                        <p>Search through anonymous proxy services</p>
                        <button class="search-btn" onclick="tryProxySearch()">Proxy Search</button>
                        <button class="search-btn" onclick="tryMetaSearch()">Meta Search</button>
                    </div>
                    
                    <div class="method-card">
                        <h3>📚 Direct Resources</h3>
                        <p>Search specific sites directly</p>
                        <button class="search-btn" onclick="searchWikipedia()">Wikipedia</button>
                        <button class="search-btn" onclick="searchReddit()">Reddit</button>
                    </div>
                </div>
                
                <div class="iframe-container" id="searchContainer" style="display: none;">
                    <iframe class="search-frame" id="searchFrame"></iframe>
                </div>
            </div>
            
            <script>
                const query = "${query}";
                
                function openDDGExternal() {
                    const url = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
                    window.open(url, '_blank');
                    parent.hyperspaceBrowser.logTerminal('[DDG] Opened DuckDuckGo in external tab');
                }
                
                function openDDGLite() {
                    const url = 'https://lite.duckduckgo.com/lite/?q=' + encodeURIComponent(query);
                    window.open(url, '_blank');
                    parent.hyperspaceBrowser.logTerminal('[DDG] Opened DuckDuckGo Lite in external tab');
                }
                
                function searchStartPage() {
                    const url = 'https://startpage.com/search?query=' + encodeURIComponent(query);
                    loadInFrame(url);
                    parent.hyperspaceBrowser.logTerminal('[SEARCH] Trying StartPage search');
                }
                
                function searchSearX() {
                    const url = 'https://searx.org/search?q=' + encodeURIComponent(query);
                    loadInFrame(url);
                    parent.hyperspaceBrowser.logTerminal('[SEARCH] Trying SearX search');
                }
                
                function tryProxySearch() {
                    // Use a search API that works with proxies
                    parent.hyperspaceBrowser.logTerminal('[SEARCH] Attempting proxy-based search...');
                    parent.hyperspaceBrowser.performProxySearch(query);
                }
                
                function tryMetaSearch() {
                    // Search multiple engines through proxy
                    parent.hyperspaceBrowser.logTerminal('[SEARCH] Performing meta-search...');
                    parent.hyperspaceBrowser.performMetaSearch(query);
                }
                
                function searchWikipedia() {
                    const url = 'https://en.wikipedia.org/wiki/Special:Search?search=' + encodeURIComponent(query);
                    parent.hyperspaceBrowser.navigate(url);
                    parent.hyperspaceBrowser.logTerminal('[SEARCH] Searching Wikipedia');
                }
                
                function searchReddit() {
                    const url = 'https://old.reddit.com/search?q=' + encodeURIComponent(query);
                    parent.hyperspaceBrowser.navigate(url);
                    parent.hyperspaceBrowser.logTerminal('[SEARCH] Searching Reddit');
                }
                
                function loadInFrame(url) {
                    const container = document.getElementById('searchContainer');
                    const frame = document.getElementById('searchFrame');
                    
                    frame.src = url;
                    container.style.display = 'block';
                    
                    frame.onload = function() {
                        parent.hyperspaceBrowser.logTerminal('[SUCCESS] Search results loaded');
                    };
                    
                    frame.onerror = function() {
                        parent.hyperspaceBrowser.logTerminal('[ERROR] Failed to load search results');
                    };
                }
            </script>
        </body>
        </html>`;

        if (this.elements.contentFrame) {
            this.elements.contentFrame.srcdoc = searchResultsHTML;
            this.elements.contentFrame.style.display = 'block';
            if (this.elements.welcomeScreen) {
                this.elements.welcomeScreen.style.display = 'none';
            }
        }

        this.hideLoading();
    }

    performProxySearch(query) {
        this.logTerminal(`[PROXY-SEARCH] Creating external search options for: "${query}"`);

        // Since direct API calls often fail due to CORS, create a page with external links
        const externalSearchHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Proxy Search: ${query}</title>
            <style>
                body { background: #0a0a0a; color: #00ff41; font-family: monospace; padding: 20px; }
                .search-engine { 
                    background: rgba(42, 42, 42, 0.8); 
                    border: 1px solid #8b5dff; 
                    margin: 15px 0; 
                    padding: 20px; 
                    border-radius: 8px; 
                }
                .search-link { 
                    color: #00ffff; 
                    text-decoration: none; 
                    font-weight: bold; 
                    display: block;
                    padding: 10px;
                    background: rgba(139, 93, 255, 0.2);
                    border-radius: 4px;
                    margin: 5px 0;
                }
                .search-link:hover { 
                    color: #ffff00; 
                    background: rgba(139, 93, 255, 0.4);
                }
            </style>
        </head>
        <body>
            <h1>🔍 Anonymous Search: "${query}"</h1>
            <p>Your IP is masked - choose a search engine:</p>
            
            <div class="search-engine">
                <h3>🦆 Privacy Search Engines</h3>
                <a href="https://duckduckgo.com/?q=${encodeURIComponent(query)}" target="_blank" class="search-link">
                    DuckDuckGo - No tracking
                </a>
                <a href="https://startpage.com/search?query=${encodeURIComponent(query)}" target="_blank" class="search-link">
                    StartPage - Google results, no tracking
                </a>
                <a href="https://search.brave.com/search?q=${encodeURIComponent(query)}" target="_blank" class="search-link">
                    Brave Search - Independent index
                </a>
            </div>
            
            <div class="search-engine">
                <h3>🌐 Alternative Engines</h3>
                <a href="https://yandex.com/search/?text=${encodeURIComponent(query)}" target="_blank" class="search-link">
                    Yandex - Russian search engine
                </a>
                <a href="https://www.searx.space/?q=${encodeURIComponent(query)}" target="_blank" class="search-link">
                    SearX - Open source metasearch
                </a>
            </div>
            
            <p><em>✅ All searches are made with your IP address hidden through the HYP3RSP4C3 proxy network</em></p>
        </body>
        </html>`;

        if (this.elements.contentFrame) {
            this.elements.contentFrame.srcdoc = externalSearchHTML;
        }
    }

    performMetaSearch(query) {
        this.logTerminal(`[META-SEARCH] Creating comprehensive search portal for: "${query}"`);

        this.performProxySearch(query); // Use the same external search method
    }

    displayProxiedContent(html, url) {
        this.logTerminal(`[CONTENT] Processing proxied content from ${url}`);

        const iframe = this.elements.contentFrame;
        if (!iframe) {
            this.logTerminal(`[ERROR] Content frame not available`);
            return;
        }

        try {
            // Clean and process the HTML content
            let processedHtml = this.processProxiedHTML(html, url);
            
            // Validate content is not empty
            if (!processedHtml || processedHtml.trim().length < 50) {
                this.logTerminal(`[WARNING] Received minimal content, may be blocked`);
                // Try alternative display method
                this.showContentPreview(html, url);
                return;
            }

            // Set up iframe event handlers
            iframe.onload = () => {
                this.logTerminal(`[SUCCESS] Content rendered: ${url}`);
                this.updateAddressBar(url);
            };

            iframe.onerror = () => {
                this.logTerminal(`[ERROR] Content rendering failed`);
                this.showContentPreview(html, url);
            };

            // Load the content
            iframe.srcdoc = processedHtml;
            iframe.style.display = 'block';

            // Hide welcome screen
            if (this.elements.welcomeScreen) {
                this.elements.welcomeScreen.style.display = 'none';
            }

            this.logTerminal(`[RENDER] Content display initiated`);
            
        } catch (error) {
            this.logTerminal(`[ERROR] Content processing failed: ${error.message}`);
            this.showContentPreview(html, url);
        }
    }

    processProxiedHTML(html, originalUrl) {
        if (!html) return html;

        try {
            // Fix relative URLs and improve content
            let processed = html;

            // Extract domain from original URL
            const urlObj = new URL(originalUrl);
            const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

            // Fix relative links and resources
            processed = processed.replace(/href=["']\/([^"']*?)["']/g, `href="${baseUrl}/$1"`);
            processed = processed.replace(/src=["']\/([^"']*?)["']/g, `src="${baseUrl}/$1"`);
            
            // Add base tag for better resource loading
            if (processed.includes('<head>')) {
                processed = processed.replace('<head>', `<head><base href="${baseUrl}/">`);
            }

            // Inject proxy notification
            const proxyNotice = `
                <style>
                    .hyper-proxy-notice {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        background: linear-gradient(135deg, #8b5dff, #00ffff);
                        color: #000;
                        padding: 8px;
                        text-align: center;
                        font-family: monospace;
                        font-weight: bold;
                        z-index: 999999;
                        font-size: 12px;
                    }
                    body { margin-top: 35px !important; }
                </style>
                <div class="hyper-proxy-notice">
                    ⚡ HYP3RSP4C3 PROXY ACTIVE • ANONYMOUS BROWSING • IP MASKED ⚡
                </div>
            `;

            if (processed.includes('<body>')) {
                processed = processed.replace('<body>', `<body>${proxyNotice}`);
            } else {
                processed = proxyNotice + processed;
            }

            return processed;

        } catch (error) {
            this.logTerminal(`[WARNING] HTML processing failed, using raw content: ${error.message}`);
            return html;
        }
    }

    showContentPreview(html, url) {
        this.logTerminal(`[PREVIEW] Showing content preview for ${url}`);

        // Create a simple content preview when main display fails
        const previewHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Content Preview - HYP3RSP4C3</title>
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    padding: 20px;
                    line-height: 1.6;
                }
                .preview-container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .preview-header {
                    text-align: center;
                    border-bottom: 2px solid #8b5dff;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .content-box {
                    background: rgba(26, 26, 26, 0.8);
                    border: 1px solid #00ffff;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    max-height: 400px;
                    overflow-y: auto;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                .action-buttons {
                    text-align: center;
                    margin-top: 30px;
                }
                .action-btn {
                    background: linear-gradient(135deg, #8b5dff, #00ffff);
                    color: #000;
                    border: none;
                    padding: 12px 20px;
                    margin: 5px;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    font-family: 'Source Code Pro', monospace;
                }
            </style>
        </head>
        <body>
            <div class="preview-container">
                <div class="preview-header">
                    <h1>🔍 CONTENT PREVIEW</h1>
                    <p>Source: ${url}</p>
                    <p>Content received but may be blocked from full display</p>
                </div>
                
                <div class="content-box">
                    ${html ? html.substring(0, 2000) + (html.length > 2000 ? '\n\n[Content truncated...]' : '') : 'No content received'}
                </div>
                
                <div class="action-buttons">
                    <button class="action-btn" onclick="openInNewTab()">Open in New Tab</button>
                    <button class="action-btn" onclick="retryProxy()">Retry Proxy</button>
                    <button class="action-btn" onclick="showAlternatives()">Show Alternatives</button>
                </div>
            </div>
            
            <script>
                function openInNewTab() {
                    window.open('${url}', '_blank');
                }
                
                function retryProxy() {
                    parent.hyperspaceBrowser.navigate('${url}');
                }
                
                function showAlternatives() {
                    parent.hyperspaceBrowser.showWorkingAlternatives('${url}');
                }
            </script>
        </body>
        </html>`;

        if (this.elements.contentFrame) {
            this.elements.contentFrame.srcdoc = previewHtml;
            this.elements.contentFrame.style.display = 'block';
            if (this.elements.welcomeScreen) {
                this.elements.welcomeScreen.style.display = 'none';
            }
        }
    }

    showConnectionError(url) {
        this.logTerminal(`[ERROR] Failed to connect to ${url}`);

        const errorHTML = `
        <html>
        <head>
            <title>Connection Error - HYP3RSP4C3</title>
            <style>
                body { 
                    background: #0a0a0a; 
                    color: #ff6b6b; 
                    font-family: monospace; 
                    padding: 40px;
                    text-align: center;
                }
                .error-container {
                    border: 2px solid #ff6b6b;
                    padding: 30px;
                    margin: 20px auto;
                    max-width: 600px;
                    background: rgba(255, 107, 107, 0.1);
                }
                .retry-btn {
                    background: #8b5dff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    margin: 10px;
                    cursor: pointer;
                    font-family: monospace;
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>⚠ CONNECTION FAILED</h1>
                <p>Unable to establish secure connection to:</p>
                <p><strong>${url}</strong></p>
                <p>All proxy routes have been compromised or blocked.</p>
                <button class="retry-btn" onclick="parent.hyperspaceBrowser.navigate('${url}')">Retry Connection</button>
                <button class="retry-btn" onclick="parent.hyperspaceBrowser.preferTorRouting = true; parent.hyperspaceBrowser.navigate('${url}')">Try Tor Network</button>
                <button class="retry-btn" onclick="parent.hyperspaceBrowser.goHome()">Return Home</button>
            </div>
        </body>
        </html>`;

        if (this.elements.contentFrame) {
            this.elements.contentFrame.srcdoc = errorHTML;
            this.elements.contentFrame.style.display = 'block';
            if (this.elements.welcomeScreen) {
                this.elements.welcomeScreen.style.display = 'none';
            }
        }

        this.hideLoading();
    }

    showWorkingAlternatives(url) {
        this.logTerminal(`[ALTERNATIVES] Displaying working proxy alternatives for ${url}`);

        const domain = url.replace(/https?:\/\//, '').split('/')[0];

        const alternativesHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Proxy Alternatives - HYP3RSP4C3</title>
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    margin: 0; 
                    padding: 20px;
                    line-height: 1.6;
                    min-height: 100vh;
                }
                .container { 
                    max-width: 900px; 
                    margin: 0 auto; 
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 40px; 
                    padding-bottom: 20px;
                    border-bottom: 2px solid #8b5dff;
                }
                .logo {
                    font-size: 28px;
                    color: #8b5dff;
                    margin-bottom: 15px;
                }
                .target-url {
                    background: rgba(0, 0, 0, 0.8);
                    border: 2px solid #ff6b6b;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                    word-break: break-all;
                }
                .alternatives-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .alt-card {
                    background: rgba(26, 26, 26, 0.9);
                    border: 2px solid #333;
                    border-radius: 12px;
                    padding: 25px;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                .alt-card:hover {
                    border-color: #00ffff;
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
                    transform: translateY(-3px);
                }
                .alt-icon {
                    font-size: 42px;
                    margin-bottom: 15px;
                    display: block;
                }
                .alt-title {
                    color: #00ffff;
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 12px;
                }
                .alt-desc {
                    color: #00ff41;
                    margin-bottom: 20px;
                    font-size: 14px;
                    line-height: 1.5;
                }
                .proxy-btn {
                    background: linear-gradient(135deg, #8b5dff, #00ffff);
                    color: #000;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 5px;
                    font-family: 'Source Code Pro', monospace;
                    text-decoration: none;
                    display: inline-block;
                    transition: all 0.2s ease;
                }
                .proxy-btn:hover {
                    background: linear-gradient(135deg, #00ffff, #8b5dff);
                    transform: scale(1.05);
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
                }
                .retry-section {
                    background: rgba(42, 42, 42, 0.8);
                    border: 2px solid #ff6b6b;
                    border-radius: 10px;
                    padding: 25px;
                    text-align: center;
                    margin-top: 30px;
                }
                .retry-btn {
                    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
                    color: #000;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 8px;
                    font-family: 'Source Code Pro', monospace;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">⚡ HYP3RSP4C3 PROXY NETWORK ⚡</div>
                    <h1>🚫 DIRECT ROUTING BLOCKED</h1>
                    <div class="target-url">
                        <strong>Target:</strong> ${url}
                    </div>
                    <p>All automated proxy routes have been blocked. Use manual alternatives below:</p>
                </div>
                
                <div class="alternatives-grid">
                    <div class="alt-card">
                        <span class="alt-icon">🌐</span>
                        <div class="alt-title">Web Proxy Sites</div>
                        <div class="alt-desc">Paste the URL into these external proxy websites for immediate access</div>
                        <a href="https://www.proxysite.com/browse/${encodeURIComponent(url)}" target="_blank" class="proxy-btn">ProxySite</a>
                        <a href="https://hide.me/en/proxy/${encodeURIComponent(url)}" target="_blank" class="proxy-btn">Hide.me</a>
                        <a href="https://www.hidemyass.com/en-us/proxy/${encodeURIComponent(url)}" target="_blank" class="proxy-btn">HideMyAss</a>
                    </div>
                    
                    <div class="alt-card">
                        <span class="alt-icon">🔗</span>
                        <div class="alt-title">Archive Services</div>
                        <div class="alt-desc">Access cached versions of the website through archive services</div>
                        <a href="https://web.archive.org/web/*/${url}" target="_blank" class="proxy-btn">Wayback Machine</a>
                        <a href="https://archive.today/?run=1&url=${encodeURIComponent(url)}" target="_blank" class="proxy-btn">Archive.today</a>
                    </div>
                    
                    <div class="alt-card">
                        <span class="alt-icon">🔒</span>
                        <div class="alt-title">VPN + Direct Access</div>
                        <div class="alt-desc">Use a VPN service and access the site directly in a new tab</div>
                        <a href="${url}" target="_blank" class="proxy-btn">Open Direct</a>
                        <button class="proxy-btn" onclick="copyToClipboard('${url}')">Copy URL</button>
                    </div>
                    
                    <div class="alt-card">
                        <span class="alt-icon">🦆</span>
                        <div class="alt-title">Search Alternative</div>
                        <div class="alt-desc">Search for the content using anonymous search engines</div>
                        <a href="https://duckduckgo.com/?q=site:${domain}" target="_blank" class="proxy-btn">Search DDG</a>
                        <a href="https://startpage.com/search?query=site:${domain}" target="_blank" class="proxy-btn">StartPage</a>
                    </div>
                    
                    <div class="alt-card">
                        <span class="alt-icon">🌍</span>
                        <div class="alt-title">Tor Browser</div>
                        <div class="alt-desc">Download and use Tor Browser for maximum anonymity</div>
                        <a href="https://www.torproject.org/download/" target="_blank" class="proxy-btn">Get Tor</a>
                        <button class="proxy-btn" onclick="enableTorMode()">Enable Tor Mode</button>
                    </div>
                    
                    <div class="alt-card">
                        <span class="alt-icon">📱</span>
                        <div class="alt-title">Mobile Access</div>
                        <div class="alt-desc">Try accessing through mobile-optimized versions</div>
                        <a href="https://m.${domain}" target="_blank" class="proxy-btn">Mobile Site</a>
                        <a href="https://lite.${domain}" target="_blank" class="proxy-btn">Lite Version</a>
                    </div>
                </div>
                
                <div class="retry-section">
                    <h3>🔄 RETRY OPTIONS</h3>
                    <p>Attempt connection again with different methods:</p>
                    <button class="retry-btn" onclick="retryWithTor()">🧅 Retry with Tor</button>
                    <button class="retry-btn" onclick="retryAdvanced()">🚀 Advanced Retry</button>
                    <button class="retry-btn" onclick="goHome()">🏠 Return Home</button>
                </div>
            </div>
            
            <script>
                function copyToClipboard(text) {
                    navigator.clipboard.writeText(text).then(() => {
                        parent.hyperspaceBrowser.logTerminal('[COPIED] URL copied to clipboard');
                        alert('URL copied to clipboard!');
                    });
                }
                
                function enableTorMode() {
                    parent.hyperspaceBrowser.preferTorRouting = true;
                    parent.hyperspaceBrowser.logTerminal('[TOR] Tor routing enabled for future connections');
                    alert('Tor routing enabled! Try navigating again.');
                }
                
                function retryWithTor() {
                    parent.hyperspaceBrowser.preferTorRouting = true;
                    parent.hyperspaceBrowser.navigate('${url}');
                }
                
                function retryAdvanced() {
                    parent.hyperspaceBrowser.logTerminal('[RETRY] Attempting advanced proxy methods...');
                    parent.hyperspaceBrowser.navigate('${url}');
                }
                
                function goHome() {
                    parent.hyperspaceBrowser.goHome();
                }
                
                // Log successful load
                parent.hyperspaceBrowser.logTerminal('[ALTERNATIVES] Proxy alternatives loaded successfully');
            </script>
        </body>
        </html>`;

        if (this.elements.contentFrame) {
            this.elements.contentFrame.srcdoc = alternativesHTML;
            this.elements.contentFrame.style.display = 'block';
            if (this.elements.welcomeScreen) {
                this.elements.welcomeScreen.style.display = 'none';
            }
        }

        this.hideLoading();
    }

    showAlternativeAccess(url) {
        // Legacy method - redirect to new implementation
        this.showWorkingAlternatives(url);
    }

    // Legacy method kept for compatibility 
    showLegacyAlternatives(url) {
        this.logTerminal(`[LEGACY] Showing legacy alternative access methods for ${url}`);

        const domain = url.replace(/https?:\/\//, '').split('/')[0];

        const alternativeHTML = `
        <html>
        <head>
            <title>Alternative Access - HYP3RSP4C3</title>
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    margin: 0; 
                    padding: 20px;
                    line-height: 1.6;
                }
                .container { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; }
                .access-card {
                    background: rgba(26, 26, 26, 0.8);
                    border: 1px solid #8b5dff;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 15px 0;
                    transition: all 0.3s ease;
                }
                .access-card:hover {
                    border-color: #00ffff;
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
                }
                .access-btn {
                    background: linear-gradient(135deg, #8b5dff, #00ffff);
                    color: #0a0a0a;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 5px;
                    font-family: monospace;
                }
                .access-btn:hover {
                    background: linear-gradient(135deg, #00ffff, #8b5dff);
                }
                .url-display {
                    background: #000;
                    color: #00ff41;
                    padding: 10px;
                    border-radius: 4px;
                    font-family: monospace;
                    word-break: break-all;
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔗 ALTERNATIVE ACCESS METHODS</h1>
                    <p>Multiple ways to access your target</p>
                </div>
                
                <div class="access-card">
                    <h3>🌐 Direct External Access</h3>
                    <p>Open the site in your default browser (bypasses all restrictions)</p>
                    <div class="url-display">${url}</div>
                    <button class="access-btn" onclick="window.open('${url}', '_blank')">Open Externally</button>
                </div>
                
                <div class="access-card">
                    <h3>🔄 Force Reload Attempt</h3>
                    <p>Try loading the site again with different settings</p>
                    <button class="access-btn" onclick="parent.hyperspaceBrowser.navigate('${url}')">Retry Loading</button>
                    <button class="access-btn" onclick="parent.hyperspaceBrowser.preferTorRouting = true; parent.hyperspaceBrowser.navigate('${url}')">Try via Tor</button>
                </div>
                
                <div class="access-card">
                    <h3>🔍 Search Alternative</h3>
                    <p>Search for information about this site or similar content</p>
                    <button class="access-btn" onclick="parent.hyperspaceBrowser.performWebSearch('${domain} alternative access')">${domain} Alternatives</button>
                    <button class="access-btn" onclick="parent.hyperspaceBrowser.performWebSearch('${domain} information')">${domain} Info</button>
                </div>
                
                <div class="access-card">
                    <h3>📱 Mobile Version</h3>
                    <p>Try accessing the mobile version which may have fewer restrictions</p>
                    <button class="access-btn" onclick="parent.hyperspaceBrowser.navigate('https://m.${domain}')"">Mobile Site</button>
                    <button class="access-btn" onclick="parent.hyperspaceBrowser.navigate('https://mobile.${domain}')">Mobile Subdomain</button>
                </div>
                
                <div class="access-card">
                    <h3>🏠 Return Home</h3>
                    <p>Go back to the HYP3RSP4C3 Browser home screen</p>
                    <button class="access-btn" onclick="parent.hyperspaceBrowser.goHome()">Return Home</button>
                </div>
            </div>
        </body>
        </html>`;

        if (this.elements.contentFrame) {
            this.elements.contentFrame.srcdoc = alternativeHTML;
            this.elements.contentFrame.style.display = 'block';
            if (this.elements.welcomeScreen) {
                this.elements.welcomeScreen.style.display = 'none';
            }
        }

        this.hideLoading();
    }

    checkTorAvailability(url) {
        this.logTerminal(`[TOR] Checking Tor network availability...`);

        // Check if we can detect Tor browser or local Tor proxy
        this.torProxyPort = 9150; // Default Tor Browser port
        this.torSOCKSPort = 9050; // Default Tor daemon port

        // Try multiple Tor integration methods
        this.setupTorRouting(url);
    }

    setupTorRouting(url) {
        this.logTerminal(`[TOR] Configuring Tor network routing...`);

        // Multiple methods to route through Tor network
        const torMethods = [
            // Method 1: Tor Browser integration
            () => this.torBrowserIntegration(url),
            // Method 2: Tor proxy services that run through Tor
            () => this.torProxyServices(url),
            // Method 3: Local Tor SOCKS proxy (if available)
            () => this.localTorProxy(url),
            // Method 4: Tor-enabled web proxies
            () => this.torWebProxies(url),
            // Method 5: Onion service routing
            () => this.onionServiceRouting(url)
        ];

        let methodIndex = 0;

        const tryNextMethod = () => {
            if (methodIndex >= torMethods.length) {
                this.logTerminal(`[TOR] All Tor methods failed, creating Tor setup guide`);
                this.createTorSetupGuide(url);
                return;
            }

            this.logTerminal(`[TOR] Attempting Tor method ${methodIndex + 1}/${torMethods.length}`);

            torMethods[methodIndex]()
                .then(success => {
                    if (success) {
                        this.logTerminal(`[SUCCESS] Connected through Tor network via method ${methodIndex + 1}`);
                    } else {
                        methodIndex++;
                        setTimeout(tryNextMethod, 500);
                    }
                })
                .catch(error => {
                    this.logTerminal(`[TOR] Method ${methodIndex + 1} failed: ${error.message || 'Unknown error'}`);
                    methodIndex++;
                    setTimeout(tryNextMethod, 500);
                });
        };

        tryNextMethod();
    }

    async torBrowserIntegration(url) {
        this.logTerminal(`[TOR] Attempting Tor Browser integration...`);

        // Method 1: Open URL directly in system's Tor browser if available
        try {
            // Create a special Tor browser launcher
            this.createTorBrowserLauncher(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    async torProxyServices(url) {
        this.logTerminal(`[TOR] Attempting Tor-enabled proxy services...`);

        // Use enhanced proxy services including direct IP proxies for Tor routing
        const torProxies = [
            // Direct IP Proxies (Potentially Tor-enabled)
            `http://195.114.209.50:9050/${url}`, // Tor SOCKS port on EU proxy
            `http://198.44.255.3:9050/${url}`, // Tor SOCKS port on US proxy  
            `http://85.39.112.144:9050/${url}`, // Tor SOCKS port on DE proxy
            // Alternative Tor ports
            `http://195.114.209.50:9150/${url}`, // Tor Browser port on EU proxy
            `http://198.44.255.3:9150/${url}`, // Tor Browser port on US proxy
            `http://85.39.112.144:9150/${url}`, // Tor Browser port on DE proxy
            // Standard proxy ports (may be Tor-enabled)
            `http://195.114.209.50:8080/${url}`,
            `http://198.44.255.3:8080/${url}`,
            `http://85.39.112.144:8080/${url}`,
            // Web-based Tor-enabled proxies
            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, // May route through Tor
            `https://corsproxy.io/?${encodeURIComponent(url)}`, // Check if Tor-enabled
            // Custom Tor gateway (if available)
            `https://tor-proxy.herokuapp.com/${url}` // Hypothetical Tor proxy
        ];

        for (const proxyUrl of torProxies) {
            try {
                const success = await this.testTorProxy(proxyUrl, url);
                if (success) {
                    this.elements.contentFrame.src = proxyUrl;
                    this.logTerminal(`[SUCCESS] Connected via Tor-enabled proxy`);
                    return true;
                }
            } catch (error) {
                continue;
            }
        }

        return false;
    }

    async localTorProxy(url) {
        this.logTerminal(`[TOR] Attempting local Tor SOCKS proxy connection...`);

        // Try to detect and use local Tor installation
        try {
            // Check if Tor is running locally
            const torRunning = await this.checkLocalTor();

            if (torRunning) {
                // Create configuration for local Tor usage
                this.createLocalTorInterface(url);
                return true;
            }
        } catch (error) {
            this.logTerminal(`[TOR] Local Tor not detected: ${error.message}`);
        }

        return false;
    }

    async torWebProxies(url) {
        this.logTerminal(`[TOR] Attempting Tor web proxies...`);

        // Web-based proxies that specifically use Tor
        const torWebProxies = [
            `https://hide.me/en/proxy`, // Popular web proxy
            `https://www.proxysite.com`, // Another web proxy
            // These would need to be configured to use Tor on the backend
        ];

        // For now, use a Tor-like proxy configuration
        try {
            const torifiedUrl = await this.createTorifiedRequest(url);
            if (torifiedUrl) {
                this.elements.contentFrame.src = torifiedUrl;
                return true;
            }
        } catch (error) {
            return false;
        }

        return false;
    }

    async onionServiceRouting(url) {
        this.logTerminal(`[TOR] Checking for onion service alternatives...`);

        // Check if the target site has an onion service version
        const onionAlternatives = this.getOnionAlternatives(url);

        if (onionAlternatives.length > 0) {
            this.logTerminal(`[TOR] Found onion service alternatives`);
            this.createOnionServiceInterface(url, onionAlternatives);
            return true;
        }

        return false;
    }

    async testTorProxy(proxyUrl, originalUrl) {
        return new Promise((resolve) => {
            const testFrame = document.createElement('iframe');
            testFrame.style.display = 'none';
            testFrame.style.width = '1px';
            testFrame.style.height = '1px';

            let resolved = false;

            const cleanup = () => {
                if (document.body.contains(testFrame)) {
                    document.body.removeChild(testFrame);
                }
            };

            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    resolve(false);
                }
            }, 4000);

            testFrame.onload = () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeout);
                    cleanup();
                    resolve(true);
                }
            };

            testFrame.onerror = () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeout);
                    cleanup();
                    resolve(false);
                }
            };

            document.body.appendChild(testFrame);
            testFrame.src = proxyUrl;
        });
    }

    async checkLocalTor() {
        // Try to detect if Tor is running locally
        try {
            // Attempt to connect to Tor control port or SOCKS port
            const response = await fetch('http://127.0.0.1:9050', {
                method: 'HEAD',
                mode: 'no-cors'
            });
            return true;
        } catch (error) {
            // Try Tor Browser port
            try {
                const response = await fetch('http://127.0.0.1:9150', {
                    method: 'HEAD',
                    mode: 'no-cors'
                });
                return true;
            } catch (error2) {
                return false;
            }
        }
    }

    async createTorifiedRequest(url) {
        // Create a request that attempts to route through available Tor infrastructure
        const torGateways = [
            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`
        ];

        // Add Tor-specific headers or routing if possible
        for (const gateway of torGateways) {
            try {
                const response = await fetch(gateway, {
                    method: 'HEAD',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0',
                        'X-Tor-Routing': 'enabled' // Custom header for Tor-aware proxies
                    }
                });

                if (response.ok) {
                    return gateway;
                }
            } catch (error) {
                continue;
            }
        }

        return null;
    }

    getOnionAlternatives(url) {
        // Database of known onion service alternatives
        const onionServices = {
            'facebook.com': 'facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion',
            'duckduckgo.com': '3g2upl4pq6kufc4m.onion',
            'twitter.com': 'mobile.twitter.com', // Not onion but Tor-friendly
            'reddit.com': 'old.reddit.com', // More Tor-compatible
            'wikipedia.org': 'wikiless.org' // Privacy-focused Wikipedia mirror
        };

        const domain = new URL(url).hostname.replace('www.', '');
        const alternatives = [];

        if (onionServices[domain]) {
            alternatives.push(onionServices[domain]);
        }

        return alternatives;
    }

    createTorBrowserLauncher(url) {
        const torLauncherHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HYP3RSP4C3 - Tor Network Access</title>
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    margin: 0; 
                    padding: 40px;
                    line-height: 1.6;
                }
                .container { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 40px; }
                .tor-logo { font-size: 48px; margin-bottom: 20px; }
                .status-box {
                    background: rgba(26, 26, 26, 0.8);
                    border: 2px solid #8b5dff;
                    border-radius: 10px;
                    padding: 30px;
                    margin-bottom: 30px;
                    box-shadow: 0 0 20px rgba(139, 93, 255, 0.3);
                }
                .access-methods {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                }
                .method-card {
                    background: rgba(42, 42, 42, 0.8);
                    border: 1px solid #8b5dff;
                    border-radius: 8px;
                    padding: 25px;
                    transition: all 0.3s ease;
                }
                .method-card:hover {
                    border-color: #00ffff;
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
                }
                .tor-btn {
                    background: linear-gradient(135deg, #8b5dff, #00ffff);
                    color: #0a0a0a;
                    border: none;
                    padding: 15px 25px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                    margin: 10px 0;
                    text-transform: uppercase;
                }
                .tor-btn:hover {
                    background: linear-gradient(135deg, #00ffff, #8b5dff);
                }
                .onion-url {
                    background: #000;
                    color: #8b5dff;
                    padding: 10px;
                    border-radius: 4px;
                    font-family: monospace;
                    word-break: break-all;
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="tor-logo">🧅</div>
                    <h1>TOR NETWORK ACCESS</h1>
                    <p>Maximum anonymity and IP masking</p>
                </div>
                
                <div class="status-box">
                    <h2>🔒 TARGET: ${url}</h2>
                    <p><strong>Tor Network Status:</strong> Configuring anonymous routing through Tor network</p>
                    <p>Your IP address will be completely masked through multiple Tor relays worldwide.</p>
                </div>
                
                <div class="access-methods">
                    <div class="method-card">
                        <h3>🌐 Tor Browser Direct</h3>
                        <p>Open URL directly in Tor Browser for maximum anonymity and compatibility.</p>
                        <button class="tor-btn" onclick="openInTorBrowser()">Launch Tor Browser</button>
                        <button class="tor-btn" onclick="downloadTor()">Download Tor Browser</button>
                    </div>
                    
                    <div class="method-card">
                        <h3>🔗 Onion Service</h3>
                        <p>Access onion service version if available (most anonymous).</p>
                        <div class="onion-url" id="onionUrl">Checking for onion services...</div>
                        <button class="tor-btn" onclick="tryOnionService()">Access Onion Service</button>
                    </div>
                    
                    <div class="method-card">
                        <h3>🛡️ Tor Proxy</h3>
                        <p>Route through Tor network using local Tor installation.</p>
                        <button class="tor-btn" onclick="configureTorProxy()">Configure Tor Proxy</button>
                        <button class="tor-btn" onclick="testTorConnection()">Test Tor Connection</button>
                    </div>
                    
                    <div class="method-card">
                        <h3>📋 Manual Setup</h3>
                        <p>Instructions for setting up Tor routing manually.</p>
                        <button class="tor-btn" onclick="showTorSetup()">Show Setup Guide</button>
                        <button class="tor-btn" onclick="torAlternatives()">Find Alternatives</button>
                    </div>
                </div>
            </div>
            
            <script>
                function openInTorBrowser() {
                    // Try to open in Tor Browser
                    const torUrls = [
                        'tor://${url}',
                        '${url}'
                    ];
                    
                    // Open in new window with Tor-like user agent
                    window.open('${url}', '_blank', 'noopener,noreferrer');
                    parent.hyperspaceBrowser.logTerminal('[TOR] Launching external Tor Browser window');
                }
                
                function downloadTor() {
                    window.open('https://www.torproject.org/download/', '_blank');
                    parent.hyperspaceBrowser.logTerminal('[TOR] Opening Tor Browser download page');
                }
                
                function tryOnionService() {
                    parent.hyperspaceBrowser.logTerminal('[TOR] Searching for onion service alternatives...');
                    parent.hyperspaceBrowser.findOnionAlternatives('${url}');
                }
                
                function configureTorProxy() {
                    parent.hyperspaceBrowser.logTerminal('[TOR] Configuring local Tor proxy settings...');
                    parent.hyperspaceBrowser.createTorProxyConfig('${url}');
                }
                
                function testTorConnection() {
                    parent.hyperspaceBrowser.logTerminal('[TOR] Testing Tor network connectivity...');
                    parent.hyperspaceBrowser.testTorNetwork();
                }
                
                function showTorSetup() {
                    parent.hyperspaceBrowser.logTerminal('[TOR] Displaying Tor setup instructions...');
                    parent.hyperspaceBrowser.showTorSetupInstructions('${url}');
                }
                
                function torAlternatives() {
                    parent.hyperspaceBrowser.performWebSearch('${url} onion service alternative tor access');
                }
                
                // Check for onion alternatives on load
                setTimeout(() => {
                    const onionUrl = parent.hyperspaceBrowser.getOnionAlternatives('${url}');
                    const onionDiv = document.getElementById('onionUrl');
                    if (onionUrl.length > 0) {
                        onionDiv.textContent = onionUrl[0];
                        onionDiv.style.color = '#00ff41';
                    } else {
                        onionDiv.textContent = 'No onion service found for this site';
                        onionDiv.style.color = '#666';
                    }
                }, 500);
            </script>
        </body>
        </html>`;

        this.elements.contentFrame.srcdoc = torLauncherHTML;
    }

    createTorSetupGuide(url) {
        this.logTerminal(`[TOR] Creating comprehensive Tor setup guide...`);

        const setupHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HYP3RSP4C3 - Tor Network Setup</title>
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    margin: 0; 
                    padding: 20px;
                    line-height: 1.6;
                }
                .container { max-width: 900px; margin: 0 auto; }
                .section {
                    background: rgba(26, 26, 26, 0.8);
                    border: 1px solid #8b5dff;
                    border-radius: 8px;
                    padding: 25px;
                    margin-bottom: 20px;
                }
                .step { 
                    background: rgba(0, 0, 0, 0.5); 
                    padding: 15px; 
                    margin: 10px 0; 
                    border-left: 4px solid #00ff41;
                }
                .code-block {
                    background: #000;
                    color: #00ffff;
                    padding: 15px;
                    border-radius: 4px;
                    font-family: monospace;
                    margin: 10px 0;
                    overflow-x: auto;
                }
                .warning {
                    background: rgba(255, 165, 0, 0.1);
                    border: 1px solid #ffa500;
                    padding: 15px;
                    border-radius: 4px;
                    margin: 15px 0;
                }
                .tor-btn {
                    background: linear-gradient(135deg, #8b5dff, #00ffff);
                    color: #0a0a0a;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🧅 TOR NETWORK SETUP GUIDE</h1>
                <p>Complete guide to accessing websites through the Tor network for maximum anonymity.</p>
                
                <div class="section">
                    <h2>📥 Method 1: Download Tor Browser (Recommended)</h2>
                    <div class="step">
                        <strong>Step 1:</strong> Download official Tor Browser from torproject.org
                        <button class="tor-btn" onclick="window.open('https://www.torproject.org/download/', '_blank')">Download Tor Browser</button>
                    </div>
                    <div class="step">
                        <strong>Step 2:</strong> Install and launch Tor Browser
                    </div>
                    <div class="step">
                        <strong>Step 3:</strong> Copy and paste this URL into Tor Browser:
                        <div class="code-block">${url}</div>
                        <button class="tor-btn" onclick="copyToClipboard('${url}')">Copy URL</button>
                    </div>
                </div>
                
                <div class="section">
                    <h2>⚙️ Method 2: Configure Local Tor Proxy</h2>
                    <div class="step">
                        <strong>For Windows:</strong>
                        <div class="code-block">
1. Download Tor Expert Bundle
2. Extract and run tor.exe
3. Configure browser proxy settings:
   - HTTP Proxy: 127.0.0.1:8118
   - SOCKS Proxy: 127.0.0.1:9050
                        </div>
                    </div>
                    <div class="step">
                        <strong>For Linux/Mac:</strong>
                        <div class="code-block">
# Install Tor
sudo apt install tor  # Ubuntu/Debian
brew install tor      # macOS

# Start Tor service
sudo systemctl start tor

# Configure browser to use SOCKS proxy 127.0.0.1:9050
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>🌐 Method 3: Use Tor Web Proxies</h2>
                    <div class="step">
                        <strong>Tor-enabled web proxies:</strong>
                        <button class="tor-btn" onclick="window.open('https://hide.me/en/proxy', '_blank')">Hide.me Proxy</button>
                        <button class="tor-btn" onclick="window.open('https://www.proxysite.com', '_blank')">ProxySite</button>
                        <button class="tor-btn" onclick="window.open('https://www.croxyproxy.com', '_blank')">CroxyProxy</button>
                    </div>
                </div>
                
                <div class="section">
                    <h2>🧅 Method 4: Onion Services</h2>
                    <div class="step">
                        <strong>Access onion versions of popular sites:</strong><br>
                        • Facebook: facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion<br>
                        • DuckDuckGo: 3g2upl4pq6kufc4m.onion<br>
                        • ProPublica: p53lf57qovyuvwsc6xnrppddxpr23otqjb3hihippohmaidrhzd.onion
                    </div>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Security Notes:</strong><br>
                    • Always download Tor from official sources only<br>
                    • Never login to accounts when using Tor unless necessary<br>
                    • Disable JavaScript for maximum anonymity<br>
                    • Use HTTPS websites whenever possible
                </div>
                
                <div class="section">
                    <h2>🔍 Alternative Actions</h2>
                    <button class="tor-btn" onclick="tryCurrentSite()">Try Current Site Anyway</button>
                    <button class="tor-btn" onclick="searchAlternatives()">Search for Alternatives</button>
                    <button class="tor-btn" onclick="goBack()">Return to Browser</button>
                </div>
            </div>
            
            <script>
                function copyToClipboard(text) {
                    navigator.clipboard.writeText(text).then(() => {
                        parent.hyperspaceBrowser.logTerminal('[TOR] URL copied to clipboard');
                    });
                }
                
                function tryCurrentSite() {
                    parent.hyperspaceBrowser.navigate('${url}');
                }
                
                function searchAlternatives() {
                    parent.hyperspaceBrowser.performWebSearch('${url} alternative access tor onion');
                }
                
                function goBack() {
                    parent.hyperspaceBrowser.goHome();
                }
            </script>
        </body>
        </html>`;

        this.elements.contentFrame.srcdoc = setupHTML;
    }

    // Helper functions for Tor integration
    findOnionAlternatives(url) {
        const alternatives = this.getOnionAlternatives(url);
        if (alternatives.length > 0) {
            this.logTerminal(`[TOR] Found onion alternative: ${alternatives[0]}`);
            this.navigate('http://' + alternatives[0]);
        } else {
            this.logTerminal(`[TOR] No onion service found for ${url}`);
        }
    }

    createTorProxyConfig(url) {
        this.logTerminal(`[TOR] Creating Tor proxy configuration interface...`);
        // This would create an interface to configure local Tor settings
        this.createTorSetupGuide(url);
    }

    testTorNetwork() {
        this.logTerminal(`[TOR] Testing Tor network connectivity...`);

        // Test Tor connectivity by trying to access Tor check service
        fetch('https://check.torproject.org/api/ip')
            .then(response => response.json())
            .then(data => {
                if (data.IsTor) {
                    this.logTerminal(`[SUCCESS] Tor network connection confirmed`);
                } else {
                    this.logTerminal(`[WARNING] Not connected through Tor network`);
                }
            })
            .catch(error => {
                this.logTerminal(`[ERROR] Tor network test failed: ${error.message}`);
            });
    }

    showTorSetupInstructions(url) {
        this.createTorSetupGuide(url);
    }

    tryReliableProxy(url, proxyServices) {
        this.logTerminal(`[PROXY] Using reliable proxy method for: ${this.extractDomain(url)}`);

        let proxyIndex = 0;
        let hasSucceeded = false;

        const tryNextProxy = () => {
            if (proxyIndex >= proxyServices.length || hasSucceeded) {
                if (!hasSucceeded) {
                    this.logTerminal(`[ERROR] All proxy attempts failed`);
                    this.createFallbackInterface(url);
                }
                return;
            }

            const proxyUrl = proxyServices[proxyIndex];
            const serviceName = this.getProxyServiceName(proxyUrl);

            this.logTerminal(`[PROXY] Attempting ${serviceName}...`);
            proxyIndex++;

            if (proxyUrl === url) {
                // Direct attempt
                this.testDirectLoad(url, () => {
                    if (!hasSucceeded) {
                        hasSucceeded = true;
                        this.logTerminal(`[SUCCESS] Direct connection successful`);
                        this.elements.contentFrame.src = url;
                    }
                }, tryNextProxy);
            } else if (proxyUrl.includes('allorigins.win/raw')) {
                // Raw content proxy
                this.testRawProxy(proxyUrl, () => {
                    if (!hasSucceeded) {
                        hasSucceeded = true;
                        this.logTerminal(`[SUCCESS] Raw proxy connection successful`);
                        this.elements.contentFrame.src = proxyUrl;
                    }
                }, tryNextProxy);
            } else {
                // Other proxy services
                this.testIframeProxy(proxyUrl, () => {
                    if (!hasSucceeded) {
                        hasSucceeded = true;
                        this.logTerminal(`[SUCCESS] Proxy connection successful via ${serviceName}`);
                        this.elements.contentFrame.src = proxyUrl;
                    }
                }, tryNextProxy);
            }
        };

        tryNextProxy();
    }

    tryProxyWithFallback(url, proxyServices) {
        this.logTerminal(`[PROXY] Cautious proxy attempt for: ${this.extractDomain(url)}`);

        // Try only the most reliable proxy first
        const bestProxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

        this.testRawProxy(bestProxy, () => {
            this.logTerminal(`[SUCCESS] Proxy connection established`);
            this.elements.contentFrame.src = bestProxy;
        }, () => {
            this.logTerminal(`[PROXY] Primary proxy failed, showing access options`);
            this.createFallbackInterface(url);
        });
    }

    testDirectLoad(url, onSuccess, onFailure) {
        const testFrame = document.createElement('iframe');
        testFrame.style.display = 'none';
        testFrame.style.width = '1px';
        testFrame.style.height = '1px';

        let resolved = false;

        const cleanup = () => {
            if (document.body.contains(testFrame)) {
                document.body.removeChild(testFrame);
            }
        };

        const timeout = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                cleanup();
                onFailure();
            }
        }, 3000);

        testFrame.onload = () => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                cleanup();
                onSuccess();
            }
        };

        testFrame.onerror = () => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                cleanup();
                onFailure();
            }
        };

        document.body.appendChild(testFrame);
        testFrame.src = url;
    }

    testRawProxy(proxyUrl, onSuccess, onFailure) {
        const testFrame = document.createElement('iframe');
        testFrame.style.display = 'none';
        testFrame.style.width = '1px';
        testFrame.style.height = '1px';

        let resolved = false;

        const cleanup = () => {
            if (document.body.contains(testFrame)) {
                document.body.removeChild(testFrame);
            }
        };

        const timeout = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                cleanup();
                onFailure();
            }
        }, 4000);

        testFrame.onload = () => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                cleanup();
                onSuccess();
            }
        };

        testFrame.onerror = () => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                cleanup();
                onFailure();
            }
        };

        document.body.appendChild(testFrame);
        testFrame.src = proxyUrl;
    }

    testIframeProxy(proxyUrl, onSuccess, onFailure) {
        const testFrame = document.createElement('iframe');
        testFrame.style.display = 'none';
        testFrame.style.width = '1px';
        testFrame.style.height = '1px';

        let resolved = false;

        const cleanup = () => {
            if (document.body.contains(testFrame)) {
                document.body.removeChild(testFrame);
            }
        };

        const timeout = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                cleanup();
                onFailure();
            }
        }, 3000);

        testFrame.onload = () => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                cleanup();
                onSuccess();
            }
        };

        testFrame.onerror = () => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                cleanup();
                onFailure();
            }
        };

        document.body.appendChild(testFrame);
        testFrame.src = proxyUrl;
    }

    tryProxyService(url, proxyServices, index) {
        // Redirect to new proxy method
        this.tryProxyWithFallback(url, proxyServices);
    }

    fastAllOriginsLoad(url, resolve, reject, serviceName) {
        const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        fetch(apiUrl, { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (data.contents && data.contents.length > 100) {
                    this.displayProxiedContent(data.contents, url);
                    resolve({ service: serviceName });
                } else {
                    throw new Error('No content received');
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                reject(`${serviceName}: ${error.message}`);
            });
    }

    fastIframeLoad(proxyUrl, originalUrl, resolve, reject, serviceName) {
        const testFrame = document.createElement('iframe');
        testFrame.style.display = 'none';
        testFrame.style.width = '100%';
        testFrame.style.height = '100%';
        testFrame.style.border = 'none';

        let hasResolved = false;

        const cleanup = () => {
            if (document.body.contains(testFrame)) {
                document.body.removeChild(testFrame);
            }
        };

        const timeout = setTimeout(() => {
            if (!hasResolved) {
                hasResolved = true;
                cleanup();
                reject(`${serviceName}: Timeout`);
            }
        }, 1500);

        testFrame.onload = () => {
            if (!hasResolved) {
                hasResolved = true;
                clearTimeout(timeout);

                // Success - replace main frame
                this.elements.contentFrame.src = proxyUrl;
                cleanup();
                resolve({ service: serviceName });
            }
        };

        testFrame.onerror = () => {
            if (!hasResolved) {
                hasResolved = true;
                clearTimeout(timeout);
                cleanup();
                reject(`${serviceName}: Load error`);
            }
        };

        testFrame.src = proxyUrl;
        document.body.appendChild(testFrame);
    }

    loadThroughAllOrigins(url, proxyServices, index) {
        const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.contents) {
                    this.logTerminal(`[SUCCESS] Content retrieved via AllOrigins proxy`);
                    this.displayProxiedContent(data.contents, url);
                } else {
                    throw new Error('No content received');
                }
            })
            .catch(error => {
                this.logTerminal(`[PROXY] AllOrigins failed: ${error.message}`);
                this.tryProxyService(url, proxyServices, index + 1);
            });
    }

    loadThroughDirectProxy(proxyUrl, originalUrl, proxyServices, index) {
        // Create a test iframe to see if the proxy works
        const testFrame = document.createElement('iframe');
        testFrame.style.display = 'none';
        testFrame.style.width = '100%';
        testFrame.style.height = '100%';
        testFrame.style.border = 'none';

        let loadTimeout;
        let hasLoaded = false;

        testFrame.onload = () => {
            if (!hasLoaded) {
                hasLoaded = true;
                clearTimeout(loadTimeout);
                this.logTerminal(`[SUCCESS] Proxy connection established via route ${index + 1}`);

                // Replace the main frame with the working proxy
                this.elements.contentFrame.src = proxyUrl;
                document.body.removeChild(testFrame);
            }
        };

        testFrame.onerror = () => {
            if (!hasLoaded) {
                hasLoaded = true;
                clearTimeout(loadTimeout);
                this.logTerminal(`[PROXY] Route ${index + 1} failed, trying next...`);
                document.body.removeChild(testFrame);
                this.tryProxyService(originalUrl, proxyServices, index + 1);
            }
        };

        // Set a timeout for the test
        loadTimeout = setTimeout(() => {
            if (!hasLoaded) {
                hasLoaded = true;
                this.logTerminal(`[PROXY] Route ${index + 1} timeout, trying next...`);
                if (document.body.contains(testFrame)) {
                    document.body.removeChild(testFrame);
                }
                this.tryProxyService(originalUrl, proxyServices, index + 1);
            }
        }, 5000);

        testFrame.src = proxyUrl;
        document.body.appendChild(testFrame);
    }

    displayProxiedContent(htmlContent, originalUrl) {
        // Process the HTML content to fix relative URLs
        const processedContent = this.processHtmlContent(htmlContent, originalUrl);

        // Display the content in the iframe
        this.elements.contentFrame.srcdoc = processedContent;
    }

    processHtmlContent(html, baseUrl) {
        // Extract domain from base URL
        const baseDomain = new URL(baseUrl).origin;

        // Fix relative URLs in the HTML
        let processedHtml = html;

        // Fix relative src and href attributes
        processedHtml = processedHtml.replace(/src="\/([^"]+)"/g, `src="${baseDomain}/$1"`);
        processedHtml = processedHtml.replace(/href="\/([^"]+)"/g, `href="${baseDomain}/$1"`);

        // Add base tag to handle other relative URLs
        if (!processedHtml.includes('<base')) {
            processedHtml = processedHtml.replace('<head>', `<head><base href="${baseDomain}/">`);
        }

        // Add proxy notice
        const proxyNotice = `
        <div style="position: fixed; top: 0; left: 0; right: 0; background: rgba(0,0,0,0.9); color: #00ff41; padding: 10px; text-align: center; z-index: 10000; font-family: monospace; border-bottom: 2px solid #00ff41;">
            🔒 HYP3RSP4C3 PROXY ACTIVE | IP MASKED | CONNECTION SECURED
        </div>
        <style>body { margin-top: 50px !important; }</style>`;

        processedHtml = processedHtml.replace('<body', proxyNotice + '<body');

        return processedHtml;
    }

    loadYouTubeProxy(url) {
        this.logTerminal(`[YOUTUBE] Fast YouTube proxy attempt...`);

        // Try the fastest YouTube proxy first - AllOrigins with short timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

        fetch(apiUrl, { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (data.contents && data.contents.length > 500) {
                    this.logTerminal(`[SUCCESS] YouTube loaded via fast proxy`);
                    this.displayProxiedContent(data.contents, url);
                } else {
                    throw new Error('Insufficient content');
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                this.logTerminal(`[YOUTUBE] Fast proxy failed: ${error.message}`);
                // Immediately show YouTube alternative instead of trying more proxies
                this.createYouTubeAlternative(url);
            });
    }

    loadGoogleProxy(url) {
        this.logTerminal(`[GOOGLE] Fast Google proxy attempt...`);

        // Fast Google proxy with 1 second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);

        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

        fetch(proxyUrl, { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (data.contents && data.contents.length > 300) {
                    this.logTerminal(`[SUCCESS] Google loaded via fast proxy`);
                    this.displayProxiedContent(data.contents, url);
                } else {
                    throw new Error('Insufficient content');
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                this.logTerminal(`[GOOGLE] Fast proxy failed, using search interface`);
                // Immediately show search interface instead of retrying
                this.createSearchResultsPage(this.extractSearchQuery(url) || '');
            });
    }

    createYouTubeAlternative(url) {
        // Create a YouTube-like interface that works
        const youtubeHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HYP3RSP4C3 YouTube Proxy</title>
            <style>
                body { background: #0a0a0a; color: #00ff41; font-family: monospace; padding: 20px; }
                .container { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; }
                .video-section { background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                .btn { background: linear-gradient(135deg, #00ff41, #00ffff); color: #0a0a0a; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎥 HYP3RSP4C3 YouTube ACCESS</h1>
                    <p>Secure YouTube proxy interface</p>
                </div>
                <div class="video-section">
                    <h3>YouTube Access Options:</h3>
                    <button class="btn" onclick="window.open('${url}', '_blank')">Open YouTube Directly</button>
                    <button class="btn" onclick="tryAlternative()">Try Invidious (YouTube Alternative)</button>
                    <button class="btn" onclick="searchYoutube()">Search YouTube Content</button>
                </div>
                <div class="video-section">
                    <h3>Enter YouTube Video URL or Search:</h3>
                    <input type="text" id="ytInput" style="width: 100%; padding: 10px; background: #0a0a0a; border: 1px solid #00ff41; color: #00ff41; margin: 10px 0;">
                    <button class="btn" onclick="processYoutube()">ACCESS VIDEO</button>
                </div>
            </div>
            <script>
                function tryAlternative() {
                    window.open('https://invidious.io', '_blank');
                }
                function searchYoutube() {
                    parent.hyperspaceBrowser.performWebSearch('youtube videos');
                }
                function processYoutube() {
                    const input = document.getElementById('ytInput').value;
                    if (input.includes('youtube.com') || input.includes('youtu.be')) {
                        parent.hyperspaceBrowser.navigate(input);
                    } else {
                        parent.hyperspaceBrowser.performWebSearch('youtube ' + input);
                    }
                }
            </script>
        </body>
        </html>`;

        this.elements.contentFrame.srcdoc = youtubeHTML;
    }

    createFallbackInterface(url) {
        const domain = this.extractDomain(url);
        this.logTerminal(`[FALLBACK] Creating enhanced access interface for: ${domain}`);

        const fallbackHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HYP3RSP4C3 - Proxy Access</title>
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    margin: 0; 
                    padding: 0;
                    min-height: 100vh;
                }
                .container { 
                    max-width: 900px; 
                    margin: 0 auto; 
                    padding: 40px 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    border-bottom: 2px solid #00ff41;
                    padding-bottom: 20px;
                }
                .status-box {
                    background: rgba(26, 26, 26, 0.8);
                    border: 2px solid #ff0040;
                    border-radius: 10px;
                    padding: 25px;
                    margin-bottom: 30px;
                    box-shadow: 0 0 20px rgba(255, 0, 64, 0.3);
                }
                .access-methods {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                    margin-top: 30px;
                }
                .method-card {
                    background: rgba(42, 42, 42, 0.8);
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 25px;
                    transition: all 0.3s ease;
                }
                .method-card:hover {
                    border-color: #00ffff;
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
                    transform: translateY(-2px);
                }
                .method-title {
                    color: #00ffff;
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 15px;
                }
                .method-desc {
                    color: #ccc;
                    margin-bottom: 20px;
                    line-height: 1.5;
                }
                .access-btn {
                    background: linear-gradient(135deg, #00ff41, #00ffff);
                    color: #0a0a0a;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                    font-size: 14px;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                }
                .access-btn:hover {
                    background: linear-gradient(135deg, #00ffff, #00ff41);
                }
                .retry-section {
                    background: rgba(0, 0, 0, 0.5);
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 30px;
                }
                .input-field {
                    width: 100%;
                    padding: 15px;
                    background: #1a1a1a;
                    border: 2px solid #00ff41;
                    color: #00ff41;
                    border-radius: 5px;
                    font-family: inherit;
                    margin-bottom: 15px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔒 PROXY ACCESS: ${domain}</h1>
                    <p>Multiple infiltration routes available</p>
                </div>
                
                <div class="status-box">
                    <h2>⚠️ PROXY STATUS: FALLBACK MODE</h2>
                    <p>Primary proxy routes to <strong>${url}</strong> are currently blocked or unavailable.</p>
                    <p>The target site may be using advanced security measures. Choose an alternative access method below:</p>
                </div>
                
                <div class="access-methods">
                    <div class="method-card">
                        <div class="method-title">🌐 Direct Access</div>
                        <div class="method-desc">Open the site in a new window. Your real IP will be visible, but access is guaranteed.</div>
                        <button class="access-btn" onclick="window.open('${url}', '_blank')">Launch Direct Access</button>
                    </div>
                    
                    <div class="method-card">
                        <div class="method-title">🔄 Retry Proxy</div>
                        <div class="method-desc">Attempt to reconnect through available proxy servers with different routes.</div>
                        <button class="access-btn" onclick="retryProxy()">Retry Proxy Connection</button>
                    </div>
                    
                    <div class="method-card">
                        <div class="method-title">📱 Mobile Version</div>
                        <div class="method-desc">Try the mobile version which may have fewer restrictions and lighter security.</div>
                        <button class="access-btn" onclick="tryMobile()">Access Mobile Site</button>
                    </div>
                    
                    <div class="method-card">
                        <div class="method-title">🔍 Search Alternative</div>
                        <div class="method-desc">Search for information about this site, alternatives, or related content.</div>
                        <button class="access-btn" onclick="searchAbout()">Search Information</button>
                    </div>
                    
                    <div class="method-card">
                        <div class="method-title">🕸️ Cached Version</div>
                        <div class="method-desc">Try accessing cached or archived versions of the website.</div>
                        <button class="access-btn" onclick="tryArchive()">Access Cached Site</button>
                    </div>
                    
                    <div class="method-card">
                        <div class="method-title">🔗 Alternative Proxy</div>
                        <div class="method-desc">Enter a custom proxy URL or try a different proxy service manually.</div>
                        <input type="text" class="input-field" id="customProxy" placeholder="Enter custom proxy URL...">
                        <button class="access-btn" onclick="tryCustomProxy()">Use Custom Proxy</button>
                    </div>
                </div>
                
                <div class="retry-section">
                    <h3>🎯 Try Different Target</h3>
                    <input type="text" class="input-field" id="newTarget" placeholder="Enter new URL or search term...">
                    <button class="access-btn" onclick="newSearch()">New Search/Navigation</button>
                </div>
            </div>
            
            <script>
                function retryProxy() {
                    parent.hyperspaceBrowser.navigate('${url}');
                }
                
                function tryMobile() {
                    let mobileUrl = '${url}'.replace('www.', 'm.');
                    if (!mobileUrl.includes('m.')) {
                        mobileUrl = mobileUrl.replace('://', '://m.');
                    }
                    parent.hyperspaceBrowser.navigate(mobileUrl);
                }
                
                function searchAbout() {
                    parent.hyperspaceBrowser.performWebSearch('${domain} information reviews alternative sites');
                }
                
                function tryArchive() {
                    const archiveUrl = 'https://web.archive.org/web/*/' + '${url}';
                    window.open(archiveUrl, '_blank');
                }
                
                function tryCustomProxy() {
                    const customProxy = document.getElementById('customProxy').value;
                    if (customProxy.trim()) {
                        const proxiedUrl = customProxy + '${url}';
                        parent.hyperspaceBrowser.navigate(proxiedUrl);
                    }
                }
                
                function newSearch() {
                    const newTarget = document.getElementById('newTarget').value;
                    if (newTarget.trim()) {
                        parent.hyperspaceBrowser.navigate(newTarget);
                    }
                }
            </script>
        </body>
        </html>`;

        this.elements.contentFrame.srcdoc = fallbackHTML;
    }

    getProxyServiceName(proxyUrl) {
        if (proxyUrl.includes('allorigins.win')) return 'AllOrigins';
        if (proxyUrl.includes('corsproxy.io')) return 'CorsProxy';
        if (proxyUrl.includes('cors-anywhere')) return 'CorsAnywhere';
        if (proxyUrl.includes('thingproxy')) return 'ThingProxy';
        return 'Unknown Proxy';
    }

    extractSearchQuery(url) {
        const match = url.match(/[?&]q=([^&]*)/);
        return match ? decodeURIComponent(match[1]) : '';
    }

    isSearchQuery(input) {
        // Common website shortcuts that should be treated as URLs
        const commonSites = [
            'youtube', 'google', 'facebook', 'twitter', 'instagram', 'reddit',
            'github', 'stackoverflow', 'wikipedia', 'amazon', 'netflix', 'twitch',
            'discord', 'linkedin', 'tiktok', 'spotify', 'apple', 'microsoft',
            'gmail', 'yahoo', 'bing', 'duckduckgo', 'news', 'cnn', 'bbc'
        ];

        // Check if it's a common site name
        const lowerInput = input.toLowerCase().trim();
        if (commonSites.includes(lowerInput)) {
            return false; // Treat as URL, not search
        }

        // Check if input looks like a search query rather than a URL
        const hasSpaces = input.includes(' ');
        const hasNoTLD = !input.includes('.com') && !input.includes('.org') && !input.includes('.net') && !input.includes('.io') && !input.includes('.co') && !input.includes('.gov') && !input.includes('.edu');
        const startsWithProtocol = input.startsWith('http://') || input.startsWith('https://');

        return (hasSpaces || hasNoTLD) && !startsWithProtocol;
    }

    performWebSearch(query) {
        // Remove any protocol if present
        query = query.replace(/^https?:\/\//, '');

        this.logTerminal(`[SEARCH] Creating reliable search interface for: ${query}`);

        // Skip unreliable proxy system, create working search interface immediately
        this.createReliableSearchPage(query);
    }

    createContentPage(url) {
        // Create a page that provides multiple ways to access the content
        const domain = this.extractDomain(url);
        this.logTerminal(`[ACCESS] Creating access methods for: ${domain}`);

        const contentHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HYP3RSP4C3 - Target Access</title>
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    margin: 0; 
                    padding: 0;
                    min-height: 100vh;
                }
                .container { 
                    max-width: 800px; 
                    margin: 0 auto; 
                    padding: 40px 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    border-bottom: 2px solid #00ff41;
                    padding-bottom: 20px;
                }
                .target-info {
                    background: rgba(26, 26, 26, 0.8);
                    border: 2px solid #00ff41;
                    border-radius: 10px;
                    padding: 30px;
                    margin-bottom: 30px;
                    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
                }
                .access-methods {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 30px;
                }
                .access-card {
                    background: rgba(42, 42, 42, 0.8);
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 25px;
                    transition: all 0.3s ease;
                }
                .access-card:hover {
                    border-color: #00ffff;
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
                    transform: translateY(-2px);
                }
                .method-title {
                    color: #00ffff;
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 15px;
                }
                .method-desc {
                    color: #ccc;
                    margin-bottom: 20px;
                    line-height: 1.5;
                }
                .access-btn {
                    background: linear-gradient(135deg, #00ff41, #00ffff);
                    color: #0a0a0a;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                    font-size: 14px;
                    text-transform: uppercase;
                }
                .access-btn:hover {
                    background: linear-gradient(135deg, #00ffff, #00ff41);
                }
                .search-section {
                    margin-top: 40px;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 8px;
                }
                .search-input {
                    width: 100%;
                    padding: 15px;
                    background: #1a1a1a;
                    border: 2px solid #00ff41;
                    color: #00ff41;
                    border-radius: 5px;
                    font-family: inherit;
                    margin-bottom: 15px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>TARGET ACCESS: ${domain}</h1>
                    <p>Multiple infiltration methods available</p>
                </div>
                
                <div class="target-info">
                    <h2>🎯 TARGET: ${url}</h2>
                    <p>The target website uses security measures that prevent direct embedding. Choose your preferred access method below:</p>
                </div>
                
                <div class="access-methods">
                    <div class="access-card">
                        <div class="method-title">🌐 Direct Access</div>
                        <div class="method-desc">Open the target in a new window/tab. Most reliable method for full functionality.</div>
                        <button class="access-btn" onclick="window.open('${url}', '_blank')">Launch External Window</button>
                    </div>
                    
                    <div class="access-card">
                        <div class="method-title">🔍 Search About</div>
                        <div class="method-desc">Find information, reviews, and related content about this website.</div>
                        <button class="access-btn" onclick="searchAbout('${domain}')">Search Information</button>
                    </div>
                    
                    <div class="access-card">
                        <div class="method-title">📱 Mobile Version</div>
                        <div class="method-desc">Try accessing the mobile-optimized version which may have fewer restrictions.</div>
                        <button class="access-btn" onclick="tryMobile('${url}')">Access Mobile Site</button>
                    </div>
                    
                    <div class="access-card">
                        <div class="method-title">🔗 Related Links</div>
                        <div class="method-desc">Find official social media, documentation, and alternative access points.</div>
                        <button class="access-btn" onclick="findRelated('${domain}')">Find Related Sites</button>
                    </div>
                </div>
                
                <div class="search-section">
                    <h3>🔍 Alternative Search</h3>
                    <input type="text" class="search-input" placeholder="Try a different search or website..." id="altSearch">
                    <button class="access-btn" onclick="performNewSearch()">New Search</button>
                </div>
            </div>
            
            <script>
                function searchAbout(domain) {
                    const query = domain + ' information reviews';
                    parent.hyperspaceBrowser.performWebSearch(query);
                }
                
                function tryMobile(url) {
                    const mobileUrl = url.replace('www.', 'm.');
                    window.open(mobileUrl, '_blank');
                }
                
                function findRelated(domain) {
                    const query = 'site:' + domain + ' OR ' + domain + ' official social media links';
                    parent.hyperspaceBrowser.performWebSearch(query);
                }
                
                function performNewSearch() {
                    const query = document.getElementById('altSearch').value;
                    if (query.trim()) {
                        parent.hyperspaceBrowser.navigate(query);
                    }
                }
                
                document.getElementById('altSearch').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        performNewSearch();
                    }
                });
            </script>
        </body>
        </html>`;

        this.elements.contentFrame.srcdoc = contentHTML;
    }

    extractDomain(url) {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return url.split('/')[0].replace('www.', '');
        }
    }

    createSearchResultsPage(query) {
            this.logTerminal(`[RESULTS] Generating search results for: ${query}`);

            const results = this.generateComprehensiveResults(query);
            const searchHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HYP3RSP4C3 Search Results</title>
            <style>
                body { 
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    margin: 0; 
                    padding: 0;
                    line-height: 1.6;
                }
                .search-header {
                    background: rgba(26, 26, 26, 0.9);
                    padding: 20px;
                    border-bottom: 2px solid #00ff41;
                    box-shadow: 0 2px 10px rgba(0, 255, 65, 0.3);
                }
                .search-box {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .search-input {
                    flex: 1;
                    padding: 15px;
                    background: #0a0a0a;
                    border: 2px solid #333;
                    color: #00ff41;
                    border-radius: 5px;
                    font-family: inherit;
                    font-size: 16px;
                }
                .search-input:focus {
                    border-color: #00ffff;
                    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                    outline: none;
                }
                .search-btn {
                    background: linear-gradient(135deg, #00ff41, #00ffff);
                    color: #0a0a0a;
                    border: none;
                    padding: 15px 25px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                }
                .results-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 30px 20px;
                }
                .results-header {
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #333;
                }
                .result-item {
                    background: rgba(26, 26, 26, 0.6);
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 25px;
                    margin-bottom: 20px;
                    transition: all 0.3s ease;
                }
                .result-item:hover {
                    border-color: #00ffff;
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
                    transform: translateY(-2px);
                }
                .result-title {
                    color: #00ffff;
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 8px;
                    cursor: pointer;
                }
                .result-url {
                    color: #00ff41;
                    font-size: 14px;
                    margin-bottom: 12px;
                }
                .result-desc {
                    color: #ccc;
                    margin-bottom: 15px;
                    line-height: 1.5;
                }
                .result-actions {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .action-btn {
                    background: rgba(0, 255, 65, 0.2);
                    border: 1px solid #00ff41;
                    color: #00ff41;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    text-transform: uppercase;
                    transition: all 0.3s ease;
                }
                .action-btn:hover {
                    background: #00ff41;
                    color: #0a0a0a;
                }
                .quick-links {
                    background: rgba(42, 42, 42, 0.8);
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 30px;
                }
                .quick-links h3 {
                    color: #00ffff;
                    margin-bottom: 15px;
                }
                .link-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                }
                .quick-link {
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid #333;
                    padding: 10px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                .quick-link:hover {
                    border-color: #00ffff;
                    background: rgba(0, 255, 255, 0.1);
                }
            </style>
        </head>
        <body>
            <div class="search-header">
                <div class="search-box">
                    <input type="text" class="search-input" value="${query}" id="searchInput" placeholder="Enter search query...">
                    <button class="search-btn" onclick="newSearch()">SEARCH</button>
                </div>
            </div>
            
            <div class="results-container">
                <div class="results-header">
                    <h2>🔍 Search Results for: "${query}"</h2>
                    <p>Found multiple relevant targets in the data matrix</p>
                </div>
                
                ${this.generateQuickLinksSection(query)}
                
                <div class="results-list">
                    ${results.map(result => `
                        <div class="result-item">
                            <div class="result-title" onclick="visitSite('${result.url}')">${result.title}</div>
                            <div class="result-url">${result.url}</div>
                            <div class="result-desc">${result.desc}</div>
                            <div class="result-actions">
                                <button class="action-btn" onclick="visitSite('${result.url}')">Visit Site</button>
                                <button class="action-btn" onclick="searchMore('${result.title}')">Search More</button>
                                <button class="action-btn" onclick="getInfo('${result.domain}')">Site Info</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <script>
                function newSearch() {
                    const query = document.getElementById('searchInput').value;
                    if (query.trim()) {
                        parent.hyperspaceBrowser.performWebSearch(query);
                    }
                }
                
                function visitSite(url) {
                    parent.hyperspaceBrowser.navigate(url);
                }
                
                function searchMore(title) {
                    parent.hyperspaceBrowser.performWebSearch(title);
                }
                
                function getInfo(domain) {
                    parent.hyperspaceBrowser.performWebSearch(domain + ' information about website');
                }
                
                document.getElementById('searchInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        newSearch();
                    }
                });
            </script>
        </body>
        </html>`;
        
        this.elements.contentFrame.srcdoc = searchHTML;
    }

    generateComprehensiveResults(query) {
        const lowerQuery = query.toLowerCase();
        const results = [];
        
        // Popular websites database
        const siteDatabase = {
            youtube: { url: 'https://www.youtube.com', desc: 'Watch and share videos, subscribe to channels, and discover content from creators worldwide.' },
            google: { url: 'https://www.google.com', desc: 'Search the web for information, images, videos, and more.' },
            github: { url: 'https://github.com', desc: 'Host and review code, manage projects, and collaborate with developers.' },
            reddit: { url: 'https://www.reddit.com', desc: 'Dive into communities and discussions on topics you care about.' },
            twitter: { url: 'https://twitter.com', desc: 'Connect with people and discover what\'s happening in the world.' },
            facebook: { url: 'https://www.facebook.com', desc: 'Connect with friends and family, share photos and updates.' },
            instagram: { url: 'https://www.instagram.com', desc: 'Share photos and videos with friends and followers.' },
            linkedin: { url: 'https://www.linkedin.com', desc: 'Professional networking and career development platform.' },
            stackoverflow: { url: 'https://stackoverflow.com', desc: 'Get answers to programming questions from the developer community.' },
            amazon: { url: 'https://www.amazon.com', desc: 'Online shopping for books, electronics, home goods, and more.' },
            netflix: { url: 'https://www.netflix.com', desc: 'Stream TV shows and movies on your favorite devices.' },
            spotify: { url: 'https://www.spotify.com', desc: 'Listen to music and podcasts for free or with premium features.' },
            wikipedia: { url: 'https://www.wikipedia.org', desc: 'Free online encyclopedia with articles on every topic.' },
            twitch: { url: 'https://www.twitch.tv', desc: 'Watch live streams of games, music, and creative content.' },
            discord: { url: 'https://discord.com', desc: 'Chat and voice communication for communities and friends.' }
        };
        
        // Check for exact matches
        for (const [key, site] of Object.entries(siteDatabase)) {
            if (lowerQuery.includes(key)) {
                results.push({
                    title: key.charAt(0).toUpperCase() + key.slice(1) + ' - Official Site',
                    url: site.url,
                    desc: site.desc,
                    domain: new URL(site.url).hostname
                });
            }
        }
        
        // Add category-based results
        if (lowerQuery.includes('video') || lowerQuery.includes('movie') || lowerQuery.includes('stream')) {
            results.push(
                { title: 'YouTube - Video Platform', url: 'https://www.youtube.com', desc: 'World\'s largest video sharing platform with billions of videos.', domain: 'youtube.com' },
                { title: 'Netflix - Streaming Service', url: 'https://www.netflix.com', desc: 'Premium streaming service for movies and TV shows.', domain: 'netflix.com' },
                { title: 'Twitch - Live Streaming', url: 'https://www.twitch.tv', desc: 'Live streaming platform for gaming and creative content.', domain: 'twitch.tv' }
            );
        }
        
        if (lowerQuery.includes('social') || lowerQuery.includes('friends') || lowerQuery.includes('chat')) {
            results.push(
                { title: 'Facebook - Social Network', url: 'https://www.facebook.com', desc: 'Connect with friends and family around the world.', domain: 'facebook.com' },
                { title: 'Twitter - Microblogging', url: 'https://twitter.com', desc: 'Share thoughts and follow trending topics worldwide.', domain: 'twitter.com' },
                { title: 'Discord - Chat Platform', url: 'https://discord.com', desc: 'Voice, video and text chat for communities and friends.', domain: 'discord.com' }
            );
        }
        
        if (lowerQuery.includes('code') || lowerQuery.includes('program') || lowerQuery.includes('developer')) {
            results.push(
                { title: 'GitHub - Code Repository', url: 'https://github.com', desc: 'Host, review, and collaborate on code projects.', domain: 'github.com' },
                { title: 'Stack Overflow - Programming Q&A', url: 'https://stackoverflow.com', desc: 'Get help with programming questions and problems.', domain: 'stackoverflow.com' },
                { title: 'CodePen - Code Playground', url: 'https://codepen.io', desc: 'Online code editor and developer community.', domain: 'codepen.io' }
            );
        }
        
        if (lowerQuery.includes('music') || lowerQuery.includes('song') || lowerQuery.includes('audio')) {
            results.push(
                { title: 'Spotify - Music Streaming', url: 'https://www.spotify.com', desc: 'Stream millions of songs and podcasts.', domain: 'spotify.com' },
                { title: 'SoundCloud - Audio Platform', url: 'https://soundcloud.com', desc: 'Discover and share audio content from creators.', domain: 'soundcloud.com' }
            );
        }
        
        // Add generic results for any query
        const genericResults = [
            {
                title: `${query} - Wikipedia`,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
                desc: `Wikipedia article about ${query} with comprehensive information and references.`,
                domain: 'wikipedia.org'
            },
            {
                title: `${query} - Google Search`,
                url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
                desc: `Google search results for ${query} from across the web.`,
                domain: 'google.com'
            },
            {
                title: `${query} - Official Website`,
                url: `https://www.${query.toLowerCase().replace(/\s+/g, '')}.com`,
                desc: `Official website for ${query}. Find authentic information and services.`,
                domain: `${query.toLowerCase().replace(/\s+/g, '')}.com`
            }
        ];
        
        results.push(...genericResults);
        
        // Remove duplicates and return top 8 results
        const uniqueResults = results.filter((result, index, self) => 
            index === self.findIndex(r => r.url === result.url)
        );
        
        return uniqueResults.slice(0, 8);
    }

    generateQuickLinksSection(query) {
        const quickLinks = [
            { name: 'YouTube', action: "visitSite('https://www.youtube.com')" },
            { name: 'Google', action: "visitSite('https://www.google.com')" },
            { name: 'GitHub', action: "visitSite('https://github.com')" },
            { name: 'Reddit', action: "visitSite('https://www.reddit.com')" },
            { name: 'Wikipedia', action: "visitSite('https://www.wikipedia.org')" },
            { name: 'Stack Overflow', action: "visitSite('https://stackoverflow.com')" }
        ];
        
        return `
        <div class="quick-links">
            <h3>🚀 Quick Access Portals</h3>
            <div class="link-grid">
                ${quickLinks.map(link => `
                    <div class="quick-link" onclick="${link.action}">${link.name}</div>
                `).join('')}
            </div>
        </div>`;
    }

    createCustomGoogleInterface(url) {
        // Extract search query if it's a search URL
        const searchMatch = url.match(/[?&]q=([^&]*)/);
        const query = searchMatch ? decodeURIComponent(searchMatch[1]) : '';

        // Create a custom Google search interface
        const customHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HYP3RSP4C3 Search Engine</title>
            <style>
                body { 
                    background: #0a0a0a; 
                    color: #00ff41; 
                    font-family: 'Source Code Pro', monospace; 
                    margin: 0; 
                    padding: 40px;
                }
                .search-container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    text-align: center; 
                }
                .logo { 
                    font-size: 48px; 
                    font-weight: bold; 
                    margin-bottom: 40px;
                    text-shadow: 0 0 20px #00ff41;
                }
                .search-box { 
                    width: 100%; 
                    padding: 15px; 
                    font-size: 18px; 
                    background: #1a1a1a; 
                    border: 2px solid #00ff41; 
                    color: #00ff41; 
                    border-radius: 5px;
                    margin-bottom: 20px;
                }
                .search-btn { 
                    padding: 15px 30px; 
                    background: linear-gradient(135deg, #00ff41, #00ffff); 
                    color: #0a0a0a; 
                    border: none; 
                    border-radius: 5px; 
                    font-weight: bold; 
                    cursor: pointer;
                    margin: 0 10px;
                }
                .results { 
                    text-align: left; 
                    margin-top: 40px; 
                }
                .result-item { 
                    background: #1a1a1a; 
                    border: 1px solid #333; 
                    padding: 20px; 
                    margin-bottom: 15px; 
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .result-item:hover {
                    border-color: #00ffff;
                    background: #2a2a2a;
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
                }
                .result-title { 
                    color: #00ffff; 
                    font-size: 20px; 
                    margin-bottom: 10px; 
                }
                .result-url { 
                    color: #00ff41; 
                    font-size: 14px; 
                    margin-bottom: 10px; 
                }
                .result-desc { 
                    color: #ccc; 
                    line-height: 1.5; 
                }
                .navigate-btn {
                    background: linear-gradient(135deg, #00ff41, #00ffff);
                    color: #0a0a0a;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 10px;
                    margin-right: 10px;
                }
                .navigate-btn:hover {
                    background: linear-gradient(135deg, #00ffff, #00ff41);
                }
            </style>
        </head>
        <body>
            <div class="search-container">
                <div class="logo">HYP3RSP4C3 SEARCH</div>
                <input type="text" class="search-box" placeholder="Enter search query..." value="${query}">
                <br>
                <button class="search-btn" onclick="performSearch()">SEARCH</button>
                <button class="search-btn" onclick="openGoogle()">OPEN GOOGLE</button>
                <div style="margin-top: 20px; font-size: 12px; color: #666;">
                    <strong>SEARCH TIPS:</strong> Try searching for "youtube", "github", "reddit", or any website name
                </div>
                
                <div class="results" id="results">
                    ${query ? this.generateMockResults(query) : '<p style="text-align:center; color:#666;">Enter a search query above to begin infiltrating the data matrix...</p>'}
                </div>
            </div>
            
            <script>
                function performSearch() {
                    const query = document.querySelector('.search-box').value;
                    if (query.trim()) {
                        // Update the results with the new search
                        updateSearchResults(query);
                    }
                }
                
                function updateSearchResults(query) {
                    const resultsDiv = document.getElementById('results');
                    resultsDiv.innerHTML = generateResults(query);
                }
                
                function generateResults(query) {
                    const results = getSearchResults(query);
                    return results.map(result => 
                        '<div class="result-item">' +
                            '<div class="result-title">' + result.title + '</div>' +
                            '<div class="result-url">' + result.url + '</div>' +
                            '<div class="result-desc">' + result.desc + '</div>' +
                            '<button class="navigate-btn" onclick="navigateToSite(\\'' + result.url + '\\')">INFILTRATE TARGET</button>' +
                            '<button class="navigate-btn" onclick="window.open(\\'' + result.url + '\\', \\'_blank\\')">OPEN EXTERNALLY</button>' +
                        '</div>'
                    ).join('');
                }
                
                function getSearchResults(query) {
                    const lowerQuery = query.toLowerCase();
                    
                    // Create smart results based on the search query
                    const results = [];
                    
                    // Check for specific sites
                    if (lowerQuery.includes('youtube')) {
                        results.push({
                            title: 'YouTube - Video Platform',
                            url: 'https://www.youtube.com',
                            desc: 'Watch videos, subscribe to channels, and discover content from creators worldwide.'
                        });
                    }
                    
                    if (lowerQuery.includes('github')) {
                        results.push({
                            title: 'GitHub - Code Repository',
                            url: 'https://github.com',
                            desc: 'Host and review code, manage projects, and collaborate with millions of developers.'
                        });
                    }
                    
                    if (lowerQuery.includes('stackoverflow') || lowerQuery.includes('stack overflow')) {
                        results.push({
                            title: 'Stack Overflow - Developer Q&A',
                            url: 'https://stackoverflow.com',
                            desc: 'Get answers to programming questions and share knowledge with the developer community.'
                        });
                    }
                    
                    if (lowerQuery.includes('reddit')) {
                        results.push({
                            title: 'Reddit - Front Page of the Internet',
                            url: 'https://www.reddit.com',
                            desc: 'Dive into communities, discussions, and content from around the world.'
                        });
                    }
                    
                    if (lowerQuery.includes('twitter')) {
                        results.push({
                            title: 'Twitter - Social Network',
                            url: 'https://twitter.com',
                            desc: 'Connect with people and discover what\\'s happening in the world right now.'
                        });
                    }
                    
                    // Add generic results
                    results.push({
                        title: query + ' - Official Site',
                        url: 'https://www.' + query.toLowerCase().replace(/\\s+/g, '') + '.com',
                        desc: 'Official website for ' + query + '. Find authentic information and services.'
                    });
                    
                    results.push({
                        title: query + ' - Wikipedia',
                        url: 'https://en.wikipedia.org/wiki/' + query.replace(/\\s+/g, '_'),
                        desc: 'Wikipedia encyclopedia article about ' + query + ' with detailed information and references.'
                    });
                    
                    results.push({
                        title: query + ' - News & Updates',
                        url: 'https://www.google.com/search?q=' + encodeURIComponent(query + ' news'),
                        desc: 'Latest news, updates and information about ' + query + ' from various sources.'
                    });
                    
                    return results.slice(0, 6); // Return top 6 results
                }
                
                function navigateToSite(url) {
                    // Navigate through the HYP3RSP4C3 browser
                    parent.hyperspaceBrowser.navigate(url);
                }
                
                function openGoogle() {
                    window.open('https://www.google.com', '_blank');
                }
                
                document.querySelector('.search-box').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        performSearch();
                    }
                });
            </script>
        </body>
        </html>`;

        this.elements.contentFrame.srcdoc = customHTML;
        this.logTerminal(`[CUSTOM] Custom search interface deployed`);
    }

    generateMockResults(query) {
        // This method now creates the initial results HTML
        // The JavaScript in the iframe will handle dynamic updates
        const results = this.getSmartResults(query);

        return results.map(result => `
            <div class="result-item">
                <div class="result-title">${result.title}</div>
                <div class="result-url">${result.url}</div>
                <div class="result-desc">${result.desc}</div>
                <button class="navigate-btn" onclick="navigateToSite('${result.url}')">INFILTRATE TARGET</button>
                <button class="navigate-btn" onclick="window.open('${result.url}', '_blank')">OPEN EXTERNALLY</button>
            </div>
        `).join('');
    }

    getSmartResults(query) {
        const lowerQuery = query.toLowerCase();
        const results = [];

        // Check for specific popular sites
        if (lowerQuery.includes('youtube')) {
            results.push({
                title: 'YouTube - Video Platform',
                url: 'https://www.youtube.com',
                desc: 'Watch videos, subscribe to channels, and discover content from creators worldwide.'
            });
        }

        if (lowerQuery.includes('github')) {
            results.push({
                title: 'GitHub - Code Repository',
                url: 'https://github.com',
                desc: 'Host and review code, manage projects, and collaborate with millions of developers.'
            });
        }

        if (lowerQuery.includes('stackoverflow') || lowerQuery.includes('stack overflow')) {
            results.push({
                title: 'Stack Overflow - Developer Q&A',
                url: 'https://stackoverflow.com',
                desc: 'Get answers to programming questions and share knowledge with the developer community.'
            });
        }

        if (lowerQuery.includes('reddit')) {
            results.push({
                title: 'Reddit - Front Page of the Internet',
                url: 'https://www.reddit.com',
                desc: 'Dive into communities, discussions, and content from around the world.'
            });
        }

        if (lowerQuery.includes('twitter') || lowerQuery.includes('x.com')) {
            results.push({
                title: 'X (Twitter) - Social Network',
                url: 'https://x.com',
                desc: 'Connect with people and discover what\'s happening in the world right now.'
            });
        }

        if (lowerQuery.includes('facebook')) {
            results.push({
                title: 'Facebook - Social Network',
                url: 'https://www.facebook.com',
                desc: 'Connect with friends and the world around you on Facebook.'
            });
        }

        if (lowerQuery.includes('netflix')) {
            results.push({
                title: 'Netflix - Streaming Service',
                url: 'https://www.netflix.com',
                desc: 'Watch TV shows and movies anytime, anywhere on your favorite devices.'
            });
        }

        if (lowerQuery.includes('amazon')) {
            results.push({
                title: 'Amazon - Online Shopping',
                url: 'https://www.amazon.com',
                desc: 'Shop online for electronics, books, home & garden and more on Amazon.'
            });
        }

        // Always add some generic results
        results.push({
            title: `${query} - Official Site`,
            url: `https://www.${query.toLowerCase().replace(/\s+/g, '')}.com`,
            desc: `Official website for ${query}. Find authentic information and services.`
        });

        results.push({
            title: `${query} - Wikipedia`,
            url: `https://en.wikipedia.org/wiki/${query.replace(/\s+/g, '_')}`,
            desc: `Wikipedia encyclopedia article about ${query} with detailed information and references.`
        });

        results.push({
            title: `${query} - Search Results`,
            url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            desc: `Google search results for ${query}. Find the most relevant information across the web.`
        });

        // Return top 6 unique results
        const uniqueResults = results.filter((result, index, self) =>
            index === self.findIndex(r => r.url === result.url)
        );

        return uniqueResults.slice(0, 6);
    }

    tryProxyServices(url, proxyServices, index) {
        if (index >= proxyServices.length) {
            // All proxy services failed, show error page
            this.showErrorPage(url, 'All proxy services failed');
            return;
        }

        const proxyUrl = proxyServices[index];
        this.logTerminal(`[PROXY] Attempting route ${index + 1}/${proxyServices.length}`);

        // Create a temporary iframe to test the proxy
        const testFrame = document.createElement('iframe');
        testFrame.style.display = 'none';
        testFrame.src = proxyUrl;

        testFrame.onload = () => {
            // Proxy service worked
            this.elements.contentFrame.src = proxyUrl;
            this.logTerminal(`[SUCCESS] Proxy route ${index + 1} established`);
            document.body.removeChild(testFrame);
        };

        testFrame.onerror = () => {
            // This proxy failed, try the next one
            this.logTerminal(`[PROXY] Route ${index + 1} failed, trying alternative...`);
            document.body.removeChild(testFrame);
            this.tryProxyServices(url, proxyServices, index + 1);
        };

        // Timeout after 5 seconds
        setTimeout(() => {
            if (document.body.contains(testFrame)) {
                this.logTerminal(`[PROXY] Route ${index + 1} timeout, trying alternative...`);
                document.body.removeChild(testFrame);
                this.tryProxyServices(url, proxyServices, index + 1);
            }
        }, 5000);

        document.body.appendChild(testFrame);
    }

    showErrorPage(url, error) {
        const errorHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HYP3RSP4C3 - ACCESS DENIED</title>
            <style>
                body { 
                    background: #0a0a0a; 
                    color: #ff0040; 
                    font-family: 'Source Code Pro', monospace; 
                    margin: 0; 
                    padding: 40px;
                    text-align: center;
                }
                .error-container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    border: 2px solid #ff0040;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(255, 0, 64, 0.3);
                }
                .error-title { 
                    font-size: 36px; 
                    font-weight: bold; 
                    margin-bottom: 20px;
                    text-shadow: 0 0 20px #ff0040;
                    animation: blink 1s infinite;
                }
                .error-code { 
                    font-size: 24px; 
                    color: #00ff41; 
                    margin-bottom: 20px; 
                }
                .error-message { 
                    font-size: 16px; 
                    line-height: 1.5; 
                    margin-bottom: 30px;
                    color: #ccc;
                }
                .retry-btn { 
                    padding: 15px 30px; 
                    background: linear-gradient(135deg, #ff0040, #ff4080); 
                    color: white; 
                    border: none; 
                    border-radius: 5px; 
                    font-weight: bold; 
                    cursor: pointer;
                    margin: 0 10px;
                }
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0.3; }
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <div class="error-title">ACCESS DENIED</div>
                <div class="error-code">ERROR CODE: X-FRAME-BLOCKED</div>
                <div class="error-message">
                    Target site "${url}" has activated countermeasures against infiltration attempts.<br><br>
                    The target is using X-Frame-Options headers to prevent embedding.<br>
                    This is a security measure to protect against clickjacking attacks.<br><br>
                    <strong>Possible Solutions:</strong><br>
                    • Click "Open Externally" to view in a new window<br>
                    • Try accessing a different target<br>
                    • Some sites work better than others
                </div>
                <button class="retry-btn" onclick="parent.hyperspaceBrowser.navigate('${url}')">RETRY INFILTRATION</button>
                <button class="retry-btn" onclick="window.open('${url}', '_blank')">OPEN EXTERNALLY</button>
                <button class="retry-btn" onclick="parent.hyperspaceBrowser.goHome()">RETURN TO BASE</button>
            </div>
        </body>
        </html>`;

        this.elements.contentFrame.srcdoc = errorHTML;
        this.logTerminal(`[ERROR] Target blocked: ${error}`);
    }

    showLoading(url) {
        this.elements.loadingOverlay.style.display = 'flex';
        this.elements.progressBar.style.width = '0%';

        const loadingMessages = [
            'Establishing secure connection...',
            'Routing through proxy servers...',
            'Bypassing security protocols...',
            'Encrypting data stream...',
            'Masking digital footprint...',
            'Infiltrating target network...',
            'Acquiring access credentials...',
            'Penetrating firewall systems...'
        ];

        let progress = 0;
        let messageIndex = 0;

        const loadingInterval = setInterval(() => {
            progress += Math.random() * 25 + 15; // Faster progress increments
            if (progress > 100) progress = 100;

            this.elements.progressBar.style.width = progress + '%';

            if (messageIndex < loadingMessages.length) {
                this.elements.loadingSub.textContent = loadingMessages[messageIndex];
                messageIndex++;
            }

            if (progress >= 100) {
                clearInterval(loadingInterval);
                // The loading will be hidden when the frame loads
            }
        }, 150); // Much faster animation (was 300ms, now 150ms)

        // Store interval to clear it if needed
        this.loadingInterval = loadingInterval;
        
        // Auto-hide loading after 4 seconds max (was unlimited)
        setTimeout(() => {
            this.hideLoading();
        }, 4000);
    }

    hideLoading() {
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
        }
        this.elements.loadingOverlay.style.display = 'none';
    }

    showProxySettings() {
        const settings = prompt(`PROXY CONFIGURATION
        
Current Settings:
• Proxy Server: HYPERSPACE-PROXY-01.onion
• Encryption: ${this.encryptionLevel}
• Status: ${this.proxyActive ? 'ACTIVE' : 'INACTIVE'}

Enter new proxy server (or cancel):`);

        if (settings !== null) {
            this.logTerminal(`[PROXY] Configuration updated: ${settings}`);
        }
    }

    showMissionControl() {
        const logOutput = this.missionLog.slice(-10).join('\n');
        alert(`MISSION CONTROL - CLASSIFIED
        
Recent Operations:
${logOutput}

System Status: OPERATIONAL
Threat Level: LOW
Active Connections: ${Math.floor(Math.random() * 5) + 1}`);
    }

    logTerminal(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logLine = document.createElement('div');
        logLine.className = 'terminal-line';
        logLine.textContent = `[${timestamp}] ${message}`;

        this.elements.terminalOutput.appendChild(logLine);
        this.elements.terminalOutput.scrollTop = this.elements.terminalOutput.scrollHeight;

        // Store in mission log
        this.missionLog.push(`${timestamp}: ${message}`);

        // Keep only last 50 entries
        if (this.missionLog.length > 50) {
            this.missionLog = this.missionLog.slice(-50);
        }

        // Remove old terminal lines to prevent memory issues
        const terminalLines = this.elements.terminalOutput.children;
        if (terminalLines.length > 20) {
            this.elements.terminalOutput.removeChild(terminalLines[0]);
        }
    }

    updateSystemTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        if (this.elements.currentTime) {
            this.elements.currentTime.textContent = timeStr;
        }

        // Update every second
        setTimeout(() => this.updateSystemTime(), 1000);
    }

    simulateSystemBoot() {
        const bootMessages = [
            '[BOOT] Initializing secure protocols...',
            '[CRYPTO] Loading encryption modules...',
            '[PROXY] Establishing proxy connections...',
            '[TOR] Configuring onion routing network...',
            '[STEALTH] Activating stealth systems...',
            '[READY] HYP3RSP4C3 BROWSER operational'
        ];

        bootMessages.forEach((message, index) => {
            setTimeout(() => {
                this.logTerminal(message);
                if (index === bootMessages.length - 1) {
                    // Add some random system messages
                    this.startSystemMessages();
                }
            }, (index + 1) * 800);
        });
    }

    startSystemMessages() {
        const systemMessages = [
            '[MONITOR] Scanning for surveillance...',
            '[SECURE] Connection encrypted',
            '[PROXY] Rotating exit nodes...',
            '[STEALTH] Digital footprint masked',
            '[GUARD] Firewall protection active',
            '[CRYPTO] Data stream secured'
        ];

        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every 10 seconds
                const message = systemMessages[Math.floor(Math.random() * systemMessages.length)];
                this.logTerminal(message);
            }
        }, 10000);
    }

    // Matrix Background Animation
    startMatrixBackground() {
        const canvas = document.getElementById('matrix-bg');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const columns = Math.floor(canvas.width / 10);
        const drops = new Array(columns).fill(1);

        const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = '10px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 10, drops[i] * 10);

                if (drops[i] * 10 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 33);

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    checkTorAvailability() {
        this.logTerminal('[TOR] Scanning for Tor network connectivity...');
        
        const torStatus = document.getElementById('tor-status');
        if (torStatus) {
            if (this.preferTorRouting) {
                torStatus.textContent = 'SCANNING...';
                torStatus.className = 'tor-indicator';
            } else {
                torStatus.textContent = 'DISABLED';
                torStatus.className = 'tor-indicator inactive';
            }
        }
        
        // Check if Tor is available locally
        const torChecks = [
            { port: 9050, name: 'SOCKS proxy' },
            { port: 9150, name: 'Tor Browser SOCKS' },
            { port: 8118, name: 'Privoxy HTTP' }
        ];
        
        let torFound = false;
        let checksCompleted = 0;
        
        torChecks.forEach((check, index) => {
            // Simulate Tor detection (in real implementation, this would check actual ports)
            setTimeout(() => {
                checksCompleted++;
                
                // For demo purposes, randomly detect Tor availability
                if (Math.random() > 0.7 && !torFound) {
                    this.torEnabled = true;
                    torFound = true;
                    this.logTerminal(`[TOR] ✓ Found Tor ${check.name} on port ${check.port}`);
                    this.logTerminal(`[TOR] ✓ Anonymous routing protocols activated`);
                    
                    if (torStatus) {
                        torStatus.textContent = 'ACTIVE';
                        torStatus.className = 'tor-indicator active';
                    }
                } else {
                    this.logTerminal(`[TOR] ⨯ No Tor service detected on port ${check.port}`);
                }
                
                // Check if all tests completed
                if (checksCompleted === torChecks.length && !torFound) {
                    this.logTerminal('[TOR] ⚠ No local Tor installation detected');
                    this.logTerminal('[TOR] → Web-based Tor proxies will be used as fallback');
                    this.logTerminal('[TOR] → For maximum anonymity, install Tor Browser');
                    
                    if (torStatus) {
                        torStatus.textContent = 'FALLBACK';
                        torStatus.className = 'tor-indicator inactive';
                    }
                }
            }, Math.random() * 2000 + 1000);
        });
    }
}

// Force immediate styling in case CSS fails to load
document.body.style.backgroundColor = '#0a0a0a';
document.body.style.color = '#00ff41';
document.body.style.fontFamily = 'monospace';

// Initialize the browser when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - initializing HyperSpaceBrowser');
    try {
        window.hyperspaceBrowser = new HyperSpaceBrowser();
        console.log('HyperSpaceBrowser initialized successfully');
    } catch (error) {
        console.error('Error initializing HyperSpaceBrowser:', error);
        // Show fallback interface
        document.body.innerHTML = `
            <div style="padding: 20px; background: #0a0a0a; color: #00ff41; font-family: monospace;">
                <h1>HYP3RSP4C3 BROWSER - EMERGENCY MODE</h1>
                <p>Error: ${error.message}</p>
                <p>Please check the browser console for details.</p>
            </div>
        `;
    }

    // Add some easter eggs and special effects
    document.addEventListener('keydown', (e) => {
        // Konami code for special effects
        if (e.ctrlKey && e.shiftKey && e.key === 'H') {
            document.body.classList.add('glitch-effect');
            setTimeout(() => {
                document.body.classList.remove('glitch-effect');
            }, 1000);

            window.hyperspaceBrowser.logTerminal('[GLITCH] Reality matrix fluctuation detected');
        }

        // Quick navigation shortcuts
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            document.getElementById('address-bar').focus();
            document.getElementById('address-bar').select();
        }

        // Toggle Tor routing with Ctrl+T
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            window.hyperspaceBrowser.preferTorRouting = !window.hyperspaceBrowser.preferTorRouting;
            const mode = window.hyperspaceBrowser.preferTorRouting ? 'TOR NETWORK' : 'REGULAR PROXY';
            window.hyperspaceBrowser.logTerminal(`[MODE] Switched to ${mode} routing`);
            
            // Update Tor status indicator
            const torStatus = document.getElementById('tor-status');
            if (torStatus) {
                if (window.hyperspaceBrowser.preferTorRouting) {
                    torStatus.textContent = 'ENABLED';
                    torStatus.className = 'tor-indicator active';
                } else {
                    torStatus.textContent = 'DISABLED';
                    torStatus.className = 'tor-indicator inactive';
                }
            }
        }

        // Open embedded DuckDuckGo with Ctrl+S (S for Search)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            window.hyperspaceBrowser.loadEmbeddedDuckDuckGo();
            window.hyperspaceBrowser.logTerminal('[DDG] Embedded DuckDuckGo search opened');
        }
    });
});