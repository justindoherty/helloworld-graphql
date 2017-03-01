import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import 'rxjs/add/operator/do';

import helloWorldQueryString from 'raw-loader!./hello-world.query.graphql';
import helloWorldQuery from 'graphql-tag/loader!./hello-world.query.graphql';
import { AppComponent } from './app.component';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:4000/graphql'
});

const wsClient = new SubscriptionClient('ws://localhost:4000', {
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
    apollo.subscribe = (options) => {
      return origSubscribe.call(apollo, options).do(() => setTimeout(() => ngZone.run(() => { })));
    }
  }
}
