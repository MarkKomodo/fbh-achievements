// FBH Trigger: Time-based
// Fires if current time matches criteria

(function() {
    'use strict';
    
    window.FBHTriggers = window.FBHTriggers || {};
    
    window.FBHTriggers.time = function(sys, cfg) {
        var trigger = cfg.trigger;
        var id = cfg.id;
        
        function checkTime() {
            var now = new Date();
            var hour = now.getHours();
            var match = false;
            
            // Hour range check
            if (trigger.startHour !== undefined && trigger.endHour !== undefined) {
                if (trigger.startHour <= trigger.endHour) {
                    // Same day range (e.g., 3-5 AM)
                    match = hour >= trigger.startHour && hour <= trigger.endHour;
                } else {
                    // Overnight range (e.g., 22-2)
                    match = hour >= trigger.startHour || hour <= trigger.endHour;
                }
            }
            
            // Specific date check
            if (trigger.month !== undefined && trigger.day !== undefined) {
                match = now.getMonth() + 1 === trigger.month && now.getDate() === trigger.day;
            }
            
            // Specific weekday check (0=Sunday, 6=Saturday)
            if (trigger.weekday !== undefined) {
                match = now.getDay() === trigger.weekday;
            }
            
            if (match && !sys.has(id)) {
                sys.unlock(id);
            }
        }
        
        // Check immediately
        checkTime();
        
        // Re-check periodically (every minute)
        setInterval(checkTime, 60000);
    };
})();
