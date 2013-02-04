var IAB = window.IAB || {};

IAB.Vehicle =  {

    Holonomic: function( scene, landmarks )
    {

        // Build vehicle representation
        this.vehicle_geometry = IAB.Primitives.Triangle();
        scene.add( this.vehicle_geometry );

        // Load representation
        //var loader = new THREE.OBJLoader();

        // Sensor suite
        this.sensors = [];
        this.addSensor = function( sensor )
        {
            this.sensors.push( sensor );
            return this;
        }

        this.setController = function( controller )
        {
            this.controller = controller;
            return this;
        }

        this.setModel = function( model )
        {
            this.model = model;
            return this; 
        }

        this.setEstimator = function( estimator )
        {
            this.estimator = estimator;
            return this;
        }

        this.initialState = function( state )
        {
            this.state = state;
            return this;
        }

        this.controlInput = function( control_input )
        {
            this.control_input = control_input;
            return this;
        }

        //TMP
        //var geometry = new THREE.CircleGeometry( 4, 50 );
        //var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
        //var odometry_mesh = new THREE.Mesh( geometry, material );
        //scene.add( odometry_mesh );
        //odometry_mesh.position = this.sensors[1].estimate ;
        //odometry_mesh.rotation.x += THREE.Math.degToRad( 270 );

        var last_update_time = Date.now();
        
        this.measurement_available = true;

        var counter = 0;
   
        if (landmarks)
        {
            this.observation_model = new IAB.Observations.RangingModel( landmarks );
        }

        this.update = function()
        {
            var dt = (Date.now() - last_update_time)/1000;

            // Update the control action
            this.control_input.copy(  this.controller.update( dt ) );

            // Get the *actual* new state
            this.state = this.model.predict( this.state, this.control_input, dt );

            // Update sensor 
            var state = this.state;
            this.sensors.forEach( function(sensor){ sensor.update( state ); } );

            // Update the mesh
            this.vehicle_geometry.position.copy( this.state.toVector() );
            // Different co-ord system 
            this.vehicle_geometry.rotation.y = -1*this.state.theta;

            // Predict
            this.estimator.predict( dt );

            //Measurement available?
            if (this.measurement_available && landmarks )
            { 
                counter++;
                if ( counter < 100 || counter > 500 )
                {
                    // Observe landmark
                    var random_landmark = landmarks[Math.floor( Math.random()*landmarks.length )];
                    
                    // Update
                    this.estimator.update( random_landmark, this.observation_model.update( this.state, random_landmark ) );
                } 
            }
            
            last_update_time = Date.now();
        }

        this.toggleMeasurements = function()
        {
            this.measurement_available = !this.measurement_available; 
        }

        this.tweenUpdate = function(obj,b)
        {
        }

        function bind(fn,obj)
        {
            return function(b)
            {
                return fn(obj,b);
            }
        }
        
        this.waypoints  = [];
        this.addWaypoint = function(target)
        {
            var start;
            if ( this.waypoints.length == 0 )
            {  
                //start = this.vehicle_geometry.position;
            }
            else
            {
                start = this.waypoints[this.waypoints.length-1].target;
            }
                
            var tween = new TWEEN.Tween(start).to(target, 20000);
            
            tween.onUpdate( bind( this.tweenUpdate, this ) );
            
            this.waypoints.push( { tween: tween, target:target } ); 

            tween.start();
        }

        return this;
    } 
};
