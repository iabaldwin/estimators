var IAB = window.IAB || {};

// Requires:
// 1.   state.js

IAB.Models = {

    // Model of steering
    Ackermann:  function( L )
    {
        this.L = L

        this.predict = function( state, control, dt ) 
        {
            // Update state
            var new_state = new IAB.Robotics.SE2();

            new_state.x     = state.x + dt*control.v*Math.cos( state.theta );
            new_state.y     = state.y + dt*control.v*Math.sin( state.theta );
            new_state.theta = state.theta + dt*control.v/this.L*Math.tan( control.u );
       
            return new_state;
        }
    },

    Direct:  function()
    {
        this.predict = function( state, control ) 
        {
            // Update state
            var new_state = new IAB.Robotics.SE2();

            new_state.x     = state.x + dt*control.v*Math.cos( state.theta );
            new_state.y     = state.y + dt*control.v*Math.sin( state.theta );
            new_state.theta = state.theta  + dt*control.v/this.L*Math.tan( control.u );
       
            return new_state;
        }
    }


};

