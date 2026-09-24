import { useEffect } from 'react';

// Triggers the HPEHF persistent subheader (see src/html.js) for pages that
// belong to a product category (e.g. HPE Storage, HPE Compute, HPE
// Networking). Pass the subNavConfig built at build time in gatsby-node.js,
// or undefined/null on pages that should not show a subheader.
export const useHfSubNav = (subNavConfig) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.__hpDevApplySubNav) {
      return undefined;
    }

    window.__hpDevApplySubNav(subNavConfig || null);

    return () => {
      // Clear the subheader on unmount so it doesn't leak onto unrelated pages.
      if (window.__hpDevApplySubNav) {
        window.__hpDevApplySubNav(null);
      }
    };
  }, [subNavConfig]);
};

export default useHfSubNav;
