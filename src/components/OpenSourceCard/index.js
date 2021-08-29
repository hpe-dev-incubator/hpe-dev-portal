import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Text,
  Card as GrommetCard,
  Heading,
  Image,
  ResponsiveContext,
} from 'grommet';
import { navigate } from 'gatsby';

const OpenSourceCard = ({ image, title, link, description, category }) => {
  const size = useContext(ResponsiveContext);
  return (
    <GrommetCard
      elevation="medium"
      pad="medium"
      height={size === 'large' ? '200px' : '250px'}
      onClick={
        link
          ? (e) => {
              navigate(link);
              localStorage.setItem(
                'platformPosition',
                JSON.stringify(e.nativeEvent.pageY - e.nativeEvent.clientY),
              );
            }
          : undefined
      }
    >
      <Box alignSelf="end" margin={{ top: '-10px', right: '-10px' }}>
        <Text color="text-weak">{category}</Text>
      </Box>
      <Box direction="row" gap="large" align="center">
        <Box basis="1/3">
          {image && <Image fit="contain" src={image} alt="platform logo" />}
        </Box>
        <Box basis="2/3">
          <Heading margin="none" level="3" size="small">
            {title}
          </Heading>
          <Text>{description}</Text>
        </Box>
      </Box>
    </GrommetCard>
  );
};

OpenSourceCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  link: PropTypes.string,
  category: PropTypes.string,
};

export default OpenSourceCard;
