// FBH Trigger: Section Visibility
// Watches one section, fires callback after X seconds of visibility

(function() {
    'use strict';
    
    window.FBHTriggers = window.FBHTriggers || {};
    
    window.FBHTriggers.section = function(sys, cfg) {
        var sectionId = cfg.trigger.sectionId || cfg.trigger.target;
        var duration = cfg.trigger.duration || 3000;
        var id = cfg.id;
        
        if (!sectionId) {
            console.error('[FBH Trigger] No sectionId for:', id);
            return;
        }
        
        sys.watchSection(sectionId, function() {
            sys.startTimer(id, function() {
                sys.unlock(id);
            }, duration);
        }, function() {
            sys.clearTimer(id);
        });
    };
})();
