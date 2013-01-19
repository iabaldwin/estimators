var IAB = window.IAB || {};

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
} else {
    alert('The File APIs are not fully supported in this browser.');
}

IAB.IO = {

    TXT: function( fname )
    {

        console.log( fname );
        var reader = new FileReader();

        reader.readAsDataURL( fname );
        console.log( reader );
   
        console.log( reader.result );
    }
    
};

//IAB.IO.TXT( 'http://localhost:8000/test.txt' );
IAB.IO.TXT( 'http://127.0.0.1:8000/test.txt' );

