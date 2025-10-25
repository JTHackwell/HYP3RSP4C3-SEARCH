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

        this.initializeSystem();
        this.bindEvents();
        this.startMatrixBackground();
        this.updateSystemTime();
        this.simulateSystemBoot();
    }

    initializeSystem() {
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

        // Simulate proxy routing delay
        setTimeout(() => {
            try {
                // Use proxy service to bypass CORS and X-Frame-Options restrictions
                this.loadThroughProxy(url);
            } catch (error) {
                this.logTerminal(`[ERROR] Infiltration failed: ${error.message}`);
                this.hideLoading();
            }
        }, Math.random() * 2000 + 1000);
    }

    sanitizeUrl(url) {
        // Add protocol if missing
        if (!url.match(/^https?:\/\//)) {
            url = 'https://' + url;
        }

        try {
            new URL(url);
            return url;
        } catch {
            // If URL is invalid, try as search query
            return `https://www.google.com/search?q=${encodeURIComponent(url)}`;
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
        // List of proxy services to try (in order of preference)
        const proxyServices = [
            // AllOrigins - Good for most sites
            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
            // CORS Anywhere (if available)
            `https://cors-anywhere.herokuapp.com/${url}`,
            // ThingProxy
            `https://thingproxy.freeboard.io/fetch/${url}`
        ];

        // Special handling for common sites
        if (url.includes('google.com')) {
            // For Google, create a custom search interface
            this.createCustomGoogleInterface(url);
            return;
        }

        if (url.includes('github.com')) {
            // GitHub works better with direct embedding
            this.elements.contentFrame.src = url;
            this.logTerminal(`[PROXY] GitHub target - using direct connection`);
            return;
        }

        // Try proxy services in order
        this.tryProxyServices(url, proxyServices, 0);
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
            progress += Math.random() * 15 + 5;
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
        }, 300);

        // Store interval to clear it if needed
        this.loadingInterval = loadingInterval;
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
}

// Initialize the browser when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.hyperspaceBrowser = new HyperSpaceBrowser();

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
    });
});