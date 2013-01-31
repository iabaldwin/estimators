var IAB = window.IAB || {};

IAB.Estimators = {

    EKF: function( start_state, P, Q, control_action, model, landmarks, args )
    {
        if ( !(start_state instanceof IAB.Robotics.SE2 ))
        {
            throw "Require: IAB.Robotics.SE2 ";
        }

        this.update_frequency = args.update_frequency || 10; // Hz

        // Associate control action, and state 
        this.control_action = control_action;
        this.model = model;
        
        // Copy arrays and start state : the filter retains its own estimate of hte state
        this.state = new IAB.Robotics.SE2();
        this.state.copy( start_state );
        this.P = P.slice(0);
        this.Q = Q.slice(0);

        // Rendering
        this.uncertainty_ellipse = new IAB.Graphing.Ellipse( this.state, this.P, .5, args);

        // Tools
        this.math = new IAB.Tools.Math();

        // Observation model
        this.observation_model = new IAB.Observations.RangingModel( landmarks, true );

        // PREDICTION STEP
        this.predict = function()
        {
            var dt = (Date.now() -  this.last_update_time )/1000 || (1.0/this.update_frequency);

            //Compute Jacobians
            var JacFx = [[1,0,-dt*this.control_action.v*Math.sin( this.state.theta)],
                [0,1,dt*this.control_action.v*Math.cos(this.state.theta)],
                [0,0,1]];

            var JacFu = [[dt*Math.cos( this.state.theta), 0],
                [dt*Math.sin( this.state.theta), 0],
                [dt*Math.tan(this.control_action.u)/this.model.L, dt*this.control_action.v*Math.pow(this.math.sec(this.control_action.u),2)]];
           
            // Update estimate
            this.state = model.predict( this.state, this.control_action, dt );

            //this.state.x += Math.random()/100;
            //this.state.y += Math.random()/100;
            //this.state.theta += Math.random()/100;

            // Inflate covariance matrix
            this.P = numeric.add( numeric.dot( numeric.dot( JacFx, this.P), numeric.transpose(JacFx) ), numeric.dot( numeric.dot( JacFu, this.Q), numeric.transpose(JacFu) ) );

            // Update graphics
            this.uncertainty_ellipse.update( this.state, this.P, .5);
           
            // Log time
            this.last_update_time = Date.now();

        }

        // UPDATE STEP
        this.update = function( landmark )
        {
            // Do: prediction
            var z_hat = this.observation_model.update( this.state, landmark );

            // Compute: Measurement jacobian
            var jacobian = IAB.Observations.MeasurementJacobian( this.state, landmark );

            // Compute: Innovation
            var innov = numeric.sub( z, z_hat ); 
            // Wrap
            innov[1] = this.math.angleWrap( innov[1] );

            //this.estimator.state.x = tmp[0];
            //this.estimator.state.y = tmp[1];
            //this.estimator.state.theta = this.math.angleWrap( tmp[2] );

            //this.estimator.state.x = 0;
            //this.estimator.state.y = 0;
            //this.estimator.state.theta = 0;

            // Compute: Covariance Innovation
            var S = numeric.dot( numeric.dot( jacobian, this.P ), numeric.transpose( jacobian ) );

            // Compute: Kalman Gain
            var W = numeric.dot( numeric.dot( this.P, numeric.transpose(jacobian) ), numeric.inv( S ) );

            // Compute update in Joseph form
            var I = numeric.identity(3);
            var P = numeric.dot( numeric.dot( numeric.sub( I, numeric.dot( W, jacobian) ), this.P  ), 
                    numeric.transpose( numeric.sub( I , numeric.dot( W, jacobian) ) ) );

            P = numeric.mul( numeric.add( P, numeric.transpose( P ) ), .5 );

            var tmp = numeric.add( [this.state.x, this.state.y, this.state.theta], numeric.dot( W, innov ) );

            var z = this.observation_model.update( this.state, landmark );

        
            console.log( this.state );

        }
    }
};
