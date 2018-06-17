var path = require('path');
const exec = require('child_process').exec;

let program = require('commander');

program
  .option('-r, --revision <rev>', 'Branch, commit or tag')
  .parse(process.argv);

module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      branch: program.revision || 'master',
      workspace: '/tmp/shipit',
      deployTo: '~/slowcab',
      repositoryUrl: 'ssh://git@github.com/gilevy/slowcab.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 1,
      deleteOnRollback: true,
      shallowClone: true
    },
    production: {
      servers: 'ubuntu@34.218.230.100'
    }
  });

  shipit.on('updated', function() {
    shipit.start('build');
  });

  shipit.task('build', function() {
    //exec(`nvm use v7.5.0; export NODE_ENV=${shipit.environment}; NODE_ENV=${shipit.environment} npm run build`, (e, s, err) => {
    //shipit.local('nvm use v7.5.0; export NODE_ENV='+shipit.environment+'; NODE_ENV='+shipit.environment+' npm run build').then(function() {
    shipit.remote('cd ~/slowcab/current; nvm use 9; npm install --no-optional;').then(function(res){
      shipit.emit('built');
    });
  });

  shipit.on('built', function () {
    shipit.remote('cd ~/slowcab; node ~/slowcab/current/node_modules/forever/bin/forever stopall')
    setTimeout(function() {
      shipit.remote('cd ~/slowcab; node ~/slowcab/current/node_modules/forever/bin/forever start app.js')
    }, 4000);
  });
};
