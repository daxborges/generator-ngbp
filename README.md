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
* [ngbp:controller](#controller)

**Note: Generators are to be run from the root directory of your app.**


### App

#### Usage
```bash
yo ngbp [app name]
```

Creates a new scaffold for a large AngularJS application, prompting you some configuration.

#### Example:
```bash
yo ngbp myApp
```
---


### Controller

#### Usage
```bash
yo ngbp:controller [module name].<controller name>
```

Generates a new controller, if you specify a module name, then the controller will be geneated within the given module directory, elsewhere, the controller will be generated within `common/controllers` folder.

#### Examples:
```bash
yo ngbp:controller foo
```

Produces `app/common/controllers/fooCtrl.js`:
```js
angular.module('myApp').controller('fooCtrl', function ($scope) {

  /* Controller code */
});
```

```bash
yo ngbp:controller profile.feed
```

Produces `app/app/profile/feedCtrl.js`:
```js
angular.module('profile').controller('feedCtrl', function ($scope) {

  /* Controller code */
});
```

```bash
yo ngbp:controller profile.edit.editFeed
```

Produces `app/app/profile/edit/editFeedCtrl.js`:
```js
angular.module('profile.edit').controller('editFeedCtrl', function ($scope) {

  /* Controller code */
});
```
---


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
