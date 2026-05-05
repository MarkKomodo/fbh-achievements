// FBH Achievement: First Steps
// Tier: Iron | Trigger: Visit home-section for 3 seconds

(function() {
    'use strict';
    
    function init() {
        if (!window.FBHAchievements) {
            setTimeout(init, 100);
            return;
        }
        
        var sys = window.FBHAchievements;
        
        var cfg = {
            id: 'first-steps',
            tier: 'Iron',
            color: '#676767',
            title: 'The First Steps',
            desc: 'Visit the home section to begin your journey through the Furry Belly Hub. Every adventure starts with a single step.',
            emoji: '🏠',
            sound: 'achievement'
        };
        
        sys.register(cfg);
        
        if (sys.has(cfg.id)) return;
        
        sys.watchSection('home-section', function() {
            sys.startTimer(cfg.id, function() {
                sys.unlock(cfg.id);
            }, 3000);
        }, function() {
            sys.clearTimer(cfg.id);
        });
    }
    
    init();
})();
