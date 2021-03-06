postInit = function()
{
    // Controller type
    var controller = new IAB.Controllers.Constant(.05, 12);
        
    // Controller input
    var control_input = new IAB.Controllers.ControlInput();
        
    // Model
    var model = new IAB.Models.Ackermann(2); //Wheelbase
       
    // Start state
    var state = new IAB.Robotics.SE2();
    
    // Process uncertainty
    var SigmaPhi = 4*Math.PI/180;
    var SigmaV = .1;

    var P = [[.2,0,0],[0,.2,0],[0,0,0]];
    var Q = [[Math.pow(SigmaPhi,2),0],[0, Math.pow(SigmaV,2)]];

    // Estimator type
    var estimator = new IAB.Estimators.EKF( state, P, Q, control_input, model, landmarks, {scene:scene, update_frequency:20 });

    // Vehicle
    vehicle = new IAB.Vehicle.Holonomic(scene, []);
    
    vehicle.setController( controller )
            .setModel( model )
            .controlInput( control_input )
            .initialState( state )
            .setEstimator( estimator );
    
}

postRender = function()
{
    TWEEN.update();

    // Run estimation in an open-loop fashion
    vehicle.update();
}
