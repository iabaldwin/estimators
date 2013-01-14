var container, stats;
var camera, scene, renderer;
var projector, plane, cube;
var mouse2D, mouse3D, raycaster,
    theta = 45 * 0.5;

var controls,time=Date.now();
var vehicle;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    
    scene = new THREE.Scene();

    camera = new THREE.CombinedCamera( window.innerWidth, window.innerHeight, 45, 1, 10000, -2000, 10000 );
    camera.position = new THREE.Vector3(300,300,300);
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    //controls = new THREE.TrackballControls( camera );
    //controls = new THREE.RollControls( camera );
    //controls.movementSpeed = 1;
    //controls.lookSpeed = .003;

    projector = new THREE.Projector();

    plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 20, 20 ), new THREE.MeshBasicMaterial( { color: 0x555555, wireframe: true } ) );
    plane.rotation.x = - Math.PI / 2;
    scene.add( plane );

    // Lighting
    var ambientLight = new THREE.AmbientLight( 0x606060 );
    scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    scene.add( directionalLight );

    renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    // Build environment
    var landmarks = new IAB.Landmarks.Point( scene, 100 );
   
    // Add a vehicle
    vehicle = new IAB.Vehicle.Holonomic(scene, landmarks);
   
    // Transition
    vehicle.move( new THREE.Vector3( 100, 0, 100 ) );

    
}

function onWindowResize() {

    //camera.setSize( window.innerWidth, window.innerHeight );
    //camera.updateProjectionMatrix();
    //renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    event.preventDefault();

    //mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    //mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onDocumentMouseDown( event ) {

    event.preventDefault();

}

function onDocumentKeyDown( event ) {

    switch( event.keyCode ) {
    }

}

function onDocumentKeyUp( event ) {

    switch( event.keyCode ) {
    }
}

function animate() {

    requestAnimationFrame( animate );
    render();
    
    stats.update();

}

function render() {

    //camera.position.x = 1400 * Math.sin( THREE.Math.degToRad( theta ) );
    //camera.position.z = 1400 * Math.cos( THREE.Math.degToRad( theta ) );

    //camera.lookAt( scene.position );
    //camera.lookAt( vehicle.position() );

    //controls.update( Date.now() - time );    
    renderer.render( scene, camera );
    
    TWEEN.update();

    vehicle.update();

    time = Date.now();

}
