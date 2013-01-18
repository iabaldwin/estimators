var IAB = window.IAB || {};

IAB.Landmark =  {
    
    Point: function( scene )
    {
        var geometry = new THREE.CircleGeometry( 10, 100 );
        var material = new THREE.MeshBasicMaterial( { color: 0xff0000} );
        var landmark = new THREE.Mesh( geometry, material );

        return landmark;
    },
    
    GenerateRandom: function(scene, num_landmarks)
    {
        var landmarks = [];
        var locations = [];

        for ( var i = 0; i<num_landmarks; i++ )
        {
            // Create landmark
            var landmark = new IAB.Landmark.Point(scene); 
       
            // Add it to the scene
            scene.add( landmark );

            // Randomise position
            var landmark_location = new THREE.Vector3( Math.random()*1000-500,0, Math.random()*1000-500);

            landmark.position = landmark_location;
            landmark.rotation.x += THREE.Math.degToRad( 270 );
        
            landmarks.push( landmark );
            locations.push( landmark_location );
        }

        return { landmarks:landmarks, locations:locations };
    }

};
