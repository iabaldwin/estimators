var IAB = window.IAB || {};

IAB.Controllers = {

    ControlInput: function( u,v )
    {
        this.u = u || 0;
        this.v = v || 0;
    },


    Wiggle: function( linear_velocity, angular_velocity )
    {

        this.update = function()
        {
            return new IAB.Controllers.ControlInput( linear_velocity, angular_velocity );  
        }
    }


};
