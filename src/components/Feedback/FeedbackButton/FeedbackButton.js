import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'grommet';
import { ChatOption } from 'grommet-icons';

const defaultButtonStyles = {
  color: '#fff',
  fontWeight: 'bold',
  padding: '10px 15px',
  position: 'fixed',
  borderRadius: '5px 5px 0 0',
  border: 'none',
  bottom: 0,
  width: 'auto',
  zIndex: 10,
  backgroundColor:'#01A982',
};

const FeedBackButton = (props) => {
  const { handleButtonClick, styles, position, handleCustomPosition } = props;
  return (
    <Button
      plain={false}
      icon={<ChatOption />}
      onClick={handleButtonClick}
      style={handleCustomPosition(position, styles)}
      title="Feedback"
      primary
    />
  );
};

FeedBackButton.propTypes = {
  handleCustomPosition: PropTypes.func,
  handleButtonClick: PropTypes.func,
  styles: PropTypes.object,
  position: PropTypes.string,
};

FeedBackButton.defaultProps = {
  position: PropTypes.string,
  styles: defaultButtonStyles,
  handleButtonClick: () => this.handleButtonClick,
};

export default FeedBackButton;
