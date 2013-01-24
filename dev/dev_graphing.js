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

var geometry = new THREE.Geometry();
var splinePoints = spline.getPoints(numPoints);

for(var i = 0; i < splinePoints.length; i++){
    geometry.vertices.push(splinePoints[i]);  
}

var line = new THREE.Line(geometry, material);
scene.add(line);
}

postRender = function(){ 

};


init();
animate();
