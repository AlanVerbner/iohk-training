import {
  Template
} from 'meteor/templating'

import './table.html'

Template.Table.helpers( {
  getFieldValue( entity, field ) {
    if ( typeof field.name === 'function' )
      return field.name( entity )
    return entity[ field.name ]
  },

  getSortIcon( sort ) {
    return sort === 'asc' ? ' glyphicon-triangle-top' : ' glyphicon-triangle-bottom';
  }
} )

Template.Table.events( {

  // Fixme: this could be done as a generic template
  'click .sort-icon': ( event, template ) => {
    var instance = Template.instance();
    const sortId = event.target.getAttribute( 'data-sort-id' )
    instance.data.onSortingChanged( sortId )
  }

} );
