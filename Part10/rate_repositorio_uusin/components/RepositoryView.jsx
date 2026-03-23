import React from 'react';
import { View, FlatList, StyleSheet, Pressable, Linking } from 'react-native';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-native';

import { GET_REPOSITORY } from '../graphql/queries';
import Text from './Text';
import ReviewItem from './ReviewItem';
import RepositoryItem from './RepositoryItem';

const RepositoryView = () => {
  const { id } = useParams();

  const { data, loading, error, fetchMore } = useQuery(GET_REPOSITORY, {
    variables: { id, first: 5 },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const repository = data?.repository;

  if (!repository) return <Text>Repository not found</Text>;

  const reviews = repository.reviews?.edges ?? [];

  const handleOpenGitHub = () => {
    if (repository.url) {
      Linking.openURL(repository.url);
    }
  };

  const handleFetchMore = () => {
    if (!repository.reviews.pageInfo.hasNextPage) return;

    fetchMore({
      variables: {
        after: repository.reviews.pageInfo.endCursor,
        id,
        first: 5,
      },
    });
  };

  const renderHeader = () => (
    <View>
      <RepositoryItem item={repository} />

      <Pressable style={styles.githubButton} onPress={handleOpenGitHub}>
        <Text style={styles.githubButtonText}>Open in GitHub</Text>
      </Pressable>
    </View>
  );

  return (
    <FlatList
      data={reviews}
      keyExtractor={({ node }) => node.id}
      renderItem={({ item }) => <ReviewItem review={item.node} />}
      ListHeaderComponent={renderHeader}
      onEndReached={handleFetchMore}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({
  githubButton: {
    margin: 10,
    padding: 12,
    backgroundColor: '#0366d6',
    borderRadius: 5,
  },
  githubButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RepositoryView;