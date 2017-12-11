var path = require('path')

var prod_build_dir, prod_public_path, version
if (process.env.TRAVIS_TAG) {
  console.log(`detected TRAVIS_TAG "${process.env.TRAVIS_TAG}", building for release deploy.`)
  if (process.env.TRAVIS_TAG !== process.env.npm_package_version) {
    throw `travis tag doesn't match npm_pckage_version: ${process.env.TRAVIS_TAG} vs ${process.env.npm_package_version}`
  }
  prod_build_dir = path.resolve(__dirname, 'dist', process.env.npm_package_version)
  prod_public_path = 'https://cdn.tutorcruncher.com/socket/' + process.env.npm_package_version + '/'
  version = `${process.env.npm_package_version}`
} else {
  console.log('no tag detected, building to dev > branch')
  prod_build_dir = path.resolve(__dirname, 'dist', 'dev', process.env.TRAVIS_BRANCH || '')
  prod_public_path = 'https://cdn.tutorcruncher.com/socket/dev/' + process.env.npm_package_version + '/'
  version = `${process.env.npm_package_version}-${process.env.TRAVIS_COMMIT}`
}
console.log(`build directory: "${prod_build_dir}"`)

module.exports = {
  build: {
    env: {
      NODE_ENV: '"production"',
      RELEASE: `"${version}"`,
      SOCKET_API_URL: '"https://socket.tutorcruncher.com"',
      GRECAPTCHA_KEY: '"6LdyXRgUAAAAADUNhMVKJDXiRr6DUN8TGOgllqbt"',
      RAVEN_DSN: '"https://e8143a1422274f0bbf312ed8792f4e86@sentry.io/128441"',
      GA_ID: '"UA-41117087-3"',
    },
    build_dir: prod_build_dir,
    public_path: prod_public_path,
    build_deets: `\
/* 
  TutorCruncher socket frontend, Copyright (c) 2017 TutorCruncher ltd.
  Released under the MIT license, see https://github.com/tutorcruncher/socket-frontend/

 * version:    ${version}
 * build time: ${new Date()}
 * tag:        ${process.env.TRAVIS_TAG || '-'}
 * branch:     ${process.env.TRAVIS_BRANCH || '-'}
 * commit sha: ${process.env.TRAVIS_COMMIT || '-'}
*/`,
  },
  dev: {
    env: {
      NODE_ENV: '"development"',
      RELEASE: '"development"',
      // SOCKET_API_URL: '"api/"',
      SOCKET_API_URL: '"https://socket.tutorcruncher.com"',
      GRECAPTCHA_KEY: '"6LdyXRgUAAAAADUNhMVKJDXiRr6DUN8TGOgllqbt"',
      RAVEN_DSN: 'null',
      GA_ID: 'null',
      // GA_ID: '"UA-41117087-3"',
    },
    port: 5000,
    build_dir: path.resolve(__dirname, 'dev'),
    public_path: '/',
  },
  test: {
    env: {
      NODE_ENV: '"testing"',
      RELEASE: '"testing"',
      SOCKET_API_URL: '""',
      GRECAPTCHA_KEY: 'null',
      RAVEN_DSN: 'null',
      GA_ID: 'null',
    },
    build_dir: path.resolve(__dirname, 'dist-test'),
    public_path: '/',
  }
}
