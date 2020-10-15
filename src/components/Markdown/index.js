/* eslint-disable max-classes-per-file */
/* eslint-disable max-len */
import React from 'react';
import {
  Anchor,
  Box,
  Image as GrommetImage,
  Markdown as GrommetMarkdown,
  Paragraph,
} from 'grommet';
import { Download, Github } from 'grommet-icons';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark as codestyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

class Image extends React.Component {
  render() {
    const { src } = this.props;
    if (src === 'Github') {
      return <Github color="brand" />;
    }
    if (src === 'Download') {
      return <Download color="brand" />;
    }
    return <GrommetImage {...this.props} />;
  }
}

Image.propTypes = {
  src: PropTypes.string,
};

class Code extends React.Component {
  render() {
    const { className, children } = this.props;
    const language = className ? className.substr('lang-'.length) : '';

    if (language) {
      return (
        <SyntaxHighlighter language={language} style={codestyle}>
          {children}
        </SyntaxHighlighter>
      );
    }
    return <code {...this.props} />;
  }
}

Code.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const components = {
  p: {
    component: Paragraph,
    props: {
      size: 'xlarge',
      style: {
        maxWidth: '100%',
      },
    },
  },
  hr: {
    component: Box,
    props: {
      border: {
        top: 'small',
        color: 'light-3',
      },
    },
  },
  img: {
    component: Image,
    props: {
      style: {},
    },
  },
  a: {
    component: Anchor,
  },
  code: {
    component: Code,
  },
};

class Markdown extends React.Component {
  render() {
    return <GrommetMarkdown components={components} {...this.props} />;
  }
}

export default Markdown;
