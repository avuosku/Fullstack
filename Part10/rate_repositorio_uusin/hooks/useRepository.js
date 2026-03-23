import { useQuery } from '@apollo/client';
import { GET_REPOSITORY } from '../graphql/queries';

const useRepository = (id, first = 5) => {
  const { data, loading, fetchMore } = useQuery(GET_REPOSITORY, {
    variables: {
      id,
      first,
    },
    fetchPolicy: 'cache-and-network',
  });

  const handleFetchMore = () => {
    const pageInfo = data?.repository?.reviews?.pageInfo;

    if (!pageInfo?.hasNextPage) {
      return;
    }

    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first,
        id,
      },
    });
  };

  return {
    repository: data?.repository,
    loading,
    fetchMore: handleFetchMore,
  };
};

export default useRepository;
