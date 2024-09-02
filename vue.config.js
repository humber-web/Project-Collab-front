module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/projecto1/'
    : '/',
  transpileDependencies: [/node_modules/],
};