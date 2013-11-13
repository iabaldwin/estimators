var IAB = window.IAB || {};

IAB.Tools = {

    Geometry: function( args ) {

        this.math = new IAB.Tools.Math();
        
        this.covarianceEllipse = function( P, sigma_bound )
        {
            // Initialise circle
            var x_space = numeric.linspace( 0, 2*Math.PI, 100 );
            var y_space = numeric.linspace( 0, 2*Math.PI, 100 );

            // Scale
            x_space = x_space.map( function(x){ return 1*Math.cos(x)} );
            y_space = y_space.map( function(x){ return 1*Math.sin(x)} );
            var zip = _.zip( x_space, y_space );

            // Compute eigenvalues
            var VD = numeric.eig([ [P[0][0], P[0][1]], [P[1][0], P[1][1]] ]) ;

            // Compute transformation
            transformation = numeric.dot( VD.E.x, this.math.matrixSquareRoot( numeric.diag( VD.lambda.x ))) ;

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

        this.angleWrap = function( angle )
        {
            return angle % ( 2*Math.PI );
        }

        this.cumSum = function( vec )
        {
            cumsum = [];

            var len = vec.length;
            for(var a=0; a<len; a++) {
                if(a==0) cumsum[a] = vec[0];
                else cumsum[a] = cumsum[a-1] + vec[a];
            }

            return cumsum;
        }

        //Box-Mueller transform
        this.nrand = function() {
            var x1, x2, rad;

            do {
                x1 = 2 * Math.random() - 1;
                x2 = 2 * Math.random() - 1;
                rad = x1 * x1 + x2 * x2;
            } while(rad >= 1 || rad == 0);

            var c = Math.sqrt(-2 * Math.log(rad) / rad);

            return x1 * c;
        }

        this.nearest = function( num, arr )
        {
            var i = 0, closest, closestDiff, currentDiff;

            closest = arr[0];
            var len = arr.length; 
            for(i;i<len;i++)
            { 
                closestDiff = Math.abs(num - closest);
                currentDiff = Math.abs(num - arr[i]);
                if(currentDiff < closestDiff)
                {
                    closest = arr[i];
                }
                closestDiff = null;
                currentDiff = null;
            }

            return closest;
        }
    }
};
