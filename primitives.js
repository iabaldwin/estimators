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
    },

    Triangle: function()
    {
        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3( -2, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( -3, 0, 4 ) );
        geometry.vertices.push( new THREE.Vector3( 5, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( -3, 0, -4 ) );
        geometry.vertices.push( new THREE.Vector3( -2, 0, 0 ) ); 

        var material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );

        return new THREE.Line( geometry, material );

    }

};
