(function() {
    'use strict';
    
    function init() {
        if (!window.FBHAchievements) {
            setTimeout(init, 100);
            return;
        }
        
        window.FBHAchievements.register({
            id: 'telegrammer',
            tier: 'Bronze',
            color: '#CD7F32',
            title: 'Telegrammer',
            desc: 'View one of our Telegrams.',
            emoji: '✈️',
            sound: 'achievement',
            trigger: {
                type: 'click',
                selector: 'a[href*="t.me"]'
            }
        });
    }
    
    init();
})();
