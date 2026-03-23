import { useMutation, useApolloClient } from '@apollo/client';
import { CREATE_REVIEW } from '../graphql/mutations';

const useCreateReview = () => {
  const [mutate, result] = useMutation(CREATE_REVIEW);
  const apolloClient = useApolloClient();

  const createReview = async ({ repositoryId, rating, text }) => {
    const { data } = await mutate({
      variables: {
        review: { repositoryId, rating: Number(rating), text },
      },
    });

    await apolloClient.resetStore(); // päivitä cache
    return data;
  };

  return [createReview, result];
};

export default useCreateReview;