var IAB = window.IAB || {};

IAB.Robotics = {

    SE2: function( x,y,theta )
    {
        this.x = x || 0;
        this.y = y || 0;
        this.theta = theta || 0;
   
        this.copy = function( s )
        {
            this.x = s.x;
            this.y = s.y;
            this.theta  = s.theta;
        }
        
        this.composeSelf = function( s )
        {
            var angle = this.theta + s.theta;

            var s = Math.sin( s.theta );
            var c = Math.cos( s.theta );
       
            //var result = numeric.add( [s.x s.y], numeric.dot( [[c,-1*s],[s,c]], 
        }

        this.compose = function( s1, s2 )
        {
            var angle = s1.theta + s2.theta;

            console.log( angle );
            angle = (angle > Math.PI || angle <= -1*Math.PI) ? angle % (2*Math.PI)  : angle ;
            console.log( angle );

            var s = Math.sin( s1.theta );
            var c = Math.cos( s1.theta );
       
            var result = numeric.add( [s1.x,s1.y], numeric.dot( [[c,-1*s],[s,c]], [s2.x, s2.y]) );

            return new IAB.Robotics.SE2( result[0], result[1], angle );
        }
    }
}
