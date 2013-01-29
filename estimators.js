var IAB = window.IAB || {};

IAB.Estimators = {

    EKF: function( start_state, P, Q, control_action, model, args )
    {
        if ( !(start_state instanceof IAB.Robotics.SE2 ))
        {
            throw "Require: IAB.Robotics.SE2 ";
        }

        this.update_frequency = args.update_frequency || 10; // Hz

        // Associate control action, and state 
        this.control_action = control_action;
        this.model = model;
        
        // Copy arrays and start state
        this.state = new IAB.Robotics.SE2();
        this.state.copy( start_state );
        this.P = P.slice(0);
        this.Q = Q.slice(0);

        // Rendering
        this.uncertainty_ellipse = new IAB.Graphing.Ellipse( this.state, this.P, .5, args);

        // Tools
        this.math = new IAB.Tools.Math();

        this.update = function( dt )
        {
            if (IAB.Components.canUpdate( this.last_update_time, this.update_frequency ))
            {
                dt = (Date.now() -  this.last_update_time )/1000 || (1.0/this.update_frequency);

                //Compute Jacobians
                var JacFx = [[1,0,-dt*this.control_action.v*Math.sin( this.state.theta)],
                            [0,1,dt*this.control_action.v*Math.cos(this.state.theta)],
                            [0,0,1]];
                

                var JacFu = [[dt*Math.cos( this.state.theta), 0],
                            [dt*Math.sin( this.state.theta), 0],
                            [dt*Math.tan(this.control_action.u)/this.model.L, dt*this.control_action.v*Math.pow(this.math.sec(this.control_action.u),2)]];
                
                this.P = numeric.add( numeric.dot( numeric.dot( JacFx, this.P), numeric.transpose(JacFx) ), numeric.dot( numeric.dot( JacFu, this.Q), numeric.transpose(JacFu) ) );

                this.uncertainty_ellipse.update( this.state, this.P, .5);

                this.state = model.predict( this.state, this.control_action, dt );

                this.last_update_time = Date.now();

            }
        }
    }
};
