import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';

const ReviewItem = ({ review }) => {
  if (!review) return null;

  const formattedDate = review.createdAt
    ? format(new Date(review.createdAt), 'dd.MM.yyyy')
    : '';

  const title =
    review.user?.username ||
    review.repository?.fullName ||
    'Unknown';

  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>{review.rating}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.username}>{title}</Text>
        <Text style={styles.date}>{formattedDate}</Text>

        {review.text ? (
          <Text style={styles.text}>{review.text}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
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
    marginRight: 15,
  },

  rating: {
    color: '#0366d6',
    fontWeight: 'bold',
    fontSize: 18,
  },

  infoContainer: {
    flex: 1,
  },

  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 3,
  },

  date: {
    color: '#586069',
    fontSize: 14,
    marginBottom: 5,
  },

  text: {
    fontSize: 15,
    lineHeight: 20,
  },
});

export default ReviewItem;