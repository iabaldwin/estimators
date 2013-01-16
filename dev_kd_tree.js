var tree;

function distance(a, b) {
    var dx = a.x-b.x;
    var dy = a.y-b.y;
    return dx*dx + dy*dy;
}
var origin = {x:0, y:0, z:0 };

postInit = function(){

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

        points.push( { x: x, y: y, z: z } );

    }
    
    tree = new kdTree( points, distance, ["x", "y" ]);

    // Query point
    var visible_landmarks =  tree.nearest( origin, 1 );

    console.log( visible_landmarks );

    // Draw a line to the closets landmark
    var lineMat = new THREE.LineBasicMaterial( { color: 0x00ff00, opacity: 1, linewidth: 2 } );

    var geom = new THREE.Geometry();
    geom.vertices.push( origin );
    geom.vertices.push( visible_landmarks[0][0] );

                
    var line_geometries = new THREE.Line(geom, lineMat);

    scene.add( line_geometries );

};

postRender = function(){ 

};


init();
animate();
