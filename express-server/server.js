import { createServer } from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionManager, PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import fs from 'fs';
import glob from 'glob';

const fileNames = glob.sync('./schema/*.graphql')
if (fileNames.length === 0) {
    throw GraphQLLoaderError.zeroMatchError(pattern)
}

const typeDefs = fileNames.map(fileName => fs.readFileSync(fileName, 'utf8'));

class PersonResolver {
    name(args, context) {
        return 'super';
    }
    age() {
        return 123;
    }
    dog() {
        return new DogResolver();
    }
}

class DogResolver {
    name() {
        return 'rufus';
    }
}

const resolvers = {
    Query: {
        hello(obj, args, context, info) {
            return 'world';
        },
        human() {
            return new PersonResolver();
        }
    },
    Mutation: {
        tickle(_, { val }) {
            pubsub.publish('thingChannel', val);
            return val;
        }
    },
    Subscription: {
        thing(val) {
            return val;
        }
    }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const pubsub = new PubSub();
const subscriptionManager = new SubscriptionManager({
    schema,
    pubsub,
    setupFunctions: {
        thing: (options, args) => ({
            thingChannel: {
                filter: thing => {
                    return true;
                }
            }
        }),
    }
});

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

const server = createServer(app);

server.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));

const subscriptionServer = new SubscriptionServer({
    subscriptionManager
}, {
        server: server, // or use existing server with different path
        path: '/'
    });
