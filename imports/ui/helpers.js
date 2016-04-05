import {
  Template
} from 'meteor/templating';

import moment from 'moment';


export function dateFormater( format = 'yyyy-MM-dd' ) {
  return function( date ) {
    return moment( date ).format( format )
  }
}
