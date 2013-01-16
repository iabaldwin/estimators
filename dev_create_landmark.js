postInit = function(){
    var geometry = new THREE.CircleGeometry( 10, 100 );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000} );
    var landmark = new THREE.Mesh( geometry, material );

    scene.add( landmark );
           
    landmark.position.y += .5;
    landmark.rotation.x += THREE.Math.degToRad( 270 );

    //landmark.material.color = new THREE.Color( 0x00ff00 );
    landmark.material.color = 0x00ff00;

};


postRender = function(){ };

init();
animate();
