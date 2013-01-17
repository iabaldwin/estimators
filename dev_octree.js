var tree;

postInit = function(){

    tree = new THREE.Octree({
            depthMax: -1, // optional, default = -1, infinite depth
            objectsThreshold: 8, // optional, default = 8
            overlapPct: 0.15, // optional, default = 0.15 (15%), this helps sort objects that overlap nodes
            scene: scene // optional, pass scene as parameter only if you wish to visualize octree
    } );


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

        //points.push( 

        //tree.add( { x: x, y: y, z: z } );
        tree.add( new THREE.Vector3( x, y, z ) );
    }
  
    var origin = {x:0, y:0, z:0 };

    // Query point
    var visible_landmarks =  tree.search( origin, .1, true );

    console.log( visible_landmarks );
    
    // Draw a line to the first landmark
    var line_material = new THREE.LineBasicMaterial( { color: 0x00ff00, opacity: 1, linewidth: 2 } );
    var line_geometry = new THREE.Geometry();
    line_geometry.vertices.push( origin );
    line_geometry.vertices.push( visible_landmarks[0].object);

    var line_mesh = new THREE.Line(line_geometry, line_material);

    scene.add( line_mesh );
};

postRender = function(){ 

};


init();
animate();
