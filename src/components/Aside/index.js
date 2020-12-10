/* eslint-disable max-classes-per-file */
import React from 'react';
import {
  Anchor,
  ThemeContext,
  Image as GrommetImage,
  Markdown as GrommetMarkdown,
  Paragraph,
} from 'grommet';
import { Link as GatsbyLink } from 'gatsby';
import { Download, Github } from 'grommet-icons';
import PropTypes from 'prop-types';

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

class Link extends React.Component {
  render() {
    const { href, theme } = this.props;
    const { color, fontWeight, textDecoration } = theme.anchor;
    const linkStyle = {
      color: color.light,
      fontWeight,
      textDecoration,
    };
    const internal = /^\/(?!\/)/.test(href);
    if (internal) {
      return (
        <GatsbyLink
          to={href}
          {...this.props}
          activeStyle={{ textDecoration: 'underline' }}
          style={linkStyle}
        />
      );
    }
    return <Anchor {...this.props} />;
  }
}

Link.propTypes = {
  href: PropTypes.string,
  theme: PropTypes.object,
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
  img: {
    component: Image,
    props: {
      style: {},
    },
  },
  a: {
    component: (props) => (
      <ThemeContext.Consumer>
        {(theme) => <Link {...props} theme={theme} />}
      </ThemeContext.Consumer>
    ),
  },
};

class Aside extends React.Component {
  render() {
    return <GrommetMarkdown components={components} {...this.props} />;
  }
}

export default Aside;
