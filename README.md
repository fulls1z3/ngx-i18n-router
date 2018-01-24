# ngx-i18n-router
Route internationalization utility for **Angular**

[![CircleCI](https://circleci.com/gh/fulls1z3/ngx-i18n-router.svg?style=shield)](https://circleci.com/gh/fulls1z3/ngx-i18n-router)
[![coverage](https://codecov.io/github/fulls1z3/ngx-i18n-router/coverage.svg?branch=master)](https://codecov.io/gh/fulls1z3/ngx-i18n-router)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Greenkeeper badge](https://badges.greenkeeper.io/fulls1z3/ngx-i18n-router.svg)](https://greenkeeper.io/)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

**`ngx-i18n-router`** translates each `path` and `redirectTo` property of routes, during **Angular** app initialization
and also during runtime - when the working language gets changed.

#### NOTICE
> This *[5.x.x] branch* is intented to work with `@angular v5.x.x`. If you're developing on a later release of **Angular**
than `v5.x.x`, then you should probably choose the appropriate version of this library by visiting the *[master] branch*.

> Also, please check the [Workaround for '@ngtools/webpack'](https://github.com/fulls1z3/ngx-i18n-router/tree/master/packages/@ngx-i18n-router/core/README.md#workaround-for-ngtoolswebpack)
section if your app depends on **@angular-cli** or **`@ngtools/webpack`** for [AoT compilation].

## Packages:
Name | Description | NPM
--- | --- | ---
[@ngx-i18n-router/core](https://github.com/fulls1z3/ngx-i18n-router/tree/master/packages/@ngx-i18n-router/core) | Route internationalization utility for **Angular** | [![npm version](https://badge.fury.io/js/%40ngx-i18n-router%2Fcore.svg)](https://www.npmjs.com/package/@ngx-i18n-router/core)
[@ngx-i18n-router/http-loader](https://github.com/fulls1z3/ngx-i18n-router/tree/master/packages/@ngx-i18n-router/http-loader) | Loader for [ngx-i18n-router] that provides route translations using `http` | [![npm version](https://badge.fury.io/js/%40ngx-i18n-router%2Fhttp-loader.svg)](https://www.npmjs.com/package/@ngx-i18n-router/http-loader)
[@ngx-i18n-router/config-loader](https://github.com/fulls1z3/ngx-i18n-router/tree/master/packages/@ngx-i18n-router/config-loader) | Loader for [ngx-i18n-router] that provides route translations using [ngx-config] | [![npm version](https://badge.fury.io/js/%40ngx-i18n-router%2Fconfig-loader.svg)](https://www.npmjs.com/package/@ngx-i18n-router/config-loader)

### Examples
- [ng-seed/universal] and [fulls1z3/example-app] are officially maintained projects, showcasing common patterns and best
practices for **`ngx-i18n-router`**.

## Contributing
If you want to file a bug, contribute some code, or improve documentation, please read up on the following contribution guidelines:
- [Issue guidelines](CONTRIBUTING.md#submit)
- [Contributing guidelines](CONTRIBUTING.md)
- [Coding rules](CONTRIBUTING.md#rules)
- [Change log](CHANGELOG.md)

#### Thanks to
- [JetBrains], for their support to this open source project with free [WebStorm] licenses.

## License
The MIT License (MIT)

Copyright (c) 2018 [Burak Tasci]

[master]: https://github.com/ngx-i18n-router/core/tree/master
[5.x.x]: https://github.com/ngx-i18n-router/core/tree/5.x.x
[AoT compilation]: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html
[ngx-i18n-router]: https://github.com/fulls1z3/ngx-i18n-router
[ngx-config]: https://github.com/fulls1z3/ngx-config
[ng-seed/universal]: https://github.com/ng-seed/universal
[fulls1z3/example-app]: https://github.com/fulls1z3/example-app
[JetBrains]: https://www.jetbrains.com/community/opensource
[WebStorm]:   https://www.jetbrains.com/webstorm
[Burak Tasci]: https://github.com/fulls1z3
