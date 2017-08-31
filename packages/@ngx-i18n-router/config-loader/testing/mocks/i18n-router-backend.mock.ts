// angular
import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export const testSettings = {
  routes: {
    en: {
      'ROOT.ABOUT': 'about'
    },
    tr: {
      'ROOT.ABOUT': 'hakkinda'
    }
  }
};

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions): Http {
  backend.connections
    .subscribe((connection: MockConnection) => {
      if (connection.request.url.endsWith('/config.json')
        && connection.request.method === RequestMethod.Get)
        connection.mockRespond(new Response(
          new ResponseOptions({
            status: 200,
            body: testSettings
          })
        ));
      else
        connection.mockError(new Error('500'));
    });

  return new Http(backend, options);
}
