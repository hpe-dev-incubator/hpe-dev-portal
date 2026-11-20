import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

let suggestionsPromise;

const loadSuggestions = () => {
  if (!suggestionsPromise) {
    suggestionsPromise = fetch('/admin/tag-suggestions.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Tag suggestions request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((tags) => {
        if (
          !Array.isArray(tags) ||
          !tags.every((tag) => typeof tag === 'string')
        ) {
          throw new Error('Invalid tag suggestions');
        }
        return tags;
      })
      .catch((error) => {
        suggestionsPromise = undefined;
        throw error;
      });
  }
  return suggestionsPromise;
};

const TagSuggestionControl = ({ value, onChange, forID, classNameWrapper }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    loadSuggestions().then(
      (tags) => {
        if (active) setSuggestions(tags);
      },
      (error) => {
        console.error('Unable to load tag suggestions:', error);
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <input
        id={forID}
        className={classNameWrapper}
        list={`${forID}-suggestions`}
        type="text"
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
      />
      <datalist id={`${forID}-suggestions`}>
        {suggestions.map((tag) => (
          <option key={tag} value={tag} />
        ))}
      </datalist>
      {failed && (
        <p role="alert">
          Tag suggestions could not be loaded. You can still enter tags
          manually.
        </p>
      )}
    </>
  );
};

TagSuggestionControl.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  forID: PropTypes.string.isRequired,
  classNameWrapper: PropTypes.string,
};

TagSuggestionControl.defaultProps = {
  value: '',
  classNameWrapper: '',
};

export default TagSuggestionControl;
