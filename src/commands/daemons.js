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
const { getSecret } = require('../client/secrets');

module.exports.UpdateStackCommand = class {

    constructor(program) {
      this.program = program
    }

    execute(file, stackName, options) {
      const profile = loadProfile(options.profile);
      getSecret(profile.token, profile.url, 'rancher')
        .then(resp => {
          const args = this._buildArgs(profile.account, file, stackName, resp.message)
          execRancher(args)
        })
        .catch(err => printError(err))
    }

    _buildArgs(account, file, stackName, rancherConf) {
          return [
            '--url', rancherConf.url,
            '--access-key', rancherConf.accessKey,
            '--secret-key', rancherConf.secretKey,
            '-f', file, 
            '-p', account + '-' + stackName,
            'up', '-d',
          ]
    }
}


function execRancher(args) {
    // using rancher cli: rancher up -d -f <path to/docker-compose.yml> -s <stack name>
  
    const exec_file = (process.platform === "win32") ? 'rancher-compose.exe' : 'rancher-compose'
    //const cmd = path.join(__dirname, '..', '..', 'scripts', exec_file)
    const cmd = exec_file
    const r = spawnSync(cmd, args) 

    if (r.status === 0)    printSuccess(r.output.toString('utf8')) 
    else if (r.status > 0) printError(r.output.toString('utf8')) 
    else if (r.error)      printError(r.error.toString('utf8')) 
    else                   throw new Error("Request failed for unknown reason! :-(") 
    return r
}

