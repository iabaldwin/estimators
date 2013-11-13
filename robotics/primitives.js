var IAB = window.IAB || {};

IAB.Primitives = {

    Line: function( line_color )
    {
        var color = line_color || 0xff0000;

        var material = new THREE.LineBasicMaterial({
            color: color,
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

    },

    Circle: function( radius, granularity )
    {

        var material = new THREE.LineBasicMaterial({
            color: 0x808080,
        });

        var geometry = new THREE.Geometry();

        var angles = numeric.linspace( 0, 2*Math.PI, granularity );

        var x,z;
        
        for (var i=0; i<angles.length; i++ )
        {
            x = radius*Math.cos( angles[i] );
            z = radius*Math.sin( angles[i] );
            geometry.vertices.push( new THREE.Vector3( x, 0, z ) );
        }

        return new THREE.Line(geometry, material);
    }
};
