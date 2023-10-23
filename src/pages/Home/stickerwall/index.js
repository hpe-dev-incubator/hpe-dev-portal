/* eslint-disable max-len */
// /* eslint-disable max-len */
// import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
// import { Box, Image, Stack, ResponsiveContext } from 'grommet';
// import styled from 'styled-components';
// import {
//   Row1,
//   Row2,
//   Row3,
//   Row4,
//   Row5,
//   Row6,
//   Row7,
//   Row8,
//   Row9,
// } from '../../../data/StickerData/stickers';
// import GrommetThemeWrapper from '../../../components/hackshack/Grommet/GrommetThemeWrapper';
// import { Layout, SubPageHeader } from '../../../components/hackshack';
// import { SEO } from '../../../components';

// const StyledSmallAnchor = styled.a`
//   max-width: 180px;
//   min-width: 180px;
//   max-height: 180px;
//   min-height: 180px;

//   @media (max-width: 1375px) {
//     max-width: 120px;
//     min-width: 120px;
//     max-height: 100px;
//   }

//   @media (max-width: 900px) {
//     max-width: 100px;
//     min-width: 100px;
//     max-height: 100px;
//     min-height: 100px;
//     margin-bottom: 6px;
//   }

//   @media (max-width: 520px) {
//     max-width: 80px;
//     min-width: 80px;
//     max-height: 80px;
//     min-height: 80px;
//     margin-bottom: 6px;
//   }
// `;

// export const StyledLargeAnchor = styled.a`
//   max-width: 360px;
//   min-width: 360px;
//   max-height: 180px;
//   min-height: 180px;

//   @media (max-width: 1375px) {
//     max-width: 240px;
//     min-width: 240px;
//     max-height: 100px;
//     min-height: 120px;
//   }

//   @media (max-width: 900px) {
//     max-width: 200px;
//     min-width: 200px;
//     max-height: 100px;
//     min-height: 100px;
//     margin-bottom: 6px;
//   }

//   @media (max-width: 520px) {
//     max-width: 160px;
//     min-width: 160px;
//     max-height: 80px;
//     min-height: 80px;
//     margin-bottom: 6px;
//   }
// `;

// // Image wrapper
// const ImageWrapper = ({ children, ...props }) => (
//   <Box
//     pad={{ horizontal: 'small', bottom: 'small', top: 'medium' }}
//     margin={{ right: 'medium', bottom: 'medium' }}
//     border
//     style={{ borderRadius: '12px' }}
//     {...props}
//   >
//     {children}
//   </Box>
// );

// ImageWrapper.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// // Create box for each sticker
// const BoxImage = ({
//   icon,
//   stickers,
//   backgroundColor,
//   backgroundImage,
//   img,
//   size,
//   height,
//   ...props
// }) => {
//   return (
//     <Box>
//       {size && (
//         <StyledLargeAnchor href={stickers} download>
//           <ImageWrapper
//             background={backgroundColor || backgroundImage}
//             height={height}
//             id={stickers}
//             key={stickers}
//             {...props}
//           >
//             {img && (
//               <Box fill>
//                 <Image alt="stickers" fit="contain" src={img} />
//                 <Stack alignSelf="end">{icon}</Stack>
//               </Box>
//             )}
//             {!img && (
//               <Box justify="end" fill="vertical" alignSelf="end">
//                 {icon}
//               </Box>
//             )}
//           </ImageWrapper>
//         </StyledLargeAnchor>
//       )}
//       {!size && (
//         <StyledSmallAnchor href={stickers} download>
//           <ImageWrapper
//             background={backgroundColor || backgroundImage}
//             height={height}
//             id={stickers}
//             key={stickers}
//             {...props}
//           >
//             {img && (
//               <Box fill>
//                 <Image alt="stickers" fit="contain" src={img} />
//                 <Stack alignSelf="end">{icon}</Stack>
//               </Box>
//             )}
//             {!img && (
//               <Box justify="end" fill="vertical" alignSelf="end">
//                 {icon}
//               </Box>
//             )}
//           </ImageWrapper>
//         </StyledSmallAnchor>
//       )}
//     </Box>
//   );
// };

// BoxImage.propTypes = {
//   size: PropTypes.string,
//   icon: PropTypes.object,
//   backgroundColor: PropTypes.string,
//   stickers: PropTypes.string,
//   img: PropTypes.string,
//   backgroundImage: PropTypes.string,
//   height: PropTypes.string,
// };

// const StickerRow = (row, size) => {
//   return row.map((stickers, index) => {
//     return (
//       <BoxImage
//         key={index}
//         height={size !== 'small' ? '150px' : '80px'}
//         img={stickers.img}
//         background={stickers.backgroundColor || stickers.backgroundImage}
//         icon={stickers.icon}
//         size={stickers.size}
//         stickers={stickers.img || stickers.download}
//       />
//     );
//   });
// };

// const StickerWall = () => {
//   const mobileRow1 = [Row8[2], Row1[3]];
//   const mobileRow2 = [Row2[2], Row9[0]];
//   const mobileRow3 = [Row4[2], Row5[2]];
//   const mobileRow4 = [Row7[0], Row7[1], Row8[1]];
//   const size = useContext(ResponsiveContext);
//   return (
//     <GrommetThemeWrapper>
//       <Layout background="/img/hackshack/BackgroundImages/stickers-background.jpg">
//         <SEO title="Hack Shack Sticker Wall" />
//         <SubPageHeader title="STICKERS AND ART">
//           <Box
//             background={{ color: '#263040' }}
//             pad="large"
//             round="small"
//             alignSelf={size === 'small' ? 'center' : undefined}
//             width={size !== 'small' ? { min: '680px' } : { min: '280px' }}
//           >
//             {size !== 'small' && (
//               <Box>
//                 <Box direction="row">{StickerRow(Row1, size)}</Box>
//                 <Box direction="row">{StickerRow(Row2, size)}</Box>
//                 <Box direction="row">{StickerRow(Row3, size)}</Box>
//                 <Box direction="row">{StickerRow(Row4, size)}</Box>
//                 <Box direction="row">{StickerRow(Row5, size)}</Box>
//                 <Box direction="row">{StickerRow(Row6, size)}</Box>
//                 <Box direction="row">{StickerRow(Row7, size)}</Box>
//               </Box>
//             )}
//             {size === 'small' && (
//               <Box align="center">
//                 <Box direction="row">{StickerRow(Row1.slice(0, 3), size)}</Box>
//                 <Box direction="row">{StickerRow(Row2.slice(0, 2), size)}</Box>
//                 <Box direction="row">{StickerRow(Row3.slice(0, 2), size)}</Box>
//                 <Box direction="row">{StickerRow(Row4.slice(0, 2), size)}</Box>
//                 <Box direction="row">{StickerRow(Row5.slice(0, 2), size)}</Box>
//                 <Box direction="row">{StickerRow(Row6.slice(0, 2), size)}</Box>
//                 <Box direction="row">{StickerRow(mobileRow1, size)}</Box>
//                 <Box direction="row">{StickerRow(mobileRow2, size)}</Box>
//                 <Box direction="row">{StickerRow(mobileRow3, size)}</Box>
//                 <Box direction="row">{StickerRow(mobileRow4, size)}</Box>
//                 <Box direction="row" alignSelf="start">
//                   {StickerRow(Row8.slice(0, 1), size)}
//                 </Box>
//               </Box>
//             )}
//           </Box>
//         </SubPageHeader>
//       </Layout>
//     </GrommetThemeWrapper>
//   );
// };

// export default StickerWall;
