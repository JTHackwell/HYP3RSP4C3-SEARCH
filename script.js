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
        // Remove any extra whitespace
        url = url.trim();

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
        this.logTerminal(`[PROXY] Initiating proxy connection to: ${url}`);

        // List of working CORS proxy services
        const proxyServices = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`,
            `https://cors-anywhere.herokuapp.com/${url}`,
            `https://thingproxy.freeboard.io/fetch/${url}`
        ];

        // Special handling for popular sites
        if (url.includes('youtube.com')) {
            this.loadYouTubeProxy(url);
            return;
        }

        if (url.includes('google.com')) {
            this.loadGoogleProxy(url);
            return;
        }

        // Try proxy services in sequence
        this.tryProxyService(url, proxyServices, 0);
    }

    tryProxyService(url, proxyServices, index) {
        if (index >= proxyServices.length) {
            this.logTerminal(`[ERROR] All proxy routes failed for: ${url}`);
            this.createFallbackInterface(url);
            return;
        }

        const proxyUrl = proxyServices[index];
        const serviceName = this.getProxyServiceName(proxyUrl);

        this.logTerminal(`[PROXY] Attempting route ${index + 1}: ${serviceName}`);

        // For AllOrigins API, we need to fetch the content and display it
        if (proxyUrl.includes('allorigins.win')) {
            this.loadThroughAllOrigins(url, proxyServices, index);
        } else {
            // For other proxies, try direct iframe loading
            this.loadThroughDirectProxy(proxyUrl, url, proxyServices, index);
        }
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
        this.logTerminal(`[YOUTUBE] Attempting YouTube proxy connection...`);

        // Try multiple YouTube proxy methods
        const youtubeProxies = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://invidious.io/${url.replace('https://www.youtube.com', '')}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`
        ];

        this.tryYouTubeProxy(url, youtubeProxies, 0);
    }

    tryYouTubeProxy(originalUrl, proxies, index) {
        if (index >= proxies.length) {
            this.logTerminal(`[YOUTUBE] All YouTube proxies failed, creating alternative interface`);
            this.createYouTubeAlternative(originalUrl);
            return;
        }

        const proxyUrl = proxies[index];
        this.logTerminal(`[YOUTUBE] Trying YouTube proxy ${index + 1}...`);

        if (proxyUrl.includes('allorigins.win')) {
            fetch(proxyUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.contents) {
                        this.logTerminal(`[SUCCESS] YouTube content loaded via proxy`);
                        this.displayProxiedContent(data.contents, originalUrl);
                    } else {
                        throw new Error('No content received');
                    }
                })
                .catch(() => {
                    this.tryYouTubeProxy(originalUrl, proxies, index + 1);
                });
        } else {
            // Try direct iframe loading
            this.elements.contentFrame.src = proxyUrl;

            setTimeout(() => {
                // Check if it loaded successfully (basic check)
                this.logTerminal(`[YOUTUBE] Proxy attempt ${index + 1} completed`);
            }, 3000);
        }
    }

    loadGoogleProxy(url) {
        this.logTerminal(`[GOOGLE] Loading Google through proxy...`);

        // For Google, try the AllOrigins approach
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

        fetch(proxyUrl)
            .then(response => response.json())
            .then(data => {
                if (data.contents) {
                    this.logTerminal(`[SUCCESS] Google loaded via AllOrigins proxy`);
                    this.displayProxiedContent(data.contents, url);
                } else {
                    // Fallback to search interface
                    this.createSearchResultsPage(this.extractSearchQuery(url) || '');
                }
            })
            .catch(error => {
                this.logTerminal(`[GOOGLE] Proxy failed, using search interface`);
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
        // Check if input looks like a search query rather than a URL
        const hasSpaces = input.includes(' ');
        const hasNoTLD = !input.includes('.com') && !input.includes('.org') && !input.includes('.net') && !input.includes('.io') && !input.includes('.co');
        const startsWithProtocol = input.startsWith('http://') || input.startsWith('https://');

        return (hasSpaces || hasNoTLD) && !startsWithProtocol;
    }

    performWebSearch(query) {
        // Remove any protocol if present
        query = query.replace(/^https?:\/\//, '');

        this.logTerminal(`[SEARCH] Performing web search: ${query}`);

        // Create a comprehensive search results page
        this.createSearchResultsPage(query);
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