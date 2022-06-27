import React from 'react';
import PropTypes from 'prop-types';
import { Box, Image, Heading, Card as GrommetCard, Text } from 'grommet';
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
    <Box pad="large" direction="row-responsive">
      <Box gap="small" style={{ width: '60%' }}>
        <Heading margin="none" level="3">
          {node.frontmatter.title}
        </Heading>
        <Text>
          {`${monthDay.format(new Date(node.frontmatter.dateStart))} 
          `}
          {node.frontmatter.dateEnd &&
            day.format(new Date(node.frontmatter.dateEnd)) >
              day.format(new Date(node.frontmatter.dateStart)) &&
            `- ${day.format(new Date(node.frontmatter.dateEnd))}`}
          {`, ${year.format(new Date(node.frontmatter.dateEnd))}`}
        </Text>
      </Box>
      <Box style={{ width: '10%' }}></Box>
      <Box style={{ width: '30%' }}>
        {node.frontmatter.image && (
          <Image fit="contain" src={node.frontmatter.image} alt="event logo" />
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
