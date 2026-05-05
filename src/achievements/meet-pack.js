// FBH Achievement: Meet The Pack
// Tier: Bronze | Trigger: Visit all 6 mascot sections for 3 seconds each

(function() {
    'use strict';
    
    function init() {
        if (!window.FBHAchievements) {
            setTimeout(init, 100);
            return;
        }
        
        var sys = window.FBHAchievements;
        
        var cfg = {
            id: 'meet-pack',
            tier: 'Bronze',
            color: '#CD7F32',
            title: 'Meet The Pack',
            desc: 'Visit all 6 mascot sections: Tango, Nibbles, Gordon, Fizz, Zyra, and Tabs. Each one represents a unique corner of our community.',
            emoji: '🐾',
            sound: 'achievement'
        };
        
        sys.register(cfg);
        
        if (sys.has(cfg.id)) return;
        
        var mascots = ['zyra-section', 'tango-section', 'gordon-section', 'fizz-section', 'nibbles-section', 'tabs-section'];
        
        mascots.forEach(function(sectionId) {
            var mascotName = sectionId.replace('-section', '');
            var timerKey = 'mp-' + mascotName;
            
            sys.watchSection(sectionId, function() {
                sys.startTimer(timerKey, function() {
                    if (!sys.data.mascots.includes(mascotName)) {
                        sys.data.mascots.push(mascotName);
                        sys.save();
                        console.log('[FBH] Mascot visited:', mascotName, '(' + sys.data.mascots.length + '/6)');
                    }
                    
                    if (sys.data.mascots.length >= 6) {
                        sys.unlock(cfg.id);
                    }
                }, 3000);
            }, function() {
                sys.clearTimer(timerKey);
            });
        });
    }
    
    init();
})();
