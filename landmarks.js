var IAB = window.IAB || {};

IAB.Landmarks =  {


    Point: function( scene, num_landmarks )
    {
        this.points = [];

        this.meshes = [];

        for ( var counter = 0; counter<num_landmarks; counter++ )
        {
            var geometry = new THREE.CircleGeometry( 10, 100 );
            var material = new THREE.MeshBasicMaterial( { color: 0xff0000} );
            var landmark = new THREE.Mesh( geometry, material );

            this.meshes.push( landmark );

            scene.add( landmark );

            var random_location = new THREE.Vector3( Math.random()*1000-500,0, Math.random()*1000-500);

            this.points.push( random_location );

            landmark.position = random_location;
            landmark.rotation.x += THREE.Math.degToRad( 270 );
        
        }

    }

};
