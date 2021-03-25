export const onRouteUpdate = ({ location, prevLocation }) => {
  if (location && location.state)
    return Object.assign(location, {
      state: {
        ...location.state,
        prevPath: prevLocation ? prevLocation.pathname : null,
      },
    });
    return null;
};