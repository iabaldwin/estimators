var IAB = window.IAB || {};

IAB.Estimators = {

    math: new IAB.Tools.Math(),

    EKF: function( start_state, P, Q, control_action, model, landmarks, args )
    {
        if ( !(start_state instanceof IAB.Robotics.SE2 )){throw "Require: IAB.Robotics.SE2 ";}

        this.update_frequency = args.update_frequency || 10; // Hz

        // Associate control action, and state 
        this.control_action = control_action;
        this.model = model;
        
        // Copy arrays and start state : the filter retains its own estimate of the state
        this.state = new IAB.Robotics.SE2();
        this.state.copy( start_state );
        this.P = P.slice(0);
        this.Q = Q.slice(0);

        // Rendering
        this.uncertainty_ellipse = new IAB.Graphing.Ellipse( this.state, this.P, .5, args);

        // Observation model
        this.observation_model = new IAB.Observations.RangingModel( landmarks, true );

        var REst = numeric.diag( [ Math.pow( 2, 2), Math.pow( Math.PI*3/180,2)] );
        
        // PREDICTION 
        this.predict = function( dt )
        {
            //Compute Jacobians
            var JacFx = [[1,0,-dt*this.control_action.v*Math.sin( this.state.theta)],
                [0,1,dt*this.control_action.v*Math.cos(this.state.theta)],
                [0,0,1]];

            var JacFu = [[dt*Math.cos( this.state.theta), 0],
                [dt*Math.sin( this.state.theta), 0],
                [dt*Math.tan(this.control_action.u)/this.model.L, dt*this.control_action.v*Math.pow(IAB.Estimators.math.sec(this.control_action.u),2)]];

            // Inject process noise
            var control_action = new IAB.Controllers.ControlInput();
            control_action.copy( this.control_action );
            control_action.u += IAB.Estimators.math.nrand()/100;
            control_action.v += IAB.Estimators.math.nrand()/100;

            // Update estimate
            this.state = model.predict( this.state, control_action, dt );

            // Inflate covariance matrix
            this.P = numeric.add( numeric.dot( numeric.dot( JacFx, this.P), numeric.transpose(JacFx) ), numeric.dot( numeric.dot( JacFu, this.Q), numeric.transpose(JacFu) ) );
           
            // Graphics
            // 1.   Uncertainty ellipse
            this.updateGraphics();
            // 2.   Observed landmark opacity
            previous_measurements.update();
        }

        // UPDATE
        var previous_measurements = new IAB.Observations.MeasurementHistory( args.scene );

        this.update = function( landmark, z )
        {
            // Add it to the render queue
            previous_measurements.addMeasurement( this.state, landmark);
            
            // Do: prediction
            var z_hat = this.observation_model.update( this.state, landmark );

            // Compute: Measurement jacobian
            var jacobian = IAB.Observations.MeasurementJacobian( this.state, landmark );

            // Compute: Innovation
            var innov = numeric.sub( z, z_hat ); 
            innov[1] = IAB.Estimators.math.angleWrap( innov[1] );

            // Compute: Covariance Innovation
            var S = numeric.dot( numeric.dot( jacobian, this.P ), numeric.transpose( jacobian ) ) ;
            S = numeric.add( S, REst );

            // Compute: Kalman Gain
            var W = numeric.dot( numeric.dot( this.P, numeric.transpose(jacobian) ), numeric.inv( S ) );

            // Compute update in Joseph form
            var I = numeric.identity(3);
            var P = numeric.dot( numeric.dot( numeric.sub( I, numeric.dot( W, jacobian) ), this.P  ), 
                    numeric.transpose( numeric.sub( I , numeric.dot( W, jacobian) ) ) ) 
                
            P = numeric.add( P, numeric.dot( numeric.dot( W, REst), numeric.transpose( W )  ) );
            P = numeric.mul( numeric.add( P, numeric.transpose( P ) ), .5 );

            // Compute new state & uncertainty
            this.P = P;
            var state = numeric.add( [this.state.x, this.state.y, this.state.theta], numeric.dot( W, innov ) );

            this.state.x = state[0];
            this.state.y = state[1];
            this.state.theta = IAB.Estimators.math.angleWrap( state[2] );

            this.updateGraphics();
        }

        this.updateGraphics = function()
        {
            // Update graphics
            this.uncertainty_ellipse.update( this.state, this.P, .5);
        }
    }
};
