import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { PrismaClient } from '@prisma/client';
import {
  GraphQLSchema,
  graphql,
  validate,
  parse,
} from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { query } from './graphQLObjectTypes/query.js';
import { mutation } from './graphQLObjectTypes/mutation.js';


const DEPTH_LIMIT = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const prisma = new PrismaClient();

  const graphQLSchema = new GraphQLSchema({ query, mutation });

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const parsedQuery = parse(query);
      const graphQLErrors = validate(graphQLSchema, parsedQuery, [depthLimit(DEPTH_LIMIT)]);

      if (graphQLErrors.length) return { data: null, errors: graphQLErrors };

      const { data, errors } = await graphql({
        schema: graphQLSchema,
        source: query,
        variableValues: variables,
        contextValue: {
          prisma,
        },
      });

      return { data, errors };
    },
  });
};

export default plugin;
