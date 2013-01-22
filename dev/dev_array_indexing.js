arr = [];

for ( var i=0; i < 100; i++ )
{

    var vec = new THREE.Vector3( Math.random() % 100, 0, Math.random() % 100 );
    arr.push( vec );
}

while( true )
{
    ind = Math.floor( Math.random() * arr.length );

    if ( ind != arr.indexOf( arr[ind] ) )
    {
        console.log( ind );
        console.log( arr.indexOf( arr[ind] ) ); 
        break; 
    }

}
