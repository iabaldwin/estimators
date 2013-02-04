var IAB = window.IAB || {};

IAB.Estimators = {

    math: new IAB.Tools.Math(),

    PF: function( start_state, num_particles, control_action, model, landmarks, args )
    {
        this.update_frequency = args.update_frequency || 10; // Hz

        // Associate control action, and state 
        this.control_action = control_action;
        this.model = model;
        
        // Copy arrays and start state : the filter retains its own estimate of the state
        this.state = new IAB.Robotics.SE2();
        this.state.copy( start_state );

        // Observation model
        this.observation_model = new IAB.Observations.RangingModel( landmarks, true );

        // Build particles
        var particles = [];
        //for ( var i=0; i< num_particles; i++ )
        //{
            //particles.push( IAB.Estimators.math.nrand()/100+start_state.x, 
                            //IAB.Estimators.math.nrand()/100+start_state.y, 
                            //IAB.Estimators.math.nrand()/100+start_state.theta );
        //}

        // create the particle variables
        var particleCount = num_particles,
            particles = new THREE.Geometry(),
            pMaterial =
                new THREE.ParticleBasicMaterial({
                    color: 0xFFFFFF,
                size: 2
                });

        // now create the individual particles
        for(var p = 0; p < particleCount; p++) {

            var pX = IAB.Estimators.math.nrand()+start_state.x,  
                pY = .1*IAB.Estimators.math.nrand()+start_state.theta, 
                pZ = IAB.Estimators.math.nrand()+start_state.y, 
                particle = new THREE.Vertex(
                        new THREE.Vector3(pX, pY, pZ)
                        );

            // add it to the geometry
            particles.vertices.push(particle);
        }

        // create the particle system
        var particleSystem =
            new THREE.ParticleSystem(
                    particles,
                    pMaterial);

        // Add it to the scene
        scene.add(particleSystem);

        // Landmark record
        var previous_measurements = new IAB.Observations.MeasurementHistory( args.scene );

        // PREDICTION 
        this.predict = function( dt )
        {
            // Inject process noise
            var control_action = new IAB.Controllers.ControlInput();
            
            for ( var i=0;i<num_particles;i++ )
            {
                var particle = particleSystem.geometry.vertices[i] ;

                control_action.copy( this.control_action );
                control_action.u += IAB.Estimators.math.nrand()/100;
                control_action.v += IAB.Estimators.math.nrand()/100;

                var se2 = model.predict( new IAB.Robotics.SE2( particle.x, particle.z, particle.y) , control_action, dt );

                particle.set( se2.x, se2.theta, se2.y );
            
            }

            particleSystem.geometry.verticesNeedUpdate = true; 
            
            // Update estimate

            // Graphics
            //1.   Observed landmark opacity
            previous_measurements.update();
        }

        this.update = function(landmark, z){ 
            
            // Add it to the render queue
            previous_measurements.addMeasurement( this.state, landmark);

            // Do: prediction
            var z_hat = this.observation_model.update( this.state, landmark );

            var innov = numeric.sub( z, z_hat ); 
            //innov[1] = IAB.Estimators.Math.anglewrap( innov[1] );

        }

    },

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

        // Process uncertainty
        var REst = numeric.diag( [ Math.pow( 2, 2), Math.pow( Math.PI*3/180,2)] );
        
        // Observation model
        this.observation_model = new IAB.Observations.RangingModel( landmarks, true );

        // Landmark record
        var previous_measurements = new IAB.Observations.MeasurementHistory( args.scene );
        
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
        this.update = function( landmark, z )
        {
            // add it to the render queue
            previous_measurements.addmeasurement( this.state, landmark);
            
            // do: prediction
            var z_hat = this.observation_model.update( this.state, landmark );

            // compute: measurement jacobian
            var jacobian = iab.observations.measurementjacobian( this.state, landmark );

            // compute: innovation
            var innov = numeric.sub( z, z_hat ); 
            innov[1] = iab.estimators.math.anglewrap( innov[1] );

            // compute: covariance innovation
            var s = numeric.dot( numeric.dot( jacobian, this.p ), numeric.transpose( jacobian ) ) ;
            s = numeric.add( s, rest );

            // compute: kalman gain
            var w = numeric.dot( numeric.dot( this.p, numeric.transpose(jacobian) ), numeric.inv( s ) );

            // compute update in joseph form
            var i = numeric.identity(3);
            var p = numeric.dot( numeric.dot( numeric.sub( i, numeric.dot( w, jacobian) ), this.p  ), 
                    numeric.transpose( numeric.sub( i , numeric.dot( w, jacobian) ) ) ) 
                
            p = numeric.add( p, numeric.dot( numeric.dot( w, rest), numeric.transpose( w )  ) );
            p = numeric.mul( numeric.add( p, numeric.transpose( p ) ), .5 );

            // compute new state & uncertainty
            this.p = p;
            var state = numeric.add( [this.state.x, this.state.y, this.state.theta], numeric.dot( w, innov ) );

            this.state.x = state[0];
            this.state.y = state[1];
            this.state.theta = iab.estimators.math.anglewrap( state[2] );

            this.updategraphics();
        }

        this.updateGraphics = function()
        {
            // Update graphics
            this.uncertainty_ellipse.update( this.state, this.P, .5);
        }
    }
};
