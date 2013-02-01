var IAB = window.IAB || {};

IAB.Estimators = {

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

        // Tools
        this.math = new IAB.Tools.Math();

        // Observation model
        if ( landmarks )
        {
            this.observation_model = new IAB.Observations.RangingModel( landmarks, true );
        }

        // PREDICTION 
        this.predict = function( dt )
        {
            //Compute Jacobians
            var JacFx = [[1,0,-dt*this.control_action.v*Math.sin( this.state.theta)],
                [0,1,dt*this.control_action.v*Math.cos(this.state.theta)],
                [0,0,1]];

            var JacFu = [[dt*Math.cos( this.state.theta), 0],
                [dt*Math.sin( this.state.theta), 0],
                [dt*Math.tan(this.control_action.u)/this.model.L, dt*this.control_action.v*Math.pow(this.math.sec(this.control_action.u),2)]];

            // Inject process noise
            var control_action = new IAB.Controllers.ControlInput();
            control_action.copy( this.control_action );
            control_action.u +=Math.random()/100;
            control_action.v +=Math.random()/100;

            // Update estimate
            this.state = model.predict( this.state, this.control_action, dt );
            //this.state = model.predict( this.state, control_action, dt );

            // Inflate covariance matrix
            this.P = numeric.add( numeric.dot( numeric.dot( JacFx, this.P), numeric.transpose(JacFx) ), numeric.dot( numeric.dot( JacFu, this.Q), numeric.transpose(JacFu) ) );
           
            // Draw uncertainty
            this.updateGraphics();
        }

        this.landmark_line = IAB.Primitives.Line();

        args.scene.add( this.landmark_line );

        // UPDATE 
        // Need to pass in *ACTUAL* position in landmark observation
        this.update = function( landmark, z )
        {
            // Do: prediction
            var z_hat = this.observation_model.update( this.state, landmark );

            // Compute: Measurement jacobian
            var jacobian = IAB.Observations.MeasurementJacobian( this.state, landmark );

            //var z = this.observation_model.update( this.state, landmark );
           
            this.landmark_line.geometry.vertices[0].x = this.state.x;
            this.landmark_line.geometry.vertices[0].z = this.state.y;
            this.landmark_line.geometry.vertices[1].copy( landmark.position );
            
            this.landmark_line.geometry.verticesNeedUpdate = true;

            // Compute: Innovation
            var innov = numeric.sub( z, z_hat ); 
           
            // Wrap
            innov[1] = this.math.angleWrap( innov[1] );

            var REst = numeric.diag( [ Math.pow( 2, 2), Math.pow( Math.PI*3/180,2)] );

            // Compute: Covariance Innovation
            var S = numeric.dot( numeric.dot( jacobian, this.P ), numeric.transpose( jacobian ) ) ;
            S = numeric.add( S, REst );

            // Compute: Kalman Gain
            var W = numeric.dot( numeric.dot( this.P, numeric.transpose(jacobian) ), numeric.inv( S ) );

            // Compute update in Joseph form
            var I = numeric.identity(3);
            var P = numeric.dot( numeric.dot( numeric.sub( I, numeric.dot( W, jacobian) ), this.P  ), 
                    numeric.transpose( numeric.sub( I , numeric.dot( W, jacobian) ) ) );

            P = numeric.mul( numeric.add( P, numeric.transpose( P ) ), .5 );
            this.P = P;

            // Compute new state
            var state = numeric.add( [this.state.x, this.state.y, this.state.theta], numeric.dot( W, innov ) );

            this.state.x = state[0];
            this.state.y = state[1];
            this.state.theta = state[2];

            //console.log( numeric.prettyPrint( this.P ) );

            this.updateGraphics();
        }

        this.updateGraphics = function()
        {
            // Update graphics
            this.uncertainty_ellipse.update( this.state, this.P, .5);
        }


    }
};
