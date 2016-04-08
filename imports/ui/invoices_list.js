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
import './invoices_filters.js'
import './infinite_scroll.js'
import './table.js'

const LOAD_SIZE = 20

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

function getSortIdFromField( fieldId ) {
  return 'sort' + fieldId.charAt( 0 ).toUpperCase() + fieldId.substr( 1 )
}

Template.InvoiceList.onCreated( function onBodyCreated() {

  this.getFilter = () => {
    var controller = Iron.controller();
    return createQueryFilter( controller.state )
  }

  this.getSorting = () => {
    var controller = Iron.controller();
    return createSort( controller.state );
  }

  this.getLimit = () => {
    var controller = Iron.controller();
    return controller.state.get('limit') || LOAD_SIZE
  }

  this.autorun( () => {
    const queryFilter = this.getFilter()
    const sorting = this.getSorting();
    const limit = this.getLimit();
    this.subscribe( 'invoices', queryFilter, sorting, limit )
  } );
} )

Template.InvoiceList.helpers( {
  invoiceTableFields() {

    var controller = Iron.controller();

    return [ {
      id: 'invoiceNumber',
      displayText: 'Invoice Number',
      name: 'invoiceNumber'
    }, {
      id: 'total',
      displayText: 'Total',
      name: 'total',
      sort: controller.state.get( getSortIdFromField( 'total' ) )
    }, {
      id: 'createdAt',
      displayText: 'Created At',
      name: entity => {
        return dateFormater( 'YYYY-MM-DD' )( entity.createdAt )
      },
      sort: controller.state.get( getSortIdFromField( 'createdAt' ) )
    } ]
  },

  invoices() {
    var controller = Iron.controller();
    const invoices = Invoices.find( {}, {
      sort: createSort( controller.state )
    } )
    return invoices
  },

  invoicesCount() {
    return Counts.get('total-invoices')
  },

  invoicesLoaded() {
    return Invoices.find( {} ).count()
  },

  currentTimeFilter() {
    var controller = Iron.controller();
    return controller.state.get( 'timeFilter' )
  },

  onFilterSelected() {
    return function( filterId ) {
      var controller = Iron.controller();
      Router.go( 'InvoiceList', {
        timeFilter: filterId
      }, {
        query: getQueryFromState( controller.state.all() )
      } )
    }
  },

  onSortingChanged() {
    return function( fieldId ) {
      var controller = Iron.controller();
      const sortId = getSortIdFromField( fieldId )
      const currentSort = controller.state.get( sortId )
      const query = getQueryFromState( controller.state.all() )
      query[ sortId ] = currentSort === 'asc' ? 'desc' : 'asc'

      Router.go( 'InvoiceList', {
        timeFilter: controller.state.get( 'timeFilter' )
      }, {
        query: query
      } )
    }
  },

  onNeedMoreItems() {
    const controller = Iron.controller();
    return function() {
      const currentSize = controller.state.get( 'limit' ) || LOAD_SIZE
      controller.state.set( 'limit', currentSize + LOAD_SIZE )
    }
  }

} );
