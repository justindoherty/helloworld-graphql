import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import helloWorldQuery from 'graphql-tag/loader!./hello-world.query.graphql';
import helloMutantWorldMutation from 'graphql-tag/loader!./hello-mutant-world.mutation.graphql';
import helloRealtimeWorldSubscription from 'graphql-tag/loader!./hello-realtime-world.subscription.graphql';
import { HelloRealtimeWorldSubscription, HelloWorldQuery } from './schema';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  data: Observable<HelloWorldQuery>;
  subscriptionData: Observable<HelloRealtimeWorldSubscription>;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.data = this.apollo.watchQuery({ query: helloWorldQuery }).map(ret => ret.data);
    this.subscriptionData = this.apollo.subscribe({ query: helloRealtimeWorldSubscription });
  }

  onClick(val: String) {
    this.apollo.mutate({
      mutation: helloMutantWorldMutation,
      variables: {
        val: val
      }
    });
  }
}
