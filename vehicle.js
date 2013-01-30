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
        
        //this.sensors.push( new IAB.Sensors.Ranging(scene, landmarks, 100) );
        //this.sensors.push( new IAB.Sensors.FixedRanging(scene, landmarks ) );
        //this.sensors.push( new IAB.Sensors.Odometry() );
        //this.sensors.push( new IAB.Sensors.Velocity( 50 ) );
     
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

        this.observationModel = function( model )
        {
            this.observation_model = model;
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
        
       
        this.math = new IAB.Tools.Math();
        this.update = function()
        {
            // Get the position
            var position = this.getPosition(); 
            this.sensors.forEach( function(sensor){ sensor.update( position ); } );

            // Update the control action
            this.control_input.copy(  this.controller.update() );
        
            var dt = (Date.now() - last_update_time)/1000;

            // Get the new state
            this.state = this.model.predict( this.state, this.control_input, dt );
           
            // Update the mesh, take care wrt. coordinate-systems
            this.mesh.position.x = this.state.x;
            this.mesh.position.z = this.state.y;

            
            // Do: measurement
            var random_landmark = Math.floor( Math.random()*landmarks.length );
            var z = this.observation_model.update( this.state, random_landmark );
            
            // Do: prediction
            var z_hat = this.observation_model.update( this.estimator.state, random_landmark );

            // Compute: Measurement jacobian
            var jacobian = IAB.Observations.MeasurementJacobian( this.estimator.state, random_landmark );

            // Compute: innovation
            var innov = numeric.sub( z, z_hat ); 
            // Wrap
            innov[1] = this.math.angleWrap( innov[1] );
        
            // Compute: Covariance Innovation
            var S = numeric.dot( numeric.dot( jacobian, this.estimator.P ), jacobian );

            console.log( S );
            
            // Compute: Innovation


            // Estimate
            this.estimator.update();

            last_update_time = Date.now();
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
