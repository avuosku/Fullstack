import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { useDebounce } from 'use-debounce';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';
import ListHeader from './ListHeader';
import { useNavigate } from 'react-router-native';

const RepositoryList = () => {

  const navigate = useNavigate();

  const [order, setOrder] = useState('latest');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [debouncedKeyword] = useDebounce(searchKeyword, 500);

  let orderBy = 'CREATED_AT';
  let orderDirection = 'DESC';

  if (order === 'highest') {
    orderBy = 'RATING_AVERAGE';
    orderDirection = 'DESC';
  }

  if (order === 'lowest') {
    orderBy = 'RATING_AVERAGE';
    orderDirection = 'ASC';
  }

  const { repositories } = useRepositories({
    orderBy,
    orderDirection,
    searchKeyword: debouncedKeyword
  });

  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  const handlePress = (id) => {
    navigate(`/repository/${id}`);
  };

  return (
    <FlatList
      data={repositoryNodes}
      renderItem={({ item }) =>
        <RepositoryItem item={item} onPress={handlePress} />
      }
      keyExtractor={(item) => item.id}

      ListHeaderComponent={
        <ListHeader
          order={order}
          setOrder={setOrder}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />
      }
    />
  );
};

export default RepositoryList;