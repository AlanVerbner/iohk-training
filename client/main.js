import {
  Template
} from 'meteor/templating'

import {
  ReactiveDict
} from 'meteor/reactive-dict'

import moment from 'moment'

import {
  Invoices
} from '../imports/api/invoices'

import {
  dateFormater
} from '../imports/ui/helpers'

import './main.html'

const FILTER_FIELD = 'filter';

function getCreatedAtDateFilter( filter ) {
  switch ( filter ) {
    case 'time-filter-all':
      return null;
    case 'time-filter-month':
      return moment().subtract( 1, 'months' ).startOf( 'day' )
    case 'time-filter-week':
      return moment().subtract( 1, 'weeks' ).startOf( 'day' )
    case 'time-filter-today':
      return moment().subtract( 1, 'days' ).startOf( 'day' )
  }
}

Template.body.onCreated( function onBodyCreated() {
  this.state = new ReactiveDict( 'mainTableState' )
  this.state.set( FILTER_FIELD, 'time-filter-all' );
} )

Template.body.helpers( {
  invoices() {
    const instance = Template.instance();
    const dateFilter = getCreatedAtDateFilter( instance.state.get( FILTER_FIELD ) );
    const queryFilter = {};

    if ( dateFilter !== null ) {
      queryFilter.createdAt = {
        $gte: dateFilter.toDate()
      }
    }
    const invoices = Invoices.find( queryFilter )
    return invoices
  },
  formatDate: dateFormater( 'YYYY-MM-DD' )
} );

Template.body.events( {
  'click .time-filter': ( event, template ) => {
    $( event.target ).addClass( 'active' ).siblings().removeClass( 'active' )
    template.state.set( FILTER_FIELD, event.target.id )
  }
} );
