var container, stats;
var camera, scene, renderer;
var projector, plane, cube;
var mouse2D, mouse3D, raycaster,
    theta = 45 * 0.5;

var time=Date.now();

// Overload these
var postRender = function(){};
var postInit = function(){};

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // Core scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.CombinedCamera( window.innerWidth, window.innerHeight, 45, 1, 10000, -2000, 10000 );
    camera.position = new THREE.Vector3(300,300,300);
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
    
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

    postInit();
}

function animate() {

    requestAnimationFrame( animate );
    render();
    stats.update();

}

function render() {

    renderer.render( scene, camera );
    
    TWEEN.update();

    postRender();
}

