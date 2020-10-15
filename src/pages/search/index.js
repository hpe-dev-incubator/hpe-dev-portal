/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Location } from '@reach/router';
import { SearchContainer } from '../../containers';
import { Layout, SEO } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

const Search = () => {
  const { siteTitle } = useSiteMetadata();

  return (
    <Location>
      {({ location }) => (
        <Layout title={siteTitle}>
          <SEO title="Search" />
          <SearchContainer location={location} />
        </Layout>
      )}
    </Location>
  );
};

export default Search;
