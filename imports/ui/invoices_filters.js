import {
  Template
} from 'meteor/templating'


import './invoice_filters.html'

Template.InvoiceFilters.helpers( {
  getActiveClass( buttonId ) {
    return this.active === buttonId ? ' active' : ' ';
  }
} )

Template.InvoiceFilters.events( {
  'click .time-filter': ( event, template ) => {
    const instance = Template.instance().data
    instance.onFilterSelected( event.target.id )
    event.preventDefault()
  }
} )
