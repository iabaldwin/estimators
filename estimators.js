var IAB = window.IAB || {};

IAB.Estimators = {

    State: function( x,y,theta )
    {
        this.x = x || 0;
        this.y = y || 0;
        this.theta = theta || 0;
    
   
        this.copy = function( s )
        {
            this.x = s.x;
            this.y = s.y;
            this.theta  = s.theta;
        }
    },

    EKF: function( start_state, P, Q, control_action, model, args )
    {
        if ( !(start_state instanceof IAB.Estimators.State ))
        {
            throw "Require: IAB.Estimators.State";
        }

        this.update_frequency = args.update_frequency || 10; // Hz

        // Associate control action, and state 
        this.control_action = control_action;
        this.model = model;
        
        // Copy arrays and start state
        this.state = new IAB.Estimators.State();
        this.state.copy( start_state );
        this.P = P.slice(0);
        this.Q = Q.slice(0);

        this.uncertainty_ellipse = new IAB.Graphing.Ellipse( this.state, this.P, 1, args);

        this.math = new IAB.Tools.Math();

        this.update = function()
        {
            if (IAB.Components.canUpdate( this.last_update_time, this.update_frequency ))
            {
                dt = (Date.now() -  this.last_update_time )/1000 || (1.0/this.update_frequency)

                //Compute Jacobians
                var JacFx = [[1,0,-dt*control_action.u*Math.sin( this.state.theta)],
                        [0,1,dt*control_action.v*Math.cos(this.state.theta)],
                        [0,0,1]];
     

                var JacFu =  [[dt*Math.cos( this.state.theta), 0],
                        [dt*Math.sin( this.state.theta), 0],
                        [dt*Math.tan(this.control_action.u/this.model.L), dt*this.control_action.v*this.math.sec(Math.pow(this.control_action.v,2))]];
                
                
                this.P = numeric.add( numeric.dot( numeric.dot( JacFx, this.P), numeric.transpose(JacFx) ), numeric.dot( numeric.dot( JacFu, this.Q), numeric.transpose(JacFu) ) );
    
                this.uncertainty_ellipse.update( null, this.P, 1 );

                //console.log( numeric.prettyPrint( this.P ) );

                this.last_update_time = Date.now();

            }
        }
    }
};
