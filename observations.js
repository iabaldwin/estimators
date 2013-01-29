var IAB = window.IAB || {};

IAB.Observations = 
{
    math: new IAB.Tools.Math(),

    RangingModel: function( landmarks, debug )
    {
        if (debug)
        {
            var material = new THREE.LineBasicMaterial({
                color: 0x0000ff,
            });

            var lines = [];
            for ( var i=0; i<landmarks.length; i++ )
            {
            
                var geometry = new THREE.Geometry();

                geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
                geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
      
                var line = new THREE.Line(geometry, material);
              
                scene.add(line);

                lines.push( line );
            }
        }

        this.update = function( vehicle_position )
        {
            var tmp = new THREE.Vector3(), loc;

            var observations = [];

            for( var i=0; i<landmarks.length; i++ )
            {
                // Subtract out the map
                loc = tmp.sub( new THREE.Vector3( vehicle_position.x, 0, vehicle_position.y ), landmarks[i] );

                var range = loc.length();

                var angle = IAB.Observations.math.angleWrap( Math.atan2( loc.x, loc.y )  - vehicle_position.theta );

                observations.push( {range:range, angle:angle} );

                if (debug)
                {
                    var line = lines[i];

                    line.geometry.vertices[0].copy( vehicle_position );
                    line.geometry.vertices[1].copy( landmarks[i].position );

                    line.geometry.verticesNeedUpdate = true;
                }
            }

            return observations;
        }
    }
};
