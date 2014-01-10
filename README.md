# Modal.js

Simple customizable modals. Check out the [demos](http://wwilsman.github.io/Modal.js/) to see it in action.

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
      transform: translate(-50%, -50%);
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

To call your new modal, pass the name of a modal to the `Modal()` function as the first perameter.

    Modal( 'custom', 'This is a custom modal.' );

### Available Options

- **name** *String* - The name of the modal. *(Should not contain spaces)*

- **inherits** *String* - The name of a modal to inherit options from.

- **innerTmpl** *String* - The inner template of the modal. Dynamic content from `Modal()` is passed as `<%= content =>`. *(Uses John Resig's Javascript Templating)*

- **outerTmpl** *String* - The outer template of the modal. It's recommended that this option be common for most modals. Modal name and innerTmpl is passed as `<%= name %>` and `<%= inner %>` respectively. *(Uses John Resig's Javascript Templating)*

- **afterInsert** *Function* - Called after the modal is inserted into the DOM. The current modal object is assigned to `this`. Within the scope of this function you have access to `this.el`, which is the entire modal element, and `this.dismiss()`, which will call the *beforeDestroy* function and remove the modal.

- **beforeDestroy** *Function* - Called before the modal is destroyed. The current modal object is assigned to `this`. Within the scope of this function you have access to `this.el`, which is the entire modal element, and `this.destroy()`, which will remove the modal from the DOM.

## Static Methods

### Modal.show( name )

Used to trigger a modal that doesn't have any dynamic content, such as forms. This method is much more intuitive than just calling `Modal( name, '' )` and will return `false` if no modal is found by the given name.

### Modal.setDefault( name )

Sets the default modal to use when calling `Modal()` without explicitly declaring a name.

### Modal.defaultOpts( options )

Overrides the default options used to create the modals. If called before using the default modal, it will also use these options. *This method does not affect previously created modals.*

## License

The MIT License (MIT)

Copyright (c) 2014 Wil Wilsman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.