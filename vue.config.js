const path = require('path');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
    outputDir: 'dist',
    publicPath: '/',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: 8080,
        open: false,
        client: {
            overlay: {
                warnings: false,
                errors: true
            }
        },
        proxy: {
            '/api': {
                target: 'http://www.sanhulianghua.com:2008',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/alltick': {
                target: 'http://quote.alltick.io',
                changeOrigin: true,
                pathRewrite: {
                    '^/alltick': ''
                }
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@assets': path.resolve(__dirname, 'src/assets')
            }
        }
    },
    css: {
        loaderOptions: {
            scss: {
                additionalData: ``
            }
        }
    }
});
