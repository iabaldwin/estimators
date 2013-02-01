var IAB = window.IAB || {};

IAB.Robotics = {

    SE2: function( x,y,theta )
    {
        this.x = x || 0;
        this.y = y || 0;
        this.theta = theta || 0;

        this.set = function( a,b,c )
        {
            this.x = a; this.y = b; this.theta = c;
        } 

        this.toVector = function()
        {
            return new THREE.Vector3( this.x, 0, this.y );
        }

        this.copy = function( s )
        {
            this.x = s.x;
            this.y = s.y;
            this.theta  = s.theta;
        }
        
        this.composeSelf = function( s1 )
        {
            var angle = this.theta + s1.theta;
          
            angle = (angle > Math.PI || angle <= -1*Math.PI) ? angle % (2*Math.PI)  : angle ;

            var s = Math.sin( this.theta );
            var c = Math.cos( this.theta );
       
            var result = numeric.add( [this.x,this.y], numeric.dot( [[c,-1*s],[s,c]], [s1.x, s1.y]) );

            this.x = result[0];
            this.y = result[1];
            this.theta  = angle;
        }

        this.compose = function( s1, s2 )
        {
            var angle = s1.theta + s2.theta;

            angle = (angle > Math.PI || angle <= -1*Math.PI) ? angle % (2*Math.PI)  : angle ;

            var s = Math.sin( s1.theta );
            var c = Math.cos( s1.theta );
       
            var result = numeric.add( [s1.x,s1.y], numeric.dot( [[c,-1*s],[s,c]], [s2.x, s2.y]) );

            return new IAB.Robotics.SE2( result[0], result[1], angle );
        }
    }
}
