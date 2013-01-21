var IAB = window.IAB || {};

IAB.Vehicle =  {

    Holonomic: function( scene, landmarks )
    {
        // Build vehicle representation
        var vehicle_geometry = new THREE.CircleGeometry( 20, 50 );
        var vehicle_material = new THREE.MeshLambertMaterial( { color: 0x00ff80, ambient: 0x00ff80, shading: THREE.FlatShading, map: THREE.ImageUtils.loadTexture( "../media/texture.jpg" ) } );
        this.mesh            = new THREE.Mesh( vehicle_geometry, vehicle_material );
    
        scene.add( this.mesh );

        this.mesh.position = new THREE.Vector3(0,0,0);
        this.mesh.rotation.x += THREE.Math.degToRad( 270 );

        // Sensors
        this.sensors = [];
        this.sensors.push( new IAB.Sensors.Ranging(scene, landmarks, 100) );
        this.sensors.push( new IAB.Sensors.Odometry() );
        
        var geometry = new THREE.CircleGeometry( 20, 50 );
        var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
        var odometry_mesh = new THREE.Mesh( geometry, material );

        scene.add( odometry_mesh );
        odometry_mesh.position = this.sensors[1].estimate ;
        odometry_mesh.rotation.x += THREE.Math.degToRad( 270 );


        this.getPosition = function()
        {
            return this.mesh.position;
        }

        this.update = function()
        {
            var position = this.getPosition(); 
            this.sensors.forEach( function(sensor){ sensor.update( position ); } );
       
        }

        this.tweenUpdate = function(obj,b)
        {
            //console.log( obj );
        }

        function bind(fn,obj)
        {
            return function(b)
            {
                return fn(obj,b);
            }
        }
        
        this.waypoints  = [];
        this.addWaypoint = function(target)
        {
            var start;
            if ( this.waypoints.length == 0 )
            {  
                start = this.mesh.position;
            }
            else
            {
                start = this.waypoints[this.waypoints.length-1].target;
            }
                
            var tween = new TWEEN.Tween(start).to(target, 20000);
            
            tween.onUpdate( bind( this.tweenUpdate, this ) );
            
            this.waypoints.push( { tween: tween, target:target } ); 

            tween.start();
        }

        return this;
    } 
};
