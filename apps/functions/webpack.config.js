const GeneratePackageJsonPlugin = require("generate-package-json-webpack-plugin");

module.exports = (config, context) => {
    return {
        ...config,
        output: {
            ...config.output,
            filename: 'index.js',
            libraryTarget: 'commonjs'
        },
        plugins: [
            ...config.plugins,
            new GeneratePackageJsonPlugin(
                {
                    "name": "clbox.functions",
                    "version": "1.0.0",
                    "main": "./index.js",
                    "license": "MIT",
                    "private": true,
                    "dependencies": {
                        "tslib": "",
                        "firebase-functions": "",
                        "firebase-admin": "",
                        "tsscmp": "",
                        "node-fetch": ""
                    },
                    "engines": {
                        "node": "10"
                    }
                },
                __dirname + "/../../package.json"
            )
        ]
    };
};
