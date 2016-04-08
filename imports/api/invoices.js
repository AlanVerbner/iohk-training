import {
  Mongo
} from 'meteor/mongo'

export const Invoices = new Mongo.Collection( 'Invoices' )

if ( Meteor.isServer ) {
  Meteor.publish( 'invoices', function invoicesPublication( query, sort, limit = 1000 ) {
    return Invoices.find( query, {
      sort: sort,
      limit: limit
    } )
  } )
}
