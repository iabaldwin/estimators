var IAB = window.IAB || {};

IAB.Controllers = {

    ControlInput: function( u,v )
    {
        this.u = u || 0;
        this.v = v || 0;
   
        this.copy = function( control_input )
        {
            this.u = control_input.u;
            this.v = control_input.v;
        }
    },


    Wiggle: function( linear_velocity, angular_velocity )
    {
        this.current_control;

        this.update = function()
        {
            var control = new IAB.Controllers.ControlInput( linear_velocity, angular_velocity );  
            
            return control;
        }
    }


};
