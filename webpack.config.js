// webpack.config.js

module.exports = {
    // Other webpack configurations...
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
  };
  