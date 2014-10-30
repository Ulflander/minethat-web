web
===

Discontinued project, see [Minethat](https://github.com/Ulflander/minethat) for details.

Node web server for Minethat.

### Install

`npm install`


### Content

- `src` Sources files
- `src/server` Server source files (Node code, and HTML templates)
- `src/client` Client source files (JS and CSS, built by gulp and sent to `dist/static/`)
- `dist` Build directory, served statically
- `dist/js` Generated JS from src/client (static files, generated automatically by gulp)
- `dist/css` Generated CSS from src/client (static files, generated automatically by gulp)
- `dist/private` Private directory for developers, contains:
- `dist/private/plato-web` Static analysis report for Node.js web server (generated automatically by gulp-plato)
- `dist/private/javadoc/` Java API documentation (generated automatically by main project makefile)
- `dist/private/xref/` Java X References (generated automatically by main project makefile)

### Run server

- `node src/server/index.js` to just run node server
- `gulp` to build client and run some QA tools
- `make` run gulp, more QA stuff, then start server
