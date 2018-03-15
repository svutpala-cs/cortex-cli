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
const path = require('path');
const debug = require('debug')('cortex:cli');
const { loadProfile } = require('../config');
const { printSuccess, printError } = require('./utils');
const { spawnSync }  = require('child_process');

module.exports.UpdateStackCommand = class {

    constructor(program) {
      this.program = program
    }

    execute(file, stackName, options) {
      const profile = loadProfile(options.profile);
      const args = [
        '--url', process.env.RANCHER_URL,
        '--access-key', process.env.RANCHER_ACCESS_KEY,
        '--secret-key', process.env.RANCHER_SECRET_KEY,
        '-f', file, 
        '-p', profile.account + '-' + stackName,
        'up', '-d',
      ]
      execRancher(args)
    }
}


function execRancher(args) {
    // using rancher cli: rancher up -d -f <path to/docker-compose.yml> -s <stack name>
  //
    // https://github.com/rancher/rancher-compose/releases/tag/v0.12.5
    const exec_file = (process.platform === "win32") ? 'rancher-compose.exe' : 'rancher-compose'
    //const cmd = path.join(__dirname, '..', '..', 'scripts', exec_file)
    const cmd = exec_file
    const r = spawnSync(cmd, args) 

    if (r.status === 0) { printSuccess(r.output.toString('utf8')) }
    else                { printError(r.output.toString('utf8')) }
    return r
}

