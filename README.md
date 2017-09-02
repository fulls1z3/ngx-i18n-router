# ngx-i18n-router
Route internationalization utility for **Angular**

[![Linux build](https://travis-ci.org/fulls1z3/ngx-i18n-router.svg?branch=master)](https://travis-ci.org/fulls1z3/ngx-i18n-router)
[![Windows build](https://ci.appveyor.com/api/projects/status/github/fulls1z3/ngx-i18n-router?branch=master&svg=true)](https://ci.appveyor.com/project/fulls1z3/ngx-i18n-router)
[![coverage](https://codecov.io/github/fulls1z3/ngx-i18n-router/coverage.svg?branch=master)](https://codecov.io/gh/fulls1z3/ngx-i18n-router)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

**`ngx-i18n-router`** translates each `path` and `redirectTo` property of routes, during **Angular** app initialization
and also during runtime - when the working language gets changed.

#### NOTICE
> If you're using `@angular v4.x.x`, use the latest release of `v0.4.x` (*[master] branch*).

> If you're using `@angular v2.x.x`, use the latest release of `v0.2.x` (*[v0.2.x] branch*).

> Also, please check the [Workaround for '@ngtools/webpack'](https://github.com/fulls1z3/ngx-i18n-router/tree/master/packages/@ngx-i18n-router/core/README.md#workaround-for-ngtoolswebpack)
section if your app depends on **@angular-cli** or **`@ngtools/webpack`** for [AoT compilation].

## Packages:
Name | Description | NPM
--- | --- | ---
[@ngx-i18n-router/core](https://github.com/fulls1z3/ngx-i18n-router/tree/master/packages/@ngx-i18n-router/core) | Route internationalization utility for **Angular** | [![npm version](https://badge.fury.io/js/%40ngx-i18n-router%2Fcore.svg)](https://www.npmjs.com/package/@ngx-i18n-router/core)
[@ngx-i18n-router/http-loader](https://github.com/fulls1z3/ngx-i18n-router/tree/v0.2.x/packages/@ngx-i18n-router/http-loader) | Loader for [ngx-i18n-router] that provides route translations using `http` | [![npm version](https://badge.fury.io/js/%40ngx-i18n-router%2Fhttp-loader.svg)](https://www.npmjs.com/package/@ngx-i18n-router/http-loader)
[@ngx-i18n-router/config-loader](https://github.com/fulls1z3/ngx-i18n-router/tree/v0.2.x/packages/@ngx-i18n-router/config-loader) | Loader for [ngx-i18n-router] that provides route translations using [ngx-config] | [![npm version](https://badge.fury.io/js/%40ngx-i18n-router%2Fconfig-loader.svg)](https://www.npmjs.com/package/@ngx-i18n-router/config-loader)

### Examples
- [ng-seed/universal] and [fulls1z3/example-app] are officially maintained projects, showcasing common patterns and best
practices for **`ngx-i18n-router`**.

## Contributing
If you want to file a bug, contribute some code, or improve documentation, please read up on the following contribution guidelines:
- [Issue guidelines](CONTRIBUTING.md#submit)
- [Contributing guidelines](CONTRIBUTING.md)
- [Coding rules](CONTRIBUTING.md#rules)
- [Change log](CHANGELOG.md)

## License
The MIT License (MIT)

Copyright (c) 2017 [Burak Tasci]

[master]: https://github.com/ngx-i18n-router/core/tree/master
[v0.2.x]: https://github.com/ngx-i18n-router/core/tree/v0.2.x
[AoT compilation]: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html
[ngx-i18n-router]: https://github.com/fulls1z3/ngx-i18n-router
[ngx-config]: https://github.com/fulls1z3/ngx-config
[ng-seed/universal]: https://github.com/ng-seed/universal
[fulls1z3/example-app]: https://github.com/fulls1z3/example-app
[Burak Tasci]: https://github.com/fulls1z3
