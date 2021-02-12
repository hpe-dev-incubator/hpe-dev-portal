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
    onClick={
      node.frontmatter.link ? () => navigate(node.frontmatter.link) : undefined
    }
  >
    <CardBody pad="none" align="start">
      {node.frontmatter.image && (
        <Image height="144" width="144" src={node.frontmatter.image} />
      )}
    </CardBody>
    <Box responsive={false}>
      <Heading margin="none" level="4">
        {node.frontmatter.title}
      </Heading>
      <Paragraph margin="none">{node.frontmatter.description}</Paragraph>
    </Box>
    <CardFooter pad="none">
      <Box wrap align="start">
        <Button
          primary
          label={node.frontmatter.linkname}
          href={node.frontmatter.link}
          target="_blank"
        />
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
