var IAB = window.IAB || {};

IAB.Controllers = {

    ControlInput: function( u, v )
    {
        this.u = u || 0;
        this.v = v || 0;
   
        this.copy = function( control_input )
        {
            this.u = control_input.u;
            this.v = control_input.v;
        }

    },

    Constant: function( angular_velocity, linear_velocity )
    {
        this.update = function()
        {
            var control = new IAB.Controllers.ControlInput( angular_velocity, linear_velocity );  
            
            return control;
        }
    },

    Wiggle: function( linear_velocity )
    {
        this.current_control;

        var counter = 0;

        this.update = function()
        {
            var rotational_velocityg = Math.PI/5*Math.sin( 4*Math.PI*(++counter)/1000);

            return new IAB.Controllers.ControlInput( rotational_velocityg, linear_velocity );  
        }

    },

    Direct: function( x,y,theta )
    {

    }

};
