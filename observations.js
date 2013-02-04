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

        var tmp = new THREE.Vector3(), loc;
        this.update = function( state, landmark )
        {
            // Subtract out the map
            loc = tmp.sub( new THREE.Vector3( state.x, 0, state.y ), landmark );

            var range = loc.length();

            var angle = IAB.Observations.math.angleWrap( Math.atan2( loc.x, loc.y )  - state.theta );

            var observations = [range,angle];

            return observations;
        }
    },

    MeasurementJacobian: function( state, landmark )
    {
        var tmp = new THREE.Vector3(), loc;

        var loc = tmp.sub( landmark, new THREE.Vector3( state.x, 0, state.y ) );

        var range = loc.length(); 
        var rangeSq = loc.lengthSq();

        var jacobian = [[0,0,0],[0,0,0]];

        jacobian[0][0] = -1*loc.x / range;
        jacobian[0][1] = -1*loc.z / range;
        jacobian[1][0] = loc.z / rangeSq;
        jacobian[1][1] = -1*loc.x / rangeSq;
        jacobian[1][2] = -1;

        return jacobian;
    },

    MeasurementHistory: function( scene )
    {
        // Lines
        var history = [] 

        var max_items = 12;

        this.addMeasurement = function( state,  landmark ) {

            if ( history.length >= max_items )
            {
                var el = history.shift();
                scene.remove( el[0] );
            }

            // Add in a new measurement
            var landmark_line = IAB.Primitives.Line();
            scene.add( landmark_line );

            landmark_line.geometry.vertices[0].x = state.x;
            landmark_line.geometry.vertices[0].z = state.y;
            landmark_line.geometry.vertices[1].copy( landmark.position );
            landmark_line.geometry.verticesNeedUpdate = true;

            history.push( [landmark_line, 1.0] );

        }

        this.update = function() 
        {
            var len = history.length;
            for ( var i=0; i<len; i++ )
            {
                history[i][0].material.opacity -= .01;
            }
        }
    }
};
