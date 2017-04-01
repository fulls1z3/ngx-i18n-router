# @nglibs/i18n-router [![Linux build](https://travis-ci.org/nglibs/i18n-router.svg?branch=v0.2.x)](https://travis-ci.org/nglibs/i18n-router) [![Windows build](https://ci.appveyor.com/api/projects/status/github/nglibs/i18n-router?branch=v0.2.x&svg=true)](https://ci.appveyor.com/project/nglibs/i18n-router) [![coverage](https://codecov.io/github/nglibs/i18n-router/coverage.svg?branch=v0.2.x)](https://codecov.io/gh/nglibs/i18n-router) [![npm version](https://badge.fury.io/js/%40nglibs%2Fi18n-router.svg)](https://www.npmjs.com/package/@nglibs/i18n-router)

> This repository holds the TypeScript source code and distributable bundle of **`@nglibs/i18n-router`**, the route internationalization utility for **Angular**.

**`@nglibs/i18n-router`** translates each `path` and `redirectTo` property of routes, during **Angular** app initialization and also during runtime - when the working language gets changed.

#### NOTICE

> If you're using `@angular v4.x.x`, use the latest release of `v0.4.x` (*[master] branch*).

> If you're using `@angular v2.x.x`, use the latest release of `v0.2.x` (*[v0.2.x] branch*).

#### WARNING

**`@nglibs/i18n-router`** does not work with **`@angular-cli`** (*yet*), and giving the following error during [AoT compilation]:

> `ERROR in Cannot read property 'loadChildren' of undefined`

This issue is caused by the `ngtools_impl` located in the package `@angular/compiler-cli`.

The **`@ngtools/webpack`** forces routes to be *static*, to facilitate code splitting (*for lazy-loaded modules*) by webpack. However, **route providing** by `useFactory` are not supported. You can track the actual status of this issue at the following URLs:

- https://github.com/nglibs/i18n-router/issues/2
- https://github.com/angular/angular/issues/15305

On the other hand, the [ng-router-loader] (together with `awesome-typescipt-loader`) is safe to go with - it compiles without a problem. There's an overhead: you need to **manually** configure **build tools** (*dev/prod sever, task runners, webpack, etc*). You can use [@nglibs/example-app] as a **reference** (*which is an officially maintained example application showcasing best practices for [@nglibs] utilities*).

If you really need to stick to **`@angular-cli`**, you can use the following workaround, by changing the contents of `/node_modules/@angular/compiler-cli/src/ngtools_impl.js` as described below:

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

