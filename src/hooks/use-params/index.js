// @reach-router from gatsby doesn't have a useParams so we make our own.
export const useParams = (location) => {
  if (!location.search || location.search.indexOf('?') !== 0) {
    return {};
  }
  const params = {};
  const nameValues = location.search.substring(1).split('&');
  nameValues.forEach((pair) => {
    const nameValue = pair.split('=');
    params[nameValue[0]] = decodeURIComponent(nameValue[1]);
  });
  return params;
};
