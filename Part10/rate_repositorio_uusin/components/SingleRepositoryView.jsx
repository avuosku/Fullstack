import React from 'react';
import { View, FlatList, Pressable, Text, StyleSheet, Linking } from 'react-native';
import { useParams } from 'react-router-native';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';

import RepositoryItem from './RepositoryItem';
import { GET_REPOSITORY } from '../graphql/queries';

const RepositoryInfo = ({ repository }) => {
  return (
    <View>
      <RepositoryItem item={repository} singleView />
      <Pressable onPress={() => Linking.openURL(repository.url)} style={styles.button}>
        <Text style={styles.buttonText}>Open in GitHub</Text>
      </Pressable>
    </View>
  );
};

const ReviewItem = ({ review }) => {
  const date = format(new Date(review.createdAt), 'dd.MM.yyyy');

  return (
    <View style={styles.reviewItem}>
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>{review.rating}</Text>
      </View>
      <View style={styles.reviewContent}>
        <Text style={styles.username}>{review.user.username}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.text}>{review.text}</Text>
      </View>
    </View>
  );
};

const SingleRepository = () => {
  const { id } = useParams();

  const { data, loading } = useQuery(GET_REPOSITORY, {
    variables: { repositoryId: id },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <Text>Loading...</Text>;

  const repository = data.repository;
  const reviews = repository.reviews.edges.map(edge => edge.node);

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0366d6',
    padding: 12,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reviewItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#0366d6',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rating: {
    color: '#0366d6',
    fontWeight: 'bold',
  },
  reviewContent: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
  },
  date: {
    color: 'gray',
    marginBottom: 5,
  },
  text: {
    marginTop: 5,
  },
});

export default SingleRepository;