## Table of contents:
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
  - [Installation](#installation)
	- [Examples](#examples)
	- [`@nglibs` packages](#nglibs-packages)
	- [Adding `@nglibs/i18n-router` to your project (SystemJS)](#adding-nglibsi18n-router-to-your-project-systemjs)
	- [Route configuration](#route-configuration)
    - [app.module configuration](#appmodule-configuration)
	- [Feature modules configuration](#feature-modules-configuration)
	- [app.component configuration](#appcomponent-configuration)
- [Settings](#settings)
	- [Setting up `I18NRouterModule` to use `I18NRouterStaticLoader`](#setting-up-i18nroutermodule-to-use-i18nrouterstaticloader)
	- [Setting up `I18NRouterModule` to use `I18NRouterHttpLoader`](#setting-up-i18nroutermodule-to-use-i18nrouterhttploader)
	- [Translations object](#translations-object)
- [Change language (runtime)](#change-language-runtime)
- [Pipe](#pipe)
- [Credits](#credits)
- [License](#license)

## Prerequisites
This [v0.2.x] branch of **`@nglibs/i18n-router`** depends on `@angular v2.0.0` but it's highly recommended that you are running at least **`@angular v2.4.0`** and **`@angular/router v3.4.0`**. Older versions contain outdated dependencies, might produce errors (*especially `@angular/router v2.4.8`*).

Also, please ensure that you are using **`Typescript v2.1.6`** or higher.

> If you're using `@angular v4.x.x`, use the latest release of `v0.4.x` (*[master] branch*).

## Getting started
### Installation
You can install **`@nglibs/i18n-router`** using `npm`
```
npm install @nglibs/i18n-router --save
```

### Examples
- [@nglibs/example-app] is an officially maintained example application showcasing best practices for **[@nglibs]** utilities.

### `@nglibs` packages

- [@nglibs/config]
- [@nglibs/meta]
- [@nglibs/i18n-router]
- [@nglibs/i18n-router-config-loader]
- [@nglibs/universal-express-engine]
- [@nglibs/universal-transfer-state]

### Adding `@nglibs/i18n-router` to your project (SystemJS)
Add `map` for **`@nglibs/i18n-router`** in your `systemjs.config`
```javascript
'@nglibs/i18n-router': 'node_modules/@nglibs/i18n-router/bundles/i18n-router.umd.min.js'
```

### Route configuration
In order to use **`@nglibs/i18n-router`** properly, you should have more or less a similar **route structure** as follows:

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

When its value is set to `true`, **`@nglibs/i18n-router`** will **prepend** descendants of this route with the **2-letter language code** (*ex: `en`/`fr`/`de`/`nl`/`tr`*).

> We call this route, with `data` property containing `i18n\isRoot` set to `true`, **`I18N-ROOT`** of **Angular** application.

```
(English)

http://mysite.com/about -> http://mysite.com/en/about
```

**Note**: There must be a maximum of **one** `i18n\isRoot` in the route configuration, and (*if exists*) this must be placed inside the `data` property of any of the **first-level** routes.

**Note**: It is always a good practice to have **exactly one route** (*and component*) in the `Home` feature module, with a path set to `''` (*see `home.routes.ts` in this readme*).

#### Non-prefixed routes

Routes outside **`I18N-ROOT`** scope will **NOT** have this **2-letter language code** prefix. It allows the **Angular** application to support both `prefixed` and `non-prefixed` routes. 

```
(English)

http://mysite.com/about -> http://mysite.com/en/about
http://mysite.com/sitemap
http://mysite.com/admin
```

#### Catchall route

There must be a **catchall route** in the route configuration, redirecting to the **`I18N-ROOT`** of the app (*here, redirects to `''`*). The `redirectTo` property will be reset to the **2-letter language code** by **`@nglibs/i18n-router`**.

### app.module configuration
Import `I18NRouterModule` using the mapping `'@nglibs/i18n-router'` and append `I18NRouterModule.forRoot(routes, {...})` within the imports property of **app.module** (*considering the app.module is the core module in Angular application*).

Also, don't forget to provide `I18N_ROUTER_PROVIDERS` within the providers property of **app.module**.

**Note**: `I18N_ROUTER_PROVIDERS` must be imported in the **app.module** (*instead of in `I18NRouterModule`*), to resolve the `I18NRouterService` dependency at the **uppermost level** (*otherwise child modules will have different instances of `I18NRouterService`*).

#### app.module.ts
```TypeScript
...
import { I18NRouterModule, I18N_ROUTER_PROVIDERS } from '@nglibs/i18n-router';
...

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
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

### Feature modules configuration

Import `I18NRouterModule` using the mapping `'@nglibs/i18n-router'` and append `I18NRouterModule.forChild(routes, moduleKey)` within the imports property of the **feature module**. The `moduleKey` parameter for the `forChild` method obviously refers to the **module's root path** (*in kebab-case*).

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
import { I18NRouterModule } from '@nglibs/i18n-router';
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
import { I18NRouterModule } from '@nglibs/i18n-router';
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

**Note**: You must comment (*or better delete*) the line with `RouterModule.forChild(routes)`, in order to get **`@nglibs/i18n-router`** working. `forChild` method of `I18NRouterModule` provides routes for **feature modules** itself (*if imports both `RouterModule` and `I18NRouterModule`, it will cause `@nglibs/i18n-router` to malfunction, even crash*).

### app.component configuration
Import `I18NRouterService` using the mapping `'@nglibs/i18n-router'` and **inject** it in the constructor of **app.component** (*considering the app.component is the bootstrap component in Angular application*).

Then, invoke the `init` method to fetch **route translations** loaded during application initalization and allow the use of `'@nglibs/i18n-router'` by the **Angular** app.

Lastly, you need to invoke the `changeLanguage` method by supplying the **2-letter language code**, which translates routes to the specified language.

#### app.component.ts
```TypeScript
...
import { I18NRouterService } from '@nglibs/i18n-router';
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

## Settings

You can call the [forRoot] static method using `I18NRouterStaticLoader`. By default, it is configured to pass the **routes** to **`@nglibs/i18n-router`** and have no translations.

> You can customize this behavior (*and ofc other settings*) by supplying **route translations** to `I18NRouterStaticLoader`.

If you provide route translations using a `JSON` file or an `API`, you can call the [forRoot] static method using the `I18NRouterHttpLoader`. By default, it is configured to retrieve **route translations** from the path `/routes.json` (*if not specified*).

> You can customize this behavior (and ofc other settings) by supplying a **file path/api endpoint** to I18NRouterHttpLoader.

You can also use the **[@nglibs/i18n-router-config-loader]**, to **reduce** the **amount** of `HTTP` requests during application initalization, by including **route translations** within the **application settings** - if [@nglibs/config] is already used to retrieve settings by the **Angular** app.

The following examples show the use of an exported function (*instead of an inline function*) for [AoT compilation].

### Setting up `I18NRouterModule` to use `I18NRouterStaticLoader`

#### app.module.ts
```TypeScript
...
import { I18NRouterModule, I18NRouterLoader, I18NRouterStaticLoader, I18N_ROUTER_PROVIDERS, RAW_ROUTES } from '@nglibs/i18n-router';
...

export function i18nRouterFactory(rawRoutes: Routes): I18NRouterLoader {
  return new I18NRouterStaticLoader(rawRoutes, {
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
  });
}

...

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    RouterModule.forRoot(routes),
    I18NRouterModule.forRoot(routes, [
      { provide: I18NRouterLoader, useFactory: (i18nRouterFactory), deps: [RAW_ROUTES] }
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

`I18NRouterStaticLoader` has two parameters:

- **routes**: `Routes`: raw routes
- **translations**: `any` : route translations

### Setting up `I18NRouterModule` to use `I18NRouterHttpLoader`

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
import { Http } from '@angular/http';
import { I18NRouterModule, I18NRouterLoader, I18NRouterHttpLoader, I18N_ROUTER_PROVIDERS, RAW_ROUTES } from '@nglibs/i18n-router';
...

export function i18nRouterFactory(http: Http, rawRoutes: Routes): I18NRouterLoader {
  return new I18NRouterHttpLoader(http, rawRoutes, '/routes.json'); // FILE PATH || API ENDPOINT
}

...

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    RouterModule.forRoot(routes),
    I18NRouterModule.forRoot(routes, [
      { provide: I18NRouterLoader, useFactory: (i18nRouterFactory), deps: [Http, RAW_ROUTES] }
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
- **routes**: `Routes`: raw routes
- **path**: `string` : path to `JSON file`/`API endpoint`, to retrieve route translations from (*by default, `routes.json`*)

### Translations object

The translations object is designed to contain **route translations** in every **language** supported by **Angular** application, in **JSON format**.

When the `changeLanguage` method of `@nglibs\i18n-router` is invoked, **route configuration** is **reset** based on the supplied translations.

You should use the following **data structure** while working with the translation object:

- Assume that there're a number of **{N}** supported languages. The object contains **{N}** times first-level children, **key**ed with its **2-letter language code** and **value**d by translations specific to that language.
- Language keys are in **lowercase**.

```
ex: Angular app supports en, fr and tr

{
  "en": { ... },
  "fr": { ... },
  "tr": { ... }
}
```

- Routes within the **`I18N-ROOT`** scope must be **key**ed with the `ROOT` **prefix**, followed by a dot char `.`, and then the **moduleKey** (*module's root path in kebab-case*).
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

- **Underscores** `_` must be used instead of **dashes** `-` in the route **key**s (*using dashes in keys causes errors*). They're automatically replaced with **dashes** `-` while `I18nRouterService` is **translating the routes**.

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

- Route **path**s are split by **slashes** `/` into string **part**s. When **key**ing and they're separated by **dots** `.` (*ex: path: 'goes/to/your-page' -> 'GOES.TO.YOUR_PAGE'*).
- Route **params** (*followed by colon*) are **not needed to be included** in the translations object (*ex: path: goes/to/:id/page -> 'GOES.TO.PAGE'*)

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

> :+1: Hooyah! It was quite a long story, but **`@nglibs/i18n-router`** will now translate each `path` and `redirectTo` property of routes.

## Change language (runtime)

Import `I18NRouterService` using the mapping `'@nglibs/i18n-router'` and **inject** it in the constructor of **change-language.component** (*considering the change-language.component changes the language in Angular application*).

Then, invoke the `changeLanguage` method by supplying the **2-letter language code**, which translates routes to the destination language.

```TypeScript
...
import { I18NRouterService } from '@nglibs/i18n-router';
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

      if (!!languageCode)
        // change language
		this.i18nRouter.changeLanguage(languageCode);

      this.router.navigate(['/']);
    });
  }
  ...
}
```

## Pipe

`I18nRouterPipe` is used to **prefix** and **translate** `routerLink` directive's content. Pipe can be appended **ONLY** to a single **empty string** in the `routerLink`'s definition or to an **entire array** element:

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

## Credits
- [localize-router](https://github.com/Greentube/localize-router): An implementation of routes localization for Angular 2

## License
The MIT License (MIT)

Copyright (c) 2017 [Burak Tasci]

[@nglibs]: https://github.com/nglibs
[master]: https://github.com/nglibs/i18n-router/tree/master
[v0.2.x]: https://github.com/nglibs/i18n-router/tree/v0.2.x
[@nglibs/example-app]: https://github.com/nglibs/example-app
[@nglibs/config]: https://github.com/nglibs/config
[@nglibs/meta]: https://github.com/nglibs/meta
[@nglibs/i18n-router]: https://github.com/nglibs/i18n-router
[@nglibs/i18n-router-config-loader]: https://github.com/nglibs/i18n-router-config-loader
[@nglibs/universal-express-engine]: https://github.com/nglibs/universal-express-engine
[@nglibs/universal-transfer-state]: https://github.com/nglibs/universal-transfer-state
[ng-router-loader]: https://github.com/shlomiassaf/ng-router-loader
[forRoot]: https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root
[AoT compilation]: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html
[Burak Tasci]: http://www.buraktasci.com
