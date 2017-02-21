// angular
import { Routes } from '@angular/router';
import { Http } from '@angular/http';

// libs
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

export abstract class I18NRouterLoader {
    abstract loadTranslations(): any;
    abstract getRoutes(): Routes;
    abstract getTranslations(): any;
}

export class I18NRouterStaticLoader implements I18NRouterLoader {
    constructor(private readonly routes?: Routes,
                private readonly translations?: any) {}

    loadTranslations(): any {
        return Promise.resolve(this.translations);
    }

    getRoutes(): Routes {
        return _.map(this.routes, _.cloneDeep);
    }

    getTranslations(): any {
        return this.translations;
    }
}

export class I18NRouterHttpLoader implements I18NRouterLoader {
    private translations: any;

    constructor(private readonly http: Http,
                private readonly routes?: Routes,
                private readonly path: string = '/routes.json') {}

    loadTranslations(): any {
        return this.http.get(this.path)
            .map((res: any) => res.json())
            .toPromise()
            .then((translations: any) => this.translations = translations)
            .catch(() => Promise.reject('Endpoint unreachable!'));
    }

    getRoutes(): Routes {
        return _.map(this.routes, _.cloneDeep);
    }

    getTranslations(): any {
        return this.translations;
    }
}
