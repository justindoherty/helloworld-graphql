# helloworld-graphql
The goal of this repository is to try out GraphQL to become familiar with the technology to possibly apply it toward future projects

## Setup
### Client
The client will be done in [Angular](https://angular.io/) and use the [Apollo Client](http://dev.apollodata.com/). I've chosen [Angular](https://angular.io/) because it is the most likely client side framework that I'd use in the near future for a new project.

#### Usage
1. Before anything you must `npm install`
1. Ensure a GraphQL server is running because it's needed to generate the GraphQL TypeScript types
1. Generate the GraphQL types `npm run graphql`
1. Finally run the server `npm start`

### Server
The server will be an [Express](http://expressjs.com/) node.js server. It is well supported, performant and easy to set up. I will then use [graphql-server](http://graphql.org/code/#graphql-server-http-dev-apollodata-com-tools-graphql-server-index-html-github-https-github-com-apollostack-graphql-server-npm-https-www-npmjs-com-package-graphql-server) and a set of GraphQL packages offered by [Apollo](http://dev.apollodata.com/tools/graphql-server/index.html) for the server side implementation.

### ~~Java Server (abandoned)~~
~~The server will be a [Spark](http://sparkjava.com/) server because it is supposed to be simple to setup. I will then use [graphql-java](https://github.com/graphql-java) for the server side GraphQL implementation.
This was abandoned because it wasn't as simple as I desired and didn't offer the support for pushing updates from the server that the node.js implementation does.~~

## Goals
- [x] Get a basic GraphQL server running
- [x] Call a basic GraphQL endpoint from within an Angular application
- [x] Query for nested data
- [ ] Update data from client to server
- [ ] Push updates to a query from the server and have the Angular application update
- [ ] Explore paging and filtering
- [x] Figure out how strong typing of TypeScript works since GraphQL allows for partial object data
  - https://dev-blog.apollodata.com/graphql-dx-d35bcf51c943
  - https://www.npmjs.com/package/apollo-codegen
    Generates interface file from schema and graphql files
- [ ] Integrate with [@ngrx/store](https://github.com/ngrx/store)
