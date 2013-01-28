var IAB = window.IAB || {};

var Red   = new THREE.Color( 0xff0000 );
var Green = new THREE.Color( 0x00ff00 );

IAB.Components = {

    canUpdate: function( last_update_time, frequency )
    {
        return ((Date.now() - last_update_time)< 1/frequency*1000) ? false: true;
    }

};

IAB.Sensors=  {
 
    Heading: function( update_frequency )
    {

    },

    Velocity: function( update_frequency )
    {
        //this.last_update_time = Date.now();

        // Parameters 
        this.update_frequency = update_frequency || 2; // Hz
       
        // Initialisers
        this.previous_location = new THREE.Vector3( 0, 0, 0 );

        // Pose-pose change
        var delta = new THREE.Vector3(); 

        // Core loop
        this.update = function( robot_location )
        {
            if (IAB.Components.canUpdate( this.last_update_time, this.update_frequency ))
            {
                // Get ground-truth motion
                delta.sub( robot_location,this.previous_location );

                var vel = delta.length()/( (Date.now() - this.last_update_time) /1000);

                // Update positions
                this.previous_location.copy( robot_location );

                // Update time
                this.last_update_time = Date.now();

                return vel;
            
            }

        }
    },

    Odometry: function( update_frequency )
    {
        this.last_update_time = Date.now();
        
        // Parameters 
        this.update_frequency = update_frequency || 2; // Hz
       
        // Initialisers
        this.previous_location = new THREE.Vector3( 0, 0, 0 );

        // Position estimate, via odometry
        this.estimate = new THREE.Vector3(0,0,0);

        // Pose-pose change
        var delta = new THREE.Vector3(); 

        // Core loop
        this.update = function( robot_location )
        {
            if (IAB.Components.canUpdate( this.last_update_time, this.update_frequency ))
            {
                // Get ground-truth motion
                delta.sub( robot_location,this.previous_location );

                // Corrupt with noise
                delta.x += Math.random();
                delta.z += Math.random();

                // Update the estimate
                this.estimate.addSelf( delta );

                // Update positions
                this.previous_location.copy( robot_location );

                // Update time
                this.last_update_time = Date.now();
            }
        }
    },

    FixedRanging: function(scene, landmarks, num_landmarks, update_frequency )
    {
        this.last_update_time = Date.now();
        
        // Parameters
        this.num_landmarks = num_landmarks || 10;
        this.update_frequency = update_frequency || 2; // Hz

        var landmark_indices = [];

        for ( var i=0; i <this.num_landmarks; i++ )
        {
            landmark_indices.push( Math.random() *  landmarks.length );  
        }

        landmark_indices = landmark_indices.map( Math.ceil );

        var dist = new THREE.Vector3();

        this.update = function(robot_location)
        {
            if (IAB.Components.canUpdate( this.last_update_time, this.update_frequency ))
            {
                var readings = [];
        
                for( var i=0; i<landmark_indices.length; i++ )
                {
                    var landmark = landmarks[ landmark_indices[i] ];

                    var range =  dist.distanceTo( robot_location, landmark );
                
                    readings.push( { id:landmark.id, range:range } );
                }

                this.last_update_time = Date.now();

                return readings;
            }
        }
    
    },

    Ranging: function( scene, landmarks, range, update_frequency )
    {
        // Parameters
        this.range = range || 100;
        this.update_frequency = update_frequency || 2; // Hz

        // Squared distance metric 
        function distance(a, b) {
            var dx = a.x-b.x;
            var dz = a.z-b.z;
            return dx*dx + dz*dz;
        }
 
        // Build KD tree, for faster lookups
        this.tree = new kdTree( landmarks, distance, ["x", "z" ]);

        // Useful datafields
        var tmp = new THREE.Vector3();
        
        this.last_update_time = Date.now();
        
        // Core Loop
        this.update = function( robot_location )
        {
            if (IAB.Components.canUpdate( this.last_update_time, this.update_frequency ))
            {
                this.last_update_time = Date.now();

                /* Compute the visible landmarks
                 *     Note here that we are looking for *all* the landmarks, 
                 *     and selecting them by the 'sensor horizon', or the 
                 *     squared-distance.
                 */

                var visible_landmarks =  this.tree.nearest( robot_location, landmarks.length, Math.pow(this.range,2));

                var readings = [];

                for ( var i = 0; i<visible_landmarks.length; i++ )
                {
                    landmark = visible_landmarks[i][0];
                    
                    landmark.material.color = Green; 

                    tmp.copy(robot_location);
                    var range = tmp.distanceTo(landmark.position);
      
                    // Corrupt with noise
                    range += Math.random()/10;

                    readings.push( { id:landmark.id, range:range } );
                }

            }

            return readings;
        }
    },

    RangeBearing: function( scene, landmarks, range )
    {
        // Parameters
        this.range = range || 100;

        // Squared distance metric 
        function distance(a, b) {
            var dx = a.x-b.x;
            var dz = a.z-b.z;
            return dx*dx + dz*dz;
        }
 
        // Build KD tree
        this.tree = new kdTree( landmarks, distance, ["x", "z" ]);

        // Loop
        this.update = function( robot_location )
        {
            // Sensor horizon
            var visible_landmarks =  this.tree.nearest( robot_location, landmarks.length, Math.pow(this.range,2));
        }
    }
}

//IAB.Sensors.Heading.prototype = new IAB.Patterns.Observer();
//IAB.Sensors.Heading.prototype.constructor = IAB.Sensors.Sensor;

//IAB.Sensors.Velocity.prototype = new IAB.Patterns.Observer();
//IAB.Sensors.Velocity.prototype.constructor = IAB.Sensors.Sensor;


