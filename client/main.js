import {
  Template
} from 'meteor/templating';

import {
  Invoices
} from '../imports/api/invoices'

import {
  dateFormater
} from '../imports/ui/helpers'

import './main.html';

Template.body.helpers( {
  invoices() {
    return Invoices.find( {} )
  },
  formatDate: dateFormater('YYYY-MM-DD')
} );
