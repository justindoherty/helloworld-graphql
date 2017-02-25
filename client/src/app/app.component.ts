import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import 'rxjs/add/operator/map';

import helloWorldQuery from 'graphql-tag/loader!./hello-world.query.graphql';
import { HelloWorldQuery } from './schema';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  data: any;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.watchQuery({ query: helloWorldQuery })
      .map(ret => ret.data)
      .subscribe((data: HelloWorldQuery) => this.data = data);
  }
}
