var IAB = window.IAB || {};

IAB.Tools = {

    Geometry: function() {

        this.math = new IAB.Tools.Math();
        
        this.covarianceEllipse = function( P, sigma_bound )
        {
            // Initialise circle
            var x_space = numeric.linspace( 0, 2*Math.PI, 100 );
            var y_space = numeric.linspace( 0, 2*Math.PI, 100 );
     
            x_space = x_space.map( function(x){ return 10*Math.cos(x)} );
            y_space = y_space.map( function(x){ return 10*Math.sin(x)} );

            var zip =  _.zip( x_space, y_space );

            // Compute eigenvalues
            //var VD = numeric.eig(P) ;
            var VD = numeric.eig([ [P[0][0], P[0][1]], [P[1][0], P[1][1]] ]) ;

            //console.log( numeric.prettyPrint( this.math.matrixSquareRoot( numeric.diag( VD.lambda.x.reverse()  ) ) ) );

            // Compute transformation
            transformation = numeric.dot( VD.E.x, this.math.matrixSquareRoot( numeric.diag( VD.lambda.x.reverse() ))) ;

            // Transform points
            var transforms = _.map( zip, function(x){ return numeric.dot( transformation,x );} );

            return transforms;
        }

        },

    Math: function()
    {

        this.matrixSquareRoot = function( M )
        {
            /*
             *Compute the square root of a 2x2 system, using
             * (1)  Determinant
             * (2)  Trace
             */

            // Compute  determinant
            var sig = numeric.det( M );
            var s = Math.sqrt( sig );
            var t = Math.sqrt( (M[0][0] + M[1][1]) + 2*s );
           
            return [[(M[0][0]+s)/t, M[0][1]/t],[M[1][0]/t,(M[1][1]+s)/t]];
        }

        this.sec = function(val)
        {
            return 1/Math.cos(val);
        }
    }
};
