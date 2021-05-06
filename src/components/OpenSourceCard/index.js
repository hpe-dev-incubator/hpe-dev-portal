import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Card as GrommetCard, CardHeader, Image } from 'grommet';
import { navigate } from 'gatsby';
import { Star } from 'grommet-icons';

const dateFormat = Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const OpenSourceCard = ({
  image,
  title,
  link,
  description,
  category,
  stars,
  date,
  monthly,
  newsletter,
  index,
}) => (
  <GrommetCard
    pad="large"
    elevation="medium"
    onClick={
      link
        ? (e) => {
            navigate(link);
            localStorage.setItem(
              'newsletterData',
              JSON.stringify({
                index,
                position: e.nativeEvent.pageY - e.nativeEvent.clientY,
              }),
            );
          }
        : undefined
    }
  >
    <CardHeader justify="between" pad={{ top: 'none', bottom: 'medium' }}>
      {date && (
        <Text weight="bold">{`${dateFormat.format(new Date(date))}`}</Text>
      )}
      {
        <Text color="text-weak">
          {newsletter ? `Monthly #${monthly}` : category}
        </Text>
      }
    </CardHeader>
    <Box gap="small" direction="row-responsive" wrap>
      <Box alignSelf="center">
        {image && (
          <Image
            width="216px"
            height="216px"
            fit="contain"
            src={image}
            alt="opensource logo"
          />
        )}
        {stars && (
          <Box direction="row" gap="xsmall" pad={{ top: 'xsmall' }}>
            <Star color="yellow" />
            <Text size="large" weight="bold">
              123
            </Text>
          </Box>
        )}
      </Box>
      <Box alignSelf="center">
        <Text size="large" weight="bold">
          {title}
        </Text>
        <Text margin="none" size="large">
          {!newsletter ? description.substring(0, 200) : description}
        </Text>
      </Box>
    </Box>
  </GrommetCard>
);

OpenSourceCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  link: PropTypes.string,
  category: PropTypes.string,
  date: PropTypes.string,
  stars: PropTypes.bool,
  monthly: PropTypes.number,
  newsletter: PropTypes.bool,
  index: PropTypes.number,
};

export default OpenSourceCard;
