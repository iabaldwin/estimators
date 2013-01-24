var spline_geometry;

postInit = function(){

    var numPoints = 100;

spline = new THREE.SplineCurve3([
   new THREE.Vector3(0, 0, 0),
   new THREE.Vector3(0, 200, 0),
   new THREE.Vector3(150, 150, 0),
   new THREE.Vector3(150, 50, 0),
   new THREE.Vector3(250, 100, 0),
   new THREE.Vector3(250, 300, 0)
]);

var material = new THREE.LineBasicMaterial({
    color: 0xff00f0,
});

spline_geometry = new THREE.Geometry();
var splinePoints = spline.getPoints(numPoints);

for(var i = 0; i < splinePoints.length; i++){
    spline_geometry.vertices.push(splinePoints[i]);  
}

var line = new THREE.Line(spline_geometry, material);
scene.add(line);
}

var show = true;
postRender = function(){ 
    

    for( var i=0; i<spline_geometry.vertices.length; i++ )
    {
        //if (show)
//{
    //console.log( spline_geometry ); show = false;
//}
        spline_geometry.vertices[i].y -= 1;
    }
        spline_geometry.verticesNeedUpdate= true; 

};


init();
animate();
