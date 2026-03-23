import React from 'react';
import { View, FlatList, StyleSheet, Pressable } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-native';

import { ME } from '../graphql/queries';
import { DELETE_REVIEW } from '../graphql/mutations';

import Text from './Text';
import ReviewItem from './ReviewItem';

const MyReviews = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteReview] = useMutation(DELETE_REVIEW);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const reviews = data?.me?.reviews?.edges ?? [];

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this review?'
    );

    if (!confirmed) return;

    try {
      await deleteReview({
        variables: { id },
        refetchQueries: [
          {
            query: ME,
            variables: { includeReviews: true },
          },
        ],
      });
    } catch (error) {
      console.error('Delete review error:', error);
    }
  };

  const handleViewRepository = (repositoryId) => {
    navigate(`/repository/${repositoryId}`);
  };

  return (
    <FlatList
      data={reviews}
      keyExtractor={({ node }) => node.id}
      renderItem={({ item }) => {
        const review = item.node;

        return (
          <View style={styles.reviewContainer}>
            <ReviewItem review={review} />

            <Pressable
              style={styles.viewButton}
              onPress={() => handleViewRepository(review.repository.id)}
            >
              <Text style={styles.viewButtonText}>
                View repository
              </Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDelete(review.id)}
            >
              <Text style={styles.deleteButtonText}>
                Delete review
              </Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  reviewContainer: {
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },

  viewButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#0366d6',
    borderRadius: 4,
  },

  viewButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  deleteButton: {
    marginTop: 6,
    padding: 8,
    backgroundColor: '#d73a4a',
    borderRadius: 4,
  },

  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MyReviews;