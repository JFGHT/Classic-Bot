// Changed config because of this bug:
// https://github.com/zeit/next.js/issues/5750#issuecomment-443562606
// Still, the yarn build doesn't work
const { PHASE_PRODUCTION_SERVER } =
  process.env.NODE_ENV === 'development'
    ? {}
    : !process.env.NOW
      ? require('next/constants')
      : require('next-server/constants');

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    // Config used to run in production.
    return {};
  }

  // Put the require call here.
  const withCSS = require('@zeit/next-css');

  return withCSS();
};
