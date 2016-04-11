//import '../imports/ui/invoice_list.html'
import '../imports/ui/invoices_list.js'

Router.route( '/invoices/:timeFilter', function() {

  if (
    this.params.timeFilter !== 'today' &&
    this.params.timeFilter !== 'week' &&
    this.params.timeFilter !== 'month' &&
    this.params.timeFilter !== 'all'
  ) {
    this.redirect( '/invoices/all' )
  }

  this.state.set( 'timeFilter', this.params.timeFilter )
  this.state.set( 'sortCreatedAt', this.params.query.sortCreatedAt )
  this.state.set( 'sortTotal', this.params.query.sortTotal )

  this.render( 'InvoiceList' );
}, {
  name: 'InvoiceList'
} );

Router.route( '/', function() {
  this.redirect( '/invoices/all' )
} )
