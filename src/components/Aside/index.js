import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import { Markdown } from '../index';

const Link = ({ to, activeStyle, name }) => {
  const internal = /^\/(?!\/)/.test(to);
  if (internal) {
    return (
      <GatsbyLink to={to} activeStyle={activeStyle}>
        <Markdown>{name}</Markdown>
      </GatsbyLink>
    );
  }
  return <a href={to}>{name}</a>;
};

Link.propTypes = {
  to: PropTypes.string,
  activeStyle: PropTypes.object,
  name: PropTypes.string,
};

class Aside extends React.Component {
  render() {
    const asideData = [];
    const data = this.props.children.split('\n').filter(el => el !== '');
    const findLinks = /\(([^)]+)\)/;
    const findNames = /\[(.*?)\]/;
    data.map(el => {
      const link = findLinks.exec(el);
      const name = findNames.exec(el);
      if (link && name) {
        asideData.push({ name: name[1], link: link[1] });
      } else {
        asideData.push(el);
      }
      return asideData;
    });
    return asideData.map((aside, i) => {
      if (typeof aside === 'object') {
        return (
          <Link
            to={aside.link}
            activeStyle={{ color: 'red' }}
            key={i}
            name={aside.name}
          />
        );
      }
      return <Markdown key={i}>{aside}</Markdown>;
    });
  }
}

export default Aside;

Aside.propTypes = {
  children: PropTypes.node,
};
