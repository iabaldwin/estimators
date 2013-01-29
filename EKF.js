postInit = function()
{

    // Build environment
    landmarks = new IAB.Landmark.GenerateRandom( scene, 100 );

    // Add a vehicle
    vehicle = new IAB.Vehicle.Holonomic(scene, landmarks);

    vehicle.addSensor( new IAB.Sensors.Velocity() );

    //// Transition
    //vehicle.addWaypoint( new THREE.Vector3( 100, 0, 100 ) );
    //vehicle.addWaypoint( new THREE.Vector3( 0, 0, 0 ) );
    
    // Or
    //var controller = new IAB.Controllers.Wiggle(1,1);

}

postRender = function()
{
    TWEEN.update();

    vehicle.update();
}
