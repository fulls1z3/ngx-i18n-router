# Change Log
All notable changes to this project will be documented in this file.

## v0.4.0-beta.2 - 2017-05-09
### Breaking change
- `@nglibs/i18n-router` has been renamed to `@ngx-i18n-router/core` (closes [#8](https://github.com/ngx-i18n-router/core/issues/8))
- separate `http` loader from the package (closes [#9](https://github.com/ngx-i18n-router/core/issues/9))

### Fixed
- Resolved add `yarn.lock` to npmignore (closes [#7](https://github.com/ngx-i18n-router/core/issues/7))

### Changed
- Updated README.md
- Updated deps, test config, gulp tasks, webpack config, ignorers, tslint
- Some refactoring

## v0.4.0-beta.1 - 2017-03-15
### Changed
- Depend on Angular 4.0.0

## v0.2.0-beta.4 - 2017-03-15
### Fixed
- Resolved depend on Angular 2.0.0 (closes [#3](https://github.com/ngx-i18n-router/core/issues/3))
- Limited to Angular 2.x.x (use v0.4.0 for Angular 4.x.x)
- Workaround for AoT compilation

### Changed
- Updated deps
- Some refactoring

## v0.2.0-beta.3 - 2017-02-23
### Fixed
- Forced to use TypeScript 2.1.x

### Changed
- Updated README.md
- Updated deps

## v0.2.0-beta.2 - 2017-02-20
### Added
- Added 'I18NRouterHttpLoader`

## v0.2.0-beta.1 - 2017-02-17
### Added
- Added unit tests

### Changed
- Some refactoring

## v0.2.0-alpha.4 - 2017-02-13
### Fixed
- Resolved `Argument of type 'string[]' is not assignable to parameter of type 'string'.)` issue
- Resolved providing entryComponents issue (provides dynamically now)

## v0.2.0-alpha.3 - 2017-02-13
### Fixed
- Resolved AoT compilation issue

## v0.2.0-alpha.2 - 2017-02-11
### Changed
- Updated README.md
- Some refactoring

## v0.2.0-alpha.1 - 2017-02-11
- Pre-release
