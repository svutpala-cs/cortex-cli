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
const AccountsTokens = require('../client/accounts-tokens');
const { printSuccess, printError, filterObject, parseObject, printTable } = require('./utils');

module.exports.RefreshTokenCommand = class {
    constructor(program) {
        this.program = program;
    }

    execute(options) {
        const profile = loadProfile(options.profile);
        debug('%s.executeRefreshToken()', profile.name);

        const accountsTokens = new AccountsTokens(profile.url);
        accountsTokens.refreshToken(profile.token)
            .then((response) => {
                if (response.success) {
                    let result = response.result;
                    printSuccess(JSON.stringify(result, options));
                }
                else {
                    printError(`Failed to refresh token: ${response.status} ${response.message}`, options);
                }
            })
            .catch((err) => {
                printError(`Failed to refresh token: ${err.status} ${err.message}`, options);
            });
    }
};

module.exports.UpgradeTokenCommand = class {
    constructor(program) {
        this.program = program;
    }

    execute(options) {
        const profile = loadProfile(options.profile);
        debug('%s.executeUpgradeToken()', profile.name);

        const accountsTokens = new AccountsTokens(profile.url);
        accountsTokens.upgradeToken(profile.token)
            .then((response) => {
                if (response.success) {
                    let result = response.result;
                    printSuccess(JSON.stringify(result, options));
                }
                else {
                    printError(`Failed to upgrade token: ${response.status} ${response.message}`, options);
                }
            })
            .catch((err) => {
                printError(`Failed to upgrade token: ${err.status} ${err.message}`, options);
            });
    }
};

module.exports.DowngradeTokenCommand = class {
    constructor(program) {
        this.program = program;
    }

    execute(options) {
        const profile = loadProfile(options.profile);
        debug('%s.executeDowngradeToken()', profile.name);

        const accountsTokens = new AccountsTokens(profile.url);
        accountsTokens.downgradeToken(profile.token)
            .then((response) => {
                if (response.success) {
                    let result = response.result;
                    printSuccess(JSON.stringify(result, options));
                }
                else {
                    printError(`Failed to downgrade token: ${response.status} ${response.message}`, options);
                }
            })
            .catch((err) => {
                printError(`Failed to downgrade token: ${err.status} ${err.message}`, options);
            });
    }
};