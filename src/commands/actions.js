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
const {loadProfile} = require('../config');
const Actions = require('../client/actions');
const {printSuccess, printError, filterObject, parseObject, printTable} = require('./utils');

module.exports.ListActionsCommand = class {

    constructor(program) {
        this.program = program;
    }

    execute(options) {
        const profile = loadProfile(options.profile);
        debug('%s.executeListActions()', profile.name);

        const actions = new Actions(profile.url);
        actions.listActions(profile.token)
            .then((response) => {
                if (response.success) {
                    let result = response.actions;
                    if (options.query)
                        result = filterObject(result, options);

                    if (options.json) {
                        printSuccess(JSON.stringify(result, null, 2), options);
                    }
                    else {
                        const tableSpec = [
                            {column: 'Name', field: 'name', width: 50},
                            {column: 'Image', field: 'image', width: 50},
                            {column: 'Kind', field: 'kind', width: 25},
                            {column: 'Created On', field: 'createdAt', width: 26}
                        ];

                        printTable(tableSpec, result);
                    }
                }
                else {
                    printError(`Failed to list actions: ${response.status} ${response.message}`, options);
                }
            })
            .catch((err) => {
                printError(`Failed to list actions: ${err.status} ${err.message}`, options);
            });
    }
};

module.exports.DescribeActionCommand = class {

    constructor(program) {
        this.program = program;
    }

    execute(actionName, options) {
        const profile = loadProfile(options.profile);
        debug('%s.executeDescribeAction(%s)', profile.name, actionName);

        const actions = new Actions(profile.url);
        actions.describeAction(profile.token, actionName)
            .then((response) => {
                if (response.success) {
                    let result = filterObject(response.action, options);
                    printSuccess(JSON.stringify(result, null, 2), options);
                }
                else {
                    printError(`Failed to describe action: ${response.status} ${response.message}`, options);
                }
            })
            .catch((err) => {
                printError(`Failed to describe action: ${err.status} ${err.message}`, options);
            });
    }
};

module.exports.DeployActionCommand = class {

    constructor(program) {
        this.program = program;
    }

    execute(actionName, options) {
        const profile = loadProfile(options.profile);
        debug('%s.deployAction(%s)', profile.name, actionName);

        const kind = options.kind;
        const dockerImage = options.docker;
        const code = options.code;
        const memory = parseInt(options.memory);
        const timeout = parseInt(options.timeout);
        const actionType = options.actionType;
        const cmd = options.cmd;
        const port = options.port;
        const environment = options.environment;

        const actions = new Actions(profile.url);
        actions.deployAction(profile.token, actionName, dockerImage, kind, code, memory, timeout, actionType, cmd, port, environment)
            .then((response) => {
                if (response.success) {
                    printSuccess(JSON.stringify(response.message, null, 2), options);
                }
                else {
                    printError(`Action deployment failed: ${response.status} ${response.message}`, options);
                }
            })
            .catch((err) => {
                printError(`Failed to deploy action: ${err.status} ${err.message}`, options);
            });
    }
};

module.exports.InvokeActionCommand = class {

    constructor(program) {
        this.program = program;
    }

    execute(actionName, options) {
        const profile = loadProfile(options.profile);
        debug('%s.executeInvokeAction(%s)', profile.name, actionName);

        let params = {};
        if (options.params) {
            params = parseObject(options.params, options);
        }
        else if (options.paramsFile) {
            const paramsStr = fs.readFileSync(options.paramsFile);
            params = parseObject(paramsStr, options);
        }

        debug('params: %o', params);
        const actionType = options.actionType;
        const path = options.path;
        const method = options.method;
        const actions = new Actions(profile.url);
        actions.invokeAction(profile.token, actionName, path, params, actionType, method)
            .then((response) => {
                if (response.success) {
                    let result = filterObject(response.result, options);
                    printSuccess(JSON.stringify(result, null, 2), options);
                }
                else {
                    printError(`Action invocation failed: ${response.status} ${response.message}`, options);
                }
            })
            .catch((err) => {
                printError(`Failed to invoke action: ${err.status} ${err.message}`, options);
            });
    }
};


module.exports.DeleteActionCommand = class {

    constructor(program) {
        this.program = program;
    }

    execute(actionName, options) {
        const profile = loadProfile(options.profile);
        debug('%s.executeDeleteAction(%s)', profile.name, actionName);
        const actionType = options.actionType;
        const actions = new Actions(profile.url);
        actions.deleteAction(profile.token, actionName, actionType)
            .then((response) => {
                if (response.success) {
                    let result = filterObject(response, options);
                    printSuccess(JSON.stringify(result, null, 2), options);
                }
                else {
                    printError(`Action deletion failed: ${response.status} ${response.message}`, options);
                }
            })
            .catch((err) => {
                printError(`Failed to delete action: ${err.status} ${err.message}`, options);
            });
    }
};
