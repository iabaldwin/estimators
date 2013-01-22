function my_callback()
{
    console.log(jsonstr);
};

var script = document.createElement('script');
script.type = 'text/javascript';

////script.src = “http://www.someWebApiServer.com/some-data?callback=my_callback”;
//script.src = 'http://localhost:8000/stanford-gates1.log.json?jsonp=my_callback';
script.src = 'http://localhost:8000/log.json?jsonp=my_callback';

document.getElementsByTagName('head')[0].appendChild(script);
//document.body.appendChild(script);

my_callback();

