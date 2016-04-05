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

function createQueryFilter( state ) {
  const dateFilter = getCreatedAtDateFilter( state.get( FILTER_FIELD ) );
  const queryFilter = {};

  if ( dateFilter !== null ) {
    queryFilter.createdAt = {
      $gte: dateFilter.toDate()
    }
  }

  return queryFilter
}

Template.body.onCreated( function onBodyCreated() {
  this.state = new ReactiveDict( 'mainTableState' )
  this.state.set( FILTER_FIELD, 'time-filter-all' )

  this.autorun( () => {
    const queryFilter = createQueryFilter( this.state )
    this.subscribe( 'invoices', queryFilter )
  } );
} )

Template.body.helpers( {
  invoices() {
    const invoices = Invoices.find( {} )
    return invoices
  },
  formatDate: dateFormater( 'YYYY-MM-DD' ),

  getActiveClass( buttonId ) {
    const instance = Template.instance();
    return instance.state.get( FILTER_FIELD ) === buttonId ? ' active' : ' ';
  }
} );

Template.body.events( {
  'click .time-filter': ( event, template ) => {
    //this.$( event.target ).addClass( 'active' ).siblings().removeClass( 'active' )
    template.state.set( FILTER_FIELD, event.target.id )
  }
} );
