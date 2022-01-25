import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card as GrommetCard,
  CardBody,
  CardHeader,
  Grid,
  Image,
  Markdown,
  ResponsiveContext,
  Text,
} from 'grommet';
import { navigate } from 'gatsby';
import { cardComponents } from '..';

// Remove padding or margin from first markdown element.
// This allows the heading and content to have the same gap.
const MarkdownLayout = styled(Markdown)`
  & > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }
`;

// Remove padding or margin from first markdown element.
// This allows the heading and content to have the same gap.
const MarkdownCenteredLayout = styled(Markdown)`
  & > *:first-child {
    margin-top: 0;
    padding-top: 0;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const widths = {
  small: '396px',
  medium: '840px',
  large: '1080px',
};

const gridProps = {
  // image above text
  small: {
    gap: 'medium',
    columns: ['auto'],
    rows: ['auto', 'flex'],
    areas: [
      { name: 'image', start: [0, 0], end: [0, 0] },
      { name: 'content', start: [0, 1], end: [0, 1] },
    ],
  },
  // image to the left of text
  medium: {
    gap: 'large',
    columns: [
      ['xsmall', 'flex'],
      ['xsmall', 'flex'],
    ],
    rows: ['auto'],
    areas: [
      { name: 'image', start: [0, 0], end: [0, 0] },
      { name: 'content', start: [1, 0], end: [1, 0] },
    ],
    align: 'start',
    justifyContent: 'start',
  },
  // image to the right of text
  large: {
    gap: 'large',
    columns: ['flex', 'flex'],
    rows: ['auto'],
    areas: [
      { name: 'image', start: [1, 0], end: [1, 0] },
      { name: 'content', start: [0, 0], end: [0, 0] },
    ],
    justifyContent: 'between',
  },
};

// can't use the full amount due to the margins, so we approximate
const bases = {
  small: '1/4',
  medium: '1/3',
  large: '2/3',
};

export const Card = ({
  category,
  content,
  width = 'medium',
  link,
  image,
  title,
  ...rest
}) => {
  const [hover, setHover] = useState(false);
  const cardRef = useRef(null);
  const isHackShackCard = title === 'HPE DEV Hack Shack';

  const checkHover = (e) => {
    if (cardRef.current) {
      const mouseOver = cardRef.current.contains(e.target);

      if (!hover && mouseOver) {
        setHover(true);
      }

      if (hover && !mouseOver) {
        setHover(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', checkHover, true);

    return () => {
      window.removeEventListener('mousemove', checkHover, true);
    };
  });

  return (
    <ResponsiveContext.Consumer>
      {(size) => (
        <GrommetCard
          background={isHackShackCard && hover ? '#263040' : null}
          elevation="medium"
          margin="medium"
          flex="grow"
          basis={size === 'small' ? 'auto' : bases[width]}
          onMouseOver={() => isHackShackCard && setHover(true)}
          onMouseOut={() => isHackShackCard && setHover(false)}
          {...rest}
          /* eslint-disable */
          onClick={
            link && link.match(/^\//g)
              ? () => navigate(link)
              : link
              ? () => window.open(link)
              : undefined
          }
        >
          <CardHeader
            justify="end"
            pad={{ vertical: 'small', horizontal: 'medium' }}
          >
            <Text color="text-weak">{category}</Text>
          </CardHeader>
          <CardBody pad="none">
            <Grid
              fill="horizontal"
              pad={{ horizontal: 'large', top: 'medium', bottom: 'large' }}
              {...(gridProps[size === 'small' ? size : width] ||
                gridProps.medium)}
            >
              {image && category === 'Featured Blog' ? (
                <Avatar size="96px" src={image} alt="author logo" />
              ) : (
                <Image
                  gridArea="image"
                  src={image}
                  fit="contain"
                  alignSelf="start"
                  alt="card logo"
                />
              )}
              {content && (
                <Box gridArea="content">
                  <MarkdownLayout components={cardComponents}>
                    {content}
                  </MarkdownLayout>
                </Box>
              )}
            </Grid>
          </CardBody>
        </GrommetCard>
      )}
    </ResponsiveContext.Consumer>
  );
};

Card.propTypes = {
  content: PropTypes.string,
  width: PropTypes.string,
  category: PropTypes.string,
  link: PropTypes.string,
  image: PropTypes.string,
};

export const Card2 = ({
  category,
  content,
  align,
  gap,
  pad,
  width = 'medium',
  link,
  reverse,
  image,
}) => (
  <GrommetCard
    elevation="medium"
    margin="small"
    width={{ min: widths[width], max: widths[width] }}
    flex="grow"
    onClick={link ? () => navigate(link) : undefined}
  >
    <CardHeader justify="end" pad={{ vertical: 'small', horizontal: 'medium' }}>
      <Text color="text-weak">{category}</Text>
    </CardHeader>
    <Box
      fill="vertical"
      justify="start"
      align="center"
      gap={gap || 'large'}
      pad={{ horizontal: 'large', top: 'medium', bottom: 'large', ...pad }}
      direction="row-responsive"
    >
      {image && !reverse && (
        <Box align="center" fill="horizontal">
          {image && <Image src={image} alt="card logo" />}
        </Box>
      )}
      {content && align === 'center' && (
        <MarkdownCenteredLayout components={cardComponents}>
          {content}
        </MarkdownCenteredLayout>
      )}
      {content && align !== 'center' && (
        <MarkdownLayout components={cardComponents}>{content}</MarkdownLayout>
      )}
      {image && reverse && (
        <Box align="center" fill="horizontal">
          {image && <Image src={image} alt="card logo" />}
        </Box>
      )}
    </Box>
  </GrommetCard>
);
Card2.propTypes = Card.propTypes;
