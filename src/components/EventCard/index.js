import React from 'react';
import PropTypes from 'prop-types';
import { Box, Image, Heading, Card as GrommetCard } from 'grommet';
import { navigate } from 'gatsby';

const monthDay = Intl.DateTimeFormat('default', {
  month: 'long',
  day: 'numeric',
});
const day = Intl.DateTimeFormat('default', {
  day: 'numeric',
});
const year = Intl.DateTimeFormat('default', {
  year: 'numeric',
});

const EventCard = ({ node, ...rest }) => (
  <GrommetCard
    elevation="medium"
    flex="grow"
    {...rest}
    /* eslint-disable */
    onClick={
      node.frontmatter.link && node.frontmatter.link.match(/^\//g)
        ? () => navigate(node.frontmatter.link)
        : node.frontmatter.link
        ? () => window.open(node.frontmatter.link)
        : undefined
    }
  >
    <Box pad="large" gap="xlarge" direction="row-responsive">
      <Box gap="small">
        <Heading margin="none">{node.frontmatter.title}</Heading>
        <Heading margin="none" level="3">
          {`${monthDay.format(new Date(node.frontmatter.dateStart))} 
          `}
          {node.frontmatter.dateEnd &&
            day.format(new Date(node.frontmatter.dateEnd)) >
              day.format(new Date(node.frontmatter.dateStart)) &&
            `- ${day.format(new Date(node.frontmatter.dateEnd))}`}
          {`, ${year.format(new Date(node.frontmatter.dateEnd))}`}
        </Heading>
      </Box>
      <Box>
        {node.frontmatter.image && (
          <Image fit="contain" src={node.frontmatter.image} />
        )}
      </Box>
    </Box>
  </GrommetCard>
);
EventCard.propTypes = {
  node: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      link: PropTypes.string,
      image: PropTypes.string,
      dateStart: PropTypes.string.isRequired,
      dateEnd: PropTypes.string,
    }),
  }).isRequired,
};

export default EventCard;
