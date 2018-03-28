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

const chalk = require('chalk');
const jmsepath = require('jmespath');
const yaml = require('js-yaml');
const debug = require('debug')('cortex:cli');
const Table = require('cli-table');

module.exports.printSuccess = function(message, options) {
    if (!options || options.color === 'on') {
        console.log(chalk.green(message));
    }
    else {
        console.log(message);
    }
};

module.exports.printError = function(message, options) {
    if (!options ||  options.color === 'on') {
        console.error(chalk.red(message));
    }
    else {
        console.error(message);
    }
};

module.exports.filterObject = function(obj, options) {
    if (options.query) {
        debug('filtering results with query: ' + options.query);
        return jmsepath.search(obj, options.query);
    }
    return obj;
};

module.exports.parseObject = function(str, options) {
    if (options.yaml) {
        return yaml.safeLoad(str);
    }
    
    return JSON.parse(str);
};

function _extractValues(fields, obj) {
    const rv = [];
    fields.forEach((f) => rv.push((obj !== undefined && obj !== null && obj[f] !== undefined)? obj[f].toString() : '-'));
    return rv;
}

module.exports.printTable = function(spec, objects, transform) {
    // Prettifies all timestamp values
    prettifyTimestamp(objects);

    transform = transform || function (obj) { return obj; };

    const head = spec.map((s) => s.column);
    const colWidths = spec.map((s) => s.width);
    const fields = spec.map((s) => s.field);
    const values = objects.map((obj) => _extractValues(fields, transform(obj)));
    debug('printing fields: %o', fields);

    const table = new Table({head, colWidths, style: {head: ['cyan']}});
    values.forEach((v) => table.push(v));

    console.log(table.toString());
};

module.exports.exportDoc = function(program){
    console.log(JSON.stringify(program.commands.map((c)=>({
        name: c._name,
        description: c._description,
        usage:  c.usage(),
        options: c.options.map((o)=>({
            flags: o.flags,
            defaultValue: o.defaultValue,
            description: o.description
        }))
    }))));
    process.exit(0);
};

const prettifyTimestamp = function(objects) {
    // TODO: Is this a correct assumption to make? i.e minDate == "2017-01-01" ?
    // I'm trying to generalise this function so as to be able to use it with every
    // call of `printTable`.
    // If not, we could pass a list of `timestamp` related fields and only convert those.
    // Disadvantage of passing fields: Developer has to call this function everywhere
    // wherever `timestamp` related fields are present.
    const minDateTimestamp = new Date('2017-01-01').getTime();
    const prettify = function(object) {
        for (let key in object) {
            if ((new Date(object[key])).getTime() > minDateTimestamp) {
                object[key] = new Date(object[key]).toLocaleString();
            }
        }
        return object;
    };
    return objects.map( a => prettify(a) );
};