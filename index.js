const config = require('config');
const fetch = require('node-fetch');
const debug = require('debug')('storm-watcher');

const TIMEOUT = 1000;
const pending = {};

function callback() {
  fetch(`${config.storm.server}/REST/v1/connections`)
    .then(res => res.json())
    .then(({connections}) => {
      debug('Checking the status');
      for (const conn of connections) {
        if (conn.type !== 'receive') {
          continue;
        }
        const entry = `${conn.user}/${conn.file_name}`;
        if (conn.status === 'end_complete') {
          if (pending[entry]) {
            debug(`Complete! : user=${conn.user}, file="${conn.file_name}"`);
            delete pending[entry];
            launchWorkflow(conn);
          }
        } else {
          pending[entry] = conn;
          debug(`Receiving file ... : user=${conn.user}, file="${conn.file_name}", status=${conn.status}, progress=${conn.percent}`);
        }
      }
      setTimeout(callback, TIMEOUT);
    })
    .catch(err => console.error(err.stack));
}

function launchWorkflow(conn) {
  const hash = Buffer.from(`${config.flex.user}:${config.flex.pass}`).toString('base64');
  return fetch(`${config.flex.server}/api/workflows`, {
    method: 'post',
    body: JSON.stringify({
      definitionId: config.flex.workflow,
      workspaceId: config.flex.workspace,
      stringVariables: {
        resourceItemName: conn.file_name
      }
    }),
    headers: {
      'Content-Type': 'application/vnd.nativ.mio.v1+json',
      Authorization: `Basic ${hash}`
    }
  })
    .then(res => res.text())
    .then(res => debug(res))
    .catch(err => console.error(err.stack));
}

setTimeout(callback, 0);
