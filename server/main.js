import {
  Meteor
} from 'meteor/meteor';

import {
  Invoices
} from '../imports/api/invoices'

import generateRandomData from '../imports/helpers/randomDataGenerator'

function preloadInvoices( count ) {
  Invoices.remove({}, () => {
    generateRandomData( count ).forEach( invoice => {
      Invoices.insert( invoice )
    } )
  })
}

Meteor.startup( () => {
  preloadInvoices( 100 )
} );
