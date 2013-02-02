var IAB = window.IAB || {};

IAB.Vehicle =  {

    Holonomic: function( scene, landmarks )
    {

        // Build vehicle representation
        var vehicle_geometry = new THREE.CircleGeometry( 2, 10 );
        var vehicle_material = new THREE.MeshLambertMaterial( { color: 0x00ff80, ambient: 0x00ff80, shading: THREE.FlatShading, map: THREE.ImageUtils.loadTexture( "../media/texture.jpg" ) } );
        this.mesh            = new THREE.Mesh( vehicle_geometry, vehicle_material );
    
        scene.add( this.mesh );

        this.mesh.position = new THREE.Vector3(0,0,0);
        this.mesh.rotation.x += THREE.Math.degToRad( 270 );

        // Sensors
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

        this.getPosition = function()
        {
            return this.mesh.position;
        }

        var last_update_time = Date.now();
        
        this.measurement_available = true;

        this.math = new IAB.Tools.Math();
       
        var counter = 0;
      
        this.observation_model = new IAB.Observations.RangingModel( landmarks );

        this.update = function()
        {
            if (!step)
                return;

            //Toggle
            step = false;

            //var dt = (Date.now() - last_update_time)/1000;
            var dt = .1;

            // Update the control action
            this.control_input.copy(  this.controller.update( dt ) );

            // Get the *actual* new state
            this.state = this.model.predict( this.state, this.control_input, dt );

            // Get the position
            //var position = this.state.toVector();
            //this.sensors.forEach( function(sensor){ sensor.update( position ); } );

            // Update the mesh
            this.mesh.position.copy( this.state.toVector() );

            // Predict
            this.estimator.predict( dt );

            //Measurement available?
            if (this.measurement_available)
            { 
                counter++;
                if ( counter < 20 || counter > 200)
                {
                    // Observe landmark
                    var random_landmark = landmarks[Math.floor( Math.random()*landmarks.length )];
                    // Update
                    this.estimator.update( random_landmark, this.observation_model.update( this.state, random_landmark ) );

                } else
                {
                    // Measurement failure
                }
            }
            else
            {

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
                start = this.mesh.position;
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
