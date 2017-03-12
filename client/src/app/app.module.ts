import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import helloWorldQueryString from 'raw-loader!./hello-world.query.graphql';
import helloWorldQuery from 'graphql-tag/loader!./hello-world.query.graphql';
import { AppComponent } from './app.component';

function getAddress() {
  let address = location.hostname;
  if (location.port) {
    address += ':' + location.port;
  }
  return address;
}

const networkInterface = createNetworkInterface({
  uri: `/graphql`
});

const wsClient = new SubscriptionClient(`ws://${getAddress()}/graphqlsocket`, {
  reconnect: true
});

addGraphQLSubscriptions(networkInterface, wsClient);

const client = new ApolloClient({
  networkInterface
});

export function provideClient(): ApolloClient {
  return client;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ApolloModule.forRoot(provideClient)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, ngZone: NgZone) {
    const origSubscribe = apollo.subscribe;
    // Subscription events were not being recognized
    apollo.subscribe = options => Observable.create((observer: Observer<any>) => {
      const subscription = origSubscribe.call(apollo, options).subscribe(
        res => ngZone.run(() => observer.next(res)),
        err => ngZone.run(() => observer.error(err)),
        () => ngZone.run(() => observer.complete())
      );

      return () => subscription.unsubscribe();
    });
  }
}
