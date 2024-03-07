import React, { useCallback, useEffect, useState } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';



const BottomSheet = ({ bottomSheetRef }) => {
  
  const renderBackdrop = useCallback((props) => {
    return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={2} />;
  }, []);

  
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);


  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={3}
      enablePanDownToClose={false}
      backgroundComponent={renderBackdrop}
      snapPoints={['70%', '100%']}
      onChange={handleSheetChanges}
      contentContainerStyle={BottomSheetStyle.contentContainer}
    >
        <Text> Hello Bottom Sheet </Text>
        
       
    </BottomSheet>
  );
};

const BottomSheetStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default GorhomBottomSheet;


        