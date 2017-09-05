# @ngx-i18n-router/core [![npm version](https://badge.fury.io/js/%40ngx-i18n-router%2Fcore.svg)](https://www.npmjs.com/package/@ngx-i18n-router/core) [![npm downloads](https://img.shields.io/npm/dm/%40ngx-i18n-router%2Fcore.svg)](https://www.npmjs.com/package/@ngx-i18n-router/core)
Route internationalization utility for **Angular**

[![CircleCI](https://circleci.com/gh/fulls1z3/ngx-i18n-router.svg?style=shield)](https://circleci.com/gh/fulls1z3/ngx-i18n-router)
[![coverage](https://codecov.io/github/fulls1z3/ngx-i18n-router/coverage.svg?branch=master)](https://codecov.io/gh/fulls1z3/ngx-i18n-router)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

**`@ngx-i18n-router/core`** translates each `path` and `redirectTo` property of routes, during **Angular** app initialization
and also during runtime - when the working language gets changed.

#### NOTICE
> If you're using `Angular v4.x.x`, use the latest release of `v0.4.x` (*[master] branch*).

> If you're using `Angular v2.x.x`, use the latest release of `v0.2.x` (*[v0.2.x] branch*).

> Also, please check the [Workaround for '@ngtools/webpack'](#workaround-for-ngtoolswebpack) section if your app depends
on **@angular/cli** or **`@ngtools/webpack`** for [AoT compilation].

## Table of contents:
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
  - [Installation](#installation)
	- [Examples](#examples)
	- [Related packages](#related-packages)
	- [Recommended packages](#recommended-packages)
	- [Adding `@ngx-i18n-router/core` to your project (SystemJS)](#adding-systemjs)
	- [Route configuration](#route-config)
  - [app.module configuration](#appmodule-config)
	- [Feature modules configuration](#feature-modules-config)
	- [app.component configuration](#appcomponent-config)
- [Settings](#settings)
	- [Setting up `I18NRouterModule` to use `I18NRouterStaticLoader`](#setting-up-staticloader)
	- [Setting up `I18NRouterModule` to use `I18NRouterHttpLoader`](#setting-up-httploader)
	- [Setting up `I18NRouterModule` to use `I18NRouterConfigLoader`](#setting-up-configloader)
	- [Translations object](#translations-object)
- [Change language (runtime)](#change-language)
- [Pipe](#pipe)
- [Workaround for '@ngtools/webpack'](#workaround-for-ngtoolswebpack)
- [Credits](#credits)
- [License](#license)

## <a name="prerequisites"></a> Prerequisites
This package depends on `Angular v4.0.0`, and the [master] branch does no longer support `Angular v2.x.x`.

However, the [v0.2.x] branch keeps ongoing support for `Angular v2.x.x` - depending on `Angular v2.0.0`, and it's highly
recommended that you are running at least **`@angular v2.4.0`** and **`@angular/router v3.4.0`**. Older versions contain
outdated dependencies, might produce errors.
- If you're using `Angular v4.x.x`, use the latest release of `v0.4.x` (*[master] branch*).
- If you're using `Angular v2.x.x`, use the latest release of `v0.2.x` (*[v0.2.x] branch*).

Also, please ensure that you are using **`Typescript v2.3.4`** or higher.

## <a name="getting-started"> Getting started
### <a name="installation"> Installation
You can install **`@ngx-i18n-router/core`** using `npm`
```
npm install @ngx-i18n-router/core --save
```

### <a name="examples"></a> Examples
- [ng-seed/universal] and [fulls1z3/example-app] are officially maintained projects, showcasing common patterns and best
practices for **`@ngx-i18n-router/core`**.

### <a name="related-packages"></a> Related packages
The following packages may be used in conjunction with **`@ngx-i18n-router/core`**
- [@ngx-i18n-router/http-loader]
- [@ngx-i18n-router/config-loader]

### <a name="recommended-packages"></a> Recommended packages
The following package(s) have no dependency for **`@ngx-i18n-router/core`**, however may provide supplementary/shorthand
functionality:
- [@ngx-config/core]: provides route translations from the application settings loaded during application initialization
- [@ngx-cache/core]: provides caching features to retrieve the route translations using `non-static loaders` (`http`, `fs`,
etc.)

### <a name="adding-systemjs"></a> Adding `@ngx-i18n-router/core` to your project (SystemJS)
Add `map` for **`@ngx-i18n-router/core`** in your `systemjs.config`
```javascript
'@ngx-i18n-router/core': 'node_modules/@ngx-i18n-router/core/bundles/core.umd.min.js'
```

### <a name="route-config"></a> ### Route configuration
In order to use **`@ngx-i18n-router/core`** properly, you should have more or less a similar **route structure** as follows:

#### app.routes.ts
```TypeScript
export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: './+home/home.module#HomeModule'
      },
      {
        path: 'about',
        loadChildren: './+about/about.module#AboutModule'
      },

	  ...

    ],
    data: {
      i18n: {
        isRoot: true
      }
    }
  },
  {
    path: 'change-language/:languageCode',
    component: ChangeLanguageComponent
  },

  ...

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
```

#### I18N-ROOT
The route configuration above shows that, one of the routes contains `i18n` property inside the `data` property.

When its value is set to `true`, **`@ngx-i18n-router/core`** will **prepend** descendants of this route with the **2-letter
language code** (*ex: `en`/`fr`/`de`/`nl`/`tr`*).

> We call this route, with `data` property containing `i18n\isRoot` set to `true`, **`I18N-ROOT`** of **Angular** application.

```
(English)

http://mysite.com/about -> http://mysite.com/en/about
```

**Note**: There must be a maximum of **one** `i18n\isRoot` in the route configuration, and (*if exists*) this must be placed
inside the `data` property of any of the **first-level** routes.

**Note**: It is always a good practice to have **exactly one route** (*and component*) in the `Home` feature module, with
a path set to `''` (*see `home.routes.ts` in this readme*).

#### Non-prefixed routes
Routes outside **`I18N-ROOT`** scope will **NOT** have this **2-letter language code** prefix. It allows the **Angular**
application to support both `prefixed` and `non-prefixed` routes. 

```
(English)

http://mysite.com/about -> http://mysite.com/en/about
http://mysite.com/sitemap
http://mysite.com/admin
```

#### Catchall route
There must be a **catchall route** in the route configuration, redirecting to the **`I18N-ROOT`** of the app (*here, redirects
to `''`*). The `redirectTo` property will be reset to the **2-letter language code** by **`@ngx-i18n-router/core`**.

### <a name="appmodule-config"></a> app.module configuration
Import `I18NRouterModule` using the mapping `'@ngx-i18n-router/core'` and append `I18NRouterModule.forRoot(routes, {...})`
within the imports property of **app.module** (*considering the app.module is the core module in Angular application*).

Also, don't forget to provide `I18N_ROUTER_PROVIDERS` within the providers property of **app.module**.

**Note**: `I18N_ROUTER_PROVIDERS` must be imported in the **app.module** (*instead of in `I18NRouterModule`*), to resolve
the `I18NRouterService` dependency at the **uppermost level** (*otherwise child modules will have different instances of
`I18NRouterService`*).

#### app.module.ts
```TypeScript
...
import { I18NRouterModule, I18N_ROUTER_PROVIDERS } from '@ngx-i18n-router/core';
...

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  ...
  imports: [
    RouterModule.forRoot(routes),
    I18NRouterModule.forRoot(routes),
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

### <a name="feature-modules-config"></a> Feature modules configuration
Import `I18NRouterModule` using the mapping `'@ngx-i18n-router/core'` and append `I18NRouterModule.forChild(routes, moduleKey)`
within the imports property of the **feature module**. The `moduleKey` parameter for the `forChild` method obviously refers
to the **module's root path** (*in kebab-case*).

#### home.routes.ts
```TypeScript
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];
```

#### home.module.ts
```TypeScript
...
import { I18NRouterModule } from '@ngx-i18n-router/core';
...

@NgModule({
  ...
  imports: [
    //RouterModule.forChild(routes),
    I18NRouterModule.forChild(routes, 'home'),
    ...
  ],
  ...
})
```

#### about.routes.ts
```TypeScript
export const routes: Routes = [
  {
    path: '',
    component: AboutComponent
  },
  {
    path: 'us/:topicId',
    component: AboutUsComponent
  },
  {
    path: 'banana',
    component: AboutBananaComponent
  },
  {
    path: 'apple/:fruitId/pear',
    component: AboutApplePearComponent
  }
];
```

#### about.module.ts
```TypeScript
...
import { I18NRouterModule } from '@ngx-i18n-router/core';
...

@NgModule({
  ...
  imports: [
    //RouterModule.forChild(routes),
    I18NRouterModule.forChild(routes, 'about'),
    ...
  ],
  ...
})
```

**Note**: You must comment (*or better delete*) the line with `RouterModule.forChild(routes)`, in order to get **`@ngx-i18n-router/core`**
working. `forChild` method of `I18NRouterModule` provides routes for **feature modules** itself (*if imports both `RouterModule`
and `I18NRouterModule`, it will cause **`@ngx-i18n-router/core`** to malfunction, even crash*).

### <a name="appcomponent-config"></a> app.component configuration
Import `I18NRouterService` using the mapping `'@ngx-i18n-router/core'` and **inject** it in the constructor of **app.component**
(*considering the app.component is the bootstrap component in Angular application*).

Then, invoke the `init` method to fetch **route translations** loaded during application initialization and allow the use
of **`@ngx-i18n-router/core`** by the **Angular** app.

Lastly, you need to invoke the `changeLanguage` method by supplying the **2-letter language code**, which translates routes
to the specified language.

#### app.component.ts
```TypeScript
...
import { I18NRouterService } from '@ngx-i18n-router/core';
...

@Component({
  ...
})
export class AppComponent implements OnInit {
  ...
  constructor(private readonly i18nRouter: I18NRouterService) {
    // invoking the `init` method with false won't allow the use of i18n-router,
    // would be handy in the case you need to use i18n-router programmatically
    i18nRouter.init();
  }
  ...
  ngOnInit(): void {
    this.i18nRouter.changeLanguage('en');
  }
  ...
}
```

## <a name="settings"></a> Settings
You can call the [forRoot] static method using `I18NRouterStaticLoader`. By default, it is configured to pass the **routes**
to **`@ngx-i18n-router/core`** and have no translations.

> You can customize this behavior (*and ofc other settings*) by supplying **route translations** to `I18NRouterStaticLoader`.

If you provide route translations using a `JSON` file or an `API`, you can call the [forRoot] static method using the `I18NRouterHttpLoader`.
By default, it is configured to retrieve **route translations** from the path `/routes.json` (*if not specified*).

> You can customize this behavior (and ofc other settings) by supplying a **file path/api endpoint** to I18NRouterHttpLoader.

You can also use the [@ngx-i18n-router/config-loader], to **reduce** the **amount** of `HTTP` requests during application
initialization, by including **route translations** within the **application settings** - if [@ngx-config/core] is already
used to retrieve settings by the **Angular** app.

The following examples show the use of an exported function (*instead of an inline function*) for [AoT compilation].

### <a name="setting-up-staticloader"></a> Setting up `I18NRouterModule` to use `I18NRouterStaticLoader`
#### app.module.ts
```TypeScript
...
import { I18NRouterModule, I18NRouterLoader, I18NRouterStaticLoader, I18N_ROUTER_PROVIDERS, RAW_ROUTES } from '@ngx-i18n-router/core';
...

export function i18nRouterFactory(rawRoutes: Routes): I18NRouterLoader {
  return new I18NRouterStaticLoader({
    routes: rawRoutes,
    translations: {
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
  });
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
        deps: [RAW_ROUTES]
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

`I18NRouterStaticLoader` has one parameter:
- **providedSettings**: `I18NRouterSettings` : i18n-router settings
  - **routes**: `Routes`: raw routes
  - **translations**: `any` : route translations

### <a name="setting-up-httploader"></a> Setting up `I18NRouterModule` to use `I18NRouterHttpLoader`
If you provide route translations using a `JSON` file or an `API`, you can call the [forRoot] static method using the `I18NRouterHttpLoader`.
By default, it is configured to retrieve **route translations** from the endpoint `/routes.json` (*if not specified*).

> You can customize this behavior (*and ofc other settings*) by supplying a **api endpoint** to `I18NRouterHttpLoader`.

You can find detailed information about the usage guidelines for the `ConfigHttpLoader` [here](https://github.com/fulls1z3/ngx-i18n-router/tree/v0.2.x/packages/@ngx-i18n-router/http-loader).

### <a name="setting-up-configloader"></a> Setting up `I18NRouterModule` to use `I18NRouterConfigLoader`
`I18NRouterConfigLoader` provides route translations to **`@ngx-i18n-router/core`** using **`@ngx-config/core`**.

You can find detailed information about the usage guidelines for the `I18NRouterConfigLoader` [here](https://github.com/fulls1z3/ngx-i18n-router/tree/v0.2.x/packages/@ngx-i18n-router/config-loader).

### <a name="translations-object"></a> Translations object
The translations object is designed to contain **route translations** in every **language** supported by **Angular** application,
in **JSON format**.

When the `changeLanguage` method of **`@ngx-i18n-router/core`** is invoked, **route configuration** is **reset** based on
the supplied translations.

You should use the following **data structure** while working with the translation object:
- Assume that there're a number of **{N}** supported languages. The object contains **{N}** times first-level children,
**key**ed with its **2-letter language code** and **value**d by translations specific to that language.
- Language keys are in **lowercase**.

```
ex: Angular app supports en, fr and tr

{
  "en": { ... },
  "fr": { ... },
  "tr": { ... }
}
```

- Routes within the **`I18N-ROOT`** scope must be **key**ed with the `ROOT` **prefix**, followed by a dot char `.`, and
then the **moduleKey** (*module's root path in kebab-case*).
- Route **key**s are followed (*if any, after prefixes*) by the `path` attribute of routes.
- Route **key**s are in **UPPERCASE**.
- Dot char `.` is used as a **separator** between **prefix**es/**part**s (*ex: ROOT.ABOUT*).

```
ex: Angular app supports en and tr

modules:
  AboutModule (path: 'about')

components:
  AboutComponent (path: '')

routes:
  http://mysite.com/about -> http://mysite.com/en/about, http://mysite.com/tr/hakkinda

{
  "en": {
    "ROOT.ABOUT": "about"
  },
  "tr": {
    "ROOT.ABOUT": "iletisim"
  }
}
```

- Routes outside the **`I18N-ROOT`** scope must be **key**ed with the **moduleKey** (*module's root path in kebab-case*).

```
ex: Angular app supports en and tr

modules:
  AboutModule (path: 'about')
  SitemapModule (path: 'sitemap')

components:
  AboutComponent (path: '')
  SitemapComponent (path: '')

routes:
  http://mysite.com/about -> http://mysite.com/en/about, http://mysite.com/tr/hakkinda
  http://mysite.com/sitemap -> http://mysite.com/sitemap

{
  "en": {
    "ROOT.ABOUT": "about"
  },
  "tr": {
    "ROOT.ABOUT": "iletisim"
  }
}
```

- **Underscores** `_` must be used instead of **dashes** `-` in the route **key**s (*using dashes in keys causes errors*).
They're automatically replaced with **dashes** `-` while `I18nRouterService` is **translating the routes**.

```
ex: Angular app supports en and tr

modules:
  AboutModule (path: 'about')
  SitemapModule (path: 'site-map')

components:
  AboutComponent (path: '')
  SitemapComponent (path: '')

routes:
  http://mysite.com/about -> http://mysite.com/en/about, http://mysite.com/tr/hakkinda
  http://mysite.com/site-map -> http://mysite.com/site-map, http://mysite.com/site-haritasi

{
  "en": {
    "ROOT.ABOUT": "about",
	"SITE_MAP": "site-map"
  },
  "tr": {
    "ROOT.ABOUT": "iletisim",
	"SITE_MAP": "site-haritasi"
  }
}
```

- Route **path**s are split by **slashes** `/` into string **part**s. When **key**ing and they're separated by **dots**
`.` (*ex: path: 'goes/to/your-page' -> 'GOES.TO.YOUR_PAGE'*).
- Route **params** (*followed by colon*) are **not needed to be included** in the translations object (*ex: path: goes/to/:id/page
-> 'GOES.TO.PAGE'*)

```
ex: Angular app supports en and tr

modules:
  AboutModule (path: 'about'), ContactModule (path: 'contact'), ProfileComponent (path: 'profile')
  SitemapModule (path: 'site-map')

components:
  AboutComponent (path: ''), ContactComponent (path: ''), ContactMapComponent (path: 'map'), ProfileComponent (path: 'profile'), ProfileEditComponent (path: 'profile/:id/edit')
  SitemapComponent (path: '')

routes:
  http://mysite.com/about -> http://mysite.com/en/about, http://mysite.com/tr/hakkinda
  http://mysite.com/contact -> http://mysite.com/en/contact, http://mysite.com/tr/iletisim
  http://mysite.com/contact/map -> http://mysite.com/en/contact/map, http://mysite.com/tr/iletisim/harita
  http://mysite.com/profile -> http://mysite.com/en/profile, http://mysite.com/tr/profil
  http://mysite.com/profile/:id/edit -> http://mysite.com/en/profile/:id/edit, http://mysite.com/tr/profil/:id/duzenle

{
  "en": {
    "ROOT.ABOUT": "about",
    "ROOT.CONTACT": "contact",
    "ROOT.PROFILE": "profile",
    "ROOT.PROFILE.EDIT": "edit",
    "SITE_MAP": "site-map"
  },
  "tr": {
    "ROOT.ABOUT": "iletisim",
    "ROOT.CONTACT": "hakkimizda",
    "ROOT.PROFILE": "profil",
    "ROOT.PROFILE.EDIT": "duzenle",
    "SITE_MAP": "site-haritasi"
  }
}
```

> :+1: Hooyah! It was quite a long story, but **`@ngx-i18n-router/core`** will now translate each `path` and `redirectTo`
property of routes.

## <a name="change-language"></a> Change language (runtime)
Import `I18NRouterService` using the mapping `'@ngx-i18n-router/core'` and **inject** it in the constructor of **change-language.component**
(*considering the change-language.component changes the language in Angular application*).

Then, invoke the `changeLanguage` method by supplying the **2-letter language code**, which translates routes to the destination
language.

```TypeScript
...
import { I18NRouterService } from '@ngx-i18n-router/core';
...

@Component({
  ...
})
export class ChangeLanguageComponent implements OnInit {
  ...
  constructor(private readonly route: ActivatedRoute,
			  private readonly i18nRouter: I18NRouterService,
			  private readonly router: Router) { }
  ...
  ngOnInit(): void {
	this.route.params.subscribe(params => {
	  var languageCode = params['languageCode'];

      if (languageCode)
        // change language
        this.i18nRouter.changeLanguage(languageCode);

      this.router.navigate(['/']);
    });
  }
  ...
}
```

## <a name="pipe"></a> Pipe
`I18nRouterPipe` is used to **prefix** and **translate** `routerLink` directive's content. Pipe can be appended **ONLY**
to a single **empty string** in the `routerLink`'s definition or to an **entire array** element:

```Html
<a [routerLink]="['' | i18nRouter]">Home</a>
<a [routerLink]="['about'] | i18nRouter">About</a>
<a [routerLink]="['about', 'us', 22] | i18nRouter">About us</a>
<a [routerLink]="['about', 'banana'] | i18nRouter">Banana Republic</a>
<a [routerLink]="['about', 'apple', 6, 'pear'] | i18nRouter">(apple || pear)</a>
```

Example for Turkish language and link to 'about':

```
['about'] | i18nRouter -> '/tr/hakkinda'
```

## <a name="workaround-for-ngtoolswebpack"></a> Workaround for '@ngtools/webpack'
**`@ngx-i18n-router/core`**  does not work with [angular-cli] (*yet*), and giving the following error during [AoT compilation]:

> `ERROR in Cannot read property 'loadChildren' of undefined`

**`@ngx-i18n-router/core`**  injects routes with the `ROUTES` DI token using the `useFactory` property. However [@ngtools/webpack]
forces routes to be *static*, and prevents code splitting (*for lazy-loaded modules*) by third parties.

This issue is caused by the `ngtools_impl` located in the package `@angular/compiler-cli`.

You can track the actual status of this issue at the following URLs:
- https://github.com/fulls1z3/ngx-i18n-router/issues/2
- https://github.com/angular/angular/issues/15305

On the other hand, the [ng-router-loader] (*together with [awesome-typescipt-loader]*) is safe to go with - it compiles
without a problem. There's an overhead: you need to **manually** configure **build tools** (*dev/prod sever, task runners,
[webpack], etc*).

If you really need to stick to [angular-cli], you can use the following workaround, by changing the contents of `/node_modules/@angular/compiler-cli/src/ngtools_impl.js`
as described below:

- **Method name:** `_collectRoutes`
- **Line number:** 139
- **Replacement:** comment the line containing `return routeList.concat(p.useValue);`, and replace with:
```JavaScript
if (p.useFactory != null) {
  return routeList.concat(p.useFactory);
} else {
  return routeList.concat(p.useValue);
}
```

#### [ngtools_impl.js](https://gist.github.com/fulls1z3/ca7541eeccc5b195f4854ff39d322d0e#file-ngtools_impl-js-L138)
```JavaScript
function _collectRoutes(providers, reflector, ROUTES) {
  return providers.reduce(function (routeList, p) {
    if (p.provide === ROUTES) {
      // return routeList.concat(p.useValue);
      if (p.useFactory != null) {
        return routeList.concat(p.useFactory);
      } else {
        return routeList.concat(p.useValue);
      }
    }
    else if (Array.isArray(p)) {
      return routeList.concat(_collectRoutes(p, reflector, ROUTES));
    }
    else {
      return routeList;
    }
  }, []);
}
```

## <a name="credits"></a> Credits
- [localize-router](https://github.com/Greentube/localize-router): An implementation of routes localization for Angular 2

## <a name="license"></a> License
The MIT License (MIT)

Copyright (c) 2017 [Burak Tasci]

[master]: https://github.com/fulls1z3/ngx-i18n-router/tree/master
[v0.2.x]: https://github.com/fulls1z3/ngx-i18n-router/tree/v0.2.x
[ng-seed/universal]: https://github.com/ng-seed/universal
[fulls1z3/example-app]: https://github.com/fulls1z3/example-app
[@ngx-i18n-router/config-loader]: https://github.com/fulls1z3/ngx-i18n-router/tree/v0.2.x/packages/@ngx-i18n-router/config-loader
[@ngx-config/core]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/core
[@ngx-cache/core]: https://github.com/fulls1z3/ngx-cache/tree/master/packages/@ngx-cache/core
[forRoot]: https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root
[angular-cli]: https://github.com/angular/angular-cli
[AoT compilation]: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html
[@ngtools/webpack]: https://www.npmjs.com/package/@ngtools/webpack
[ng-router-loader]: https://github.com/shlomiassaf/ng-router-loader
[awesome-typescipt-loader]: https://github.com/s-panferov/awesome-typescript-loader
[webpack]: http://webpack.github.io
[Burak Tasci]: https://github.com/fulls1z3
