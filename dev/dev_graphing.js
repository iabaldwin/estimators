var ellipse;

postInit = function(){

    ellipse = new IAB.Graphing.Ellipse(100,10);

    scene.add(ellipse.geometry);

}

postRender = function(){ 

        ellipse.move( new THREE.Vector3(0,-1,0) );


};

init();
animate();
setTimeout( function(){ ellipse.update(); }, 2*1000 );
