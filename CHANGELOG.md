# Change Log
All notable changes to this project will be documented in this file.

## Current iteration
### Breaking changes
- **packaging:** merge public API into a single repository

## v0.4.0-beta.2 - 2017-05-09
### Breaking changes
- **packaging:** rename `@nglibs/i18n-router` to `@ngx-i18n-router/core` (closes [#8](https://github.com/fulls1z3/ngx-i18n-router/issues/8))
- **packaging:** separate `http` loader from the package (closes [#9](https://github.com/fulls1z3/ngx-i18n-router/issues/9))

### Bug fixes
- **core:** add `yarn.lock` to npmignore (closes [#7](https://github.com/fulls1z3/ngx-i18n-router/issues/7))

## v0.4.0-beta.1 - 2017-03-15
### Bug fixes
- **core:** depend on Angular 2.0.0 (closes [#3](https://github.com/fulls1z3/ngx-i18n-router/issues/3))

## v0.2.0-beta.4 - 2017-03-15
### Bug fixes
- **core:** workaround for AoT compilation

## v0.2.0-beta.3 - 2017-02-23
### Bug fixes
- **core:** depend on TypeScript 2.1.x

## v0.2.0-beta.2 - 2017-02-20
### Features
- **core:** add 'I18NRouterHttpLoader`

## v0.2.0-beta.1 - 2017-02-17
### Bug fixes
- **core:** resolve `Argument of type 'string[]' is not assignable to parameter of type 'string'.)`
- **core:** providing entryComponents dynamically
