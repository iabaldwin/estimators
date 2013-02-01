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

        this.update = function( state, landmark )
        {
            var tmp = new THREE.Vector3(), loc;

            //var observations = [];

            //for( var i=0; i<landmarks.length; i++ )
            //{
                // Subtract out the map
                loc = tmp.sub( new THREE.Vector3( state.x, 0, state.y ), landmark );

                var range = loc.length();

                var angle = IAB.Observations.math.angleWrap( Math.atan2( loc.x, loc.y )  - state.theta );

                //var observations = {range:range, angle:angle};

                var observations = [range,angle];

                //if (this.debug)
                //{
                    //var line = this.lines[landmark_id];

                    ////line.geometry.vertices[0].copy( state );
                    //line.geometry.vertices[0].x = state.x;
                    //line.geometry.vertices[0].z = state.y;

                    //line.geometry.vertices[1].copy( landmarks[landmark_id].position );

                    //line.geometry.verticesNeedUpdate = true;
                //}
            //}

            return observations;
        }
    },

    MeasurementJacobian: function( state, landmark )
    {
        var tmp = new THREE.Vector3(), loc;

        var loc = tmp.sub( new THREE.Vector3( state.x, 0, state.y ), landmark );

        var range = loc.length(); 

        var rangeSq = loc.lengthSq();

        var jacobian = [[0,0,0],[0,0,0]];

        jacobian[0][0] = -1*loc.x / range;
        jacobian[0][1] = loc.z / range;
        jacobian[1][0] = loc.z / rangeSq;
        jacobian[1][1] = -1*loc.x / rangeSq;
        jacobian[1][2] = -1;

        return jacobian;
    }


};
