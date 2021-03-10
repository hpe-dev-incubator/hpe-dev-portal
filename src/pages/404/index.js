import React from 'react';
import { Box, Button, Heading, Image } from 'grommet';
import { navigate } from 'gatsby';
import { Layout, SEO } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

function NotFoundPage() {
  const siteMetadata = useSiteMetadata();
  return (
    <Layout title={siteMetadata.siteTitle}>
      <Box flex align="center" justify="center">
        <SEO title="404: Not Found" />
      </Box>
      <Box flex align="center" justify="center" gap="large">
        <Box direction="row" align="center" justify="center" gap="xlarge">
          <Box flex direction="row">
            <Heading margin="none">Error 4</Heading>
            <Image
              style={{
                maxWidth: 'initial',
                height: '50px',
                width: '50px',
              }}
              src="/img/404 developer.svg"
            />
            <Heading margin="none">4</Heading>
          </Box>
          <Box>
            <Image
              src="/img/hpe-dev-it-monster-worried.svg"
              style={{
                maxWidth: 'initial',
                height: '450px',
                width: '350px',
              }}
            />
          </Box>
        </Box>
        <Box
          pad="medium"
          flex
          align="center"
          justify="center"
          fill="horizontal"
          background={{ color: 'red' }}
        >
          <Heading level="4" margin="none">
            Sorry, we couldn't find what you were looking for.
          </Heading>
        </Box>
        <Box align="center" pad="medium">
          <Button label="Go Back" secondary onClick={() => navigate('/')} />
        </Box>
      </Box>
    </Layout>
  );
}

export default NotFoundPage;
