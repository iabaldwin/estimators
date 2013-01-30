var IAB = window.IAB || {};

IAB.Observations = 
{
    math: new IAB.Tools.Math(),

    RangingModel: function( landmarks, debug )
    {
        this.debug = debug;

        if (this.debug)
        {
            this.lines = [];
            
            var material = new THREE.LineBasicMaterial({
                color: 0x0000ff,
            });

            for ( var i=0; i<landmarks.length; i++ )
            {
            
                var geometry = new THREE.Geometry();

                geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
                geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
      
                var line = new THREE.Line(geometry, material);
              
                scene.add(line);

                this.lines.push( line );
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

                if (this.debug)
                {
                    var line = this.lines[i];

                    //line.geometry.vertices[0].copy( vehicle_position );
                    line.geometry.vertices[0].x = vehicle_position.x;
                    line.geometry.vertices[0].z = vehicle_position.y;

                    line.geometry.vertices[1].copy( landmarks[i].position );

                    line.geometry.verticesNeedUpdate = true;
                }
            }

            return observations;
        }
    },

    MeasurementJacobian: function( vehicle_position, landmark )
    {
        var tmp = new THREE.Vector3(), loc;

        var loc = tmp.sub( new THREE.Vector3( vehicle_position.x, 0, vehicle_position.y ), landmark );

        var range = loc.length(); 

        var rangeSq = loc.lengthSq();

        var jacobian = [[0,0,0],[0,0,0]];

        jacobian[0][0] = -1*loc.x / range;
        jacobian[0][1] = loc.z / range;
        jacobian[1][0] = loc.z / rangeSq;
        jacobian[1][1] = -1*loc.x / rangeSq;
        jacobian[1][2] = -1;

    }


};
