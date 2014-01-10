/** 
 * Modal.js
 *
 * Simple customizable modals
 * https://github.com/wwilsman/Modal.js
 *
 * @author Wil Wilsman <hello@wilwilsman.com>
 * @version 0.9.0
 * @license MIT License
 */

(function() {

var 
  
  // Cache of created modals
  mCache = {},

  // Common utilities
  u = {

    /** jQuery-like extend */
    extend: function() {
      var p, opts, i,
        targ = arguments[ 0 ];

      for ( i = 1; i < arguments.length; i++ ) {
        opts = arguments[ i ];
        for ( p in opts ) {
          if ( opts.hasOwnProperty( p ) ) {
            try {
              if ( opts[ p ].constructor == Object ) {
                targ[ p ] = utils.extend( targ[ p ], opts[ p ] );
              } else {
                targ[ p ] = opts[ p ];
              }
            } catch( e ) {
              targ[ p ] = opts[ p ];
            }
          }
        }
      }

      return targ;
    },

    /** John Resig Javascript Templating */
    tmpl: function( str, data ) {
      var fn = new Function("obj",
        "var p = []; with(obj){p.push('" +
        str.replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'") +
        "');}return p.join('');");
      return data ? fn( data ) : fn;
    },

    /**
     * Converts an HTML string to a single DOM node
     *
     * @param {String} html The HTML to be returned as a node.
     * @returns {Object} The DOM Node created from the HTML.
     */
    parseHtml: function( html ) {
      var tmp = document.createElement( 'div' );
        node = null;

      tmp.innerHTML = html;
      node = tmp.lastChild;
      tmp = null;

      return node;
    },

    noop: function() {}
  },

  /** The Modal Constructor and Caller */
  Modal = function( a1, a2 ) {
    var modal, extendOpts;

    // Call the named modal
    if ( this == window ) {

      // Use the first argument as the modal name if the
      // second argument is present.
      if ( a2 != undefined ) modal = mCache[ a1 ];

      // Use the current, default, or new Model
      modal = modal || mCache[ defaultName ] || new Modal();

      // Show the modal with content
      modal.content( a2 || a1 ).insert();

    // Create a new modal template
    } else {

      // Optional first argument as name
      typeof a1 == "string" ? a2.name = a1 : a2 = a1;

      // Extend the options
      // Inherit options or use defaults
      if ( a2 != undefined && a2.inherits
          && ( inherit = mCache[ a2.inherits ] ) ) {
        this.options = u.extend( {}, inherit.options, a2 );
      } else {
        this.options = u.extend( {}, defaultOpts, a2 );
      }


      // Cache the new modal
      mCache[ this.options.name ] = this;
    }
  },

  // Default Modal to use
  defaultName = 'default';

  // Default Modal options
  defaultOpts = {

    // The name of this modal.
    // Not required if name is first argument.
    name: 'default',

    // The name of a modal to inherit options from
    inherits: null,

    // The outer template of the modal should be common for all modals
    // Modal name and innerTmpl is passed as 'name' and 'inner' respectively
    outerTmpl: [
      '<section class="modal-wrapper modal-<%= name %>">',
        '<aside class="modal-body"><%= inner %></aside>',
      '</section>'
    ].join(''),

    // The inner template of the modal
    // Dynamic content from modal() is passed as 'content'
    innerTmpl: '<p><%= content %></p>',

    // Called after the modal is created
    // The active modal is assigned to 'this'
    afterInsert: u.noop,

    // Called before the modal is destroyed
    // The active modal is assigned to 'this'
    beforeDestroy: u.noop,
  };

// Extend the Modal's Prototype
Modal.prototype = {

  /**
   * Creates the modal HTML from templates and content
   *
   * @param {String} content The content to be included in innerTmpl
   * @returns {Object} The Modal for chaining purposes.
   */
  content: function( content ) {

    // Create HTML from innerTmpl & content
    var innerHtml = u.tmpl( this.options.innerTmpl, {
        // The content that was passed or and empty string
        content: content || ''
      });

    // Set modal's HTML to the result of outerTmpl
    this.html = u.tmpl( this.options.outerTmpl, {
      // The modal's name
      name: this.options.name,
      // Results of innerTmpl
      inner: innerHtml
    });

    // Return this for chaining
    return this;
  },

  /** Inserts and displays the Modal */
  insert: function() {

    // Create DOM Element from HTML
    this.el = u.parseHtml( this.html );

    // Append Element to the body
    document.body.appendChild( this.el );

    // Bind click and esc
    this.el.addEventListener( 'click', this, false );
    document.addEventListener( 'keyup', this, false );

    // Call afterInsert()
    this.options.afterInsert.call( this );
  },

  destroy: function() {

    // Remove Listeners
    this.el.removeEventListener( 'click', this, false );
    document.removeEventListener( 'keyup', this, false );

    // Remove from DOM
    document.body.removeChild( this.el );

    // Prevent memory leaks
    this.el = null;
  },

  /** Hides and removes the Modal */
  dismiss: function() {

    // Call beforeDestroy()
    this.options.beforeDestroy.call( this );

    // Destroy the modal if beforeDestroy() is a noop
    this.options.beforeDestroy == u.noop && this.destroy();
  },

  /** 
   * Handle *EventListener for proper scoping of 'this'.
   *
   * @param {Object} event The event object passed from the Listener
   */
  handleEvent: function( event ) {
    switch ( event.type ) {

    case "keyup":
      // If 'Esc' is pressed, dismiss the modal
      event.keyCode == 27 && this.dismiss(); 
      break;
    case "click":
      // If target is the outermost element of the modal, dismiss it
      event.target == this.el && this.dismiss();
      break;
    }
  }

};

/**
 * Shows a named modal with no dynamic content.
 * 
 * A little more intuitive than `Modal( name, '' )`; which
 * will use the default modal if the named modal is not found.
 *
 * @param {String} name The name of the Modal.
 * @returns {Boolean} False if modal is not defined.
 */
Modal.show = function( name ) {
  ( modal = mCache[ name ] ) && modal.content().insert();
};

/**
 * Sets the default modal to use if none are declared on call.
 * If named Modal does not exists, defaultName does not change.
 *
 * @param {String} name The name of a defined modal
 */
Modal.setDefault = function( name ) {
  if ( mCache[ name ] ) defaultName = name;
};

/**
 * Overrides the default options for all future modals If called 
 * before calling a default modal (by `modal( 'default', string )` 
 * or `modal( string )`), the default modal will inherit
 * these options.
 *
 * @param {Object} opts Key, value pairs to override default options.
 */
Modal.defaultOpts = function( opts ) {
  u.extend( defaultOpts, opts );
};

// Expose Modal if not already
if ( !window.Modal ) {
  window.Modal = Modal;
}

}());