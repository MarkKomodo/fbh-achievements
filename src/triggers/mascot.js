// FBH Trigger: Mascot Collection
// Watches multiple sections, unlocks after all visited

(function() {
    'use strict';
    
    window.FBHTriggers = window.FBHTriggers || {};
    
    window.FBHTriggers.mascot = function(sys, cfg) {
        var sections = cfg.trigger.sections || [];
        var duration = cfg.trigger.duration || 3000;
        var id = cfg.id;
        
        if (!sections.length) {
            console.error('[FBH Trigger] No sections for:', id);
            return;
        }
        
        sys.data.mascots = sys.data.mascots || [];
        
        // Already complete?
        if (sys.data.mascots.length >= sections.length) {
            sys.unlock(id);
            return;
        }
        
        sections.forEach(function(sectionId) {
            var mascotName = sectionId.replace('-section', '');
            var timerKey = id + '-' + mascotName;
            
            sys.watchSection(sectionId, function() {
                sys.startTimer(timerKey, function() {
                    if (!sys.data.mascots.includes(mascotName)) {
                        sys.data.mascots.push(mascotName);
                        sys.save();
                        console.log('[FBH] Mascot visited:', mascotName, '(' + sys.data.mascots.length + '/' + sections.length + ')');
                    }
                    
                    if (sys.data.mascots.length >= sections.length) {
                        sys.unlock(id);
                    }
                }, duration);
            }, function() {
                sys.clearTimer(timerKey);
            });
        });
    };
})();
