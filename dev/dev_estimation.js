
postInit = function(){
    
    var u = new IAB.Controllers.ControlInput(0,0);

    var model = new IAB.Models.Ackermann(2);

    var SigmaV = .1;
    var SigmaPhi = 4*Math.PI/180;
    var state = new IAB.Estimators.State( 0, 0, 0 );
    
    var estimator = new IAB.Estimators.EKF( state, 
            numeric.diag( [.2,.2,0] ), 
            numeric.diag( [Math.pow(SigmaV,2), Math.pow(SigmaPhi,2)]), 
            u, 
            model,
            {update_frequency:2, scene:scene } );

    for( var k=0; k<1; k++ )
    {
        //u = [1, Math.PI/5*Math.sin(4*Math.PI*k/600)];
        //u.copy( new IAB.Controllers.ControlInput( Math.PI/5*Math.sin(4*Math.PI*k/600), 1) );
        //u.copy( new IAB.Controllers.ControlInput( 2,1 ) );
        u.copy( new IAB.Controllers.ControlInput( 2,1 ) );

        //estimator.last_update_time = -1;
        estimator.update( 1 );
    }
}
init();
animate();
