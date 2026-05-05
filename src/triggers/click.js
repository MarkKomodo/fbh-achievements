// FBH Trigger: Click
// Fires when user clicks element matching selector

(function() {
    'use strict';
    
    window.FBHTriggers = window.FBHTriggers || {};
    
    window.FBHTriggers.click = function(sys, cfg) {
        var selector = cfg.trigger.selector;
        var id = cfg.id;
        
        if (!selector) {
            console.error('[FBH Trigger] No selector for:', id);
            return;
        }
        
        var clicked = sys.data.progress[id + '-clicked'];
        if (clicked) {
            sys.unlock(id);
            return;
        }
        
        var handler = function(e) {
            sys.data.progress[id + '-clicked'] = true;
            sys.save();
            sys.unlock(id);
            
            // Remove listener after unlock
            document.removeEventListener('click', delegateHandler);
        };
        
        // Delegate handler to catch dynamic elements
        var delegateHandler = function(e) {
            var target = e.target.closest(selector);
            if (target) handler(e);
        };
        
        document.addEventListener('click', delegateHandler);
    };
})();
