import React from 'react';
import { View, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ListHeader = ({ order, setOrder, searchKeyword, setSearchKeyword }) => {
  return (
    <View>

      <TextInput
        placeholder="Search repositories..."
        value={searchKeyword}
        onChangeText={setSearchKeyword}
        style={{
          padding: 10,
          backgroundColor: 'white',
          marginBottom: 10,
          borderRadius: 5
        }}
      />

      <Picker
        selectedValue={order}
        onValueChange={(value) => setOrder(value)}
      >
        <Picker.Item label="Latest repositories" value="latest" />
        <Picker.Item label="Highest rated repositories" value="highest" />
        <Picker.Item label="Lowest rated repositories" value="lowest" />
      </Picker>

    </View>
  );
};

export default ListHeader;