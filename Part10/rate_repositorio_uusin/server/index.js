import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';

// Esimerkkiskeema (voit muokata tämän tarpeidesi mukaan)
const typeDefs = gql`
  type Repository {
    id: ID!
    fullName: String!
    description: String
    language: String
    forksCount: Int
    stargazersCount: Int
    ratingAverage: Int
    reviewCount: Int
    ownerAvatarUrl: String
  }

  type Query {
    repositories: [Repository]
  }
`;

// Esimerkkidata
const repositories = [
  {
    id: 'repo1',
    fullName: 'user/repo1',
    description: 'Awesome repo',
    language: 'JavaScript',
    forksCount: 120,
    stargazersCount: 300,
    ratingAverage: 90,
    reviewCount: 5,
    ownerAvatarUrl: 'https://placekitten.com/200/200',
  },
  {
    id: 'repo2',
    fullName: 'user/repo2',
    description: 'Another great repo',
    language: 'Python',
    forksCount: 42,
    stargazersCount: 77,
    ratingAverage: 85,
    reviewCount: 2,
    ownerAvatarUrl: 'https://placekitten.com/200/201',
  },
];

// Resolverit
const resolvers = {
  Query: {
    repositories: () => repositories,
  },
};

// Luo palvelin
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Käynnistä palvelin
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);
