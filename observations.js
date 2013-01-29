var IAB = window.IAB || {};

IAB.Observations = 
{

    RangingModel: function( landmarks )
    {
        var temp = new THREE.Vector3();

        
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


        this.update = function( vehicle_position )
        {
            // Subtract out the map
            //var distances = landmarks.map( function(x){ return 1; } );

            for( var i=0; i<landmarks.length; i++ )
            {
                //var tmp = vehicle_position.sub( vehicle_position, landmarks[i] );
                //console.log( landmarks[i] );
                //break;
           
                var line = lines[i];
           
                line.geometry.vertices[0].copy( vehicle_position );
                line.geometry.vertices[1].copy( landmarks[i].position );

                line.geometry.verticesNeedUpdate = true;
            }

        }
    }

};
