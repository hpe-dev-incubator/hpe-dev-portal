import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Heading,
  Image,
  Card as GrommetCard,
  CardBody,
  CardFooter,
  Paragraph,
  Button,
} from 'grommet';
import { navigate } from 'gatsby';

const CommunityCard = ({ node, ...rest }) => (
  <GrommetCard
    elevation="medium"
    gap="medium"
    pad="large"
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
    <CardBody pad={{ bottom: 'small' }} align="center" flex={false}>
      {node.frontmatter.image && (
        <Image
          height="144"
          width="144"
          src={node.frontmatter.image}
          alt="card body logo"
        />
      )}
    </CardBody>
    <Box responsive={false} gap="none" flex={true}>
      <Heading margin="none" level="4">
        {node.frontmatter.title}
      </Heading>
      <Paragraph margin="none">{node.frontmatter.description}</Paragraph>
    </Box>
    <CardFooter pad="none">
      <Box wrap align="start">
        <Button primary label={node.frontmatter.linkname} />
      </Box>
    </CardFooter>
  </GrommetCard>
);

CommunityCard.propTypes = {
  node: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      link: PropTypes.string,
      linkname: PropTypes.string,
      image: PropTypes.string,
      description: PropTypes.string,
    }),
  }).isRequired,
};

export default CommunityCard;
