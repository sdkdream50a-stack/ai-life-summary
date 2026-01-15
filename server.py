#!/usr/bin/env python3
import http.server
import os

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Remove trailing slash
        path = self.path.rstrip('/')

        # If path has no extension and is not root
        if path and '.' not in os.path.basename(path):
            # Try adding .html
            html_path = path + '.html'
            file_path = '.' + html_path
            if os.path.isfile(file_path):
                self.path = html_path

        return super().do_GET()

if __name__ == '__main__':
    PORT = 3000
    with http.server.HTTPServer(('', PORT), CleanURLHandler) as httpd:
        print(f'Server running at http://localhost:{PORT}')
        httpd.serve_forever()
