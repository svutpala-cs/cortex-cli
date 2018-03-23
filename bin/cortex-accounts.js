#!/usr/bin/env node

/*
 * Copyright 2018 Cognitive Scale, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const program = require('commander');
const chalk = require('chalk');
const {
    InviteUsersCommand,
    GetInvitedUsersCommand,
    DeactivateUserCommand
} = require('../src/commands/accounts');

let processed = false;
program.description('Work with Cortex Accounts');

// Invite Tenant user list to register
program
    .command('invite-users <userDefinitionList>')
    .description('Invite tenant user list to register for Studio')
    .option('--color [on/off]', 'Turn on/off color output.', 'on')
    .option('--profile [profile]', 'The profile to use')
    .action((userDefinitionList, options) => {
        try {
            new InviteUsersCommand(program).execute(userDefinitionList, options);
            processed = true;
        }
        catch (err) {
            console.error(chalk.red(err.message));
        }
    });


// Get this tenant's list of invited users to register for Studio
program
    .command('get-invited-users')
    .description('Get this tenant\'s list of invited users to register for Studio')
    .option('--color [on/off]', 'Turn on/off color output.', 'on')
    .option('--profile [profile]', 'The profile to use')
    .option('--json', 'Output results using JSON')
    .action((options) => {
        try {
            new GetInvitedUsersCommand(program).execute(options);
            processed = true;
        }
        catch (err) {
            console.error(chalk.red(err.message));
        }
    });

// Deactivate user account for current tenant
program
    .command('deactivate-user <username>')
    .description('Deactivate user account for current tenant')
    .option('--color [on/off]', 'Turn on/off color output.', 'on')
    .option('--profile [profile]', 'The profile to use')
    .option('--json', 'Output results using JSON')
    .action((username, options) => {
        try {
            new DeactivateUserCommand(program).execute(username, options);
            processed = true;
        }
        catch (err) {
            console.error(chalk.red(err.message));
        }
    });


process.env.DOC && require('../src/commands/utils').exportDoc(program);

program.parse(process.argv);
if (!processed)
    ['string', 'undefined'].includes(typeof program.args[0]) && program.help();