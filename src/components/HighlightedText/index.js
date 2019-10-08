import React from 'react';
import PropTypes from 'prop-types';
import { Markdown, Text } from 'grommet';

const PlainText = ({ children }) => <Text> {children} </Text>;

PlainText.propTypes = {
  children: PropTypes.node,
};

// TODO: truncate needs to be done after markdown formatting/cleanup somehow
//   to avoid breaking markup. Probably the best thing to do is instead strip
//   markup from the body before putting it in the search index. This would also
//   help avoid accidentally truncating markup and would also avoid matching
//   search terms in the markup itself. (ie. change the 'body' resolver function
//   in the gatsby-plugin-lunr in gatsby-config.js)
function truncate(chunks, maxLength) {
  if (!maxLength || !chunks || !chunks.length) {
    return chunks;
  }

  const results = [];
  let totalLength = 0;
  let text = '';
  let index = 0;

  // special case the first bit to truncate the front half of non-highlighted
  // text before the first highlighted piece but leave a little context
  if (
    !chunks[index].isHighlighted &&
    chunks[index].text.length >= maxLength / 4
  ) {
    text = chunks[index].text.substring(chunks[index].text.length - 20);
    results.push({
      text: `...${text}`,
      isHighlighted: chunks[index].isHighlighted,
    });
    totalLength += text.length;
    index += 1;

    text = chunks[index].text.substring(0, maxLength - totalLength);
    results.push({ text, isHighlighted: chunks[index].isHighlighted });
    totalLength += text.length;
    index += 1;
  }

  // Add in any following bits and other matches if they fit
  for (; index < chunks.length && totalLength < maxLength; index += 1) {
    text =
      chunks[index].text.length + totalLength < maxLength
        ? chunks[index].text
        : chunks[index].text.substring(0, maxLength - totalLength);
    totalLength += text.length;
    if (text !== chunks[index].text) {
      text += '...';
    }
    results.push({ text, isHighlighted: chunks[index].isHighlighted });
  }
  return results;
}

function highlight(content, positions, maxLength) {
  const chunks = [];
  let lastIndex = 0;
  const sortedPositions = positions.slice(); // clone
  sortedPositions.sort((a, b) => a[0] - b[0]); // asscending by start index
  sortedPositions.forEach(([start, length]) => {
    const text = content.substring(lastIndex, start);
    if (text) {
      chunks.push({ text, isHighlighted: false });
    }
    chunks.push({
      text: content.substring(start, start + length),
      isHighlighted: true,
    });
    lastIndex = start + length;
  });
  if (lastIndex < content.length) {
    chunks.push({ text: content.substring(lastIndex), isHighlighted: false });
  }
  return truncate(chunks, maxLength);
}

const chunksToText = chunks =>
  chunks
    .map(({ text, isHighlighted }) => {
      if (isHighlighted) {
        // wrap text in <mark>.
        // The RE helps avoid mangling markup.
        return text.replace(/(\w+)/g, match => `<mark>${match}</mark>`);
      }
      return text;
    })
    .join('');

const HighlightedText = ({
  positions,
  content,
  isMarkdown,
  maxLength,
  ...rest
}) => {
  const chunks = highlight(content, positions, maxLength);

  return isMarkdown ? (
    <Markdown
      components={{
        a: PlainText,
        h1: PlainText,
        h2: PlainText,
        h3: PlainText,
        h4: PlainText,
        h5: PlainText,
        p: PlainText,
        img: PlainText,
        pre: PlainText,
        code: PlainText,
      }}
    >
      {chunksToText(chunks)}
    </Markdown>
  ) : (
    <Text {...rest}>
      {chunks.map(({ text, isHighlighted }, index) => {
        if (isHighlighted) {
          return <mark key={index}>{text}</mark>;
        }
        return <span key={index}>{text}</span>;
      })}
    </Text>
  );
};

HighlightedText.propTypes = {
  content: PropTypes.string,
  positions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  isMarkdown: PropTypes.bool,
  maxLength: PropTypes.number,
};
export default HighlightedText;
