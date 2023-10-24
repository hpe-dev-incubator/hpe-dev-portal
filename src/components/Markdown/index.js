// /* eslint-disable max-classes-per-file */
// /* eslint-disable max-len */
// import React from 'react';
// import {
//   Anchor,
//   Box,
//   Button,
//   Heading,
//   Image as GrommetImage,
//   Markdown as GrommetMarkdown,
//   Paragraph,
// } from 'grommet';
// import { Download, Github } from 'grommet-icons';
// import PropTypes from 'prop-types';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { deepMerge } from 'grommet/utils';
// import codestyle from './markdownTheme';

// class Image extends React.Component {
//   render() {
//     const { src } = this.props;
//     if (src === 'Github') {
//       return <Github color="brand" />;
//     }
//     if (src === 'Download') {
//       return <Download color="brand" />;
//     }
//     return <GrommetImage {...this.props} />;
//   }
// }

// Image.propTypes = {
//   src: PropTypes.string,
// };

// class Code extends React.Component {
//   render() {
//     const { className, children } = this.props;
//     const language = className ? className.substr('lang-'.length) : '';

//     if (language) {
//       return (
//         <SyntaxHighlighter language={language} style={codestyle}>
//           {children}
//         </SyntaxHighlighter>
//       );
//     }
//     return <code style={codestyle.code} {...this.props} />;
//   }
// }

// Code.propTypes = {
//   className: PropTypes.string,
//   children: PropTypes.node,
// };

// const AnchorButton = ({ children, ...rest }) => (
//   <Button label={children} {...rest} />
// );

// AnchorButton.propTypes = {
//   children: PropTypes.any,
// };

// const components = {
//   p: {
//     component: Paragraph,
//     props: {
//       fill: true,
//       size: 'xlarge',
//     },
//   },
//   hr: {
//     component: Box,
//     props: {
//       border: {
//         top: 'small',
//         color: 'border',
//       },
//     },
//   },
//   img: {
//     component: Image,
//   },
//   a: {
//     component: Anchor,
//     props: {
//       target: '_blank',
//       rel: 'noopener noreferrer',
//     },
//   },
//   code: {
//     component: Code,
//   },
// };

// export const cardComponents = {
//   h1: {
//     component: Heading,
//     props: {
//       margin: { top: 'none', bottom: 'none' },
//       level: 1,
//     },
//   },
//   h2: {
//     component: Heading,
//     props: {
//       margin: { top: 'none', bottom: 'xsmall' },
//       level: 2,
//     },
//   },
//   h3: {
//     component: Heading,
//     props: {
//       margin: { top: 'none', bottom: 'xsmall' },
//       level: 3,
//     },
//   },
//   h4: {
//     component: Heading,
//     props: {
//       margin: { top: 'none', bottom: 'none' },
//       level: 4,
//       style: {
//         fontWeight: 'normal',
//       },
//     },
//   },
//   p: {
//     component: Paragraph,
//     props: {
//       size: 'large',
//       style: {
//         // maxWidth: '100%',
//       },
//     },
//   },
//   img: {
//     component: Image,
//     props: {
//       style: {},
//     },
//   },
//   a: {
//     component: AnchorButton,
//     props: {
//       primary: true,
//     },
//   },
// };

// export const titleComponents = deepMerge(cardComponents, {
//   h1: {
//     props: {
//       size: 'large',
//     },
//   },
// });

// export const Markdown = (props) => (
//   <GrommetMarkdown components={components} {...props} />
// );
// export const CardMarkdown = (props) => (
//   <GrommetMarkdown components={cardComponents} {...props} />
// );
// export const TitleMarkdown = (props) => (
//   <GrommetMarkdown components={titleComponents} {...props} />
// );

// export default Markdown;
