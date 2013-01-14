var IAB = window.IAB || {};

IAB.Vehicle =  {

    Holonomic: function( scene, landmarks )
    {
        // Build representation
        var geometry = new THREE.CircleGeometry( 20, 50 );
        var material = new THREE.MeshLambertMaterial( { color: 0x00ff80, ambient: 0x00ff80, shading: THREE.FlatShading, map: THREE.ImageUtils.loadTexture( "../media/texture.jpg" ) } );
        this.mesh = new THREE.Mesh( geometry, material );
    
        scene.add( this.mesh );

        this.mesh.position = new THREE.Vector3(0,0,0);
        this.mesh.rotation.x += THREE.Math.degToRad( 270 );

        // Distance metric 
        function distance(a, b) {
            var dx = a.x-b.x;
            var dy = a.y-b.y;
            return dx*dx + dy*dy;
        }

        // KD tree
        this.tree = new kdTree( landmarks.points, distance, ["x", "y" ]);

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
            console.log( this.tree.nearest( {x: 0, y: 0}, 3 ) );
        }

        this.tween_update = function(obj,b)
        {
            console.log( obj );
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

            var bound  = bind( this.tween_update, this );

            tween.onUpdate( bound );

            tween.start();
        }
    } 

};
