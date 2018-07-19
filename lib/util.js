'use strict'

const RecurlyError = require('./recurly-error')

const handleRecurlyError = (err, response, payload, validStatuses) => {
  let recurlyError = null

  console.log("---- handleRecurlyError ----");

  if (err) {
    console.log("---- err ----");
    return err
  }
  else if (!response) {
    console.log("--- no response ----");
    recurlyError = new Error('no response object')
  }
  else if (payload && payload.hasOwnProperty('transaction_error')) {
    console.log("---- transaction_error ----");
    recurlyError = new RecurlyError(payload)
  }
  else if (payload && payload.hasOwnProperty('error')) {
    console.log("---- error ----");
    recurlyError = new RecurlyError(payload.error)
  }
  else if ((response.statusCode === 400) && payload && (typeof payload === 'object')) {
    console.log("---- 400 ----");
    recurlyError = new RecurlyError(payload)
  }

  if (recurlyError) {
    console.log("---- recurlyError ----");
    recurlyError.statusCode = response.statusCode
    return recurlyError
  }

  if (validStatuses.indexOf(response.statusCode) === -1) {
    console.log("---- no valid status ----");
    return new Error(`unexpected status: ${response.statusCode}`)
  }

  console.log("---- end of handleRecurlyError ----");

}

module.exports.handleRecurlyError = handleRecurlyError
