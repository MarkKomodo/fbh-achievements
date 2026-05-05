// FBH Achievement: Meet The Pack
// Tier: Bronze | Trigger: Visit all 6 mascot sections for 3 seconds each

(function() {
    'use strict';
    
    function init() {
        if (!window.FBHAchievements) {
            setTimeout(init, 100);
            return;
        }
        
        window.FBHAchievements.register({
            id: 'meet-pack',
            tier: 'Bronze',
            color: '#CD7F32',
            title: 'Meet The Pack',
            desc: 'Visit all 6 mascot sections.',
            emoji: '🐾',
            sound: 'achievement',
            trigger: {
                type: 'mascot',
                sections: ['zyra-section', 'tango-section', 'gordon-section', 'fizz-section', 'nibbles-section', 'tabs-section'],
                duration: 3000
            }
        });
    }
    
    init();
})();
