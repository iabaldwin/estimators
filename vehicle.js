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

        this.observation_model = new IAB.Observations.RangingModel( landmarks );
        
        var last_update_time = Date.now();
        
        this.update = function()
        {
            var dt = (Date.now() - last_update_time)/1000;

            // Update the control action
            this.control_input.copy(  this.controller.update( dt ) );

            // Get the *actual* new state
            this.state = this.model.predict( this.state, this.control_input, dt );

            // Update the mesh
            this.vehicle_geometry.position.copy( this.state.toVector() );
            // Different co-ord system 
            this.vehicle_geometry.rotation.y = -1*this.state.theta;

            // Predict
            this.estimator.predict( dt );

            // Update 
            var state = this.state;
            var readings = this.sensors.map( function(sensor){ return sensor.update( state ); } );

            //console.log( readings[0].length );

            //Measurement available?
            if (readings[0].length > 0)
            { 
                var landmark = readings[0][0];

                // Update
                this.estimator.update( landmark, this.observation_model.update( this.state, landmark) );
            }
            
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
