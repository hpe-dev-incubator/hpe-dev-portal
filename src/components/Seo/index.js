/* eslint-disable max-len */
/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

// LinkedIn, X, and Facebook crawlers don't rasterize SVG for og:image/twitter:image.
const UNSUPPORTED_SOCIAL_IMAGE = /\.svg(\?.*)?$/i;

function SEO({ description, lang, meta, title, image }) {
  const siteMetadata = useSiteMetadata();
  const metaDescription = description || siteMetadata.description;
  const imageUrl =
    image && !UNSUPPORTED_SOCIAL_IMAGE.test(image)
      ? new URL(image, siteMetadata.siteUrl).href
      : undefined;
  const imageMeta = imageUrl
    ? [
        { property: 'og:image', content: imageUrl },
        { property: 'og:image:width', content: '200' },
        { property: 'og:image:height', content: '200' },
        { name: 'twitter:image', content: imageUrl },
      ]
    : [];

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${siteMetadata.title}`}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:creator',
          content: siteMetadata.author,
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
      ].concat(imageMeta, meta)}
    ></Helmet>
  );
}

SEO.defaultProps = {
  lang: 'en',
  meta: [],
  description: '',
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
};

export default SEO;
