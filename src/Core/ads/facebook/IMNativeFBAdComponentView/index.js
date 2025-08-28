// import React, { useState } from 'react';
// import TruncateText from 'react-native-view-more-text';
// import { Image, View, Text } from 'react-native';
// import PropTypes from 'prop-types';
// import styles from './styles';

// function IMNativeFBAdComponentView(props) {
//   const { nativeAd } = props;
//   return (
//     <View style={styles.container}>
//       <AdTriggerView style={styles.adTriggerView}>
//         <View style={styles.headerContainer}>
//           <View style={styles.adIconViewContainer}>
//             <AdIconView style={styles.adIconView} />
//           </View>
//           <Text>{nativeAd.advertiserName}</Text>
//         </View>

//         {nativeAd.bodyText && (
//           <View style={styles.textContainer}>
//             <TruncateText numberOfLines={2} textStyle={styles.body}>
//               <Text>{nativeAd.bodyText}</Text>
//             </TruncateText>
//           </View>
//         )}

//         <AdMediaView style={styles.mediaView} />
//       </AdTriggerView>
//     </View>
//   );
// }

// export default FacebookAds.withNativeAd(IMNativeFBAdComponentView);
