var IAB = window.IAB || {};

IAB.Tools = {

    Plotting: function() {

       

        this.drawCovarianceEllipse = function( state, P, sigma_bound )
        {
            // Compute eigenvalue decomposition
            var VD = numeric.eig(P) ;
            console.log( VD );
      
            // Initialise circle
            var x_space = numeric.linspace( 0, 2*Math.PI, 100 );
            var y_space = numeric.linspace( 0, 2*Math.PI, 100 );
     
            x_space = x_space.map( function(x){ return Math.cos(x)} );
            y_space = y_space.map( function(x){ return Math.cos(x)} );
       
            var f = Flotr.draw( 
                    $('container'), 
                    [{data:x_space,
                    data:y_space}]);
        }

    }


};
