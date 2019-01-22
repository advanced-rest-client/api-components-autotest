'use strict';
const nconf = (module.exports = require('nconf'));
const path = require('path');

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    // 'CLOUD_BUCKET',
    'GCLOUD_PROJECT',
    'NODE_ENV',
    'OAUTH2_CLIENT_ID',
    'OAUTH2_CLIENT_SECRET',
    'OAUTH2_CALLBACK',
    'PORT',
    'SECRET',
    'SUBSCRIPTION_NAME',
    'TESTS_PROCESS_TOPIC_NAME',
    'TRAVIS_TOPIC_NAME',
    'TRAVIS_BUILD_SUBSCRIPTION_NAME',
    'TRAVIS_WEBHOOK_SUBSCRIPTION_NAME',
    'INSTANCE_CONNECTION_NAME',
    'MEMCACHE_URL',
    'GPG_KEY',
    'CI_EMAIL',
    'CI_NAME',
    'GPG_KEY_PASS',
    'GITHUB_SSH_KEY',
    'GITHUB_SSH_KEY_PUB',
    'GITHUB_SSH_KEY_PASS',
    'WEBHOOK_SECRET'
  ])
  // 3. Config file
  .file({file: path.join(__dirname, 'config.json')})
  // 4. Defaults
  .defaults({
    // This is the id of your project in the Google Cloud Developers Console.
    GCLOUD_PROJECT: '',

    // Connection url for the Memcache instance used to store session data
    MEMCACHE_URL: 'localhost:11211',

    OAUTH2_CLIENT_ID: '',
    OAUTH2_CLIENT_SECRET: '',
    OAUTH2_CALLBACK: 'http://localhost:8080/auth/callback',

    PORT: 8080,

    // Set this a secret string of your choosing
    SECRET: '',

    SUBSCRIPTION_NAME: 'apic-worker-subscription',
    TESTS_PROCESS_TOPIC_NAME: 'test-process-queue',
    TRAVIS_TOPIC_NAME: 'travis-ci',
    TRAVIS_BUILD_SUBSCRIPTION_NAME: 'travis-build',
    TRAVIS_WEBHOOK_SUBSCRIPTION_NAME: 'travis-webhook',

    // GPG key configuration to sign commits in travis CI pipeline.
    // This information is encoded as Secret.
    GPG_KEY: '', // GPG key location
    CI_EMAIL: '', // GPG key's email
    CI_NAME: '', // GPG user name
    GPG_KEY_PASS: '', // Key password

    // SSH key to connect to GitHub
    GITHUB_SSH_KEY: '', // location of the key
    GITHUB_SSH_KEY_PUB: '', // location of the public key
    GITHUB_SSH_KEY_PASS: '', // Key's password

    // GitHub webhook secret
    WEBHOOK_SECRET: ''
  });

function checkConfig(setting) {
  if (!nconf.get(setting)) {
    throw new Error(
      `You must set ${setting} as an environment variable or in config.json!`
    );
  }
}

// Check for required settings
checkConfig('GCLOUD_PROJECT');
checkConfig('OAUTH2_CLIENT_ID');
checkConfig('OAUTH2_CLIENT_SECRET');
checkConfig('SECRET');
checkConfig('PORT');
checkConfig('MEMCACHE_URL');

// Travis config check
if (nconf.get('SCRIPT') === 'travis.js') {
  checkConfig('GPG_KEY');
  checkConfig('CI_EMAIL');
  checkConfig('CI_NAME');
  checkConfig('GPG_KEY_PASS');
  checkConfig('GITHUB_SSH_KEY');
  checkConfig('GITHUB_SSH_KEY_PUB');
  checkConfig('GITHUB_SSH_KEY_PASS');
  checkConfig('TRAVIS_TOPIC_NAME');
  checkConfig('TRAVIS_BUILD_SUBSCRIPTION_NAME');
  checkConfig('TRAVIS_WEBHOOK_SUBSCRIPTION_NAME');
  checkConfig('WEBHOOK_SECRET');
}
