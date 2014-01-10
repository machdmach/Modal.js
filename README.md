# Modal.js

Simple customizable modals.

## Setup

To use **Modal.js**, just include `<script src="modal.min.js"></script>` in your document's header. These are some basic styles to get the modals looking decent; feel free to style it up however you like.

    .modal-wrapper {
      background-color: rgba(0,0,0,0.6);
      bottom: 0;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
    }

    .modal-body {
      background-color: #fff;
      border-radius: 0.25em;
      box-shadow: 0 0 1em rgba(0,0,0,0.4);
      left: 50%;
      max-width: 30em;
      padding: 3em;
      position: absolute;
      text-align: center;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
    }

## Calling a Modal

To call a modal, simply pass a string to the `Modal()` function; like so:

    Modal( 'This is a modal.' );

## Creating a Modal

To create a new modal, invoke `new Modal()` with a name and options.

    new Modal( 'custom', {
      afterInsert: function() {
        this.el.style.transition = 'opacity 200ms';
        this.el.style.opacity = 1;
      }
    });

You can alternatively skip the first argument and pass a name through the options.

    new Modal({
      name: 'custom',
      innerTmpl: '<p><%= content %></p>'
    });

To call you're new modal, pass the name of a modal to the `Modal()` function as the first perameter.

    Modal( 'custom', 'This is a custom modal.' );

### Available Options

- **name** *String* - The name of the modal. *(Should not contain spaces)*

- **inherits** *String* - The name of a modal to inherit options from.

- **innerTmpl** *String* - The inner template of the modal. Dynamic content from `Modal()` is passed as `<%= content =>`. *(Uses John Resig's Javascript Templating)*

- **outerTmpl** *String* - The outer template of the modal. It's recommended that this option be common for most modals. Modal name and innerTmpl is passed as `<%= name %>` and `<%= inner %>` respectively. *(Uses John Resig's Javascript Templating)*

- **afterInsert** *Function* - Called after the modal is inserted into the DOM. The current modal object is assigned to `this`. Within the scope of this function you have access to `this.el`, which is the entire modal element, and `this.dismiss()`, which will call the *beforeDestroy* method and remove the modal.

- **beforeDestroy** *Function* - Called before the modal is destroyed. The current modal object is assigned to `this`. Within the scope of this function you have access to `this.el`, which is the entire modal element.

## Miscellaneous Methods

### Modal.show( name )

Used to trigger a modal that doesn't have any dynamic content, such as forms. This method is much more intuitive than just calling `Modal( name, '' )` and will return `false` if no modal is found by the given name.

### Modal.setDefault( name )

Sets the default modal to use when calling `Modal()` without explicitly declaring a name.

### Modal.defaultOpts( options )

Overrides the default options used to create the modals. If called before using the default modal, it will also use these options. *This method does not affect previously created modals.*