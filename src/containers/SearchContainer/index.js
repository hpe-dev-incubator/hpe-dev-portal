/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import { Box, Heading, Tabs, Tab, Text, TextInput } from 'grommet';
import { Search as SearchIcon } from 'grommet-icons';

import { Link, HighlightedText } from '../../components';
import { useParams } from '../../hooks/use-params';

const capitalize = (text) =>
  text.substring(0, 1).toUpperCase() + text.substring(1);

const categoryLabel = (category) =>
  category === 'homepanels' ? 'Home' : capitalize(category);

const Results = ({ searchTerm, results }) => {
  if (results.length === 0) {
    return (
      <Text>
        No results found for term <code>{searchTerm}</code>
      </Text>
    );
  }

  return results.map(({ doc, titlePos, bodyPos, tagsPos }, index) => (
    <Box pad={{ bottom: 'medium' }} border={{ side: 'bottom' }} key={index}>
      <Text size="small">{categoryLabel(doc.sourceInstanceName)}</Text>
      {doc && doc.sourceInstanceName !== 'platforms' ? (
        <Link to={`/${doc.path}`}>
          <HighlightedText content={doc.title} positions={titlePos} />
        </Link>
      ) : (
        <Link to={doc.path}>
          <HighlightedText content={doc.title} positions={titlePos} />
        </Link>
      )}
      {bodyPos.length > 0 && (
        <HighlightedText
          content={doc.body}
          positions={bodyPos}
          isMarkdown
          maxLength={100}
        />
      )}
      {tagsPos.length > 0 && (
        <Box direction="row" gap="small">
          <Text>Tags:</Text>
          <HighlightedText content={doc.tags} positions={tagsPos} />
        </Box>
      )}
    </Box>
  ));
};

Results.propTypes = {
  searchTerm: PropTypes.string,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      doc: PropTypes.shape({
        title: PropTypes.string,
        body: PropTypes.string,
        tags: PropTypes.string,
        sourceInstanceName: PropTypes.string,
        path: PropTypes.string,
      }),
      titlePos: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
        .isRequired,
      bodyPos: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
        .isRequired,
      tagsPos: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
        .isRequired,
    }),
  ).isRequired,
};

//
// results from index.search(query) are of the form:
//   [ {
//       ref: "123", // related doc is in window.__LUNR__.en.store[ref]
//       score: 42.34,
//       matchData: {
//         metadata: {
//           <term1>: {
//             <doc_field1>: { position: [ [<start>, <length>], ... ] },
//             <doc_field2>: { position: [ [<start>, <length>], ... ] },
//             ...
//           },
//           <term2>: {
//             <doc_field1>: { position: [ [<start>, <length>], ... ] },
//             <doc_field2>: { position: [ [<start>, <length>], ... ] },
//             ...
//           },
//         },
//       },
//     },
//     ...
//   ]
const getPositions = (searchResult, field) => {
  let positions = [];
  if (searchResult.matchData && searchResult.matchData.metadata) {
    const data = searchResult.matchData.metadata;
    Object.keys(data).forEach((searchTerm) => {
      if (data[searchTerm][field] && data[searchTerm][field].position) {
        positions = positions.concat(data[searchTerm][field].position);
      }
    });
  }
  return positions;
};

const getSearchResults = async (query) => {
  let searchResults = [];
  const categoryMap = { 'All Results': true, 'Blog by Author': true };

  if (query && window.__LUNR__) {
    try {
      const queryResults =
        (await window.__LUNR__.__loaded) &&
        window.__LUNR__.en.index.search(query);

      searchResults = queryResults.map((searchResult) => {
        const doc = window.__LUNR__.en.store[searchResult.ref];
        categoryMap[doc.sourceInstanceName] = true;
        return {
          titlePos: getPositions(searchResult, 'title'),
          bodyPos: getPositions(searchResult, 'body'),
          tagsPos: getPositions(searchResult, 'tags'),
          authorPos: getPositions(searchResult, 'author'),
          doc,
        };
      });
    } catch (x) {
      // bad query e.g. title:
    }
  }

  return { searchResults, searchCategories: Object.keys(categoryMap).sort() };
};

const SearchContainer = ({ location }) => {
  const { term } = useParams(location);
  const [value, setValue] = useState(term);
  const [results, setResults] = useState();
  const [categories, setCategories] = useState();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  useEffect(() => {
    if (value) {
      const getResults = async () => {
        const { searchResults, searchCategories } = await getSearchResults(
          value,
        );
        setResults(searchResults);
        setCategories(searchCategories);
      };
      getResults();
    }
  }, [value]);

  const onChange = (event) => {
    const { value: newValue } = event.target;
    setValue(newValue);

    // update the URL
    // const query = newValue ? `?term=${encodeURIComponent(newValue)}` : '';
    // navigate(`/search/${query}`, { replace: true });
    // todo update route term= param
  };

  const filterResults = (category) => {
    if (category === 'Blog by Author') {
      return results.filter((author) => author.authorPos.length > 0);
    }
    return results.filter(
      ({ doc }) =>
        !category ||
        category === 'All Results' ||
        doc.sourceInstanceName === category,
    );
  };

  const onCategoryChange = (index) => setActiveCategoryIndex(index);

  return (
    <Box flex overflow="auto" gap="medium" pad="small">
      <Box flex={false} direction="row-responsive" wrap>
        <Box pad="large">
          <Heading margin="none">Search</Heading>
        </Box>
        <Box pad={{ vertical: 'large' }} gap="medium">
          <Box
            width="large"
            direction="row"
            align="center"
            pad={{ horizontal: 'small', vertical: 'xsmall' }}
            border
            round="small"
          >
            <SearchIcon color="brand" />
            <TextInput
              type="search"
              plain
              placeholder="Search HPE Developer Portal..."
              onChange={onChange}
              value={value}
            />
          </Box>
          {results && categories && (
            <Box>
              <Tabs
                activeIndex={activeCategoryIndex}
                onActive={onCategoryChange}
              >
                {categories.map((category, index) => (
                  <Tab key={index} title={categoryLabel(category)} />
                ))}
              </Tabs>
              <Results
                searchTerm={value}
                results={filterResults(categories[activeCategoryIndex])}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

SearchContainer.propTypes = {
  location: PropTypes.object,
};

export default SearchContainer;
