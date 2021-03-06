postInit = function()
{
    // Environment
    var landmarks = new IAB.Landmark.GenerateRandom( scene, 20 );

    // Controller type
    var controller = new IAB.Controllers.Constant(.08, 20);
        
    // Controller input
    var control_input = new IAB.Controllers.ControlInput();
        
    // Model
    var model = new IAB.Models.Ackermann(2); //Wheelbase
       
    // Start state
    var state = new IAB.Robotics.SE2( -10, 10, 10);
    
    // Uncertainties
    var SigmaPhi = 4*Math.PI/180;
    var SigmaV = .1;

    var P = [[.2,0,0],[0,.2,0],[0,0,0]];
    var Q = [[Math.pow(SigmaPhi,2),0],[0, Math.pow(SigmaV,2)]];

    // Estimator type
    var estimator = new IAB.Estimators.PF( state, 100, control_input, model, landmarks, {scene:scene, update_frequency:20 });

    // Sensors
    //var sensor = new IAB.Sensors.RangeBearing( scene, landmarks, 50, 2 );
    var sensor = new IAB.Sensors.Oracle( scene, landmarks, 2 );

    // Vehicle
    vehicle = new IAB.Vehicle.Holonomic(scene, landmarks );
    
    vehicle.setController( controller )
            .setModel( model )
            .controlInput( control_input )
            .initialState( state )
            .setEstimator( estimator )
            .addSensor( sensor );
   
    scene.add( new THREE.AxisHelper(10) );
}

postRender = function()
{
    vehicle.update();
}
