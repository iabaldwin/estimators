var container, stats;
var camera, scene, renderer;
var projector, plane, cube;
var mouse2D, mouse3D, raycaster, theta = 45 * 0.5;

var controls,time=Date.now();
var vehicle, controller;
var landmarks;

var postInit = function(){ throw "Must be overridden"; }; // Override me
var postRender = function(){ throw "Must be overridden";}; // Override me

/*
 *Render control
 */
var paused = false;

function run( target_element ) {

    if( !target_element )
    {
        container = document.createElement( 'div' );
        document.body.appendChild( container );
    }
    else
        container = target_element;

    // Initialisaiton routines
    init();
    
    // Go...
    animate();
}

/*
 *Initialisation
 *  1. Create scene
 *  2. Create camera 
 */

function init() {
    
    // Core scene
    scene = new THREE.Scene();

    // Camera
    var SCREEN_WIDTH = container.clientWidth; 
    var SCREEN_HEIGHT = container.clientHeight; 

    console.log( SCREEN_WIDTH + 'x' + SCREEN_HEIGHT );

    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR); 
    camera.position = new THREE.Vector3(100,100,100);

    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    // Controls
    controls = new THREE.TrackballControls( camera );
    //controls.movementSpeed = 1;
    //controls.lookSpeed = .003;

    scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

    // Projection estimation
    projector = new THREE.Projector();

    plane = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200, 10, 10 ), new THREE.MeshBasicMaterial( { color: 0x555555, wireframe: true } ) );
    plane.rotation.x = - Math.PI / 2;
    scene.add( plane );

    // Lighting
    var ambientLight = new THREE.AmbientLight( 0x606060 );
    scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    scene.add( directionalLight );

    renderer = new THREE.WebGLRenderer( {antialias: true, preserveDrawingBuffer: true} );
    //renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    postInit();

}

function onWindowResize() {

    //camera.setSize( window.innerWidth, window.innerHeight );
    //camera.updateProjectionMatrix();
    //renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    event.preventDefault();

}

function onDocumentMouseDown( event ) {

    event.preventDefault();

}

document.addEventListener( 'keypress', onDocumentKeyDown, false );
function onDocumentKeyDown( event ) {

    switch( event.keyCode ) {

        case 32:
        default:
            break;
    }

}

function onDocumentKeyUp( event ) {

    switch( event.keyCode ) {
    }
}

function animate() {

    // Three
    requestAnimationFrame( animate );
  
    // Controls
    controls.update();
    
    if (!paused )
    {
        // Hook
        postRender();
    }
    
    // Render the scene
    renderer.render( scene, camera );

    stats.update();
}

