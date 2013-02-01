var IAB = window.IAB || {};

IAB.Landmark =  {
    
    Point: function( position )
    {
        this.geometry = new THREE.CircleGeometry( 2, 20 );
        this.material = new THREE.MeshBasicMaterial( { color: 0xff0000} );
        this.mesh    = new THREE.Mesh( this.geometry, this.material );

        this.mesh.position = position;
        this.mesh.rotation.x += THREE.Math.degToRad( 270 );

        // Getters
        this.x = this.mesh.position.x;
        this.y = this.mesh.position.y;
        this.z = this.mesh.position.z;

        // Reference
        this.position = this.mesh.position;
        this.id = this.mesh.id;
    },
    
    GenerateRandom: function(scene, num_landmarks)
    {
        var landmarks = [];

        var upper_limit = 200;

        for ( var i = 0; i<num_landmarks; i++ )
        {
            // Randomise position
            var landmark_location = new THREE.Vector3( Math.random()*upper_limit - (upper_limit/2), 0, Math.random()*upper_limit - (upper_limit/2));

            // Create landmark
            var landmark = new IAB.Landmark.Point(landmark_location); 
       
            // Add it to the scene
            scene.add( landmark.mesh );
        
            landmarks.push( landmark );
        }

        return landmarks;
    }

};
