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

const fs = require('fs');
const debug = require('debug')('cortex:cli');
const { loadProfile } = require('../config');
const Accounts = require('../client/accounts');
const { printSuccess, printError, filterObject, parseObject, printTable } = require('./utils');

module.exports.InviteUsersCommand = class InviteUsersCommand {

    constructor(program) {
        this.program = program;
    }

    execute(userDefinitionList, options) {
        const profile = loadProfile(options.profile);
        debug('%s.inviteUser(%s)', profile.name, userDefinitionList);

        const userDefStr = fs.readFileSync(userDefinitionList);
        const userDefList = parseObject(userDefStr, options);
        debug('%o', userDefList);

        const accounts = new Accounts(profile.url);
        accounts.inviteUser(profile.token, userDefList).then((response) => {
            if (response.success) {
                printSuccess(`User invited!`, options);
            }
            else {
                printError(`Failed to invite user: ${response.status} ${response.message}`, options);
            }
        })
        .catch((err) => {
            printError(`Failed to invite user: ${err.status} ${err.message}`, options);
        });
    }
};

module.exports.GetInvitedUsersCommand = class GetInvitedUsersCommand {

    constructor(program) {
        this.program = program;
    }

    execute(options) {
        const profile = loadProfile(options.profile);
        debug('%s.getInvitedUsers', profile.name);

        const accounts = new Accounts(profile.url);
        accounts.getInvitedUsers(profile.token).then((response) => {
            if (response.success) {
                if (options.json) {
                    printSuccess(JSON.stringify(response.result, null, 2));
                }
                else {
                    let tableSpec = [
                        { column: 'Id', field: '_id', width: 30 },
                        { column: 'Tenant', field: 'tenant', width: 15 },
                        { column: 'Username', field: 'username', width: 15 },
                        { column: 'Last', field: 'last', width: 15 },
                        { column: 'First', field: 'first', width: 15 },
                        { column: 'Email', field: 'email', width: 35 },
                        { column: 'Active', field: 'active', width: 15 },
                        { column: 'Upsert Date', field: 'upsert_date', width: 30 }
                    ];
                    printTable(tableSpec, response.result);
                }

            }
            else {
                printError(`Failed to fetch invited users: ${response.status} ${response.message}`, options);
            }
        })
        .catch((err) => {
            printError(`Failed to fetch invited users: ${err.status} ${err.message}`, options);
        });
    }
};

module.exports.DeactivateUserCommand = class DeactivateUserCommand {

    constructor(program) {
        this.program = program;
    }

    execute(username, options) {
        const profile = loadProfile(options.profile);
        debug('%s.deactivateUser(%s)', profile.name, username);

        const accounts = new Accounts(profile.url);
        accounts.deactivateUser(profile.token, username).then((response) => {
            if (response.success) {
                if (options.json) {
                    printSuccess(response.result);
                }
                else {
                    let tableSpec = [
                        { column: 'Id', field: 'id', width: 30 },
                        { column: 'Username', field: 'username', width: 15 },
                        { column: 'Password', field: 'password', width: 15 },
                        { column: 'Last', field: 'last', width: 15 },
                        { column: 'First', field: 'first', width: 15 },
                        { column: 'Email', field: 'email', width: 35 },
                        { column: 'Active', field: 'active', width: 15 },
                        { column: 'JWT', field: 'jwt', width: 30 }
                    ];
                    printTable(tableSpec, response.result);
                }

            }
            else {
                printError(`Failed to deactivate user: ${username}, ${response.status} ${response.message}`, options);
            }
        })
        .catch((err) => {
            printError(`Failed to deactivate user: ${username}, ${err.status} ${err.message}`, options);
        });
    }
};
