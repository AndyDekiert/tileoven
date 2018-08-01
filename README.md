# General Info

TileOven is a fork of TileMill, with fixed dependencies (`npm-shrinkwrap.json`) to ensure it is still buildable in the future. Also this fork is tested and build on CentOS 7.5 with NodeJS 6.9.1 and Mapnik 2.2.0.

I did not find any fork of the original TileMill with fixed depencencies, hence these were all not buildable without some heavy tweaking (as time passed new versions of dependencies were released which did not work together anymore...). Hopefully this fork will do better over time.

TileOven works only in server mode, no native packages are provided. Platforms other than CentOS 7.5 should theoretically work, but aren't tested.

# Installation
To build and install TileOven you will first need to build and install it's dependencies Mapnik and NodeJS. The repository [tileoven-centos7-dependencies](https://github.com/andydekiert/tileoven-centos7-dependencies) will provide you with the versions which I used. Just follow the instructions in the `Readme.md` of that repository before continuing here.

Once above dependencies are built and installed:
1. Install further TileOven build dependencies:
   ```bash
   yum install protobuf-devel protobuf-compile
   ```
   
2. Clone this repository to a location of your liking, e.g. `/usr/local/src`.
   ```bash
   cd /usr/local/src
   git clone https://github.com/andydekiert/tileoven
   ```
   
3. Build and install TileOven - let `npm-shrinkwrap.json` do it's magic:
   ```bash
   cd tileoven
   npm install
   ```
   
4. Launch TileOven:
   ```
   ./index.js
   ```
   You can then view TileOven at http://localhost:20009 in your favorite web browser.
   

# Upstream Readme: Not maintained / Might not be fully applicable

## Changelog of TileOven since forking from TileMill
### Features

- Forked millstone dependency, Node 6 now supported
- Support for Node 4, thanks to patches and updated dependencies of @paulovieira
- Added layer selection to map panel for fast comparisons with OSM and to save render time for low zoom levels
- Added search field to layer panel
- Added search field to styles panel
- Added cloning of layers to layer panel
- Layer actions only shown on hover, ideal for long layer names and reduces visual noise
- Increased size of layer panel
- Updated carto and node-mapnik dependencies, new CartoCSS commands available
- Remember last selected folder in new layer dialog
- Better compatibility with kosmtik, TileOven mml project files should work out of the box with kosmtik (https://github.com/kosmtik)

### Bugfixes

- Removed topcube and other obsolete dependencies
- Removed windowed mode, only server mode is supported
- Fixed Tab indentation in editor window
- Fixed "Close" button bugs in Google Chrome (https://github.com/mapbox/tilemill/issues/2534)
- Fixed mbtiles preview map
- Removed Mapbox integration
- Fixed CartoCSS variable auto completion
- Fixed creation of job file in export if it doesn't exist
- Fixed multiple output of CartoCSS errors to update to latest version

## Readme

TileOven is a modern map design studio powered by [Node.js](http://nodejs.org) and [Mapnik](http://mapnik.org).

Installation instructions, development docs and other information are available on the [TileMill website](http://tilemill-project.github.io/tilemill).

## Depends

- Mapnik v2.3.0
- Node.js v6.x, v4.x, v0.10.x or v0.8.x
- Protobuf: libprotobuf-lite and protoc

However, node-mapnik (which depends on Mapnik and protobuf) is now packaged as a binary. So, you do not need an external Mapnik. See [Installation](#installation)

## Installation

Note: on Ubuntu make sure that you have the nodejs-legacy package installed!

To install from source just do:

    git clone https://github.com/florianf/tileoven.git
    cd tileoven
    npm install

Then to start TileMill do:

    ./index.js # and then view http://localhost:20009 in your web browser

For more extended details follow:

- [Install packages](http://mapbox.com/tilemill/docs/install/)
- [Build from source](http://mapbox.com/tilemill/docs/source/)

## Running tests

Install mocha and run the tests

    npm install mocha
    npm test


Note: the tests require a running postgres server and a postgis enabled
database called `template_postgis`.

If you do not have a `template_postgis` create one like:

    createdb -E UTF8 template_postgis
    psql -c "CREATE EXTENSION postgis" template_postgis

If you experience failing tests here are two tips:

1. Debug the project data by running TileMill with

    ./index.js --files=./test/fixtures/files/

2. Try clearing the cache of test data:

    rm -rf ./test/fixtures/files/

For more info see: http://postgis.net/docs/manual-1.5/ch02.html


## Documentation

TileMill documentation is kept in the mb-pages branch, which is independently managed and not merged with master.

TileMill's in-app reference available as the "Manual" (see below for syncing details) is a very small subset of docs for offline usage and is manually
sync'ed from the mb-pages branch.

To view all the TileMill documentation locally, first checkout the mb-pages branch:

    git checkout mb-pages

Then install Jekyll:

    sudo gem install jekyll

And run Jekyll:

    jekyll

Once Jekyll has started you should be able to view the docs in a browser at:

    http://localhost:4000/tilemill/


## Syncing manual

To sync the manual with mb-pages updates do:

    export TILEMILL_SOURCES=`pwd`
    cd ../
    git clone --depth=1 -b mb-pages https://github.com/mapbox/tilemill tilemill-mb-pages
    cd ${TILEMILL_SOURCES}
    export TILEMILL_GHPAGES=../tilemill-mb-pages
    rm -rf ${TILEMILL_SOURCES}/assets/manual
    mkdir -p ${TILEMILL_SOURCES}/assets/manual
    cp -r ${TILEMILL_GHPAGES}/assets/manual/* ${TILEMILL_SOURCES}/assets/manual/
    git add ${TILEMILL_SOURCES}/assets/manual/*
    rm -rf ${TILEMILL_SOURCES}/_posts/docs/reference
    mkdir -p ${TILEMILL_SOURCES}/_posts/docs/reference
    cp -r ${TILEMILL_GHPAGES}/_posts/docs/reference/* ${TILEMILL_SOURCES}/_posts/docs/reference/
    git add ${TILEMILL_SOURCES}/_posts/docs/reference/*
