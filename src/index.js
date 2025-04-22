import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './graphql/schema.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use('/graphql', createHandler({
  schema,
  rootValue: await import('./graphql/resolvers.js')
}));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
