import React from 'react';
import { render, screen } from '@testing-library/react-native';
import RepositoryListContainer from '../../components/RepositoryListContainer';

describe('RepositoryList', () => {
  describe('RepositoryListContainer', () => {
    it('renders repository information correctly', () => {
      const repositories = {
        totalCount: 8,
        pageInfo: {
          hasNextPage: true,
          endCursor: '...',
          startCursor: '...',
        },
        edges: [
          {
            node: {
              id: 'jaredpalmer.formik',
              fullName: 'jaredpalmer/formik',
              description: 'Build forms in React, without the tears',
              language: 'TypeScript',
              forksCount: 1619,
              stargazersCount: 21856,
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/4060187?v=4',
            },
          },
          {
            node: {
              id: 'async-library.react-async',
              fullName: 'async-library/react-async',
              description: 'Flexible promise-based React data loader',
              language: 'JavaScript',
              forksCount: 69,
              stargazersCount: 1760,
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl: 'https://avatars1.githubusercontent.com/u/54310907?v=4',
            },
          },
        ],
      };

      render(<RepositoryListContainer repositories={repositories} />);

      const repositoryItems = screen.getAllByTestId('repositoryItem');
      expect(repositoryItems).toHaveLength(2);

      // Tarkista ensimmäisen repotiedot
      expect(repositoryItems[0]).toHaveTextContent('jaredpalmer/formik');
      expect(repositoryItems[0]).toHaveTextContent('Build forms in React, without the tears');
      expect(repositoryItems[0]).toHaveTextContent('TypeScript');
      expect(repositoryItems[0]).toHaveTextContent('1619');
      expect(repositoryItems[0]).toHaveTextContent('21856');
      expect(repositoryItems[0]).toHaveTextContent('88');
      expect(repositoryItems[0]).toHaveTextContent('3');

      // Tarkista toisen repotiedot
      expect(repositoryItems[1]).toHaveTextContent('async-library/react-async');
      expect(repositoryItems[1]).toHaveTextContent('Flexible promise-based React data loader');
      expect(repositoryItems[1]).toHaveTextContent('JavaScript');
      expect(repositoryItems[1]).toHaveTextContent('69');
      expect(repositoryItems[1]).toHaveTextContent('1760');
      expect(repositoryItems[1]).toHaveTextContent('72');
      expect(repositoryItems[1]).toHaveTextContent('3');
    });
  });
});
