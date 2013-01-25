var IAB = window.IAB || {};

IAB.Graphing = 
{
    Ellipse: function( r, g )
    {

        var radius = r || 100;
        var granularity = g || 10;

        var P = [[4,1],[1,4]];

        var ellipse_points = new IAB.Tools.Geometry().covarianceEllipse( P, 1);

        var ellipse = [];

        for ( var j=0; j<ellipse_points.length; j++ )
        {
            ellipse.push( new THREE.Vector3( ellipse_points[j][0], 0, ellipse_points[j][1] ) );
        }

        // Create spline representation
        spline = new THREE.SplineCurve3( ellipse );

        var material = new THREE.LineBasicMaterial({
            color: 0xff00f0,
        });

        spline_geometry = new THREE.Geometry();
        var spline_points = spline.getPoints(ellipse.length-1);

        for(var i = 0; i < spline_points.length; i++){
            spline_geometry.vertices.push(spline_points[i]);  
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

        this.update = function( P, sigma_bound )
        {

            var P = [[14,.1],[.1,14]];
            var sigma_bound = 1;
             
            var ellipse_points = new IAB.Tools.Geometry().covarianceEllipse( P, sigma_bound );

            for ( var i=0; i<this.geometry.geometry.vertices.length; i++ )
            {
                this.geometry.geometry.vertices[i].copy( new THREE.Vector3( ellipse_points[i][0], 0, ellipse_points[i][1] ));
            }
            
            this.geometry.geometry.verticesNeedUpdate= true; 
        }


        return this;

    },

    
};

