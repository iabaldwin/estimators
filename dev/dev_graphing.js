var circle;

postInit = function(){

    circle = new IAB.Graphing.Circle(100,10);

    scene.add(circle.geometry);

}

postRender = function(){ 

        circle.move( new THREE.Vector3(0,-1,0) );

};

init();
animate();
