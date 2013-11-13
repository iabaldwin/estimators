var IAB = window.IAB || {};

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
} else {
    alert('The File APIs are not fully supported in this browser.');
}

// Note: The file system has been prefixed as of Google Chrome 12:
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
//window.requestFileSystem( window.TEMPORARY, 1024*1024, init, errorHandler );

IAB.Dataserver = {

    ROOT: 'http://localhost:8000',

    STANFORD: 'http://localhost:8000/stanford-gates1/stanford-gates1.log.json'

};


IAB.IO = {

    JSON: function( json_name, fn )
    {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', json_name, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4) {
                var json_text = xobj.responseText;
                fn( json_text );
            }
        }
        xobj.send(null);
}
};

function Data()
{
    this.update = function(data)
    {
        this.data = data;
    }

    this.examine = function()
    {
        //var json = JSON.parse(this.data);

        console.log( json[0] );
        console.log( this.data );
    }
}

var d = new Data();

//IAB.IO.JSON( 'log.json', d.update.bind(d) );
IAB.IO.JSON( IAB.Dataserver.STANFORD, d.update.bind(d) );

//setTimeout( function(){console.log(d.data);}, 1000 );
setTimeout( d.examine.bind(d), 1000 );

