var Red = new THREE.Color( 0xff0000 );
var Green = new THREE.Color( 0x00ff00 );

postInit = function(){
    var geometry = new THREE.CircleGeometry( 10, 100 );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000} );
    var landmark = new THREE.Mesh( geometry, material );

    scene.add( landmark );
           
    landmark.position.y += .5;
    landmark.rotation.x += THREE.Math.degToRad( 270 );

    //landmark.material.color = new THREE.Color( 0x00ff00 );
    landmark.material.color = Red;

    function bind(fn,obj)
    {
        return function(b)
        {
            return(obj,b);
        }

    }

    var bound= bind( changeColor, landmark );

    //setTimeout( changeColor(landmark), 10000 );
    setTimeout( bound, 100 );
};

function changeColor(landmark){

    if (landmark.material.color == Red )
    {
        landmark.material.color = Green;
    }
    else
    {
        landmark.material.color = Red;
    }

    //setTimeout( changeColor(landmark), 1000 );

};

postRender = function(){ };

init();
animate();
