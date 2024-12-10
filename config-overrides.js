const webpack = require('webpack');

module.exports = function override(config) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        assert: require.resolve("assert/"),
        util: require.resolve("util/"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        net: false, // `net` is not supported in the browser
        tls: false, // `tls` is not supported in the browser
        process: require.resolve("process/browser"),
    };

    config.plugins = [
        ...(config.plugins || []),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ];

    console.log("Config overrides applied.");
    return config;
};