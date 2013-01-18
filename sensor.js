var IAB = window.IAB || {};

var Red = new THREE.Color( 0xff0000 );
var Green = new THREE.Color( 0x00ff00 );

IAB.Sensors=  {

    Ranging: function( scene, landmarks )
    {
        // Parameters
        this.num_neighbors = 1;

        // Distance metric 
        function distance(a, b) {
            var dx = a.x-b.x;
            var dz = a.z-b.z;
            return dx*dx + dz*dz;
        }
 
        // Build KD tree
        this.tree = new kdTree( landmarks.locations, distance, ["x", "z" ]);

        this.createNode = function( node_location )
        {
            console.log( node_location );
            var geometry = new THREE.CircleGeometry( 20, 50 );
            var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
            var mesh     = new THREE.Mesh( geometry, material );
    
            scene.add( mesh );

            mesh.position = new THREE.Vector3( node_location.x, 0, node_location.z );;
            mesh.rotation.x += THREE.Math.degToRad( 270 );
       
        }

        this.update = function( robot_location )
        {
            var visible_landmarks =  this.tree.nearest( robot_location, this.num_neighbors );
  
            for ( var i = 0; i<visible_landmarks.length; i++ )
            {
                var index = landmarks.locations.indexOf( visible_landmarks[i][0] );

                landmarks.landmarks[index].material.color = Green;
            }
        }

        this.addNode = function(robot_location){
            // Build vehicle representation
            var geometry = new THREE.CircleGeometry( 5, 50 );
            var material = new THREE.MeshBasicMaterial( { color: 0x0000ff, ambient: 0x00ff80, shading: THREE.FlatShading} );
            var mesh    = new THREE.Mesh( geometry, material );
            
            scene.add( mesh );

            mesh.position = new THREE.Vector3( robot_location.x, robot_location.y, robot_location.z );
            mesh.rotation.x += THREE.Math.degToRad( 270 );

        }
    }
}
