
var camera, 
    scene, 
    renderer,
    octree,
    geometry, 
    material, 
    mesh,
    meshes = [],
    meshesSearch = [],
    meshCountMax = 1000,
    radius = 500,
    radiusMax = radius * 10,
    radiusMaxHalf = radiusMax * 0.5,
    radiusSearch = 400,
    searchMesh,
    baseR = 255, baseG = 0, baseB = 255,
    foundR = 0, foundG = 255, foundB = 0,
    adding = true;

init();
animate();

function init() {

    // standard three scene, camera, renderer

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    scene.add( camera );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    // create octree

    octree = new THREE.Octree( {
        scene: scene
    } );

    // create object to show search radius and add to scene

    searchMesh = new THREE.Mesh( new THREE.SphereGeometry( radiusSearch ), new THREE.MeshBasicMaterial( { color: 0x00FF00, transparent: true, opacity: 0.4 } ) );
    scene.add( searchMesh );

}

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );

    // modify octree structure by adding/removing objects

    modify_octree();

    // search octree at random location

    search_octree();

    // render results

    render();

}

function modify_octree() {

    // if is adding objects to octree

    if ( adding === true ) {

        // create new object

        geometry = new THREE.CubeGeometry( 50, 50, 50 );
        material = new THREE.MeshBasicMaterial();
        material.color.setRGB( baseR, baseG, baseB );

        mesh = new THREE.Mesh( geometry, material );

        // give new object a random position in radius

        mesh.position.set( Math.random() * radiusMax - radiusMaxHalf, Math.random() * radiusMax - radiusMaxHalf, Math.random() * radiusMax - radiusMaxHalf );

        // add new object to octree and scene

        octree.add( mesh );
        scene.add( mesh );

        // store object for later

        meshes.push( mesh );

        // if at max, stop adding

        if ( meshes.length === meshCountMax ) {

            adding = false;

        }

    }
    // else remove objects from octree
    else {

        // get object

        mesh = meshes.shift();

        // remove from scene and octree

        scene.remove( mesh );
        octree.remove( mesh );

        // if no more objects, start adding

        if ( meshes.length === 0 ) {

            adding = true;

        }

    }

    /*

    // octree details to console

    console.log( ' ============================================================================================================');
    console.log( ' OCTREE: ', octree );
    console.log( ' ... depth ', octree.depth, ' vs depth end?', octree.depth_end() );
    console.log( ' ... num nodes: ', octree.node_count_end() );
    console.log( ' ... total objects: ', octree.object_count_end(), ' vs tree objects length: ', octree.objects.length );
    console.log( ' ============================================================================================================');
    console.log( ' ');

    // print full octree structure to console

    octree.to_console();

     */

}

function search_octree() {

    var i, il;

    // revert previous search objects to base color

    for ( i = 0, il = meshesSearch.length; i < il; i++ ) {

        meshesSearch[ i ].object.material.color.setRGB( baseR, baseG, baseB );

    }

    // new search position

    searchMesh.position.set( Math.random() * radiusMax - radiusMaxHalf, Math.random() * radiusMax - radiusMaxHalf, Math.random() * radiusMax - radiusMaxHalf );

    // record start time

    var timeStart = new Date().getTime();

    // search octree from search mesh position with search radius
    // optional third parameter: boolean, if should sort results by object when using faces in octree
    // optional fourth parameter: vector3, direction of search when using ray (assumes radius is distance/far of ray)

    meshesSearch = octree.search( searchMesh.position, radiusSearch );

    // record end time

    var timeEnd = new Date().getTime();

    // set color of all meshes found in search

    for ( i = 0, il = meshesSearch.length; i < il; i++ ) {

        meshesSearch[ i ].object.material.color.setRGB( foundR, foundG, foundB );

    }

    /*

    // results to console

    console.log( 'OCTREE: ', octree );
    console.log( '... search found ', meshesSearch.length, ' and took ', ( timeEnd - timeStart ), ' ms ' );

     */

}

function render() {

    renderer.render( scene, camera );

}

