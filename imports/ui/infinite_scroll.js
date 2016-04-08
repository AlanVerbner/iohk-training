import {
  Template
} from 'meteor/templating'


import './infinite_scroll.html'

function areAllLoaded( data ) {
  return data.total === data.loaded
}

function isIndicatorVisible( window, target ) {

  const threshold = window.scrollTop() + window.height() - target.height();
  return target.offset().top < threshold;
}

function tryLoadMoreData( instance ) {
  var target = instance.$( "#load-more" );
  if ( !target.length ) return;

  if ( isIndicatorVisible( $( window ), target ) && !areAllLoaded( instance.data ) ) {
    instance.data.onNeedMoreItems()
  }
}

Template.InfiniteScroll.onRendered( function onBodyCreated() {
  $( window ).scroll( () => {
    tryLoadMoreData( this )
  } )
} )

Template.InfiniteScroll.helpers( {

  allLoaded() {
    return areAllLoaded( this )
  },

  moreToLoad() {
    return !areAllLoaded( this )
  }
} )
