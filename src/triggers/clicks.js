// FBH Trigger: Multiple Clicks
// Fires after N unique elements are clicked

(function() {
    'use strict';
    
    window.FBHTriggers = window.FBHTriggers || {};
    
    window.FBHTriggers.clicks = function(sys, cfg) {
        var selectors = cfg.trigger.selectors || [];
        var count = cfg.trigger.count || selectors.length;
        var id = cfg.id;
        
        if (!selectors.length) {
            console.error('[FBH Trigger] No selectors for:', id);
            return;
        }
        
        var key = id + '-clicked';
        var clicked = sys.data.progress[key] || [];
        
        // Already complete?
        if (clicked.length >= count) {
            sys.unlock(id);
            return;
        }
        
        // Track which selectors have been clicked
        var checkComplete = function() {
            if (clicked.length >= count) {
                sys.unlock(id);
                document.removeEventListener('click', delegateHandler);
            }
        };
        
        var delegateHandler = function(e) {
            selectors.forEach(function(selector, index) {
                var target = e.target.closest(selector);
                if (target && !clicked.includes(index)) {
                    clicked.push(index);
                    sys.data.progress[key] = clicked;
                    sys.save();
                    console.log('[FBH] Click tracked:', index + 1, '/' + count);
                    checkComplete();
                }
            });
        };
        
        document.addEventListener('click', delegateHandler);
        
        // Check if already complete from loaded data
        checkComplete();
    };
})();
