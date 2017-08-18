# @ngx-i18n-router/config-loader
Loader for [ngx-i18n-router] that provides route translations using [ngx-config]

[![npm version](https://badge.fury.io/js/%40ngx-i18n-router%2Fconfig-loader.svg)](https://www.npmjs.com/package/@ngx-i18n-router/config-loader)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

**`@ngx-i18n-router/config-loader`** provides **route translations** to [@ngx-i18n-router/core] using [@ngx-config/core],
and helps **reducing** the **amount** of `HTTP` requests during application initalization by including **route translations**
within the **application settings** - if [@ngx-config/core] is already used to retrieve settings by the **Angular** app.

## Table of contents:
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
  - [Installation](#installation)
	- [Examples](#examples)
	- [Related packages](#related-packages)
	- [Adding `@ngx-i18n-router/config-loader` to your project (SystemJS)](#adding-systemjs)
- [Settings](#settings)
	- [Setting up `I18NRouterModule` to use `I18NRouterConfigLoader`](#setting-up-configloader)
	- [Translations object](#translations-object)
- [License](#license)

## <a name="prerequisites"></a> Prerequisites
This package depends on `Angular v2.0.0` but it's highly recommended that you are running at least **`@angular v2.4.0`**
and **`@angular/router v3.4.0`**. Older versions contain outdated dependencies, might produce errors.

Also, please ensure that you are using **`Typescript v2.1.6`** or higher.

## <a name="getting-started"> Getting started
### <a name="installation"> Installation
You can install **`@ngx-i18n-router/config-loader`** using `npm`
```
npm install @ngx-i18n-router/config-loader --save
```

**Note**: You should have already installed [@ngx-i18n-router/core] and [@ngx-config/core].

### <a name="examples"></a> Examples
- [ng-seed/universal] and [ng-seed/spa] are officially maintained seed projects, showcasing common patterns and best practices
for **`@ngx-i18n-router/config-loader`**.

### <a name="related-packages"></a> Related packages
The following packages may be used in conjunction with **`@ngx-i18n-router/config-loader`**:
- [@ngx-i18n-router/core]
- [@ngx-config/core]

### <a name="adding-systemjs"></a> Adding `@ngx-i18n-router/config-loader` to your project (SystemJS)
Add `map` for **`@ngx-i18n-router/config-loader`** in your `systemjs.config`
```javascript
'@ngx-i18n-router/config-loader': 'node_modules/@ngx-i18n-router/config-loader/bundles/config-loader.umd.min.js'
```

## <a name="settings"></a> Settings
### <a name="setting-up-configloader"></a> Setting up `I18NRouterModule` to use `I18NRouterConfigLoader`
`I18NRouterConfigLoader` uses [@ngx-config/core] to load route translations.
- Import `ConfigModule` using the mapping `'@ngx-config/core'` and append `ConfigModule.forRoot({...})` within the imports
property of **app.module**.
- Import `I18NRouterModule` using the mapping `'@ngx-i18n-router/core'` and append `I18NRouterModule.forRoot({...})` within
the imports property of **app.module**.
- Import `I18NRouterConfigLoader` using the mapping `'@ngx-i18n-router/config-loader'`.

**Note**: *Considering the app.module is the core module in Angular application*.

#### app.module.ts
```TypeScript
...
import { Http } from '@angular/http';
import { ConfigModule, ConfigLoader, ConfigHttpLoader } from '@ngx-config/core';
import { I18NRouterModule, I18NRouterLoader, I18N_ROUTER_PROVIDERS, RAW_ROUTES } from '@ngx-i18n-router/core';
import { I18NRouterConfigLoader } from '@ngx-i18n-router/config-loader';
...

export function configFactory(http: Http): ConfigLoader {
  return new ConfigHttpLoader(http, './config.json');
}

export function i18nRouterFactory(config: ConfigService, rawRoutes: Routes): I18NRouterLoader {
  return new I18NRouterConfigLoader(config, rawRoutes, 'routes');
}

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  ...
  imports: [
    RouterModule.forRoot(routes),
    ConfigModule.forRoot({
      provide: ConfigLoader,
      useFactory: (configFactory),
      deps: [Http]
    }),
    I18NRouterModule.forRoot(routes, [
      {
        provide: I18NRouterLoader,
        useFactory: (i18nRouterFactory),
        deps: [ConfigService, RAW_ROUTES]
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

`I18NRouterConfigLoader` has three parameters:
- **config**: `ConfigService` : ConfigService instance
- **routes**: `Routes`: raw routes
- **group**: `string` : group key, to fetch route translations from applcation settings (*by default, `routes`*)

### <a name="translations-object"></a> Translations object
You can find detailed information about the **data structure** and usage guidelines for the translations object [here](https://github.com/fulls1z3/ngx-i18n-router/tree/master/packages/@ngx-i18n-router/core#translations-object).

Assuming that application settings are provided from `./config.json`, adding the following data to configuration file will
provide route translations to **`@ngx-i18n-router/core`** through **`@ngx-config/core`**.

#### config.json
```json
{
  ...
  "routes": {
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
  },
  ...
}
```

> :+1: Well! **`@ngx-i18n-router/config-loader`** will now provide **route translations** to [@ngx-i18n-router/core] using
[@ngx-config/core].

## <a name="license"></a> License
The MIT License (MIT)

Copyright (c) 2017 [Burak Tasci]

[ngx-i18n-router]: https://github.com/fulls1z3/ngx-i18n-router
[ngx-config]: https://github.com/fulls1z3/ngx-config
[@ngx-i18n-router/core]: https://github.com/fulls1z3/ngx-i18n-router/tree/master/packages/@ngx-i18n-router/core
[@ngx-config/core]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/core
[ng-seed/universal]: https://github.com/ng-seed/universal
[ng-seed/spa]: https://github.com/ng-seed/spa
[Burak Tasci]: https://github.com/fulls1z3
