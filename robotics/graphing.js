var IAB = window.IAB || {};

IAB.Graphing = 
{
    Ellipse: function( state, P, sigma_bound, args )
    {
        var ellipse_points = new IAB.Tools.Geometry().covarianceEllipse( P, sigma_bound );

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

        // Update geometry
        this.update = function( state, P, sigma_bound )
        {
            var ellipse_points = new IAB.Tools.Geometry().covarianceEllipse( P, sigma_bound );

            for ( var i=0; i<this.geometry.geometry.vertices.length; i++ )
            {
                this.geometry.geometry.vertices[i].copy( new THREE.Vector3( ellipse_points[i][0], 0, ellipse_points[i][1] ));
            }

            this.geometry.position.x = state.x;
            this.geometry.position.z = state.y;

            //Update
            this.geometry.geometry.verticesNeedUpdate= true; 
        }

        // Add it to the scene
        args.scene.add(this.geometry);
        
        return this;
    }
    
};

