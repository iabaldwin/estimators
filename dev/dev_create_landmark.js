var Red = new THREE.Color( 0xff0000 );
var Green = new THREE.Color( 0x00ff00 );

var landmark;
postInit = function(){
    var geometry = new THREE.CircleGeometry( 10, 100 );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000} );
    landmark     = new THREE.Mesh( geometry, material );

    scene.add( landmark );
           
    landmark.position.y += .5;
    landmark.rotation.x += THREE.Math.degToRad( 270 );

    landmark.material.color = Red;

    
    setTimeout( changeColor, 1000 );
};

function changeColor(){

    if (landmark.material.color == Red )
    {
        landmark.material.color = Green;
    }
    else
    {
        landmark.material.color = Red;
    }

    setTimeout( changeColor, 1000 );

};

postRender = function(){ };

init();
animate();
