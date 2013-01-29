a = new IAB.Robotics.SE2( 1,2,3);
b = new IAB.Robotics.SE2( 2,3,4);

c = new IAB.Robotics.SE2();

console.log( c.compose(a,b) );

c.copy( a );
c.composeSelf( b );
console.log( c );

