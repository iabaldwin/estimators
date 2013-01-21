var IAB = window.IAB || {};

var Red   = new THREE.Color( 0xff0000 );
var Green = new THREE.Color( 0x00ff00 );

IAB.Sensors=  {

    CanUpdate: function( last_update_time, frequency )
    {
        return ((Date.now() - last_update_time)< 1/frequency*1000) ? false: true;
    },

    Odometry: function( update_frequency )
    {
        // Parameters 
        this.update_frequency = update_frequency || 2; // Hz
       
        // Initialisers
        this.previous_location = new THREE.Vector3( 0, 0, 0 );

        // Position estimate, via odometry
        this.estimate = new THREE.Vector3(0,0,0);
        
        var delta = new THREE.Vector3(); 
        
        this.last_update_time = Date.now();

        // Core loop
        this.update = function( robot_location )
        {
            if (IAB.Sensors.CanUpdate( this.last_update_time, this.update_frequency ))
            {
                // Get ground-truth motion
                //delta.sub( this.previous_location, robot_location );
                delta.sub( robot_location,this.previous_location );

                // Corrupt with noise
                delta.x += Math.random()/10;
                delta.z += Math.random()/10;

                // Update the estimate
                this.estimate.addSelf( delta );

                // Update positions
                this.previous_location.copy( robot_location );

                // Update time
                this.last_update_time = Date.now();
            }
            else
            {
                return;
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

            if (IAB.Sensors.CanUpdate( this.last_update_time, this.update_frequency ))
            {
                this.last_update_time = Date.now();

                /* Compute the visible landmarks
                 *     Note here that we are looking for *all* the landmarks, 
                 *     and selecting them by the 'sensor horizon', or the 
                 *     squared distance.
                 */

                var visible_landmarks =  this.tree.nearest( robot_location, landmarks.length, Math.pow(this.range,2));

                var readings = [];

                for ( var i = 0; i<visible_landmarks.length; i++ )
                {
                    landmark = visible_landmarks[i][0];
                    
                    landmark.material.color = Green; 

                    tmp.copy(robot_location);
                    var range = tmp.distanceTo(landmark.position);
                    
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

