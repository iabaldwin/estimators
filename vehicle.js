var IAB = window.IAB || {};

IAB.Vehicle =  {

    Holonomic: function( scene, landmarks )
    {
        // Build vehicle representation
        var geometry = new THREE.CircleGeometry( 20, 50 );
        var material = new THREE.MeshLambertMaterial( { color: 0x00ff80, ambient: 0x00ff80, shading: THREE.FlatShading, map: THREE.ImageUtils.loadTexture( "../media/texture.jpg" ) } );
        this.mesh    = new THREE.Mesh( geometry, material );
    
        scene.add( this.mesh );

        this.mesh.position = new THREE.Vector3(0,0,0);
        this.mesh.rotation.x += THREE.Math.degToRad( 270 );

        // Sensor suite
        this.sensor = new IAB.Sensors.Ranging(scene,landmarks);
        
        this.set = function( vector )
        {
            this.mesh.position = vector; 
        }

        this.position = function()
        {
            return this.mesh.position;
        }

        this.update = function()
        {
            this.sensor.update( this.position() );
        }

        this.tweenUpdate = function(obj,b)
        {
            //console.log( obj );
        }

        this.move = function(target)
        {
            var tween = new TWEEN.Tween(this.mesh.position).to(target, 20000);
   
            function bind(fn,obj)
            {
                return function(b)
                {
                    return fn(obj,b);
                }
            }

            var bound  = bind( this.tweenUpdate, this );

            tween.onUpdate( bound );

            tween.start();
        }
    } 
};
