import React, { useRef, useState } from 'react';
import { Avatar, Box, Button, Layer, Text } from 'grommet';
import { LinkNext } from 'grommet-icons';
import PropTypes from 'prop-types';

const { GATSBY_HPE_SIGNOUT } = process.env;
// const { GATSBY_REDIRECT_URI } = process.env;

function getInitials(name) {
  if (!name) {
    return '';
  }
  const chunks = name.toString().split(' ').slice(0, 2);
  return chunks.map((c) => c[0].toUpperCase());
}

const width = 250;

export function UserMenu({ userInfo }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const { name, email } = userInfo || {};
  const onMenuClick = () => {
    setOpen((o) => !o);
  };

  const handleSignOut = () => {
    console.log('log out');
    // fetch(`${GATSBY_HPE_SIGNOUT}?redirectUri=${GATSBY_REDIRECT_URI}`)
    fetch(`${GATSBY_HPE_SIGNOUT}&tstamp=${new Date().getTime()}`)
      // fetch(
      //   'https://aquila-user-api.common.cloud.hpe.com/authn/v1/session/end-session',
      // )
      // .then((response) => {
      //   console.log('response1', response);
      //   return response.json();
      // })
      .then((response) => {
        console.log('response2', response);
        localStorage.removeItem('userInfo');
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
    //
  };

  return (
    <Box>
      <Avatar background="brand" size="medium" onClick={onMenuClick}>
        {getInitials(name)}
      </Avatar>
      <div ref={ref} />
      {open && (
        <Layer
          //   animate={false}
          //   target={ref.current}
          modal={false}
          onClickOutside={() => setOpen(false)}
          position="top-right"
        >
          <div
            style={{
              position: 'absolute',
              top: '16vh',
              right: '60px',
            }}
          >
            <Box
              style={{
                boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.12)',
              }}
              width={width}
              background="#fff"
            >
              <Box style={{ padding: 16 }}>
                <Text size="large" weight="bold">
                  {name}
                </Text>
                <Text>{email}</Text>
              </Box>
              <div
                style={{
                  borderBottom: '1px solid #ccc',
                  height: 1,
                  width,
                }}
              />
              <Button
                size="medium"
                icon={<LinkNext />}
                label="Sign Out"
                alignSelf="start"
                style={{ padding: 16, fontWeight: 'bold' }}
                onClick={handleSignOut}
              />
            </Box>
          </div>
        </Layer>
      )}
    </Box>
  );
}

UserMenu.propTypes = {
  userInfo: PropTypes.any,
};
