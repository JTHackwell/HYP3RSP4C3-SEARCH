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
                // In a real proxy browser, this would route through a proxy server
                // For demo purposes, we'll load directly but with security headers
                this.elements.contentFrame.src = url;
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
            this.elements.contentFrame.src = this.currentUrl;
            this.elements.addressBar.value = this.isStealthMode ? this.obfuscateUrl(this.currentUrl) : this.currentUrl;
            this.updateNavigationButtons();
            this.logTerminal(`[NAVIGATE] Returning to previous target`);
        }
    }

    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentUrl = this.history[this.historyIndex];
            this.elements.contentFrame.src = this.currentUrl;
            this.elements.addressBar.value = this.isStealthMode ? this.obfuscateUrl(this.currentUrl) : this.currentUrl;
            this.updateNavigationButtons();
            this.logTerminal(`[NAVIGATE] Advancing to next target`);
        }
    }

    refresh() {
        if (this.currentUrl) {
            this.showLoading(this.currentUrl);
            this.elements.contentFrame.src = this.currentUrl + '?t=' + Date.now();
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