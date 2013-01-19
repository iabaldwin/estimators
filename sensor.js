var IAB = window.IAB || {};

var Red = new THREE.Color( 0xff0000 );
var Green = new THREE.Color( 0x00ff00 );

IAB.Sensors=  {

    Odometry: function()
    {
        // Parameters 
        this.visible = false;

        this.previous_location = new THREE.Vector3( 0, 0, 0 );
      
        this.last_update_time = Date.now();

        this.update = function( robot_location )
        {
            var update_time = Date.now() - this.last_update_time;
         
            if ( update_time < 25 )
            {
                return;
            }

            this.last_update_time = Date.now();

            var odometry_update = new THREE.Vector3();
            odometry_update.sub( robot_location, this.previous_location );

            this.previous_location = robot_location;
        }

        return this;
    },

    Ranging: function( scene, landmarks )
    {
        // Parameters
        this.range = 100;

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

            for ( var i = 0; i<visible_landmarks.length; i++ )
            {
                visible_landmarks[i][0].material.color = Green;
            }
        }
    }
}
