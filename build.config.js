const path = require('path')

module.exports = (config) => {

  const alias = {
    logger: './lib/logger',
    lib: './lib'
  }

  const buildConfig = {
    browserify: [{
      src: 'export.js',
      dest: 'docs/metronome.min.js',
      watch: ['**/*.js', '!docs/**'],
      alias
    }],
    sass: [{
      src: 'docs-src/index.scss',
      dest: 'docs/docs.min.css',
      watch: '**/*.scss'
    }],
    html: {
      src: 'docs-src/**/index.html',
      dest: 'docs',
      watch: 'docs-src/**/*.html'
    },
    static: {
      src: 'docs',
      port: 3003
    }
  }

  return buildConfig
}