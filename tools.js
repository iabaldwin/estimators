var IAB = window.IAB || {};

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
} else {
    alert('The File APIs are not fully supported in this browser.');
}

IAB.IO = {

    TXT: function( fname )
    {

        var reader = new FileReader();

        reader.readAsText( fname );
   
        console.log( reader.result );
    }
    
};

IAB.IO.TXT( '/Users/ian/code/web/estimators/test.txt' );

