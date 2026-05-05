// FBH Achievement: First Steps
// Tier: Iron | Trigger: Visit home-section for 3 seconds

(function() {
    'use strict';
    
    function init() {
        if (!window.FBHAchievements) {
            setTimeout(init, 100);
            return;
        }
        
        window.FBHAchievements.register({
            id: 'first-steps',
            tier: 'Iron',
            color: '#676767',
            title: 'The First Steps',
            desc: 'Visit the home section to begin your journey.',
            emoji: '🏠',
            sound: 'achievement',
            trigger: {
                type: 'section',
                sectionId: 'home-section',
                duration: 3000
            }
        });
    }
    
    init();
})();
