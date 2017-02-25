const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const fs = require('fs');
const glob = require('glob');

const fileNames = glob.sync('./schema/*.graphql')
if (fileNames.length === 0) {
    throw GraphQLLoaderError.zeroMatchError(pattern)
}

const typeDefs = fileNames.map(fileName => fs.readFileSync(fileName, 'utf8'));

const resolvers = {
    Query: {
        hello(obj, args, context, info) {
            return 'world';
        }
    }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
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
app.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));