// angular
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Component, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// module
import { I18NRouterModule, I18NRouterPipe, I18N_ROUTER_PROVIDERS } from '../index';

@Component({ template: '<router-outlet></router-outlet>' })
export class TestBootstrapComponent {}

@Component({ template: '' })
export class TestComponent {}

@NgModule({
    declarations: [
        TestBootstrapComponent,
        TestComponent
    ],
    imports: [RouterTestingModule]
})
class TestSharedModule { }

@NgModule({
    imports: [
        TestSharedModule,
        I18NRouterModule.forChild([
                {
                    path: '',
                    component: TestComponent
                }
            ],
            'home')
    ]
})
class TestHomeModule { }

@NgModule({
    imports: [
        TestSharedModule,
        I18NRouterModule.forChild([
                {
                    path: '',
                    component: TestBootstrapComponent,
                    children: [
                        {
                            path: 'us/:topicId',
                            component: TestComponent
                        },
                        {
                            path: 'banana',
                            component: TestComponent
                        },
                        {
                            path: 'apple/:fruitId/pear',
                            component: TestComponent
                        },
                        {
                            path: 'plum',
                            redirectTo: '/about/banana',
                            pathMatch: 'full'
                        }
                    ]
                }
            ],
            'about')
    ]
})
class TestAboutModule { }

export const testRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadChildren: () => TestHomeModule
            },
            {
                path: 'about',
                loadChildren: () => TestAboutModule
            }
        ],
        data: {
            i18n: {
                isRoot: true
            }
        }
    },
    {
        path: 'change-language/:languageCode',
        component: TestComponent
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];

export const testTranslations = {
    "en": {
        "ROOT.ABOUT": 'about',
        "ROOT.ABOUT.US": 'us',
        "ROOT.ABOUT.BANANA": 'banana',
        "ROOT.ABOUT.APPLE": 'apple',
        "ROOT.ABOUT.APPLE.PEAR": 'pear',
        "ROOT.ABOUT.PLUM": 'plum',
        "CHANGE_LANGUAGE": 'change-language'
    },
    "tr": {
        "ROOT.ABOUT": 'hakkinda',
        "ROOT.ABOUT.US": 'biz',
        //"ROOT.ABOUT.BANANA": 'muz', // commented on purpose
        "ROOT.ABOUT.APPLE": 'elma',
        "ROOT.ABOUT.APPLE.PEAR": 'armut',
        "ROOT.ABOUT.PLUM": 'erik',
        "CHANGE_LANGUAGE": 'dil-secimi'
    }
};

// test module configuration for each test
export const testModuleConfig = (routes: Routes = [], moduleOptions?: Array<any>) => {
    // reset the test environment before initializing it.
    TestBed.resetTestEnvironment();

    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
        .configureTestingModule({
            imports: [
                TestSharedModule,
                RouterTestingModule.withRoutes(routes),
                I18NRouterModule.forRoot(routes, moduleOptions)
            ],
            providers: [
                I18N_ROUTER_PROVIDERS
            ]
        });
};
