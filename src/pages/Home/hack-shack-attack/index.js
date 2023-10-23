/* eslint-disable max-len */
// /* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
// /* eslint-disable react/no-this-in-sfc */
// import React, { useEffect, useState } from 'react';
// import { IonPhaser } from '@ion-phaser/react';
// import styled from 'styled-components';
// import {
//   Grommet,
//   Box,
//   Button,
//   Layer,
//   Image,
//   Text,
//   Anchor,
//   CheckBox,
// } from 'grommet';
// import { Link } from 'gatsby';
// import { Previous } from 'grommet-icons';
// import { hpe } from 'grommet-theme-hpe';
// import {
//   bootSceneMethods,
//   preloaderSceneMethods,
//   titleSceneMethods,
//   gameSceneMethods,
//   howToPlayMethods,
//   leaderboardSceneMethods,
//   gameOverSceneMethods,
//   highScoreSceneMethods,
//   backToTitleSceneMethods,
//   errorSceneMethods,
//   profanityErrorSceneMethods,
//   thankYouSceneMethods,
//   splashSceneMethods,
// } from '../../../hack-shack-attack/scenes';
// import { SEO } from '../../../components';

// const GameContainer = styled(Box)`
//   position: relative;
//   min-height: 1100px;
// `;

// const BackgroundWrapper = styled(Box)`
//   position: absolute;
//   z-index: 10;
// `;

// // eslint-disable-next-line react/prop-types
// const TermsLayer = ({ setAccepted }) => {
//   // remove terms and conditions checkbox as no prize offered
//   const [checked, setChecked] = useState(false);
//   const [error, setError] = useState(false);

//   const handleSubmit = () => {
//     // remove terms and conditions checkbox as no prize offered
//     if (checked) {
//       setAccepted(true);
//       setError(false);
//       localStorage.setItem('formData', JSON.stringify({ accepted: true }));
//     } else {
//       setError(true);
//     }
//   };

//   return (
//     <Layer>
//       <Box alignSelf="end" pad="small">
//         <Link to="/hackshack/arcade">
//           <Button icon={<Previous />} label="Back to Arcade" />
//         </Link>
//       </Box>
//       <Box direction="column" pad="large" gap="medium" align="start">
//         <Image
//           width="100%"
//           fit="cover"
//           alt="attack marquee"
//           src="/img/assets/attack-marquee.png"
//         />
//         <Text style={{ fontFamily: 'Kemco' }} size="small" color="#ffffff">
//           HPE may invite you to enter your initials and name if you are a high
//           scoring winner. If provided, your initials will be displayed on the
//           leader board. Your name will not be displayed and will be used for
//           identification confirmation purposes only. All use will be in
//           accordance with{' '}
//           <Anchor
//             href="https://www.hpe.com/us/en/legal/privacy.html"
//             target="_blank"
//             rel="noreferrer noopener"
//           >
//             <Text style={{ fontFamily: 'Kemco' }} size="small" color="#ffffff">
//               hpe's privacy policy
//             </Text>
//           </Anchor>
//           .
//         </Text>
//         {/* <Text color="#ffffff">
//           Read the full{' '}
//           <Anchor
//             href=" https://hackshack.hpedev.io/competition"
//             target="_blank"
//             rel="noreferrer noopener"
//           >
//             <Text color="#ffffff" weight={900}>
//               Terms and Conditions
//             </Text>
//           </Anchor>{' '}
//           that apply.
//         </Text> */}
//         <Box direction="row" align="center">
//           <CheckBox
//             onChange={() => {
//               setChecked(!checked);
//               setError(false);
//             }}
//           />
//           <Text color="#ffffff" style={{ fontFamily: 'Kemco' }}>
//             I agree.
//           </Text>
//         </Box>
//         {error && <Text>You must agree to play.</Text>}
//         <Button onClick={() => handleSubmit()}>
//           <Box background="#00567acc">
//             <Text
//               color="#ffffff"
//               style={{ fontFamily: 'Kemco' }}
//               size="xxlarge"
//               margin="medium"
//             >
//               Start Game
//             </Text>
//           </Box>
//         </Button>
//       </Box>
//     </Layer>
//   );
// };

// const HackShackAttack = () => {
//   const [gameConfig, setGameConfig] = useState();
//   const [accepted, setAccepted] = useState(false);
//   const windowGlobal = typeof window !== 'undefined' && window;
//   const { Phaser } = windowGlobal;
//   let BootScene;
//   let PreloaderScene;
//   let TitleScene;
//   let GameScene;
//   let HowToPlayScene;
//   let LeaderBoardScene;
//   let GameOverScene;
//   let HighScoreScene;
//   let BackToTitleScene;
//   let ErrorScene;
//   let ProfanityErrorScene;
//   let ThankYouScene;
//   let BootSceneStart;
//   let SplashScene;

