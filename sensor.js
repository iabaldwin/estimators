var IAB = window.IAB || {};

var Red   = new THREE.Color( 0xff0000 );
var Green = new THREE.Color( 0x00ff00 );

IAB.Sensors=  {

    CanUpdate: function( last_update_time, frequency )
    {
        return ((Date.now() - last_update_time)< 1/frequency*1000) ? false: true;
    },

    Odometry: function()
    {
        // Parameters 
        this.visible = false;

        this.previous_location = new THREE.Vector3( 0, 0, 0 );

        this.update_frequency = 2; // Hz
        this.last_update_time = Date.now();

        this.update = function( robot_location )
        {
            if (IAB.Sensors.CanUpdate( this.last_update_time, this.update_frequency ))
            {
                // Do the update
                var odometry_update = new THREE.Vector3();
                odometry_update.sub( robot_location, this.previous_location );
                this.previous_location = robot_location;

                this.last_update_time = Date.now();
            }
            else
            {
                return;
            }
        }

        return this;
    },

    Ranging: function( scene, landmarks, range )
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
        var tmp = new THREE.Vector3();
        
        this.update_frequency = 2; // Hz
        this.last_update_time = Date.now();
        
        this.update = function( robot_location )
        {

            if (IAB.Sensors.CanUpdate( this.last_update_time, this.update_frequency ))
            {
                this.last_update_time = Date.now();

                // Sensor horizon
                var visible_landmarks =  this.tree.nearest( robot_location, landmarks.length, Math.pow(this.range,2));

                var readings = [];

                for ( var i = 0; i<visible_landmarks.length; i++ )
                {
                    landmark = visible_landmarks[i][0];
                    
                    //visible_landmarks[i][0].material.color = Green;
                    landmark.material.color = Green; 

                    tmp.copy(robot_location);
                    var range = tmp.distanceTo(landmark.position);
                    
                    readings.push( { id:landmark.id, range:range } );
           
                    console.log( readings );
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

