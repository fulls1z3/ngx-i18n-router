// angular
import { Routes } from '@angular/router';

// libs
import * as _ from 'lodash';

export abstract class I18NRouterLoader {
    abstract getRoutes(): Routes;
    abstract getTranslations(): Routes;
}

export class I18NRouterStaticLoader implements I18NRouterLoader {
    constructor(private readonly routes: Routes = [],
                private readonly translations: any = {}) {}

    getRoutes(): Routes {
        return _.map(this.routes, _.cloneDeep);
    }

    getTranslations(): any {
        return this.translations;
    }
}
