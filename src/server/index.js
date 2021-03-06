import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './data/schema';
import resolvers from './data/resolvers';

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use('/static', express.static('dist/client'));
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../index.html'));
  });
} else {
  const cors = require('cors');
  app.use(cors());
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
  }));
}

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));


var PORT = process.env.PORT || 3001;
app.listen(PORT, function(err) {
  if (err) return console.error(err);
  console.log('Listening on port', PORT);
});
