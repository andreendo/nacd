#!/usr/bin/env node

const profileWrapper = require.resolve('../profile/profilewrap.js');
const profileReport = require('../profile/profilereport');
// const plainWrapper = require.resolve('../mode/plain/wrap.js');
const plain2Wrapper = require.resolve('../mode/plain2/wrap.js');
const argv = require('yargs');
const foreground = require('foreground-child');
const sw = require('spawn-wrap');

argv.usage('Usage: $0 <command> [options]')
    // .command(
    //     'profile <testcommand>',
    //     'run the test and profile the built-in modules usage',
    //     (yargs) => {
    //         return yargs.option('config', {
    //             alias: 'c',
    //             describe: 'JSON config file path',
    //             nargs: 1
    //         });
    //     },
    //     (argv) => {
    //         const command = process.argv.slice(3);
    //         if (argv.config) {
    //             command.pop();
    //             command.pop();
    //         }

    //         sw([profileWrapper], { command });
    //         foreground(command, (done) => {
    //             return done();
    //         });
    //     })
    // .command(
    //     'profile-report',
    //     'find current logs folder and generate report files',
    //     () => { },
    //     () => {
    //         profileReport();
    //     })
    // .command(
    //     'plain <testcommand>',
    //     'run the plain mode',
    //     () => { },
    //     () => {
    //         const command = process.argv.slice(3);
    //         sw([plainWrapper], { command });
    //         foreground(command, (done) => {
    //             return done();
    //         });
    //     })
    .command(
        'plain2 <testcommand>',
        'run the default mode (random choices of delays)',
        () => { },
        () => {
            const command = process.argv.slice(3);
            sw([plain2Wrapper], { command, mode: 'default' });
            foreground(command, (done) => {
                return done();
            });
        })
    .command(
        'always <testcommand>',
        'run the "always inject delays" mode',
        () => { },
        () => {
            const command = process.argv.slice(3);
            sw([plain2Wrapper], { command, mode: 'always' });
            foreground(command, (done) => {
                return done();
            });
        })
    .command(
        'never <testcommand>',
        'run the "never inject delays" mode',
        () => { },
        () => {
            const command = process.argv.slice(3);
            sw([plain2Wrapper], { command, mode: 'never' });
            foreground(command, (done) => {
                return done();
            });
        })

    .argv;

if (process.argv.length <= 2) argv.showHelp();