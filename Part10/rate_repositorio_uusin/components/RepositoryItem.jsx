import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Platform } from 'react-native';
import { useNavigate } from 'react-router-native';

const formatCount = (count) =>
  count >= 1000 ? (count / 1000).toFixed(1).replace('.0', '') + 'k' : count.toString();

const Stat = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{formatCount(value)}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const RepositoryItem = ({ item, onPress }) => {
  const navigate = useNavigate();

  // Handler, joka toimii webissä ja mobiilissa
  const handlePress = () => {
    if (onPress) {
      onPress(item.id);
    } else {
      navigate(`/repositories/${item.id}`);
    }
  };

  // Webissä käytetään div + onClick
  if (Platform.OS === 'web') {
    return (
      <div onClick={handlePress} style={webStyles.container}>
        <img src={item.ownerAvatarUrl} alt={item.fullName} style={webStyles.avatar} />
        <div style={webStyles.info}>
          <div style={webStyles.fullName}>{item.fullName}</div>
          <div style={webStyles.description}>{item.description}</div>
          <div style={webStyles.language}>{item.language}</div>
          <div style={webStyles.stats}>
            <Stat label="Stars" value={item.stargazersCount} />
            <Stat label="Forks" value={item.forksCount} />
            <Stat label="Reviews" value={item.reviewCount} />
            <Stat label="Rating" value={item.ratingAverage} />
          </div>
        </div>
      </div>
    );
  }

  // Mobiilissa Pressable toimii normaalisti
  return (
    <Pressable onPress={handlePress}>
      <View style={styles.container}>
        <Image source={{ uri: item.ownerAvatarUrl }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.fullName}>{item.fullName}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.language}>{item.language}</Text>
          <View style={styles.stats}>
            <Stat label="Stars" value={item.stargazersCount} />
            <Stat label="Forks" value={item.forksCount} />
            <Stat label="Reviews" value={item.reviewCount} />
            <Stat label="Rating" value={item.ratingAverage} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// Mobiilin tyylit
const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    flexDirection: 'row',
    borderRadius: 5,
    elevation: 2,
  },
  avatar: { width: 50, height: 50, borderRadius: 4, marginRight: 15 },
  info: { flex: 1 },
  fullName: { fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
  description: { color: '#555', marginBottom: 6 },
  language: {
    backgroundColor: '#0366d6',
    color: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontWeight: 'bold', fontSize: 16 },
  statLabel: { color: '#666', fontSize: 12 },
});

// Webin tyylit (inline-tyylit JS objekteina)
const webStyles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    cursor: 'pointer',
  },
  avatar: { width: 50, height: 50, borderRadius: 4, marginRight: 15 },
  info: { flex: 1 },
  fullName: { fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
  description: { color: '#555', marginBottom: 6 },
  language: {
    backgroundColor: '#0366d6',
    color: 'white',
    padding: '4px 8px',
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  stats: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontWeight: 'bold', fontSize: 16 },
  statLabel: { color: '#666', fontSize: 12 },
};

export default RepositoryItem;