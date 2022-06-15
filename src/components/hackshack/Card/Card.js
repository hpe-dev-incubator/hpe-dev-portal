import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Heading, Text, Image as GrommetImage } from 'grommet';
import { Link } from 'gatsby';
import { CardWrapper } from './styles';

const Logo = ({ background, children, size, ...rest }) => {
  return (
    <Box
      height={size === 'small' ? '124px' : '192px'}
      alignSelf="start"
      {...rest}
    >
      {children}
    </Box>
  );
};

Logo.defaultProps = {
  background: 'background-back',
};

Logo.propTypes = {
  background: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.string,
};

const Image = ({ background, children, ...rest }) => {
  return (
    <Box background={background} round="xsmall" {...rest} height="300px">
      {children}
    </Box>
  );
};

Image.defaultProps = {
  background: 'background-back',
};

Image.propTypes = {
  children: PropTypes.node,
  background: PropTypes.string,
};

const Card = ({
  alt,
  background,
  desc,
  image,
  title,
  label,
  link,
  logo,
  margin,
  path,
  size,
  fit,
  imageBackground,
}) => {
  return (
    <CardWrapper
      margin={margin}
      pad={image ? 'none' : 'large'}
      background={background}
      round="medium"
      overflow="hidden"
    >
      {image && (
        <Image background={imageBackground}>
          <GrommetImage src={image} alt={alt} fit={fit} />
        </Image>
      )}
      {logo && (
        <Logo>
          <GrommetImage src={logo} alt={alt} fit="contain" />
        </Logo>
      )}
      <Box
        pad={
          image ? { top: 'none', bottom: 'large', horizontal: 'large' } : 'none'
        }
      >
        <Box>
          <Heading
            margin={{ top: 'medium', bottom: 'small' }}
            level={size === 'small' ? 4 : 2}
            color="text-strong"
          >
            {title}
          </Heading>
          <Text
            color="text-strong"
            size={size === 'small' ? 'large' : 'xlarge'}
          >
            {desc}
          </Text>
        </Box>
        <Box pad={{ top: 'medium' }} direction="row">
          {path ? (
            <Link to={path}>
              <Button
                label={
                  <Box pad="xsmall">
                    <Text color="text-strong">{label}</Text>
                  </Box>
                }
                secondary
              />
            </Link>
          ) : (
            <Button
              label={
                <Box pad="xsmall">
                  <Text color="text-strong">{label}</Text>
                </Box>
              }
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              secondary
            />
          )}
        </Box>
      </Box>
    </CardWrapper>
  );
};

Card.propTypes = {
  alt: PropTypes.string,
  background: PropTypes.string,
  desc: PropTypes.string,
  image: PropTypes.string,
  label: PropTypes.string,
  link: PropTypes.string,
  logo: PropTypes.string,
  margin: PropTypes.object,
  path: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.string,
  fit: PropTypes.string,
  imageBackground: PropTypes.string,
};

export default Card;
