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
const TOTAL_FIELD_SORT = 'totalSort'
const CREATEDAD_FIELD_SORT = 'createdAtSort'

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

function createSort( state ) {
  return {
    total: state.get( TOTAL_FIELD_SORT ),
    createdAt: state.get( CREATEDAD_FIELD_SORT )

  }
}

Template.body.onCreated( function onBodyCreated() {
  this.state = new ReactiveDict( 'mainTableState' )
  this.state.set( FILTER_FIELD, 'time-filter-all' )
  this.state.set( CREATEDAD_FIELD_SORT, 1 )
  this.state.set( TOTAL_FIELD_SORT, -1 )

  this.getFilter = () => {
    return createQueryFilter( this.state )
  }

  this.autorun( () => {
    const queryFilter = this.getFilter()
    this.subscribe( 'invoices', queryFilter )
  } );
} )

Template.body.helpers( {
  invoices() {
    const instance = Template.instance();
    const sort = createSort( instance.state );
    const invoices = Invoices.find( {}, {
      sort: sort
    } )
    return invoices
  },
  formatDate: dateFormater( 'YYYY-MM-DD' ),

  getActiveClass( buttonId ) {
    const instance = Template.instance();
    return instance.state.get( FILTER_FIELD ) === buttonId ? ' active' : ' ';
  },

  getSortIcon( sortId ) {
    const instance = Template.instance();
    return instance.state.get( sortId ) === 1 ? ' glyphicon-triangle-top' : ' glyphicon-triangle-bottom';
  }
} );

Template.body.events( {
  'click .time-filter': ( event, template ) => {
    template.state.set( FILTER_FIELD, event.target.id )
  },
  // Fixme: this could be done as a generic template
  'click .sort-icon': ( event, template ) => {
    const sortId = event.target.getAttribute( 'data-sort-id' )
    const currentSort = template.state.get( sortId )
    template.state.set( sortId, currentSort === 1 ? -1 : 1 )
  }

} );