//   if (Phaser) {
//     BootScene = new Phaser.Scene('Boot');
//     bootSceneMethods(BootScene);

//     PreloaderScene = new Phaser.Scene('Preloader');
//     preloaderSceneMethods(PreloaderScene);

//     TitleScene = new Phaser.Scene('Title');
//     titleSceneMethods(TitleScene, Phaser);

//     GameScene = new Phaser.Scene('Game');
//     gameSceneMethods(GameScene, Phaser);

//     HowToPlayScene = new Phaser.Scene('HowToPlay');
//     howToPlayMethods(HowToPlayScene);

//     LeaderBoardScene = new Phaser.Scene('Leaderboard');
//     leaderboardSceneMethods(LeaderBoardScene, Phaser);

//     GameOverScene = new Phaser.Scene('GameOver');
//     gameOverSceneMethods(GameOverScene);

//     HighScoreScene = new Phaser.Scene('HighScore');
//     highScoreSceneMethods(HighScoreScene, Phaser);

//     BackToTitleScene = new Phaser.Scene('BackToTitle');
//     backToTitleSceneMethods(BackToTitleScene);

//     ErrorScene = new Phaser.Scene('Error');
//     errorSceneMethods(ErrorScene);

//     ProfanityErrorScene = new Phaser.Scene('ProfanityError');
//     profanityErrorSceneMethods(ProfanityErrorScene);

//     ThankYouScene = new Phaser.Scene('ThankYou');
//     thankYouSceneMethods(ThankYouScene);

//     SplashScene = new Phaser.Scene('Splash');
//     splashSceneMethods(SplashScene);

//     BootSceneStart = new Phaser.Scene('BootStart');
//     BootSceneStart.create = function create() {
//       this.scene.start('Boot');
//     };
//   }

//   useEffect(() => {
//     setGameConfig({
//       initialize: true,
//       game: {
//         width: 1366,
//         height: 768,
//         parent: 'phaser-game',
//         type: Phaser.AUTO,
//         input: {
//           gamepad: true,
//           queue: true,
//         },
//         scale: {
//           autoCenter: Phaser.Scale.CENTER_BOTH,
//           mode: Phaser.Scale.ENVELOP,
//         },
//         pixelArt: true,
//         physics: {
//           default: 'arcade',
//           arcade: {
//             debug: false,
//             gravity: { y: 0 },
//           },
//         },
//         scene: [
//           BootScene,
//           PreloaderScene,
//           TitleScene,
//           GameScene,
//           HowToPlayScene,
//           LeaderBoardScene,
//           GameOverScene,
//           HighScoreScene,
//           BackToTitleScene,
//           ErrorScene,
//           ProfanityErrorScene,
//           ThankYouScene,
//           SplashScene,
//           BootSceneStart,
//         ],
//       },
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const game = gameConfig && gameConfig.game;
//   const initialize = gameConfig && gameConfig.initialize;

//   useEffect(() => {
//     const data = localStorage.getItem('formData');
//     const parsedData = JSON.parse(data);
//     if (parsedData) {
//       if (parsedData.accepted) {
//         setAccepted(true);
//       }
//     }
//   }, []);

//   return (
//     <Grommet
//       theme={hpe}
//       themeMode="dark"
//       background="#151d29"
//       style={{ overflowX: 'hidden' }}
//     >
//       <SEO title="Hack Shack Arcade" />
//       <GameContainer fill>
//         <BackgroundWrapper
//           fill
//           background={{
//             image:
//               // eslint-disable-next-line max-len
//               'url(/img/hackshack/BackgroundImages/hackshack-attack-background.png)',
//             size: 'cover',
//             position: 'top center',
//           }}
//         >
//           <Box margin="48px" alignSelf="start">
//             <Link to="/hackshack/arcade">
//               <Button icon={<Previous />} label="Back to Arcade" />
//             </Link>
//           </Box>
//         </BackgroundWrapper>
//         {accepted && (
//           <Box fill id="phaser-game">
//             <IonPhaser game={game} initialize={initialize} />
//           </Box>
//         )}
//         {!accepted && <TermsLayer setAccepted={setAccepted} />}
//       </GameContainer>
//     </Grommet>
//   );
// };

// export default HackShackAttack;
