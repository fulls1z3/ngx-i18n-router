// angular
import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export const testTranslations = {
  en: {
    'ROOT.ABOUT': 'about',
    'ROOT.ABOUT.US': 'us',
    'ROOT.ABOUT.BANANA': 'banana',
    'ROOT.ABOUT.APPLE': 'apple',
    'ROOT.ABOUT.APPLE.PEAR': 'pear',
    'ROOT.ABOUT.PLUM': 'plum',
    CHANGE_LANGUAGE: 'change-language'
  },
  tr: {
    'ROOT.ABOUT': 'hakkinda',
    'ROOT.ABOUT.US': 'biz',
    // "ROOT.ABOUT.BANANA": 'muz',
    'ROOT.ABOUT.APPLE': 'elma',
    'ROOT.ABOUT.APPLE.PEAR': 'armut',
    'ROOT.ABOUT.PLUM': 'erik',
    CHANGE_LANGUAGE: 'dil-secimi'
  }
};

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions): Http {
  backend.connections
    .subscribe((connection: MockConnection) => {
      if (connection.request.url.endsWith('/api/routes')
        && connection.request.method === RequestMethod.Get)
          connection.mockRespond(new Response(
            new ResponseOptions({
              status: 200,
              body: testTranslations
            })
          ));
      else
        connection.mockError(new Error('500'));
    });

  return new Http(backend, options);
}
