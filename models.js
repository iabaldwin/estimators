var IAB = window.IAB || {};

// Requires:
// 1.   state.js

IAB.Models = {

    Ackermann:  function()
    {
        this.predict = function( state, control, dt, L ) 
        {
            // Update state
            var new_state = new IAB.Estimators.State();

            new_state.x     = state.x + dt*control.v*Math.cos( state.theta );
            new_state.y     = state.y + dt*control.v*Math.sin( state.theta );
            new_state.theta = state.theta  + dt*control.v/L*Math.tan( control.u );
       
            return new_state;
        }
    }

};

