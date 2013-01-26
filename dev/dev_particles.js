var particleSystem;
postInit = function(){

    var particleCount = 1800,
        particles = new THREE.Geometry(),
        pMaterial =
            new THREE.ParticleBasicMaterial({
                color: 0xFFFFFF,
            size: 20
            });

    // now create the individual particles
    for(var p = 0; p < particleCount; p++) {

        // create a particle with random
        // position values, -250 -> 250
        var pX = Math.random() * 500 - 250,
            pY = Math.random() * 500 - 250,
            pZ = Math.random() * 500 - 250,
            particle = new THREE.Vertex(
                    new THREE.Vector3(pX, pY, pZ)
                    );

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    
    // add it to the scene
    //scene.addChild(particleSystem);
    scene.add(particleSystem);

    // create the particle variables
    pMaterial =
        new THREE.ParticleBasicMaterial({
            color: 0xFFFFFF,
        size: 20,
        map: THREE.ImageUtils.loadTexture(
            "images/particle.png"
            ),
        blending: THREE.AdditiveBlending,
        transparent: true
        });

    particleSystem =
        new THREE.ParticleSystem(
                particles,
                pMaterial);

    // also update the particle system to
    // sort the particles which enables
    // the behaviour we want
    particleSystem.sortParticles = true;

}

postRender = function(){ 

    // add some rotation to the system
    particleSystem.rotation.y += 0.01;

};


init();
animate();
