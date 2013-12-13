# generator-ngbp [![Build Status](https://secure.travis-ci.org/kevin-wolf/generator-ngbp.png?branch=master)](https://travis-ci.org/kevin-wolf/generator-ngbp)

A generator for [Yeoman](http://yeoman.io).
Generates a file structure for large AngularJS applications based on [ng-boilerplate](https://github.com/ngbp/ng-boilerplate)


## Usage

Install `generator-ngbp`:
```bash
npm install -g generator-ngbp
```

Make a new directory and `cd` into it:
```bash
mkdir my-awesome-app && cd $_
```

Run `yo ngbp`, optionally passing an app name:
```bash
yo ngbp [app-name]
```

Run `grunt` for building and `grunt serve` for development.


## Available Generators

* [ngbp](#app) (aka [ngbp:app](#app))

**Note: Generators are to be run from the root directory of your app.**

### App
Creates a new scaffold for a large AngularJS application, prompting you some configuration.

Example:
```bash
yo ngbp
```


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
