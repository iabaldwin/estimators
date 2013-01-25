var IAB = window.IAB || {};

IAB.Graphing = 
{

    Circle: function( r, g )
    {

        var radius = r || 100;
        var granularity = g || 10;

        var arr = numeric.linspace( 0, 2*Math.PI, granularity );

        var x = arr.slice(0);
        var y = arr.slice(0);

        x = x.map( function(x){ return radius*Math.cos(x)} );
        y = y.map( function(x){ return radius*Math.sin(x)} );

        var circle = [];

        for ( var j=0; j<x.length; j++ )
        {
            circle.push( new THREE.Vector3( x[j], 0, y[j] ) );
        }

        spline = new THREE.SplineCurve3( circle );

        var material = new THREE.LineBasicMaterial({
            color: 0xff00f0,
        });

        spline_geometry = new THREE.Geometry();
        var splinePoints = spline.getPoints(circle.length);

        for(var i = 0; i < splinePoints.length; i++){
            spline_geometry.vertices.push(splinePoints[i]);  
        }

        this.geometry = new THREE.Line(spline_geometry, material);

        this.move = function( vector )
        {
            //for( var i=0; i<this.geometry.geometry.vertices.length; i++ )
            //{
                //this.geometry.geometry.vertices[i].addSelf( vector );
            //}
            //this.geometry.geometry.verticesNeedUpdate= true; 
        }

        return this;

    },

    
};

