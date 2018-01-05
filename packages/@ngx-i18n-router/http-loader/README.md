# @ngx-i18n-router/http-loader [![npm version](https://badge.fury.io/js/%40ngx-i18n-router%2Fhttp-loader.svg)](https://www.npmjs.com/package/@ngx-i18n-router/http-loader) [![npm downloads](https://img.shields.io/npm/dm/%40ngx-i18n-router%2Fhttp-loader.svg)](https://www.npmjs.com/package/@ngx-i18n-router/http-loader)
Loader for [ngx-i18n-router] that provides route translations using `http`

[![CircleCI](https://circleci.com/gh/fulls1z3/ngx-i18n-router.svg?style=shield)](https://circleci.com/gh/fulls1z3/ngx-i18n-router)
[![coverage](https://codecov.io/github/fulls1z3/ngx-i18n-router/coverage.svg?branch=master)](https://codecov.io/gh/fulls1z3/ngx-i18n-router)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

**`@ngx-i18n-router/http-loader`** provides **route translations** to [@ngx-i18n-router/core] using `http`.

#### NOTICE
> This *[5.x.x] branch* is intented to work with `@angular v5.x.x`. If you're developing on a later release of **Angular**
than `v5.x.x`, then you should probably choose the appropriate version of this library by visiting the *[master] branch*.

## Table of contents:
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
  - [Installation](#installation)
	- [Examples](#examples)
	- [Related packages](#related-packages)
	- [Adding `@ngx-i18n-router/http-loader` to your project (SystemJS)](#adding-systemjs)
- [Settings](#settings)
	- [Setting up `I18NRouterModule` to use `I18NRouterHttpLoader`](#setting-up-httploader)
	- [Translations object](#translations-object)
- [License](#license)

## <a name="prerequisites"></a> Prerequisites
This library depends on `Angular v4.0.0`. Older versions contain outdated dependencies, might produce errors.

Also, please ensure that you are using **`Typescript v2.5.3`** or higher.

## <a name="getting-started"> Getting started
### <a name="installation"> Installation
You can install **`@ngx-i18n-router/http-loader`** using `npm`
```
npm install @ngx-i18n-router/http-loader --save
```

**Note**: You should have already installed [@ngx-i18n-router/core].

### <a name="examples"></a> Examples
- [ng-seed/universal] and [fulls1z3/example-app] are officially maintained projects, showcasing common patterns and best
practices for **`@ngx-i18n-router/http-loader`**.

### <a name="related-packages"></a> Related packages
The following packages may be used in conjunction with **`@ngx-i18n-router/http-loader`**:
- [@ngx-i18n-router/core]

### <a name="adding-systemjs"></a> Adding `@ngx-i18n-router/http-loader` to your project (SystemJS)
Add `map` for **`@ngx-i18n-router/http-loader`** in your `systemjs.config`
```javascript
'@ngx-i18n-router/http-loader': 'node_modules/@ngx-i18n-router/http-loader/bundles/http-loader.umd.min.js'
```

## <a name="settings"></a> Settings
### <a name="setting-up-httploader"></a> Setting up `I18NRouterModule` to use `I18NRouterHttpLoader`
#### routes.json
```json
{
  "en": {
    "ROOT.ABOUT": "about",
    "ROOT.ABOUT.US": "us",
    "ROOT.ABOUT.BANANA": "banana",
    "ROOT.ABOUT.APPLE": "apple",
    "ROOT.ABOUT.APPLE.PEAR": "pear",
    "CHANGE_LANGUAGE": "change-language"
  },
  "tr": {
    "ROOT.ABOUT": "hakkinda",
    "ROOT.ABOUT.US": "biz",
    "ROOT.ABOUT.BANANA": "muz",
    "ROOT.ABOUT.APPLE": "elma",
    "ROOT.ABOUT.APPLE.PEAR": "armut",
    "CHANGE_LANGUAGE": "dil-secimi"
  }
}
```

#### app.module.ts
```TypeScript
...
import { HttpClient } from '@angular/common/http';
import { I18NRouterModule, I18NRouterLoader, I18NRouterHttpLoader, I18N_ROUTER_PROVIDERS, RAW_ROUTES } from '@ngx-i18n-router/core';
...

export function i18nRouterFactory(http: HttpClient, rawRoutes: Routes): I18NRouterLoader {
  return new I18NRouterHttpLoader(http, '/routes.json', {routes: rawRoutes}); // FILE PATH || API ENDPOINT
}

...

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  ...
  imports: [
    RouterModule.forRoot(routes),
    I18NRouterModule.forRoot(routes, [
      {
        provide: I18NRouterLoader,
        useFactory: (i18nRouterFactory),
        deps: [Http, RAW_ROUTES]
      }
    ]),
    ...
  ],
  ...
  providers: [
    I18N_ROUTER_PROVIDERS,
	...
  ],
  ...
  bootstrap: [AppComponent]
})
```

`I18NRouterHttpLoader` has three parameters:
- **http**: `Http` : Http instance
- **path**: `string` : path to `JSON file`/`API endpoint`, to retrieve route translations from (*by default, `routes.json`*)
- **providedSettings**: `I18NRouterSettings` : i18n-router settings
  - **routes**: `Routes`: raw routes

### <a name="translations-object"></a> Translations object
You can find detailed information about the **data structure** and usage guidelines for the translations object [here](https://github.com/fulls1z3/ngx-i18n-router/tree/master/packages/@ngx-i18n-router/core#translations-object).

Assuming that application settings are provided from `./routes.json`, adding the following data to configuration file will
provide route translations to **`@ngx-i18n-router/core`** through **`http`**.

#### routes.json
```json
{
  "en": {
    "ROOT.ABOUT": "about",
    "ROOT.ABOUT.US": "us",
    "ROOT.ABOUT.BANANA": "banana",
    "ROOT.ABOUT.APPLE": "apple",
    "ROOT.ABOUT.APPLE.PEAR": "pear",
    "CHANGE_LANGUAGE": "change-language"
  },
  "tr": {
    "ROOT.ABOUT": "hakkinda",
    "ROOT.ABOUT.US": "biz",
    "ROOT.ABOUT.BANANA": "muz",
    "ROOT.ABOUT.APPLE": "elma",
    "ROOT.ABOUT.APPLE.PEAR": "armut",
    "CHANGE_LANGUAGE": "dil-secimi"
  }
}
```

> :+1: Well! **`@ngx-i18n-router/http-loader`** will now provide **route translations** to [@ngx-i18n-router/core] using
`http`.

## <a name="license"></a> License
The MIT License (MIT)

Copyright (c) 2017 [Burak Tasci]

[master]: https://github.com/ngx-i18n-router/core/tree/master
[5.x.x]: https://github.com/ngx-i18n-router/core/tree/5.x.x
[ngx-i18n-router]: https://github.com/fulls1z3/ngx-i18n-router
[@ngx-i18n-router/core]: https://github.com/fulls1z3/ngx-i18n-router/tree/master/packages/@ngx-i18n-router/core
[ng-seed/universal]: https://github.com/ng-seed/universal
[fulls1z3/example-app]: https://github.com/fulls1z3/example-app
[Burak Tasci]: https://github.com/fulls1z3
