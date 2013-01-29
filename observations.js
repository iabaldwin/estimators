var IAB = window.IAB || {};

IAB.Observations = 
{

    RangingModel: function( landmarks )
    {
        var temp = new THREE.Vector3();

        this.update = function( vehicle_position )
        {
            // Subtract out the map
            //var distances = landmarks.map( function(x){ return 1; } );

            for( var i=0; i<landmarks.length; i++ )
            {
                var dist = vehicle_position.distanceTo( landmarks[i] );
            }

        }
    }

};
