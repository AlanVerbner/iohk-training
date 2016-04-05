import {
  Mongo
} from 'meteor/mongo'

export const Invoices = new Mongo.Collection( 'Invoices' )

if ( Meteor.isServer ) {
  Meteor.publish( 'invoices', function invoicesPublication( query ) {
    return Invoices.find( query )
  } )
}
