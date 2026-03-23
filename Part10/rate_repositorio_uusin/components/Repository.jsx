import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useParams } from 'react-router-native';
import useRepository from '../hooks/useRepository';
import RepositoryItem from './RepositoryItem';
import ReviewItem from './ReviewItem';

const Repository = () => {
  const { id } = useParams();
  const { repository, loading, fetchMore } = useRepository(id, 5);

  if (loading) return <Text>Loading...</Text>;
  if (!repository) return null;

  return (
    <FlatList
      data={repository.reviews.edges}
      keyExtractor={(item) => item.node.id}
      renderItem={({ item }) => (
        <ReviewItem review={item.node} />
      )}
      ListHeaderComponent={() => (
        <RepositoryItem item={repository} />
      )}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.5}
    />
  );
};

export default Repository;
