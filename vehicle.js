var IAB = window.IAB || {};

IAB.Vehicle =  {

    Holonomic: function( scene, landmarks )
    {
        // Parameters
        this.num_neighbors = 5;

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

        this.line_material = new THREE.LineBasicMaterial({
            color: 0x0000ff,
        });

        // KD tree
        this.tree = new kdTree( landmarks.points, distance, ["x", "y" ]);

        // Line Geometries
        this.line_geometries = [];
        
        this.createLineGeometry = function()
        {
            for ( var i=0; i<this.num_neighbors; i++ )
            {
                //var lineMat = new THREE.LineBasicMaterial( { color: 0x00ff00, opacity: 1, linewidth: 2 } );

                //var geom = new THREE.Geometry();
                //geom.vertices.push( this.mesh.position );
                //geom.vertices.push( this.mesh.position );

                //this.line_geometries[i] = new THREE.Line(geom, lineMat);
            }
        }
        this.createLineGeometry();

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
            var visible_landmarks =  this.tree.nearest( {x: 0, y: 0}, this.num_neighbors );
      
            for ( var i = 0; i<visible_landmarks.length; i++ )
            {
                var index = landmarks.points.indexOf( visible_landmarks[i][0] );
 
                //console.log( landmarks.meshes[index] );
                //this.update = function(){};
   
                //landmarks.meshes[index].material.color = new THREE.Color(0,1,0); 

                //this.line_geometries[i].geometry.vertices[1] = visible_landmarks[i];
                //this.line_geometries[i].geometry.verticesNeedUpdate = true;
                //this.line_geometries[i].geometry.elementsNeedUpdate = true;
                //console.log( this.line_geometries[i] );
            }

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
