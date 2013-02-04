from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import pprint
import cgi

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
        
        if ctype == 'multipart/form-data':
            postvars = cgi.parse_multipart(self.rfile, pdict)
        elif ctype == 'application/x-www-form-urlencoded':
            length = int(self.headers.getheader('content-length'))
            postvars = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
        else:

            postvars = {}

        pprint.pprint( postvars )

server = HTTPServer(('', 8088), Handler)
server.serve_forever()

