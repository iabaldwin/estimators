var IAB = window.IAB || {};

IAB.Primitives = {

    Line: function()
    {
        var material = new THREE.LineBasicMaterial({
            color: 0x0000ff,
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );


        return new THREE.Line(geometry, material);
    }

};
