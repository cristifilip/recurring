'use strict'

const RecurlyData = require('../recurly-data')
const handleRecurlyError = require('../util').handleRecurlyError
const querystring = require('querystring')
const data2xml = require('data2xml')({
  undefined: 'empty',
  null: 'closed'
})

class Purchase extends RecurlyData {
  constructor(recurring) {
    super({
      recurring,
      properties: [
        'account',
        'action',
        'amount_in_cents',
        'approval_code',
        'avs_result',
        'avs_result_postal',
        'avs_result_street',
        'collected_at',
        'created_at',
        'currency',
        'cvv_result',
        'description',
        'details',
        'gateway_type',
        'href',
        'invoice',
        'ip_address',
        'message',
        'origin',
        'payment_method',
        'recurring',
        'reference',
        'refundable',
        'source',
        'status',
        'subscription',
        'tax_in_cents',
        'test',
        'type',
        'uuid',
        'updated_at',
        'voidable'
      ],
      idField: 'uuid',
      plural: 'purchases',
      singular: 'purchase',
      enumerable: true
    })
  }

  static get SINGULAR() {
    return 'purchase'
  }

  static get PLURAL() {
    return 'purchases'
  }

  static get ENDPOINT() {
    return `${RecurlyData.ENDPOINT}${Purchase.PLURAL}`
  }

  create(options, callback) {
    if (!options.account) {
      throw (new Error('purchases must include "account" parameter'))
    }
    if (!options.adjustments && !options.subscriptions) {
      throw (new Error('purchases must include a list of Adjustments or Subscriptions'))
    }
    if (!options.currency) {
      throw (new Error('purchases must include "currency" parameter'))
    }
    console.log(options);
    console.log('\n\n\n\n');
    const body = data2xml(Purchase.SINGULAR, options)
    console.log(body);
    this.post(Purchase.ENDPOINT, body, (err, response, payload) => {
      const error = handleRecurlyError(err, response, payload, [ 200, 201, 204 ])
      if (error) {
        return callback(error)
      }

      this.inflate(payload)
      callback(null, this)
    })
  }
}

module.exports = Purchase
