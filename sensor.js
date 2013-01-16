var IAB = window.IAB || {};

IAB.Sensors=  {

    Ranging: function( scene, landmarks )
    {
        // Parameters
        this.num_neighbors = 5;

        // Distance metric 
        function distance(a, b) {
            var dx = a.x-b.x;
            var dy = a.y-b.y;
            return dx*dx + dy*dy;
        }
 
        // Build KD tree
        this.tree = new kdTree( landmarks.points, distance, ["x", "y" ]);

        // Line Geometries
        //this.line_geometries = [];
        
        //this.createLineGeometry = function()
        //{
            //for ( var i=0; i<this.num_neighbors; i++ )
            //{
                ////var lineMat = new THREE.LineBasicMaterial( { color: 0x00ff00, opacity: 1, linewidth: 2 } );

                ////var geom = new THREE.Geometry();
                ////geom.vertices.push( this.mesh.position );
                ////geom.vertices.push( this.mesh.position );

                ////this.line_geometries[i] = new THREE.Line(geom, lineMat);
            //}
        //}
        //this.createLineGeometry();

        var Red = new THREE.Color( 0xff0000 );
        var Green = new THREE.Color( 0x00ff00 );

        this.update = function( robot_location )
        {
            //console.log( robot_location );
            //var visible_landmarks =  this.tree.nearest( {x: 0, y: 0}, this.num_neighbors );
            var visible_landmarks =  this.tree.nearest( robot_location, this.num_neighbors, 100 );
      
            for ( var i = 0; i<visible_landmarks.length; i++ )
            {
                var index = landmarks.points.indexOf( visible_landmarks[i][0] );

                console.log( index );
                landmarks.meshes[index].material.color = Green;

                //this.line_geometries[i].geometry.vertices[1] = visible_landmarks[i];
                //this.line_geometries[i].geometry.verticesNeedUpdate = true;
                //this.line_geometries[i].geometry.elementsNeedUpdate = true;
                //console.log( this.line_geometries[i] );
            }
        }
    }
}
