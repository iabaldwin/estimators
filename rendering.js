var IAB = window.IAB || {};

IAB.Tools = {

    Plotting: function() {

        this.math = new IAB.Tools.Math();
        this.drawCovarianceEllipse = function( state, P, sigma_bound )
        {
                        

            // Initialise circle
            var x_space = numeric.linspace( 0, 2*Math.PI, 100 );
            var y_space = numeric.linspace( 0, 2*Math.PI, 100 );
     
            x_space = x_space.map( function(x){ return Math.cos(x)} );
            y_space = y_space.map( function(x){ return Math.sin(x)} );

            var zip =  _.zip( x_space, y_space );

                     
            // Compute eigenvalue decomposition
            var VD = numeric.eig(P) ;

            //console.log( numeric.prettyPrint( P ) );
            //console.log( numeric.prettyPrint( VD.E.x ) );
            //console.log( numeric.prettyPrint( numeric.diag( VD.lambda.x.reverse() ) ) );

            var t = numeric.dot( VD.E.x, this.math.matrixSquareRoot( numeric.diag( VD.lambda.x.reverse() ))) ;

            var transforms = _.map( zip, function(x){ return  numeric.dot( t,x );} );

            var f = Flotr.draw(
                    $('container'), 
                    [ transforms ], 
                    {points: {show: true}});

        }

        },

    Math: function()
    {

        this.matrixSquareRoot = function( M )
        {
            // Compute  determinant
            var sig = numeric.det( M );
            var s = Math.sqrt( sig );
            var t = Math.sqrt( (M[0][0] + M[1][1]) + 2*s );
           
            return [[(M[0][0]+s)/t, M[0][1]/t],[M[1][0]/t,(M[1][1]+s)/t]];
        }


    }


};
