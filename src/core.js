// FBH Achievements - Core System
// Load this FIRST before any achievement scripts

(function() {
    'use strict';
    
    // Prevent double-load
    if (window.FBHAchievements) return;
    
    window.FBHAchievements = {
        // Data storage
        data: JSON.parse(localStorage.getItem('fbh_achievements_v1') || '{}'),
        timers: {},
        configs: {},
        
        // Initialize
        init: function() {
            this.data.unlocked = this.data.unlocked || [];
            this.data.progress = this.data.progress || {};
            this.data.mascots = this.data.mascots || [];
            this.injectStyles();
            this.createWidget();
        },
        
        // Save to localStorage
        save: function() {
            localStorage.setItem('fbh_achievements_v1', JSON.stringify(this.data));
        },
        
        // Check if unlocked
        has: function(id) {
            return this.data.unlocked.includes(id);
        },
        
        // Register with automatic trigger setup
        register: function(cfg) {
            this.configs[cfg.id] = cfg;
            this.applyVisuals(cfg.id);
            this.setupClick(cfg.id);
            
            // Auto-setup trigger if type specified
            if (cfg.trigger && cfg.trigger.type && window.FBHTriggers && window.FBHTriggers[cfg.trigger.type]) {
                if (!this.has(cfg.id)) {
                    window.FBHTriggers[cfg.trigger.type](this, cfg);
                }
            }
        },
        
        // Unlock achievement
        unlock: function(id) {
            if (this.has(id)) return false;
            
            var cfg = this.configs[id];
            if (!cfg) {
                console.error('[FBH] Unknown achievement:', id);
                return false;
            }
            
            this.data.unlocked.push(id);
            this.data.progress[id] = { unlockedAt: Date.now() };
            this.save();
            
            this.applyVisuals(id);
            this.showWidget(id);
            this.playSound(cfg.sound || 'achievement');
            
            console.log('[FBH] Unlocked:', cfg.title);
            return true;
        },
        
        // Apply locked/unlocked visuals
        applyVisuals: function(id) {
            var cfg = this.configs[id];
            var isUnlocked = this.has(id);
            
            var badge = document.getElementById('ach-badge-' + id);
            var title = document.getElementById('ach-title-' + id);
            var desc = document.getElementById('ach-desc-' + id);
            
            if (badge) {
                badge.className = 'ach-badge ' + (isUnlocked ? 'ach-unlocked ach-tier-' + cfg.tier.toLowerCase() : 'ach-locked');
                badge.setAttribute('data-emoji', isUnlocked ? cfg.emoji : '?');
                badge.setAttribute('data-tier', cfg.tier);
            }
            
            if (title) {
                title.className = 'ach-title ' + (isUnlocked ? 'ach-unlocked-title' : 'ach-locked-title');
                if (isUnlocked) title.textContent = cfg.title;
            }
            
            if (desc) {
                desc.style.borderColor = cfg.color;
            }
        },
        
        // Setup click to toggle description
        setupClick: function(id) {
            var badge = document.getElementById('ach-badge-' + id);
            if (!badge) return;
            
            badge.addEventListener('click', function() {
                var desc = document.getElementById('ach-desc-' + id);
                if (!desc) return;
                
                desc.classList.toggle('visible');
                
                // Play indicator sound
                if (window.sounds && window.sounds.indicator) {
                    window.sounds.indicator.currentTime = 0;
                    window.sounds.indicator.play().catch(function(){});
                }
            });
        },
        
        // Timer helpers
        startTimer: function(key, fn, ms) {
            if (this.timers[key]) clearTimeout(this.timers[key]);
            this.timers[key] = setTimeout(fn, ms);
        },
        
        clearTimer: function(key) {
            if (this.timers[key]) {
                clearTimeout(this.timers[key]);
                delete this.timers[key];
            }
        },
        
        // Watch Carrd section visibility
        watchSection: function(sectionId, onActive, onInactive) {
            var section = document.getElementById(sectionId);
            if (!section) {
                console.warn('[FBH] Section not found:', sectionId);
                return;
            }
            
            var obs = new MutationObserver(function(muts) {
                muts.forEach(function(m) {
                    if (m.type === 'attributes' && m.attributeName === 'class') {
                        if (section.classList.contains('active')) {
                            if (onActive) onActive();
                        } else {
                            if (onInactive) onInactive();
                        }
                    }
                });
            });
            
            obs.observe(section, { attributes: true });
            
            // Check current state
            if (section.classList.contains('active') && onActive) {
                onActive();
            }
        },
        
        // Play sound
        playSound: function(soundName) {
            if (window.sounds && window.sounds[soundName]) {
                window.sounds[soundName].currentTime = 0;
                window.sounds[soundName].play().catch(function(e) {
                    console.log('[FBH] Sound blocked:', e.name);
                });
            }
        },
        
        // Show floating widget
        showWidget: function(id) {
            var cfg = this.configs[id];
            var widget = document.getElementById('fbh-widget');
            var inner = document.getElementById('fbh-widget-inner');
            
            if (!widget || !inner) return;
            
            inner.innerHTML = 
                '<div style="border-left:3px solid ' + cfg.color + ';padding-left:12px;">' +
                '<div style="color:' + cfg.color + ';font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Achievement Unlocked!</div>' +
                '<div style="color:#fff;font-size:15px;margin-top:4px;font-weight:600;">' + cfg.title + '</div>' +
                '<div style="color:' + cfg.color + ';font-size:10px;text-transform:uppercase;opacity:0.8;margin-top:2px;">' + cfg.tier + ' Tier</div>' +
                '</div>';
            
            widget.style.transform = 'translateX(0)';
            
            setTimeout(function() {
                widget.style.transform = 'translateX(120%)';
            }, 4000);
        },
        
        // Inject CSS
        injectStyles: function() {
            var css = document.getElementById('fbh-achievement-styles');
            if (css) return; // Already injected
            
            css = document.createElement('style');
            css.id = 'fbh-achievement-styles';
            css.textContent = 
                '#fbh-widget{position:fixed;top:20px;right:0;background:rgba(10,10,15,0.95);border:1px solid rgba(255,255,255,0.1);border-right:none;border-radius:8px 0 0 8px;padding:14px 18px;z-index:99999;font-family:"Chakra Petch",monospace;transform:translateX(120%);transition:transform 0.4s ease;min-width:220px;}' +
                '.ach-badge{width:120px;height:120px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:"Chakra Petch",monospace;margin:0 auto;cursor:pointer;transition:all 0.5s ease;font-size:48px;position:relative;}' +
                '.ach-locked{background:#15151F;border:2px solid #676767;color:#676767;}' +
                '.ach-locked::before{content:"?";font-weight:700;font-size:48px;}' +
                '.ach-unlocked{border:2px solid;animation:achPop 0.5s ease;}' +
                '.ach-unlocked::before{content:attr(data-emoji);font-size:48px;text-shadow:0 0 20px currentColor;}' +
                '.ach-tier-iron{color:#676767;border-color:#676767;box-shadow:0 0 15px #676767;}' +
                '.ach-tier-bronze{color:#CD7F32;border-color:#CD7F32;box-shadow:0 0 15px #CD7F32;}' +
                '.ach-tier-silver{color:#C4C4C4;border-color:#C4C4C4;box-shadow:0 0 15px #C4C4C4;}' +
                '.ach-tier-gold{color:#FFB800;border-color:#FFB800;box-shadow:0 0 15px #FFB800;}' +
                '.ach-tier-platinum{color:#008891;border-color:#008891;box-shadow:0 0 15px #008891;}' +
                '.ach-tier-emerald{color:#30B81A;border-color:#30B81A;box-shadow:0 0 15px #30B81A;}' +
                '.ach-tier-diamond{color:#81DEEB;border-color:#81DEEB;box-shadow:0 0 15px #81DEEB;}' +
                '.ach-tier-amethyst{color:#BD00FF;border-color:#BD00FF;box-shadow:0 0 15px #BD00FF;}' +
                '.ach-tier-ruby{color:#E61717;border-color:#E61717;box-shadow:0 0 15px #E61717;}' +
                '.ach-tier-halo{color:#FFFFFF;border-color:#FFFFFF;box-shadow:0 0 20px #FFFF80,0 0 40px #FFFFFF;}' +
                '.ach-title{font-family:"Chakra Petch",monospace;font-size:16px;font-weight:600;margin-top:12px;text-align:center;transition:all 0.5s ease;}' +
                '.ach-locked-title{filter:blur(6px);color:#676767;}' +
                '.ach-unlocked-title{filter:blur(0);color:#fff;text-shadow:0 0 10px rgba(255,255,255,0.3);}' +
                '.ach-desc{display:none;color:rgba(255,255,255,0.7);font-size:13px;margin-top:8px;padding:10px;background:rgba(255,255,255,0.03);border-radius:6px;border-left:3px solid;font-family:"Chakra Petch",monospace;max-width:200px;text-align:center;margin-left:auto;margin-right:auto;}' +
                '.ach-desc.visible{display:block;animation:slideDown 0.3s ease;}' +
                '@keyframes achPop{0%{transform:scale(1);}50%{transform:scale(1.12);}100%{transform:scale(1);}}' +
                '@keyframes slideDown{from{opacity:0;transform:translateY(-5px);}to{opacity:1;transform:translateY(0);}}';
            
            document.head.appendChild(css);
        },
        
        // Create widget HTML
        createWidget: function() {
            if (document.getElementById('fbh-widget')) return;
            
            var widget = document.createElement('div');
            widget.id = 'fbh-widget';
            widget.innerHTML = '<div id="fbh-widget-inner"></div>';
            document.body.appendChild(widget);
        },
        
        // Debug: Reset all
        reset: function() {
            this.data = { unlocked: [], progress: {}, mascots: [] };
            this.save();
            console.log('[FBH] All achievements reset');
            location.reload();
        },
        
        // Debug: Status
        status: function() {
            console.log('[FBH] Unlocked:', this.data.unlocked);
            console.log('[FBH] Mascots:', this.data.mascots);
            console.log('[FBH] Progress:', this.data.progress);
            console.log('[FBH] Total:', this.data.unlocked.length, '/', Object.keys(this.configs).length);
        },
        
        // Debug: Force unlock
        forceUnlock: function(id) {
            var cfg = this.configs[id];
            if (cfg) this.unlock(id);
        }
    };
    
    // Initialize immediately
    window.FBHAchievements.init();
    
    // Expose debug commands
    window.resetAchievements = function() { window.FBHAchievements.reset(); };
    window.achStatus = function() { window.FBHAchievements.status(); };
    window.forceUnlock = function(id) { window.FBHAchievements.forceUnlock(id); };
    
    console.log('[FBH] Core system loaded');
})();
