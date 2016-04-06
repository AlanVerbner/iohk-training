import {
  Template
} from 'meteor/templating'

import moment from 'moment'

import {
  Invoices
} from '../api/invoices'

import {
  dateFormater
} from '../ui/helpers'

import './invoice_list.html'

function getCreatedAtDateFilter( filter ) {
  switch ( filter ) {
    case 'all':
      return null;
    case 'month':
      return moment().subtract( 1, 'months' ).startOf( 'day' )
    case 'week':
      return moment().subtract( 1, 'weeks' ).startOf( 'day' )
    case 'today':
      return moment().subtract( 1, 'days' ).startOf( 'day' )
  }
}

function createQueryFilter( state ) {
  const dateFilter = getCreatedAtDateFilter( state.get( 'timeFilter' ) );
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
    total: state.get( 'sortTotal' ) === 'asc' ? 1 : -1,
    createdAt: state.get( 'sortCreatedAt' ) === 'asc' ? 1 : -1

  }
}

function getQueryFromState( state ) {
  const query = state
  delete query.timeFilter
  return query
}

Template.InvoiceList.onCreated( function onBodyCreated() {

  this.getFilter = () => {
    var controller = Iron.controller();
    return createQueryFilter( controller.state )
  }

  this.autorun( () => {
    const queryFilter = this.getFilter()
    this.subscribe( 'invoices', queryFilter )
  } );
} )

Template.InvoiceList.helpers( {
  invoices() {
    var controller = Iron.controller();
    const sort = createSort( controller.state );
    const invoices = Invoices.find( {}, {
      sort: sort
    } )
    return invoices
  },
  formatDate: dateFormater( 'YYYY-MM-DD' ),

  getActiveClass( buttonId ) {
    var controller = Iron.controller();
    return controller.state.get( 'timeFilter' ) === buttonId ? ' active' : ' ';
  },

  getSortIcon( sortId ) {
    var controller = Iron.controller();
    return controller.state.get( sortId ) === 'asc' ? ' glyphicon-triangle-top' : ' glyphicon-triangle-bottom';
  }
} );

Template.InvoiceList.events( {
  'click .time-filter': ( event, template ) => {
    var controller = Iron.controller();
    Router.go( 'InvoiceList', {
      timeFilter: event.target.id
    }, {
      query: getQueryFromState( controller.state.all() )
    } )
  },
  // Fixme: this could be done as a generic template
  'click .sort-icon': ( event, template ) => {
    var controller = Iron.controller();
    const sortId = event.target.getAttribute( 'data-sort-id' )
    const currentSort = controller.state.get( sortId )
    const query = getQueryFromState( controller.state.all() )
    query[sortId] = currentSort === 'asc' ? 'desc' : 'asc'

    Router.go( 'InvoiceList', {
      timeFilter: controller.state.get('timeFilter')
    }, {
      query: query
    } )

  }

} );
