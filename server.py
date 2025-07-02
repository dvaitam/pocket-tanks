from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 5000
DIRECTORY = 'src'

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=DIRECTORY, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)


if __name__ == '__main__':
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, Handler)
    print(f"Serving on http://localhost:{PORT}")
    httpd.serve_forever()
