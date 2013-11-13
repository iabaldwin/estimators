//var IAB = window.IAB || {};

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
                delta.sub( robot_location, this.previous_location );

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

    Oracle: function( scene, landmarks, update_frequency )
    {
        // Parameters
        this.update_frequency = update_frequency || 2; // Hz

        this.last_update_time = Date.now();
        
        // Core Loop
        this.update = function( robot_location )
        {
            var observed_landmarks = [];
            
            if (IAB.Components.canUpdate( this.last_update_time, this.update_frequency ))
            {
                this.last_update_time = Date.now();


                /* Compute the visible landmarks
                 *     Note here that we are looking for *all* the landmarks, 
                 *     and selecting them by the 'sensor horizon', or the 
                 *     squared-distance.
                 */

                var landmark = landmarks[Math.floor( Math.random()*landmarks.length )];
            
                observed_landmarks.push( landmark );
                
            }

            return observed_landmarks;
        }

    },

    RangeBearing: function( scene, landmarks, range, update_frequency )
    {
        // Parameters
        this.range = range || 200;
        this.update_frequency = update_frequency || 2; // Hz

        this.geometry = IAB.Primitives.Circle( this.range, 100 );

        scene.add( this.geometry );

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
            var readings = [];
            
            if (IAB.Components.canUpdate( this.last_update_time, this.update_frequency ))
            {
                /* Compute the visible landmarks
                 *     Note here that we are looking for *all* the landmarks, 
                 *     and selecting them by the 'sensor horizon', or the 
                 *     squared-distance.
                 */

                this.geometry.position.copy( robot_location.toVector() );

                var visible_landmarks =  this.tree.nearest( robot_location.toVector(), landmarks.length, Math.pow(this.range,2));

                if ( visible_landmarks.length > 0 )
                {
                    // First object is landmark, second is distance
                    readings.push( visible_landmarks[0][0] );
                }

                this.last_update_time = Date.now();

            }

            return readings;
        }
    },

}

