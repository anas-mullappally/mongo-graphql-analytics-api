import { buildSchema } from "graphql";
import fs from "fs";
import path from "path";

// Load all .graphql files and join them
const typeDefsDir = path.resolve("src/graphql/typeDefs");
const files = fs.readdirSync(typeDefsDir);
const typeDefs = files
  .map((file) => fs.readFileSync(path.join(typeDefsDir, file), "utf-8"))
  .join("\n");

// Add root Query definition
const schema = buildSchema(`
  ${typeDefs}

  type Query {
    getCustomerSpending(customerId: ID!): CustomerSpending
    getTopSellingProducts(limit: Int!): [TopProduct]
    getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics
  }
`);

export { schema };
