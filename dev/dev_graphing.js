var ellipse;

postInit = function(){

    var cov = [[4,.1],[.1,4]];

    ellipse = new IAB.Graphing.Ellipse(null, cov, 1, {scene:scene} );
}

postRender = function(){ 

        ellipse.move( new THREE.Vector3(0,-1,0) );
};

init();
animate();
setTimeout( function(){ ellipse.update(); }, 2*1000 );
