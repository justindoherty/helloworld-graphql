import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const HelloWorld = gql`
  query helloWorldQuery {
    hello
  }
`;

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
    this.apollo.watchQuery({ query: HelloWorld })
      .subscribe(({data}) => this.data = data);
  }
}
