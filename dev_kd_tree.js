var tree;

function distance(a, b) {
    var dx = a.x-b.x;
    var dz = a.z-b.z;
    return Math.sqrt( dx*dx + dz*dz );
}
var origin = {x:0, y:0, z:0 };

postInit = function(){

    camera.position.x = 0;
    camera.position.z = 0;

    camera.lookAt( {x: 0, y:0, z: 0});
    // Add random obstacles
    var num_obstacles = 5;
    var points = [];
    for ( var i=0; i<num_obstacles; i++ )
    {
        var geometry = new THREE.CircleGeometry( 5, 50 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff80, ambient: 0x00ff80, shading: THREE.FlatShading } );
        var mesh    = new THREE.Mesh( geometry, material );

        var x = Math.random() * 200 - 100;
        var y = 0;
        var z = Math.random() * 200 - 100;

        scene.add( mesh );

        mesh.position = new THREE.Vector3(x,y,z);
        mesh.rotation.x += THREE.Math.degToRad( 270 );

        //points.push( [x, z ]);
        points.push( {x: x, z: z });

    }

    tree = new kdTree( points, distance, ["x", "z"] );
    
    // Query point
    var visible_landmarks =  tree.nearest( origin, 1 );

    // Draw a line to the first landmark
    var line_material = new THREE.LineBasicMaterial( { color: 0x00ff00, opacity: 1, linewidth: 2 } );
    var line_geometry = new THREE.Geometry();
    line_geometry.vertices.push( origin );
    line_geometry.vertices.push( { x: visible_landmarks[0][0].x, y:0, z:visible_landmarks[0][0].z} );


    var line_mesh = new THREE.Line(line_geometry, line_material);

    scene.add( line_mesh );

    console.log( visible_landmarks[0][0] );
};

postRender = function(){ 

};


init();
animate();
