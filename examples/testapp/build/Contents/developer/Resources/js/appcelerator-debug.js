/*!(c) 2006-2009 Appcelerator, Inc. http://appcelerator.org
 * Licensed under the Apache License, Version 2.0. Please visit
 * http://license.appcelerator.com for full copy of the License.
 * Version: 2.2.2, Released: 02/04/2009
 **/

/* includes: jquery, swiss, mq, wel and ui */


/* jquery.js */

/*!
 * jQuery JavaScript Library v1.3
 * http://jquery.com/
 *
 * Copyright (c) 2009 John Resig
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-01-13 12:50:31 -0500 (Tue, 13 Jan 2009)
 * Revision: 6104
 */
(function(){

var 
	// Will speed up references to window, and allows munging its name.
	window = this,
	// Will speed up references to undefined, and allows munging its name.
	undefined,
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,
	// Map over the $ in case of overwrite
	_$ = window.$,

	jQuery = window.jQuery = window.$ = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context );
	},

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
	// Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		// Make sure that a selection was provided
		selector = selector || document;

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this[0] = selector;
			this.length = 1;
			this.context = selector;
			return this;
		}
		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			var match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] )
					selector = jQuery.clean( [ match[1] ], context );

				// HANDLE: $("#id")
				else {
					var elem = document.getElementById( match[3] );

					// Make sure an element was located
					if ( elem ){
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id != match[3] )
							return jQuery().find( selector );

						// Otherwise, we inject the element directly into the jQuery object
						var ret = jQuery( elem );
						ret.context = document;
						ret.selector = selector;
						return ret;
					}
					selector = [];
				}

			// HANDLE: $(expr, [context])
			// (which is just equivalent to: $(content).find(expr)
			} else
				return jQuery( context ).find( selector );

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) )
			return jQuery( document ).ready( selector );

		// Make sure that old selector state is passed along
		if ( selector.selector && selector.context ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return this.setArray(jQuery.makeArray(selector));
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.3",

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num === undefined ?

			// Return a 'clean' array
			jQuery.makeArray( this ) :

			// Return just the object
			this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = jQuery( elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" )
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		else if ( name )
			ret.selector = this.selector + "." + name + "(" + selector + ")";

		// Return the newly-formed element set
		return ret;
	},

	// Force the current matched set of elements to become
	// the specified array of elements (destroying the stack in the process)
	// You should use pushStack() in order to do this, but maintain the stack
	setArray: function( elems ) {
		// Resetting the length to 0, then using the native Array push
		// is a super-fast way to populate an object with array-like properties
		this.length = 0;
		Array.prototype.push.apply( this, elems );

		return this;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem && elem.jquery ? elem[0] : elem
		, this );
	},

	attr: function( name, value, type ) {
		var options = name;

		// Look for the case where we're accessing a style value
		if ( typeof name === "string" )
			if ( value === undefined )
				return this[0] && jQuery[ type || "attr" ]( this[0], name );

			else {
				options = {};
				options[ name ] = value;
			}

		// Check to see if we're setting style values
		return this.each(function(i){
			// Set all the styles
			for ( name in options )
				jQuery.attr(
					type ?
						this.style :
						this,
					name, jQuery.prop( this, options[ name ], type, i, name )
				);
		});
	},

	css: function( key, value ) {
		// ignore negative width and height values
		if ( (key == 'width' || key == 'height') && parseFloat(value) < 0 )
			value = undefined;
		return this.attr( key, value, "curCSS" );
	},

	text: function( text ) {
		if ( typeof text !== "object" && text != null )
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );

		var ret = "";

		jQuery.each( text || this, function(){
			jQuery.each( this.childNodes, function(){
				if ( this.nodeType != 8 )
					ret += this.nodeType != 1 ?
						this.nodeValue :
						jQuery.fn.text( [ this ] );
			});
		});

		return ret;
	},

	wrapAll: function( html ) {
		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).clone();

			if ( this[0].parentNode )
				wrap.insertBefore( this[0] );

			wrap.map(function(){
				var elem = this;

				while ( elem.firstChild )
					elem = elem.firstChild;

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		return this.each(function(){
			jQuery( this ).contents().wrapAll( html );
		});
	},

	wrap: function( html ) {
		return this.each(function(){
			jQuery( this ).wrapAll( html );
		});
	},

	append: function() {
		return this.domManip(arguments, true, function(elem){
			if (this.nodeType == 1)
				this.appendChild( elem );
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function(elem){
			if (this.nodeType == 1)
				this.insertBefore( elem, this.firstChild );
		});
	},

	before: function() {
		return this.domManip(arguments, false, function(elem){
			this.parentNode.insertBefore( elem, this );
		});
	},

	after: function() {
		return this.domManip(arguments, false, function(elem){
			this.parentNode.insertBefore( elem, this.nextSibling );
		});
	},

	end: function() {
		return this.prevObject || jQuery( [] );
	},

	// For internal use only.
	// Behaves like an Array's .push method, not like a jQuery method.
	push: [].push,

	find: function( selector ) {
		if ( this.length === 1 && !/,/.test(selector) ) {
			var ret = this.pushStack( [], "find", selector );
			ret.length = 0;
			jQuery.find( selector, this[0], ret );
			return ret;
		} else {
			var elems = jQuery.map(this, function(elem){
				return jQuery.find( selector, elem );
			});

			return this.pushStack( /[^+>] [^+>]/.test( selector ) ?
				jQuery.unique( elems ) :
				elems, "find", selector );
		}
	},

	clone: function( events ) {
		// Do the clone
		var ret = this.map(function(){
			if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
				// IE copies events bound via attachEvent when
				// using cloneNode. Calling detachEvent on the
				// clone will also remove the events from the orignal
				// In order to get around this, we use innerHTML.
				// Unfortunately, this means some modifications to
				// attributes in IE that are actually only stored
				// as properties will not be copied (such as the
				// the name attribute on an input).
				var clone = this.cloneNode(true),
					container = document.createElement("div");
				container.appendChild(clone);
				return jQuery.clean([container.innerHTML])[0];
			} else
				return this.cloneNode(true);
		});

		// Need to set the expando to null on the cloned set if it exists
		// removeData doesn't work here, IE removes it from the original as well
		// this is primarily for IE but the data expando shouldn't be copied over in any browser
		var clone = ret.find("*").andSelf().each(function(){
			if ( this[ expando ] !== undefined )
				this[ expando ] = null;
		});

		// Copy the events from the original to the clone
		if ( events === true )
			this.find("*").andSelf().each(function(i){
				if (this.nodeType == 3)
					return;
				var events = jQuery.data( this, "events" );

				for ( var type in events )
					for ( var handler in events[ type ] )
						jQuery.event.add( clone[ i ], type, events[ type ][ handler ], events[ type ][ handler ].data );
			});

		// Return the cloned set
		return ret;
	},

	filter: function( selector ) {
		return this.pushStack(
			jQuery.isFunction( selector ) &&
			jQuery.grep(this, function(elem, i){
				return selector.call( elem, i );
			}) ||

			jQuery.multiFilter( selector, jQuery.grep(this, function(elem){
				return elem.nodeType === 1;
			}) ), "filter", selector );
	},

	closest: function( selector ) {
		var pos = jQuery.expr.match.POS.test( selector ) ? jQuery(selector) : null;

		return this.map(function(){
			var cur = this;
			while ( cur && cur.ownerDocument ) {
				if ( pos ? pos.index(cur) > -1 : jQuery(cur).is(selector) )
					return cur;
				cur = cur.parentNode;
			}
		});
	},

	not: function( selector ) {
		if ( typeof selector === "string" )
			// test special case where just one selector is passed in
			if ( isSimple.test( selector ) )
				return this.pushStack( jQuery.multiFilter( selector, this, true ), "not", selector );
			else
				selector = jQuery.multiFilter( selector, this );

		var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
		return this.filter(function() {
			return isArrayLike ? jQuery.inArray( this, selector ) < 0 : this != selector;
		});
	},

	add: function( selector ) {
		return this.pushStack( jQuery.unique( jQuery.merge(
			this.get(),
			typeof selector === "string" ?
				jQuery( selector ) :
				jQuery.makeArray( selector )
		)));
	},

	is: function( selector ) {
		return !!selector && jQuery.multiFilter( selector, this ).length > 0;
	},

	hasClass: function( selector ) {
		return !!selector && this.is( "." + selector );
	},

	val: function( value ) {
		if ( value === undefined ) {			
			var elem = this[0];

			if ( elem ) {
				if( jQuery.nodeName( elem, 'option' ) )
					return (elem.attributes.value || {}).specified ? elem.value : elem.text;
				
				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type == "select-one";

					// Nothing was selected
					if ( index < 0 )
						return null;

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							// Get the specifc value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one )
								return value;

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;				
				}

				// Everything else, we just grab the value
				return (elem.value || "").replace(/\r/g, "");

			}

			return undefined;
		}

		if ( typeof value === "number" )
			value += '';

		return this.each(function(){
			if ( this.nodeType != 1 )
				return;

			if ( jQuery.isArray(value) && /radio|checkbox/.test( this.type ) )
				this.checked = (jQuery.inArray(this.value, value) >= 0 ||
					jQuery.inArray(this.name, value) >= 0);

			else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(value);

				jQuery( "option", this ).each(function(){
					this.selected = (jQuery.inArray( this.value, values ) >= 0 ||
						jQuery.inArray( this.text, values ) >= 0);
				});

				if ( !values.length )
					this.selectedIndex = -1;

			} else
				this.value = value;
		});
	},

	html: function( value ) {
		return value === undefined ?
			(this[0] ?
				this[0].innerHTML :
				null) :
			this.empty().append( value );
	},

	replaceWith: function( value ) {
		return this.after( value ).remove();
	},

	eq: function( i ) {
		return this.slice( i, +i + 1 );
	},

	slice: function() {
		return this.pushStack( Array.prototype.slice.apply( this, arguments ),
			"slice", Array.prototype.slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function(elem, i){
			return callback.call( elem, i, elem );
		}));
	},

	andSelf: function() {
		return this.add( this.prevObject );
	},

	domManip: function( args, table, callback ) {
		if ( this[0] ) {
			var fragment = (this[0].ownerDocument || this[0]).createDocumentFragment(),
				scripts = jQuery.clean( args, (this[0].ownerDocument || this[0]), fragment ),
				first = fragment.firstChild,
				extra = this.length > 1 ? fragment.cloneNode(true) : fragment;

			if ( first )
				for ( var i = 0, l = this.length; i < l; i++ )
					callback.call( root(this[i], first), i > 0 ? extra.cloneNode(true) : fragment );
			
			if ( scripts )
				jQuery.each( scripts, evalScript );
		}

		return this;
		
		function root( elem, cur ) {
			return table && jQuery.nodeName(elem, "table") && jQuery.nodeName(cur, "tr") ?
				(elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
				elem;
		}
	}
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

function evalScript( i, elem ) {
	if ( elem.src )
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});

	else
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );

	if ( elem.parentNode )
		elem.parentNode.removeChild( elem );
}

function now(){
	return +new Date;
}

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) )
		target = {};

	// extend jQuery itself if only one argument is passed
	if ( length == i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ )
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null )
			// Extend the base object
			for ( var name in options ) {
				var src = target[ name ], copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy )
					continue;

				// Recurse if we're merging object values
				if ( deep && copy && typeof copy === "object" && !copy.nodeType )
					target[ name ] = jQuery.extend( deep, 
						// Never move original objects, clone them
						src || ( copy.length != null ? [ ] : { } )
					, copy );

				// Don't bring in undefined values
				else if ( copy !== undefined )
					target[ name ] = copy;

			}

	// Return the modified object
	return target;
};

// exclude the following css properties to add px
var	exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	// cache defaultView
	defaultView = document.defaultView || {},
	toString = Object.prototype.toString;

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep )
			window.jQuery = _jQuery;

		return jQuery;
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return toString.call(obj) === "[object Function]";
	},

	isArray: function( obj ) {
		return toString.call(obj) === "[object Array]";
	},

	// check if an element is in a (or is an) XML document
	isXMLDoc: function( elem ) {
		return elem.documentElement && !elem.body ||
			elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
	},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		data = jQuery.trim( data );

		if ( data ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";
			if ( jQuery.support.scriptEval )
				script.appendChild( document.createTextNode( data ) );
			else
				script.text = data;

			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0, length = object.length;

		if ( args ) {
			if ( length === undefined ) {
				for ( name in object )
					if ( callback.apply( object[ name ], args ) === false )
						break;
			} else
				for ( ; i < length; )
					if ( callback.apply( object[ i++ ], args ) === false )
						break;

		// A special, fast, case for the most common use of each
		} else {
			if ( length === undefined ) {
				for ( name in object )
					if ( callback.call( object[ name ], name, object[ name ] ) === false )
						break;
			} else
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ){}
		}

		return object;
	},

	prop: function( elem, value, type, i, name ) {
		// Handle executable functions
		if ( jQuery.isFunction( value ) )
			value = value.call( elem, i );

		// Handle passing in a number to a CSS property
		return typeof value === "number" && type == "curCSS" && !exclude.test( name ) ?
			value + "px" :
			value;
	},

	className: {
		// internal only, use addClass("class")
		add: function( elem, classNames ) {
			jQuery.each((classNames || "").split(/\s+/), function(i, className){
				if ( elem.nodeType == 1 && !jQuery.className.has( elem.className, className ) )
					elem.className += (elem.className ? " " : "") + className;
			});
		},

		// internal only, use removeClass("class")
		remove: function( elem, classNames ) {
			if (elem.nodeType == 1)
				elem.className = classNames !== undefined ?
					jQuery.grep(elem.className.split(/\s+/), function(className){
						return !jQuery.className.has( classNames, className );
					}).join(" ") :
					"";
		},

		// internal only, use hasClass("class")
		has: function( elem, className ) {
			return jQuery.inArray( className, (elem.className || elem).toString().split(/\s+/) ) > -1;
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};
		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( var name in options )
			elem.style[ name ] = old[ name ];
	},

	css: function( elem, name, force ) {
		if ( name == "width" || name == "height" ) {
			var val, props = { position: "absolute", visibility: "hidden", display:"block" }, which = name == "width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ];

			function getWH() {
				val = name == "width" ? elem.offsetWidth : elem.offsetHeight;
				var padding = 0, border = 0;
				jQuery.each( which, function() {
					padding += parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					border += parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
				});
				val -= Math.round(padding + border);
			}

			if ( jQuery(elem).is(":visible") )
				getWH();
			else
				jQuery.swap( elem, props, getWH );

			return Math.max(0, val);
		}

		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		var ret, style = elem.style;

		// We need to handle opacity special in IE
		if ( name == "opacity" && !jQuery.support.opacity ) {
			ret = jQuery.attr( style, "opacity" );

			return ret == "" ?
				"1" :
				ret;
		}

		// Make sure we're using the right name for getting the float value
		if ( name.match( /float/i ) )
			name = styleFloat;

		if ( !force && style && style[ name ] )
			ret = style[ name ];

		else if ( defaultView.getComputedStyle ) {

			// Only "float" is needed here
			if ( name.match( /float/i ) )
				name = "float";

			name = name.replace( /([A-Z])/g, "-$1" ).toLowerCase();

			var computedStyle = defaultView.getComputedStyle( elem, null );

			if ( computedStyle )
				ret = computedStyle.getPropertyValue( name );

			// We should always get a number back from opacity
			if ( name == "opacity" && ret == "" )
				ret = "1";

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(/\-(\w)/g, function(all, letter){
				return letter.toUpperCase();
			});

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if ( !/^\d+(px)?$/i.test( ret ) && /^\d/.test( ret ) ) {
				// Remember the original values
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = ret || 0;
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	},

	clean: function( elems, context, fragment ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" )
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;

		// If a single string is passed in and it's a single tag
		// just do a createElement and skip the rest
		if ( !fragment && elems.length === 1 && typeof elems[0] === "string" ) {
			var match = /^<(\w+)\s*\/?>$/.exec(elems[0]);
			if ( match )
				return [ context.createElement( match[1] ) ];
		}

		var ret = [], scripts = [], div = context.createElement("div");

		jQuery.each(elems, function(i, elem){
			if ( typeof elem === "number" )
				elem += '';

			if ( !elem )
				return;

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag){
					return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
						all :
						front + "></" + tag + ">";
				});

				// Trim whitespace, otherwise indexOf won't work as expected
				var tags = jQuery.trim( elem ).toLowerCase();

				var wrap =
					// option or optgroup
					!tags.indexOf("<opt") &&
					[ 1, "<select multiple='multiple'>", "</select>" ] ||

					!tags.indexOf("<leg") &&
					[ 1, "<fieldset>", "</fieldset>" ] ||

					tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
					[ 1, "<table>", "</table>" ] ||

					!tags.indexOf("<tr") &&
					[ 2, "<table><tbody>", "</tbody></table>" ] ||

				 	// <thead> matched above
					(!tags.indexOf("<td") || !tags.indexOf("<th")) &&
					[ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||

					!tags.indexOf("<col") &&
					[ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||

					// IE can't serialize <link> and <script> tags normally
					!jQuery.support.htmlSerialize &&
					[ 1, "div<div>", "</div>" ] ||

					[ 0, "", "" ];

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( wrap[0]-- )
					div = div.lastChild;

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ?
						div.firstChild && div.firstChild.childNodes :

						// String was a bare <thead> or <tfoot>
						wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ?
							div.childNodes :
							[];

					for ( var j = tbody.length - 1; j >= 0 ; --j )
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length )
							tbody[ j ].parentNode.removeChild( tbody[ j ] );

					}

				// IE completely kills leading whitespace when innerHTML is used
				if ( !jQuery.support.leadingWhitespace && /^\s/.test( elem ) )
					div.insertBefore( context.createTextNode( elem.match(/^\s*/)[0] ), div.firstChild );
				
				elem = jQuery.makeArray( div.childNodes );
			}

			if ( elem.nodeType )
				ret.push( elem );
			else
				ret = jQuery.merge( ret, elem );

		});

		if ( fragment ) {
			for ( var i = 0; ret[i]; i++ ) {
				if ( jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
				} else {
					if ( ret[i].nodeType === 1 )
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					fragment.appendChild( ret[i] );
				}
			}
			
			return scripts;
		}

		return ret;
	},

	attr: function( elem, name, value ) {
		// don't set attributes on text and comment nodes
		if (!elem || elem.nodeType == 3 || elem.nodeType == 8)
			return undefined;

		var notxml = !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		// IE elem.getAttribute passes even for style
		if ( elem.tagName ) {

			// These attributes require special treatment
			var special = /href|src|style/.test( name );

			// Safari mis-reports the default selected property of a hidden option
			// Accessing the parent's selectedIndex property fixes it
			if ( name == "selected" && elem.parentNode )
				elem.parentNode.selectedIndex;

			// If applicable, access the attribute via the DOM 0 way
			if ( name in elem && notxml && !special ) {
				if ( set ){
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name == "type" && jQuery.nodeName( elem, "input" ) && elem.parentNode )
						throw "type property can't be changed";

					elem[ name ] = value;
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) )
					return elem.getAttributeNode( name ).nodeValue;

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name == "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );
					return attributeNode && attributeNode.specified
						? attributeNode.value
						: elem.nodeName.match(/^(a|area|button|input|object|select|textarea)$/i)
							? 0
							: undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml &&  name == "style" )
				return jQuery.attr( elem.style, "cssText", value );

			if ( set )
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );

			var attr = !jQuery.support.hrefNormalized && notxml && special
					// Some attributes require a special call on IE
					? elem.getAttribute( name, 2 )
					: elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}

		// elem is actually elem.style ... set the style

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name == "opacity" ) {
			if ( set ) {
				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				elem.zoom = 1;

				// Set the alpha filter to set the opacity
				elem.filter = (elem.filter || "").replace( /alpha\([^)]*\)/, "" ) +
					(parseInt( value ) + '' == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
			}

			return elem.filter && elem.filter.indexOf("opacity=") >= 0 ?
				(parseFloat( elem.filter.match(/opacity=([^)]*)/)[1] ) / 100) + '':
				"";
		}

		name = name.replace(/-([a-z])/ig, function(all, letter){
			return letter.toUpperCase();
		});

		if ( set )
			elem[ name ] = value;

		return elem[ name ];
	},

	trim: function( text ) {
		return (text || "").replace( /^\s+|\s+$/g, "" );
	},

	makeArray: function( array ) {
		var ret = [];

		if( array != null ){
			var i = array.length;
			// The window, strings (and functions) also have 'length'
			if( i == null || typeof array === "string" || jQuery.isFunction(array) || array.setInterval )
				ret[0] = array;
			else
				while( i )
					ret[--i] = array[i];
		}

		return ret;
	},

	inArray: function( elem, array ) {
		for ( var i = 0, length = array.length; i < length; i++ )
		// Use === because on IE, window == document
			if ( array[ i ] === elem )
				return i;

		return -1;
	},

	merge: function( first, second ) {
		// We have to loop this way because IE & Opera overwrite the length
		// expando of getElementsByTagName
		var i = 0, elem, pos = first.length;
		// Also, we need to make sure that the correct elements are being returned
		// (IE returns comment nodes in a '*' query)
		if ( !jQuery.support.getAll ) {
			while ( (elem = second[ i++ ]) != null )
				if ( elem.nodeType != 8 )
					first[ pos++ ] = elem;

		} else
			while ( (elem = second[ i++ ]) != null )
				first[ pos++ ] = elem;

		return first;
	},

	unique: function( array ) {
		var ret = [], done = {};

		try {

			for ( var i = 0, length = array.length; i < length; i++ ) {
				var id = jQuery.data( array[ i ] );

				if ( !done[ id ] ) {
					done[ id ] = true;
					ret.push( array[ i ] );
				}
			}

		} catch( e ) {
			ret = array;
		}

		return ret;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ )
			if ( !inv != !callback( elems[ i ], i ) )
				ret.push( elems[ i ] );

		return ret;
	},

	map: function( elems, callback ) {
		var ret = [];

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			var value = callback( elems[ i ], i );

			if ( value != null )
				ret[ ret.length ] = value;
		}

		return ret.concat.apply( [], ret );
	}
});

// Use of jQuery.browser is deprecated.
// It's included for backwards compatibility and plugins,
// although they should work to migrate away.

var userAgent = navigator.userAgent.toLowerCase();

// Figure out what browser is being used
jQuery.browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};

jQuery.each({
	parent: function(elem){return elem.parentNode;},
	parents: function(elem){return jQuery.dir(elem,"parentNode");},
	next: function(elem){return jQuery.nth(elem,2,"nextSibling");},
	prev: function(elem){return jQuery.nth(elem,2,"previousSibling");},
	nextAll: function(elem){return jQuery.dir(elem,"nextSibling");},
	prevAll: function(elem){return jQuery.dir(elem,"previousSibling");},
	siblings: function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem);},
	children: function(elem){return jQuery.sibling(elem.firstChild);},
	contents: function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes);}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ), name, selector );
	};
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function(name, original){
	jQuery.fn[ name ] = function() {
		var args = arguments;

		return this.each(function(){
			for ( var i = 0, length = args.length; i < length; i++ )
				jQuery( args[ i ] )[ original ]( this );
		});
	};
});

jQuery.each({
	removeAttr: function( name ) {
		jQuery.attr( this, name, "" );
		if (this.nodeType == 1)
			this.removeAttribute( name );
	},

	addClass: function( classNames ) {
		jQuery.className.add( this, classNames );
	},

	removeClass: function( classNames ) {
		jQuery.className.remove( this, classNames );
	},

	toggleClass: function( classNames, state ) {
		if( typeof state !== "boolean" )
			state = !jQuery.className.has( this, classNames );
		jQuery.className[ state ? "add" : "remove" ]( this, classNames );
	},

	remove: function( selector ) {
		if ( !selector || jQuery.filter( selector, [ this ] ).length ) {
			// Prevent memory leaks
			jQuery( "*", this ).add([this]).each(function(){
				jQuery.event.remove(this);
				jQuery.removeData(this);
			});
			if (this.parentNode)
				this.parentNode.removeChild( this );
		}
	},

	empty: function() {
		// Remove element nodes and prevent memory leaks
		jQuery( ">*", this ).remove();

		// Remove any remaining nodes
		while ( this.firstChild )
			this.removeChild( this.firstChild );
	}
}, function(name, fn){
	jQuery.fn[ name ] = function(){
		return this.each( fn, arguments );
	};
});

// Helper function used by the dimensions and offset modules
function num(elem, prop) {
	return elem[0] && parseInt( jQuery.curCSS(elem[0], prop, true), 10 ) || 0;
}
var expando = "jQuery" + now(), uuid = 0, windowData = {};

jQuery.extend({
	cache: {},

	data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		// Compute a unique ID for the element
		if ( !id )
			id = elem[ expando ] = ++uuid;

		// Only generate the data cache if we're
		// trying to access or manipulate it
		if ( name && !jQuery.cache[ id ] )
			jQuery.cache[ id ] = {};

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined )
			jQuery.cache[ id ][ name ] = data;

		// Return the named cache data, or the ID for the element
		return name ?
			jQuery.cache[ id ][ name ] :
			id;
	},

	removeData: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( jQuery.cache[ id ] ) {
				// Remove the section of cache data
				delete jQuery.cache[ id ][ name ];

				// If we've removed all the data, remove the element's cache
				name = "";

				for ( name in jQuery.cache[ id ] )
					break;

				if ( !name )
					jQuery.removeData( elem );
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			// Clean up the element expando
			try {
				delete elem[ expando ];
			} catch(e){
				// IE has trouble directly removing the expando
				// but it's ok with using removeAttribute
				if ( elem.removeAttribute )
					elem.removeAttribute( expando );
			}

			// Completely remove the data cache
			delete jQuery.cache[ id ];
		}
	},
	queue: function( elem, type, data ) {
		if ( elem ){
	
			type = (type || "fx") + "queue";
	
			var q = jQuery.data( elem, type );
	
			if ( !q || jQuery.isArray(data) )
				q = jQuery.data( elem, type, jQuery.makeArray(data) );
			else if( data )
				q.push( data );
	
		}
		return q;
	},

	dequeue: function( elem, type ){
		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();
		
		if( !type || type === "fx" )
			fn = queue[0];
			
		if( fn !== undefined )
			fn.call(elem);
	}
});

jQuery.fn.extend({
	data: function( key, value ){
		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length )
				data = jQuery.data( this[0], key );

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function(){
				jQuery.data( this, key, value );
			});
	},

	removeData: function( key ){
		return this.each(function(){
			jQuery.removeData( this, key );
		});
	},
	queue: function(type, data){
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined )
			return jQuery.queue( this[0], type );

		return this.each(function(){
			var queue = jQuery.queue( this, type, data );
			
			 if( type == "fx" && queue.length == 1 )
				queue[0].call(this);
		});
	},
	dequeue: function(type){
		return this.each(function(){
			jQuery.dequeue( this, type );
		});
	}
});/*!
 * Sizzle CSS Selector Engine - v0.9.1
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|[^[\]]+)+\]|\\.|[^ >+~,(\[]+)+|[>+~])(\s*,\s*)?/g,
	done = 0,
	toString = Object.prototype.toString;

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 )
		return [];
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, check, mode, extra, prune = true;
	
	// Reset the position of the chunker regexp (start from head)
	chunker.lastIndex = 0;
	
	while ( (m = chunker.exec(selector)) !== null ) {
		parts.push( m[1] );
		
		if ( m[2] ) {
			extra = RegExp.rightContext;
			break;
		}
	}

	if ( parts.length > 1 && Expr.match.POS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			var later = "", match;

			// Position selectors must be done after the filter
			while ( (match = Expr.match.POS.exec( selector )) ) {
				later += match[0];
				selector = selector.replace( Expr.match.POS, "" );
			}

			set = Sizzle.filter( later, Sizzle( /\s$/.test(selector) ? selector + "*" : selector, context ) );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				var tmpSet = [];

				selector = parts.shift();
				if ( Expr.relative[ selector ] )
					selector += parts.shift();

				for ( var i = 0, l = set.length; i < l; i++ ) {
					Sizzle( selector, set[i], tmpSet );
				}

				set = tmpSet;
			}
		}
	} else {
		var ret = seed ?
			{ expr: parts.pop(), set: makeArray(seed) } :
			Sizzle.find( parts.pop(), parts.length === 1 && context.parentNode ? context.parentNode : context );
		set = Sizzle.filter( ret.expr, ret.set );

		if ( parts.length > 0 ) {
			checkSet = makeArray(set);
		} else {
			prune = false;
		}

		while ( parts.length ) {
			var cur = parts.pop(), pop = cur;

			if ( !Expr.relative[ cur ] ) {
				cur = "";
			} else {
				pop = parts.pop();
			}

			if ( pop == null ) {
				pop = context;
			}

			Expr.relative[ cur ]( checkSet, pop, isXML(context) );
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		throw "Syntax error, unrecognized expression: " + (cur || selector);
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, context, results, seed );
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.match[ type ].exec( expr )) ) {
			var left = RegExp.leftContext;

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound;

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.match[ type ].exec( expr )) != null ) {
				var filter = Expr.filter[ type ], goodArray = null, goodPos = 0, found, item;
				anyFound = false;

				if ( curLoop == result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					} else if ( match[0] === true ) {
						goodArray = [];
						var last = null, elem;
						for ( var i = 0; (elem = curLoop[i]) !== undefined; i++ ) {
							if ( elem && last !== elem ) {
								goodArray.push( elem );
								last = elem;
							}
						}
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) !== undefined; i++ ) {
						if ( item ) {
							if ( goodArray && item != goodArray[goodPos] ) {
								goodPos++;
							}
	
							found = filter( item, match, goodPos, goodArray );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		expr = expr.replace(/\s*,\s*/, "");

		// Improper expression
		if ( expr == old ) {
			if ( anyFound == null ) {
				throw "Syntax error, unrecognized expression: " + expr;
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
	},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part){
			for ( var i = 0, l = checkSet.length; i < l; i++ ) {
				var elem = checkSet[i];
				if ( elem ) {
					var cur = elem.previousSibling;
					while ( cur && cur.nodeType !== 1 ) {
						cur = cur.previousSibling;
					}
					checkSet[i] = typeof part === "string" ?
						cur || false :
						cur === part;
				}
			}

			if ( typeof part === "string" ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part, isXML){
			if ( typeof part === "string" && !/\W/.test(part) ) {
				part = isXML ? part : part.toUpperCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = typeof part === "string" ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( typeof part === "string" ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = "done" + (done++), checkFn = dirCheck;

			if ( !part.match(/\W/) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = "done" + (done++), checkFn = dirCheck;

			if ( typeof part === "string" && !part.match(/\W/) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context){
			if ( context.getElementById ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context){
			return context.getElementsByName ? context.getElementsByName(match[1]) : null;
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not){
			match = " " + match[1].replace(/\\/g, "") + " ";

			for ( var i = 0; curLoop[i]; i++ ) {
				if ( not ^ (" " + curLoop[i].className + " ").indexOf(match) >= 0 ) {
					if ( !inplace )
						result.push( curLoop[i] );
				} else if ( inplace ) {
					curLoop[i] = false;
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			for ( var i = 0; !curLoop[i]; i++ ){}
			return isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
		},
		CHILD: function(match){
			if ( match[1] == "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = "done" + (done++);

			return match;
		},
		ATTR: function(match){
			var name = match[1];
			
			if ( Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( match[3].match(chunker).length > 1 ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 == i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 == i;
		}
	},
	filter: {
		CHILD: function(elem, match){
			var type = match[1], parent = elem.parentNode;

			var doneName = "child" + parent.childNodes.length;
			
			if ( parent && (!parent[ doneName ] || !elem.nodeIndex) ) {
				var count = 1;

				for ( var node = parent.firstChild; node; node = node.nextSibling ) {
					if ( node.nodeType == 1 ) {
						node.nodeIndex = count++;
					}
				}

				parent[ doneName ] = count - 1;
			}

			if ( type == "first" ) {
				return elem.nodeIndex == 1;
			} else if ( type == "last" ) {
				return elem.nodeIndex == parent[ doneName ];
			} else if ( type == "only" ) {
				return parent[ doneName ] == 1;
			} else if ( type == "nth" ) {
				var add = false, first = match[2], last = match[3];

				if ( first == 1 && last == 0 ) {
					return true;
				}

				if ( first == 0 ) {
					if ( elem.nodeIndex == last ) {
						add = true;
					}
				} else if ( (elem.nodeIndex - last) % first == 0 && (elem.nodeIndex - last) / first >= 0 ) {
					add = true;
				}

				return add;
			}
		},
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
		},
		CLASS: function(elem, match){
			return match.test( elem.className );
		},
		ATTR: function(elem, match){
			var result = Expr.attrHandle[ match[1] ] ? Expr.attrHandle[ match[1] ]( elem ) : elem[ match[1] ] || elem.getAttribute( match[1] ), value = result + "", type = match[2], check = match[4];
			return result == null ?
				false :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!match[4] ?
				result :
				type === "!=" ?
				value != check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

for ( var type in Expr.match ) {
	Expr.match[ type ] = RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
try {
	Array.prototype.slice.call( document.documentElement.childNodes );

// Provide a fallback method if it does not work
} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("form"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<input name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( !!document.getElementById( id ) ) {
		Expr.find.ID = function(match, context){
			if ( context.getElementById ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || m.getAttributeNode && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = elem.getAttributeNode && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}
})();

if ( document.querySelectorAll ) (function(){
	var oldSizzle = Sizzle;
	
	Sizzle = function(query, context, extra, seed){
		context = context || document;

		if ( !seed && context.nodeType === 9 ) {
			try {
				return makeArray( context.querySelectorAll(query), extra );
			} catch(e){}
		}
		
		return oldSizzle(query, context, extra, seed);
	};

	Sizzle.find = oldSizzle.find;
	Sizzle.filter = oldSizzle.filter;
	Sizzle.selectors = oldSizzle.selectors;
	Sizzle.matches = oldSizzle.matches;
})();

if ( document.documentElement.getElementsByClassName ) {
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context) {
		return context.getElementsByClassName(match[1]);
	};
}

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem && elem.nodeType ) {
				var done = elem[doneName];
				if ( done ) {
					match = checkSet[ done ];
					break;
				}

				if ( elem.nodeType === 1 && !isXML )
					elem[doneName] = i;

				if ( elem.nodeName === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem && elem.nodeType ) {
				if ( elem[doneName] ) {
					match = checkSet[ elem[doneName] ];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML )
						elem[doneName] = i;

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ?  function(a, b){
	return a.compareDocumentPosition(b) & 16;
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	return elem.documentElement && !elem.body ||
		elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.filter = Sizzle.filter;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;

Sizzle.selectors.filters.hidden = function(elem){
	return "hidden" === elem.type ||
		jQuery.css(elem, "display") === "none" ||
		jQuery.css(elem, "visibility") === "hidden";
};

Sizzle.selectors.filters.visible = function(elem){
	return "hidden" !== elem.type &&
		jQuery.css(elem, "display") !== "none" &&
		jQuery.css(elem, "visibility") !== "hidden";
};

Sizzle.selectors.filters.animated = function(elem){
	return jQuery.grep(jQuery.timers, function(fn){
		return elem === fn.elem;
	}).length;
};

jQuery.multiFilter = function( expr, elems, not ) {
	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return Sizzle.matches(expr, elems);
};

jQuery.dir = function( elem, dir ){
	var matched = [], cur = elem[dir];
	while ( cur && cur != document ) {
		if ( cur.nodeType == 1 )
			matched.push( cur );
		cur = cur[dir];
	}
	return matched;
};

jQuery.nth = function(cur, result, dir, elem){
	result = result || 1;
	var num = 0;

	for ( ; cur; cur = cur[dir] )
		if ( cur.nodeType == 1 && ++num == result )
			break;

	return cur;
};

jQuery.sibling = function(n, elem){
	var r = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType == 1 && n != elem )
			r.push( n );
	}

	return r;
};

return;

window.Sizzle = Sizzle;

})();
/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function(elem, types, handler, data) {
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( elem.setInterval && elem != window )
			elem = window;

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid )
			handler.guid = this.guid++;

		// if data is passed, bind to handler
		if ( data !== undefined ) {
			// Create temporary function pointer to original handler
			var fn = handler;

			// Create unique handler function, wrapped around original handler
			handler = this.proxy( fn );

			// Store data in unique handler
			handler.data = data;
		}

		// Init the element's event structure
		var events = jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
			handle = jQuery.data(elem, "handle") || jQuery.data(elem, "handle", function(){
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply(arguments.callee.elem, arguments) :
					undefined;
			});
		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native
		// event in IE.
		handle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		jQuery.each(types.split(/\s+/), function(index, type) {
			// Namespaced event handlers
			var namespaces = type.split(".");
			type = namespaces.shift();
			handler.type = namespaces.slice().sort().join(".");

			// Get the current list of functions bound to this event
			var handlers = events[type];
			
			if ( jQuery.event.specialAll[type] )
				jQuery.event.specialAll[type].setup.call(elem, data, namespaces);

			// Init the event handler queue
			if (!handlers) {
				handlers = events[type] = {};

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem, data, namespaces) === false ) {
					// Bind the global event handler to the element
					if (elem.addEventListener)
						elem.addEventListener(type, handle, false);
					else if (elem.attachEvent)
						elem.attachEvent("on" + type, handle);
				}
			}

			// Add the function to the element's handler list
			handlers[handler.guid] = handler;

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[type] = true;
		});

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	guid: 1,
	global: {},

	// Detach an event or set of events from an element
	remove: function(elem, types, handler) {
		// don't do events on text and comment nodes
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		var events = jQuery.data(elem, "events"), ret, index;

		if ( events ) {
			// Unbind all events for the element
			if ( types === undefined || (typeof types === "string" && types.charAt(0) == ".") )
				for ( var type in events )
					this.remove( elem, type + (types || "") );
			else {
				// types is actually an event object here
				if ( types.type ) {
					handler = types.handler;
					types = types.type;
				}

				// Handle multiple events seperated by a space
				// jQuery(...).unbind("mouseover mouseout", fn);
				jQuery.each(types.split(/\s+/), function(index, type){
					// Namespaced event handlers
					var namespaces = type.split(".");
					type = namespaces.shift();
					var namespace = RegExp("(^|\\.)" + namespaces.slice().sort().join(".*\\.") + "(\\.|$)");

					if ( events[type] ) {
						// remove the given handler for the given type
						if ( handler )
							delete events[type][handler.guid];

						// remove all handlers for the given type
						else
							for ( var handle in events[type] )
								// Handle the removal of namespaced events
								if ( namespace.test(events[type][handle].type) )
									delete events[type][handle];
									
						if ( jQuery.event.specialAll[type] )
							jQuery.event.specialAll[type].teardown.call(elem, namespaces);

						// remove generic event handler if no more handlers exist
						for ( ret in events[type] ) break;
						if ( !ret ) {
							if ( !jQuery.event.special[type] || jQuery.event.special[type].teardown.call(elem, namespaces) === false ) {
								if (elem.removeEventListener)
									elem.removeEventListener(type, jQuery.data(elem, "handle"), false);
								else if (elem.detachEvent)
									elem.detachEvent("on" + type, jQuery.data(elem, "handle"));
							}
							ret = null;
							delete events[type];
						}
					}
				});
			}

			// Remove the expando if it's no longer used
			for ( ret in events ) break;
			if ( !ret ) {
				var handle = jQuery.data( elem, "handle" );
				if ( handle ) handle.elem = null;
				jQuery.removeData( elem, "events" );
				jQuery.removeData( elem, "handle" );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem, bubbling ) {
		// Event object or event type
		var type = event.type || event;

		if( !bubbling ){
			event = typeof event === "object" ?
				// jQuery.Event object
				event[expando] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();
				// Only trigger if we've ever bound an event for it
				if ( this.global[type] )
					jQuery.each( jQuery.cache, function(){
						if ( this.events && this.events[type] )
							jQuery.event.trigger( event, data, this.handle.elem );
					});
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType == 3 || elem.nodeType == 8 )
				return undefined;
			
			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;
			
			// Clone the incoming data, if any
			data = jQuery.makeArray(data);
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery.data(elem, "handle");
		if ( handle )
			handle.apply( elem, data );

		// Handle triggering native .onfoo handlers (and on links since we don't call .click() for links)
		if ( (!elem[type] || (jQuery.nodeName(elem, 'a') && type == "click")) && elem["on"+type] && elem["on"+type].apply( elem, data ) === false )
			event.result = false;

		// Trigger the native events (except for clicks on links)
		if ( !bubbling && elem[type] && !event.isDefaultPrevented() && !(jQuery.nodeName(elem, 'a') && type == "click") ) {
			this.triggered = true;
			try {
				elem[ type ]();
			// prevent IE from throwing an error for some hidden elements
			} catch (e) {}
		}

		this.triggered = false;

		if ( !event.isPropagationStopped() ) {
			var parent = elem.parentNode || elem.ownerDocument;
			if ( parent )
				jQuery.event.trigger(event, data, parent, true);
		}
	},

	handle: function(event) {
		// returned undefined or false
		var all, handlers;

		event = arguments[0] = jQuery.event.fix( event || window.event );

		// Namespaced event handlers
		var namespaces = event.type.split(".");
		event.type = namespaces.shift();

		// Cache this now, all = true means, any handler
		all = !namespaces.length && !event.exclusive;
		
		var namespace = RegExp("(^|\\.)" + namespaces.slice().sort().join(".*\\.") + "(\\.|$)");

		handlers = ( jQuery.data(this, "events") || {} )[event.type];

		for ( var j in handlers ) {
			var handler = handlers[j];

			// Filter the functions by class
			if ( all || namespace.test(handler.type) ) {
				// Pass in a reference to the handler function itself
				// So that we can later remove it
				event.handler = handler;
				event.data = handler.data;

				var ret = handler.apply(this, arguments);

				if( ret !== undefined ){
					event.result = ret;
					if ( ret === false ) {
						event.preventDefault();
						event.stopPropagation();
					}
				}

				if( event.isImmediatePropagationStopped() )
					break;

			}
		}
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function(event) {
		if ( event[expando] )
			return event;

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ){
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target )
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either

		// check if target is a textnode (safari)
		if ( event.target.nodeType == 3 )
			event.target = event.target.parentNode;

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement )
			event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
		}

		// Add which for key events
		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) )
			event.which = event.charCode || event.keyCode;

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey )
			event.metaKey = event.ctrlKey;

		// Add which for click: 1 == left; 2 == middle; 3 == right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button )
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));

		return event;
	},

	proxy: function( fn, proxy ){
		proxy = proxy || function(){ return fn.apply(this, arguments); };
		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || this.guid++;
		// So proxy can be declared as an argument
		return proxy;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: bindReady,
			teardown: function() {}
		}
	},
	
	specialAll: {
		live: {
			setup: function( selector, namespaces ){
				jQuery.event.add( this, namespaces[0], liveHandler );
			},
			teardown:  function( namespaces ){
				if ( namespaces.length ) {
					var remove = 0, name = RegExp("(^|\\.)" + namespaces[0] + "(\\.|$)");
					
					jQuery.each( (jQuery.data(this, "events").live || {}), function(){
						if ( name.test(this.type) )
							remove++;
					});
					
					if ( remove < 1 )
						jQuery.event.remove( this, namespaces[0], liveHandler );
				}
			}
		}
	}
};

jQuery.Event = function( src ){
	// Allow instantiation without the 'new' keyword
	if( !this.preventDefault )
		return new jQuery.Event(src);
	
	// Event object
	if( src && src.type ){
		this.originalEvent = src;
		this.type = src.type;
		this.timeStamp = src.timeStamp;
	// Event type
	}else
		this.type = src;

	if( !this.timeStamp )
		this.timeStamp = now();
	
	// Mark it as fixed
	this[expando] = true;
};

function returnFalse(){
	return false;
}
function returnTrue(){
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if( !e )
			return;
		// if preventDefault exists run it on the original event
		if (e.preventDefault)
			e.preventDefault();
		// otherwise set the returnValue property of the original event to false (IE)
		e.returnValue = false;
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if( !e )
			return;
		// if stopPropagation exists run it on the original event
		if (e.stopPropagation)
			e.stopPropagation();
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation:function(){
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};
// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function(event) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;
	// Traverse up the tree
	while ( parent && parent != this )
		try { parent = parent.parentNode; }
		catch(e) { parent = this; }
	
	if( parent != this ){
		// set the correct event type
		event.type = event.data;
		// handle event if we actually just moused on to a non sub-element
		jQuery.event.handle.apply( this, arguments );
	}
};
	
jQuery.each({ 
	mouseover: 'mouseenter', 
	mouseout: 'mouseleave'
}, function( orig, fix ){
	jQuery.event.special[ fix ] = {
		setup: function(){
			jQuery.event.add( this, orig, withinElement, fix );
		},
		teardown: function(){
			jQuery.event.remove( this, orig, withinElement );
		}
	};			   
});

jQuery.fn.extend({
	bind: function( type, data, fn ) {
		return type == "unload" ? this.one(type, data, fn) : this.each(function(){
			jQuery.event.add( this, type, fn || data, fn && data );
		});
	},

	one: function( type, data, fn ) {
		var one = jQuery.event.proxy( fn || data, function(event) {
			jQuery(this).unbind(event, one);
			return (fn || data).apply( this, arguments );
		});
		return this.each(function(){
			jQuery.event.add( this, type, one, fn && data);
		});
	},

	unbind: function( type, fn ) {
		return this.each(function(){
			jQuery.event.remove( this, type, fn );
		});
	},

	trigger: function( type, data ) {
		return this.each(function(){
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if( this[0] ){
			var event = jQuery.Event(type);
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}		
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments, i = 1;

		// link all the functions, so any of them can unbind this click handler
		while( i < args.length )
			jQuery.event.proxy( fn, args[i++] );

		return this.click( jQuery.event.proxy( fn, function(event) {
			// Figure out which function to execute
			this.lastToggle = ( this.lastToggle || 0 ) % i;

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ this.lastToggle++ ].apply( this, arguments ) || false;
		}));
	},

	hover: function(fnOver, fnOut) {
		return this.mouseenter(fnOver).mouseleave(fnOut);
	},

	ready: function(fn) {
		// Attach the listeners
		bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady )
			// Execute the function immediately
			fn.call( document, jQuery );

		// Otherwise, remember the function for later
		else
			// Add the function to the wait list
			jQuery.readyList.push( fn );

		return this;
	},
	
	live: function( type, fn ){
		var proxy = jQuery.event.proxy( fn );
		proxy.guid += this.selector + type;

		jQuery(document).bind( liveConvert(type, this.selector), this.selector, proxy );

		return this;
	},
	
	die: function( type, fn ){
		jQuery(document).unbind( liveConvert(type, this.selector), fn ? { guid: fn.guid + this.selector + type } : null );
		return this;
	}
});

function liveHandler( event ){
	var check = RegExp("(^|\\.)" + event.type + "(\\.|$)"),
		stop = true,
		elems = [];

	jQuery.each(jQuery.data(this, "events").live || [], function(i, fn){
		if ( check.test(fn.type) ) {
			var elem = jQuery(event.target).closest(fn.data)[0];
			if ( elem )
				elems.push({ elem: elem, fn: fn });
		}
	});

	jQuery.each(elems, function(){
		if ( !event.isImmediatePropagationStopped() &&
			this.fn.call(this.elem, event, this.fn.data) === false )
				stop = false;
	});

	return stop;
}

function liveConvert(type, selector){
	return ["live", type, selector.replace(/\./g, "`").replace(/ /g, "|")].join(".");
}

jQuery.extend({
	isReady: false,
	readyList: [],
	// Handle when the DOM is ready
	ready: function() {
		// Make sure that the DOM is not already loaded
		if ( !jQuery.isReady ) {
			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If there are functions bound, to execute
			if ( jQuery.readyList ) {
				// Execute all of them
				jQuery.each( jQuery.readyList, function(){
					this.call( document, jQuery );
				});

				// Reset the list of functions
				jQuery.readyList = null;
			}

			// Trigger any bound ready events
			jQuery(document).triggerHandler("ready");
		}
	}
});

var readyBound = false;

function bindReady(){
	if ( readyBound ) return;
	readyBound = true;

	// Mozilla, Opera and webkit nightlies currently support this event
	if ( document.addEventListener ) {
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", function(){
			document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
			jQuery.ready();
		}, false );

	// If IE event model is used
	} else if ( document.attachEvent ) {
		// ensure firing before onload,
		// maybe late but safe also for iframes
		document.attachEvent("onreadystatechange", function(){
			if ( document.readyState === "complete" ) {
				document.detachEvent( "onreadystatechange", arguments.callee );
				jQuery.ready();
			}
		});

		// If IE and not an iframe
		// continually check to see if the document is ready
		if ( document.documentElement.doScroll && !window.frameElement ) (function(){
			if ( jQuery.isReady ) return;

			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch( error ) {
				setTimeout( arguments.callee, 0 );
				return;
			}

			// and execute any waiting functions
			jQuery.ready();
		})();
	}

	// A fallback to window.onload, that will always work
	jQuery.event.add( window, "load", jQuery.ready );
}

jQuery.each( ("blur,focus,load,resize,scroll,unload,click,dblclick," +
	"mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave," +
	"change,select,submit,keydown,keypress,keyup,error").split(","), function(i, name){

	// Handle event binding
	jQuery.fn[name] = function(fn){
		return fn ? this.bind(name, fn) : this.trigger(name);
	};
});

// Prevent memory leaks in IE
// And prevent errors on refresh with events like mouseover in other browsers
// Window isn't included so as not to unbind existing unload events
jQuery( window ).bind( 'unload', function(){ 
	for ( var id in jQuery.cache )
		// Skip the window
		if ( id != 1 && jQuery.cache[ id ].handle )
			jQuery.event.remove( jQuery.cache[ id ].handle.elem );
}); 
(function(){

	jQuery.support = {};

	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + (new Date).getTime();

	div.style.display = "none";
	div.innerHTML = '   <link/><table></table><a href="/a" style="color:red;float:left;opacity:.5;">a</a><select><option>text</option></select><object><param/></object>';

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType == 3,
		
		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,
		
		// Make sure that you can get all elements in an <object> element
		// IE 7 always returns no results
		objectAll: !!div.getElementsByTagName("object")[0]
			.getElementsByTagName("*").length,
		
		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,
		
		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),
		
		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",
		
		// Make sure that element opacity exists
		// (IE uses filter instead)
		opacity: a.style.opacity === "0.5",
		
		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Will be defined later
		scriptEval: false,
		noCloneEvent: true,
		boxModel: null
	};
	
	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e){}

	root.insertBefore( script, root.firstChild );
	
	// Make sure that the execution of code works by injecting a script
	// tag with appendChild/createTextNode
	// (IE doesn't support this, fails, and uses .text instead)
	if ( window[ id ] ) {
		jQuery.support.scriptEval = true;
		delete window[ id ];
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function(){
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", arguments.callee);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function(){
		var div = document.createElement("div");
		div.style.width = "1px";
		div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;
		document.body.removeChild( div );
	});
})();

var styleFloat = jQuery.support.cssFloat ? "cssFloat" : "styleFloat";

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	"float": styleFloat,
	cssFloat: styleFloat,
	styleFloat: styleFloat,
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	tabindex: "tabIndex"
};
jQuery.fn.extend({
	// Keep a copy of the old load
	_load: jQuery.fn.load,

	load: function( url, params, callback ) {
		if ( typeof url !== "string" )
			return this._load( url );

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params )
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else if( typeof params === "object" ) {
				params = jQuery.param( params );
				type = "POST";
			}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function(res, status){
				// If successful, inject the HTML into all the matched elements
				if ( status == "success" || status == "notmodified" )
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div/>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(/<script(.|\s)*?\/script>/g, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );

				if( callback )
					self.each( callback, [res.responseText, status, res] );
			}
		});
		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				(this.checked || /select|textarea/i.test(this.nodeName) ||
					/text|hidden|password/i.test(this.type));
		})
		.map(function(i, elem){
			var val = jQuery(this).val();
			return val == null ? null :
				jQuery.isArray(val) ?
					jQuery.map( val, function(val, i){
						return {name: elem.name, value: val};
					}) :
					{name: elem.name, value: val};
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(i,o){
	jQuery.fn[o] = function(f){
		return this.bind(o, f);
	};
});

var jsc = now();

jQuery.extend({
  
	get: function( url, data, callback, type ) {
		// shift arguments if data argument was ommited
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		*/
		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7, so we use the ActiveXObject when it is available
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr:function(){
			return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	// Last-Modified header cache for next request
	lastModified: {},

	ajax: function( s ) {
		
		// Extend the settings, but re-extend 's' so that it can be
		// checked again later (in the test suite, specifically)
		s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));

		var jsonp, jsre = /=\?(&|$)/g, status, data,
			type = s.type.toUpperCase();

		// convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" )
			s.data = jQuery.param(s.data);

		// Handle JSONP Parameter Callbacks
		if ( s.dataType == "jsonp" ) {
			if ( type == "GET" ) {
				if ( !s.url.match(jsre) )
					s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?";
			} else if ( !s.data || !s.data.match(jsre) )
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			s.dataType = "json";
		}

		// Build temporary JSONP function
		if ( s.dataType == "json" && (s.data && s.data.match(jsre) || s.url.match(jsre)) ) {
			jsonp = "jsonp" + jsc++;

			// Replace the =? sequence both in the query string and the data
			if ( s.data )
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			// We need to make sure
			// that a JSONP style response is executed properly
			s.dataType = "script";

			// Handle JSONP-style loading
			window[ jsonp ] = function(tmp){
				data = tmp;
				success();
				complete();
				// Garbage collect
				window[ jsonp ] = undefined;
				try{ delete window[ jsonp ]; } catch(e){}
				if ( head )
					head.removeChild( script );
			};
		}

		if ( s.dataType == "script" && s.cache == null )
			s.cache = false;

		if ( s.cache === false && type == "GET" ) {
			var ts = now();
			// try replacing _= if it is there
			var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
			// if nothing was replaced, add timestamp to the end
			s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "");
		}

		// If data is available, append data to url for get requests
		if ( s.data && type == "GET" ) {
			s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;

			// IE likes to send both get and post data, prevent this
			s.data = null;
		}

		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ )
			jQuery.event.trigger( "ajaxStart" );

		// Matches an absolute URL, and saves the domain
		var parts = /^(\w+:)?\/\/([^\/?#]+)/.exec( s.url );

		// If we're requesting a remote document
		// and trying to load JSON or Script with a GET
		if ( s.dataType == "script" && type == "GET" && parts
			&& ( parts[1] && parts[1] != location.protocol || parts[2] != location.host )){

			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.src = s.url;
			if (s.scriptCharset)
				script.charset = s.scriptCharset;

			// Handle Script loading
			if ( !jsonp ) {
				var done = false;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function(){
					if ( !done && (!this.readyState ||
							this.readyState == "loaded" || this.readyState == "complete") ) {
						done = true;
						success();
						complete();
						head.removeChild( script );
					}
				};
			}

			head.appendChild(script);

			// We handle everything using the script element injection
			return undefined;
		}

		var requestDone = false;

		// Create the request object
		var xhr = s.xhr();
		
		// Open the socket
		// Passing null username, generates a login popup on Opera (#2865)
		if( s.username )
			xhr.open(type, s.url, s.async, s.username, s.password);
		else
			xhr.open(type, s.url, s.async);

		// Need an extra try/catch for cross domain requests in Firefox 3
		try {
			// Set the correct header, if data is being sent
			if ( s.data )
				xhr.setRequestHeader("Content-Type", s.contentType);

			// Set the If-Modified-Since header, if ifModified mode.
			if ( s.ifModified )
				xhr.setRequestHeader("If-Modified-Since",
					jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT" );

			// Set header so the called script knows that it's an XMLHttpRequest
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

			// Set the Accepts header for the server, depending on the dataType
			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e){}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && s.beforeSend(xhr, s) === false ) {
			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );
			// close opended socket
			xhr.abort();
			return false;
		}

		if ( s.global )
			jQuery.event.trigger("ajaxSend", [xhr, s]);

		// Wait for a response to come back
		var onreadystatechange = function(isTimeout){
			// The request was aborted, clear the interval and decrement jQuery.active
			if (xhr.readyState == 0) {
				if (ival) {
					// clear poll interval
					clearInterval(ival);
					ival = null;
					// Handle the global AJAX counter
					if ( s.global && ! --jQuery.active )
						jQuery.event.trigger( "ajaxStop" );
				}
			// The transfer is complete and the data is available, or the request timed out
			} else if ( !requestDone && xhr && (xhr.readyState == 4 || isTimeout == "timeout") ) {
				requestDone = true;

				// clear poll interval
				if (ival) {
					clearInterval(ival);
					ival = null;
				}

				status = isTimeout == "timeout" ? "timeout" :
					!jQuery.httpSuccess( xhr ) ? "error" :
					s.ifModified && jQuery.httpNotModified( xhr, s.url ) ? "notmodified" :
					"success";

				if ( status == "success" ) {
					// Watch for, and catch, XML document parse errors
					try {
						// process the data (runs the xml through httpData regardless of callback)
						data = jQuery.httpData( xhr, s.dataType, s );
					} catch(e) {
						status = "parsererror";
					}
				}

				// Make sure that the request was successful or notmodified
				if ( status == "success" ) {
					// Cache Last-Modified header, if ifModified mode.
					var modRes;
					try {
						modRes = xhr.getResponseHeader("Last-Modified");
					} catch(e) {} // swallow exception thrown by FF if header is not available

					if ( s.ifModified && modRes )
						jQuery.lastModified[s.url] = modRes;

					// JSONP handles its own success callback
					if ( !jsonp )
						success();
				} else
					jQuery.handleError(s, xhr, status);

				// Fire the complete handlers
				complete();

				// Stop memory leaks
				if ( s.async )
					xhr = null;
			}
		};

		if ( s.async ) {
			// don't attach the handler to the request, just poll it instead
			var ival = setInterval(onreadystatechange, 13);

			// Timeout checker
			if ( s.timeout > 0 )
				setTimeout(function(){
					// Check to see if the request is still happening
					if ( xhr ) {
						if( !requestDone )
							onreadystatechange( "timeout" );

						// Cancel the request
						if ( xhr )
							xhr.abort();
					}
				}, s.timeout);
		}

		// Send the data
		try {
			xhr.send(s.data);
		} catch(e) {
			jQuery.handleError(s, xhr, null, e);
		}

		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async )
			onreadystatechange();

		function success(){
			// If a local callback was specified, fire it and pass it the data
			if ( s.success )
				s.success( data, status );

			// Fire the global callback
			if ( s.global )
				jQuery.event.trigger( "ajaxSuccess", [xhr, s] );
		}

		function complete(){
			// Process result
			if ( s.complete )
				s.complete(xhr, status);

			// The request was completed
			if ( s.global )
				jQuery.event.trigger( "ajaxComplete", [xhr, s] );

			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );
		}

		// return XMLHttpRequest to allow aborting the request etc.
		return xhr;
	},

	handleError: function( s, xhr, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) s.error( xhr, status, e );

		// Fire the global callback
		if ( s.global )
			jQuery.event.trigger( "ajaxError", [xhr, s, e] );
	},

	// Counter for holding the number of active queries
	active: 0,

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( xhr ) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return !xhr.status && location.protocol == "file:" ||
				( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 || xhr.status == 1223;
		} catch(e){}
		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xhr, url ) {
		try {
			var xhrRes = xhr.getResponseHeader("Last-Modified");

			// Firefox always returns 200. check Last-Modified date
			return xhr.status == 304 || xhrRes == jQuery.lastModified[url];
		} catch(e){}
		return false;
	},

	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type"),
			xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.tagName == "parsererror" )
			throw "parsererror";
			
		// Allow a pre-filtering function to sanitize the response
		// s != null is checked to keep backwards compatibility
		if( s && s.dataFilter )
			data = s.dataFilter( data, type );

		// The filter can actually parse the response
		if( typeof data === "string" ){

			// If the type is "script", eval it in global context
			if ( type == "script" )
				jQuery.globalEval( data );

			// Get the JavaScript object, if JSON is used.
			if ( type == "json" )
				data = window["eval"]("(" + data + ")");
		}
		
		return data;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a ) {
		var s = [ ];

		function add( key, value ){
			s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
		};

		// If an array was passed in, assume that it is an array
		// of form elements
		if ( jQuery.isArray(a) || a.jquery )
			// Serialize the form elements
			jQuery.each( a, function(){
				add( this.name, this.value );
			});

		// Otherwise, assume that it's an object of key/value pairs
		else
			// Serialize the key/values
			for ( var j in a )
				// If the value is an array then the key names need to be repeated
				if ( jQuery.isArray(a[j]) )
					jQuery.each( a[j], function(){
						add( j, this );
					});
				else
					add( j, jQuery.isFunction(a[j]) ? a[j]() : a[j] );

		// Return the resulting serialization
		return s.join("&").replace(/%20/g, "+");
	}

});
var elemdisplay = {},
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

function genFx( type, num ){
	var obj = {};
	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function(){
		obj[ this ] = type;
	});
	return obj;
}

jQuery.fn.extend({
	show: function(speed,callback){
		if ( speed ) {
			return this.animate( genFx("show", 3), speed, callback);
		} else {
			for ( var i = 0, l = this.length; i < l; i++ ){
				var old = jQuery.data(this[i], "olddisplay");
				
				this[i].style.display = old || "";
				
				if ( jQuery.css(this[i], "display") === "none" ) {
					var tagName = this[i].tagName, display;
					
					if ( elemdisplay[ tagName ] ) {
						display = elemdisplay[ tagName ];
					} else {
						var elem = jQuery("<" + tagName + " />").appendTo("body");
						
						display = elem.css("display");
						if ( display === "none" )
							display = "block";
						
						elem.remove();
						
						elemdisplay[ tagName ] = display;
					}
					
					this[i].style.display = jQuery.data(this[i], "olddisplay", display);
				}
			}
			
			return this;
		}
	},

	hide: function(speed,callback){
		if ( speed ) {
			return this.animate( genFx("hide", 3), speed, callback);
		} else {
			for ( var i = 0, l = this.length; i < l; i++ ){
				var old = jQuery.data(this[i], "olddisplay");
				if ( !old && old !== "none" )
					jQuery.data(this[i], "olddisplay", jQuery.css(this[i], "display"));
				this[i].style.display = "none";
			}
			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ){
		var bool = typeof fn === "boolean";

		return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
			this._toggle.apply( this, arguments ) :
			fn == null || bool ?
				this.each(function(){
					var state = bool ? fn : jQuery(this).is(":hidden");
					jQuery(this)[ state ? "show" : "hide" ]();
				}) :
				this.animate(genFx("toggle", 3), fn, fn2);
	},

	fadeTo: function(speed,to,callback){
		return this.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		return this[ optall.queue === false ? "each" : "queue" ](function(){
		
			var opt = jQuery.extend({}, optall), p,
				hidden = this.nodeType == 1 && jQuery(this).is(":hidden"),
				self = this;
	
			for ( p in prop ) {
				if ( prop[p] == "hide" && hidden || prop[p] == "show" && !hidden )
					return opt.complete.call(this);

				if ( ( p == "height" || p == "width" ) && this.style ) {
					// Store display property
					opt.display = jQuery.css(this, "display");

					// Make sure that nothing sneaks out
					opt.overflow = this.style.overflow;
				}
			}

			if ( opt.overflow != null )
				this.style.overflow = "hidden";

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function(name, val){
				var e = new jQuery.fx( self, opt, name );

				if ( /toggle|show|hide/.test(val) )
					e[ val == "toggle" ? hidden ? "show" : "hide" : val ]( prop );
				else {
					var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat(parts[2]),
							unit = parts[3] || "px";

						// We need to compute starting value
						if ( unit != "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] )
							end = ((parts[1] == "-=" ? -1 : 1) * end) + start;

						e.custom( start, end, unit );
					} else
						e.custom( start, val, "" );
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function(clearQueue, gotoEnd){
		var timers = jQuery.timers;

		if (clearQueue)
			this.queue([]);

		this.each(function(){
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- )
				if ( timers[i].elem == this ) {
					if (gotoEnd)
						// force the next step to be the last
						timers[i](true);
					timers.splice(i, 1);
				}
		});

		// start the next in the queue if the last step wasn't forced
		if (!gotoEnd)
			this.dequeue();

		return this;
	}

});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" }
}, function( name, props ){
	jQuery.fn[ name ] = function( speed, callback ){
		return this.animate( props, speed, callback );
	};
});

jQuery.extend({

	speed: function(speed, easing, fn) {
		var opt = typeof speed === "object" ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			jQuery.fx.speeds[opt.duration] || jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function(){
			if ( opt.queue !== false )
				jQuery(this).dequeue();
			if ( jQuery.isFunction( opt.old ) )
				opt.old.call( this );
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],
	timerId: null,

	fx: function( elem, options, prop ){
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig )
			options.orig = {};
	}

});

jQuery.fx.prototype = {

	// Simple function for setting a style value
	update: function(){
		if ( this.options.step )
			this.options.step.call( this.elem, this.now, this );

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		// Set display property to block for height/width animations
		if ( ( this.prop == "height" || this.prop == "width" ) && this.elem.style )
			this.elem.style.display = "block";
	},

	// Get the current size
	cur: function(force){
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) )
			return this.elem[ this.prop ];

		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	// Start an animation from one number to another
	custom: function(from, to, unit){
		this.startTime = now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		var self = this;
		function t(gotoEnd){
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		jQuery.timers.push(t);

		if ( t() && jQuery.timerId == null ) {
			jQuery.timerId = setInterval(function(){
				var timers = jQuery.timers;

				for ( var i = 0; i < timers.length; i++ )
					if ( !timers[i]() )
						timers.splice(i--, 1);

				if ( !timers.length ) {
					clearInterval( jQuery.timerId );
					jQuery.timerId = null;
				}
			}, 13);
		}
	},

	// Simple 'show' function
	show: function(){
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop == "width" || this.prop == "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery(this.elem).show();
	},

	// Simple 'hide' function
	hide: function(){
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function(gotoEnd){
		var t = now();

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			var done = true;
			for ( var i in this.options.curAnim )
				if ( this.options.curAnim[i] !== true )
					done = false;

			if ( done ) {
				if ( this.options.display != null ) {
					// Reset the overflow
					this.elem.style.overflow = this.options.overflow;

					// Reset the display
					this.elem.style.display = this.options.display;
					if ( jQuery.css(this.elem, "display") == "none" )
						this.elem.style.display = "block";
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide )
					jQuery(this.elem).hide();

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show )
					for ( var p in this.options.curAnim )
						jQuery.attr(this.elem.style, p, this.options.orig[p]);
			}

			if ( done )
				// Execute the complete function
				this.options.complete.call( this.elem );

			return false;
		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}

};

jQuery.extend( jQuery.fx, {
	speeds:{
		slow: 600,
 		fast: 200,
 		// Default speed
 		_default: 400
	},
	step: {

		opacity: function(fx){
			jQuery.attr(fx.elem.style, "opacity", fx.now);
		},

		_default: function(fx){
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null )
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			else
				fx.elem[ fx.prop ] = fx.now;
		}
	}
});
if ( document.documentElement["getBoundingClientRect"] )
	jQuery.fn.offset = function() {
		if ( !this[0] ) return { top: 0, left: 0 };
		if ( this[0] === this[0].ownerDocument.body ) return jQuery.offset.bodyOffset( this[0] );
		var box  = this[0].getBoundingClientRect(), doc = this[0].ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top  = box.top  + (self.pageYOffset || jQuery.boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
			left = box.left + (self.pageXOffset || jQuery.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;
		return { top: top, left: left };
	};
else 
	jQuery.fn.offset = function() {
		if ( !this[0] ) return { top: 0, left: 0 };
		if ( this[0] === this[0].ownerDocument.body ) return jQuery.offset.bodyOffset( this[0] );
		jQuery.offset.initialized || jQuery.offset.initialize();

		var elem = this[0], offsetParent = elem.offsetParent, prevOffsetParent = elem,
			doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
			body = doc.body, defaultView = doc.defaultView,
			prevComputedStyle = defaultView.getComputedStyle(elem, null),
			top = elem.offsetTop, left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			computedStyle = defaultView.getComputedStyle(elem, null);
			top -= elem.scrollTop, left -= elem.scrollLeft;
			if ( elem === offsetParent ) {
				top += elem.offsetTop, left += elem.offsetLeft;
				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.tagName)) )
					top  += parseInt( computedStyle.borderTopWidth,  10) || 0,
					left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
				prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
			}
			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" )
				top  += parseInt( computedStyle.borderTopWidth,  10) || 0,
				left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" )
			top  += body.offsetTop,
			left += body.offsetLeft;

		if ( prevComputedStyle.position === "fixed" )
			top  += Math.max(docElem.scrollTop, body.scrollTop),
			left += Math.max(docElem.scrollLeft, body.scrollLeft);

		return { top: top, left: left };
	};

jQuery.offset = {
	initialize: function() {
		if ( this.initialized ) return;
		var body = document.body, container = document.createElement('div'), innerDiv, checkDiv, table, td, rules, prop, bodyMarginTop = body.style.marginTop,
			html = '<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"cellpadding="0"cellspacing="0"><tr><td></td></tr></table>';

		rules = { position: 'absolute', top: 0, left: 0, margin: 0, border: 0, width: '1px', height: '1px', visibility: 'hidden' };
		for ( prop in rules ) container.style[prop] = rules[prop];

		container.innerHTML = html;
		body.insertBefore(container, body.firstChild);
		innerDiv = container.firstChild, checkDiv = innerDiv.firstChild, td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		innerDiv.style.overflow = 'hidden', innerDiv.style.position = 'relative';
		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		body.style.marginTop = '1px';
		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop === 0);
		body.style.marginTop = bodyMarginTop;

		body.removeChild(container);
		this.initialized = true;
	},

	bodyOffset: function(body) {
		jQuery.offset.initialized || jQuery.offset.initialize();
		var top = body.offsetTop, left = body.offsetLeft;
		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset )
			top  += parseInt( jQuery.curCSS(body, 'marginTop',  true), 10 ) || 0,
			left += parseInt( jQuery.curCSS(body, 'marginLeft', true), 10 ) || 0;
		return { top: top, left: left };
	}
};


jQuery.fn.extend({
	position: function() {
		var left = 0, top = 0, results;

		if ( this[0] ) {
			// Get *real* offsetParent
			var offsetParent = this.offsetParent(),

			// Get correct offsets
			offset       = this.offset(),
			parentOffset = /^body|html$/i.test(offsetParent[0].tagName) ? { top: 0, left: 0 } : offsetParent.offset();

			// Subtract element margins
			// note: when an element has margin: auto the offsetLeft and marginLeft 
			// are the same in Safari causing offset.left to incorrectly be 0
			offset.top  -= num( this, 'marginTop'  );
			offset.left -= num( this, 'marginLeft' );

			// Add offsetParent borders
			parentOffset.top  += num( offsetParent, 'borderTopWidth'  );
			parentOffset.left += num( offsetParent, 'borderLeftWidth' );

			// Subtract the two offsets
			results = {
				top:  offset.top  - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		}

		return results;
	},

	offsetParent: function() {
		var offsetParent = this[0].offsetParent || document.body;
		while ( offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && jQuery.css(offsetParent, 'position') == 'static') )
			offsetParent = offsetParent.offsetParent;
		return jQuery(offsetParent);
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ['Left', 'Top'], function(i, name) {
	var method = 'scroll' + name;
	
	jQuery.fn[ method ] = function(val) {
		if (!this[0]) return null;

		return val !== undefined ?

			// Set the scroll offset
			this.each(function() {
				this == window || this == document ?
					window.scrollTo(
						!i ? val : jQuery(window).scrollLeft(),
						 i ? val : jQuery(window).scrollTop()
					) :
					this[ method ] = val;
			}) :

			// Return the scroll offset
			this[0] == window || this[0] == document ?
				self[ i ? 'pageYOffset' : 'pageXOffset' ] ||
					jQuery.boxModel && document.documentElement[ method ] ||
					document.body[ method ] :
				this[0][ method ];
	};
});
// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function(i, name){

	var tl = i ? "Left"  : "Top",  // top or left
		br = i ? "Right" : "Bottom"; // bottom or right

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function(){
		return this[ name.toLowerCase() ]() +
			num(this, "padding" + tl) +
			num(this, "padding" + br);
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function(margin) {
		return this["inner" + name]() +
			num(this, "border" + tl + "Width") +
			num(this, "border" + br + "Width") +
			(margin ?
				num(this, "margin" + tl) + num(this, "margin" + br) : 0);
	};
	
	var type = name.toLowerCase();

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		return this[0] == window ?
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			document.compatMode == "CSS1Compat" && document.documentElement[ "client" + name ] ||
			document.body[ "client" + name ] :

			// Get document width or height
			this[0] == document ?
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				Math.max(
					document.documentElement["client" + name],
					document.body["scroll" + name], document.documentElement["scroll" + name],
					document.body["offset" + name], document.documentElement["offset" + name]
				) :

				// Get or set width or height on the element
				size === undefined ?
					// Get width or height on the element
					(this.length ? jQuery.css( this[0], type ) : null) :

					// Set the width or height on the element (default to pixels if value is unitless)
					this.css( type, typeof size === "string" ? size : size + "px" );
	};

});})();

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* jquery-ui.js */

/*
 * jQuery UI 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI
 */
;(function($) {

var _remove = $.fn.remove,
	isFF2 = $.browser.mozilla && (parseFloat($.browser.version) < 1.9);

//Helper functions and ui object
$.ui = {
	version: "1.6rc5",

	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function(module, option, set) {
			var proto = $.ui[module].prototype;
			for(var i in set) {
				proto.plugins[i] = proto.plugins[i] || [];
				proto.plugins[i].push([option, set[i]]);
			}
		},
		call: function(instance, name, args) {
			var set = instance.plugins[name];
			if(!set) { return; }

			for (var i = 0; i < set.length; i++) {
				if (instance.options[set[i][0]]) {
					set[i][1].apply(instance.element, args);
				}
			}
		}
	},

	contains: function(a, b) {
		return document.compareDocumentPosition
			? a.compareDocumentPosition(b) & 16
			: a !== b && a.contains(b);
	},

	cssCache: {},
	css: function(name) {
		if ($.ui.cssCache[name]) { return $.ui.cssCache[name]; }
		var tmp = $('<div class="ui-gen"></div>').addClass(name).css({position:'absolute', top:'-5000px', left:'-5000px', display:'block'}).appendTo('body');

		//if (!$.browser.safari)
			//tmp.appendTo('body');

		//Opera and Safari set width and height to 0px instead of auto
		//Safari returns rgba(0,0,0,0) when bgcolor is not set
		$.ui.cssCache[name] = !!(
			(!(/auto|default/).test(tmp.css('cursor')) || (/^[1-9]/).test(tmp.css('height')) || (/^[1-9]/).test(tmp.css('width')) ||
			!(/none/).test(tmp.css('backgroundImage')) || !(/transparent|rgba\(0, 0, 0, 0\)/).test(tmp.css('backgroundColor')))
		);
		try { $('body').get(0).removeChild(tmp.get(0));	} catch(e){}
		return $.ui.cssCache[name];
	},

	hasScroll: function(el, a) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ($(el).css('overflow') == 'hidden') { return false; }

		var scroll = (a && a == 'left') ? 'scrollLeft' : 'scrollTop',
			has = false;

		if (el[scroll] > 0) { return true; }

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[scroll] = 1;
		has = (el[scroll] > 0);
		el[scroll] = 0;
		return has;
	},

	isOverAxis: function(x, reference, size) {
		//Determines when x coordinate is over "b" element axis
		return (x > reference) && (x < (reference + size));
	},

	isOver: function(y, x, top, left, height, width) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis(y, top, height) && $.ui.isOverAxis(x, left, width);
	},

	keyCode: {
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
};

// WAI-ARIA normalization
if (isFF2) {
	var attr = $.attr,
		removeAttr = $.fn.removeAttr,
		ariaNS = "http://www.w3.org/2005/07/aaa",
		ariaState = /^aria-/,
		ariaRole = /^wairole:/;

	$.attr = function(elem, name, value) {
		var set = value !== undefined;

		return (name == 'role'
			? (set
				? attr.call(this, elem, name, "wairole:" + value)
				: (attr.apply(this, arguments) || "").replace(ariaRole, ""))
			: (ariaState.test(name)
				? (set
					? elem.setAttributeNS(ariaNS,
						name.replace(ariaState, "aaa:"), value)
					: attr.call(this, elem, name.replace(ariaState, "aaa:")))
				: attr.apply(this, arguments)));
	};

	$.fn.removeAttr = function(name) {
		return (ariaState.test(name)
			? this.each(function() {
				this.removeAttributeNS(ariaNS, name.replace(ariaState, ""));
			}) : removeAttr.call(this, name));
	};
}

//jQuery plugins
$.fn.extend({
	remove: function() {
		// Safari has a native remove event which actually removes DOM elements,
		// so we have to use triggerHandler instead of trigger (#3037).
		$("*", this).add(this).each(function() {
			$(this).triggerHandler("remove");
		});
		return _remove.apply(this, arguments );
	},

	enableSelection: function() {
		return this
			.attr('unselectable', 'off')
			.css('MozUserSelect', '')
			.unbind('selectstart.ui');
	},

	disableSelection: function() {
		return this
			.attr('unselectable', 'on')
			.css('MozUserSelect', 'none')
			.bind('selectstart.ui', function() { return false; });
	},

	scrollParent: function() {
		var scrollParent;
		if(($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	}
});


//Additional selectors
$.extend($.expr[':'], {
	data: function(elem, i, match) {
		return !!$.data(elem, match[3]);
	},

	// TODO: add support for object, area
	tabbable: function(elem) {
		var nodeName = elem.nodeName.toLowerCase();
		function isVisible(element) {
			return !($(element).is(':hidden') || $(element).parents(':hidden').length);
		}

		return (
			// in tab order
			elem.tabIndex >= 0 &&

			( // filter node types that participate in the tab order

				// anchor tag
				('a' == nodeName && elem.href) ||

				// enabled form element
				(/input|select|textarea|button/.test(nodeName) &&
					'hidden' != elem.type && !elem.disabled)
			) &&

			// visible on page
			isVisible(elem)
		);
	}
});


// $.widget is a factory to create jQuery plugins
// taking some boilerplate code out of the plugin code
function getter(namespace, plugin, method, args) {
	function getMethods(type) {
		var methods = $[namespace][plugin][type] || [];
		return (typeof methods == 'string' ? methods.split(/,?\s+/) : methods);
	}

	var methods = getMethods('getter');
	if (args.length == 1 && typeof args[0] == 'string') {
		methods = methods.concat(getMethods('getterSetter'));
	}
	return ($.inArray(method, methods) != -1);
}

$.widget = function(name, prototype) {
	var namespace = name.split(".")[0];
	name = name.split(".")[1];

	// create plugin method
	$.fn[name] = function(options) {
		var isMethodCall = (typeof options == 'string'),
			args = Array.prototype.slice.call(arguments, 1);

		// prevent calls to internal methods
		if (isMethodCall && options.substring(0, 1) == '_') {
			return this;
		}

		// handle getter methods
		if (isMethodCall && getter(namespace, name, options, args)) {
			var instance = $.data(this[0], name);
			return (instance ? instance[options].apply(instance, args)
				: undefined);
		}

		// handle initialization and non-getter methods
		return this.each(function() {
			var instance = $.data(this, name);

			// constructor
			(!instance && !isMethodCall &&
				$.data(this, name, new $[namespace][name](this, options)));

			// method call
			(instance && isMethodCall && $.isFunction(instance[options]) &&
				instance[options].apply(instance, args));
		});
	};

	// create widget constructor
	$[namespace] = $[namespace] || {};
	$[namespace][name] = function(element, options) {
		var self = this;

		this.namespace = namespace;
		this.widgetName = name;
		this.widgetEventPrefix = $[namespace][name].eventPrefix || name;
		this.widgetBaseClass = namespace + '-' + name;

		this.options = $.extend({},
			$.widget.defaults,
			$[namespace][name].defaults,
			$.metadata && $.metadata.get(element)[name],
			options);

		this.element = $(element)
			.bind('setData.' + name, function(event, key, value) {
				if (event.target == element) {
					return self._setData(key, value);
				}
			})
			.bind('getData.' + name, function(event, key) {
				if (event.target == element) {
					return self._getData(key);
				}
			})
			.bind('remove', function() {
				return self.destroy();
			});

		this._init();
	};

	// add widget prototype
	$[namespace][name].prototype = $.extend({}, $.widget.prototype, prototype);

	// TODO: merge getter and getterSetter properties from widget prototype
	// and plugin prototype
	$[namespace][name].getterSetter = 'option';
};

$.widget.prototype = {
	_init: function() {},
	destroy: function() {
		this.element.removeData(this.widgetName)
			.removeClass(this.widgetBaseClass + '-disabled' + ' ' + this.namespace + '-state-disabled')
			.removeAttr('aria-disabled');
	},

	option: function(key, value) {
		var options = key,
			self = this;

		if (typeof key == "string") {
			if (value === undefined) {
				return this._getData(key);
			}
			options = {};
			options[key] = value;
		}

		$.each(options, function(key, value) {
			self._setData(key, value);
		});
	},
	_getData: function(key) {
		return this.options[key];
	},
	_setData: function(key, value) {
		this.options[key] = value;

		if (key == 'disabled') {
			this.element
				[value ? 'addClass' : 'removeClass'](
					this.widgetBaseClass + '-disabled' + ' ' +
					this.namespace + '-state-disabled')
				.attr("aria-disabled", value);
		}
	},

	enable: function() {
		this._setData('disabled', false);
	},
	disable: function() {
		this._setData('disabled', true);
	},

	_trigger: function(type, event, data) {
		var callback = this.options[type],
			eventName = (type == this.widgetEventPrefix
				? type : this.widgetEventPrefix + type);

		event = $.Event(event);
		event.type = eventName;

		this.element.trigger(event, data);

		return !($.isFunction(callback) && callback.call(this.element[0], event, data) === false
			|| event.isDefaultPrevented());
	}
};

$.widget.defaults = {
	disabled: false
};


/** Mouse Interaction Plugin **/

$.ui.mouse = {
	_mouseInit: function() {
		var self = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return self._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if(self._preventClickEvent) {
					self._preventClickEvent = false;
					return false;
				}
			});

		// Prevent text selection in IE
		if ($.browser.msie) {
			this._mouseUnselectable = this.element.attr('unselectable');
			this.element.attr('unselectable', 'on');
		}

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);

		// Restore text selection in IE
		($.browser.msie
			&& this.element.attr('unselectable', this._mouseUnselectable));
	},

	_mouseDown: function(event) {
		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var self = this,
			btnIsLeft = (event.which == 1),
			elIsCancel = (typeof this.options.cancel == "string" ? $(event.target).parents().add(event.target).filter(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				self.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return self._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return self._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		// preventDefault() is used to prevent the selection of text here -
		// however, in Safari, this causes select boxes not to be selectable
		// anymore, so this fix is needed
		($.browser.safari || event.preventDefault());
		
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.browser.msie && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;
			this._preventClickEvent = true;
			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
};

$.ui.mouse.defaults = {
	cancel: null,
	distance: 1,
	delay: 0
};

})(jQuery);
/*
 * jQuery UI Draggable 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.draggable", $.extend({}, $.ui.mouse, {

	_init: function() {

		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
			this.element[0].style.position = 'relative';

		(this.options.cssNamespace && this.element.addClass(this.options.cssNamespace+"-draggable"));
		(this.options.disabled && this.element.addClass(this.options.cssNamespace+'-draggable-disabled'));

		this._mouseInit();

	},

	destroy: function() {
		if(!this.element.data('draggable')) return;
		this.element.removeData("draggable").unbind(".draggable").removeClass(this.options.cssNamespace+'-draggable '+this.options.cssNamespace+'-draggable-dragging '+this.options.cssNamespace+'-draggable-disabled');
		this._mouseDestroy();
	},

	_mouseCapture: function(event) {

		var o = this.options;

		if (this.helper || o.disabled || $(event.target).is('.'+this.options.cssNamespace+'-resizable-handle'))
			return false;

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle)
			return false;

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		if(o.cursorAt)
			this._adjustOffsetFromHelper(o.cursorAt);

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		//Call plugins and callbacks
		this._trigger("start", event);

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.helper.addClass(o.cssNamespace+"-draggable-dragging");
		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;
	},

	_mouseDrag: function(event, noPropagation) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			this._trigger('drag', event, ui);
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			dropped = $.ui.ddmanager.drop(this, event);
		
		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			var self = this;
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				self._trigger("stop", event);
				self._clear();
			});
		} else {
			this._trigger("stop", event);
			this._clear();
		}

		return false;
	},

	_getHandle: function(event) {

		var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
		$(this.options.handle, this.element)
			.find("*")
			.andSelf()
			.each(function() {
				if(this == event.target) handle = true;
			});

		return handle;

	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone() : this.element);

		if(!helper.parents('body').length)
			helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

		if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
			helper.css("position", "absolute");

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if(obj.left != undefined) this.offset.click.left = obj.left + this.margins.left;
		if(obj.right != undefined) this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		if(obj.top != undefined) this.offset.click.top = obj.top + this.margins.top;
		if(obj.bottom != undefined) this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();
		
		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body && $.browser.mozilla)	//Ugly FF3 fix
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			0 - this.offset.relative.left - this.offset.parent.left,
			0 - this.offset.relative.top - this.offset.parent.top,
			$(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			var ce = $(o.containment)[0];
			var co = $(o.containment).offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod
			)
		};
		
	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}
		
		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */
		 
		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
			}
			
			if(o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) )
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() )
			)
		};

	},

	_clear: function() {
		this.helper.removeClass(this.options.cssNamespace+"-draggable-dragging");
		if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
		//if($.ui.ddmanager) $.ui.ddmanager.current = null;
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
		return $.widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function(event) {
		return {
			helper: this.helper,
			position: this.position,
			absolutePosition: this.positionAbs,
			options: this.options
		};
	}

}));

$.extend($.ui.draggable, {
	version: "1.6rc5",
	eventPrefix: "drag",
	defaults: {
		appendTo: "parent",
		axis: false,
		cancel: ":input,option",
		connectToSortable: false,
		containment: false,
		cssNamespace: "ui",
		cursor: "default",
		cursorAt: null,
		delay: 0,
		distance: 1,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: null,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: null
	}
});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("draggable");
		inst.sortables = [];
		$(ui.options.connectToSortable).each(function() {
			// 'this' points to a string, and should therefore resolved as query, but instead, if the string is assigned to a variable, it loops through the strings properties,
			// so we have to append '' to make it anonymous again
			$(this+'').each(function() {
				if($.data(this, 'sortable')) {
					var sortable = $.data(this, 'sortable');
					inst.sortables.push({
						instance: sortable,
						shouldRevert: sortable.options.revert
					});
					sortable._refreshItems();	//Do a one-time refresh at start to refresh the containerCache
					sortable._trigger("activate", event, inst);
				}
			});
		});

	},
	stop: function(event, ui) {

		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
		var inst = $(this).data("draggable");

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {
				
				this.instance.isOver = 0;
				
				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)
				
				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
				if(this.shouldRevert) this.instance.options.revert = true;
				
				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				//Also propagate receive event, since the sortable is actually receiving a element
				this.instance.element.triggerHandler("sortreceive", [event, $.extend(this.instance._uiHash(), { sender: inst.element })], this.instance.options["receive"]);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper == 'original')
					this.instance.currentItem.css({ top: 'auto', left: 'auto' });

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, inst);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), self = this;

		var checkPos = function(o) {
			var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
			var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
			var itemHeight = o.height, itemWidth = o.width;
			var itemTop = o.top, itemLeft = o.left;

			return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
		};

		$.each(inst.sortables, function(i) {

			if(checkPos.call(inst, this.instance.containerCache)) {

				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {
					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(self).clone().appendTo(this.instance.element).data("sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					this.instance.fromOutside = true; //Little hack so receive/update callbacks work

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) this.instance._mouseDrag(event);

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {
					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;
					this.instance.options.revert = false; //No revert here
					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) this.instance.placeholder.remove();

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			};

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function(event, ui) {
		var t = $('body');
		if (t.css("cursor")) ui.options._cursor = t.css("cursor");
		t.css("cursor", ui.options.cursor);
	},
	stop: function(event, ui) {
		if (ui.options._cursor) $('body').css("cursor", ui.options._cursor);
	}
});

$.ui.plugin.add("draggable", "iframeFix", {
	start: function(event, ui) {
		$(ui.options.iframeFix === true ? "iframe" : ui.options.iframeFix).each(function() {
			$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
			.css({
				width: this.offsetWidth+"px", height: this.offsetHeight+"px",
				position: "absolute", opacity: "0.001", zIndex: 1000
			})
			.css($(this).offset())
			.appendTo("body");
		});
	},
	stop: function(event, ui) {
		$("div.ui-draggable-iframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper);
		if(t.css("opacity")) ui.options._opacity = t.css("opacity");
		t.css('opacity', ui.options.opacity);
	},
	stop: function(event, ui) {
		if(ui.options._opacity) $(ui.helper).css('opacity', ui.options._opacity);
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function(event, ui) {
		var o = ui.options;
		var i = $(this).data("draggable");

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();

	},
	drag: function(event, ui) {

		var o = ui.options, scrolled = false;
		var i = $(this).data("draggable");

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
				i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
			else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
				i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;

			if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
				i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
			else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
				i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;

		} else {

			if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
				scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
			else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
				scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);

			if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
				scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
			else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
				scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(i, event);

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function(event, ui) {

		var inst = $(this).data("draggable");
		inst.snapElements = [];

		$(ui.options.snap.constructor != String ? ( ui.options.snap.items || ':data(draggable)' ) : ui.options.snap).each(function() {
			var $t = $(this); var $o = $t.offset();
			if(this != inst.element[0]) inst.snapElements.push({
				item: this,
				width: $t.outerWidth(), height: $t.outerHeight(),
				top: $o.top, left: $o.left
			});
		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable");
		var d = ui.options.snapTolerance;

		var x1 = ui.absolutePosition.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.absolutePosition.top, y2 = y1 + inst.helperProportions.height;

		for (var i = inst.snapElements.length - 1; i >= 0; i--){

			var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
				t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

			//Yes, I know, this is insane ;)
			if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
				if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(ui.options.snapMode != 'inner') {
				var ts = Math.abs(t - y2) <= d;
				var bs = Math.abs(b - y1) <= d;
				var ls = Math.abs(l - x2) <= d;
				var rs = Math.abs(r - x1) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left;
			}

			var first = (ts || bs || ls || rs);

			if(ui.options.snapMode != 'outer') {
				var ts = Math.abs(t - y1) <= d;
				var bs = Math.abs(b - y2) <= d;
				var ls = Math.abs(l - x1) <= d;
				var rs = Math.abs(r - x2) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left;
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		};

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function(event, ui) {
		var group = $.makeArray($(ui.options.stack.group)).sort(function(a,b) {
			return (parseInt($(a).css("zIndex"),10) || ui.options.stack.min) - (parseInt($(b).css("zIndex"),10) || ui.options.stack.min);
		});

		$(group).each(function(i) {
			this.style.zIndex = ui.options.stack.min + i;
		});

		this[0].style.zIndex = ui.options.stack.min + group.length;
	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper);
		if(t.css("zIndex")) ui.options._zIndex = t.css("zIndex");
		t.css('zIndex', ui.options.zIndex);
	},
	stop: function(event, ui) {
		if(ui.options._zIndex) $(ui.helper).css('zIndex', ui.options._zIndex);
	}
});

})(jQuery);
/*
 * jQuery UI Droppable 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Droppables
 *
 * Depends:
 *	ui.core.js
 *	ui.draggable.js
 */
(function($) {

$.widget("ui.droppable", {

	_init: function() {

		var o = this.options, accept = o.accept;
		this.isover = 0; this.isout = 1;

		this.options.accept = this.options.accept && $.isFunction(this.options.accept) ? this.options.accept : function(d) {
			return d.is(accept);
		};

		//Store the droppable's proportions
		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[this.options.scope] = $.ui.ddmanager.droppables[this.options.scope] || [];
		$.ui.ddmanager.droppables[this.options.scope].push(this);

		(this.options.cssNamespace && this.element.addClass(this.options.cssNamespace+"-droppable"));

	},

	destroy: function() {
		var drop = $.ui.ddmanager.droppables[this.options.scope];
		for ( var i = 0; i < drop.length; i++ )
			if ( drop[i] == this )
				drop.splice(i, 1);

		this.element
			.removeClass(this.options.cssNamespace+"-droppable "+this.options.cssNamespace+"-droppable-disabled")
			.removeData("droppable")
			.unbind(".droppable");
	},

	_setData: function(key, value) {

		if(key == 'accept') {
			this.options.accept = value && $.isFunction(value) ? value : function(d) {
				return d.is(accept);
			};
		} else {
			$.widget.prototype._setData.apply(this, arguments);
		}

	},

	_activate: function(event) {

		var draggable = $.ui.ddmanager.current;
		$.ui.plugin.call(this, 'activate', [event, this.ui(draggable)]);
		(draggable && this._trigger('activate', event, this.ui(draggable)));

	},

	_deactivate: function(event) {

		var draggable = $.ui.ddmanager.current;
		$.ui.plugin.call(this, 'deactivate', [event, this.ui(draggable)]);
		(draggable && this._trigger('deactivate', event, this.ui(draggable)));

	},

	_over: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.options.accept.call(this.element,(draggable.currentItem || draggable.element))) {
			$.ui.plugin.call(this, 'over', [event, this.ui(draggable)]);
			this._trigger('over', event, this.ui(draggable));
		}

	},

	_out: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.options.accept.call(this.element,(draggable.currentItem || draggable.element))) {
			$.ui.plugin.call(this, 'out', [event, this.ui(draggable)]);
			this._trigger('out', event, this.ui(draggable));
		}

	},

	_drop: function(event,custom) {

		var draggable = custom || $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return false; // Bail if draggable and droppable are same element

		var childrenIntersection = false;
		this.element.find(":data(droppable)").not("."+draggable.options.cssNamespace+"-draggable-dragging").each(function() {
			var inst = $.data(this, 'droppable');
			if(inst.options.greedy && $.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance)) {
				childrenIntersection = true; return false;
			}
		});
		if(childrenIntersection) return false;

		if(this.options.accept.call(this.element,(draggable.currentItem || draggable.element))) {
			$.ui.plugin.call(this, 'drop', [event, this.ui(draggable)]);
			this._trigger('drop', event, this.ui(draggable));
			return this.element;
		}

		return false;

	},

	plugins: {},

	ui: function(c) {
		return {
			draggable: (c.currentItem || c.element),
			helper: c.helper,
			position: c.position,
			absolutePosition: c.positionAbs,
			options: this.options,
			element: this.element
		};
	}

});

$.extend($.ui.droppable, {
	version: "1.6rc5",
	eventPrefix: 'drop',
	defaults: {
		accept: '*',
		activeClass: null,
		cssNamespace: 'ui',
		greedy: false,
		hoverClass: null,
		scope: 'default',
		tolerance: 'intersect'
	}
});

$.ui.intersect = function(draggable, droppable, toleranceMode) {

	if (!droppable.offset) return false;

	var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
		y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
	var l = droppable.offset.left, r = l + droppable.proportions.width,
		t = droppable.offset.top, b = t + droppable.proportions.height;

	switch (toleranceMode) {
		case 'fit':
			return (l < x1 && x2 < r
				&& t < y1 && y2 < b);
			break;
		case 'intersect':
			return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
				&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
				&& y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
			break;
		case 'pointer':
			var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left),
				draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top),
				isOver = $.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
			return isOver;
			break;
		case 'touch':
			return (
					(y1 >= t && y1 <= b) ||	// Top edge touching
					(y2 >= t && y2 <= b) ||	// Bottom edge touching
					(y1 < t && y2 > b)		// Surrounded vertically
				) && (
					(x1 >= l && x1 <= r) ||	// Left edge touching
					(x2 >= l && x2 <= r) ||	// Right edge touching
					(x1 < l && x2 > r)		// Surrounded horizontally
				);
			break;
		default:
			return false;
			break;
		}

};

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { 'default': [] },
	prepareOffsets: function(t, event) {

		var m = $.ui.ddmanager.droppables[t.options.scope];
		var type = event ? event.type : null; // workaround for #2317
		var list = (t.currentItem || t.element).find(":data(droppable)").andSelf();

		droppablesLoop: for (var i = 0; i < m.length; i++) {

			if(m[i].options.disabled || (t && !m[i].options.accept.call(m[i].element,(t.currentItem || t.element)))) continue;	//No disabled and non-accepted
			for (var j=0; j < list.length; j++) { if(list[j] == m[i].element[0]) { m[i].proportions.height = 0; continue droppablesLoop; } }; //Filter out elements in the current dragged item
			m[i].visible = m[i].element.css("display") != "none"; if(!m[i].visible) continue; 									//If the element is not visible, continue

			m[i].offset = m[i].element.offset();
			m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

			if(type == "dragstart" || type == "sortactivate") m[i]._activate.call(m[i], event); 										//Activate the droppable if used directly from draggables

		}

	},
	drop: function(draggable, event) {

		var dropped = false;
		$.each($.ui.ddmanager.droppables[draggable.options.scope], function() {

			if(!this.options) return;
			if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance))
				dropped = this._drop.call(this, event);

			if (!this.options.disabled && this.visible && this.options.accept.call(this.element,(draggable.currentItem || draggable.element))) {
				this.isout = 1; this.isover = 0;
				this._deactivate.call(this, event);
			}

		});
		return dropped;

	},
	drag: function(draggable, event) {

		//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if(draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, event);

		//Run through all droppables and check their positions based on specific tolerance options

		$.each($.ui.ddmanager.droppables[draggable.options.scope], function() {

			if(this.options.disabled || this.greedyChild || !this.visible) return;
			var intersects = $.ui.intersect(draggable, this, this.options.tolerance);

			var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
			if(!c) return;

			var parentInstance;
			if (this.options.greedy) {
				var parent = this.element.parents(':data(droppable):eq(0)');
				if (parent.length) {
					parentInstance = $.data(parent[0], 'droppable');
					parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
				}
			}

			// we just moved into a greedy child
			if (parentInstance && c == 'isover') {
				parentInstance['isover'] = 0;
				parentInstance['isout'] = 1;
				parentInstance._out.call(parentInstance, event);
			}

			this[c] = 1; this[c == 'isout' ? 'isover' : 'isout'] = 0;
			this[c == "isover" ? "_over" : "_out"].call(this, event);

			// we just moved out of a greedy child
			if (parentInstance && c == 'isout') {
				parentInstance['isout'] = 0;
				parentInstance['isover'] = 1;
				parentInstance._over.call(parentInstance, event);
			}
		});

	}
};

/*
 * Droppable Extensions
 */

$.ui.plugin.add("droppable", "activeClass", {
	activate: function(event, ui) {
		$(this).addClass(ui.options.activeClass);
	},
	deactivate: function(event, ui) {
		$(this).removeClass(ui.options.activeClass);
	},
	drop: function(event, ui) {
		$(this).removeClass(ui.options.activeClass);
	}
});

$.ui.plugin.add("droppable", "hoverClass", {
	over: function(event, ui) {
		$(this).addClass(ui.options.hoverClass);
	},
	out: function(event, ui) {
		$(this).removeClass(ui.options.hoverClass);
	},
	drop: function(event, ui) {
		$(this).removeClass(ui.options.hoverClass);
	}
});

})(jQuery);
/*
 * jQuery UI Resizable 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Resizables
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.resizable", $.extend({}, $.ui.mouse, {

	_init: function() {

		var self = this, o = this.options;

		var elpos = this.element.css('position');

		this.originalElement = this.element;

		// simulate .ui-resizable { position: relative; }
		this.element.addClass("ui-resizable").css({ position: /static/.test(elpos) ? 'relative' : elpos });

		$.extend(o, {
			_aspectRatio: !!(o.aspectRatio),
			helper: o.helper || o.ghost || o.animate ? o.helper || 'ui-resizable-helper' : null,
			knobHandles: o.knobHandles === true ? 'ui-resizable-knob-handle' : o.knobHandles
		});

		//Default Theme
		var aBorder = '1px solid #DEDEDE';

		o.defaultTheme = {
			'ui-resizable': { display: 'block' },
			'ui-resizable-handle': { position: 'absolute', background: '#F2F2F2', fontSize: '0.1px' },
			'ui-resizable-n': { cursor: 'n-resize', height: '4px', left: '0px', right: '0px', borderTop: aBorder },
			'ui-resizable-s': { cursor: 's-resize', height: '4px', left: '0px', right: '0px', borderBottom: aBorder },
			'ui-resizable-e': { cursor: 'e-resize', width: '4px', top: '0px', bottom: '0px', borderRight: aBorder },
			'ui-resizable-w': { cursor: 'w-resize', width: '4px', top: '0px', bottom: '0px', borderLeft: aBorder },
			'ui-resizable-se': { cursor: 'se-resize', width: '4px', height: '4px', borderRight: aBorder, borderBottom: aBorder },
			'ui-resizable-sw': { cursor: 'sw-resize', width: '4px', height: '4px', borderBottom: aBorder, borderLeft: aBorder },
			'ui-resizable-ne': { cursor: 'ne-resize', width: '4px', height: '4px', borderRight: aBorder, borderTop: aBorder },
			'ui-resizable-nw': { cursor: 'nw-resize', width: '4px', height: '4px', borderLeft: aBorder, borderTop: aBorder }
		};

		o.knobTheme = {
			'ui-resizable-handle': { background: '#F2F2F2', border: '1px solid #808080', height: '8px', width: '8px' },
			'ui-resizable-n': { cursor: 'n-resize', top: '0px', left: '45%' },
			'ui-resizable-s': { cursor: 's-resize', bottom: '0px', left: '45%' },
			'ui-resizable-e': { cursor: 'e-resize', right: '0px', top: '45%' },
			'ui-resizable-w': { cursor: 'w-resize', left: '0px', top: '45%' },
			'ui-resizable-se': { cursor: 'se-resize', right: '0px', bottom: '0px' },
			'ui-resizable-sw': { cursor: 'sw-resize', left: '0px', bottom: '0px' },
			'ui-resizable-nw': { cursor: 'nw-resize', left: '0px', top: '0px' },
			'ui-resizable-ne': { cursor: 'ne-resize', right: '0px', top: '0px' }
		};

		o._nodeName = this.element[0].nodeName;

		//Wrap the element if it cannot hold child nodes
		if(o._nodeName.match(/canvas|textarea|input|select|button|img/i)) {
			var el = this.element;

			//Opera fixing relative position
			if (/relative/.test(el.css('position')) && $.browser.opera)
				el.css({ position: 'relative', top: 'auto', left: 'auto' });

			//Create a wrapper element and set the wrapper to the new current internal element
			el.wrap(
				$('<div class="ui-wrapper"	style="overflow: hidden;"></div>').css( {
					position: el.css('position'),
					width: el.outerWidth(),
					height: el.outerHeight(),
					top: el.css('top'),
					left: el.css('left')
				})
			);

			var oel = this.element; this.element = this.element.parent();

			// store instance on wrapper
			this.element.data('resizable', this);

			//Move margins to the wrapper
			this.element.css({ marginLeft: oel.css("marginLeft"), marginTop: oel.css("marginTop"),
				marginRight: oel.css("marginRight"), marginBottom: oel.css("marginBottom")
			});

			oel.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

			//Prevent Safari textarea resize
			if ($.browser.safari && o.preventDefault) oel.css('resize', 'none');

			o.proportionallyResize = oel.css({ position: 'static', zoom: 1, display: 'block' });

			// avoid IE jump
			this.element.css({ margin: oel.css('margin') });

			// fix handlers offset
			this._proportionallyResize();
		}

		if(!o.handles) o.handles = !$('.ui-resizable-handle', this.element).length ? "e,s,se" : { n: '.ui-resizable-n', e: '.ui-resizable-e', s: '.ui-resizable-s', w: '.ui-resizable-w', se: '.ui-resizable-se', sw: '.ui-resizable-sw', ne: '.ui-resizable-ne', nw: '.ui-resizable-nw' };
		if(o.handles.constructor == String) {

			o.zIndex = o.zIndex || 1000;

			if(o.handles == 'all') o.handles = 'n,e,s,w,se,sw,ne,nw';

			var n = o.handles.split(","); o.handles = {};

			// insertions are applied when don't have theme loaded
			var insertionsDefault = {
				handle: 'position: absolute; display: none; overflow:hidden;',
				n: 'top: 0pt; width:100%;',
				e: 'right: 0pt; height:100%;',
				s: 'bottom: 0pt; width:100%;',
				w: 'left: 0pt; height:100%;',
				se: 'bottom: 0pt; right: 0px;',
				sw: 'bottom: 0pt; left: 0px;',
				ne: 'top: 0pt; right: 0px;',
				nw: 'top: 0pt; left: 0px;'
			};

			for(var i = 0; i < n.length; i++) {
				var handle = $.trim(n[i]), dt = o.defaultTheme, hname = 'ui-resizable-'+handle, loadDefault = !$.ui.css(hname) && !o.knobHandles, userKnobClass = $.ui.css('ui-resizable-knob-handle'),
							allDefTheme = $.extend(dt[hname], dt['ui-resizable-handle']), allKnobTheme = $.extend(o.knobTheme[hname], !userKnobClass ? o.knobTheme['ui-resizable-handle'] : {});

				// increase zIndex of sw, se, ne, nw axis
				var applyZIndex = /sw|se|ne|nw/.test(handle) ? { zIndex: ++o.zIndex } : {};

				var defCss = (loadDefault ? insertionsDefault[handle] : ''),
					axis = $(['<div class="ui-resizable-handle ', hname, '" style="', defCss, insertionsDefault.handle, '"></div>'].join('')).css( applyZIndex );

				if ('se' == handle) {
					axis.addClass('ui-icon ui-icon-gripsmall-diagonal-se');
				};

				o.handles[handle] = '.ui-resizable-'+handle;

				this.element.append(
					//Theme detection, if not loaded, load o.defaultTheme
					axis.css( loadDefault ? allDefTheme : {} )
						// Load the knobHandle css, fix width, height, top, left...
						.css( o.knobHandles ? allKnobTheme : {} ).addClass(o.knobHandles ? 'ui-resizable-knob-handle' : '').addClass(o.knobHandles)
				);
			}

			if (o.knobHandles) this.element.addClass('ui-resizable-knob').css( !$.ui.css('ui-resizable-knob') ? { /*border: '1px #fff dashed'*/ } : {} );
		}

		this._renderAxis = function(target) {
			target = target || this.element;

			for(var i in o.handles) {
				if(o.handles[i].constructor == String)
					o.handles[i] = $(o.handles[i], this.element).show();

				if (o.transparent)
					o.handles[i].css({opacity:0});

				//Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
				if (this.element.is('.ui-wrapper') &&
					o._nodeName.match(/textarea|input|select|button/i)) {

					var axis = $(o.handles[i], this.element), padWrapper = 0;

					//Checking the correct pad and border
					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					//The padding type i have to apply...
					var padPos = [ 'padding',
						/ne|nw|n/.test(i) ? 'Top' :
						/se|sw|s/.test(i) ? 'Bottom' :
						/^e$/.test(i) ? 'Right' : 'Left' ].join("");

					if (!o.transparent)
						target.css(padPos, padWrapper);

					this._proportionallyResize();
				}
				if(!$(o.handles[i]).length) continue;
			}
		};

		this._renderAxis(this.element);
		o._handles = $('.ui-resizable-handle', self.element);

		if (o.disableSelection)
			o._handles.disableSelection();

		//Matching axis name
		o._handles.mouseover(function() {
			if (!o.resizing) {
				if (this.className)
					var axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				//Axis, default = se
				self.axis = o.axis = axis && axis[1] ? axis[1] : 'se';
			}
		});

		//If we want to auto hide the elements
		if (o.autoHide) {
			o._handles.hide();
			$(self.element).addClass("ui-resizable-autohide").hover(function() {
				$(this).removeClass("ui-resizable-autohide");
				o._handles.show();
			},
			function(){
				if (!o.resizing) {
					$(this).addClass("ui-resizable-autohide");
					o._handles.hide();
				}
			});
		}

		this._mouseInit();
	},

	destroy: function() {
		var el = this.element, wrapped = el.children(".ui-resizable").get(0);

		this._mouseDestroy();

		var _destroy = function(exp) {
			$(exp).removeClass("ui-resizable ui-resizable-disabled")
				.removeData("resizable").unbind(".resizable").find('.ui-resizable-handle').remove();
		};

		_destroy(el);

		if (el.is('.ui-wrapper') && wrapped) {
			el.parent().append(
				$(wrapped).css({
					position: el.css('position'),
					width: el.outerWidth(),
					height: el.outerHeight(),
					top: el.css('top'),
					left: el.css('left')
				})
			).end().remove();

			_destroy(wrapped);
		}
	},

	_mouseCapture: function(event) {

		if(this.options.disabled) return false;

		var handle = false;
		for(var i in this.options.handles) {
			if($(this.options.handles[i])[0] == event.target) handle = true;
		}
		if (!handle) return false;

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options, iniPos = this.element.position(), el = this.element,
			num = function(v) { return parseInt(v, 10) || 0; }, ie6 = $.browser.msie && $.browser.version < 7;
		o.resizing = true;
		o.documentScroll = { top: $(document).scrollTop(), left: $(document).scrollLeft() };

		// bugfix #1749
		if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {

			// sOffset decides if document scrollOffset will be added to the top/left of the resizable element
			var sOffset = $.browser.msie && !o.containment && (/absolute/).test(el.css('position')) && !(/relative/).test(el.parent().css('position'));
			var dscrollt = sOffset ? o.documentScroll.top : 0, dscrolll = sOffset ? o.documentScroll.left : 0;

			el.css({ position: 'absolute', top: (iniPos.top + dscrollt), left: (iniPos.left + dscrolll) });
		}

		//Opera fixing relative position
		if ($.browser.opera && (/relative/).test(el.css('position')))
			el.css({ position: 'relative', top: 'auto', left: 'auto' });

		this._renderProxy();

		var curleft = num(this.helper.css('left')), curtop = num(this.helper.css('top'));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft()||0;
			curtop += $(o.containment).scrollTop()||0;
		}

		//Store needed variables
		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };
		this.size = o.helper || ie6 ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalSize = o.helper || ie6 ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtop };
		this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		//Aspect Ratio
		o.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height)||1);

		if (o.preserveCursor) {
		    var cursor = $('.ui-resizable-' + this.axis).css('cursor');
		    $('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);
		}

		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		//Increase performance, avoid regex
		var el = this.helper, o = this.options, props = {},
			self = this, smp = this.originalMousePosition, a = this.axis;

		var dx = (event.pageX-smp.left)||0, dy = (event.pageY-smp.top)||0;
		var trigger = this._change[a];
		if (!trigger) return false;

		// Calculate the attrs that will be change
		var data = trigger.apply(this, [event, dx, dy]), ie6 = $.browser.msie && $.browser.version < 7, csdif = this.sizeDiff;

		if (o._aspectRatio || event.shiftKey)
			data = this._updateRatio(data, event);

		data = this._respectSize(data, event);

		// plugins callbacks need to be called first
		this._propagate("resize", event);

		el.css({
			top: this.position.top + "px", left: this.position.left + "px",
			width: this.size.width + "px", height: this.size.height + "px"
		});

		if (!o.helper && o.proportionallyResize)
			this._proportionallyResize();

		this._updateCache(data);

		// calling the user callback at the end
		this._trigger('resize', event, this.ui());

		return false;
	},

	_mouseStop: function(event) {

		this.options.resizing = false;
		var o = this.options, num = function(v) { return parseInt(v, 10) || 0; }, self = this;

		if(o.helper) {
			var pr = o.proportionallyResize, ista = pr && (/textarea/i).test(pr.get(0).nodeName),
						soffseth = ista && $.ui.hasScroll(pr.get(0), 'left') /* TODO - jump height */ ? 0 : self.sizeDiff.height,
							soffsetw = ista ? 0 : self.sizeDiff.width;

			var s = { width: (self.size.width - soffsetw), height: (self.size.height - soffseth) },
				left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
				top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;

			if (!o.animate)
				this.element.css($.extend(s, { top: top, left: left }));

			if (o.helper && !o.animate) this._proportionallyResize();
		}

		if (o.preserveCursor)
			$('body').css('cursor', 'auto');

		this._propagate("stop", event);

		if (o.helper) this.helper.remove();

		return false;
	},

	_updateCache: function(data) {
		var o = this.options;
		this.offset = this.helper.offset();
		if (data.left) this.position.left = data.left;
		if (data.top) this.position.top = data.top;
		if (data.height) this.size.height = data.height;
		if (data.width) this.size.width = data.width;
	},

	_updateRatio: function(data, event) {

		var o = this.options, cpos = this.position, csize = this.size, a = this.axis;

		if (data.height) data.width = (csize.height * o.aspectRatio);
		else if (data.width) data.height = (csize.width / o.aspectRatio);

		if (a == 'sw') {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a == 'nw') {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function(data, event) {

		var el = this.helper, o = this.options, pRatio = o._aspectRatio || event.shiftKey, a = this.axis,
				ismaxw = data.width && o.maxWidth && o.maxWidth < data.width, ismaxh = data.height && o.maxHeight && o.maxHeight < data.height,
					isminw = data.width && o.minWidth && o.minWidth > data.width, isminh = data.height && o.minHeight && o.minHeight > data.height;

		if (isminw) data.width = o.minWidth;
		if (isminh) data.height = o.minHeight;
		if (ismaxw) data.width = o.maxWidth;
		if (ismaxh) data.height = o.maxHeight;

		var dw = this.originalPosition.left + this.originalSize.width, dh = this.position.top + this.size.height;
		var cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);

		if (isminw && cw) data.left = dw - o.minWidth;
		if (ismaxw && cw) data.left = dw - o.maxWidth;
		if (isminh && ch)	data.top = dh - o.minHeight;
		if (ismaxh && ch)	data.top = dh - o.maxHeight;

		// fixing jump error on top/left - bug #2330
		var isNotwh = !data.width && !data.height;
		if (isNotwh && !data.left && data.top) data.top = null;
		else if (isNotwh && !data.top && data.left) data.left = null;

		return data;
	},

	_proportionallyResize: function() {
		var o = this.options;
		if (!o.proportionallyResize) return;
		var prel = o.proportionallyResize, el = this.helper || this.element;

		if (!o.borderDif) {
			var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')],
				p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];

			o.borderDif = $.map(b, function(v, i) {
				var border = parseInt(v,10)||0, padding = parseInt(p[i],10)||0;
				return border + padding;
			});
		}

		if ($.browser.msie && !isVisible(el))
			return;

		prel.css({
			height: (el.height() - o.borderDif[0] - o.borderDif[2]) || 0,
			width: (el.width() - o.borderDif[1] - o.borderDif[3]) || 0
		});
	},

	_renderProxy: function() {
		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if(o.helper) {
			this.helper = this.helper || $('<div style="overflow:hidden;"></div>');

			// fix ie6 offset
			var ie6 = $.browser.msie && $.browser.version < 7, ie6offset = (ie6 ? 1 : 0),
			pxyoffset = ( ie6 ? 2 : -1 );

			this.helper.addClass(o.helper).css({
				width: el.outerWidth() + pxyoffset,
				height: el.outerHeight() + pxyoffset,
				position: 'absolute',
				left: this.elementOffset.left - ie6offset +'px',
				top: this.elementOffset.top - ie6offset +'px',
				zIndex: ++o.zIndex
			});

			this.helper.appendTo("body");

			if (o.disableSelection)
				this.helper.disableSelection();

		} else {
			this.helper = el;
		}
	},

	_change: {
		e: function(event, dx, dy) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		
		(n != "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			options: this.options,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

}));

$.extend($.ui.resizable, {
	version: "1.6rc5",
	eventPrefix: "resize",
	defaults: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		cancel: ":input,option",
		containment: false,
		delay: 0,
		disableSelection: true,
		distance: 1,
		ghost: false,
		grid: false,
		knobHandles: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		preserveCursor: true,
		preventDefault: true,
		proportionallyResize: false,
		transparent: false
	}
});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "alsoResize", {

	start: function(event, ui) {
		var o = ui.options, self = $(this).data("resizable"),

		_store = function(exp) {
			$(exp).each(function() {
				$(this).data("resizable-alsoresize", {
					width: parseInt($(this).width(), 10), height: parseInt($(this).height(), 10),
					left: parseInt($(this).css('left'), 10), top: parseInt($(this).css('top'), 10)
				});
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
			if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0];	_store(o.alsoResize); }
			else { $.each(o.alsoResize, function(exp, c) { _store(exp); }); }
		}else{
			_store(o.alsoResize);
		}
	},

	resize: function(event, ui){
		var o = ui.options, self = $(this).data("resizable"), os = self.originalSize, op = self.originalPosition;

		var delta = {
			height: (self.size.height - os.height) || 0, width: (self.size.width - os.width) || 0,
			top: (self.position.top - op.top) || 0, left: (self.position.left - op.left) || 0
		},

		_alsoResize = function(exp, c) {
			$(exp).each(function() {
				var el = $(this), start = $(this).data("resizable-alsoresize"), style = {}, css = c && c.length ? c : ['width', 'height', 'top', 'left'];

				$.each(css || ['width', 'height', 'top', 'left'], function(i, prop) {
					var sum = (start[prop]||0) + (delta[prop]||0);
					if (sum && sum >= 0)
						style[prop] = sum || null;
				});

				//Opera fixing relative position
				if (/relative/.test(el.css('position')) && $.browser.opera) {
					self._revertToRelativePosition = true;
					el.css({ position: 'absolute', top: 'auto', left: 'auto' });
				}

				el.css(style);
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
			$.each(o.alsoResize, function(exp, c) { _alsoResize(exp, c); });
		}else{
			_alsoResize(o.alsoResize);
		}
	},

	stop: function(event, ui){
		var self = $(this).data("resizable");

		//Opera fixing relative position
		if (self._revertToRelativePosition && $.browser.opera) {
			self._revertToRelativePosition = false;
			el.css({ position: 'relative' });
		}

		$(this).removeData("resizable-alsoresize-start");
	}
});

$.ui.plugin.add("resizable", "animate", {

	stop: function(event, ui) {
		var o = ui.options, self = $(this).data("resizable");

		var pr = o.proportionallyResize, ista = pr && (/textarea/i).test(pr.get(0).nodeName),
						soffseth = ista && $.ui.hasScroll(pr.get(0), 'left') /* TODO - jump height */ ? 0 : self.sizeDiff.height,
							soffsetw = ista ? 0 : self.sizeDiff.width;

		var style = { width: (self.size.width - soffsetw), height: (self.size.height - soffseth) },
					left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
						top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;

		self.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(self.element.css('width'), 10),
						height: parseInt(self.element.css('height'), 10),
						top: parseInt(self.element.css('top'), 10),
						left: parseInt(self.element.css('left'), 10)
					};

					if (pr) pr.css({ width: data.width, height: data.height });

					// propagating resize, and updating values for each animation step
					self._updateCache(data);
					self._propagate("resize", event);

				}
			}
		);
	}

});

$.ui.plugin.add("resizable", "containment", {

	start: function(event, ui) {
		var o = ui.options, self = $(this).data("resizable"), el = self.element;
		var oc = o.containment,	ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
		if (!ce) return;

		self.containerElement = $(ce);

		if (/document/.test(oc) || oc == document) {
			self.containerOffset = { left: 0, top: 0 };
			self.containerPosition = { left: 0, top: 0 };

			self.parentData = {
				element: $(document), left: 0, top: 0,
				width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
			};
		}

		// i'm a node, so compute top, left, right, bottom
		else{
			self.containerOffset = $(ce).offset();
			self.containerPosition = $(ce).position();
			self.containerSize = { height: $(ce).innerHeight(), width: $(ce).innerWidth() };

			var co = self.containerOffset, ch = self.containerSize.height,	cw = self.containerSize.width,
						width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw ), height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

			self.parentData = {
				element: ce, left: co.left, top: co.top, width: width, height: height
			};
		}
	},

	resize: function(event, ui) {
		var o = ui.options, self = $(this).data("resizable"),
				ps = self.containerSize, co = self.containerOffset, cs = self.size, cp = self.position,
				pRatio = o._aspectRatio || event.shiftKey, cop = { top:0, left:0 }, ce = self.containerElement;

		if (ce[0] != document && (/static/).test(ce.css('position')))
			cop = self.containerPosition;

		if (cp.left < (o.helper ? co.left : 0)) {
			self.size.width = self.size.width + (o.helper ? (self.position.left - co.left) : (self.position.left - cop.left));
			if (pRatio) self.size.height = self.size.width / o.aspectRatio;
			self.position.left = o.helper ? co.left : 0;
		}

		if (cp.top < (o.helper ? co.top : 0)) {
			self.size.height = self.size.height + (o.helper ? (self.position.top - co.top) : self.position.top);
			if (pRatio) self.size.width = self.size.height * o.aspectRatio;
			self.position.top = o.helper ? co.top : 0;
		}

		var woset = Math.abs( (o.helper ? self.offset.left - cop.left : (self.offset.left - cop.left)) + self.sizeDiff.width ),
					hoset = Math.abs( (o.helper ? self.offset.top - cop.top : (self.offset.top - co.top)) + self.sizeDiff.height );

		if (woset + self.size.width >= self.parentData.width) {
			self.size.width = self.parentData.width - woset;
			if (pRatio) self.size.height = self.size.width / o.aspectRatio;
		}

		if (hoset + self.size.height >= self.parentData.height) {
			self.size.height = self.parentData.height - hoset;
			if (pRatio) self.size.width = self.size.height * o.aspectRatio;
		}
	},

	stop: function(event, ui){
		var o = ui.options, self = $(this).data("resizable"), cp = self.position,
				co = self.containerOffset, cop = self.containerPosition, ce = self.containerElement;

		var helper = $(self.helper), ho = helper.offset(), w = helper.outerWidth() - self.sizeDiff.width, h = helper.outerHeight() - self.sizeDiff.height;

		if (o.helper && !o.animate && (/relative/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

		if (o.helper && !o.animate && (/static/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

	}
});

$.ui.plugin.add("resizable", "ghost", {

	start: function(event, ui) {
		var o = ui.options, self = $(this).data("resizable"), pr = o.proportionallyResize, cs = self.size;

		if (!pr) self.ghost = self.element.clone();
		else self.ghost = pr.clone();

		self.ghost.css(
			{ opacity: .25, display: 'block', position: 'relative', height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 }
		)
		.addClass('ui-resizable-ghost').addClass(typeof o.ghost == 'string' ? o.ghost : '');

		self.ghost.appendTo(self.helper);

	},

	resize: function(event, ui){
		var o = ui.options, self = $(this).data("resizable"), pr = o.proportionallyResize;

		if (self.ghost) self.ghost.css({ position: 'relative', height: self.size.height, width: self.size.width });

	},

	stop: function(event, ui){
		var o = ui.options, self = $(this).data("resizable"), pr = o.proportionallyResize;
		if (self.ghost && self.helper) self.helper.get(0).removeChild(self.ghost.get(0));
	}

});

$.ui.plugin.add("resizable", "grid", {

	resize: function(event, ui) {
		var o = ui.options, self = $(this).data("resizable"), cs = self.size, os = self.originalSize, op = self.originalPosition, a = self.axis, ratio = o._aspectRatio || event.shiftKey;
		o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
		var ox = Math.round((cs.width - os.width) / (o.grid[0]||1)) * (o.grid[0]||1), oy = Math.round((cs.height - os.height) / (o.grid[1]||1)) * (o.grid[1]||1);

		if (/^(se|s|e)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
		}
		else if (/^(ne)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.top = op.top - oy;
		}
		else if (/^(sw)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.left = op.left - ox;
		}
		else {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.top = op.top - oy;
			self.position.left = op.left - ox;
		}
	}

});

function isVisible(element) {
	return !($(element).is(':hidden') || $(element).parents(':hidden').length);
}

})(jQuery);
/*
 * jQuery UI Selectable 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Selectables
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.selectable", $.extend({}, $.ui.mouse, {

	_init: function() {
		var self = this;

		this.element.addClass("ui-selectable");

		this.dragged = false;

		// cache selectee children based on filter
		var selectees;
		this.refresh = function() {
			selectees = $(self.options.filter, self.element[0]);
			selectees.each(function() {
				var $this = $(this);
				var pos = $this.offset();
				$.data(this, "selectable-item", {
					element: this,
					$element: $this,
					left: pos.left,
					top: pos.top,
					right: pos.left + $this.outerWidth(),
					bottom: pos.top + $this.outerHeight(),
					startselected: false,
					selected: $this.hasClass('ui-selected'),
					selecting: $this.hasClass('ui-selecting'),
					unselecting: $this.hasClass('ui-unselecting')
				});
			});
		};
		this.refresh();

		this.selectees = selectees.addClass("ui-selectee");

		this._mouseInit();

		this.helper = $(document.createElement('div'))
			.css({border:'1px dotted black'})
			.addClass("ui-selectable-helper");
	},

	destroy: function() {
		this.element
			.removeClass("ui-selectable ui-selectable-disabled")
			.removeData("selectable")
			.unbind(".selectable");
		this._mouseDestroy();
	},

	_mouseStart: function(event) {
		var self = this;

		this.opos = [event.pageX, event.pageY];

		if (this.options.disabled)
			return;

		var options = this.options;

		this.selectees = $(options.filter, this.element[0]);

		this._trigger("start", event);

		$('body').append(this.helper);
		// position helper (lasso)
		this.helper.css({
			"z-index": 100,
			"position": "absolute",
			"left": event.clientX,
			"top": event.clientY,
			"width": 0,
			"height": 0
		});

		if (options.autoRefresh) {
			this.refresh();
		}

		this.selectees.filter('.ui-selected').each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.startselected = true;
			if (!event.metaKey) {
				selectee.$element.removeClass('ui-selected');
				selectee.selected = false;
				selectee.$element.addClass('ui-unselecting');
				selectee.unselecting = true;
				// selectable UNSELECTING callback
				self._trigger("unselecting", event, {
					unselecting: selectee.element
				});
			}
		});

		$(event.target).parents().andSelf().each(function() {
			var selectee = $.data(this, "selectable-item");
			if (selectee) {
				selectee.$element.removeClass("ui-unselecting").addClass('ui-selecting');
				selectee.unselecting = false;
				selectee.selecting = true;
				selectee.selected = true;
				// selectable SELECTING callback
				self._trigger("selecting", event, {
					selecting: selectee.element
				});
				return false;
			}
		});

	},

	_mouseDrag: function(event) {
		var self = this;
		this.dragged = true;

		if (this.options.disabled)
			return;

		var options = this.options;

		var x1 = this.opos[0], y1 = this.opos[1], x2 = event.pageX, y2 = event.pageY;
		if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
		if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }
		this.helper.css({left: x1, top: y1, width: x2-x1, height: y2-y1});

		this.selectees.each(function() {
			var selectee = $.data(this, "selectable-item");
			//prevent helper from being selected if appendTo: selectable
			if (!selectee || selectee.element == self.element[0])
				return;
			var hit = false;
			if (options.tolerance == 'touch') {
				hit = ( !(selectee.left > x2 || selectee.right < x1 || selectee.top > y2 || selectee.bottom < y1) );
			} else if (options.tolerance == 'fit') {
				hit = (selectee.left > x1 && selectee.right < x2 && selectee.top > y1 && selectee.bottom < y2);
			}

			if (hit) {
				// SELECT
				if (selectee.selected) {
					selectee.$element.removeClass('ui-selected');
					selectee.selected = false;
				}
				if (selectee.unselecting) {
					selectee.$element.removeClass('ui-unselecting');
					selectee.unselecting = false;
				}
				if (!selectee.selecting) {
					selectee.$element.addClass('ui-selecting');
					selectee.selecting = true;
					// selectable SELECTING callback
					self._trigger("selecting", event, {
						selecting: selectee.element
					});
				}
			} else {
				// UNSELECT
				if (selectee.selecting) {
					if (event.metaKey && selectee.startselected) {
						selectee.$element.removeClass('ui-selecting');
						selectee.selecting = false;
						selectee.$element.addClass('ui-selected');
						selectee.selected = true;
					} else {
						selectee.$element.removeClass('ui-selecting');
						selectee.selecting = false;
						if (selectee.startselected) {
							selectee.$element.addClass('ui-unselecting');
							selectee.unselecting = true;
						}
						// selectable UNSELECTING callback
						self._trigger("unselecting", event, {
							unselecting: selectee.element
						});
					}
				}
				if (selectee.selected) {
					if (!event.metaKey && !selectee.startselected) {
						selectee.$element.removeClass('ui-selected');
						selectee.selected = false;

						selectee.$element.addClass('ui-unselecting');
						selectee.unselecting = true;
						// selectable UNSELECTING callback
						self._trigger("unselecting", event, {
							unselecting: selectee.element
						});
					}
				}
			}
		});

		return false;
	},

	_mouseStop: function(event) {
		var self = this;

		this.dragged = false;

		var options = this.options;

		$('.ui-unselecting', this.element[0]).each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.$element.removeClass('ui-unselecting');
			selectee.unselecting = false;
			selectee.startselected = false;
			self._trigger("unselected", event, {
				unselected: selectee.element
			});
		});
		$('.ui-selecting', this.element[0]).each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.$element.removeClass('ui-selecting').addClass('ui-selected');
			selectee.selecting = false;
			selectee.selected = true;
			selectee.startselected = true;
			self._trigger("selected", event, {
				selected: selectee.element
			});
		});
		this._trigger("stop", event);

		this.helper.remove();

		return false;
	}

}));

$.extend($.ui.selectable, {
	version: "1.6rc5",
	defaults: {
		appendTo: 'body',
		autoRefresh: true,
		cancel: ":input,option",
		delay: 0,
		distance: 0,
		filter: '*',
		tolerance: 'touch'
	}
});

})(jQuery);
/*
 * jQuery UI Sortable 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.sortable", $.extend({}, $.ui.mouse, {
	_init: function() {

		var o = this.options;
		this.containerCache = {};
		(this.options.cssNamespace && this.element.addClass(this.options.cssNamespace+"-sortable"));

		//Get the items
		this.refresh();

		//Let's determine if the items are floating
		this.floating = this.items.length ? (/left|right/).test(this.items[0].item.css('float')) : false;

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

	},

	destroy: function() {
		this.element
			.removeClass(this.options.cssNamespace+"-sortable "+this.options.cssNamespace+"-sortable-disabled")
			.removeData("sortable")
			.unbind(".sortable");
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- )
			this.items[i].item.removeData("sortable-item");
	},

	_mouseCapture: function(event, overrideHandle) {

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type == 'static') return false;

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		var currentItem = null, self = this, nodes = $(event.target).parents().each(function() {
			if($.data(this, 'sortable-item') == self) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, 'sortable-item') == self) currentItem = $(event.target);

		if(!currentItem) return false;
		if(this.options.handle && !overrideHandle) {
			var validHandle = false;

			$(this.options.handle, currentItem).find("*").andSelf().each(function() { if(this == event.target) validHandle = true; });
			if(!validHandle) return false;
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var o = this.options;
		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		if(o.cursorAt)
			this._adjustOffsetFromHelper(o.cursorAt);

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if(this.helper[0] != this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		//Call plugins and callbacks
		this._trigger("start", event);

		//Recache the helper size
		if(!this._preserveHelperProportions)
			this._cacheHelperProportions();


		//Post 'activate' events to possible containers
		if(!noActivation) {
			 for (var i = this.containers.length - 1; i >= 0; i--) { this.containers[i]._trigger("activate", event, this); }
		}

		//Prepare possible droppables
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.dragging = true;

		this.helper.addClass(o.cssNamespace+'-sortable-helper');
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Call the internal plugins
		$.ui.plugin.call(this, "sort", [event, this._uiHash()]);

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';

		//Rearrange
		for (var i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			var item = this.items[i], itemElement = item.item[0], intersection = this._intersectsWithPointer(item);
			if (!intersection) continue;

			if(itemElement != this.currentItem[0] //cannot intersect with itself
				&&	this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
				&&	!$.ui.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
				&& (this.options.type == 'semi-dynamic' ? !$.ui.contains(this.element[0], itemElement) : true)
			) {

				this.direction = intersection == 1 ? "down" : "up";

				if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
					this.options.sortIndicator.call(this, event, item);
				} else {
					break;
				}

				this._trigger("change", event); //Call plugins and callbacks
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		//Call callbacks
		this._trigger('sort', event);

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) return;

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			$.ui.ddmanager.drop(this, event);

		if(this.options.revert) {
			var self = this;
			var cur = self.placeholder.offset();

			self.reverting = true;

			$(this.helper).animate({
				left: cur.left - this.offset.parent.left - self.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
				top: cur.top - this.offset.parent.top - self.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
			}, parseInt(this.options.revert, 10) || 500, function() {
				self._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		if(this.dragging) {

			this._mouseUp();

			if(this.options.helper == "original")
				this.currentItem.css(this._storedCSS).removeClass(this.options.cssNamespace+"-sortable-helper");
			else
				this.currentItem.show();

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, this);
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, this);
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		if(this.placeholder[0].parentNode) this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
		if(this.options.helper != "original" && this.helper && this.helper[0].parentNode) this.helper.remove();

		$.extend(this, {
			helper: null,
			dragging: false,
			reverting: false,
			_noFinalSort: null
		});

		if(this.domPosition.prev) {
			$(this.domPosition.prev).after(this.currentItem);
		} else {
			$(this.domPosition.parent).prepend(this.currentItem);
		}

		return true;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var str = []; o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || 'id') || '').match(o.expression || (/(.+)[-=_](.+)/));
			if(res) str.push((o.key || res[1]+'[]')+'='+(o.key && o.expression ? res[1] : res[2]));
		});

		return str.join('&');

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var ret = []; o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || 'id') || ''); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height;

		var l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height;

		var dyClick = this.offset.click.top,
			dxClick = this.offset.click.left;

		var isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;

		if(	   this.options.tolerance == "pointer"
			|| this.options.forcePointerForContainers
			|| (this.options.tolerance != "pointer" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height'])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) // Right Half
				&& x2 - (this.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (this.helperProportions.height / 2) // Bottom Half
				&& y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement)
			return false;

		return this.floating ?
			( ((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection == "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta != 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta != 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this.refreshPositions();
	},

	_getItemsAsjQuery: function(connected) {

		var self = this;
		var items = [];
		var queries = [];

		if(this.options.connectWith && connected) {
			for (var i = this.options.connectWith.length - 1; i >= 0; i--){
				var cur = $(this.options.connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], 'sortable');
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not("."+inst.options.cssNamespace+"-sortable-helper"), inst]);
					}
				};
			};
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not("."+this.options.cssNamespace+"-sortable-helper"), this]);

		for (var i = queries.length - 1; i >= 0; i--){
			queries[i][0].each(function() {
				items.push(this);
			});
		};

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(sortable-item)");

		for (var i=0; i < this.items.length; i++) {

			for (var j=0; j < list.length; j++) {
				if(list[j] == this.items[i].item[0])
					this.items.splice(i,1);
			};

		};

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];
		var items = this.items;
		var self = this;
		var queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]];

		if(this.options.connectWith) {
			for (var i = this.options.connectWith.length - 1; i >= 0; i--){
				var cur = $(this.options.connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], 'sortable');
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				};
			};
		}

		for (var i = queries.length - 1; i >= 0; i--) {
			var targetData = queries[i][1];
			var _queries = queries[i][0];

			for (var j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				var item = $(_queries[j]);

				item.data('sortable-item', targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			};
		};

	},

	refreshPositions: function(fast) {

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		for (var i = this.items.length - 1; i >= 0; i--){
			var item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if(item.instance != this.currentContainer && this.currentContainer && item.item[0] != this.currentItem[0])
				continue;

			var t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				if (this.options.accurateIntersection) {
					item.width = t.outerWidth();
					item.height = t.outerHeight();
				}
				else {
					item.width = t[0].offsetWidth;
					item.height = t[0].offsetHeight;
				}
			}

			var p = t.offset();
			item.left = p.left;
			item.top = p.top;
		};

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (var i = this.containers.length - 1; i >= 0; i--){
				var p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			};
		}

	},

	_createPlaceholder: function(that) {

		var self = that || this, o = self.options;

		if(!o.placeholder || o.placeholder.constructor == String) {
			var className = o.placeholder;
			o.placeholder = {
				element: function() {

					var el = $(document.createElement(self.currentItem[0].nodeName))
						.addClass(className || self.currentItem[0].className+" "+self.options.cssNamespace+"-sortable-placeholder")
						.removeClass(self.options.cssNamespace+'-sortable-helper')[0];

					if(!className)
						el.style.visibility = "hidden";

					return el;
				},
				update: function(container, p) {
					
					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if(className && !o.forcePlaceholderSize) return;
					
					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if(!p.height()) { p.height(self.currentItem.innerHeight() - parseInt(self.currentItem.css('paddingTop')||0, 10) - parseInt(self.currentItem.css('paddingBottom')||0, 10)); };
					if(!p.width()) { p.width(self.currentItem.innerWidth() - parseInt(self.currentItem.css('paddingLeft')||0, 10) - parseInt(self.currentItem.css('paddingRight')||0, 10)); };
				}
			};
		}

		//Create the placeholder
		self.placeholder = $(o.placeholder.element.call(self.element, self.currentItem));

		//Append it after the actual current item
		self.currentItem.after(self.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(self, self.placeholder);

	},

	_contactContainers: function(event) {
		for (var i = this.containers.length - 1; i >= 0; i--){

			if(this._intersectsWith(this.containers[i].containerCache)) {
				if(!this.containers[i].containerCache.over) {

					if(this.currentContainer != this.containers[i]) {

						//When entering a new container, we will find the item with the least distance and append our item near it
						var dist = 10000; var itemWithLeastDistance = null; var base = this.positionAbs[this.containers[i].floating ? 'left' : 'top'];
						for (var j = this.items.length - 1; j >= 0; j--) {
							if(!$.ui.contains(this.containers[i].element[0], this.items[j].item[0])) continue;
							var cur = this.items[j][this.containers[i].floating ? 'left' : 'top'];
							if(Math.abs(cur - base) < dist) {
								dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j];
							}
						}

						if(!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled
							continue;

						this.currentContainer = this.containers[i];
						itemWithLeastDistance ? this.options.sortIndicator.call(this, event, itemWithLeastDistance, null, true) : this.options.sortIndicator.call(this, event, null, this.containers[i].element, true);
						this._trigger("change", event); //Call plugins and callbacks
						this.containers[i]._trigger("change", event, this); //Call plugins and callbacks

						//Update the placeholder
						this.options.placeholder.update(this.currentContainer, this.placeholder);

					}

					this.containers[i]._trigger("over", event, this);
					this.containers[i].containerCache.over = 1;
				}
			} else {
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this);
					this.containers[i].containerCache.over = 0;
				}
			}

		};
	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper == 'clone' ? this.currentItem.clone() : this.currentItem);

		if(!helper.parents('body').length) //Add the helper to the DOM if that didn't happen already
			$(o.appendTo != 'parent' ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);

		if(helper[0] == this.currentItem[0])
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };

		if(helper[0].style.width == '' || o.forceHelperSize) helper.width(this.currentItem.width());
		if(helper[0].style.height == '' || o.forceHelperSize) helper.height(this.currentItem.height());

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if(obj.left != undefined) this.offset.click.left = obj.left + this.margins.left;
		if(obj.right != undefined) this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		if(obj.top != undefined) this.offset.click.top = obj.top + this.margins.top;
		if(obj.bottom != undefined) this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();
		
		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body && $.browser.mozilla)	//Ugly FF3 fix
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			0 - this.offset.relative.left - this.offset.parent.left,
			0 - this.offset.relative.top - this.offset.parent.top,
			$(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			var ce = $(o.containment)[0];
			var co = $(o.containment).offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod
			)
		};
		
	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}
		
		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */
		 
		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
			}
			
			if(o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) )
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() )
			)
		};
		
	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == 'down' ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var self = this, counter = this.counter;

		window.setTimeout(function() {
			if(counter == self.counter) self.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
		},0);

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;

		//We first have to update the dom position of the actual currentItem
		if(!this._noFinalSort) this.placeholder.before(this.currentItem);
		this._noFinalSort = null;

		if(this.helper[0] == this.currentItem[0]) {
			for(var i in this._storedCSS) {
				if(this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static') this._storedCSS[i] = '';
			}
			this.currentItem.css(this._storedCSS).removeClass(this.options.cssNamespace+"-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside) this._trigger("receive", event, this, noPropagation);
		if(this.fromOutside || this.domPosition.prev != this.currentItem.prev().not("."+this.options.cssNamespace+"-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) this._trigger("update", event, null, noPropagation); //Trigger update callback if the DOM position has changed
		if(!$.ui.contains(this.element[0], this.currentItem[0])) { //Node was moved out of the current element
			this._trigger("remove", event, null, noPropagation);
			for (var i = this.containers.length - 1; i >= 0; i--){
				if($.ui.contains(this.containers[i].element[0], this.currentItem[0])) {
					this.containers[i]._trigger("receive", event, this, noPropagation);
					this.containers[i]._trigger("update", event, this, noPropagation);
				}
			};
		};

		//Post events to containers
		for (var i = this.containers.length - 1; i >= 0; i--){
			this.containers[i]._trigger("deactivate", event, this, noPropagation);
			if(this.containers[i].containerCache.over) {
				this.containers[i]._trigger("out", event, this);
				this.containers[i].containerCache.over = 0;
			}
		}

		this.dragging = false;
		if(this.cancelHelperRemoval) {
			this._trigger("beforeStop", event, null, noPropagation);
			this._trigger("stop", event, null, noPropagation);
			return false;
		}

		this._trigger("beforeStop", event, null, noPropagation);

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if(this.helper[0] != this.currentItem[0]) this.helper.remove(); this.helper = null;
		this._trigger("stop", event, null, noPropagation);

		this.fromOutside = false;
		return true;

	},

	_trigger: function(type, event, inst, noPropagation) {
		$.ui.plugin.call(this, type, [event, this._uiHash(inst)]);
		if(!noPropagation) {
			if ($.widget.prototype._trigger.call(this, type, event, this._uiHash(inst)) === false) {
				this.cancel();
			}
		}
	},

	plugins: {},

	_uiHash: function(inst) {
		var self = inst || this;
		return {
			helper: self.helper,
			placeholder: self.placeholder || $([]),
			position: self.position,
			absolutePosition: self.positionAbs,
			item: self.currentItem,
			sender: inst ? inst.element : null
		};
	}

}));

$.extend($.ui.sortable, {
	getter: "serialize toArray",
	version: "1.6rc5",
	defaults: {
		accurateIntersection: true,
		appendTo: "parent",
		cancel: ":input,option",
		cssNamespace: 'ui',
		delay: 0,
		distance: 1,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		helper: "original",
		items: '> *',
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		sortIndicator: $.ui.sortable.prototype._rearrange,
		tolerance: "default",
		zIndex: 1000
	}
});

/*
 * Sortable Extensions
 */

$.ui.plugin.add("sortable", "cursor", {
	start: function(event, ui) {
		var t = $('body'), i = $(this).data('sortable');
		if (t.css("cursor")) i.options._cursor = t.css("cursor");
		t.css("cursor", i.options.cursor);
	},
	beforeStop: function(event, ui) {
		var i = $(this).data('sortable');
		if (i.options._cursor) $('body').css("cursor", i.options._cursor);
	}
});

$.ui.plugin.add("sortable", "opacity", {
	start: function(event, ui) {
		var t = ui.helper, i = $(this).data('sortable');
		if(t.css("opacity")) i.options._opacity = t.css("opacity");
		t.css('opacity', i.options.opacity);
	},
	beforeStop: function(event, ui) {
		var i = $(this).data('sortable');
		if(i.options._opacity) $(ui.helper).css('opacity', i.options._opacity);
	}
});

$.ui.plugin.add("sortable", "scroll", {
	start: function(event, ui) {
		var i = $(this).data("sortable"), o = i.options;
		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
	},
	sort: function(event, ui) {

		var i = $(this).data("sortable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
				i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
			else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
				i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;

			if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
				i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
			else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
				i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;

		} else {

			if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
				scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
			else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
				scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);

			if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
				scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
			else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
				scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(i, event);

	}
});

$.ui.plugin.add("sortable", "zIndex", {
	start: function(event, ui) {
		var t = ui.helper, i = $(this).data('sortable');
		if(t.css("zIndex")) i.options._zIndex = t.css("zIndex");
		t.css('zIndex', i.options.zIndex);
	},
	beforeStop: function(event, ui) {
		var i = $(this).data('sortable');
		if(i.options._zIndex) $(ui.helper).css('zIndex', i.options._zIndex == 'auto' ? '' : i.options._zIndex);
	}
});

})(jQuery);
/*
 * jQuery UI Accordion 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Accordion
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.accordion", {

	_init: function() {
		var options = this.options;

		if ( options.navigation ) {
			var current = this.element.find("a").filter(options.navigationFilter);
			if ( current.length ) {
				if ( current.filter(options.header).length ) {
					options.active = current;
				} else {
					options.active = current.parent().parent().prev();
					current.addClass("ui-accordion-current");
				}
			}
		}

		this.element.addClass("ui-accordion ui-widget ui-helper-reset");
		var groups = this.element.children().addClass("ui-accordion-group");
		var headers = options.headers = groups.find("> :first-child").addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all")
		.bind("mouseenter.accordion", function(){ $(this).addClass('ui-state-hover'); })
		.bind("mouseleave.accordion", function(){ $(this).removeClass('ui-state-hover'); });
		// wrap content elements in div against animation issues
		headers.next().wrap("<div></div>").addClass("ui-accordion-content").parent().addClass("ui-accordion-content-wrap ui-helper-reset ui-widget-content ui-corner-bottom");

		var active = options.active = findActive(headers, options.active).toggleClass("ui-state-default").toggleClass("ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top");
		active.parent().addClass(options.selectedClass);
		$("<span/>").addClass("ui-icon " + this.options.icons.header).prependTo(headers);
		active.find(".ui-icon").toggleClass(this.options.icons.header).toggleClass(this.options.icons.headerSelected);

		// IE7-/Win - Extra vertical space in Lists fixed
		if ($.browser.msie) {
			this.element.find('a').css('zoom', '1');
		}

		this.resize();

		this.element.attr('role','tablist');

		var self=this;
		options.headers
			.attr('role','tab')
			.bind('keydown', function(event) { return self._keydown(event); })
			.next()
			.attr('role','tabpanel');

		options.headers
			.not(options.active || "")
			.attr('aria-expanded','false')
			.attr("tabIndex", "-1")
			.next()
			.hide();

		// make sure at least one header is in the tab order
		if (!options.active.length) {
			options.headers.eq(0).attr('tabIndex','0');
		} else {
			options.active
				.attr('aria-expanded','true')
				.attr("tabIndex", "0");
		}

		// only need links in taborder for Safari
		if (!$.browser.safari)
			options.headers.find('a').attr('tabIndex','-1');

		if (options.event) {
			this.element.bind((options.event) + ".accordion", clickHandler);
		}
	},

	destroy: function() {
		this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role").unbind(".accordion");
		$.removeData(this.element[0], "accordion");
		var groups = this.element.children().removeClass("ui-accordion-group "+this.options.selectedClass);
		var headers = this.options.headers.unbind(".accordion").removeClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-corner-top")
			.removeAttr("role").removeAttr("aria-expanded").removeAttr("tabindex");
		headers.find("a").removeAttr("tabindex");
		headers.children(".ui-icon").remove();
		headers.next().children().removeClass("ui-accordion-content").each(function(){
			$(this).parent().replaceWith(this);
		})
	},

	_keydown: function(event) {
		if (this.options.disabled || event.altKey || event.ctrlKey)
			return;

		var keyCode = $.ui.keyCode;

		var length = this.options.headers.length;
		var currentIndex = this.options.headers.index(event.target);
		var toFocus = false;

		switch(event.keyCode) {
			case keyCode.RIGHT:
			case keyCode.DOWN:
				toFocus = this.options.headers[(currentIndex + 1) % length];
				break;
			case keyCode.LEFT:
			case keyCode.UP:
				toFocus = this.options.headers[(currentIndex - 1 + length) % length];
				break;
			case keyCode.SPACE:
			case keyCode.ENTER:
				return clickHandler.call(this.element[0], { target: event.target });
		}

		if (toFocus) {
			$(event.target).attr('tabIndex','-1');
			$(toFocus).attr('tabIndex','0');
			toFocus.focus();
			return false;
		}

		return true;
	},

	resize: function() {
		var options = this.options,
			maxHeight;
		if ( options.fillSpace ) {
			maxHeight = this.element.parent().height();
			options.headers.each(function() {
				maxHeight -= $(this).outerHeight();
			});
			var maxPadding = 0;
			options.headers.next().each(function() {
				maxPadding = Math.max(maxPadding, $(this).innerHeight() - $(this).height());
			}).height(maxHeight - maxPadding)
			.css('overflow', 'auto');
		} else if ( options.autoHeight ) {
			maxHeight = 0;
			options.headers.next().each(function() {
				maxHeight = Math.max(maxHeight, $(this).outerHeight());
			}).height(maxHeight);
		}
	},

	activate: function(index) {
		// call clickHandler with custom event
		clickHandler.call(this.element[0], {
			target: findActive( this.options.headers, index )[0]
		});
	}

});

function scopeCallback(callback, scope) {
	return function() {
		return callback.apply(scope, arguments);
	};
};

function completed(cancel) {
	// if removed while animated data can be empty
	if (!$.data(this, "accordion")) {
		return;
	}

	var instance = $.data(this, "accordion");
	var options = instance.options;
	options.running = cancel ? 0 : --options.running;
	if ( options.running ) {
		return;
	}
	if ( options.clearStyle ) {
		options.toShow.add(options.toHide).css({
			height: "",
			overflow: ""
		});
	}
	instance._trigger('change', null, options.data);
}

function toggle(toShow, toHide, data, clickedActive, down) {
	var options = $.data(this, "accordion").options;
	options.toShow = toShow;
	options.toHide = toHide;
	options.data = data;
	var complete = scopeCallback(completed, this);

	$.data(this, "accordion")._trigger("changestart", null, options.data);

	// count elements to animate
	options.running = toHide.size() === 0 ? toShow.size() : toHide.size();

	if ( options.animated ) {
		var animOptions = {};

		if ( !options.alwaysOpen && clickedActive ) {
			animOptions = {
				toShow: $([]),
				toHide: toHide,
				complete: complete,
				down: down,
				autoHeight: options.autoHeight || options.fillSpace
			};
		} else {
			animOptions = {
				toShow: toShow,
				toHide: toHide,
				complete: complete,
				down: down,
				autoHeight: options.autoHeight || options.fillSpace
			};
		}

		if (!options.proxied) {
			options.proxied = options.animated;
		}

		if (!options.proxiedDuration) {
			options.proxiedDuration = options.duration;
		}

		options.animated = $.isFunction(options.proxied) ?
			options.proxied(animOptions) : options.proxied;

		options.duration = $.isFunction(options.proxiedDuration) ?
			options.proxiedDuration(animOptions) : options.proxiedDuration;

		var animations = $.ui.accordion.animations,
			duration = options.duration,
			easing = options.animated;

		if (!animations[easing]) {
			animations[easing] = function(options) {
				this.slide(options, {
					easing: easing,
					duration: duration || 700
				});
			};
		}

		animations[easing](animOptions);

	} else {
		if ( !options.alwaysOpen && clickedActive ) {
			toShow.toggle();
		} else {
			toHide.hide();
			toShow.show();
		}
		complete(true);
	}
	toHide.prev().attr('aria-expanded','false').attr("tabIndex", "-1");
	toShow.prev().attr('aria-expanded','true').attr("tabIndex", "0").focus();;
}

function clickHandler(event) {
	var options = $.data(this, "accordion").options;
	if (options.disabled) {
		return false;
	}
	// called only when using activate(false) to close all parts programmatically
	if ( !event.target && !options.alwaysOpen ) {
		options.active.parent().toggleClass(options.selectedClass);
		var toHide = options.active.next(),
			data = {
				options: options,
				newHeader: $([]),
				oldHeader: options.active,
				newContent: $([]),
				oldContent: toHide
			},
			toShow = (options.active = $([]));
		toggle.call(this, toShow, toHide, data );
		return false;
	}
	// get the click target
	var clicked = $(event.target);

	// due to the event delegation model, we have to check if one
	// of the parent elements is our actual header, and find that
	// otherwise stick with the initial target
	clicked = $( clicked.parents(options.header)[0] || clicked );

	var clickedActive = clicked[0] == options.active[0];

	// if animations are still active, or the active header is the target, ignore click
	if (options.running || (options.alwaysOpen && clickedActive)) {
		return false;
	}
	if (!clicked.is(options.header)) {
		return;
	}

	// switch classes
	options.active.parent().toggleClass(options.selectedClass);
	options.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all")
		.find(".ui-icon").removeClass(options.icons.headerSelected).addClass(options.icons.header);
	if ( !clickedActive ) {
		clicked.parent().addClass(options.selectedClass);
		clicked.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top")
			.find(".ui-icon").removeClass(options.icons.header).addClass(options.icons.headerSelected);
	}

	// find elements to show and hide
	var toShow = clicked.next(),
		toHide = options.active.next(),
		data = {
			options: options,
			newHeader: clickedActive && !options.alwaysOpen ? $([]) : clicked,
			oldHeader: options.active,
			newContent: clickedActive && !options.alwaysOpen ? $([]) : toShow,
			oldContent: toHide
		},
		down = options.headers.index( options.active[0] ) > options.headers.index( clicked[0] );

	options.active = clickedActive ? $([]) : clicked;
	toggle.call(this, toShow, toHide, data, clickedActive, down );

	return false;
};

function findActive(headers, selector) {
	return selector
		? typeof selector == "number"
			? headers.filter(":eq(" + selector + ")")
			: headers.not(headers.not(selector))
		: selector === false
			? $([])
			: headers.filter(":eq(0)");
}

$.extend($.ui.accordion, {
	version: "1.6rc5",
	defaults: {
		autoHeight: true,
		alwaysOpen: true,
		animated: 'slide',
		event: "click",
		header: "a",
		icons: {
			header: "ui-icon-triangle-1-e",
			headerSelected: "ui-icon-triangle-1-s"
		},
		navigationFilter: function() {
			return this.href.toLowerCase() == location.href.toLowerCase();
		},
		running: 0,
		selectedClass: "ui-accordion-selected"
	},
	animations: {
		slide: function(options, additions) {
			options = $.extend({
				easing: "swing",
				duration: 300
			}, options, additions);
			if ( !options.toHide.size() ) {
				options.toShow.animate({height: "show"}, options);
				return;
			}
			var hideHeight = options.toHide.height(),
				showHeight = options.toShow.height(),
				difference = showHeight / hideHeight,
				overflow = options.toShow.css('overflow');
			options.toShow.css({ height: 0, overflow: 'hidden' }).show();
			options.toHide.filter(":hidden").each(options.complete).end().filter(":visible").animate({height:"hide"},{
				step: function(now) {
					var current = (hideHeight - now) * difference;
					if ($.browser.msie || $.browser.opera) {
						current = Math.ceil(current);
					}
					options.toShow.height( current );
				},
				duration: options.duration,
				easing: options.easing,
				complete: function() {
					if ( !options.autoHeight ) {
						options.toShow.css("height", "auto");
					}
					options.toShow.css({overflow: overflow});
					options.complete();
				}
			});
		},
		bounceslide: function(options) {
			this.slide(options, {
				easing: options.down ? "easeOutBounce" : "swing",
				duration: options.down ? 1000 : 200
			});
		},
		easeslide: function(options) {
			this.slide(options, {
				easing: "easeinout",
				duration: 700
			});
		}
	}
});

})(jQuery);
/*
 * jQuery UI Dialog 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *	ui.core.js
 *	ui.draggable.js
 *	ui.resizable.js
 */
(function($) {

var setDataSwitch = {
	dragStart: "start.draggable",
	drag: "drag.draggable",
	dragStop: "stop.draggable",
	maxHeight: "maxHeight.resizable",
	minHeight: "minHeight.resizable",
	maxWidth: "maxWidth.resizable",
	minWidth: "minWidth.resizable",
	resizeStart: "start.resizable",
	resize: "drag.resizable",
	resizeStop: "stop.resizable"
};

$.widget("ui.dialog", {

	_init: function() {
		this.originalTitle = this.element.attr('title');
		this.options.title = this.options.title || this.originalTitle;

		var self = this,
			options = this.options,

			title = options.title || '&nbsp;',
			titleId = $.ui.dialog.getTitleId(this.element),

			uiDialog = (this.uiDialog = $('<div/>'))
				.appendTo(document.body)
				.hide()
				.addClass(
					'ui-dialog ' +
					'ui-widget ' +
					'ui-widget-content ' +
					'ui-corner-all ' +
					options.dialogClass
				)
				.css({
					position: 'absolute',
					overflow: 'hidden',
					zIndex: options.zIndex
				})
				// setting tabIndex makes the div focusable
				// setting outline to 0 prevents a border on focus in Mozilla
				.attr('tabIndex', -1).css('outline', 0).keydown(function(ev) {
					(options.closeOnEscape && ev.keyCode
						&& ev.keyCode == $.ui.keyCode.ESCAPE && self.close());
				})
				.attr({
					role: 'dialog',
					'aria-labelledby': titleId
				})
				.mousedown(function() {
					self.moveToTop();
				}),

			uiDialogContent = this.element
				.show()
				.removeAttr('title')
				.addClass(
					'ui-dialog-content ' +
					'ui-widget-content')
				.appendTo(uiDialog),

			uiDialogTitlebar = (this.uiDialogTitlebar = $('<div></div>'))
				.addClass(
					'ui-dialog-titlebar ' +
					'ui-widget-header ' +
					'ui-corner-all ' +
					'ui-helper-clearfix'
				)
				.prependTo(uiDialog),

			uiDialogTitlebarClose = $('<a href="#"/>')
				.addClass(
					'ui-dialog-titlebar-close ' +
					'ui-corner-all'
				)
				.attr('role', 'button')
				.hover(
					function() {
						uiDialogTitlebarClose.addClass('ui-state-hover');
					},
					function() {
						uiDialogTitlebarClose.removeClass('ui-state-hover');
					}
				)
				.focus(function() {
					uiDialogTitlebarClose.addClass('ui-state-focus');
				})
				.blur(function() {
					uiDialogTitlebarClose.removeClass('ui-state-focus');
				})
				.mousedown(function(ev) {
					ev.stopPropagation();
				})
				.click(function() {
					self.close();
					return false;
				})
				.appendTo(uiDialogTitlebar),

			uiDialogTitlebarCloseText = (this.uiDialogTitlebarCloseText = $('<span/>'))
				.addClass(
					'ui-icon ' +
					'ui-icon-closethick'
				)
				.text(options.closeText)
				.appendTo(uiDialogTitlebarClose),

			uiDialogTitle = $('<span/>')
				.addClass('ui-dialog-title')
				.attr('id', titleId)
				.html(title)
				.prependTo(uiDialogTitlebar),

			uiDialogButtonPane = (this.uiDialogButtonPane = $('<div></div>'))
				.addClass(
					'ui-dialog-buttonpane ' +
					'ui-widget-content ' +
					'ui-helper-clearfix'
				)
				.appendTo(uiDialog);

		uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();

		(options.draggable && $.fn.draggable && this._makeDraggable());
		(options.resizable && $.fn.resizable && this._makeResizable());

		this._createButtons(options.buttons);
		this._isOpen = false;

		(options.bgiframe && $.fn.bgiframe && uiDialog.bgiframe());
		(options.autoOpen && this.open());
	},

	destroy: function() {
		(this.overlay && this.overlay.destroy());
		this.uiDialog.hide();
		this.element
			.unbind('.dialog')
			.removeData('dialog')
			.removeClass('ui-dialog-content ui-widget-content')
			.hide().appendTo('body');
		this.uiDialog.remove();

		(this.originalTitle && this.element.attr('title', this.originalTitle));
	},

	close: function() {
		if (false === this._trigger('beforeclose')) {
			return;
		}

		(this.overlay && this.overlay.destroy());
		this.uiDialog
			.hide(this.options.hide)
			.unbind('keypress.ui-dialog');

		this._trigger('close');
		$.ui.dialog.overlay.resize();

		this._isOpen = false;
	},

	isOpen: function() {
		return this._isOpen;
	},

	// the force parameter allows us to move modal dialogs to their correct
	// position on open
	moveToTop: function(force) {

		if ((this.options.modal && !force)
			|| (!this.options.stack && !this.options.modal)) {
			return this._trigger('focus');
		}

		var maxZ = this.options.zIndex, options = this.options;
		$('.ui-dialog:visible').each(function() {
			maxZ = Math.max(maxZ, parseInt($(this).css('z-index'), 10) || options.zIndex);
		});
		(this.overlay && this.overlay.$el.css('z-index', ++maxZ));

		//Save and then restore scroll since Opera 9.5+ resets when parent z-Index is changed.
		//  http://ui.jquery.com/bugs/ticket/3193
		var saveScroll = { scrollTop: this.element.attr('scrollTop'), scrollLeft: this.element.attr('scrollLeft') };
		this.uiDialog.css('z-index', ++maxZ);
		this.element.attr(saveScroll);
		this._trigger('focus');
	},

	open: function() {
		if (this._isOpen) { return; }

		this.overlay = this.options.modal ? new $.ui.dialog.overlay(this) : null;
		(this.uiDialog.next().length && this.uiDialog.appendTo('body'));
		this._size();
		this._position(this.options.position);
		this.uiDialog.show(this.options.show);
		this.moveToTop(true);

		// prevent tabbing out of modal dialogs
		(this.options.modal && this.uiDialog.bind('keypress.ui-dialog', function(event) {
			if (event.keyCode != $.ui.keyCode.TAB) {
				return;
			}

			var tabbables = $(':tabbable', this),
				first = tabbables.filter(':first')[0],
				last  = tabbables.filter(':last')[0];

			if (event.target == last && !event.shiftKey) {
				setTimeout(function() {
					first.focus();
				}, 1);
			} else if (event.target == first && event.shiftKey) {
				setTimeout(function() {
					last.focus();
				}, 1);
			}
		}));

		this.uiDialog.find(':tabbable:first').focus();
		this._trigger('open');
		this._isOpen = true;
	},

	_createButtons: function(buttons) {
		var self = this,
			hasButtons = false,
			uiDialogButtonPane = this.uiDialogButtonPane;

		// remove any existing buttons
		uiDialogButtonPane.empty().hide();

		$.each(buttons, function() { return !(hasButtons = true); });
		if (hasButtons) {
			uiDialogButtonPane.show();
			$.each(buttons, function(name, fn) {
				$('<button type="button"></button>')
					.addClass(
						'ui-state-default ' +
						'ui-corner-all'
					)
					.text(name)
					.click(function() { fn.apply(self.element[0], arguments); })
					.hover(
						function() {
							$(this).addClass('ui-state-hover');
						},
						function() {
							$(this).removeClass('ui-state-hover');
						}
					)
					.focus(function() {
						$(this).addClass('ui-state-focus');
					})
					.blur(function() {
						$(this).removeClass('ui-state-focus');
					})
					.appendTo(uiDialogButtonPane);
			});
		}
	},

	_makeDraggable: function() {
		var self = this,
			options = this.options;

		this.uiDialog.draggable({
			cancel: '.ui-dialog-content',
			helper: options.dragHelper,
			handle: '.ui-dialog-titlebar',
			containment: 'document',
			start: function() {
				(options.dragStart && options.dragStart.apply(self.element[0], arguments));
			},
			drag: function() {
				(options.drag && options.drag.apply(self.element[0], arguments));
			},
			stop: function() {
				(options.dragStop && options.dragStop.apply(self.element[0], arguments));
				$.ui.dialog.overlay.resize();
			}
		});
	},

	_makeResizable: function(handles) {
		handles = (handles === undefined ? this.options.resizable : handles);
		var self = this,
			options = this.options,
			resizeHandles = typeof handles == 'string'
				? handles
				: 'n,e,s,w,se,sw,ne,nw';

		this.uiDialog.resizable({
			cancel: '.ui-dialog-content',
			alsoResize: this.element,
			helper: options.resizeHelper,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: options.minHeight,
			start: function() {
				(options.resizeStart && options.resizeStart.apply(self.element[0], arguments));
			},
			resize: function() {
				(options.resize && options.resize.apply(self.element[0], arguments));
			},
			handles: resizeHandles,
			stop: function() {
				(options.resizeStop && options.resizeStop.apply(self.element[0], arguments));
				$.ui.dialog.overlay.resize();
			}
		})
		.find('.ui-resizable-se').addClass('ui-icon ui-icon-grip-diagonal-se');
	},

	_position: function(pos) {
		var wnd = $(window), doc = $(document),
			pTop = doc.scrollTop(), pLeft = doc.scrollLeft(),
			minTop = pTop;

		if ($.inArray(pos, ['center','top','right','bottom','left']) >= 0) {
			pos = [
				pos == 'right' || pos == 'left' ? pos : 'center',
				pos == 'top' || pos == 'bottom' ? pos : 'middle'
			];
		}
		if (pos.constructor != Array) {
			pos = ['center', 'middle'];
		}
		if (pos[0].constructor == Number) {
			pLeft += pos[0];
		} else {
			switch (pos[0]) {
				case 'left':
					pLeft += 0;
					break;
				case 'right':
					pLeft += wnd.width() - this.uiDialog.outerWidth();
					break;
				default:
				case 'center':
					pLeft += (wnd.width() - this.uiDialog.outerWidth()) / 2;
			}
		}
		if (pos[1].constructor == Number) {
			pTop += pos[1];
		} else {
			switch (pos[1]) {
				case 'top':
					pTop += 0;
					break;
				case 'bottom':
					pTop += wnd.height() - this.uiDialog.outerHeight();
					break;
				default:
				case 'middle':
					pTop += (wnd.height() - this.uiDialog.outerHeight()) / 2;
			}
		}

		// prevent the dialog from being too high (make sure the titlebar
		// is accessible)
		pTop = Math.max(pTop, minTop);
		this.uiDialog.css({top: pTop, left: pLeft});
	},

	_setData: function(key, value){
		(setDataSwitch[key] && this.uiDialog.data(setDataSwitch[key], value));
		switch (key) {
			case "buttons":
				this._createButtons(value);
				break;
			case "closeText":
				this.uiDialogTitlebarCloseText.text(value);
				break;
			case "draggable":
				(value
					? this._makeDraggable()
					: this.uiDialog.draggable('destroy'));
				break;
			case "height":
				this.uiDialog.height(value);
				break;
			case "position":
				this._position(value);
				break;
			case "resizable":
				var uiDialog = this.uiDialog,
					isResizable = this.uiDialog.is(':data(resizable)');

				// currently resizable, becoming non-resizable
				(isResizable && !value && uiDialog.resizable('destroy'));

				// currently resizable, changing handles
				(isResizable && typeof value == 'string' &&
					uiDialog.resizable('option', 'handles', value));

				// currently non-resizable, becoming resizable
				(isResizable || this._makeResizable(value));

				break;
			case "title":
				$(".ui-dialog-title", this.uiDialogTitlebar).html(value || '&nbsp;');
				break;
			case "width":
				this.uiDialog.width(value);
				break;
		}

		$.widget.prototype._setData.apply(this, arguments);
	},

	_size: function() {
		/* If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		 * divs will both have width and height set, so we need to reset them
		 */
		var options = this.options;

		// reset content sizing
		this.element.css({
			height: 0,
			minHeight: 0,
			width: 'auto'
		});

		// reset wrapper sizing
		// determine the height of all the non-content elements
		var nonContentHeight = this.uiDialog.css({
				height: 'auto',
				width: options.width
			})
			.height();

		this.element
			.css({
				minHeight: options.minHeight - nonContentHeight,
				height: options.height == 'auto'
					? 'auto'
					: options.height - nonContentHeight
			});
	}
});

$.extend($.ui.dialog, {
	version: "1.6rc5",
	defaults: {
		autoOpen: true,
		bgiframe: false,
		buttons: {},
		closeOnEscape: true,
		closeText: 'close',
		draggable: true,
		height: 'auto',
		minHeight: 150,
		minWidth: 150,
		modal: false,
		overlay: {},
		position: 'center',
		resizable: true,
		stack: true,
		width: 300,
		zIndex: 1000
	},

	getter: 'isOpen',

	uuid: 0,

	getTitleId: function($el) {
		return 'ui-dialog-title-' + ($el.attr('id') || ++this.uuid);
	},

	overlay: function(dialog) {
		this.$el = $.ui.dialog.overlay.create(dialog);
	}
});

$.extend($.ui.dialog.overlay, {
	instances: [],
	events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
		function(event) { return event + '.dialog-overlay'; }).join(' '),
	create: function(dialog) {
		if (this.instances.length === 0) {
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling (see #2804)
			setTimeout(function() {
				$('a, :input').bind($.ui.dialog.overlay.events, function() {
					// allow use of the element if inside a dialog and
					// - there are no modal dialogs
					// - there are modal dialogs, but we are in front of the topmost modal
					var allow = false;
					var $dialog = $(this).parents('.ui-dialog');
					if ($dialog.length) {
						var $overlays = $('.ui-dialog-overlay');
						if ($overlays.length) {
							var maxZ = parseInt($overlays.css('z-index'), 10);
							$overlays.each(function() {
								maxZ = Math.max(maxZ, parseInt($(this).css('z-index'), 10));
							});
							allow = parseInt($dialog.css('z-index'), 10) > maxZ;
						} else {
							allow = true;
						}
					}
					return allow;
				});
			}, 1);

			// allow closing by pressing the escape key
			$(document).bind('keydown.dialog-overlay', function(event) {
				(dialog.options.closeOnEscape && event.keyCode
						&& event.keyCode == $.ui.keyCode.ESCAPE && dialog.close());
			});

			// handle window resize
			$(window).bind('resize.dialog-overlay', $.ui.dialog.overlay.resize);
		}

		var $el = $('<div></div>').appendTo(document.body)
			.addClass('ui-dialog-overlay').css($.extend({
				borderWidth: 0, margin: 0, padding: 0,
				position: 'absolute', top: 0, left: 0,
				width: this.width(),
				height: this.height()
			}, dialog.options.overlay));

		(dialog.options.bgiframe && $.fn.bgiframe && $el.bgiframe());

		this.instances.push($el);
		return $el;
	},

	destroy: function($el) {
		this.instances.splice($.inArray(this.instances, $el), 1);

		if (this.instances.length === 0) {
			$('a, :input').add([document, window]).unbind('.dialog-overlay');
		}

		$el.remove();
	},

	height: function() {
		// handle IE 6
		if ($.browser.msie && $.browser.version < 7) {
			var scrollHeight = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			var offsetHeight = Math.max(
				document.documentElement.offsetHeight,
				document.body.offsetHeight
			);

			if (scrollHeight < offsetHeight) {
				return $(window).height() + 'px';
			} else {
				return scrollHeight + 'px';
			}
		// handle "good" browsers
		} else {
			return $(document).height() + 'px';
		}
	},

	width: function() {
		// handle IE 6
		if ($.browser.msie && $.browser.version < 7) {
			var scrollWidth = Math.max(
				document.documentElement.scrollWidth,
				document.body.scrollWidth
			);
			var offsetWidth = Math.max(
				document.documentElement.offsetWidth,
				document.body.offsetWidth
			);

			if (scrollWidth < offsetWidth) {
				return $(window).width() + 'px';
			} else {
				return scrollWidth + 'px';
			}
		// handle "good" browsers
		} else {
			return $(document).width() + 'px';
		}
	},

	resize: function() {
		/* If the dialog is draggable and the user drags it past the
		 * right edge of the window, the document becomes wider so we
		 * need to stretch the overlay. If the user then drags the
		 * dialog back to the left, the document will become narrower,
		 * so we need to shrink the overlay to the appropriate size.
		 * This is handled by shrinking the overlay before setting it
		 * to the full document size.
		 */
		var $overlays = $([]);
		$.each($.ui.dialog.overlay.instances, function() {
			$overlays = $overlays.add(this);
		});

		$overlays.css({
			width: 0,
			height: 0
		}).css({
			width: $.ui.dialog.overlay.width(),
			height: $.ui.dialog.overlay.height()
		});
	}
});

$.extend($.ui.dialog.overlay.prototype, {
	destroy: function() {
		$.ui.dialog.overlay.destroy(this.$el);
	}
});

})(jQuery);
/*
 * jQuery UI Slider 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *	ui.core.js
 */

(function($) {

$.widget("ui.slider", $.extend({}, $.ui.mouse, {

	_init: function() {

		var self = this, o = this.options;
		this._keySliding = false;
		this._handleIndex = null;
		this.orientation = o.orientation == 'auto' ? (this.element[0].offsetWidth/this.element[0].offsetHeight > 1 ? 'horizontal' : 'vertical') : o.orientation;

		this._mouseInit();

		this.element
			.addClass("ui-slider"
				+ " ui-slider-" + this.orientation
				+ " ui-widget"
				+ " ui-widget-content"
				+ " ui-corner-all");

		this.range = $([]);

		if (o.range) {
			
			if (o.range === true) {
				this.range = $('<div></div>');
				if (!o.values) o.values = [this._valueMin(), this._valueMin()];
				if (o.values.length && o.values.length != 2) {
					o.values = [o.values[0], o.values[0]];
				}
			} else {
				this.range = $('<div></div>');
			}

			this.range
				.appendTo(this.element)
				.addClass("ui-slider-range"
					+ " ui-widget-header");

			(o.range == "min") && (this.orientation == "horizontal") && this.range.css({ left : 0 });
			(o.range == "max") && (this.orientation == "horizontal") && this.range.css({ right : 0 });
			(o.range == "min") && (this.orientation == "vertical") && this.range.css({ bottom : 0 });
			(o.range == "max") && (this.orientation == "vertical") && this.range.css({ top : 0 });
			
		}

		if ($(".ui-slider-handle", this.element).length == 0)
			$('<a href="#"></a>')
				.appendTo(this.element)
				.addClass("ui-slider-handle");

		if (o.values && o.values.length) {
			while ($(".ui-slider-handle", this.element).length < o.values.length)
				$('<a href="#"></a>')
					.appendTo(this.element)
					.addClass("ui-slider-handle");
		}

		this.handles = $(".ui-slider-handle", this.element)
			.addClass("ui-state-default"
				+ " ui-corner-all");

		this.handle = this.handles.eq(0);

		this.handles.add(this.range).filter("a")
			.click(function(event) { event.preventDefault(); })
			.hover(function() { $(this).addClass('ui-state-hover'); }, function() { $(this).removeClass('ui-state-hover'); })
			.focus(function() { self.handles.removeClass('ui-state-focus'); $(this).addClass('ui-state-focus'); })
			.blur(function() { $(this).removeClass('ui-state-focus'); });

		this.handles.each(function(i) {
			$(this).data("index.ui-slider-handle", i);
		});

		this.handles.keydown(function(event) {

			var index = $(this).data("index.ui-slider-handle");

			if (self.options.disabled)
				return;

			switch (event.keyCode) {
				case $.ui.keyCode.HOME:
				case $.ui.keyCode.END:
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					if (!self._keySliding) {
						self._keySliding = true;
						$(this).addClass("ui-state-active");
						self._start(event);
					}
					break;
			}

			var curVal, newVal, step = self._step();
			if (self.options.values && self.options.values.length) {
				curVal = newVal = self.values(index);
			} else {
				curVal = newVal = self.value();
			}

			switch (event.keyCode) {
				case $.ui.keyCode.HOME:
					newVal = self._valueMin();
					break;
				case $.ui.keyCode.END:
					newVal = self._valueMax();
					break;
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
					newVal = curVal + step;
					break;
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					newVal = curVal - step;
					break;
			}

			self._slide(event, index, newVal);

		}).keyup(function(event) {

			if (self._keySliding) {
				self._stop(event);
				self._change(event);
				self._keySliding = false;
				$(this).removeClass("ui-state-active");
			}

		});

		this._refreshValue();

	},

	destroy: function() {

		this.handles.remove();

		this.element
			.removeClass("ui-slider"
				+ " ui-slider-horizontal"
				+ " ui-slider-vertical"
				+ " ui-slider-disabled"
				+ " ui-widget"
				+ " ui-widget-content"
				+ " ui-corner-all")
			.removeData("slider")
			.unbind(".slider");

		this._mouseDestroy();

	},

	_mouseCapture: function(event) {

		var o = this.options;

		if (o.disabled)
			return false;

		this._start(event);

		this.elementSize = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
		this.elementOffset = this.element.offset();

		var position = { x: event.pageX, y: event.pageY };
		var normValue = this._normValueFromMouse(position);

		var distance = this._valueMax(), closestHandle;
		var self = this, index;
		this.handles.each(function(i) {
			var thisDistance = Math.abs(normValue - self.values(i));
			if (distance > thisDistance) {
				distance = thisDistance;
				closestHandle = $(this);
				index = i;
			}
		});

		self._handleIndex = index;

		closestHandle
			.addClass("ui-state-active")
			.focus();

		this._slide(event, index, normValue);

		return true;

	},

	_mouseStart: function(event) {
		return true;
	},

	_mouseDrag: function(event) {
		
		var position = { x: event.pageX, y: event.pageY };
		var normValue = this._normValueFromMouse(position);

		this._slide(event, this._handleIndex, normValue);

		return false;
		
	},

	_mouseStop: function(event) {
		
		this.handles.removeClass("ui-state-active");
		this._stop(event);
		this._change(event);
		this._handleIndex = null;

		return false;
		
	},

	_normValueFromMouse: function(position) {

		var pixelTotal, pixelMouse;
		if ('horizontal' == this.orientation) {
			pixelTotal = this.elementSize.width;
			pixelMouse = position.x - this.elementOffset.left;
		} else {
			pixelTotal = this.elementSize.height;
			pixelMouse = position.y - this.elementOffset.top;
		}

		var percentMouse = (pixelMouse / pixelTotal);
		if (percentMouse > 1) percentMouse = 1;
		if (percentMouse < 0) percentMouse = 0;
		if ('vertical' == this.orientation)
			percentMouse = 1 - percentMouse;

		var valueTotal = this._valueMax() - this._valueMin(),
			valueMouse = percentMouse * valueTotal,
			valueMouseModStep = valueMouse % this.options.step,
			normValue = this._valueMin() + valueMouse - valueMouseModStep;

		if (valueMouseModStep > (this.options.step / 2))
			normValue += this.options.step;

		return normValue;
		
	},

	_start: function(event) {
		this._trigger("start", event, {
			value: this.value()
		});
	},

	_slide: function(event, index, newVal) {
		
		if (this.options.values && this.options.values.length) {

			var handle = this.handles[index];
			var otherVal = this.values(index ? 0 : 1);

			if ((index == 0 && newVal >= otherVal) || (index == 1 && newVal <= otherVal))
				newVal = otherVal;

			if (newVal != this.values(index)) {
				var newValues = this.values();
				newValues[index] = newVal;
				// A slide can be canceled by returning false from the slide callback
				var allowed = this._trigger("slide", event, {
					handle: handle,
					value: newVal,
					values: newValues
				});
				var otherVal = this.values(index ? 0 : 1);
				if (allowed !== false) {
					this.values(index, newVal);
				}
			}

		} else {

			if (newVal != this.value()) {
				// A slide can be canceled by returning false from the slide callback
				var allowed = this._trigger("slide", event, {
					value: newVal
				});
				if (allowed !== false)
					this._setData('value', newVal);
			}

		}

	},

	_stop: function(event) {
		this._trigger("stop", event, {
			value: this.value()
		});
	},

	_change: function(event) {
		this._trigger("change", event, {
			value: this.value()
		});
	},

	value: function(newValue) {

		if (arguments.length) {
			this._setData("value", newValue);
			this._change();
		}

		return this._value();

	},

	values: function(index, newValue) {

		if (arguments.length > 1) {
			this.options.values[index] = newValue;
			this._refreshValue();
			this._change();
		}

		if (arguments.length) {
			if (this.options.values && this.options.values.length) {
				return this._values(index);
			} else {
				return this.value();
			}
		} else {
			return this._values();
		}

	},

	_setData: function(key, value) {

		$.widget.prototype._setData.apply(this, arguments);

		switch (key) {
			case 'orientation':

				this.orientation = this.options.orientation == 'auto' ? (this.element[0].offsetWidth/this.element[0].offsetHeight > 1 ? 'horizontal' : 'vertical') : this.options.orientation;

				this.element
					.removeClass("ui-slider-horizontal ui-slider-vertical")
					.addClass("ui-slider-" + this._orientation());
				this._refreshValue();
				break;
			case 'value':
				this._refreshValue();
				break;
		}

	},

	_step: function() {
		var step = this.options.step;
		return step;
	},

	_value: function() {

		var val = this.options.value;
		if (val < this._valueMin()) val = this._valueMin();
		if (val > this._valueMax()) val = this._valueMax();

		return val;

	},

	_values: function(index) {

		if (arguments.length) {
			var val = this.options.values[index];
			if (val < this._valueMin()) val = this._valueMin();
			if (val > this._valueMax()) val = this._valueMax();

			return val;
		} else {
			return this.options.values;
		}

	},

	_valueMin: function() {
		var valueMin = this.options.min;
		return valueMin;
	},

	_valueMax: function() {
		var valueMax = this.options.max;
		return valueMax;
	},

	_refreshValue: function() {

		var oRange = this.options.range;

		if (this.options.values && this.options.values.length) {
			var self = this, vp0, vp1;
			this.handles.each(function(i, j) {
				var valPercent = (self.values(i) - self._valueMin()) / (self._valueMax() - self._valueMin()) * 100;
				$(this).css(self.orientation == 'horizontal' ? 'left' : 'bottom', valPercent + '%');
				if (self.options.range === true) {
					if (self.orientation == 'horizontal') {
						(i == 0) && self.range.css('left', valPercent + '%');
						(i == 1) && self.range.css('width', (valPercent - lastValPercent) + '%');
					} else {
						(i == 0) && self.range.css('bottom', (valPercent) + '%');
						(i == 1) && self.range.css('height', (valPercent - lastValPercent) + '%');
					}
				}
				lastValPercent = valPercent;
			});
		} else {
			var valPercent = (this.value() - this._valueMin()) / (this._valueMax() - this._valueMin()) * 100;
			this.handle.css(this.orientation == 'horizontal' ? 'left' : 'bottom', valPercent + '%');

			(oRange == "min") && (this.orientation == "horizontal") && this.range.css({ left: 0, width: valPercent + '%' });
			(oRange == "max") && (this.orientation == "horizontal") && this.range.css({ left: valPercent + '%', width: (100 - valPercent) + '%' });
			(oRange == "min") && (this.orientation == "vertical") && this.range.css({ top: (100 - valPercent) + '%', height: valPercent + '%' });
			(oRange == "max") && (this.orientation == "vertical") && this.range.css({ bottom: valPercent + '%', height: (100 - valPercent) + '%' });
		}

	}

}));

$.extend($.ui.slider, {
	getter: "value values",
	version: "1.6rc5",
	eventPrefix: "slide",
	defaults: {
		delay: 0,
		distance: 0,
		max: 100,
		min: 0,
		orientation: 'auto',
		range: false,
		step: 1,
		value: 0,
		values: null
	}
});

})(jQuery);
/*
 * jQuery UI Tabs 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.tabs", {

	_init: function() {
		// create tabs
		this._tabify(true);
	},

	destroy: function() {
		var o = this.options;
		this.list.unbind('.tabs')
			.removeClass(o.navClass).removeData('tabs');
		this.$tabs.each(function() {
			var href = $.data(this, 'href.tabs');
			if (href)
				this.href = href;
			var $this = $(this).unbind('.tabs');
			$.each(['href', 'load', 'cache'], function(i, prefix) {
				$this.removeData(prefix + '.tabs');
			});
		});
		this.$lis.unbind('.tabs').add(this.$panels).each(function() {
			if ($.data(this, 'destroy.tabs'))
				$(this).remove();
			else
				$(this).removeClass([o.tabClass, o.selectedClass, o.deselectableClass,
					o.disabledClass, o.panelClass, o.hideClass].join(' '));
		});
		if (o.cookie)
			this._cookie(null, o.cookie);
	},

	_setData: function(key, value) {
		if ((/^selected/).test(key))
			this.select(value);
		else {
			this.options[key] = value;
			this._tabify();
		}
	},

	length: function() {
		return this.$tabs.length;
	},

	_tabId: function(a) {
		return a.title && a.title.replace(/\s/g, '_').replace(/[^A-Za-z0-9\-_:\.]/g, '')
			|| this.options.idPrefix + $.data(a);
	},

	_sanitizeSelector: function(hash) {
		return hash.replace(/:/g, '\\:'); // we need this because an id may contain a ":"
	},

	_cookie: function() {
		var cookie = this.cookie || (this.cookie = 'ui-tabs-' + $.data(this.list[0]));
		return $.cookie.apply(null, [cookie].concat($.makeArray(arguments)));
	},

	_tabify: function(init) {

		this.list = this.element.is('div') ? this.element.children('ul:first, ol:first').eq(0) : this.element;
		this.$lis = $('li:has(a[href])', this.list);
		this.$tabs = this.$lis.map(function() { return $('a', this)[0]; });
		this.$panels = $([]);

		var self = this, o = this.options;

		this.$tabs.each(function(i, a) {
			// inline tab
			if (a.hash && a.hash.replace('#', '')) // Safari 2 reports '#' for an empty hash
				self.$panels = self.$panels.add(self._sanitizeSelector(a.hash));
			// remote tab
			else if ($(a).attr('href') != '#') { // prevent loading the page itself if href is just "#"
				$.data(a, 'href.tabs', a.href); // required for restore on destroy
				$.data(a, 'load.tabs', a.href); // mutable
				var id = self._tabId(a);
				a.href = '#' + id;
				var $panel = $('#' + id);
				if (!$panel.length) {
					$panel = $(o.panelTemplate).attr('id', id).addClass(o.panelClass)
						.insertAfter(self.$panels[i - 1] || self.list);
					$panel.data('destroy.tabs', true);
				}
				self.$panels = self.$panels.add($panel);
			}
			// invalid tab href
			else
				o.disabled.push(i + 1);
		});

		// initialization from scratch
		if (init) {

			// attach necessary classes for styling
			if (this.element.is('div')) {
			    // TODO replace hardcoded class names
			    this.element.addClass('ui-tabs ui-widget ui-widget-content ui-corner-all');
			}
			this.list.addClass(o.navClass);
			this.$lis.addClass(o.tabClass);
			this.$panels.addClass(o.panelClass);

			// Selected tab
			// use "selected" option or try to retrieve:
			// 1. from fragment identifier in url
			// 2. from cookie
			// 3. from selected class attribute on <li>
			if (o.selected === undefined) {
				if (location.hash) {
					this.$tabs.each(function(i, a) {
						if (a.hash == location.hash) {
							o.selected = i;
							return false; // break
						}
					});
				}
				else if (o.cookie) {
					var index = parseInt(self._cookie(), 10);
					if (index && self.$tabs[index]) o.selected = index;
				}
				else if (self.$lis.filter('.' + o.selectedClass).length)
					o.selected = self.$lis.index( self.$lis.filter('.' + o.selectedClass)[0] );
			}
			o.selected = o.selected === null || o.selected !== undefined ? o.selected : 0; // first tab selected by default

			// Take disabling tabs via class attribute from HTML
			// into account and update option properly.
			// A selected tab cannot become disabled.
			o.disabled = $.unique(o.disabled.concat(
				$.map(this.$lis.filter('.' + o.disabledClass),
					function(n, i) { return self.$lis.index(n); } )
			)).sort();
			if ($.inArray(o.selected, o.disabled) != -1)
				o.disabled.splice($.inArray(o.selected, o.disabled), 1);

			// highlight selected tab
			this.$panels.addClass(o.hideClass);
			this.$lis.removeClass(o.selectedClass);
			if (o.selected !== null && this.$tabs.length) { // check for length avoids error when initializing empty list
				this.$panels.eq(o.selected).removeClass(o.hideClass);
				var classes = [o.selectedClass];
				if (o.deselectable) classes.push(o.deselectableClass);
				this.$lis.eq(o.selected).addClass(classes.join(' '));

				// seems to be expected behavior that the show callback is fired
				var onShow = function() {
					self._trigger('show', null,
						self.ui(self.$tabs[o.selected], self.$panels[o.selected]));
				};

				// load if remote tab
				if ($.data(this.$tabs[o.selected], 'load.tabs'))
					this.load(o.selected, onShow);
				// just trigger show event
				else onShow();
			}
			
			// states
			var handleState = function(state, el) {
			    if (el.is(':not(.' + o.disabledClass + ')')) el.toggleClass('ui-state-' + state);
			};		
			this.$lis.bind('mouseover.tabs mouseout.tabs', function() {
			    handleState('hover', $(this));
			});
    		this.$tabs.bind('focus.tabs blur.tabs', function() {
    		    handleState('focus', $(this).parents('li:first'));
    		});

			// clean up to avoid memory leaks in certain versions of IE 6
			$(window).bind('unload', function() {
				self.$lis.add(self.$tabs).unbind('.tabs');
				self.$lis = self.$tabs = self.$panels = null;
			});

		}
		// update selected after add/remove
		else
			o.selected = this.$lis.index( this.$lis.filter('.' + o.selectedClass)[0] );

		// set or update cookie after init and add/remove respectively
		if (o.cookie) this._cookie(o.selected, o.cookie);

		// disable tabs
		for (var i = 0, li; li = this.$lis[i]; i++)
			$(li)[$.inArray(i, o.disabled) != -1 && !$(li).hasClass(o.selectedClass) ? 'addClass' : 'removeClass'](o.disabledClass);

		// reset cache if switching from cached to not cached
		if (o.cache === false) this.$tabs.removeData('cache.tabs');

		// set up animations
		var hideFx, showFx;
		if (o.fx) {
			if (o.fx.constructor == Array) {
				hideFx = o.fx[0];
				showFx = o.fx[1];
			}
			else hideFx = showFx = o.fx;
		}

		// Reset certain styles left over from animation
		// and prevent IE's ClearType bug...
		function resetStyle($el, fx) {
			$el.css({ display: '' });
			if ($.browser.msie && fx.opacity) $el[0].style.removeAttribute('filter');
		}

		// Show a tab...
		var showTab = showFx ?
			function(clicked, $show) {
				$show.animate(showFx, showFx.duration || 'normal', function() {
					$show.removeClass(o.hideClass);
					resetStyle($show, showFx);
					self._trigger('show', null, self.ui(clicked, $show[0]));
				});
			} :
			function(clicked, $show) {
				$show.removeClass(o.hideClass);
				self._trigger('show', null, self.ui(clicked, $show[0]));
			};

		// Hide a tab, $show is optional...
		var hideTab = hideFx ?
			function(clicked, $hide, $show) {
				$hide.animate(hideFx, hideFx.duration || 'normal', function() {
					$hide.addClass(o.hideClass);
					resetStyle($hide, hideFx);
					if ($show) showTab(clicked, $show, $hide);
				});
			} :
			function(clicked, $hide, $show) {
				$hide.addClass(o.hideClass);
				if ($show) showTab(clicked, $show);
			};

		// Switch a tab...
		function switchTab(clicked, $li, $hide, $show) {
			var classes = [o.selectedClass];
			if (o.deselectable) classes.push(o.deselectableClass);
			// TODO replace hardcoded class names
			$li.removeClass('ui-state-default').addClass(classes.join(' '))
			    .siblings().removeClass(classes.join(' ')).addClass('ui-state-default');
			hideTab(clicked, $hide, $show);
		}

		// attach tab event handler, unbind to avoid duplicates from former tabifying...
		this.$tabs.unbind('.tabs').bind(o.event + '.tabs', function() {

			//var trueClick = event.clientX; // add to history only if true click occured, not a triggered click
			var $li = $(this).parents('li:eq(0)'),
				$hide = self.$panels.filter(':visible'),
				$show = $(self._sanitizeSelector(this.hash));

			// If tab is already selected and not deselectable or tab disabled or
			// or is already loading or click callback returns false stop here.
			// Check if click handler returns false last so that it is not executed
			// for a disabled or loading tab!
			// TODO replace hardcoded class names
			if (($li.hasClass('ui-state-active') && !o.deselectable)
				|| $li.hasClass(o.disabledClass)
				|| $(this).hasClass(o.loadingClass)
				|| self._trigger('select', null, self.ui(this, $show[0])) === false
				) {
				this.blur();
				return false;
			}

			o.selected = self.$tabs.index(this);

			// if tab may be closed
			// TODO replace hardcoded class names
			if (o.deselectable) {
				if ($li.hasClass('ui-state-active')) {
					self.options.selected = null;
					$li.removeClass([o.selectedClass, o.deselectableClass].join(' ')).
					    addClass('ui-state-default');
					self.$panels.stop();
					hideTab(this, $hide);
					this.blur();
					return false;
				} else if (!$hide.length) {
					self.$panels.stop();
					var a = this;
					self.load(self.$tabs.index(this), function() {
						$li.addClass([o.selectedClass, o.deselectableClass].join(' '))
						    .removeClass('ui-state-default');
						showTab(a, $show);
					});
					this.blur();
					return false;
				}
			}

			if (o.cookie) self._cookie(o.selected, o.cookie);

			// stop possibly running animations
			self.$panels.stop();

			// show new tab
			if ($show.length) {
				var a = this;
				self.load(self.$tabs.index(this), $hide.length ?
					function() {
						switchTab(a, $li, $hide, $show);
					} :
					function() {
						$li.addClass(o.selectedClass).removeClass('ui-state-default');
						showTab(a, $show);
					}
				);
			} else
				throw 'jQuery UI Tabs: Mismatching fragment identifier.';

			// Prevent IE from keeping other link focussed when using the back button
			// and remove dotted border from clicked link. This is controlled via CSS
			// in modern browsers; blur() removes focus from address bar in Firefox
			// which can become a usability and annoying problem with tabs('rotate').
			if ($.browser.msie) this.blur();

			return false;

		});
		
		// disable click if event is configured to something else
		if (o.event != 'click') this.$tabs.bind('click.tabs', function(){return false;});

	},

	add: function(url, label, index) {
		if (index == undefined)
			index = this.$tabs.length; // append by default

		var o = this.options;
		var $li = $(o.tabTemplate.replace(/#\{href\}/g, url).replace(/#\{label\}/g, label));
		$li.addClass(o.tabClass).data('destroy.tabs', true);

		var id = url.indexOf('#') == 0 ? url.replace('#', '') : this._tabId( $('a:first-child', $li)[0] );

		// try to find an existing element before creating a new one
		var $panel = $('#' + id);
		if (!$panel.length) {
			$panel = $(o.panelTemplate).attr('id', id)
				.addClass(o.hideClass)
				.data('destroy.tabs', true);
		}
		$panel.addClass(o.panelClass);
		if (index >= this.$lis.length) {
			$li.appendTo(this.list);
			$panel.appendTo(this.list[0].parentNode);
		}
		else {
			$li.insertBefore(this.$lis[index]);
			$panel.insertBefore(this.$panels[index]);
		}

		o.disabled = $.map(o.disabled,
			function(n, i) { return n >= index ? ++n : n });

		this._tabify();

		if (this.$tabs.length == 1) {
			$li.addClass(o.selectedClass);
			$panel.removeClass(o.hideClass);
			var href = $.data(this.$tabs[0], 'load.tabs');
			if (href) this.load(index, href);
		}

		// callback
		this._trigger('add', null, this.ui(this.$tabs[index], this.$panels[index]));
	},

	remove: function(index) {
		var o = this.options, $li = this.$lis.eq(index).remove(),
			$panel = this.$panels.eq(index).remove();

		// If selected tab was removed focus tab to the right or
		// in case the last tab was removed the tab to the left.
		if ($li.hasClass(o.selectedClass) && this.$tabs.length > 1)
			this.select(index + (index + 1 < this.$tabs.length ? 1 : -1));

		o.disabled = $.map($.grep(o.disabled, function(n, i) { return n != index; }),
			function(n, i) { return n >= index ? --n : n });

		this._tabify();

		// callback
		this._trigger('remove', null, this.ui($li.find('a')[0], $panel[0]));
	},

	enable: function(index) {
		var o = this.options;
		if ($.inArray(index, o.disabled) == -1)
			return;

		var $li = this.$lis.eq(index).removeClass(o.disabledClass);
		if ($.browser.safari) { // fix disappearing tab (that used opacity indicating disabling) after enabling in Safari 2...
			$li.css('display', 'inline-block');
			setTimeout(function() {
				$li.css('display', 'block');
			}, 0);
		}

		o.disabled = $.grep(o.disabled, function(n, i) { return n != index; });

		// callback
		this._trigger('enable', null, this.ui(this.$tabs[index], this.$panels[index]));
	},

	disable: function(index) {
		var self = this, o = this.options;
		if (index != o.selected) { // cannot disable already selected tab
			this.$lis.eq(index).addClass(o.disabledClass);

			o.disabled.push(index);
			o.disabled.sort();

			// callback
			this._trigger('disable', null, this.ui(this.$tabs[index], this.$panels[index]));
		}
	},

	select: function(index) {
		// TODO make null as argument work
		if (typeof index == 'string')
			index = this.$tabs.index( this.$tabs.filter('[href$=' + index + ']')[0] );
		this.$tabs.eq(index).trigger(this.options.event + '.tabs');
	},

	load: function(index, callback) { // callback is for internal usage only

		var self = this, o = this.options, $a = this.$tabs.eq(index), a = $a[0],
				bypassCache = callback == undefined || callback === false, url = $a.data('load.tabs');

		callback = callback || function() {};

		// no remote or from cache - just finish with callback
		if (!url || !bypassCache && $.data(a, 'cache.tabs')) {
			callback();
			return;
		}

		// load remote from here on

		var inner = function(parent) {
			var $parent = $(parent), $inner = $parent.find('*:last');
			return $inner.length && $inner.is(':not(img)') && $inner || $parent;
		};
		var cleanup = function() {
			self.$tabs.filter('.' + o.loadingClass).removeClass(o.loadingClass)
					.each(function() {
						if (o.spinner)
							inner(this).parent().html(inner(this).data('label.tabs'));
					});
			self.xhr = null;
		};

		if (o.spinner) {
			var label = inner(a).html();
			inner(a).wrapInner('<em></em>')
				.find('em').data('label.tabs', label).html(o.spinner);
		}

		var ajaxOptions = $.extend({}, o.ajaxOptions, {
			url: url,
			success: function(r, s) {
				$(self._sanitizeSelector(a.hash)).html(r);
				cleanup();

				if (o.cache)
					$.data(a, 'cache.tabs', true); // if loaded once do not load them again

				// callbacks
				self._trigger('load', null, self.ui(self.$tabs[index], self.$panels[index]));
				try {
					o.ajaxOptions.success(r, s);
				}
				catch (er) {}

				// This callback is required because the switch has to take
				// place after loading has completed. Call last in order to
				// fire load before show callback...
				callback();
			}
		});
		if (this.xhr) {
			// terminate pending requests from other tabs and restore tab label
			this.xhr.abort();
			cleanup();
		}
		$a.addClass(o.loadingClass);
		self.xhr = $.ajax(ajaxOptions);
	},

	url: function(index, url) {
		this.$tabs.eq(index).removeData('cache.tabs').data('load.tabs', url);
	},

	ui: function(tab, panel) {
		return {
			options: this.options,
			tab: tab,
			panel: panel,
			index: this.$tabs.index(tab)
		};
	}

});

$.extend($.ui.tabs, {
	version: '1.6rc5',
	getter: 'length',
	defaults: {
		ajaxOptions: null,
		cache: false,
		cookie: null, // e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
		deselectable: false,
		deselectableClass: 'ui-tabs-deselectable',
		disabled: [],
		disabledClass: 'ui-state-disabled',
		event: 'click',
		fx: null, // e.g. { height: 'toggle', opacity: 'toggle', duration: 200 }
		hideClass: 'ui-tabs-hide',
		idPrefix: 'ui-tabs-',
		loadingClass: 'ui-tabs-loading',
		navClass: 'ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all',
		tabClass: 'ui-state-default ui-corner-top',
		panelClass: 'ui-tabs-panel ui-widget-content ui-corner-bottom',
		panelTemplate: '<div></div>',
		selectedClass: 'ui-tabs-selected ui-state-active',
		spinner: 'Loading&#8230;',
		tabTemplate: '<li><a href="#{href}"><span>#{label}</span></a></li>'
	}
});

/*
 * Tabs Extensions
 */

/*
 * Rotate
 */
$.extend($.ui.tabs.prototype, {
	rotation: null,
	rotate: function(ms, continuing) {

		continuing = continuing || false;

		var self = this, t = this.options.selected;

		function start() {
			self.rotation = setInterval(function() {
				t = ++t < self.$tabs.length ? t : 0;
				self.select(t);
			}, ms);
		}

		function stop(event) {
			if (!event || event.clientX) { // only in case of a true click
				clearInterval(self.rotation);
			}
		}

		// start interval
		if (ms) {
			start();
			if (!continuing)
				this.$tabs.bind(this.options.event + '.tabs', stop);
			else
				this.$tabs.bind(this.options.event + '.tabs', function() {
					stop();
					t = self.options.selected;
					start();
				});
		}
		// stop interval
		else {
			stop();
			this.$tabs.unbind(this.options.event + '.tabs', stop);
		}
	}
});

})(jQuery);
/*
 * jQuery UI Datepicker 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Datepicker
 *
 * Depends:
 *	ui.core.js
 */

(function($) { // hide the namespace

$.extend($.ui, { datepicker: { version: "1.6rc5" } });

var PROP_NAME = 'datepicker';

/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
	this.debug = false; // Change this to true to start debugging
	this._curInst = null; // The current instance in use
	this._keyEvent = false; // If the last event was a key event
	this._disabledInputs = []; // List of date picker inputs that have been disabled
	this._datepickerShowing = false; // True if the popup picker is showing , false if not
	this._inDialog = false; // True if showing within a "dialog", false if not
	this._mainDivId = 'ui-datepicker-div'; // The ID of the main datepicker division
	this._inlineClass = 'ui-datepicker-inline'; // The name of the inline marker class
	this._appendClass = 'ui-datepicker-append'; // The name of the append marker class
	this._triggerClass = 'ui-datepicker-trigger'; // The name of the trigger marker class
	this._dialogClass = 'ui-datepicker-dialog'; // The name of the dialog marker class
	this._disableClass = 'ui-datepicker-disabled'; // The name of the disabled covering marker class
	this._unselectableClass = 'ui-datepicker-unselectable'; // The name of the unselectable cell marker class
	this._currentClass = 'ui-datepicker-current-day'; // The name of the current day marker class
	this._dayOverClass = 'ui-datepicker-days-cell-over'; // The name of the day hover marker class
	this.regional = []; // Available regional settings, indexed by language code
	this.regional[''] = { // Default regional settings
		closeText: 'Done', // Display text for close link
		prevText: 'Prev', // Display text for previous month link
		nextText: 'Next', // Display text for next month link
		currentText: 'Today', // Display text for current month link
		monthNames: ['January','February','March','April','May','June',
			'July','August','September','October','November','December'], // Names of months for drop-down and formatting
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // For formatting
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // For formatting
		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // For formatting
		dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'], // Column headings for days starting at Sunday
		dateFormat: 'mm/dd/yy', // See format options on parseDate
		firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
		isRTL: false // True if right-to-left language, false if left-to-right
	};
	this._defaults = { // Global defaults for all the date picker instances
		showOn: 'focus', // 'focus' for popup on focus,
			// 'button' for trigger button, or 'both' for either
		showAnim: 'show', // Name of jQuery animation for popup
		showOptions: {}, // Options for enhanced animations
		defaultDate: null, // Used when field is blank: actual date,
			// +/-number for offset from today, null for today
		appendText: '', // Display text following the input box, e.g. showing the format
		buttonText: '...', // Text for trigger button
		buttonImage: '', // URL for trigger button image
		buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
		hideIfNoPrevNext: false, // True to hide next/previous month links
			// if not applicable, false to just disable them
		navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
		gotoCurrent: false, // True if today link goes back to current selection instead
		changeMonth: false, // True if month can be selected directly, false if only prev/next
		changeYear: false, // True if year can be selected directly, false if only prev/next
		showMonthAfterYear: false, // True if the year select precedes month, false for month then year
		yearRange: '-10:+10', // Range of years to display in drop-down,
			// either relative to current year (-nn:+nn) or absolute (nnnn:nnnn)
		showOtherMonths: false, // True to show dates in other months, false to leave blank
		calculateWeek: this.iso8601Week, // How to calculate the week of the year,
			// takes a Date and returns the number of the week for it
		shortYearCutoff: '+10', // Short year values < this are in the current century,
			// > this are in the previous century,
			// string value starting with '+' for current year + value
		minDate: null, // The earliest selectable date, or null for no limit
		maxDate: null, // The latest selectable date, or null for no limit
		duration: 'normal', // Duration of display/closure
		beforeShowDay: null, // Function that takes a date and returns an array with
			// [0] = true if selectable, false if not, [1] = custom CSS class name(s) or '',
			// [2] = cell title (optional), e.g. $.datepicker.noWeekends
		beforeShow: null, // Function that takes an input field and
			// returns a set of custom settings for the date picker
		onSelect: null, // Define a callback function when a date is selected
		onChangeMonthYear: null, // Define a callback function when the month or year is changed
		onClose: null, // Define a callback function when the datepicker is closed
		numberOfMonths: 1, // Number of months to show at a time
		showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
		stepMonths: 1, // Number of months to step back/forward
		stepBigMonths: 12, // Number of months to step back/forward for the big links
		altField: '', // Selector for an alternate field to store selected dates into
		altFormat: '', // The date format to use for the alternate field
		constrainInput: true, // The input is constrained by the current date format
		showButtonPanel: false // True to show button panel, false to not show it
	};
	$.extend(this._defaults, this.regional['']);
	this.dpDiv = $('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-helper-hidden-accessible"></div>');
}

$.extend(Datepicker.prototype, {
	/* Class name added to elements to indicate already configured with a date picker. */
	markerClassName: 'hasDatepicker',

	/* Debug logging (if enabled). */
	log: function () {
		if (this.debug)
			console.log.apply('', arguments);
	},

	/* Override the default settings for all instances of the date picker.
	   @param  settings  object - the new settings to use as defaults (anonymous object)
	   @return the manager object */
	setDefaults: function(settings) {
		extendRemove(this._defaults, settings || {});
		return this;
	},

	/* Attach the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span
	   @param  settings  object - the new settings to use for this date picker instance (anonymous) */
	_attachDatepicker: function(target, settings) {
		// check for settings on the control itself - in namespace 'date:'
		var inlineSettings = null;
		for (var attrName in this._defaults) {
			var attrValue = target.getAttribute('date:' + attrName);
			if (attrValue) {
				inlineSettings = inlineSettings || {};
				try {
					inlineSettings[attrName] = eval(attrValue);
				} catch (err) {
					inlineSettings[attrName] = attrValue;
				}
			}
		}
		var nodeName = target.nodeName.toLowerCase();
		var inline = (nodeName == 'div' || nodeName == 'span');
		if (!target.id)
			target.id = 'dp' + (++this.uuid);
		var inst = this._newInst($(target), inline);
		inst.settings = $.extend({}, settings || {}, inlineSettings || {});
		if (nodeName == 'input') {
			this._connectDatepicker(target, inst);
		} else if (inline) {
			this._inlineDatepicker(target, inst);
		}
	},

	/* Create a new instance object. */
	_newInst: function(target, inline) {
		var id = target[0].id.replace(/([:\[\]\.])/g, '\\\\$1'); // escape jQuery meta chars
		return {id: id, input: target, // associated target
			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
			drawMonth: 0, drawYear: 0, // month being drawn
			inline: inline, // is datepicker inline or not
			dpDiv: (!inline ? this.dpDiv : // presentation div
			$('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))};
	},

	/* Attach the date picker to an input field. */
	_connectDatepicker: function(target, inst) {
		var input = $(target);
		if (input.hasClass(this.markerClassName))
			return;
		var appendText = this._get(inst, 'appendText');
		var isRTL = this._get(inst, 'isRTL');
		if (appendText)
			input[isRTL ? 'before' : 'after']('<span class="' + this._appendClass + '">' + appendText + '</span>');
		var showOn = this._get(inst, 'showOn');
		if (showOn == 'focus' || showOn == 'both') // pop-up date picker when in the marked field
			input.focus(this._showDatepicker);
		if (showOn == 'button' || showOn == 'both') { // pop-up date picker when button clicked
			var buttonText = this._get(inst, 'buttonText');
			var buttonImage = this._get(inst, 'buttonImage');
			var trigger = $(this._get(inst, 'buttonImageOnly') ?
				$('<img/>').addClass(this._triggerClass).
					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
				$('<button type="button"></button>').addClass(this._triggerClass).
					html(buttonImage == '' ? buttonText : $('<img/>').attr(
					{ src:buttonImage, alt:buttonText, title:buttonText })));
			input[isRTL ? 'before' : 'after'](trigger);
			trigger.click(function() {
				if ($.datepicker._datepickerShowing && $.datepicker._lastInput == target)
					$.datepicker._hideDatepicker();
				else
					$.datepicker._showDatepicker(target);
				return false;
			});
		}
		input.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).
			bind("setData.datepicker", function(event, key, value) {
				inst.settings[key] = value;
			}).bind("getData.datepicker", function(event, key) {
				return this._get(inst, key);
			});
		$.data(target, PROP_NAME, inst);
	},

	/* Attach an inline date picker to a div. */
	_inlineDatepicker: function(target, inst) {
		var divSpan = $(target);
		if (divSpan.hasClass(this.markerClassName))
			return;
		divSpan.addClass(this.markerClassName).append(inst.dpDiv).
			bind("setData.datepicker", function(event, key, value){
				inst.settings[key] = value;
			}).bind("getData.datepicker", function(event, key){
				return this._get(inst, key);
			});
		$.data(target, PROP_NAME, inst);
		this._setDate(inst, this._getDefaultDate(inst));
		this._updateDatepicker(inst);
		this._updateAlternate(inst);
	},

	/* Pop-up the date picker in a "dialog" box.
	   @param  input     element - ignored
	   @param  dateText  string - the initial date to display (in the current format)
	   @param  onSelect  function - the function(dateText) to call when a date is selected
	   @param  settings  object - update the dialog date picker instance's settings (anonymous object)
	   @param  pos       int[2] - coordinates for the dialog's position within the screen or
	                     event - with x/y coordinates or
	                     leave empty for default (screen centre)
	   @return the manager object */
	_dialogDatepicker: function(input, dateText, onSelect, settings, pos) {
		var inst = this._dialogInst; // internal instance
		if (!inst) {
			var id = 'dp' + (++this.uuid);
			this._dialogInput = $('<input type="text" id="' + id +
				'" size="1" style="position: absolute; top: -100px;"/>');
			this._dialogInput.keydown(this._doKeyDown);
			$('body').append(this._dialogInput);
			inst = this._dialogInst = this._newInst(this._dialogInput, false);
			inst.settings = {};
			$.data(this._dialogInput[0], PROP_NAME, inst);
		}
		extendRemove(inst.settings, settings || {});
		this._dialogInput.val(dateText);

		this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
		if (!this._pos) {
			var browserWidth = window.innerWidth || document.documentElement.clientWidth ||	document.body.clientWidth;
			var browserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			this._pos = // should use actual width/height below
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
		}

		// move input on screen for focus, but hidden behind dialog
		this._dialogInput.css('left', this._pos[0] + 'px').css('top', this._pos[1] + 'px');
		inst.settings.onSelect = onSelect;
		this._inDialog = true;
		this.dpDiv.addClass(this._dialogClass);
		this._showDatepicker(this._dialogInput[0]);
		if ($.blockUI)
			$.blockUI(this.dpDiv);
		$.data(this._dialogInput[0], PROP_NAME, inst);
		return this;
	},

	/* Detach a datepicker from its control.
	   @param  target    element - the target input field or division or span */
	_destroyDatepicker: function(target) {
		var $target = $(target);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		$.removeData(target, PROP_NAME);
		if (nodeName == 'input') {
			$target.siblings('.' + this._appendClass).remove().end().
				siblings('.' + this._triggerClass).remove().end().
				removeClass(this.markerClassName).
				unbind('focus', this._showDatepicker).
				unbind('keydown', this._doKeyDown).
				unbind('keypress', this._doKeyPress);
		} else if (nodeName == 'div' || nodeName == 'span')
			$target.removeClass(this.markerClassName).empty();
	},

	/* Enable the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span */
	_enableDatepicker: function(target) {
		var $target = $(target);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		if (nodeName == 'input') {
		target.disabled = false;
			$target.siblings('button.' + this._triggerClass).
			each(function() { this.disabled = false; }).end().
				siblings('img.' + this._triggerClass).
				css({opacity: '1.0', cursor: ''});
		}
		else if (nodeName == 'div' || nodeName == 'span') {
			var inline = $target.children('.' + this._inlineClass);
			inline.children().removeClass('ui-state-disabled');
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value == target ? null : value); }); // delete entry
	},

	/* Disable the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span */
	_disableDatepicker: function(target) {
		var $target = $(target);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		if (nodeName == 'input') {
		target.disabled = true;
			$target.siblings('button.' + this._triggerClass).
			each(function() { this.disabled = true; }).end().
				siblings('img.' + this._triggerClass).
				css({opacity: '0.5', cursor: 'default'});
		}
		else if (nodeName == 'div' || nodeName == 'span') {
			var inline = $target.children('.' + this._inlineClass);
			inline.children().addClass('ui-state-disabled');
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value == target ? null : value); }); // delete entry
		this._disabledInputs[this._disabledInputs.length] = target;
	},

	/* Is the first field in a jQuery collection disabled as a datepicker?
	   @param  target    element - the target input field or division or span
	   @return boolean - true if disabled, false if enabled */
	_isDisabledDatepicker: function(target) {
		if (!target) {
			return false;
		}
		for (var i = 0; i < this._disabledInputs.length; i++) {
			if (this._disabledInputs[i] == target)
				return true;
		}
		return false;
	},

	/* Retrieve the instance data for the target control.
	   @param  target  element - the target input field or division or span
	   @return  object - the associated instance data
	   @throws  error if a jQuery problem getting data */
	_getInst: function(target) {
		try {
			return $.data(target, PROP_NAME);
		}
		catch (err) {
			throw 'Missing instance data for this datepicker';
		}
	},

	/* Update the settings for a date picker attached to an input field or division.
	   @param  target  element - the target input field or division or span
	   @param  name    object - the new settings to update or
	                   string - the name of the setting to change or
	   @param  value   any - the new value for the setting (omit if above is an object) */
	_optionDatepicker: function(target, name, value) {
		var settings = name || {};
		if (typeof name == 'string') {
			settings = {};
			settings[name] = value;
		}
		var inst = this._getInst(target);
		if (inst) {
			if (this._curInst == inst) {
				this._hideDatepicker(null);
			}
			extendRemove(inst.settings, settings);
			var date = new Date();
			extendRemove(inst, {rangeStart: null, // start of range
				endDay: null, endMonth: null, endYear: null, // end of range
				selectedDay: date.getDate(), selectedMonth: date.getMonth(),
				selectedYear: date.getFullYear(), // starting point
				currentDay: date.getDate(), currentMonth: date.getMonth(),
				currentYear: date.getFullYear(), // current selection
				drawMonth: date.getMonth(), drawYear: date.getFullYear()}); // month being drawn
			this._updateDatepicker(inst);
		}
	},

	// change method deprecated
	_changeDatepicker: function(target, name, value) {
		this._optionDatepicker(target, name, value);
	},

	/* Redraw the date picker attached to an input field or division.
	   @param  target  element - the target input field or division or span */
	_refreshDatepicker: function(target) {
		var inst = this._getInst(target);
		if (inst) {
			this._updateDatepicker(inst);
		}
	},

	/* Set the dates for a jQuery selection.
	   @param  target   element - the target input field or division or span
	   @param  date     Date - the new date
	   @param  endDate  Date - the new end date for a range (optional) */
	_setDateDatepicker: function(target, date, endDate) {
		var inst = this._getInst(target);
		if (inst) {
			this._setDate(inst, date, endDate);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);
		}
	},

	/* Get the date(s) for the first entry in a jQuery selection.
	   @param  target  element - the target input field or division or span
	   @return Date - the current date or
	           Date[2] - the current dates for a range */
	_getDateDatepicker: function(target) {
		var inst = this._getInst(target);
		if (inst && !inst.inline)
			this._setDateFromField(inst);
		return (inst ? this._getDate(inst) : null);
	},

	/* Handle keystrokes. */
	_doKeyDown: function(event) {
		var inst = $.datepicker._getInst(event.target);
		var handled = true;
		var isRTL = inst.dpDiv.is('.ui-datepicker-rtl');
		inst._keyEvent = true;
		if ($.datepicker._datepickerShowing)
			switch (event.keyCode) {
				case 9:  $.datepicker._hideDatepicker(null, '');
						break; // hide on tab out
				case 13: var sel = $('td.' + $.datepicker._dayOverClass +
							', td.' + $.datepicker._currentClass, inst.dpDiv);
						if (sel[0])
							$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
						else
							$.datepicker._hideDatepicker(null, $.datepicker._get(inst, 'duration'));
						return false; // don't submit the form
						break; // select the value on enter
				case 27: $.datepicker._hideDatepicker(null, $.datepicker._get(inst, 'duration'));
						break; // hide on escape
				case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							-$.datepicker._get(inst, 'stepBigMonths') :
							-$.datepicker._get(inst, 'stepMonths')), 'M');
						break; // previous month/year on page up/+ ctrl
				case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							+$.datepicker._get(inst, 'stepBigMonths') :
							+$.datepicker._get(inst, 'stepMonths')), 'M');
						break; // next month/year on page down/+ ctrl
				case 35: if (event.ctrlKey || event.metaKey) $.datepicker._clearDate(event.target);
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
				case 36: if (event.ctrlKey || event.metaKey) $.datepicker._gotoToday(event.target);
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
				case 37: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), 'D');
						handled = event.ctrlKey || event.metaKey;
						// -1 day on ctrl or command +left
						if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
									-$.datepicker._get(inst, 'stepBigMonths') :
									-$.datepicker._get(inst, 'stepMonths')), 'M');
						// next month/year on alt +left on Mac
						break;
				case 38: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, -7, 'D');
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
				case 39: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), 'D');
						handled = event.ctrlKey || event.metaKey;
						// +1 day on ctrl or command +right
						if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
									+$.datepicker._get(inst, 'stepBigMonths') :
									+$.datepicker._get(inst, 'stepMonths')), 'M');
						// next month/year on alt +right
						break;
				case 40: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, +7, 'D');
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
				default: handled = false;
			}
		else if (event.keyCode == 36 && event.ctrlKey) // display the date picker on ctrl+home
			$.datepicker._showDatepicker(this);
		else {
			handled = false;
		}
		if (handled) {
			event.preventDefault();
			event.stopPropagation();
		}
	},

	/* Filter entered characters - based on date format. */
	_doKeyPress: function(event) {
		var inst = $.datepicker._getInst(event.target);
		if ($.datepicker._get(inst, 'constrainInput')) {
			var chars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat'));
			var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
			return event.ctrlKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
		}
	},

	/* Pop-up the date picker for a given input field.
	   @param  input  element - the input field attached to the date picker or
	                  event - if triggered by focus */
	_showDatepicker: function(input) {
		input = input.target || input;
		if (input.nodeName.toLowerCase() != 'input') // find from button/image trigger
			input = $('input', input.parentNode)[0];
		if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput == input) // already here
			return;
		var inst = $.datepicker._getInst(input);
		var beforeShow = $.datepicker._get(inst, 'beforeShow');
		extendRemove(inst.settings, (beforeShow ? beforeShow.apply(input, [input, inst]) : {}));
		$.datepicker._hideDatepicker(null, '');
		$.datepicker._lastInput = input;
		$.datepicker._setDateFromField(inst);
		if ($.datepicker._inDialog) // hide cursor
			input.value = '';
		if (!$.datepicker._pos) { // position below input
			$.datepicker._pos = $.datepicker._findPos(input);
			$.datepicker._pos[1] += input.offsetHeight; // add the height
		}
		var isFixed = false;
		$(input).parents().each(function() {
			isFixed |= $(this).css('position') == 'fixed';
			return !isFixed;
		});
		if (isFixed && $.browser.opera) { // correction for Opera when fixed and scrolled
			$.datepicker._pos[0] -= document.documentElement.scrollLeft;
			$.datepicker._pos[1] -= document.documentElement.scrollTop;
		}
		var offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
		$.datepicker._pos = null;
		inst.rangeStart = null;
		// determine sizing offscreen
		inst.dpDiv.css({position: 'absolute', display: 'block', top: '-1000px'});
		$.datepicker._updateDatepicker(inst);
		// fix width for dynamic number of date pickers
		// and adjust position before showing
		offset = $.datepicker._checkOffset(inst, offset, isFixed);
		inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
			'static' : (isFixed ? 'fixed' : 'absolute')), display: 'none',
			left: offset.left + 'px', top: offset.top + 'px'});
		if (!inst.inline) {
			var showAnim = $.datepicker._get(inst, 'showAnim') || 'show';
			var duration = $.datepicker._get(inst, 'duration');
			var postProcess = function() {
				$.datepicker._datepickerShowing = true;
				if ($.browser.msie && parseInt($.browser.version,10) < 7) // fix IE < 7 select problems
					$('iframe.ui-datepicker-cover').css({width: inst.dpDiv.width() + 4,
						height: inst.dpDiv.height() + 4});
			};
			if ($.effects && $.effects[showAnim])
				inst.dpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
			else
				inst.dpDiv[showAnim](duration, postProcess);
			if (duration == '')
				postProcess();
			if (inst.input[0].type != 'hidden')
				inst.input[0].focus();
			$.datepicker._curInst = inst;
		}
	},

	/* Generate the date picker content. */
	_updateDatepicker: function(inst) {
		var dims = {width: inst.dpDiv.width() + 4,
			height: inst.dpDiv.height() + 4};
		var self = this;
		inst.dpDiv.empty().append(this._generateHTML(inst))
			.find('iframe.ui-datepicker-cover').
				css({width: dims.width, height: dims.height})
			.end()
			.find('button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a')
				.bind('mouseout', function(){
					$(this).removeClass('ui-state-hover');
					if(this.className.indexOf('ui-datepicker-prev') != -1) $(this).removeClass('ui-datepicker-prev-hover');
					if(this.className.indexOf('ui-datepicker-next') != -1) $(this).removeClass('ui-datepicker-next-hover');
				})
				.bind('mouseover', function(){
					if (!self._isDisabledDatepicker( inst.inline ? inst.dpDiv.parent()[0] : inst.input[0])) {
						$(this).parents('.ui-datepicker-calendar').find('a').removeClass('ui-state-hover');
						$(this).addClass('ui-state-hover');
						if(this.className.indexOf('ui-datepicker-prev') != -1) $(this).addClass('ui-datepicker-prev-hover');
						if(this.className.indexOf('ui-datepicker-next') != -1) $(this).addClass('ui-datepicker-next-hover');
					}
				})
			.end()
			.find('.' + this._dayOverClass + ' a')
				.trigger('mouseover')
			.end();
		var numMonths = this._getNumberOfMonths(inst);
		var cols = numMonths[1];
		var width = 17;
		if (cols > 1) {
			inst.dpDiv.addClass('ui-datepicker-multi-' + cols).css('width', (width * cols) + 'em');
		} else {
			inst.dpDiv.removeClass('ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4').width('');
		}
		inst.dpDiv[(numMonths[0] != 1 || numMonths[1] != 1 ? 'add' : 'remove') +
			'Class']('ui-datepicker-multi');
		inst.dpDiv[(this._get(inst, 'isRTL') ? 'add' : 'remove') +
			'Class']('ui-datepicker-rtl');
		if (inst.input && inst.input[0].type != 'hidden' && inst == $.datepicker._curInst)
			$(inst.input[0]).focus();
	},
	
	/* Check positioning to remain on screen. */
	_checkOffset: function(inst, offset, isFixed) {		
		var dpWidth = inst.dpDiv.outerWidth();
		var dpHeight = inst.dpDiv.outerHeight();
		var inputWidth = inst.input ? inst.input.outerWidth() : 0;
		var inputHeight = inst.input ? inst.input.outerHeight() : 0;
		var viewWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var viewHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		
		offset.left -= (this._get(inst, 'isRTL') ? (dpWidth - inputWidth) : 0);
		offset.left -= (isFixed && offset.left == inst.input.offset().left) ? $(document).scrollLeft() : 0;
		offset.top -= (isFixed && offset.top == (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;
		
		// now check if datepicker is showing outside window viewpoint - move to a better place if so.
		offset.left -= (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ? Math.abs(offset.left + dpWidth - viewWidth) : 0;
		offset.top -= (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ? Math.abs(offset.top + dpHeight + inputHeight*2 - viewHeight) : 0;
				
		return offset;
	},	

	/* Find an object's position on the screen. */
	_findPos: function(obj) {
        while (obj && (obj.type == 'hidden' || obj.nodeType != 1)) {
            obj = obj.nextSibling;
        }
        var position = $(obj).offset();
	    return [position.left, position.top];
	},

	/* Hide the date picker from view.
	   @param  input  element - the input field attached to the date picker
	   @param  duration  string - the duration over which to close the date picker */
	_hideDatepicker: function(input, duration) {
		var inst = this._curInst;
		if (!inst || (input && inst != $.data(input, PROP_NAME)))
			return;
		if (inst.stayOpen)
			this._selectDate('#' + inst.id, this._formatDate(inst,
				inst.currentDay, inst.currentMonth, inst.currentYear));
		inst.stayOpen = false;
		if (this._datepickerShowing) {
			duration = (duration != null ? duration : this._get(inst, 'duration'));
			var showAnim = this._get(inst, 'showAnim');
			var postProcess = function() {
				$.datepicker._tidyDialog(inst);
			};
			if (duration != '' && $.effects && $.effects[showAnim])
				inst.dpDiv.hide(showAnim, $.datepicker._get(inst, 'showOptions'),
					duration, postProcess);
			else
				inst.dpDiv[(duration == '' ? 'hide' : (showAnim == 'slideDown' ? 'slideUp' :
					(showAnim == 'fadeIn' ? 'fadeOut' : 'hide')))](duration, postProcess);
			if (duration == '')
				this._tidyDialog(inst);
			var onClose = this._get(inst, 'onClose');
			if (onClose)
				onClose.apply((inst.input ? inst.input[0] : null),
					[(inst.input ? inst.input.val() : ''), inst]);  // trigger custom callback
			this._datepickerShowing = false;
			this._lastInput = null;
			if (this._inDialog) {
				this._dialogInput.css({ position: 'absolute', left: '0', top: '-100px' });
				if ($.blockUI) {
					$.unblockUI();
					$('body').append(this.dpDiv);
				}
			}
			this._inDialog = false;
		}
		this._curInst = null;
	},

	/* Tidy up after a dialog display. */
	_tidyDialog: function(inst) {
		inst.dpDiv.removeClass(this._dialogClass).unbind('.ui-datepicker-calendar');
	},

	/* Close date picker if clicked elsewhere. */
	_checkExternalClick: function(event) {
		if (!$.datepicker._curInst)
			return;
		var $target = $(event.target);
		if (($target.parents('#' + $.datepicker._mainDivId).length == 0) &&
				!$target.hasClass($.datepicker.markerClassName) &&
				!$target.hasClass($.datepicker._triggerClass) &&
				$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI))
			$.datepicker._hideDatepicker(null, '');
	},

	/* Adjust one of the date sub-fields. */
	_adjustDate: function(id, offset, period) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		if (this._isDisabledDatepicker(target[0])) {
			return;
		}
		this._adjustInstDate(inst, offset, period);
		this._updateDatepicker(inst);
	},

	/* Action for current link. */
	_gotoToday: function(id) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		}
		else {
		var date = new Date();
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		}
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a new month/year. */
	_selectMonthYear: function(id, select, period) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		inst._selectingMonthYear = false;
		inst['selected' + (period == 'M' ? 'Month' : 'Year')] =
		inst['draw' + (period == 'M' ? 'Month' : 'Year')] =
			parseInt(select.options[select.selectedIndex].value,10);
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Restore input focus after not changing month/year. */
	_clickMonthYear: function(id) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		if (inst.input && inst._selectingMonthYear && !$.browser.msie)
			inst.input[0].focus();
		inst._selectingMonthYear = !inst._selectingMonthYear;
	},

	/* Action for selecting a day. */
	_selectDay: function(id, month, year, td) {
		var target = $(id);
		if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
			return;
		}
		var inst = this._getInst(target[0]);
		inst.selectedDay = inst.currentDay = $('a', td).html();
		inst.selectedMonth = inst.currentMonth = month;
		inst.selectedYear = inst.currentYear = year;
		if (inst.stayOpen) {
			inst.endDay = inst.endMonth = inst.endYear = null;
		}
		this._selectDate(id, this._formatDate(inst,
			inst.currentDay, inst.currentMonth, inst.currentYear));
		if (inst.stayOpen) {
			inst.rangeStart = this._daylightSavingAdjust(
				new Date(inst.currentYear, inst.currentMonth, inst.currentDay));
			this._updateDatepicker(inst);
		}
	},

	/* Erase the input field and hide the date picker. */
	_clearDate: function(id) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		inst.stayOpen = false;
		inst.endDay = inst.endMonth = inst.endYear = inst.rangeStart = null;
		this._selectDate(target, '');
	},

	/* Update the input field with the selected date. */
	_selectDate: function(id, dateStr) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
		if (inst.input)
			inst.input.val(dateStr);
		this._updateAlternate(inst);
		var onSelect = this._get(inst, 'onSelect');
		if (onSelect)
			onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
		else if (inst.input)
			inst.input.trigger('change'); // fire the change event
		if (inst.inline)
			this._updateDatepicker(inst);
		else if (!inst.stayOpen) {
			this._hideDatepicker(null, this._get(inst, 'duration'));
			this._lastInput = inst.input[0];
			if (typeof(inst.input[0]) != 'object')
				inst.input[0].focus(); // restore focus
			this._lastInput = null;
		}
	},

	/* Update any alternate field to synchronise with the main field. */
	_updateAlternate: function(inst) {
		var altField = this._get(inst, 'altField');
		if (altField) { // update alternate field too
			var altFormat = this._get(inst, 'altFormat') || this._get(inst, 'dateFormat');
			var date = this._getDate(inst);
			dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
			$(altField).each(function() { $(this).val(dateStr); });
		}
	},

	/* Set as beforeShowDay function to prevent selection of weekends.
	   @param  date  Date - the date to customise
	   @return [boolean, string] - is this date selectable?, what is its CSS class? */
	noWeekends: function(date) {
		var day = date.getDay();
		return [(day > 0 && day < 6), ''];
	},

	/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
	   @param  date  Date - the date to get the week for
	   @return  number - the number of the week within the year that contains this date */
	iso8601Week: function(date) {
		var checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		var firstMon = new Date(checkDate.getFullYear(), 1 - 1, 4); // First week always contains 4 Jan
		var firstDay = firstMon.getDay() || 7; // Day of week: Mon = 1, ..., Sun = 7
		firstMon.setDate(firstMon.getDate() + 1 - firstDay); // Preceding Monday
		if (firstDay < 4 && checkDate < firstMon) { // Adjust first three days in year if necessary
			checkDate.setDate(checkDate.getDate() - 3); // Generate for previous year
			return $.datepicker.iso8601Week(checkDate);
		} else if (checkDate > new Date(checkDate.getFullYear(), 12 - 1, 28)) { // Check last three days in year
			firstDay = new Date(checkDate.getFullYear() + 1, 1 - 1, 4).getDay() || 7;
			if (firstDay > 4 && (checkDate.getDay() || 7) < firstDay - 3) { // Adjust if necessary
				return 1;
			}
		}
		return Math.floor(((checkDate - firstMon) / 86400000) / 7) + 1; // Weeks to given date
	},

	/* Parse a string value into a date object.
	   See formatDate below for the possible formats.

	   @param  format    string - the expected format of the date
	   @param  value     string - the date in the above format
	   @param  settings  Object - attributes include:
	                     shortYearCutoff  number - the cutoff year for determining the century (optional)
	                     dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
	                     dayNames         string[7] - names of the days from Sunday (optional)
	                     monthNamesShort  string[12] - abbreviated names of the months (optional)
	                     monthNames       string[12] - names of the months (optional)
	   @return  Date - the extracted date value or null if value is blank */
	parseDate: function (format, value, settings) {
		if (format == null || value == null)
			throw 'Invalid arguments';
		value = (typeof value == 'object' ? value.toString() : value + '');
		if (value == '')
			return null;
		var shortYearCutoff = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff;
		var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
		var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
		var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
		var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
		var year = -1;
		var month = -1;
		var day = -1;
		var doy = -1;
		var literal = false;
		// Check whether a format character is doubled
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		// Extract a number from the string value
		var getNumber = function(match) {
			lookAhead(match);
			var origSize = (match == '@' ? 14 : (match == 'y' ? 4 : (match == 'o' ? 3 : 2)));
			var size = origSize;
			var num = 0;
			while (size > 0 && iValue < value.length &&
					value.charAt(iValue) >= '0' && value.charAt(iValue) <= '9') {
				num = num * 10 + parseInt(value.charAt(iValue++),10);
				size--;
			}
			if (size == origSize)
				throw 'Missing number at position ' + iValue;
			return num;
		};
		// Extract a name from the string value and convert to an index
		var getName = function(match, shortNames, longNames) {
			var names = (lookAhead(match) ? longNames : shortNames);
			var size = 0;
			for (var j = 0; j < names.length; j++)
				size = Math.max(size, names[j].length);
			var name = '';
			var iInit = iValue;
			while (size > 0 && iValue < value.length) {
				name += value.charAt(iValue++);
				for (var i = 0; i < names.length; i++)
					if (name == names[i])
						return i + 1;
				size--;
			}
			throw 'Unknown name at position ' + iInit;
		};
		// Confirm that a literal character matches the string value
		var checkLiteral = function() {
			if (value.charAt(iValue) != format.charAt(iFormat))
				throw 'Unexpected literal at position ' + iValue;
			iValue++;
		};
		var iValue = 0;
		for (var iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal)
				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
					literal = false;
				else
					checkLiteral();
			else
				switch (format.charAt(iFormat)) {
					case 'd':
						day = getNumber('d');
						break;
					case 'D':
						getName('D', dayNamesShort, dayNames);
						break;
					case 'o':
						doy = getNumber('o');
						break;
					case 'm':
						month = getNumber('m');
						break;
					case 'M':
						month = getName('M', monthNamesShort, monthNames);
						break;
					case 'y':
						year = getNumber('y');
						break;
					case '@':
						var date = new Date(getNumber('@'));
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "'":
						if (lookAhead("'"))
							checkLiteral();
						else
							literal = true;
						break;
					default:
						checkLiteral();
				}
		}
		if (year == -1)
			year = new Date().getFullYear();
		else if (year < 100)
			year += new Date().getFullYear() - new Date().getFullYear() % 100 +
				(year <= shortYearCutoff ? 0 : -100);
		if (doy > -1) {
			month = 1;
			day = doy;
			do {
				var dim = this._getDaysInMonth(year, month - 1);
				if (day <= dim)
					break;
				month++;
				day -= dim;
			} while (true);
		}
		var date = this._daylightSavingAdjust(new Date(year, month - 1, day));
		if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
			throw 'Invalid date'; // E.g. 31/02/*
		return date;
	},

	/* Standard date formats. */
	ATOM: 'yy-mm-dd', // RFC 3339 (ISO 8601)
	COOKIE: 'D, dd M yy',
	ISO_8601: 'yy-mm-dd',
	RFC_822: 'D, d M y',
	RFC_850: 'DD, dd-M-y',
	RFC_1036: 'D, d M y',
	RFC_1123: 'D, d M yy',
	RFC_2822: 'D, d M yy',
	RSS: 'D, d M y', // RFC 822
	TIMESTAMP: '@',
	W3C: 'yy-mm-dd', // ISO 8601

	/* Format a date object into a string value.
	   The format can be combinations of the following:
	   d  - day of month (no leading zero)
	   dd - day of month (two digit)
	   o  - day of year (no leading zeros)
	   oo - day of year (three digit)
	   D  - day name short
	   DD - day name long
	   m  - month of year (no leading zero)
	   mm - month of year (two digit)
	   M  - month name short
	   MM - month name long
	   y  - year (two digit)
	   yy - year (four digit)
	   @ - Unix timestamp (ms since 01/01/1970)
	   '...' - literal text
	   '' - single quote

	   @param  format    string - the desired format of the date
	   @param  date      Date - the date value to format
	   @param  settings  Object - attributes include:
	                     dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
	                     dayNames         string[7] - names of the days from Sunday (optional)
	                     monthNamesShort  string[12] - abbreviated names of the months (optional)
	                     monthNames       string[12] - names of the months (optional)
	   @return  string - the date in the above format */
	formatDate: function (format, date, settings) {
		if (!date)
			return '';
		var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
		var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
		var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
		var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
		// Check whether a format character is doubled
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		// Format a number, with leading zero if necessary
		var formatNumber = function(match, value, len) {
			var num = '' + value;
			if (lookAhead(match))
				while (num.length < len)
					num = '0' + num;
			return num;
		};
		// Format a name, short or long as requested
		var formatName = function(match, value, shortNames, longNames) {
			return (lookAhead(match) ? longNames[value] : shortNames[value]);
		};
		var output = '';
		var literal = false;
		if (date)
			for (var iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal)
					if (format.charAt(iFormat) == "'" && !lookAhead("'"))
						literal = false;
					else
						output += format.charAt(iFormat);
				else
					switch (format.charAt(iFormat)) {
						case 'd':
							output += formatNumber('d', date.getDate(), 2);
							break;
						case 'D':
							output += formatName('D', date.getDay(), dayNamesShort, dayNames);
							break;
						case 'o':
							var doy = date.getDate();
							for (var m = date.getMonth() - 1; m >= 0; m--)
								doy += this._getDaysInMonth(date.getFullYear(), m);
							output += formatNumber('o', doy, 3);
							break;
						case 'm':
							output += formatNumber('m', date.getMonth() + 1, 2);
							break;
						case 'M':
							output += formatName('M', date.getMonth(), monthNamesShort, monthNames);
							break;
						case 'y':
							output += (lookAhead('y') ? date.getFullYear() :
								(date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
							break;
						case '@':
							output += date.getTime();
							break;
						case "'":
							if (lookAhead("'"))
								output += "'";
							else
								literal = true;
							break;
						default:
							output += format.charAt(iFormat);
					}
			}
		return output;
	},

	/* Extract all possible characters from the date format. */
	_possibleChars: function (format) {
		var chars = '';
		var literal = false;
		for (var iFormat = 0; iFormat < format.length; iFormat++)
			if (literal)
				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
					literal = false;
				else
					chars += format.charAt(iFormat);
			else
				switch (format.charAt(iFormat)) {
					case 'd': case 'm': case 'y': case '@':
						chars += '0123456789';
						break;
					case 'D': case 'M':
						return null; // Accept anything
					case "'":
						if (lookAhead("'"))
							chars += "'";
						else
							literal = true;
						break;
					default:
						chars += format.charAt(iFormat);
				}
		return chars;
	},

	/* Get a setting value, defaulting if necessary. */
	_get: function(inst, name) {
		return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
	},

	/* Parse existing date and initialise date picker. */
	_setDateFromField: function(inst) {
		var dateFormat = this._get(inst, 'dateFormat');
		var dates = inst.input ? inst.input.val() : null;
		inst.endDay = inst.endMonth = inst.endYear = null;
		var date = defaultDate = this._getDefaultDate(inst);
		var settings = this._getFormatConfig(inst);
		try {
			date = this.parseDate(dateFormat, dates, settings) || defaultDate;
		} catch (event) {
			this.log(event);
			date = defaultDate;
		}
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		inst.currentDay = (dates ? date.getDate() : 0);
		inst.currentMonth = (dates ? date.getMonth() : 0);
		inst.currentYear = (dates ? date.getFullYear() : 0);
		this._adjustInstDate(inst);
	},

	/* Retrieve the default date shown on opening. */
	_getDefaultDate: function(inst) {
		var date = this._determineDate(this._get(inst, 'defaultDate'), new Date());
		var minDate = this._getMinMaxDate(inst, 'min', true);
		var maxDate = this._getMinMaxDate(inst, 'max');
		date = (minDate && date < minDate ? minDate : date);
		date = (maxDate && date > maxDate ? maxDate : date);
		return date;
	},

	/* A date may be specified as an exact value or a relative one. */
	_determineDate: function(date, defaultDate) {
		var offsetNumeric = function(offset) {
			var date = new Date();
			date.setDate(date.getDate() + offset);
			return date;
		};
		var offsetString = function(offset, getDaysInMonth) {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
			var matches = pattern.exec(offset);
			while (matches) {
				switch (matches[2] || 'd') {
					case 'd' : case 'D' :
						day += parseInt(matches[1],10); break;
					case 'w' : case 'W' :
						day += parseInt(matches[1],10) * 7; break;
					case 'm' : case 'M' :
						month += parseInt(matches[1],10);
						day = Math.min(day, getDaysInMonth(year, month));
						break;
					case 'y': case 'Y' :
						year += parseInt(matches[1],10);
						day = Math.min(day, getDaysInMonth(year, month));
						break;
				}
				matches = pattern.exec(offset);
			}
			return new Date(year, month, day);
		};
		date = (date == null ? defaultDate :
			(typeof date == 'string' ? offsetString(date, this._getDaysInMonth) :
			(typeof date == 'number' ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : date)));
		date = (date && date.toString() == 'Invalid Date' ? defaultDate : date);
		if (date) {
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
		}
		return this._daylightSavingAdjust(date);
	},

	/* Handle switch to/from daylight saving.
	   Hours may be non-zero on daylight saving cut-over:
	   > 12 when midnight changeover, but then cannot generate
	   midnight datetime, so jump to 1AM, otherwise reset.
	   @param  date  (Date) the date to check
	   @return  (Date) the corrected date */
	_daylightSavingAdjust: function(date) {
		if (!date) return null;
		date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
		return date;
	},

	/* Set the date(s) directly. */
	_setDate: function(inst, date, endDate) {
		var clear = !(date);
		var origMonth = inst.selectedMonth;
		var origYear = inst.selectedYear;
		date = this._determineDate(date, new Date());
		inst.selectedDay = inst.currentDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = inst.currentMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = inst.currentYear = date.getFullYear();
		if (origMonth != inst.selectedMonth || origYear != inst.selectedYear)
			this._notifyChange(inst);
		this._adjustInstDate(inst);
		if (inst.input) {
			inst.input.val(clear ? '' : this._formatDate(inst));
		}
	},

	/* Retrieve the date(s) directly. */
	_getDate: function(inst) {
		var startDate = (!inst.currentYear || (inst.input && inst.input.val() == '') ? null :
			this._daylightSavingAdjust(new Date(
			inst.currentYear, inst.currentMonth, inst.currentDay)));
			return startDate;
	},

	/* Generate the HTML for the current state of the date picker. */
	_generateHTML: function(inst) {
		var today = new Date();
		today = this._daylightSavingAdjust(
			new Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear time
		var isRTL = this._get(inst, 'isRTL');
		var showButtonPanel = this._get(inst, 'showButtonPanel');
		var hideIfNoPrevNext = this._get(inst, 'hideIfNoPrevNext');
		var navigationAsDateFormat = this._get(inst, 'navigationAsDateFormat');
		var numMonths = this._getNumberOfMonths(inst);
		var showCurrentAtPos = this._get(inst, 'showCurrentAtPos');
		var stepMonths = this._get(inst, 'stepMonths');
		var stepBigMonths = this._get(inst, 'stepBigMonths');
		var isMultiMonth = (numMonths[0] != 1 || numMonths[1] != 1);
		var currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
			new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		var minDate = this._getMinMaxDate(inst, 'min', true);
		var maxDate = this._getMinMaxDate(inst, 'max');
		var drawMonth = inst.drawMonth - showCurrentAtPos;
		var drawYear = inst.drawYear;
		if (drawMonth < 0) {
			drawMonth += 12;
			drawYear--;
		}
		if (maxDate) {
			var maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
				maxDate.getMonth() - numMonths[1] + 1, maxDate.getDate()));
			maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
			while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
				drawMonth--;
				if (drawMonth < 0) {
					drawMonth = 11;
					drawYear--;
				}
			}
		}
		var prevText = this._get(inst, 'prevText');
		prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
			this._getFormatConfig(inst)));
		var prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
			'<a class="ui-datepicker-prev ui-corner-all" onclick="jQuery.datepicker._adjustDate(\'#' + inst.id + '\', -' + stepMonths + ', \'M\');"' +
			' title="' + prevText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>' :
			(hideIfNoPrevNext ? '' : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+ prevText +'"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>'));
		var nextText = this._get(inst, 'nextText');
		nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
			this._getFormatConfig(inst)));
		var next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
			'<a class="ui-datepicker-next ui-corner-all" onclick="jQuery.datepicker._adjustDate(\'#' + inst.id + '\', +' + stepMonths + ', \'M\');"' +
			' title="' + nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>' :
			(hideIfNoPrevNext ? '' : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+ nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>'));
		var currentText = this._get(inst, 'currentText');
		var gotoDate = (this._get(inst, 'gotoCurrent') && inst.currentDay ? currentDate : today);
		currentText = (!navigationAsDateFormat ? currentText :
			this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
		var controls = '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="jQuery.datepicker._hideDatepicker();">' + this._get(inst, 'closeText') + '</button>';
		var buttonPanel = (showButtonPanel) ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (isRTL ? controls : '') +
			(this._isInRange(inst, gotoDate) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="jQuery.datepicker._gotoToday(\'#' + inst.id + '\');"' +
			'>' + currentText + '</button>' : '') + (isRTL ? '' : controls) + '</div>' : '';
		var firstDay = parseInt(this._get(inst, 'firstDay'),10);
		firstDay = (isNaN(firstDay) ? 0 : firstDay);
		var dayNames = this._get(inst, 'dayNames');
		var dayNamesShort = this._get(inst, 'dayNamesShort');
		var dayNamesMin = this._get(inst, 'dayNamesMin');
		var monthNames = this._get(inst, 'monthNames');
		var monthNamesShort = this._get(inst, 'monthNamesShort');
		var beforeShowDay = this._get(inst, 'beforeShowDay');
		var showOtherMonths = this._get(inst, 'showOtherMonths');
		var calculateWeek = this._get(inst, 'calculateWeek') || this.iso8601Week;
		var endDate = inst.endDay ? this._daylightSavingAdjust(
			new Date(inst.endYear, inst.endMonth, inst.endDay)) : currentDate;
		var defaultDate = this._getDefaultDate(inst);
		var html = '';
		for (var row = 0; row < numMonths[0]; row++) {
			var group = '';
			for (var col = 0; col < numMonths[1]; col++) {
				var selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
				var cornerClass = ' ui-corner-all';
				var calender = '';
				if (isMultiMonth) {
					calender += '<div class="ui-datepicker-group ui-datepicker-group-';
					switch (col) {
						case 0: calender += 'first'; cornerClass = ' ui-corner-' + (isRTL ? 'right' : 'left'); break;
						case numMonths[1]-1: calender += 'last'; cornerClass = ' ui-corner-' + (isRTL ? 'left' : 'right'); break;
						default: calender += 'middle'; cornerClass = ''; break;
					}
					calender += '">';
				}
				calender += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + cornerClass + '">' +
					(/all|left/.test(cornerClass) && row == 0 ? (isRTL ? next : prev) : '') +
					(/all|right/.test(cornerClass) && row == 0 ? (isRTL ? prev : next) : '') +
					this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
					selectedDate, row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
					'</div><table class="ui-datepicker-calendar"><thead>' +
					'<tr>';
				var thead = '';
				for (var dow = 0; dow < 7; dow++) { // days of the week
					var day = (dow + firstDay) % 7;
					thead += '<th' + ((dow + firstDay + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : '') + '>' +
						'<span title="' + dayNames[day] + '">' + dayNamesMin[day] + '</span></th>';
				}
				calender += thead + '</tr></thead><tbody>';
				var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
				if (drawYear == inst.selectedYear && drawMonth == inst.selectedMonth)
					inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
				var leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
				var numRows = (isMultiMonth ? 6 : Math.ceil((leadDays + daysInMonth) / 7)); // calculate the number of rows to generate
				var printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
				for (var dRow = 0; dRow < numRows; dRow++) { // create date picker rows
					calender += '<tr>';
					var tbody = '';
					for (var dow = 0; dow < 7; dow++) { // create date picker days
						var daySettings = (beforeShowDay ?
							beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, '']);
						var otherMonth = (printDate.getMonth() != drawMonth);
						var unselectable = otherMonth || !daySettings[0] ||
							(minDate && printDate < minDate) || (maxDate && printDate > maxDate);
						tbody += '<td class="' +
							((dow + firstDay + 6) % 7 >= 5 ? ' ui-datepicker-week-end' : '') + // highlight weekends
							(otherMonth ? ' ui-datepicker-other-month' : '') + // highlight days from other months
							((printDate.getTime() == selectedDate.getTime() && drawMonth == inst.selectedMonth && inst._keyEvent) || // user pressed key
							(defaultDate.getTime() == printDate.getTime() && defaultDate.getTime() == selectedDate.getTime()) ?
							// or defaultDate is current printedDate and defaultDate is selectedDate
							' ' + this._dayOverClass : '') + // highlight selected day
							(unselectable ? ' ' + this._unselectableClass + ' ui-state-disabled': '') +  // highlight unselectable days
							(otherMonth && !showOtherMonths ? '' : ' ' + daySettings[1] + // highlight custom dates
							(printDate.getTime() >= currentDate.getTime() && printDate.getTime() <= endDate.getTime() ? // in current range
							' ' + this._currentClass : '') + // highlight selected day
							(printDate.getTime() == today.getTime() ? ' ui-datepicker-today' : '')) + '"' + // highlight today (if different)
							((!otherMonth || showOtherMonths) && daySettings[2] ? ' title="' + daySettings[2] + '"' : '') + // cell title
							(unselectable ? '' : ' onclick="jQuery.datepicker._selectDay(\'#' +
							inst.id + '\',' + drawMonth + ',' + drawYear + ', this);return false;"') + '>' + // actions
							(otherMonth ? (showOtherMonths ? printDate.getDate() : '&#xa0;') : // display for other months
							(unselectable ? '<span class="ui-state-default">' + printDate.getDate() + '</span>' : '<a class="ui-state-default' +
							(printDate.getTime() == today.getTime() ? ' ui-state-highlight' : '') +
							(printDate.getTime() >= currentDate.getTime() && printDate.getTime() <= endDate.getTime() ? // in current range
							' ui-state-active' : '') + // highlight selected day
							'" href="#">' + printDate.getDate() + '</a>')) + '</td>'; // display for this month
						printDate.setDate(printDate.getDate() + 1);
						printDate = this._daylightSavingAdjust(printDate);
					}
					calender += tbody + '</tr>';
				}
				drawMonth++;
				if (drawMonth > 11) {
					drawMonth = 0;
					drawYear++;
				}
				calender += '</tbody></table>' + (isMultiMonth ? '</div>' : '');
				group += calender;
			}
			html += group;
		}
		html += (!inst.inline ? buttonPanel : '') +
			($.browser.msie && parseInt($.browser.version,10) < 7 && !inst.inline ?
			'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : '');
		inst._keyEvent = false;
		return html;
	},

	/* Generate the month and year header. */
	_generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
			selectedDate, secondary, monthNames, monthNamesShort) {
		minDate = (inst.rangeStart && minDate && selectedDate < minDate ? selectedDate : minDate);
		var changeMonth = this._get(inst, 'changeMonth');
		var changeYear = this._get(inst, 'changeYear');
		var showMonthAfterYear = this._get(inst, 'showMonthAfterYear');
		var html = '<div class="ui-datepicker-title">';
		var monthHtml = '';
		// month selection
		if (secondary || !changeMonth)
			monthHtml += '<span class="ui-datepicker-month">' + monthNames[drawMonth] + '</span> ';
		else {
			var inMinYear = (minDate && minDate.getFullYear() == drawYear);
			var inMaxYear = (maxDate && maxDate.getFullYear() == drawYear);
			monthHtml += '<select class="ui-datepicker-month" ' +
				'onchange="jQuery.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'M\');" ' +
				'onclick="jQuery.datepicker._clickMonthYear(\'#' + inst.id + '\');"' +
			 	'>';
			for (var month = 0; month < 12; month++) {
				if ((!inMinYear || month >= minDate.getMonth()) &&
						(!inMaxYear || month <= maxDate.getMonth()))
					monthHtml += '<option value="' + month + '"' +
						(month == drawMonth ? ' selected="selected"' : '') +
						'>' + monthNamesShort[month] + '</option>';
			}
			monthHtml += '</select>';
		}
		if (!showMonthAfterYear)
			html += monthHtml + ((secondary || changeMonth || changeYear) && (!(changeMonth && changeYear)) ? '&#xa0;' : '');
		// year selection
		if (secondary || !changeYear)
			html += '<span class="ui-datepicker-year">' + drawYear + '</span>';
		else {
			// determine range of years to display
			var years = this._get(inst, 'yearRange').split(':');
			var year = 0;
			var endYear = 0;
			if (years.length != 2) {
				year = drawYear - 10;
				endYear = drawYear + 10;
			} else if (years[0].charAt(0) == '+' || years[0].charAt(0) == '-') {
				year = endYear = new Date().getFullYear();
				year += parseInt(years[0], 10);
				endYear += parseInt(years[1], 10);
			} else {
				year = parseInt(years[0], 10);
				endYear = parseInt(years[1], 10);
			}
			year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
			endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
			html += '<select class="ui-datepicker-year" ' +
				'onchange="jQuery.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'Y\');" ' +
				'onclick="jQuery.datepicker._clickMonthYear(\'#' + inst.id + '\');"' +
				'>';
			for (; year <= endYear; year++) {
				html += '<option value="' + year + '"' +
					(year == drawYear ? ' selected="selected"' : '') +
					'>' + year + '</option>';
			}
			html += '</select>';
		}
		if (showMonthAfterYear)
			html += (secondary || changeMonth || changeYear ? '&#xa0;' : '') + monthHtml;
		html += '</div>'; // Close datepicker_header
		return html;
	},

	/* Adjust one of the date sub-fields. */
	_adjustInstDate: function(inst, offset, period) {
		var year = inst.drawYear + (period == 'Y' ? offset : 0);
		var month = inst.drawMonth + (period == 'M' ? offset : 0);
		var day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) +
			(period == 'D' ? offset : 0);
		var date = this._daylightSavingAdjust(new Date(year, month, day));
		// ensure it is within the bounds set
		var minDate = this._getMinMaxDate(inst, 'min', true);
		var maxDate = this._getMinMaxDate(inst, 'max');
		date = (minDate && date < minDate ? minDate : date);
		date = (maxDate && date > maxDate ? maxDate : date);
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		if (period == 'M' || period == 'Y')
			this._notifyChange(inst);
	},

	/* Notify change of month/year. */
	_notifyChange: function(inst) {
		var onChange = this._get(inst, 'onChangeMonthYear');
		if (onChange)
			onChange.apply((inst.input ? inst.input[0] : null),
				[inst.selectedYear, inst.selectedMonth + 1, inst]);
	},

	/* Determine the number of months to show. */
	_getNumberOfMonths: function(inst) {
		var numMonths = this._get(inst, 'numberOfMonths');
		return (numMonths == null ? [1, 1] : (typeof numMonths == 'number' ? [1, numMonths] : numMonths));
	},

	/* Determine the current maximum date - ensure no time components are set - may be overridden for a range. */
	_getMinMaxDate: function(inst, minMax, checkRange) {
		var date = this._determineDate(this._get(inst, minMax + 'Date'), null);
		return (!checkRange || !inst.rangeStart ? date :
			(!date || inst.rangeStart > date ? inst.rangeStart : date));
	},

	/* Find the number of days in a given month. */
	_getDaysInMonth: function(year, month) {
		return 32 - new Date(year, month, 32).getDate();
	},

	/* Find the day of the week of the first of a month. */
	_getFirstDayOfMonth: function(year, month) {
		return new Date(year, month, 1).getDay();
	},

	/* Determines if we should allow a "next/prev" month display change. */
	_canAdjustMonth: function(inst, offset, curYear, curMonth) {
		var numMonths = this._getNumberOfMonths(inst);
		var date = this._daylightSavingAdjust(new Date(
			curYear, curMonth + (offset < 0 ? offset : numMonths[1]), 1));
		if (offset < 0)
			date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
		return this._isInRange(inst, date);
	},

	/* Is the given date in the accepted range? */
	_isInRange: function(inst, date) {
		// during range selection, use minimum of selected date and range start
		var newMinDate = (!inst.rangeStart ? null : this._daylightSavingAdjust(
			new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)));
		newMinDate = (newMinDate && inst.rangeStart < newMinDate ? inst.rangeStart : newMinDate);
		var minDate = newMinDate || this._getMinMaxDate(inst, 'min');
		var maxDate = this._getMinMaxDate(inst, 'max');
		return ((!minDate || date >= minDate) && (!maxDate || date <= maxDate));
	},

	/* Provide the configuration settings for formatting/parsing. */
	_getFormatConfig: function(inst) {
		var shortYearCutoff = this._get(inst, 'shortYearCutoff');
		shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
			new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
		return {shortYearCutoff: shortYearCutoff,
			dayNamesShort: this._get(inst, 'dayNamesShort'), dayNames: this._get(inst, 'dayNames'),
			monthNamesShort: this._get(inst, 'monthNamesShort'), monthNames: this._get(inst, 'monthNames')};
	},

	/* Format the given date for display. */
	_formatDate: function(inst, day, month, year) {
		if (!day) {
			inst.currentDay = inst.selectedDay;
			inst.currentMonth = inst.selectedMonth;
			inst.currentYear = inst.selectedYear;
		}
		var date = (day ? (typeof day == 'object' ? day :
			this._daylightSavingAdjust(new Date(year, month, day))) :
			this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		return this.formatDate(this._get(inst, 'dateFormat'), date, this._getFormatConfig(inst));
	}
});

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props)
		if (props[name] == null || props[name] == undefined)
			target[name] = props[name];
	return target;
};

/* Determine whether an object is an array. */
function isArray(a) {
	return (a && (($.browser.safari && typeof a == 'object' && a.length) ||
		(a.constructor && a.constructor.toString().match(/\Array\(\)/))));
};

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
                    Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

	/* Initialise the date picker. */
	if (!$.datepicker.initialized) {
		$(document.body).append($.datepicker.dpDiv).
			mousedown($.datepicker._checkExternalClick);
		$.datepicker.initialized = true;
	}

	var otherArgs = Array.prototype.slice.call(arguments, 1);
	if (typeof options == 'string' && (options == 'isDisabled' || options == 'getDate'))
		return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
	return this.each(function() {
		typeof options == 'string' ?
			$.datepicker['_' + options + 'Datepicker'].
				apply($.datepicker, [this].concat(otherArgs)) :
			$.datepicker._attachDatepicker(this, options);
	});
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.6rc5";

})(jQuery);
/*
 * jQuery UI Progressbar 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   ui.core.js
 */
(function($) {

$.widget("ui.progressbar", {

	_init: function() {

		var self = this,
			options = this.options;

		this.element
			.addClass("ui-progressbar"
				+ " ui-widget"
				+ " ui-widget-content"
				+ " ui-corner-all")
			.attr({
				role: "progressbar",
				"aria-valuemin": this._valueMin(),
				"aria-valuemax": this._valueMax(),
				"aria-valuenow": this._value()
			});

		this.valueDiv = $('<div class="ui-progressbar-value ui-widget-header ui-corner-left"></div>').appendTo(this.element);

		this._refreshValue();

	},

	destroy: function() {

		this.element
			.removeClass("ui-progressbar"
				+ " ui-widget"
				+ " ui-widget-content"
				+ " ui-corner-all")
			.removeAttr("role")
			.removeAttr("aria-valuemin")
			.removeAttr("aria-valuemax")
			.removeAttr("aria-valuenow")
			.removeData("progressbar")
			.unbind(".progressbar");

		this.valueDiv.remove();

		$.widget.prototype.destroy.apply(this, arguments);

	},

	value: function(newValue) {
		arguments.length && this._setData("value", newValue);

		return this._value();
	},

	_setData: function(key, value){
		switch (key) {
			case 'value':
				this.options.value = value;
				this._refreshValue();
				this._trigger('change', null, {});
				break;
		}

		$.widget.prototype._setData.apply(this, arguments);
	},

	_value: function() {
		var val = this.options.value;
		if (val < this._valueMin()) val = this._valueMin();
		if (val > this._valueMax()) val = this._valueMax();

		return val;
	},

	_valueMin: function() {
		var valueMin = 0;

		return valueMin;
	},

	_valueMax: function() {
		var valueMax = 100;

		return valueMax;
	},

	_refreshValue: function() {
		var value = this.value();
		this.valueDiv[value == this._valueMax() ? 'addClass' : 'removeClass']("ui-corner-right");
		this.valueDiv.width(value + '%');
		this.element.attr("aria-valuenow", value);
	}

});

$.extend($.ui.progressbar, {
	version: "1.6rc5",
	defaults: {
		value: 0
	}
});

})(jQuery);
/*
 * jQuery UI Effects 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/
 */
;(function($) {

$.effects = $.effects || {}; //Add the 'effects' scope

$.extend($.effects, {
	version: "1.6rc5",
	
	// Saves a set of properties in a data storage
	save: function(element, set) {
		for(var i=0; i < set.length; i++) {
			if(set[i] !== null) element.data("ec.storage."+set[i], element[0].style[set[i]]);
		}
	},
	
	// Restores a set of previously saved properties from a data storage
	restore: function(element, set) {
		for(var i=0; i < set.length; i++) {
			if(set[i] !== null) element.css(set[i], element.data("ec.storage."+set[i]));
		}
	},
	
	setMode: function(el, mode) {
		if (mode == 'toggle') mode = el.is(':hidden') ? 'show' : 'hide'; // Set for toggle
		return mode;
	},
	
	getBaseline: function(origin, original) { // Translates a [top,left] array into a baseline value
		// this should be a little more flexible in the future to handle a string & hash
		var y, x;
		switch (origin[0]) {
			case 'top': y = 0; break;
			case 'middle': y = 0.5; break;
			case 'bottom': y = 1; break;
			default: y = origin[0] / original.height;
		};
		switch (origin[1]) {
			case 'left': x = 0; break;
			case 'center': x = 0.5; break;
			case 'right': x = 1; break;
			default: x = origin[1] / original.width;
		};
		return {x: x, y: y};
	},
	
	// Wraps the element around a wrapper that copies position properties
	createWrapper: function(element) {

		//if the element is already wrapped, return it
		if (element.parent().is('.ui-effects-wrapper'))
			return element.parent();

		//Cache width,height and float properties of the element, and create a wrapper around it
		var props = { width: element.outerWidth(true), height: element.outerHeight(true), 'float': element.css('float') };
		element.wrap('<div class="ui-effects-wrapper" style="font-size:100%;background:transparent;border:none;margin:0;padding:0"></div>');
		var wrapper = element.parent();

		//Transfer the positioning of the element to the wrapper
		if (element.css('position') == 'static') {
			wrapper.css({ position: 'relative' });
			element.css({ position: 'relative'} );
		} else {
			var top = element.css('top'); if(isNaN(parseInt(top,10))) top = 'auto';
			var left = element.css('left'); if(isNaN(parseInt(left,10))) left = 'auto';
			wrapper.css({ position: element.css('position'), top: top, left: left, zIndex: element.css('z-index') }).show();
			element.css({position: 'relative', top: 0, left: 0 });
		}

		wrapper.css(props);
		return wrapper;
	},

	removeWrapper: function(element) {
		if (element.parent().is('.ui-effects-wrapper'))
			return element.parent().replaceWith(element);
		return element;
	},

	setTransition: function(element, list, factor, value) {
		value = value || {};
		$.each(list, function(i, x){
			unit = element.cssUnit(x);
			if (unit[0] > 0) value[x] = unit[0] * factor + unit[1];
		});
		return value;
	},

	//Base function to animate from one class to another in a seamless transition
	animateClass: function(value, duration, easing, callback) {

		var cb = (typeof easing == "function" ? easing : (callback ? callback : null));
		var ea = (typeof easing == "string" ? easing : null);

		return this.each(function() {

			var offset = {}; var that = $(this); var oldStyleAttr = that.attr("style") || '';
			if(typeof oldStyleAttr == 'object') oldStyleAttr = oldStyleAttr["cssText"]; /* Stupidly in IE, style is a object.. */
			if(value.toggle) { that.hasClass(value.toggle) ? value.remove = value.toggle : value.add = value.toggle; }

			//Let's get a style offset
			var oldStyle = $.extend({}, (document.defaultView ? document.defaultView.getComputedStyle(this,null) : this.currentStyle));
			if(value.add) that.addClass(value.add); if(value.remove) that.removeClass(value.remove);
			var newStyle = $.extend({}, (document.defaultView ? document.defaultView.getComputedStyle(this,null) : this.currentStyle));
			if(value.add) that.removeClass(value.add); if(value.remove) that.addClass(value.remove);

			// The main function to form the object for animation
			for(var n in newStyle) {
				if( typeof newStyle[n] != "function" && newStyle[n] /* No functions and null properties */
				&& n.indexOf("Moz") == -1 && n.indexOf("length") == -1 /* No mozilla spezific render properties. */
				&& newStyle[n] != oldStyle[n] /* Only values that have changed are used for the animation */
				&& (n.match(/color/i) || (!n.match(/color/i) && !isNaN(parseInt(newStyle[n],10)))) /* Only things that can be parsed to integers or colors */
				&& (oldStyle.position != "static" || (oldStyle.position == "static" && !n.match(/left|top|bottom|right/))) /* No need for positions when dealing with static positions */
				) offset[n] = newStyle[n];
			}

			that.animate(offset, duration, ea, function() { // Animate the newly constructed offset object
				// Change style attribute back to original. For stupid IE, we need to clear the damn object.
				if(typeof $(this).attr("style") == 'object') { $(this).attr("style")["cssText"] = ""; $(this).attr("style")["cssText"] = oldStyleAttr; } else $(this).attr("style", oldStyleAttr);
				if(value.add) $(this).addClass(value.add); if(value.remove) $(this).removeClass(value.remove);
				if(cb) cb.apply(this, arguments);
			});

		});
	}
});

//Extend the methods of jQuery
$.fn.extend({
	
	//Save old methods
	_show: $.fn.show,
	_hide: $.fn.hide,
	__toggle: $.fn.toggle,
	_addClass: $.fn.addClass,
	_removeClass: $.fn.removeClass,
	_toggleClass: $.fn.toggleClass,
	
	// New effect methods
	effect: function(fx, options, speed, callback) {
		return $.effects[fx] ? $.effects[fx].call(this, {method: fx, options: options || {}, duration: speed, callback: callback }) : null;
	},
	
	show: function() {
		if(!arguments[0] || (arguments[0].constructor == Number || (/(slow|normal|fast)/).test(arguments[0])))
			return this._show.apply(this, arguments);
		else {
			var o = arguments[1] || {}; o['mode'] = 'show';
			return this.effect.apply(this, [arguments[0], o, arguments[2] || o.duration, arguments[3] || o.callback]);
		}
	},
	
	hide: function() {
		if(!arguments[0] || (arguments[0].constructor == Number || (/(slow|normal|fast)/).test(arguments[0])))
			return this._hide.apply(this, arguments);
		else {
			var o = arguments[1] || {}; o['mode'] = 'hide';
			return this.effect.apply(this, [arguments[0], o, arguments[2] || o.duration, arguments[3] || o.callback]);
		}
	},
	
	toggle: function(){
		if(!arguments[0] || (arguments[0].constructor == Number || (/(slow|normal|fast)/).test(arguments[0])) || (arguments[0].constructor == Function))
			return this.__toggle.apply(this, arguments);
		else {
			var o = arguments[1] || {}; o['mode'] = 'toggle';
			return this.effect.apply(this, [arguments[0], o, arguments[2] || o.duration, arguments[3] || o.callback]);
		}
	},
	
	addClass: function(classNames, speed, easing, callback) {
		return speed ? $.effects.animateClass.apply(this, [{ add: classNames },speed,easing,callback]) : this._addClass(classNames);
	},
	removeClass: function(classNames,speed,easing,callback) {
		return speed ? $.effects.animateClass.apply(this, [{ remove: classNames },speed,easing,callback]) : this._removeClass(classNames);
	},
	toggleClass: function(classNames,speed,easing,callback) {
		return speed ? $.effects.animateClass.apply(this, [{ toggle: classNames },speed,easing,callback]) : this._toggleClass(classNames);
	},
	morph: function(remove,add,speed,easing,callback) {
		return $.effects.animateClass.apply(this, [{ add: add, remove: remove },speed,easing,callback]);
	},
	switchClass: function() {
		return this.morph.apply(this, arguments);
	},
	
	// helper functions
	cssUnit: function(key) {
		var style = this.css(key), val = [];
		$.each( ['em','px','%','pt'], function(i, unit){
			if(style.indexOf(unit) > 0)
				val = [parseFloat(style), unit];
		});
		return val;
	}
});

/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */

// We override the animation for all of these color styles
$.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
		$.fx.step[attr] = function(fx) {
				if ( fx.state == 0 ) {
						fx.start = getColor( fx.elem, attr );
						fx.end = getRGB( fx.end );
				}

				fx.elem.style[attr] = "rgb(" + [
						Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0],10), 255), 0),
						Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1],10), 255), 0),
						Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2],10), 255), 0)
				].join(",") + ")";
			};
});

// Color Conversion functions from highlightFade
// By Blair Mitchelmore
// http://jquery.offput.ca/highlightFade/

// Parse strings looking for color tuples [255,255,255]
function getRGB(color) {
		var result;

		// Check if we're already dealing with an array of colors
		if ( color && color.constructor == Array && color.length == 3 )
				return color;

		// Look for rgb(num,num,num)
		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
				return [parseInt(result[1],10), parseInt(result[2],10), parseInt(result[3],10)];

		// Look for rgb(num%,num%,num%)
		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
				return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

		// Look for #a0b1c2
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
				return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		// Look for #fff
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
				return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

		// Look for rgba(0, 0, 0, 0) == transparent in Safari 3
		if (result = /rgba\(0, 0, 0, 0\)/.exec(color))
				return colors['transparent'];

		// Otherwise, we're most likely dealing with a named color
		return colors[$.trim(color).toLowerCase()];
}

function getColor(elem, attr) {
		var color;

		do {
				color = $.curCSS(elem, attr);

				// Keep going until we find an element that has color, or we hit the body
				if ( color != '' && color != 'transparent' || $.nodeName(elem, "body") )
						break;

				attr = "backgroundColor";
		} while ( elem = elem.parentNode );

		return getRGB(color);
};

// Some named colors to work with
// From Interface by Stefan Petre
// http://interface.eyecon.ro/

var colors = {
	aqua:[0,255,255],
	azure:[240,255,255],
	beige:[245,245,220],
	black:[0,0,0],
	blue:[0,0,255],
	brown:[165,42,42],
	cyan:[0,255,255],
	darkblue:[0,0,139],
	darkcyan:[0,139,139],
	darkgrey:[169,169,169],
	darkgreen:[0,100,0],
	darkkhaki:[189,183,107],
	darkmagenta:[139,0,139],
	darkolivegreen:[85,107,47],
	darkorange:[255,140,0],
	darkorchid:[153,50,204],
	darkred:[139,0,0],
	darksalmon:[233,150,122],
	darkviolet:[148,0,211],
	fuchsia:[255,0,255],
	gold:[255,215,0],
	green:[0,128,0],
	indigo:[75,0,130],
	khaki:[240,230,140],
	lightblue:[173,216,230],
	lightcyan:[224,255,255],
	lightgreen:[144,238,144],
	lightgrey:[211,211,211],
	lightpink:[255,182,193],
	lightyellow:[255,255,224],
	lime:[0,255,0],
	magenta:[255,0,255],
	maroon:[128,0,0],
	navy:[0,0,128],
	olive:[128,128,0],
	orange:[255,165,0],
	pink:[255,192,203],
	purple:[128,0,128],
	violet:[128,0,128],
	red:[255,0,0],
	silver:[192,192,192],
	white:[255,255,255],
	yellow:[255,255,0],
	transparent: [255,255,255]
};

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
$.easing.jswing = $.easing.swing;

$.extend($.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert($.easing.default);
		return $.easing[$.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

})(jQuery);
/*
 * jQuery UI Effects Blind 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Blind
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.blind = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','left'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
		var direction = o.options.direction || 'vertical'; // Default direction

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		var wrapper = $.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
		var ref = (direction == 'vertical') ? 'height' : 'width';
		var distance = (direction == 'vertical') ? wrapper.height() : wrapper.width();
		if(mode == 'show') wrapper.css(ref, 0); // Shift

		// Animation
		var animation = {};
		animation[ref] = mode == 'show' ? distance : 0;

		// Animate
		wrapper.animate(animation, o.duration, o.options.easing, function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(el[0], arguments); // Callback
			el.dequeue();
		});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Bounce 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Bounce
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.bounce = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','left'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var direction = o.options.direction || 'up'; // Default direction
		var distance = o.options.distance || 20; // Default distance
		var times = o.options.times || 5; // Default # of times
		var speed = o.duration || 250; // Default speed per bounce
		if (/show|hide/.test(mode)) props.push('opacity'); // Avoid touching opacity to prevent clearType and PNG issues in IE

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
		var distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) / 3 : el.outerWidth({margin:true}) / 3);
		if (mode == 'show') el.css('opacity', 0).css(ref, motion == 'pos' ? -distance : distance); // Shift
		if (mode == 'hide') distance = distance / (times * 2);
		if (mode != 'hide') times--;

		// Animate
		if (mode == 'show') { // Show Bounce
			var animation = {opacity: 1};
			animation[ref] = (motion == 'pos' ? '+=' : '-=') + distance;
			el.animate(animation, speed / 2, o.options.easing);
			distance = distance / 2;
			times--;
		};
		for (var i = 0; i < times; i++) { // Bounces
			var animation1 = {}, animation2 = {};
			animation1[ref] = (motion == 'pos' ? '-=' : '+=') + distance;
			animation2[ref] = (motion == 'pos' ? '+=' : '-=') + distance;
			el.animate(animation1, speed / 2, o.options.easing).animate(animation2, speed / 2, o.options.easing);
			distance = (mode == 'hide') ? distance * 2 : distance / 2;
		};
		if (mode == 'hide') { // Last Bounce
			var animation = {opacity: 0};
			animation[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
			el.animate(animation, speed / 2, o.options.easing, function(){
				el.hide(); // Hide
				$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
				if(o.callback) o.callback.apply(this, arguments); // Callback
			});
		} else {
			var animation1 = {}, animation2 = {};
			animation1[ref] = (motion == 'pos' ? '-=' : '+=') + distance;
			animation2[ref] = (motion == 'pos' ? '+=' : '-=') + distance;
			el.animate(animation1, speed / 2, o.options.easing).animate(animation2, speed / 2, o.options.easing, function(){
				$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
				if(o.callback) o.callback.apply(this, arguments); // Callback
			});
		};
		el.queue('fx', function() { el.dequeue(); });
		el.dequeue();
	});

};

})(jQuery);
/*
 * jQuery UI Effects Clip 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Clip
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.clip = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','left','height','width'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
		var direction = o.options.direction || 'vertical'; // Default direction

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		var wrapper = $.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
		var animate = el[0].tagName == 'IMG' ? wrapper : el;
		var ref = {
			size: (direction == 'vertical') ? 'height' : 'width',
			position: (direction == 'vertical') ? 'top' : 'left'
		};
		var distance = (direction == 'vertical') ? animate.height() : animate.width();
		if(mode == 'show') { animate.css(ref.size, 0); animate.css(ref.position, distance / 2); } // Shift

		// Animation
		var animation = {};
		animation[ref.size] = mode == 'show' ? distance : 0;
		animation[ref.position] = mode == 'show' ? 0 : distance / 2;

		// Animate
		animate.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(el[0], arguments); // Callback
			el.dequeue();
		}});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Drop 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Drop
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.drop = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','left','opacity'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
		var direction = o.options.direction || 'left'; // Default Direction

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
		var distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) / 2 : el.outerWidth({margin:true}) / 2);
		if (mode == 'show') el.css('opacity', 0).css(ref, motion == 'pos' ? -distance : distance); // Shift

		// Animation
		var animation = {opacity: mode == 'show' ? 1 : 0};
		animation[ref] = (mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;

		// Animate
		el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(this, arguments); // Callback
			el.dequeue();
		}});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Explode 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Explode
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.explode = function(o) {

	return this.queue(function() {

	var rows = o.options.pieces ? Math.round(Math.sqrt(o.options.pieces)) : 3;
	var cells = o.options.pieces ? Math.round(Math.sqrt(o.options.pieces)) : 3;

	o.options.mode = o.options.mode == 'toggle' ? ($(this).is(':visible') ? 'hide' : 'show') : o.options.mode;
	var el = $(this).show().css('visibility', 'hidden');
	var offset = el.offset();

	//Substract the margins - not fixing the problem yet.
	offset.top -= parseInt(el.css("marginTop")) || 0;
	offset.left -= parseInt(el.css("marginLeft")) || 0;

	var width = el.outerWidth(true);
	var height = el.outerHeight(true);

	for(var i=0;i<rows;i++) { // =
		for(var j=0;j<cells;j++) { // ||
			el
				.clone()
				.appendTo('body')
				.wrap('<div></div>')
				.css({
					position: 'absolute',
					visibility: 'visible',
					left: -j*(width/cells),
					top: -i*(height/rows)
				})
				.parent()
				.addClass('ui-effects-explode')
				.css({
					position: 'absolute',
					overflow: 'hidden',
					width: width/cells,
					height: height/rows,
					left: offset.left + j*(width/cells) + (o.options.mode == 'show' ? (j-Math.floor(cells/2))*(width/cells) : 0),
					top: offset.top + i*(height/rows) + (o.options.mode == 'show' ? (i-Math.floor(rows/2))*(height/rows) : 0),
					opacity: o.options.mode == 'show' ? 0 : 1
				}).animate({
					left: offset.left + j*(width/cells) + (o.options.mode == 'show' ? 0 : (j-Math.floor(cells/2))*(width/cells)),
					top: offset.top + i*(height/rows) + (o.options.mode == 'show' ? 0 : (i-Math.floor(rows/2))*(height/rows)),
					opacity: o.options.mode == 'show' ? 1 : 0
				}, o.duration || 500);
		}
	}

	// Set a timeout, to call the callback approx. when the other animations have finished
	setTimeout(function() {

		o.options.mode == 'show' ? el.css({ visibility: 'visible' }) : el.css({ visibility: 'visible' }).hide();
				if(o.callback) o.callback.apply(el[0]); // Callback
				el.dequeue();

				$('div.ui-effects-explode').remove();

	}, o.duration || 500);


	});

};

})(jQuery);
/*
 * jQuery UI Effects Fold 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Fold
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.fold = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','left'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
		var size = o.options.size || 15; // Default fold size
		var horizFirst = !(!o.options.horizFirst); // Ensure a boolean value
		var duration = o.duration ? o.duration / 2 : $.fx.speeds._default / 2;

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		var wrapper = $.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
		var widthFirst = ((mode == 'show') != horizFirst);
		var ref = widthFirst ? ['width', 'height'] : ['height', 'width'];
		var distance = widthFirst ? [wrapper.width(), wrapper.height()] : [wrapper.height(), wrapper.width()];
		var percent = /([0-9]+)%/.exec(size);
		if(percent) size = parseInt(percent[1]) / 100 * distance[mode == 'hide' ? 0 : 1];
		if(mode == 'show') wrapper.css(horizFirst ? {height: 0, width: size} : {height: size, width: 0}); // Shift

		// Animation
		var animation1 = {}, animation2 = {};
		animation1[ref[0]] = mode == 'show' ? distance[0] : size;
		animation2[ref[1]] = mode == 'show' ? distance[1] : 0;

		// Animate
		wrapper.animate(animation1, duration, o.options.easing)
		.animate(animation2, duration, o.options.easing, function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(el[0], arguments); // Callback
			el.dequeue();
		});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Highlight 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Highlight
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.highlight = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['backgroundImage','backgroundColor','opacity'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'show'); // Set Mode
		var color = o.options.color || "#ffff99"; // Default highlight color
		var oldColor = el.css("backgroundColor");

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		el.css({backgroundImage: 'none', backgroundColor: color}); // Shift

		// Animation
		var animation = {backgroundColor: oldColor };
		if (mode == "hide") animation['opacity'] = 0;

		// Animate
		el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == "hide") el.hide();
			$.effects.restore(el, props);
		if (mode == "show" && $.browser.msie) this.style.removeAttribute('filter');
			if(o.callback) o.callback.apply(this, arguments);
			el.dequeue();
		}});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Pulsate 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Pulsate
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.pulsate = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this);

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'show'); // Set Mode
		var times = o.options.times || 5; // Default # of times
		var duration = o.duration ? o.duration / 2 : $.fx.speeds._default / 2;
		
		// Adjust
		if (mode == 'hide') times--;
		if (el.is(':hidden')) { // Show fadeIn
			el.css('opacity', 0);
			el.show(); // Show
			el.animate({opacity: 1}, duration, o.options.easing);
			times = times-2;
		}

		// Animate
		for (var i = 0; i < times; i++) { // Pulsate
			el.animate({opacity: 0}, duration, o.options.easing).animate({opacity: 1}, duration, o.options.easing);
		};
		if (mode == 'hide') { // Last Pulse
			el.animate({opacity: 0}, duration, o.options.easing, function(){
				el.hide(); // Hide
				if(o.callback) o.callback.apply(this, arguments); // Callback
			});
		} else {
			el.animate({opacity: 0}, duration, o.options.easing).animate({opacity: 1}, duration, o.options.easing, function(){
				if(o.callback) o.callback.apply(this, arguments); // Callback
			});
		};
		el.queue('fx', function() { el.dequeue(); });
		el.dequeue();
	});

};

})(jQuery);
/*
 * jQuery UI Effects Scale 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Scale
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.puff = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this);

		// Set options
		var options = $.extend(true, {}, o.options);
		var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
		var percent = parseInt(o.options.percent) || 150; // Set default puff percent
		options.fade = true; // It's not a puff if it doesn't fade! :)
		var original = {height: el.height(), width: el.width()}; // Save original

		// Adjust
		var factor = percent / 100;
		el.from = (mode == 'hide') ? original : {height: original.height * factor, width: original.width * factor};

		// Animation
		options.from = el.from;
		options.percent = (mode == 'hide') ? percent : 100;
		options.mode = mode;

		// Animate
		el.effect('scale', options, o.duration, o.callback);
		el.dequeue();
	});

};

$.effects.scale = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this);

		// Set options
		var options = $.extend(true, {}, o.options);
		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var percent = parseInt(o.options.percent) || (parseInt(o.options.percent) == 0 ? 0 : (mode == 'hide' ? 0 : 100)); // Set default scaling percent
		var direction = o.options.direction || 'both'; // Set default axis
		var origin = o.options.origin; // The origin of the scaling
		if (mode != 'effect') { // Set default origin and restore for show/hide
			options.origin = origin || ['middle','center'];
			options.restore = true;
		}
		var original = {height: el.height(), width: el.width()}; // Save original
		el.from = o.options.from || (mode == 'show' ? {height: 0, width: 0} : original); // Default from state

		// Adjust
		var factor = { // Set scaling factor
			y: direction != 'horizontal' ? (percent / 100) : 1,
			x: direction != 'vertical' ? (percent / 100) : 1
		};
		el.to = {height: original.height * factor.y, width: original.width * factor.x}; // Set to state

		if (o.options.fade) { // Fade option to support puff
			if (mode == 'show') {el.from.opacity = 0; el.to.opacity = 1;};
			if (mode == 'hide') {el.from.opacity = 1; el.to.opacity = 0;};
		};

		// Animation
		options.from = el.from; options.to = el.to; options.mode = mode;

		// Animate
		el.effect('size', options, o.duration, o.callback);
		el.dequeue();
	});

};

$.effects.size = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','left','width','height','overflow','opacity'];
		var props1 = ['position','top','left','overflow','opacity']; // Always restore
		var props2 = ['width','height','overflow']; // Copy for children
		var cProps = ['fontSize'];
		var vProps = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
		var hProps = ['borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var restore = o.options.restore || false; // Default restore
		var scale = o.options.scale || 'both'; // Default scale mode
		var origin = o.options.origin; // The origin of the sizing
		var original = {height: el.height(), width: el.width()}; // Save original
		el.from = o.options.from || original; // Default from state
		el.to = o.options.to || original; // Default to state
		// Adjust
		if (origin) { // Calculate baseline shifts
			var baseline = $.effects.getBaseline(origin, original);
			el.from.top = (original.height - el.from.height) * baseline.y;
			el.from.left = (original.width - el.from.width) * baseline.x;
			el.to.top = (original.height - el.to.height) * baseline.y;
			el.to.left = (original.width - el.to.width) * baseline.x;
		};
		var factor = { // Set scaling factor
			from: {y: el.from.height / original.height, x: el.from.width / original.width},
			to: {y: el.to.height / original.height, x: el.to.width / original.width}
		};
		if (scale == 'box' || scale == 'both') { // Scale the css box
			if (factor.from.y != factor.to.y) { // Vertical props scaling
				props = props.concat(vProps);
				el.from = $.effects.setTransition(el, vProps, factor.from.y, el.from);
				el.to = $.effects.setTransition(el, vProps, factor.to.y, el.to);
			};
			if (factor.from.x != factor.to.x) { // Horizontal props scaling
				props = props.concat(hProps);
				el.from = $.effects.setTransition(el, hProps, factor.from.x, el.from);
				el.to = $.effects.setTransition(el, hProps, factor.to.x, el.to);
			};
		};
		if (scale == 'content' || scale == 'both') { // Scale the content
			if (factor.from.y != factor.to.y) { // Vertical props scaling
				props = props.concat(cProps);
				el.from = $.effects.setTransition(el, cProps, factor.from.y, el.from);
				el.to = $.effects.setTransition(el, cProps, factor.to.y, el.to);
			};
		};
		$.effects.save(el, restore ? props : props1); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper
		el.css('overflow','hidden').css(el.from); // Shift

		// Animate
		if (scale == 'content' || scale == 'both') { // Scale the children
			vProps = vProps.concat(['marginTop','marginBottom']).concat(cProps); // Add margins/font-size
			hProps = hProps.concat(['marginLeft','marginRight']); // Add margins
			props2 = props.concat(vProps).concat(hProps); // Concat
			el.find("*[width]").each(function(){
				child = $(this);
				if (restore) $.effects.save(child, props2);
				var c_original = {height: child.height(), width: child.width()}; // Save original
				child.from = {height: c_original.height * factor.from.y, width: c_original.width * factor.from.x};
				child.to = {height: c_original.height * factor.to.y, width: c_original.width * factor.to.x};
				if (factor.from.y != factor.to.y) { // Vertical props scaling
					child.from = $.effects.setTransition(child, vProps, factor.from.y, child.from);
					child.to = $.effects.setTransition(child, vProps, factor.to.y, child.to);
				};
				if (factor.from.x != factor.to.x) { // Horizontal props scaling
					child.from = $.effects.setTransition(child, hProps, factor.from.x, child.from);
					child.to = $.effects.setTransition(child, hProps, factor.to.x, child.to);
				};
				child.css(child.from); // Shift children
				child.animate(child.to, o.duration, o.options.easing, function(){
					if (restore) $.effects.restore(child, props2); // Restore children
				}); // Animate children
			});
		};

		// Animate
		el.animate(el.to, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, restore ? props : props1); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(this, arguments); // Callback
			el.dequeue();
		}});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Shake 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Shake
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.shake = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','left'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var direction = o.options.direction || 'left'; // Default direction
		var distance = o.options.distance || 20; // Default distance
		var times = o.options.times || 3; // Default # of times
		var speed = o.duration || o.options.duration || 140; // Default speed per shake

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';

		// Animation
		var animation = {}, animation1 = {}, animation2 = {};
		animation[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
		animation1[ref] = (motion == 'pos' ? '+=' : '-=')  + distance * 2;
		animation2[ref] = (motion == 'pos' ? '-=' : '+=')  + distance * 2;

		// Animate
		el.animate(animation, speed, o.options.easing);
		for (var i = 1; i < times; i++) { // Shakes
			el.animate(animation1, speed, o.options.easing).animate(animation2, speed, o.options.easing);
		};
		el.animate(animation1, speed, o.options.easing).
		animate(animation, speed / 2, o.options.easing, function(){ // Last shake
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(this, arguments); // Callback
		});
		el.queue('fx', function() { el.dequeue(); });
		el.dequeue();
	});

};

})(jQuery);
/*
 * jQuery UI Effects Slide 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Slide
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.slide = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','left'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'show'); // Set Mode
		var direction = o.options.direction || 'left'; // Default Direction

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
		var distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) : el.outerWidth({margin:true}));
		if (mode == 'show') el.css(ref, motion == 'pos' ? -distance : distance); // Shift

		// Animation
		var animation = {};
		animation[ref] = (mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;

		// Animate
		el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(this, arguments); // Callback
			el.dequeue();
		}});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Transfer 1.6rc5
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Transfer
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.transfer = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this);

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var target = $(o.options.to); // Find Target
		var position = el.offset();
		var transfer = $('<div class="ui-effects-transfer"></div>').appendTo(document.body);
		if(o.options.className) transfer.addClass(o.options.className);

		// Set target css
		transfer.addClass(o.options.className);
		transfer.css({
			top: position.top,
			left: position.left,
			height: el.outerHeight() - parseInt(transfer.css('borderTopWidth')) - parseInt(transfer.css('borderBottomWidth')),
			width: el.outerWidth() - parseInt(transfer.css('borderLeftWidth')) - parseInt(transfer.css('borderRightWidth')),
			position: 'absolute'
		});

		// Animation
		position = target.offset();
		animation = {
			top: position.top,
			left: position.left,
			height: target.outerHeight() - parseInt(transfer.css('borderTopWidth')) - parseInt(transfer.css('borderBottomWidth')),
			width: target.outerWidth() - parseInt(transfer.css('borderLeftWidth')) - parseInt(transfer.css('borderRightWidth'))
		};

		// Animate
		transfer.animate(animation, o.duration, o.options.easing, function() {
			transfer.remove(); // Remove div
			if(o.callback) o.callback.apply(el[0], arguments); // Callback
			el.dequeue();
		});

	});

};

})(jQuery);

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* swiss.js */

/*!
 * Swiss - licensed under the Apache Public License 2
 * see LICENSE in the root folder for details on the license. 
 * Copyright (c) 2008 Appcelerator, Inc. All Rights Reserved.
 */
;(function()
{
	try
	{
		var adapter;
		var swiss = window.swiss = function()
		{
			if (adapter == null && arguments.length > 0)
			{
				throw "swiss: no adapter registered, not very useful right now";
			}
			return new swiss.knife.init(arguments);
		};
		swiss.knife = swiss.prototype = 
		{
			version: "0.1",
			length:0,
			results:null,
			
			init: function(args)
			{
				if (args.length == 0) return this;
				var arg1 = args[0];
				if (arg1)
				{
					switch(typeof(arg1))
					{
						case 'string':
						{
							return this.find.apply(this,args);
						}
						case 'function':
						{
							return this.onload.apply(this,args);
						}
						case 'object':
						{
							return this.setResults([arg1]);
						}
					}
				}
				return this;
			},
			
			get: function(idx)
			{
				return this.results ? this.results[idx] : null;
			},
			setResults:function(r)
			{
				if (r && r.length > 0)
				{
					// faster push from jQuery
					this.length = 0;
					this.results = r;
				}
				return this;
			},
			attr: function(name,value)
			{
				if (typeof(value)=='undefined')
				{
					return adapter.attr(this.results[0],name,value);
				}
				adapter.attr(this.results[0],name,value);
				return this;
			},
			appendElement: function(el)
			{
				adapter.appendElement(this.results[0],el);
			},
			prependElement: function(el)
			{
				adapter.prependElement(this.results[0],el);
			},	
			appendHTML: function(html)
			{
				adapter.appendHTML(this.results[0],html);
			},
			prependHTML: function(html)
			{
				adapter.prependHTML(this.results[0],html);
			},
			insertHTMLBefore: function(html)
			{
				adapter.insertHTMLBefore(this.results[0],html);
			},
			insertHTMLAfter: function(html)
			{
				adapter.insertHTMLAfter(this.results[0],html);
			},
			remove: function()
			{
				this.results[0].parentNode.removeChild(this.results[0])
			},
			removeAttr: function(name)
			{
				adapter.removeAttr(this.results[0],name);
				return this;
			},
			hasAttr: function(name)
			{
				var value = adapter.attr(this.results[0],name);
				return (value && value!='');
			},
			css: function(name,value)
			{
				if (typeof(value)=='undefined')
				{
					return adapter.css(this.results[0], name);
				}
				adapter.css(this.results[0], name, value);
				return this;
			},
			height: function()
			{
				return adapter.height(this.results[0])
			},
			width: function()
			{
				return adapter.width(this.results[0])
			},
			hasClass: function(name)
			{
				return adapter.hasClass(this.results[0],name);
			},
			addClass: function(name)
			{
				if (this.results == null)return;
				adapter.addClass(this.results[0],name)
				return this;
			},
			removeClass: function(name)
			{
				adapter.removeClass(this.results[0],name)
				return this;
			},
			show: function()
			{
				adapter.css(this.results[0],'display','block');
				swiss(this.results[0]).fire('show');

				return this;
			},
			hide: function()
			{
				adapter.css(this.results[0],'display','none');
				swiss(this.results[0]).fire('hide');
				return this;
			},
			toggle: function()
			{
				swiss(this.results[0])[adapter.css(this.results[0], "display") == "none" ? "show" : "hide"]();
			},
			// --- SELECTOR
			find: function(selector,context)
			{
				var r = [];
				adapter.find(r,selector,context);
				return this.setResults(r);
			},
			each:function (object,callback)
			{
				adapter.each(object,callback);					
			},
			extend:function (defaults,arguments)
			{
				return adapter.extend(defaults,arguments);
			},
			// --- HTML
			html: function(content)
			{
				if (typeof(content)=='undefined')
				{
					return adapter.html(this.results[0]);
				}
				adapter.html(this.results[0],content);
				return this;
			},
			// -- HANDLES draggable, droppable, resizaable, selectable, and sortable
			interaction: function(type,options)
			{
				if (adapter[type](this.results[0],options)  == false)
				{
					return null;
				}
				else
				{
					return this;
				}
			},

			// --- ANIMATIONS
			effect: function(name,params)
			{
				if (this.results == null || adapter.effect(this.results[0],name,params) == false)
					return null;
				else	
					return this;
			},
			// --- AJAX
			ajax: function(params)
			{
			  swiss.extend({
			    method: 'GET',
			    url: '/',
			    headers: {},
			    data: null,
			    success: function(){},
			    error: function(){}
			  }, params);
				adapter.ajax(params);
				return this;
			},
		  
			interject: function(url, params, callback)
			{
				adapter.interject(this.results[0], url, params || {}, callback || function() {})
			},
		
			// --- JSON
			toJSON: function(value)
			{
				var object = value 
				if (this.results)
				{
					object = this.results[0];
				}
				if (adapter.toJSON)
				{
					return adapter.toJSON(object);
				}
				var type = typeof object;
				switch (type) {
				  case 'undefined':
				  case 'function':
				  case 'unknown': return 'null';
				  case 'number':
				  case 'boolean': return value;
				  case 'string': return "\""+value+"\"";
				}

				if (object === null) return 'null';
				if (object.toJSON) return object.toJSON();
				if (object.nodeType == 1) return 'null';

				var objects = [];

				for (var property in object) 
				{
				   var value = object[property];
				   if (value !== undefined)
				   {
				   	  objects.push(this.toJSON(property) + ': ' + this.toJSON(value));
				   }
				}
				return '{' + objects.join(', ') + '}';
			},

			unfilterJSON: function(str,filter) {
				var m = (filter ||  /^\/\*-secure-([\s\S]*)\*\/\s*$/).exec(str);
				return m ? m[1] : str;
		  	},

		  	isJSON: function(s) {
		    	var str = s.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
		    	return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
		  	},

		  	evalJSON: function(str,sanitize) {
		    	var json = swiss.unfilterJSON(str);
		    	try {
		      		if (!sanitize || swiss.isJSON(json)) return eval('(' + json + ')');
		    	} catch (e) { }
		  	},
			
			// --- ONLOAD/UNLOAD
			onload: function(fn)
			{
				adapter.onload(fn);
				return this;
			},
			onunload: function(fn)
			{
				adapter.onunload(fn);
				return this;
			},
			// --- EVENTS 
			fire: function(evt,params)
			{
				adapter.fire(this.results[0],evt,params);					
				return this;
			},
			on: function(name,params,fn)
			{
				// changed - will only work for a single element selector
				//adapter.on(this.results[0],name,params,fn);
				if (this.results == null) return;
				adapter.on(this.results,name,params,fn);

				return this;
			},
			un: function(name,fn)
			{
				adapter.un(this.results[0],name,fn);
				return this;
			},
			toArray:function(value)
			{
				return adapter.toArray(value);
			},
			toString: function()
			{
				return '[swiss <'+(this.results ? this.results.length : 0)+'>]';
			},
			getMouseX: function(e)
			{
				return adapter.getMouseX(e)
			},
			getMouseY: function(e)
			{
				return adapter.getMouseY(e)
			}
		};
		swiss.knife.init.prototype = swiss.knife;
		var statics = ['version','toJSON','getMouseX','getMouseY','evalJSON','unfilterJSON','isJSON','each','extend','toArray','ajax','find','onload','onunload'];
		for (var c=0;c<statics.length;c++)
		{
			var name = statics[c];
			swiss[name]=swiss.knife[name];
		}
		window.swissRegister = function(n,v,impl)
		{
			adapter = impl;
			swiss.library = {name:n,version:v};
		};
	}
	catch (E)
	{
		alert("Error in Swiss: "+E);
	}
})();


//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* swiss-jquery.js */

/*!
 * Swiss - licensed under the Apache Public License 2
 * see LICENSE in the root folder for details on the license. 
 * Copyright (c) 2008 Appcelerator, Inc. All Rights Reserved.
 */
(function(swiss)
{
	swissRegister("jquery",jQuery(document).jquery,
	{
		find:function(results,selector,context)
		{			
			var result = jQuery(selector,context);
			for (var c=0;c<result.length;c++)
			{
				results.push(result.get(c));
			}
			return this;
		},
		each: function(array,callback)
		{
			jQuery(array).each(callback);
		},
		extend: function(defaults,arguments)
		{
			return jQuery.extend(defaults,arguments);
		},
		appendElement: function(el,el2)
		{
			jQuery(el2).appendTo(el)
		},
		prependElement: function(el,el2)
		{
			jQuery(el2).prependTo(el)
		},
		appendHTML: function(el,html)
		{
			jQuery(el).append(html)
		},
		prependHTML: function(el,html)
		{
			jQuery(el).prepend(html)
		},
		insertHTMLAfter: function(el,html)
		{
			jQuery(el).after(html)
		},
		insertHTMLBefore: function(el,html)
		{
			jQuery(el).before(html)
		},

		attr:function(el,name,value)
		{
			if (typeof(value)=='undefined')
			{
				return jQuery(el).attr(name);
			}
			return jQuery(el).attr(name,value);
		},
		removeAttr: function(el,name)
		{
			return jQuery(el).removeAttr(name);
		},
		hasClass: function(el,name)
		{
			return jQuery(el).hasClass(name);
		},
		addClass: function(el,name)
		{
			return jQuery(el).addClass(name);
		},
		removeClass: function(el,name)
		{
			return jQuery(el).removeClass(name)
		},
		css:function(el,name,value)
		{
			if (typeof(value)=='undefined')
			{
				return jQuery(el).css(name);
			}
			if (name == 'display' || name == 'visibility')
			{
				if (value == 'hidden' || value == 'none')
				{
					jQuery(el).trigger('hide', [{'key':name,'value':value}])					
				}
				else
				{
					jQuery(el).trigger('show', [{'key':name,'value':value}])
				}
			}
			
			return jQuery(el).css(name,value);
		},
		html:function(el,content)
		{
			if (typeof(content)=='undefined')
			{
				return jQuery(el).html();
			}
			jQuery(el).html(content);
		},
		ajax:function(params)
		{ 
			jQuery.ajax({
  		  type: params['method'],
  		  url: params['url'],
        beforeSend: function(xhr){
          for(var header in params['headers']){
            xhr.setRequestHeader(header, params['headers'][header]);
          }
        },
  		  data: params['data'],
  		  success: function(data, status){
  		    params['success'](data);
		    },
  		  error: function(xhr, status, errorMsg){
  		    params['error'](xhr);
		    }
			});
		},
		interject:function(el, url, params, callback)
		{
			return jQuery(el).load(url, params, callback);
		},
		onload:function(fn)
		{
			return jQuery(fn);
		},
		onunload:function(fn)
		{
			return jQuery(window).unload(fn);
		},
		fire:function(el,name,params)
		{
			return jQuery(el).trigger(name,params);				
		},
		on:function(el,name,params,fn)
		{
			return jQuery(el).bind(name,params,fn);				
		},
		un:function(el,name,fn)
		{
			return jQuery(el).unbind(name,fn);				
		},
		toArray: function(value)
		{
			return jQuery.makeArray(value);
		},
		draggable: function(el,options)
		{
			if (!jQuery(el)['draggable'])
			{
				return false;
			}
			if (!options.start)
			{
				options.start = function(e,ui)
				{
					jQuery(el).trigger('dragstart',[{event:e,ui:ui}])
				}
			}
			if (!options.stop)
			{
				options.stop = function(e,ui)
				{
					jQuery(el).trigger('dragend',[{event:e,ui:ui}])
				}
			}
			if (!options.drag)
			{
				options.drag = function(e,ui)
				{
					jQuery(el).trigger('drag',[{event:e,ui:ui}])
				}
			}
			return jQuery(el)['draggable'](options);
		},
		sortable: function(el,options)
		{
			if (!jQuery(el)['sortable'])
			{
				return false;
			}
			if (!options.update)
			{
				options.update = function(e,ui)
				{
					jQuery(el).trigger('sortupdate',[{event:e,ui:ui}])
				}
			}
			if (!options.start)
			{
				options.start = function(e,ui)
				{
					jQuery(el).trigger('sortstart',[{event:e,ui:ui}])
				}
			}
			if (!options.end)
			{
				options.end = function(e,ui)
				{
					jQuery(el).trigger('sortend',[{event:e,ui:ui}])
				}
			}

			if (!options.change)
			{
				options.change = function(e,ui)
				{
					jQuery(el).trigger('sortchange',[{event:e,ui:ui}])
				}
			}

			jQuery(el)['sortable'](options);
		},

		droppable: function(el,options)
		{
			if (!jQuery(el)['droppable'])
			{
				return false;
			}
			if (!options.drop)
			{
				options.drop = function(e,ui)
				{
					jQuery(el).trigger('drop',[{event:e,ui:ui}])
				}
			}
			if (!options.out)
			{
				options.out = function(e,ui)
				{
					jQuery(el).trigger('dropout',[{event:e,ui:ui}])
				}				
			}
			if (!options.over)
			{
				options.over = function(e,ui)
				{
					jQuery(el).trigger('dropover',[{event:e,ui:ui}])
				}
			}
			jQuery(el)['droppable'](options);
		},
		selectable: function(el,options)
		{
			if (!jQuery(el)['selectable'])
			{
				return false;
			}
			if (!options.selecting)
			{
				options.selecting = function(e,ui)
				{
					if (ui.selecting)
						jQuery('#'+ui.selecting.id).trigger('selecting',[{event:e,ui:ui}])
				}				
			}
			if (!options.selected)
			{
				options.selected = function(e,ui)
				{
					if (ui.selected)
						jQuery('#'+ui.selected.id).trigger('selected',[{event:e,ui:ui}])
				}
			}
			if (!options.unselected)
			{
				options.unselected = function(e,ui)
				{

					if (ui.unselected)
						jQuery('#'+ui.unselected.id).trigger('unselected',[{event:e,ui:ui}])
				}				
			}
			if (!options.unselecting)
			{
				options.unselecting = function(e,ui)
				{
					if (ui.unselecting)
						jQuery('#'+ui.unselecting.id).trigger('unselecting',[{event:e,ui:ui}])
				}				
			}

			jQuery(el)['selectable'](options);
		},

		resizable: function(el,options)
		{
			if (!jQuery(el)['resizable'])
			{
				return false;
			}
			if (!options.start)
			{
				options.start = function(e,ui)
				{
					jQuery(el).trigger('resizestart',[{event:e,ui:ui}])
				}
			}
			if (!options.stop)
			{
				options.stop = function(e,ui)
				{
					jQuery(el).trigger('resizeend',[{event:e,ui:ui}])
				}
			}
			if (!options.resize)
			{
				options.resize = function(e,ui)
				{
					jQuery(el).trigger('resize',[{event:e,ui:ui}])
				}
			}

			jQuery(el)['resizable'](options);
		},

		effect: function(el,effect,options)
		{
			var isHide = this.isHideEffect(effect);
			var isUI = this.isUIEffect(effect)
			if (isHide == true)
			{
				jQuery(el).trigger('hide');
			}
			// jQuery has 3 types of effects: core, effect and hide extensions
			if (!jQuery(el)[effect] && isHide == false && isUI == false)
			{
				return false;
			}

			var opts = this.formatEffectOptions(effect,options);
			// hide effects 
			if (isHide == true)
			{
				jQuery(el).hide(effect,opts[0],opts[1])				
			}
			// ui effects
			else if (isUI == true)
			{
				jQuery(el).effect(effect,opts[0],opts[1])
			}
			else if (effect == 'animate')
			{
				jQuery(el)[effect](opts[0],opts[1],opts[2])
			}
			else
			{
				jQuery(el)[effect](opts[0],opts[1])
			}
		},
		isUIEffect: function(effect)
		{
			var effects = ['scale','size','pulsate','bounce','highlight','shake','transfer']
			var valid = false
			jQuery.each(effects,function()
			{
				if (this == effect)
				{
					valid = true;
				}
			})
			return valid;
		},
		isHideEffect: function(effect)
		{
			var effects = ['blind','clip','drop','explode','fold','puff','slide'];
			var valid = false
			jQuery.each(effects,function()
			{
				if (this == effect)
				{
					valid = true;
				}
			})
			return valid;
		},
		formatEffectOptions: function(effect,options)
		{
			var opts = [];
			switch(effect)
			{
				// options  - need to do this first
				case 'blind':
				case 'clip':
				case 'drop':
				case 'explode':
				case 'fold':
				case 'puff':
				case 'slide':
				case 'scale':
				case 'size':
				case 'pulsate':
				case 'bounce':
				case 'hightlight':
				case 'shake':
				case 'transfer':
				case 'animate':
				{
					var opt = {};
					for (var v in options)
					{
						if (v == 'speed')
						{
							continue;
						}
						opt[v] = options[v]
					}
					opts.push(opt)
				}
				
				// speed option - need to do this second
				case 'animate':
				case 'fadeOut':
				case 'fadeIn':
				case 'slideDown':
				case 'slideUp':
				case 'toggle' :
				case 'hide':
				case 'show':
				case 'slideToggle':
				case 'fadeTo':
				{
					if (options.speed)
					{
						if (isNaN(options.speed) == true)
						{
							options.speed = '"'+options.speed+'"';
						}
						opts.push(options.speed);
					}
				}
				//opacity option - need to do this third
				case 'fadeTo':
				{
					if (options.opacity)
					{
						opts.push(options.opacity)
					}
				}
				//easing option - need to this fourth
				case 'animate':
				{
					if (options.easing)
					{
						options.push('"'+options.easing+'"');
					}
				}

			}
			return opts;
		},
		height: function(el)
		{
			return jQuery(el).height();
		},
		width: function(el)
		{
			return jQuery(el).width();
		},
		getMouseY: function(ev)
		{
			return ev.pageY;
		},
		getMouseX: function(ev)
		{
			return ev.pageX;
		}

	});
})(window.swiss);

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* util.js */

var App = (typeof App == "undefined")?{}:App;
App.Util = {};

App.Util.DateTime =
{
    ONE_SECOND:1000,
    ONE_MINUTE: 60000,
    ONE_HOUR: 3600000,
    ONE_DAY: 86400000,
    ONE_WEEK: 604800000,
    ONE_MONTH: 18748800000, // this is rough an assumes 31 days
    ONE_YEAR: 31536000000,

	/**
	 * Convert a duration from the format: "2y 3w 5d 27m 13s" into milliseconds
	 */
	timeFormat: function (value)
	{
		var str = '';
		var time = 0;

		for (var c=0,len=value.length;c<len;c++)
		{
			var ch = value.charAt(c);
			switch (ch)
			{
				case ',':
				case ' ':
				{
					str = '';
					break;
				}
				case 'm':
				{
					if (c + 1 < len)
					{
						var nextch = value.charAt(c+1);
						if (nextch == 's')
						{
							time+=parseInt(str);
							c++;
						}
					}
					else
					{
						time+=parseInt(str) * this.ONE_MINUTE;
					}
					str = '';
					break;
				}
				case 's':
				{
					time+=parseInt(str) * this.ONE_SECOND;
					str = '';
					break;
				}
				case 'h':
				{
					time+=parseInt(str) * this.ONE_HOUR;
					str = '';
					break;
				}
				case 'd':
				{
					time+=parseInt(str) * this.ONE_DAY;
					str = '';
					break;
				}
				case 'w':
				{
					time+=parseInt(str) * this.ONE_WEEK;
					str = '';
					break;
				}
				case 'y':
				{
					time+=parseInt(str) * this.ONE_YEAR;
					str = '';
					break;
				}
				default:
				{
					str+=ch;
					break;
				}
			}
		}

		if (str.length > 0)
		{
			time+=parseInt(str);
		}

		return time;
	}

};

App.Util.getNestedProperty = function (obj, prop, def)
{
    if (obj!=null && prop!=null)
    {
        var props = prop.split('.');
        if (props.length != -1)
        {
	        var cur = obj;
	        swiss.each(props,function(p)
	        {
	            if (cur != null && null != cur[this])
	            {
	                cur = cur[this];
	            }
	            else
	            {
	                cur = null;
	                return def;
	            }
	        });
	        return cur == null ? def : cur;
	     }
	     else
	     {
	     	  return obj[prop] == null ? def : obj[prop];
	     }
    }
    return def;
};
/**
 * return the elements value depending on the type of
 * element it is
 */
App.Util.getElementValue = function (element)
{
	switch (App.Compiler.getTagname(element))
    {
        case 'select':
        {
            if(swiss(element).attr('multiple') == 'true')
            {
                var selected = [];
                var options = element.options;
                var optionsLen = options.length;
                for(var i = 0; i < optionsLen; i++)
                {
                    if(options[i].selected)
                    {
                        selected.push(options[i].value);
                    }
                }
                return selected;
            }
			else
			{
				return element.options[element.selectedIndex].value;
			}
        }
        case 'img':
        case 'iframe':
        {
            return element.src;
        }
		case 'input':
		case 'textarea':
		{
			if (element.type == 'checkbox')
			{
				return element.checked
			}
			return element.value;
		}
		default:
		{
			return element.innerHTML;
		}
 	}
};
App.Util.Logger = {};
App.Util.Logger.debugEnabled = (window.location.href.indexOf('debug=1') > 0)?true:false;

App.Util.Logger.info = function(msg)
{
	if (App.Browser.isIE)return;
	if (window.console)
	{
	  if(console.info)
 			console.info(msg)
	  else if (console)
			console.log(msg)
	}
};
App.Util.Logger.warn = function(msg)
{
	if (App.Browser.isIE)return;
	if (window.console)
	{
	 	if (console.warn)
   			console.warn(msg)
		else if (console)
			console.log(msg)
	}
};
App.Util.Logger.debug = function(msg)
{
	if (App.Browser.isIE)return;
	if (App.Util.Logger.debugEnabled == true)
	{
		if (window.console)
		{
			if (window.console.debug)
	   			window.console.debug(msg)
			else
				console.log(msg)		
		}
	}
};
App.Util.Logger.error = function(msg)
{
	if (App.Browser.isIE)return;
	if (window.console)
	{
		if (console.error)
   			console.error(msg)
		else
			console.log(msg)
	}
};


App.Util.IFrame = 
{
	fetch: function(src,onload,removeOnLoad,copyContent)
	{
	    setTimeout(function()
	    {
	        copyContent = (copyContent==null) ? false : copyContent;
	        var frameid = 'frame_'+new Date().getTime()+'_'+Math.round(Math.random() * 99);
	        var frame = document.createElement('iframe');
	        App.Compiler.setElementId(frame, frameid);
	
	        //This prevents Firefox 1.5 from getting stuck while trying to get the contents of the new iframe
	        if(!App.Browser.isFirefox)
	        {
	            frame.setAttribute('name', frameid);
	        }
            frame.setAttribute('src',src);
  	        frame.style.position = 'absolute';
	        frame.style.width = frame.style.height = frame.borderWidth = '1px';
	        // in Opera and Safari you'll need to actually show it or the frame won't load
	        // so we just put it off screen
	        frame.style.left = "-50px";
	        frame.style.top = "-50px";
	        var iframe = document.body.appendChild(frame);
	        // this is a IE speciality
	        if (window.frames && window.frames[frameid]) iframe = window.frames[frameid];
	        iframe.name = frameid;
	        var scope = {iframe:iframe,frameid:frameid,onload:onload,removeOnLoad:(removeOnLoad==null)?true:removeOnLoad,src:src,copyContent:copyContent};
	  		if (!App.Browser.isFirefox)
	        {
	            setTimeout(function(){App.Util.IFrame.checkIFrame.apply(scope)},50);
	        }
	        else
	        {
	            iframe.onload = setTimeout(function(){App.Util.IFrame.doIFrameLoad.apply(scope)},50);
	        }
	    },0);
	},
	doIFrameLoad: function()
	{
		var doc = this.iframe.contentDocument || this.iframe.document;
		var body = doc.documentElement.getElementsByTagName('body')[0];
		if (App.Browser.isSafari && App.Browser.isWindows && body.childNodes.length == 0)
		{
			App.Util.IFrame.fetch(this.src, this.onload, this.removeOnLoad);
			return;
		}
		
		if (this.copyContent)
		{
	        var div = document.createElement('div');
	        
	        App.Util.IFrame.loadStyles(doc.documentElement);
	        
	        var bodydiv = document.createElement('div');
	        bodydiv.innerHTML = body.innerHTML;
	        div.appendChild(bodydiv);
	        this.onload(div);
		}
		else
		{
            this.onload(body);
		}
		if (this.removeOnLoad)
		{
			var f = swiss('#'+this.frameid).get(0);
			if (App.Browser.isFirefox)
			{
				// firefox won't stop spinning with Loading... message
				// if you remove right away
				setTimeout(function(){f.parentNode.removeChild(f)},50);
			}
			else
			{
				f.parentNode.removeChild(f)
			}
		}
	},
	checkIFrame:function()
	{
		var doc = this.iframe.contentDocument || this.iframe.document;
		var dr = doc.readyState;
		if (dr == 'complete' || (!document.getElementById && dr == 'interactive'))
	 	{
	 		App.Util.IFrame.doIFrameLoad.apply(this);
	 	}
	 	else
	 	{
	  		setTimeout(App.Util.IFrame.checkIFrame.apply(this),10);
	 	}
	},
	loadStyles:function(element)
	{
		for (var i = 0; i < element.childNodes.length; i++)
		{
			var node = element.childNodes[i];

			if (node.nodeName == 'STYLE')
			{
				if (App.Browser.isIE)
				{
					var style = document.createStyleSheet();
					style.cssText = node.styleSheet.cssText;
				}
				else
				{
					var style = document.createElement('style');
					style.setAttribute('type', 'text/css');
					try
					{
						style.appendChild(document.createTextNode(node.innerHTML));
					}
					catch (e)
					{
						style.cssText = node.innerHTML;
					}				
					document.getElementsByTagName('head')[0].appendChild(style);
				}
			}
			else if (node.nodeName == 'LINK')
			{
				var link = document.createElement('link');
				link.setAttribute('type', node.type);
				link.setAttribute('rel', node.rel);
				link.setAttribute('href', node.getAttribute('href'));
				document.getElementsByTagName('head')[0].appendChild(link);
			}
			
			App.Util.IFrame.loadStyles(node);
		}
	}
};

/**
 * DOM utils
 */
App.Util.Dom =
{
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12,

	/**
	 * iterator for node attributes
	 * pass in an iterator function and optional specified (was explicit
	 * placed on node or only inherited via #implied)
	 */
    eachAttribute: function (node, iterator, excludes, specified)
    {
        specified = specified == null ? true : specified;
        excludes = excludes || [];

        if (node.attributes)
        {
            var map = node.attributes;
            for (var c = 0,len = map.length; c < len; c++)
            {
                var item = map[c];
                if (item && item.value != null && specified == item.specified)
                {
                    var type = typeof(item);
                    if (item.value.startsWith('function()'))
                    {
                       continue;
                    }
                    if (type == 'function' || type == 'native' || item.name.match(/_moz\-/) ) continue;
                	if (excludes.length > 0)
                	{
                	  	  var cont = false;
                	  	  for (var i=0,l=excludes.length;i<l;i++)
                	  	  {
                	  	  	  if (excludes[i]==item.name)
                	  	  	  {
                	  	  	  	  cont = true;
                	  	  	  	  break;
                	  	  	  }
                	  	  }
                	  	  if (cont) continue;
                	}
                    iterator(item.name, item.value, item.specified, c, map.length);
                }
            }
            return c > 0;
        }
        return false;
    },

    getTagAttribute: function (element, tagname, key, def)
    {
        try
        {
            var attribute = element.getElementsByTagName(tagname)[0].getAttribute(key);
            if (null != attribute)
            {
                return attribute;
            }
        }
        catch (e)
        {
            //squash...
        }

        return def;
    },

    each: function(nodelist, nodeType, func)
    {
        if (typeof(nodelist) == "array")
        {
            nodelist.each(function(n)
            {
                if (n.nodeType == nodeType)
                {
                    func(n);
                }
            });
        }
        //Safari returns "function" as the NodeList object from a DOM
        else if (typeof(nodelist) == "object" || typeof(nodelist) == "function" && navigator.userAgent.match(/WebKit/i))
        {
            for (var p = 0, len = nodelist.length; p < len; p++)
            {
                var obj = nodelist[p];
                if (typeof obj.nodeType != "undefined" && obj.nodeType == nodeType)
                {
                    try
                    {
                        func(obj);
                    }
                    catch(e)
                    {
                        if (e == $break)
                        {
                            break;
                        }
                        else if (e != $continue)
                        {
                            throw e;
                        }
                    }
                }
            }
        }
        else
        {
            throw ("unsupported dom nodelist type: " + typeof(nodelist));
        }
    },

	/**
 	 * return the text value of a node as XML
 	 */
    getText: function (n,skipHTMLStyles,visitor,addbreaks,skipcomments)
    {
		var text = [];
        var children = n.childNodes;
        var len = children ? children.length : 0;
        for (var c = 0; c < len; c++)
        {
            var child = children[c];
            if (visitor)
            {
            	child = visitor(child);
            }
            if (child.nodeType == this.COMMENT_NODE)
            {
            	if (!skipcomments)
            	{
                	text.push("<!-- " + child.nodeValue + " -->");
            	}
                continue;
            }
            if (child.nodeType == this.ELEMENT_NODE)
            {
                text.push(this.toXML(child, true, null, null, skipHTMLStyles, addbreaks,skipcomments));
            }
            else
            {
                if (child.nodeType == this.TEXT_NODE)
                {
                	var v = child.nodeValue;
                	if (v)
                	{
                    	text.push(v);
                    	if (addbreaks) text.push("\n");
                	}
                }
                else if (child.nodeValue == null)
                {
                    text.push(this.toXML(child, true, null, null, skipHTMLStyles, addbreaks,skipcomments));
                }
                else
                {
                    text.push(child.nodeValue || '');
                }
            }
        }
        return text.join('');
    },

/**
 * IE doesn't have an hasAttribute when you dynamically
 * create an element it appears
 */
    hasAttribute: function (e, n, cs)
    {
        if (!e.hasAttribute)
        {
            if (e.attributes)
            {
                for (var c = 0, len = e.attributes.length; c < len; c++)
                {
                    var item = e.attributes[c];
                    if (item && item.specified)
                    {
                        if (cs && item.name == n || !cs && item.name.toLowerCase() == n.toLowerCase())
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        else
        {
            return e.hasAttribute(n);
        }
    },

    getAttribute: function (e, n, cs)
    {
        if (cs)
        {
            return e.getAttribute(n);
        }
        else
        {
            for (var c = 0, len = e.attributes.length; c < len; c++)
            {
                var item = e.attributes[c];
                if (item && item.specified)
                {
                    if (item.name.toLowerCase() == n.toLowerCase())
                    {
                        return item.value;
                    }
                }
            }
            return null;
        }
    },

	/**
	 * given an XML element node, return a string representing
	 * the XML
	 */
    toXML: function(e, embed, nodeName, id, skipHTMLStyles, addbreaks, skipcomments)
    {
    	nodeName = (nodeName || e.nodeName.toLowerCase());
        var xml = [];

		xml.push("<" + nodeName);
        
        if (id)
        {
            xml.push(" id='" + id + "' ");
        }
        if (e.attributes)
        {
	        var x = 0;
            var map = e.attributes;
            for (var c = 0, len = map.length; c < len; c++)
            {
                var item = map[c];
                if (item && item.value != null && item.specified)
                {
                    var type = typeof(item);
                    if (item.value && item.value.startsWith('function()'))
                    {
                       continue;
                    }
                    if (type == 'function' || type == 'native' || item.name.match(/_moz\-/)) continue;
                    if (id != null && item.name == 'id')
                    {
                        continue;
                    }
                    
                    // special handling for IE styles
                    if (Appcelerator.Browser.isIE && !skipHTMLStyles && item.name == 'style' && e.style && e.style.cssText)
                    {
                       var str = e.style.cssText;
                       xml.push(" style=\"" + str+"\"");
                       x++;
                       continue;
                    }
                    
                    var attr = String.escapeXML(item.value);
					if (Object.isUndefined(attr) || (!attr && nodeName=='input' && item.name == 'value'))
					{
						attr = '';
					}
                    xml.push(" " + item.name + "=\"" + attr + "\"");
                    x++;
                }
            }
        }
        xml.push(">");

        if (embed && e.childNodes && e.childNodes.length > 0)
        {
        	xml.push("\n");
            xml.push(this.getText(e,skipHTMLStyles,null,addbreaks,skipcomments));
        }
		xml.push("</" + nodeName + ">" + (addbreaks?"\n":""));
		
        return xml.join('');
    },

    getAndRemoveAttribute: function (node, name)
    {
        var value = node.getAttribute(name);
        if (value)
        {
            node.removeAttribute(name);
        }
        return value;
    },

    getAttributesString: function (element, excludes)
    {
        var html = '';
        this.eachAttribute(element, function(name, value)
        {
            if (false == (excludes && excludes.indexOf(name) > -1))
            {
				html += name + '="' + String.escapeXML(value||'') + '" ';                
            }
        }, null, true);
        return html;
    },
	createElement: function (type, options)
	{
	    var elem = document.createElement(type);
	    if (options)
	    {
	        if (options['parent'])
	        {
	            options['parent'].appendChild(elem);
	        }
	        if (options['className'])
	        {
	            elem.className = options['className'];
	        }
	        if (options['html'])
	        {
	            elem.innerHTML = options['html'];
	        }
	        if (options['children'])
	        {
	            options['children'].each(function(child)
	            {
	                elem.appendChild(child);
	            });
	        }
	    }
	    return elem;
	}
};

try
{
    if (typeof(DOMNodeList) == "object") DOMNodeList.prototype.length = DOMNodeList.prototype.getLength;
    if (typeof(DOMNode) == "object")
    {
        DOMNode.prototype.childNodes = DOMNode.prototype.getChildNodes;
        DOMNode.prototype.parentNode = DOMNode.prototype.getParentNode;
        DOMNode.prototype.nodeType = DOMNode.prototype.getNodeType;
        DOMNode.prototype.nodeName = DOMNode.prototype.getNodeName;
        DOMNode.prototype.nodeValue = DOMNode.prototype.getNodeValue;
    }
}
catch(e)
{
}

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* browser.js */

var App = (typeof App == "undefined")?{}:App;

App.Browser = {};
App.Browser.ua = navigator.userAgent.toLowerCase();
App.Browser.isOpera = (App.Browser.ua.indexOf('opera') > -1);
App.Browser.isSafari = (App.Browser.ua.indexOf('safari') > -1);
App.Browser.isSafari2 = false;
App.Browser.isSafari3 = false;
App.Browser.isIE = !!(window.ActiveXObject);
App.Browser.isIE6 = false;
App.Browser.isIE7 = false;
App.Browser.isIE8 = false;

//
// TODO: may need to remove or refactor
//
var idx = top.window.document.location.href.lastIndexOf('/');
if (idx == top.window.document.location.href.length - 1)
{
	App.docRoot = top.window.document.location.href;
}
else
{
   App.docRoot  = top.window.document.location.href.substr(0, idx);
    if (App.docRoot.substring(App.docRoot.length - 1) != '/')
    {
        App.docRoot  = App.docRoot + '/';
    }
}

swiss(document).onload(function()
{
	App.Browser.initialize();
});

App.Browser.initialize = function()
{
	if (App.Browser.isIE)
	{
		var arVersion = navigator.appVersion.split("MSIE");
		var version = parseFloat(arVersion[1]);
		App.Browser.isIE6 = version >= 6.0 && version < 7;
		App.Browser.isIE7 = version >= 7.0 && version < 8;
		App.Browser.isIE8 = version >= 8.0 && version < 9;
	}

	if (App.Browser.isSafari)
	{
		var webKitFields = RegExp("( applewebkit/)([^ ]+)").exec(App.Browser.ua);
		if (webKitFields[2] > 400 && webKitFields[2] < 500)
		{
			App.Browser.isSafari2 = true;
		}
		else if (webKitFields[2] > 500 && webKitFields[2] < 600)
		{
			App.Browser.isSafari3 = true;
		}
	}

	App.Browser.isGecko = !App.Browser.isSafari && (App.Browser.ua.indexOf('gecko') > -1);
	App.Browser.isCamino = App.Browser.isGecko && App.Browser.ua.indexOf('camino') > -1;
	App.Browser.isFirefox = App.Browser.isGecko && (App.Browser.ua.indexOf('firefox') > -1 || App.Browser.isCamino || App.Browser.ua.indexOf('minefield') > -1 || App.Browser.ua.indexOf('granparadiso') > -1 || App.Browser.ua.indexOf('bonecho') > -1);
	App.Browser.isIPhone = App.Browser.isSafari && App.Browser.ua.indexOf('iphone') > -1;
	App.Browser.isMozilla = App.Browser.isGecko && App.Browser.ua.indexOf('mozilla/') > -1;
	App.Browser.isWebkit = App.Browser.ua.indexOf('applewebkit') > 0;
	App.Browser.isSeamonkey = App.Browser.isMozilla && App.Browser.ua.indexOf('seamonkey') > -1;
	App.Browser.isPrism = App.Browser.isMozilla && App.Browser.ua.indexOf('prism/') > 0;
	App.Browser.isIceweasel = App.Browser.isMozilla && App.Browser.ua.indexOf('iceweasel') > 0;
	App.Browser.isEpiphany = App.Browser.isMozilla && App.Browser.ua.indexOf('epiphany') > 0;
	App.Browser.isFluid = (window.fluid != null);
	App.Browser.isGears = (window.google && google.gears) != null;
	App.Browser.isChromium = App.Browser.isWebkit && App.Browser.ua.indexOf('chrome/') > 0;

	App.Browser.isWindows = false;
	App.Browser.isMac = false;
	App.Browser.isLinux = false;
	App.Browser.isSunOS = false;
	var platform = null;

	if(App.Browser.ua.indexOf("windows") != -1 || App.Browser.ua.indexOf("win32") != -1)
	{
	    App.Browser.isWindows = true;
		platform = 'win32';
	}
	else if(App.Browser.ua.indexOf("macintosh") != -1 || App.Browser.ua.indexOf('mac os x') != -1)
	{
		App.Browser.isMac = true;
		platform = 'mac';
	}
	else if (App.Browser.ua.indexOf('linux')!=-1)
	{
		App.Browser.isLinux = true;
		platform = 'linux';
	}
	else if (App.Browser.ua.indexOf('sunos')!=-1)
	{
		App.Browser.isSunOS = true;
		platform = 'sun';
	}

	// silverlight detection
	// thanks to http://www.nikhilk.net/Silverlight-Analytics.aspx
	App.Browser.isSilverlight = false;
	App.Browser.silverlightVersion = 0;
	swiss(window).on('load',{},function()
	{
	    var container = null;
	    try {
	        var control = null;
	        if (window.ActiveXObject) {
	            control = new ActiveXObject('AgControl.AgControl');
	        }
	        else {
	            if (navigator.plugins['Silverlight Plug-In']) {
	                container = document.createElement('div');
	                document.body.appendChild(container);
	                container.innerHTML= '<embed type="application/x-silverlight" src="data:," />';
	                control = container.childNodes[0];
	            }
	        }
	        if (control) {
	            if (control.isVersionSupported('2.0')) 
				{ 
					App.Browser.silverlightVersion = 2.0; 
				}
	            else if (control.isVersionSupported('1.0')) 
				{ 
					App.Browser.silverlightVersion = 1.0; 
				}
				App.Browser.isSilverlight = App.Browser.silverlightVersion > 0;
	        }
	    }
	    catch (e) { }
	    if (container) {
	        document.body.removeChild(container);
	    }
	});

	// flash detection
	App.Browser.isFlash = false;
	App.Browser.flashVersion = 0;
	if (App.Browser.isIE)
	{
			try
			{
				var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
				var ver = flash.GetVariable("$version");
				var idx = ver.indexOf(' ');
				var tokens = ver.substring(idx+1).split(',');
				var version = tokens[0];
				App.Browser.flashVersion = parseInt(version);
				App.Browser.isFlash = true;
			}
			catch(e)
			{
				// we currently don't support lower than 7 anyway
			}
	}
	else
	{
		var plugin = navigator.plugins && navigator.plugins.length;
		if (plugin)
		{
			 plugin = navigator.plugins["Shockwave Flash"] || navigator.plugins["Shockwave Flash 2.0"];
			 if (plugin)
			 {
				if (plugin.description)
				{
					var ver = plugin.description;
					App.Browser.flashVersion = parseInt(ver.charAt(ver.indexOf('.')-1));
					App.Browser.isFlash = true;
				}			 	
				else
				{
					// not sure what version... ?
					App.Browser.flashVersion = 7;
					App.Browser.isFlash = true;
				}
			 }
		}
		else
		{
			plugin = (navigator.mimeTypes && 
		                    navigator.mimeTypes["application/x-shockwave-flash"] &&
		                    navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) ?
		                    navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
			if (plugin && plugin.description) 
			{
				App.Browser.isFlash = true;
		    	App.Browser.flashVersion = parseInt(plugin.description.substring(plugin.description.indexOf(".")-1));
			}
		}
	}
	App.Browser.isBrowserSupported = false;
	swiss.each(['Firefox','IE6','IE7','IE8','Safari','Camino','Opera','Webkit','Seamonkey','Prism','Iceweasel','Epiphany'],function()
	{
	    if (App.Browser['is'+this]===true)
	    {
	        App.Browser.isBrowserSupported=true;
			swiss(window).on('load',{},function()
			{
				if (platform) swiss(document.body).addClass(platform);
				swiss(document.body).addClass(name.toLowerCase());
				if (App.Browser.isMozilla)
				{
					swiss(document.body).addClass('mozilla');
				}
				if (App.Browser.isIPhone)
				{
					swiss(document.body).addClass('iphone');
					swiss(document.body).addClass('webkit');
					swiss(document.body).addClass('safari');
				}
				if (App.Browser.isChromium)
				{
					swiss(document.body).addClass('chromium');
				}
				if (App.Browser.isSafari)
				{
					swiss(document.body).addClass('webkit');
					if (App.Browser.isSafari2)
					{
						swiss(document.body).addClass('safari2');
					}
					else if (App.Browser.isSafari3)
					{
						swiss(document.body).addClass('safari3');
					}
				}
				else if (App.Browser.isGecko)
				{
					swiss(document.body).addClass('gecko');
				}
				if (App.Browser.isFirefox)
				{
					if (App.Browser.ua.indexOf('firefox/3')>0)
					{
						swiss(document.body).addClass('firefox3');
					}
					else if (App.Browser.ua.indexOf('firefox/2')>0)
					{
						swiss(document.body).addClass('firefox2');
					}
				}
				else if (App.Browser.isIE)
				{
					swiss(document.body).addClass('msie');
					if (App.Browser.isIE6)
					{
						swiss(document.body).addClass('ie6');	
					}
					else if (App.Browser.isIE7)
					{
						swiss(document.body).addClass('ie7');
					}
				}
				if (App.Browser.isIPhone)
				{
					swiss(document.body).addClass('width_narrow');
					swiss(document.body).addClass('height_short');
				}
				else
				{
					var currentHeightClass = null;
					var currentWidthClass = null;
					function calcDim()
					{
						if (currentHeightClass != null) swiss(document.body).removeClass(currentHeightClass);
						if (currentWidthClass != null) swiss(document.body).removeClass(currentWidthClass);
	                    var height = parseInt(swiss(document).height());
	                    var width = parseInt(swiss(document).width());

						if (height < 480)
						{
							swiss(document.body).addClass('height_tiny');
							currentHeightClass = 'height_tiny';
						}
						else if (height >= 480 && height <= 768)
						{
							swiss(document.body).addClass('height_small');
							currentHeightClass = 'height_small';
						}
						else if (height > 768  && height < 1100)
						{
							swiss(document.body).addClass('height_medium');
							currentHeightClass = 'height_medium';
						}
						else if (height >= 1100)
						{
							swiss(document.body).addClass('height_large');
							currentHeightClass = 'height_large';
						}
						if (width <= 640)
						{
							swiss(document.body).addClass('width_tiny');
							currentWidthClass = 'width_tiny';					
						}
						else if (width > 640 && width <= 1024)
						{
							swiss(document.body).addClass('width_small');
							currentWidthClass = 'width_small';					
						}
						else if (width > 1024 && width <=1280 )
						{
							swiss(document.body).addClass('width_medium');
							currentWidthClass = 'width_medium';					
						}
						else if (width > 1280)
						{
							swiss(document.body).addClass('width_large');
							currentWidthClass = 'width_large';					
						}
					}
					swiss(window).on('resize',{},calcDim);
					calcDim();
				}
			});
	    }
	});
	
};


//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* compiler.js */

var App = (typeof App == "undefined")?{}:App;
App.Compiler = {};
App.Compiler.nextId = 0;

// TODO: ADD DYNAMIC COMPILE AND DESTORY CONVENIENCE FUNCTIONS

/////////////////////////////////////////////////////////////////
//
//  Compiler Functions
//
/////////////////////////////////////////////////////////////////

/**
 * STEP 1
 *
 * @param {function} onFinishCompiled function to call (or null) when document is finished compiling
 */
App.Compiler.compileDocument = function(onFinishCompiled)
{
    if (App.Util.Logger) App.Util.Logger.debug('compiled document called');
   	var container = swiss(document.body).get(0);
    if (!container.id)
    {
        App.Compiler.setElementId(container, 'app_body');
    }

    var state = {pending:0,scanned:false}
	container.state = state;
	
    // start scanning at the body
    App.Compiler.compileElement(container,state);

    // mark it as complete and check the loading state
    state.scanned = true;
    state.onafterfinish = function(code)
    {
    	if (typeof(onFinishCompiled)=='function') onFinishCompiled();
		App.Compiler.compileDocumentOnFinish();
    };
    App.Compiler.checkLoadState(container);
};


/**
 * STEP 2 - Compile 
 */
App.Compiler.compileElement = function(element,state,recursive)
{
    if (element.getAttribute('control') != null || element.getAttribute('behavior') != null)
	{
		recursive = false;
	}
	else
	{
		recursive = recursive==null ? true : recursive;
	}
	App.Compiler.getAndEnsureId(element);

    if (App.Util.Logger) App.Util.Logger.debug('compiling element => '+element.id);

    if (element.compiled)
    {
       App.Compiler.destroy(element);
    }
    element.compiled = 1;

	element.state = state;
	try
	{
		App.Compiler.delegateToAttributeListeners(element);
		if (recursive && !element.stopCompile)
        {
			App.Compiler.compileElementChildren(element);
		}
	}
	catch(e)
	{
		App.Compiler.handleElementException(element, e, 'compiling ' + element.id);
	}
};

/**
 * STEP 3 - Compile element's children
 */
App.Compiler.compileElementChildren = function(element)
{
	if (element && element.nodeType == 1)
	{
		if (element.nodeName.toLowerCase() != 'textarea')
		{
		    var elementChildren = [];
			if (element && element.nodeType == 1)
			{
				for (var i = 0, length = element.childNodes.length; i < length; i++)
				{
				    if (element.childNodes[i].nodeType == 1)
				    {
			    	     elementChildren.push(element.childNodes[i]);
			    	}
				}
			}

			for (var i=0,len=elementChildren.length;i<len;i++)
			{
	            App.Compiler.compileElement(elementChildren[i],element.state);
			}
		}
		App.Compiler.checkLoadState(element);
	}
};

/**
 * After compile listners
 */
App.Compiler.oncompileListeners = [];
App.Compiler.afterDocumentCompile = function(l)
{
    App.Compiler.oncompileListeners.push(l);
};

App.Compiler.hasCompleted = false;
App.Compiler.compileDocumentOnFinish = function ()
{
    if (App.Compiler.oncompileListeners)
    {
        for (var c=0;c<App.Compiler.oncompileListeners.length;c++)
        {
            App.Compiler.oncompileListeners[c]();
        }
        delete App.Compiler.oncompileListeners;
    }

	// call only once - controls can be compiled post load
	if (App.mq && App.Compiler.hasCompleted == false)
	{
	    $MQ('l:app.compiled');		
		App.Compiler.hasCompleted = true;
	}
};
App.Compiler.dynamicCompile = function(element,recursive)
{
	if (!element) return;

	var state = {pending:0,scanned:false}
	App.Compiler.compileElement(element,state,recursive);
     // App.Compiler.doCompile(element,recursive);
};
App.Compiler.addTrash = function(element,trash)
{
	if (!element.trashcan)
	{
		element.trashcan = [];
	}
	element.trashcan.push(trash);
};

App.Compiler.destroy = function(element, recursive)
{
	if (!element) return;
	recursive = recursive==null ? true : recursive;

	element.compiled = 0;

	App.Compiler.removeElementId(element.id);

	if (element.trashcan && element.trashcan.constructor === Array)
	{
		for (var c=0,len=element.trashcan.length;c<len;c++)
		{
			try
			{
				element.trashcan[c]();
			}
			catch(e)
			{
				$D(e);
			}
		}
		try
		{
			delete element.trashcan;
		}
		catch(e)
		{
		}
	}

	if (recursive)
	{
		if (element.nodeType == 1 && element.childNodes && element.childNodes.length > 0)
		{
			for (var c=0,len=element.childNodes.length;c<len;c++)
			{
				var node = element.childNodes[c];
				if (node && node.nodeType && node.nodeType == 1)
				{
					try
					{
						App.Compiler.destroy(node,true);
					}
					catch(e)
					{
					    if (App.Util.Logger)App.Util.Logger.error('error calling destroy ' + e);
					}
				}
			}
		}
	}
};

/////////////////////////////////////////////////////////////////
//
//  Attribute Processing Functions
//
/////////////////////////////////////////////////////////////////



/**
 * @property {hash} has of key which is name of element (or * for all elements) and array
 * of attribute processors that should be called when element is encountered
 */
App.Compiler.attributeProcessors = {'*':[]};

/**
 * Register an object that has a <b>handle</b> method which takes
 * an element, attribute name, and attribute value of the processed element.
 *
 * This method takes the name of the element (or optionally, null or * as
 * a wildcard) and an attribute (required) value to look for on the element
 * and a listener.
 *
 * @param {string} name of attribute processor. can be array of strings for multiple elements or * for wildcard.
 * @param {string} attribute to check when matching element
 * @param {function} listener to call when attribute is matched on element
 */
App.Compiler.registerAttributeProcessor = function(name,attribute,listener)
{
	if (typeof name == 'string')
	{
		name = name||'*';
		var a = App.Compiler.attributeProcessors[name];
		if (!a)
		{
			a = [];
			App.Compiler.attributeProcessors[name]=a;
		}
		// always push to the end such that custom attribute processors will be 
		// processed before internal ones so that they can overwrite builtins
		a.unshift([attribute,listener]);
	}
	else
	{
		for (var c=0,len=name.length;c<len;c++)
		{
			var n = name[c]||'*';
			var a = App.Compiler.attributeProcessors[n];
			if (!a)
			{
				a = [];
				App.Compiler.attributeProcessors[n]=a;
			}
			// always push to the end such that custom attribute processors will be 
			// processed before internal ones so that they can overwrite builtins
			a.unshift([attribute,listener]);
		}
	}
};

/**
 * called internally by compiler to dispatch details to attribute processors
 *
 * @param {element} element
 * @param {array} array of processors
 */
App.Compiler.forwardToAttributeListener = function(element,array)
{
    for (var i=0;i<array.length;i++)
	{
		var entry = array[i];
		var attributeName = entry[0];
		var listener = entry[1];
		var value = element.getAttribute(attributeName);
       if (value) // optimization to avoid adding listeners if the attribute isn't present
        {
            listener.handle(element,attributeName,value);
        }
    }
};

/**
 * internal method called to process each element and potentially one or
 * more attribute processors
 *
 * @param {element} element
 */
App.Compiler.delegateToAttributeListeners = function(element)
{
	var tagname = App.Compiler.getTagname(element);
	if (App.Util.Logger) App.Util.Logger.debug('processing tag ' + tagname + ' for element ' + element)
	var p = App.Compiler.attributeProcessors[tagname];
	if (p && p.length > 0)
	{
		App.Compiler.forwardToAttributeListener(element,p,tagname);
	}
	p = App.Compiler.attributeProcessors['*'];
	if (p && p.length > 0)
	{
		App.Compiler.forwardToAttributeListener(element,p,'*');
	}
};

App.Compiler.checkLoadState = function (element)
{
	var state = element.state;
	if (state && state.pending==0 && state.scanned)
	{
		if (typeof(state.onfinish)=='function')
		{
			state.onfinish(code);
		}
		if (typeof(state.onafterfinish)=='function')
		{
			state.onafterfinish();
		}
		// remove state
		if (element.state)
		{
			try 
			{
				delete element.state;
			}
			catch (e)
			{
				element.state = null;
			}
		}
		return true;
	}
	return false;
};

App.Compiler.getTagname = function(element)
{
	if (!element) throw "element cannot be null";
	if (element.nodeType!=1) throw "node: "+element.nodeName+" is not an element, was nodeType: "+element.nodeType+", type="+(typeof element);

	// used by the compiler to mask a tag
	if (element._tagName) return element._tagName;

	if (App.Browser && App.Browser.isIE)
	{
		if (element.scopeName && element.tagUrn)
		{
			return element.scopeName + ':' + element.nodeName.toLowerCase();
		}
	}
	return element.nodeName.toLowerCase();
};

/**
 * return a formatted message detail for an exception object
 */
App.Compiler.getExceptionDetail = function (e,format)
{
    if (!e) return 'No Exception Object';
	if (typeof(e) == 'string')
	{
		return 'message: ' + e;
	}
    if (App.Browser && App.Browser.isIE == true)
    {
        return 'message: ' + e.message + ', location: ' + e.location || e.number || 0;
    }
    else
    {
		var line = 0;
		try
		{
			line = e.lineNumber || 0;
		}
		catch(x)
		{
			// sometimes you'll get a PermissionDenied on certain errors
		}
        return 'message: ' + (e.message || e) + ', location: ' + line + ', stack: ' + (format?'<pre>':'') +(e.stack || 'not specified') + (format?'</pre>':'');
    }
};

App.Compiler.handleElementException = function(element,e,context)
{
	var tag = element ? App.Compiler.getTagname(element) : 'body';
	var el = (element)?element:swiss(document.body).get(0);
	var msg = '<strong>Appcelerator Processing Error:</strong><div>Element ['+tag+'] with ID: '+(el.id||el)+' has an error: <div>'+App.Compiler.getExceptionDetail(e,true)+'</div>' + (context ? '<div>in <pre>'+context+'</pre></div>' : '') + '</div>';
	
	var id = (element && element != null)?element.id:'N/A';
	if (tag == 'IMG')
	{
		swiss(el).insertHTMLBefore(msg);
	}
	else
	{
		swiss(el).insertHTMLBefore('<div style="border:4px solid #777;padding:30px;background-color:#fff;color:#e00;font-family:sans-serif;font-size:18px;margin-left:20px;margin-right:20px;margin-top:100px;text-align:center;">' + msg + '</div>');
	}
	swiss(el).show();
};

App.Compiler.getAndEnsureId = function(element)
{
	if (!element.id)
	{
		element.id = 'app_' + (App.Compiler.nextId++);
	}
	if (!element._added_to_cache)
	{
	    App.Compiler.setElementId(element,element.id);
    }
	return element.id;
};

App.Compiler.setElementId = function(element, id)
{
	App.Compiler.removeElementId(element.id);
    element.id = id;
    element._added_to_cache = true;
    // set a global variable to a reference to the element
    // which now allows you to do something like $myid in javascript
    // to reference the element
    window['$'+id]=element;
    return element;
};

App.Compiler.removeElementId = function(id)
{
	if (id)
	{
		var element_var = window['$'+id];
		if (element_var)
		{
			try
			{
				delete window['$'+id];
			}
			catch(e)
			{
				window['$'+id] = 0;
			}
			if (element_var._added_to_cache)
			{
				try
				{
				    delete element_var._added_to_cache;
				}
				catch (e)
				{
					element_var._added_to_cache = 0;
				}
			}
			return true;
		}
	}
	return false;
};

swiss(document).onload(function()
{
	App.Compiler.compileDocument();

});
//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* mq.js */

//Define "App" namespace, if need be
var App = (typeof App == "undefined")?{}:App;

//Define convenience macros for publish, subscribe, and register
var $MQ = null;
var $MQL = null;
var $MQR = null;
var $MQI = null;

(function() {
	// Private state variables
	var MESSAGE_QUEUE = []; //this array represents the current message queue
	var INTERCEPTORS = []; //this array holds interceptors - first in gets priority, and can cancel others
	var LISTENERS = []; //this array represents the message listeners
	
	//Deliver the messages in the queue - runs on an interval initiated when the plugin is loaded
	function deliver() {
		while (MESSAGE_QUEUE.length > 0) {
			var message = MESSAGE_QUEUE.shift();
			//Allow interceptors to filter (or squash) messages
			var send_message = true;
			for(interceptor_index in INTERCEPTORS) {
				var interceptor = INTERCEPTORS[interceptor_index];
				if (message.scope === interceptor.scope) {
					if ((interceptor.type_or_regex.test && interceptor.type_or_regex.test(message.name)) ||
					 	(interceptor.type_or_regex == message.name )) {
						var result = interceptor.callback.call(this, message);
						if (result != null && !result) {
			                        send_message = false;
			                        break;
			                    }
					}
				}
			}
			//If the message was not squashed by an interceptor, let the listeners process it
			if (send_message) {
				for(listener_index in LISTENERS) {
					var listener = LISTENERS[listener_index];
					if (message.scope === listener.scope) {
						if ((listener.type_or_regex.test && listener.type_or_regex.test(message.name)) ||
						 	(listener.type_or_regex == message.name )) {
							listener.callback.call(this, message);
						}
					}
				}
			}
		}
	};
	
	//PUBLIC API:
	//-----------
	//Adding static utility methods and config to the "app" namespace
	App.mq = {
		
		//Plug-In Configuration
		config: {
			queue_scan_interval: 10 //The default interval to scan the queue for new messages
		},
		
		//Publish a message to the message queue
		publish: function(_msg_name_or_msg_object,data) {
			var message = {}; //Message object to be queued
			if (typeof _msg_name_or_msg_object == 'string') {
				message = {
					name: _msg_name_or_msg_object,
					payload: (data)?data:{},
					scope: 'appcelerator'
				};
			}
			else {
				message = swiss.extend({
					name: null,
					payload: (data)?data:{},
					scope: 'appcelerator'
				},_msg_name_or_msg_object||{});
				if (message.name == null) {
					throw "Messages must have an associated name"; 
				}
			}

			//Push the message onto the queue
			MESSAGE_QUEUE.push(message);
		},
		
		//Subscribe to a message
		subscribe: function(_type_or_regex, _callback, _args) {			
			// look for regex
			var listener = swiss.extend({
				type_or_regex: _type_or_regex,
				callback: _callback,
				scope: 'appcelerator',
				handle: null
			},_args||{});

			//Add the listener to the array of listeners
			LISTENERS.push(listener);
			
		},
		
		//remove a listener with the given handle from the list of listeners
		unsubscribe: function(_handle) {
			for(listener_index in LISTENERS) {
				var listener = LISTENERS[listener_index];
				if (_handle === listener.handle) {
					LISTENERS.splice(listener_index,1);
				}
			}
		},
		
		//Intercept any messages matching the regex and filter the message
		//returns true or false based on whether the rest of the filters should
		//execute
		intercept: function(_type_or_regex, _callback, _args) {			
			// Provide default args
			var interceptor = swiss.extend({
				type_or_regex: _type_or_regex,
				callback: _callback,
				scope: 'appcelerator',
				handle: null
			},_args||{});

			//Add the interceptor to the array of interceptors
			INTERCEPTORS.push(interceptor);
		},
		
		//Remove an interceptor with the given handle from the list of interceptors
		unintercept: function(_handle) {
			for(interceptor_index in INTERCEPTORS) {
				var interceptor = INTERCEPTORS[interceptor_index];
				if (_handle === interceptor.handle) {
					INTERCEPTORS.splice(interceptor_index,1);
				}
			}
		},
		
		//Register a URL pattern to have request/response messages mapped to it
		register: function(_request_msg_name, _response_msg_name, _url, _args) {			
			// Provide default args
			var args = swiss.extend({
				http_method: 'GET',
				scope: 'appcelerator'
			},_args||{});
			
			//Add a listener for the given ajax call
			App.mq.subscribe(_request_msg_name, function(msg) {
				//Determine value of URL for Ajax call
				var callUrl = _url;
				for (var property in msg.payload) {
				   var value = msg.payload[property];
				   callUrl = callUrl.replace(new RegExp("#{"+property+"}"),value);
				}
				
				//Make an ajax call to the given url, publishing messages based on the results
				swiss.ajax({
					type: args.http_method,
					dataType: "json",
					data: swiss.toJSON(msg.payload),
					url: callUrl,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					success: function(data, textStatus){
						App.mq.publish({
							name: _response_msg_name, 
							payload:data, 
							scope: args.scope 
						});
					},
					error: function(xhr, textStatus, errorThrown) {
						//TODO: Other useful info to add to the payload on a request error?
						App.mq.publish({
							name: _response_msg_name,
							payload: {
								requestError: true,
								status: textStatus
							},
							scope: args.scope 
						});
					}
				});
				
			}, { scope: args.scope });
		}
	};
	
	swiss.onload(function() {
		//Initialize message queue delivery on a regular interval
		setInterval(function() {
			deliver();
		}, App.mq.config.queue_scan_interval);
	});
	
	//Map convenience macros to API in the App.mq namespace
	$MQ = function(_msg_name_or_msg_object, data) {
		App.mq.publish(_msg_name_or_msg_object,data);
	};
	$MQI = function(_type_or_regex, _callback, _args) {
		App.mq.intercept(_type_or_regex, _callback, _args);
	};
	$MQL = function(_type_or_regex, _callback, _args) {
		App.mq.subscribe(_type_or_regex, _callback, _args);
	};
	$MQR = function(_request_msg_name, _response_msg_name, _url, _args) {
		App.mq.register(_request_msg_name, _response_msg_name, _url, _args);
	};
})();
//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* servicebroker.mq.js */

/**
* Create a listener for requests to the Appcelerator service broker.
* Any messages prefixed with r: or remote: will be picked up by this listener
*/
(function() {
	//get URL query string parameter
	function getQueryParam(name) {
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( window.location.href );
		return (results == null) ? "" : results[1];
	};

	//Subscribe to remote messages prefixed with r: or remote:
	$MQL(/^r:\.request|^remote:\.request/, function(msg_type, message_data) {
		try {		
			//Populate the JSON payload that will be submitted to the legacy service broker
			requestJSON = {};
			var time = new Date();
            requestJSON['timestamp'] = time.getTime()  + (time.getTimezoneOffset()*60*1000);
            requestJSON['version'] = '1.0';
            requestJSON['messages'] = [{
				type: msg_type,
				scope: message_data.msg_scope,
				version: message_data.msg_version,
				data: message_data.payload
			}];
	
			//Make an ajax call to the Appcelerator service broker
			swiss.ajax({
				type: 'POST',
				dataType: "json",
				url: "/servicebroker",
				contentType: "application/json",
				data: requestJSON,
				success: function(data, textStatus){
					for (msg_idx in data.messages) {
						var message = data.messages[msg_idx];
						$MQ(message['type'], {
							payload: message['data'],
							msg_scope: message['scope'],
							msg_version: message['version']
						});
					}
				},
				error: function(xhr, textStatus, errorThrown) {
					//TODO: Look into expected behavior on error status
				}
			});
		} catch(e) {
			if (!(getQueryParam("remoteDisabled") == "1")) {
				throw e;
			}
		}
	}, { msg_scope: 'appcelerator', handle: 'appc.remote.message.listener' });
})();
//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* rails.mq.js */

(function(){
  $MQL(/rails:.*\.request/, function(message) {
    type_parts = /rails:(\w+)\.([\w\d]+)\.request/(message.name);
    
    switch(type_parts[1]){
      case 'index':
        method = 'GET';
        url = '/' + type_parts[2] + '.json';
        data = null;
        break;
      case 'create':
        method = 'POST';
        url = '/' + type_parts[2] + '.json';
        data = swiss.toJSON(message.payload);
        break;
      case 'show':
        method = 'GET';
        url = '/' + type_parts[2] + '/' + message.payload['id'] + '.json';
        data = null;
        break;
      case 'update':
        method = 'POST';
        url = '/' + type_parts[2] + '/' + message.payload['id']
            + '.json?_method=put';
        data = swiss.toJSON(message.payload);
        break;
      case 'destroy':
        method = 'POST';
        url = '/' + type_parts[2] + '/' + message.payload['id']
            + '.json?_method=delete';
        data = null;
        break;
    }

    swiss.ajax({
      method: method,
      url: url,
      data: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      success: function(data){
        $MQ({
          name: 'rails:' + type_parts[1] + '.' + type_parts[2] + '.response',
          payload: swiss.unfilterJSON(data)
        });
      },
      error: function(xhr){
        $MQ({
          name: 'rails:' + type_parts[1] + '.' + type_parts[2] + '.error',
          payload: swiss.unfilterJSON(xhr.responseText)
        });
      } 
    });
  }, {});
})();

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* string.js */

String.interpret = function(value)
{
  return value == null ? '' : String(value);	
};

String.prototype.gsub = function(pattern, replacement) 
{
    var result = '', source = this, match;
    replacement = arguments.callee.prepareReplacement(replacement);

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
};
String.prototype.strip = function() 
{
  return this.replace(/^\s+/, '').replace(/\s+$/, '');
},

String.prototype.gsub.prepareReplacement = function(replacement) 
{
	if (typeof(replacement) == "function") return replacement;
	var template = new App.Wel.Template(replacement);
	return function(match) { return template.evaluate(match) };
};
String.prototype.trim = function()
{
    return this.replace(/^\s+/g, '').replace(/\s+$/g, '');
};
String.prototype.startsWith=  function(value)
{
    if (value.length <= this.length)
    {
        return this.substring(0, value.length) == value;
    }
    return false;
};
String.prototype.capitalize = function()
{
	this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
}
String.prototype.toFunction = function (dontPreProcess)
{
    var str = this.trim();
    if (str.length == 0)
    {
        return function() { };
    }
    if (!dontPreProcess)
    {
        if (str.match(/^function\(/))
        {
            str = 'return ' + str.unescapeXML() + '()';
        }
        else if (!str.match(/return/))
        {
            str = 'return ' + str.unescapeXML();
        }
        else if (str.match(/^return function/))
        {
            // invoke it as the return value
            str = str.unescapeXML() + ' ();';
        }
    }
    var code = 'var f = function(){ var args = swiss.toArray(arguments); ' + str + '}; f;';
    var func = eval(code);
    if (typeof(func) == 'function')
    {
        return func;
    }
    throw Error('code was not a function: ' + this);
}

/**
 * unescape XML entities back into their normal values
 */
String.prototype.unescapeXML = function()
{
    if (!this) return null;
    return this.replace(
	/&lt;/g,   "<").replace(
	/&gt;/g,   ">").replace(
	/&apos;/g, "'").replace(
	/&amp;/g,  "&").replace(
	/&quot;/g, "\"");
};

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* wel.js */

var App = (typeof App == "undefined")?{}:App;
App.Wel = {};

/////////////////////////////////////////////////////////////////
//
// Web Expression Core
//
/////////////////////////////////////////////////////////////////

/**
 * STEP 1: Parse On Attribute
 */
App.Wel.parseOnAttribute = function(element)
{
    try
    {
    	var on = element.getAttribute('on');
   		if (on && typeof on == "string")
    	{
		    if (App.Util.Logger) App.Util.Logger.debug('parseOnAttribute for ' + element.id + ' and  on=' + on);
    		App.Wel.compileExpression(element,on,false);
    		return true;
    	}
    }
	catch (ex)
	{
		App.Compiler.handleElementException(element, ex, 'compiling "on" attribute for element ' + element.id);
	}
	return false;
};

/**
 * STEP 2: Compile Expression
 */
App.Wel.compileExpression = function (element,value,notfunction)
{
	value = App.Wel.processMacros(value,element.id);
	if (!value)
	{
		App.Util.Logger.error('value returned null for '+element.id);
	}
	var clauses = App.Wel.parseExpression(value,element);
	App.Util.Logger.debug('on expression for ' + element.id + ' has ' + clauses.length + ' condition/action pairs');
	for(var i = 0; i < clauses.length; i++)
	{
		var clause = clauses[i];
        App.Util.Logger.debug('compiling expression for ' + element.id + ' => condition=[' +clause[1]+'], action=['+clause[2]+'], elseAction=['+clause[3]+'], delay=['+clause[4]+'], ifCond=['+clause[5]+']');
        clause[0] = element;
		var handled = false;
		if (clause[1] && clause[1].constructor === Array)
		{
			for (var c=0;c<clause[1].length;c++)
			{
				var cl = clause[1][c];
				var copy = [element,cl,clause[2],clause[3],clause[4],clause[5]];

		        handled = App.Wel.handleCondition.call(this, copy);
		        if (!handled)
		        {
		            throw "syntax error: unknown condition type: "+clause[1]+" for "+value;
		        }
			}
			continue;
		}
	    handled = App.Wel.handleCondition.call(this, clause);			
 
        if (!handled)
        {
            throw "syntax error: unknown condition type: "+clause[1]+" for "+value;
        }
	}
};

/**
 * STEP 3: Process Macros
 */
App.Wel.macros = {};
App.Wel.macroRE = /(#[A-Za-z0-9_-]+(\[(.*)?\])?)/;
App.Wel.processMacros = function(expression,id,scope)
{
	return expression.gsub(App.Wel.macroRE,function(match)
	{
		var expr = match[0].substring(1);
		var key = expr;
		var idx1 = key.indexOf('[');
		var idx2 = idx1 > 0 ? key.lastIndexOf(']') : -1;
		if (idx1>0 && idx2>0)
		{
			key = key.substring(0,idx1);
		}
		var template = App.Wel.macros[key];
		if (template)
		{
			scope = scope || {};

			if (idx1>0 && idx2>0)
			{
				var options = expr.substring(idx1+1,idx2);
				swiss.each(options.split(','),function()
				{
					var tok = this.split('=');
					scope[tok[0].trim()]=tok[1].trim();
				});
			}
			if (id)
			{
				var idvalue = scope['id'];
				if (typeof(idvalue) == 'undefined')
				{
					scope['id'] = id;
				}
			}
			// recursive in case you reference a macro in a macro
			return App.Wel.processMacros(template(scope),id,scope);
		}
		return match[0];
	});
};

/**
 * STEP 4: Parse Expression
 */
App.Wel.compoundCondRE = /^\((.*)?\) then$/;
App.Wel.parseExpression = function(value,element)
{
	if (!value)
	{
		return [];
	}

	if (typeof value != "string")
	{
		App.Util.Logger.error('framework error: value was '+value+' -- unexpected type: '+typeof(value));
	    throw "value: "+value+" is not a string!";
	}
	value = value.gsub('\n',' ');
	value = value.gsub('\r',' ');
	value = value.gsub('\t',' ');
	value = value.trim();

	var thens = [];
	var ors = App.Wel.smartSplit(value,' or ');
	
	for (var c=0,len=ors.length;c<len;c++)
	{
		var expression = ors[c].trim();
		var thenidx = expression.indexOf(' then ');
		if (thenidx <= 0)
		{
			// we allow widgets to have a short-hand syntax for execute
			if (App.Compiler.getTagname(element).indexOf(':'))
			{
				expression = expression + ' then execute';
				thenidx = expression.indexOf(' then ');
			}
			else
			{
				throw "syntax error: expected 'then' for expression: "+expression;
			}
		}
		var condition = expression.substring(0,thenidx);
		
		// check to see if we have compound conditions - APPSDK-597
		var testExpr = expression.substring(0,thenidx+5);
		var condMatch = App.Wel.compoundCondRE.exec(testExpr);
		if (condMatch)
		{
			var expressions = condMatch[1];
			// turn it into an array of conditions
			condition = App.Wel.smartSplit(expressions,' or ');
		}
		
		var elseAction = null;
		var nextstr = expression.substring(thenidx+6);
		var elseidx = App.Wel.smartTokenSearch(nextstr, 'else');

		var increment = 5;
		if (elseidx == -1)
		{
			elseidx = nextstr.indexOf('otherwise');
			increment = 10;
		}
		var action = null;
		if (elseidx > 0)
		{
			action = nextstr.substring(0,elseidx-1);
			elseAction = nextstr.substring(elseidx + increment);
		}
		else
		{
			action = nextstr;
		}

		var nextStr = elseAction || action;
		var ifCond = null;
		var ifIdx = nextStr.indexOf(' if expr[');

		if (ifIdx!=-1)
		{
			var ifStr = nextStr.substring(ifIdx + 9);
			var endP = ifStr.indexOf(']');
			if (endP==-1)
			{
				throw "error in if expression, missing end parenthesis at: "+action;
			}
			ifCond = ifStr.substring(0,endP);
			if (elseAction)
			{
				elseAction = nextStr.substring(0,ifIdx);
			}
			else
			{
				action = nextStr.substring(0,ifIdx);
			}
			nextStr = ifStr.substring(endP+2);
		}

		var delay = 0;
		var afterIdx =  App.Wel.smartTokenSearch(nextstr, 'after ');

		if (afterIdx!=-1)
		{
			var afterStr = nextStr.substring(afterIdx+6);
			delay = App.Util.DateTime.timeFormat(afterStr);
			if (!ifCond)
			{
				if (elseAction)
				{
					elseAction = nextStr.substring(0,afterIdx-1);
				}
				else
				{
					action = nextStr.substring(0,afterIdx-1);
				}
			}
		}

		thens.push([null,condition,action,elseAction,delay,ifCond]);
	}
	return thens;
};


/**
 * STEP 5: handle conditions
 */

App.Wel.handleCondition = function(clause)
{
    var element = clause[0];
    if (App.Util.Logger) App.Util.Logger.debug('handleCondition called for ' + element.id);

	if (clause[1] && typeof(clause[1]) == "boolean")
	{
	    var f = App.Wel.makeAction(element.id,clause[2]);
		return f.call(this,clause[3]);
	}
	
    //first loop through custom conditions defined by the widget
    for (var f=0;f<App.Wel.customElementConditions.length;f++)
    {
        var cond = App.Wel.customElementConditions[f];
        if (cond.elementid == element.id)
        {
            var condFunction = cond.condition;
            var processed = condFunction.apply(condFunction,clause);
     		if (processed)
     		{
     			return true;
     		}
        }
    }
	
	for (var f=0;f<App.Wel.customConditions.length;f++)
	{
		var condFunction = App.Wel.customConditions[f];
		var processed = condFunction.apply(condFunction,clause);
 		if (processed)
 		{
 			return true;
 		}
 	}
 	return false;
};

/**
 * Helper function for parsing
 */
App.Wel.smartSplit = function(value,splitter)
{
	value = value.trim();
	var tokens = value.split(splitter);
	if(tokens.length == 1) return tokens;
	var array = [];
	var current = null;
	for (var c=0;c<tokens.length;c++)
	{
		var line = tokens[c];
		if (!current && line.charAt(0)=='(')
		{
			current = line + ' or ';
			continue;
		}
		else if (current && current.charAt(0)=='(')
		{
			if (line.indexOf(') ')!=-1)
			{
				array.push(current+line);
				current = null;
			}
			else
			{
				current+=line + ' or ';
			}
			continue;
		}
		if (!current && line.indexOf('[')>=0 && line.indexOf(']')==-1)
		{
			if (current)
			{
				current+=splitter+line;
			}
			else
			{
				current = line;
			}
		}
		else if (current && line.indexOf(']')==-1)
		{
			current+=splitter+line;
		}
		else
		{
			if (current)
			{
				array.push(current+splitter+line)
				current=null;
			}
			else
			{
				array.push(line);
			}
		}
	}
	return array;
};
/**
 * Helper function for parsing
 */
App.Wel.smartTokenSearch = function(searchString, value)
{
	var validx = -1;
	if (searchString.indexOf('[') > -1 && searchString.indexOf(']')> -1)
	{
		var possibleValuePosition = searchString.indexOf(value);
		if (possibleValuePosition > -1)
		{
			var in_left_bracket = false;
			for (var i = possibleValuePosition; i > -1; i--)
			{
				if (searchString.charAt(i) == ']')
				{
					break;
				}
				if (searchString.charAt(i) == '[')
				{
					in_left_bracket = true;
					break;
				}
			}
			var in_right_bracket = false;
			for (var i = possibleValuePosition; i < searchString.length; i++)
			{
				if (searchString.charAt(i) == '[')
				{
					break;
				}
				if (searchString.charAt(i) == ']')
				{
					in_right_bracket = true;
					break;
				}
			}

			if (in_left_bracket && in_right_bracket)
			{
				validx = -1;
			} else
			{
				validx = searchString.indexOf(value);
			}
		} else validx = possibleValuePosition;
	}
	else
	{
		validx = searchString.indexOf(value);
	}
	return validx;
};

/*
 * Conditions trigger the execution of on expressions,
 * customConditions is a list of parsers that take the left-hand-side
 * of an on expression (before the 'then') and register event listeners
 * to be called when the condition is true.
 *
 * Parsers registered with registerCustomCondition are called in order
 * until one of them successfully parses the condition and returns true.
 */
App.Wel.customConditions = [];
App.Wel.customElementConditions = [];

App.Wel.registerCustomCondition = function(condition, elementid)
{
	if (!elementid)
	{
    	App.Wel.customConditions.push(condition);
	}
	else
	{
    	App.Wel.customElementConditions.push({elementid: elementid, condition: condition});
	}
};


App.Wel.parameterRE = /(.*?)\[(.*)?\]/i;
App.Wel.expressionRE = /^expr\((.*?)\)$/;

App.Wel.customActions = {};
App.Wel.customElementActions = {};
App.Wel.registerCustomAction = function(name,callback,element)
{
	//
	// create a wrapper that will auto-publish events for each
	// action that can be subscribed to
	//
	var action = callback;
	action.build = function(id,action,params)
	{
		return [
			'try {',
			callback.build(id,action,params),
			'; }catch(exxx){App.Compiler.handleElementException',
			'(swiss("#'+id+'"),exxx,"Executing:',action,'");}'
		].join('');

	};
	if (callback.parseParameters)
	{
		action.parseParameters = callback.parseParameters;
	}
	if (!element)
	{
    	App.Wel.customActions[name] = action;
	}
	else
	{
    	App.Wel.customElementActions[name + '_' + element.id] = action;
	}

};

App.Wel.makeConditionalAction = function(id, action, ifCond, additionalParams)
{
	var actionFunc = function(scope)
	{
	    var f = App.Wel.makeAction(id,action,additionalParams);
	    if (ifCond)
	    {
			if (typeof scope.id == "undefined")
			{
				scope.id = id;
			}
			if (App.Wel.evalWithinScope(ifCond,scope))
			{
	            f(scope);
			}
	    }
	    else
	    {
	        f(scope);
	    }
	};
	return actionFunc;
};

App.Wel.evalWithinScope = function (code, scope)
{
    if (code == '{}') return {};

	// make sure we escape any quotes given we're building a string with quotes
	var expr = code.gsub('"',"\\\"");
	
    // create the function
    var func = eval('var f = function(){return eval("(' + expr + ')")}; f;');

    // now invoke our scoped eval with scope as the this reference
    return func.call(scope);
};

/**
 * potentially delay execution of function if delay argument is specified
 *
 * @param {function} action to execute
 * @param {integer} delay value to execute in ms
 * @param {object} scope to invoke function in
 */
App.Wel.executeAfter = function(action,delay,scope)
{
	var f = (scope!=null) ? function() { action(scope); } : action;
	if (delay > 0)
	{
		setTimeout(function()
		{
			f();
		},(delay));
	}
	else
	{
		f();
	}
};

/////////////////////////////////////////////////////////////////
//
// Web Expression Macros
//
/////////////////////////////////////////////////////////////////
function $WEM(config)
{
	for (var name in config)
	{
		var value = config[name];
		if (typeof value == "string")
		{
			App.Wel.macros[name]=App.Wel.compileTemplate(value);
		}
	}
};

App.Wel.templateRE = /#\{(.*?)\}/g;
App.Wel.compileTemplate = function(html,htmlonly,varname)
{
	varname = varname==null ? 'f' : varname;

	var fn = function(m, name, format, args)
	{
		return "', jtv(values,'"+name+"','#{"+name+"}'),'";
	};
	var body = "var "+varname+" = function(values){ var jtv = App.Wel.getJsonTemplateVar; return ['" +
            html.replace(/(\r\n|\n)/g, '').replace(/\t/g,' ').replace(/'/g, "\\'").replace(App.Wel.templateRE, fn) +
            "'].join('');};" + (htmlonly?'':varname);

	var result = htmlonly ? body : eval(body);
	return result;
};

App.Wel.getJsonTemplateVar = function(namespace,var_expr,template_var)
{
    var def = {};
    var o = App.Util.getNestedProperty(namespace,var_expr,def);

    if (o == def) // wasn't found in template context
    {
        try
        {
            with(namespace) { o = eval(var_expr) };
        }
        catch (e) // couldn't be evaluated either
        {
            return template_var; // maybe a nested template replacement will catch it
        }
    }
    
    if (typeof(o) == 'object')
    {
        o = swiss.toJSON(o).replace(/"/g,'&quot;');
    }
    return o;
}

App.Wel.Template = function(template,pattern)
{
    this.template = template.toString();
    this.pattern = pattern || App.Wel.Template.Pattern;

	this.evaluate = function(object) 
	{
	  	return this.template.gsub(this.pattern, function(match) 
		{
		    if (object == null) return '';

		    var before = match[1] || '';
		    if (before == '\\') return match[2];

		    var ctx = object, expr = match[3];
		    var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/, match = pattern.exec(expr);
		    if (match == null) return before;

		    while (match != null) 
			{
		      var comp = match[1].startsWith('[') ? match[2].gsub('\\\\]', ']') : match[1];
		      ctx = ctx[comp];
		      if (null == ctx || '' == match[3]) break;
		      expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
		      match = pattern.exec(expr);
		    }
		    return before + (ctx==null)?'':String(ctx);
	  	});
	}
	
};
App.Wel.Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
App.Wel.parameterRE = /(.*?)\[(.*)?\]/i;
App.Wel.expressionRE = /^expr\((.*?)\)$/;
App.Wel.customActions = {};
App.Wel.customElementActions = {};



/**
 * make an valid javascript function for executing the
 * action - this string must be converted to a function
 * object before executing
 *
 * @param {string} id of the element
 * @param {string} value of the action string
 * @param {object} optional parameters to pass to action
 * @return {string} action as javascript
 */
App.Wel.makeAction = function (id,value,additionalParams)
{
    var actionFuncs = [];
	var actions = App.Wel.smartSplit(value.trim(),' and ');
	for (var c=0,len=actions.length;c<len;c++)
	{
        (function()
        {
    		var actionstr = actions[c].trim();
			var wildcard = actionstr.startsWith('both:') || actionstr.startsWith('*:');
    		var remote_msg = !wildcard && actionstr.startsWith('remote:') || actionstr.startsWith('r:');
    		var local_msg = !remote_msg && (actionstr.startsWith('local:') || actionstr.startsWith('l:'));
    		var actionParams = App.Wel.parameterRE.exec(actionstr);
    		var params = actionParams!=null ? App.Wel.getParameters(actionParams[2].trim(),false) : null;
    		var action = actionParams!=null ? actionParams[1] : actionstr;
			params = params || [];
			if (additionalParams)
			{
				for (var p in additionalParams)
				{
					params.push({key:p,value:additionalParams[p]});
				}
			}
			// if a message and message broker is installed
    		if ((local_msg || remote_msg || wildcard) && App.mq)
    		{
    			var f = function(scope)
    			{
					var newparams = {};
					for (var x=0;x<params.length;x++)
					{
						var entry = params[x];
						var key = entry.key, value = entry.value;
						if (entry.keyExpression)
						{
							key = App.Wel.getEvaluatedValue(entry.key,null,scope,entry.keyExpression);
						}
						else if (entry.valueExpression)
						{
							value = App.Wel.getEvaluatedValue(entry.value,null,scope,entry.valueExpression);
						}
						else if (entry.empty)
						{
							value = App.Wel.getEvaluatedValue(entry.key,null,scope);
						}
						else
						{
							key = App.Wel.getEvaluatedValue(entry.key);
							value = App.Wel.getEvaluatedValue(entry.value,null,scope);
						}
						newparams[key]=value;
					}
    			    App.Wel.fireServiceBrokerMessage(id, action, newparams, scope);
    			}
    			actionFuncs.push({func: f, action: action});
    		}
    		else
    		{
    		    var builder = App.Wel.customElementActions[action + '_' + id];
                if (!builder)
                {
        			builder = App.Wel.customActions[action];
                }
    			if (!builder)
    			{
    				throw "syntax error: unknown action: "+action+" for "+id;
    			}
    			//
    			// see if the widget has its own parameter parsing routine
    			//
    			var f = builder.parseParameters;

    			if (f && typeof(f) == "function")
    			{
    				// this is called as a function to custom parse parameters in the action between brackets []
    				params = f(id,action,actionParams?actionParams[2]||actionstr:actionstr);
    			}
    			//
    			// delegate to our pluggable actions to make it easy
    			// to extend the action functionality
    			//
    			var f = function(scope)
    			{
					scope = scope || window;
					if (params.constructor === Array)
					{
						for (var x=0;x<params.length;x++)
						{
							var entry = params[x];
							if (entry.keyExpression)
							{
								entry.key = App.Wel.getEvaluatedValue(entry.key,scope.data,scope,entry.keyExpression);
							 	entry.keyExpression = false;
							}
							else if (entry.valueExpression)
							{
								entry.value = App.Wel.getEvaluatedValue(entry.value,scope.data,scope,entry.valueExpression);
								entry.valueExpression = false;
								if (entry.empty)
								{
									entry.key = entry.value;
								}
							}
							else if (entry.empty)
							{
								entry.value = App.Wel.getEvaluatedValue(entry.key,scope.data,scope);
							}
							else
							{
								entry.key = App.Wel.getEvaluatedValue(entry.key);
								entry.value = App.Wel.getEvaluatedValue(entry.value,scope.data,scope);
							}
						}
					}
    			    builder.execute(id, action, params, scope);
    			}
    			actionFuncs.push({func: f, action: action});
    		}
        })();
	}
    var actionFunction = function(scope)
    {
        for (var i=0; i < actionFuncs.length; i++)
        {
            actionFunc = actionFuncs[i];
            actionFunc.func(scope);
        }
    }
	return actionFunction;

};


//
// Used by Message Condition
//
App.Wel.parseConditionCondition = function(actionParams,data) 
{
	if (!App.mq)
	{
		throw 'Messaging is not installed';		
		return;
	}
    var ok = true;

    if (actionParams)
    {
    	for (var c=0,len=actionParams.length;c<len;c++)
    	{
    		var p = actionParams[c];
			if (!p.key && p.empty && p.value)
			{
				p.key = p.value;
				p.value = null;
			}

			var k = null;
			var not_cond = p.key && p.key.charAt(p.key.length-1) == '!';
			var bnot_cond = p.key && p.key.charAt(0)=='!';
			
			var negate = (not_cond || bnot_cond);
			var idref = false;
			
			if (p.key)
			{
				k = not_cond ? p.key.substring(0,p.key.length-1) : p.key;
				k = bnot_cond ? k.substring(1) : k;
				idref = k.charAt(0)=='$';
				k = (p.keyExpression || idref) ? App.Wel.getEvaluatedValue(k,data,data,p.keyExpression) : k;
			}
			
			// mathematics
			if ((p.operator == '<' || p.operator == '>') && (p.value && typeof(p.value) == 'string' && p.value.charAt(0)=='='))
			{
				p.operator += '=';
				p.value = p.value.substring(1);
			}

			var v = p.operator ? App.Wel.getEvaluatedValue(k,data,data,p.valueExpression) : p.value ? App.Wel.getEvaluatedValue(p.value,data,data,p.valueExpression) : null;
			
			// regular expression
			if (p.value && typeof p.value == 'string' && p.value.charAt(0)=='~')
			{
				p.regex = true;
				p.value = p.value.substring(1);
			}
			
			// added x to eval $args
			var x = typeof p.value !='undefined' ? App.Wel.getEvaluatedValue(p.value,data) : null;
			var matched = p.keyExpression ? k : p.valueExpression ? (v || k) : idref ? (k && String(k).charAt(0)!='$') : App.Util.getNestedProperty(data,k);
			// we need to convert to boolean because 0 is a valid value but will set matched to false if you just check matched
			matched = typeof(matched) == 'boolean' ? matched : typeof matched != 'undefined';
			//alert('k='+k+'\nv='+v+'\nx='+x+'\nregex='+p.regex+'\noperator='+p.operator+'\nmatched='+matched+'\nnot='+not_cond+'\n!not='+bnot_cond+'\nempty='+p.empty+'\nkeyExpression='+p.keyExpression+'\nvalueExpression='+p.valueExpression+'\np.value='+p.value+'\npayload='+Object.toJSON(data));
			// top.Logger.info('k='+k+'\nv='+v+'\nx='+x+'\nregex='+p.regex+'\noperator='+p.operator+'\nmatched='+matched+'\nnot='+not_cond+'\n!not='+bnot_cond+'\nempty='+p.empty+'\nexpression='+p.expression);
			if (matched)
			{
				switch(p.operator)
				{
					case '<':
					{
						ok = v < x;
						break;
					}
					case '>':
					{
						ok = v > x;
						break;
					}
					case '<=':
					{
						ok = v <= x;
						break;
					}
					case '>=':
					{
						ok = v >= x;
						break;
					}
					default:
					{
						if (p.regex)
						{
							var r = new RegExp(x);
							ok = r.test(v);
						}
						else
						{
							// NWW:changed during port - wasn't working properly
							if (p.valueExpression == true)
							{
								ok = v;
							}
							else
							{
								ok = p.empty ? matched:v==x
							}
							//ok = p.empty ? matched : (p.valueExpression && p.valueExpression ==true) ? v : v==x;
							//ok = (p.valueExpression && p.valueExpression ==true) ? v : v==x;
						}
						break;
					}
				}
			}
			else
			{
				ok = false;
			}
			ok = negate ? !ok : ok;
			
			if (!ok) break;
    	}
    }
    return ok;
};


//
// helper for firing service broker
//
App.Wel.fireServiceBrokerMessage = function (id, type, args, scopedata)
{
	if (!App.mq)
	{
		throw 'Messaging is not installed';		
		return;
	}
		
 	var data = args || {};
	var element = swiss('#'+id).get(0);
	var fieldset = null;

	if (element)
	{
		fieldset = element.getAttribute('fieldset');
	}
	
	for (var p in data)
	{
		var entry = data[p];
		data[p] = App.Wel.getEvaluatedValue(entry,data,scopedata);
	}

	var localMode = type.startsWith('local:') || type.startsWith('l:');

	if (fieldset && App.fetchFieldset)
	{
           App.fetchFieldset(fieldset, localMode, data);
	}

	if (localMode)
	{
		if (data['id'] == null)
		{
        	data['id'] = id;
		}

	    if (data['element'] == null)
        {
        	data['element'] = swiss('#'+data['id']).get(0);
        }
	}
	$MQ({name:type,payload:data});
};

//
// Helper to find parameter values for WEL
//
App.Wel.findParameter = function(params,key)
{
	if (params)
	{
		if (params[key])
		{
			return params[key];
		}
		else
		{
			if (params.length > 0)
			{
				for (var c=0;c<params.length;c++)
				{
					var obj = params[c];
					if (obj.key == key)
					{
						return obj.value;
					}
				}
			}
		}
	}
	return null;
}

App.Wel.CSSAttributes =
[
	'color',
	'cursor',
	'font',
	'font-family',
	'font-weight',
	'border',
	'border-right',
	'border-bottom',
	'border-left',
	'border-top',
	'border-color',
	'border-style',
	'border-width',
	'background',
	'background-color',
	'background-attachment',
	'background-position',
	'position',
	'display',
	'visibility',
	'overflow',
	'opacity',
	'filter',
	'float',
	'top',
	'left',
	'right',
	'bottom',
	'width',
	'height',
	'margin',
	'margin-left',
	'margin-right',
	'margin-bottom',
	'margin-top',
	'padding',
	'padding-left',
	'padding-right',
	'padding-bottom',
	'padding-top'
];

App.Wel.isCSSAttribute = function (name)
{
	if (name == 'style') return true;

	for (var c=0,len=App.Wel.CSSAttributes.length;c<len;c++)
	{
		if (App.Wel.CSSAttributes[c] == name)
		{
			return true;
		}

		var css = App.Wel.CSSAttributes[c];
		var index = css.indexOf('-');
		if (index > 0)
		{
			var converted = css.substring(0,index) + css.substring(index+1).capitalize();
			if (converted == name)
			{
				return true;
			}
		}
	}
	return false;
};

App.Wel.convertCSSAttribute = function (css)
{
	var index = css.indexOf('-');
	if (index > 0)
	{
		var converted = css.substring(0,index) + css.substring(index+1).charAt(0).toUpperCase() + css.substring(index+2);
		return converted;
	}
	return css;
}

App.Wel.findTarget = function(id,params)
{
	var target = id;
	if (params && params.length > 0)
	{
		for (var c=0;c<params.length;c++)
		{
			var entry = params[c];
			if (entry.key == 'id')
			{
				target = entry.value;
				break;
			}
		}
	}
	return target;
};

App.Wel.getEvaluatedValue = function(v,data,scope,isExpression)
{
	if (v && typeof(v) == 'string')
	{
		if (!isExpression && v.charAt(0)=='$')
		{
			var varName = v.substring(1);
			var elem = swiss('#'+varName).get(0);
			if (elem)
			{
				// dynamically substitute the value
				return App.Util.getElementValue(elem,true);
			}
		}
        else if(!isExpression && !isNaN(parseFloat(v)))
        {
            //Assume that if they provided a number, they want the number back
            //this is important because in IE window[1] returns the first iframe
            return v;
        }
		else
		{
			// determine if this is a dynamic javascript
			// expression that needs to be executed on-the-fly
			var match = isExpression || App.Wel.expressionRE.exec(v);
			if (match)
			{
				var expr = isExpression ? v : match[1];
				var func = expr.toFunction();
				//var s = scope ? swiss.extend(scope) : {};
				var s = scope ? scope : {};
				if (data)
				{
					for (var k in data)
					{
						if (typeof k == "string")
						{
							s[k] = data[k];
						}
					}
				}
				return func.call(s);
			}

			if (scope)
			{
				var result = App.Util.getNestedProperty(scope,v,null);
				if (result)
				{
					return result;
				}
			}

			if (data)
			{
				return App.Util.getNestedProperty(data,v,v);
			}
		}
	}
	return v;
};

App.Wel.dequote = function(value)
{
	if (value && typeof value == 'string')
	{
		if (value.charAt(0)=="'" || value.charAt(0)=='"')
		{
			value = value.substring(1);
		}
		if (value.charAt(value.length-1)=="'" || value.charAt(value.length-1)=='"')
		{
			value = value.substring(0,value.length-1);
		}
	}
	return value;
};

App.Wel.convertInt = function(value)
{
	if (value.charAt(0)=='0')
	{
		if (value.length==1)
		{
			return 0;
		}
		return App.Wel.convertInt(value.substring(1));
	}
	return parseInt(value);
};

App.Wel.convertFloat = function(value)
{
	return parseFloat(value);
}

App.Wel.numberRe = /^[-+]{0,1}[0-9]+$/;
App.Wel.floatRe = /^[0-9]*[\.][0-9]*[f]{0,1}$/;
App.Wel.booleanRe = /^(true|false)$/;
App.Wel.quotedRe =/^['"]{1}|['"]{1}$/;
App.Wel.jsonRe = /^\{(.*)?\}$/;

var STATE_LOOKING_FOR_VARIABLE_BEGIN = 0;
var STATE_LOOKING_FOR_VARIABLE_END = 1;
var STATE_LOOKING_FOR_VARIABLE_VALUE_MARKER = 2;
var STATE_LOOKING_FOR_VALUE_BEGIN = 3;
var STATE_LOOKING_FOR_VALUE_END = 4;
var STATE_LOOKING_FOR_VALUE_AS_JSON_END = 5;

App.Wel.decodeParameterValue = function(token,wasquoted)
{
	var value = null;
	if (token!=null && token.length > 0 && !wasquoted)
	{
		var match = App.Wel.jsonRe.exec(token);
		if (match)
		{
			alert(match + ' ' + match[0])
			value = String(match[0]).evalJSON();
		}
		if (!value)
		{
			var quoted = App.Wel.quotedRe.test(token);
			if (quoted)
			{
				value = App.Wel.dequote(token);
			}
			else if (App.Wel.floatRe.test(token))
			{
				value = App.Wel.convertFloat(token);
			}
			else if (App.Wel.numberRe.test(token))
			{
				value = App.Wel.convertInt(token);
			}
			else if (App.Wel.booleanRe.test(token))
			{
				value = (token == 'true');
			}
			else
			{
				value = token;
			}
		}
	}
	if (token == 'null' || value == 'null')
	{
		return null;
	}
	return value == null ? token : value;
};

App.Wel.parameterSeparatorRE = /[\$=:><!]+/;

/**
 * method will parse out a loosely typed json like structure
 * into either an array of json objects or a json object
 *
 * @param {string} string of parameters to parse
 * @param {boolean} asjson return it as json object
 * @return {object} value
 */
App.Wel.getParameters = function(str,asjson)
{
	if (str==null || str.length == 0)
	{
		return asjson ? {} : [];
	}
		
	var exprRE = /expr\((.*?)\)/;
	var containsExpr = exprRE.test(str);
	
	// this is just a simple optimization to 
	// check and make sure we have at least a key/value
	// separator character before we continue with this
	// inefficient parser
	if (!App.Wel.parameterSeparatorRE.test(str) && !containsExpr)
	{
		if (asjson)
		{
			var valueless_key = {};
			valueless_key[str] = '';
			return valueless_key;
		}
		else
		{
			return [{key:str,value:'',empty:true}];
		}
	}
	var state = 0;
	var currentstr = '';
	var key = null;
	var data = asjson ? {} : [];
	var quotedStart = false, tickStart = false;
	var operator = null;
	var expressions = containsExpr ? {} : null;
	if (containsExpr)
	{
		var expressionExtractor = function(e)
		{
			var start = e.indexOf('expr(');
			if (start < 0) return null;
			var p = start + 5;
			var end = e.length-1;
			var value = '';
			while ( true )
			{
				var idx = e.indexOf(')',p);
				if (idx < 0) break;
				value+=e.substring(p,idx);
				if (idx == e.length-1)
				{
					end = idx+1;
					break;
				}
				var b = false;
				var x = idx + 1;
				for (;x<e.length;x++)
				{
					switch(e.charAt(x))
					{
						case ',':
						{
							end = x;
							b = true;
							break;
						}
						case ' ':
						{
							break;
						}
						default:
						{
							p = idx+1;
							break;
						}
					}
				}
				if (x==e.length-1)
				{
					end = x;
					break;
				}
				if (b) break;
				value+=')';
			}
			var fullexpr = e.substring(start,end);
			return [fullexpr,value];
		};
		
		var ec = 0;
		while(true)
		{
			var m = expressionExtractor(str);
			if (!m)
			{
				break;
			}
			var k = '__E__'+(ec++);
			expressions[k] = m[1];
			str = str.replace(m[0],k);
		}
	}
	
	function transformValue(k,v,tick)
	{
		if (k && k.startsWith('__E__'))
		{
			if (!asjson)
			{
				return {key:expressions[k],value:v,keyExpression:true,valueExpression:false};
			}
			else
			{
				return expressions[k];
			}
		}
		if (v && v.startsWith('__E__'))
		{
			if (!asjson)
			{
				return {key:k,value:expressions[v],valueExpression:true,keyExpression:false};
			}
			else
			{
				return expressions[v];
			}
		}
		var s = App.Wel.decodeParameterValue(v,tick);
		if (!asjson)
		{
			return {key:k,value:s};
		}
		return s;
	}
	
	for (var c=0,len=str.length;c<len;c++)
	{
		var ch = str.charAt(c);
		var append = true;
		
		switch (ch)
		{
			case '"':
			case "'":
			{
				switch (state)
				{
					case STATE_LOOKING_FOR_VARIABLE_BEGIN:
					{
						quoted = true;
						append = false;
						state = STATE_LOOKING_FOR_VARIABLE_END;
						quotedStart = ch == '"';
						tickStart = ch=="'";
						break;
					}
					case STATE_LOOKING_FOR_VARIABLE_END:
					{
						var previous = str.charAt(c-1);
						if (quotedStart && ch=="'" || tickStart && ch=='"')
						{
							// these are OK inline
						}
						else if (previous != '\\')
						{
							state = STATE_LOOKING_FOR_VARIABLE_VALUE_MARKER;
							append = false;
							key = currentstr.trim();
							currentstr = '';
						}
						break;
					}
					case STATE_LOOKING_FOR_VALUE_BEGIN:
					{
						append = false;
						quotedStart = ch == '"';
						tickStart = ch=="'";
						state = STATE_LOOKING_FOR_VALUE_END;
						break;
					}
					case STATE_LOOKING_FOR_VALUE_END:
					{
						var previous = str.charAt(c-1);
						if (quotedStart && ch=="'" || tickStart && ch=='"')
						{
							// these are OK inline
						}
						else if (previous != '\\')
						{
							state = STATE_LOOKING_FOR_VARIABLE_BEGIN;
							append = false;
							if (asjson)
							{
								data[key]=transformValue(key,currentstr,quotedStart||tickStart);
							}
							else
							{
								data.push(transformValue(key,currentstr,quotedStart||tickStart));
							}
							key = null;
							quotedStart = false, tickStart = false;
							currentstr = '';
						}
						break;
					}
				}
				break;
			}
			case '>':
			case '<':
			case '=':
			case ':':
			{
				if (state == STATE_LOOKING_FOR_VARIABLE_END)
				{
					if (ch == '<' || ch == '>')
					{
						key = currentstr.trim();
						currentstr = '';
						state = STATE_LOOKING_FOR_VARIABLE_VALUE_MARKER;
					}
				}
				switch (state)
				{
					case STATE_LOOKING_FOR_VARIABLE_END:
					{
						append = false;
						state = STATE_LOOKING_FOR_VALUE_BEGIN;
						key = currentstr.trim();
						currentstr = '';
						operator = ch;
						break;
					}
					case STATE_LOOKING_FOR_VARIABLE_VALUE_MARKER:
					{
						append = false;
						state = STATE_LOOKING_FOR_VALUE_BEGIN;
						operator = ch;
						break;
					}
				}
				break;
			}
			case ',':
			{
				switch (state)
				{
					case STATE_LOOKING_FOR_VARIABLE_BEGIN:
					{
						append = false;
						state = STATE_LOOKING_FOR_VARIABLE_BEGIN;
						break;
					}
					case STATE_LOOKING_FOR_VARIABLE_END:
					{
						// we got to the end (single parameter with no value)
						state=STATE_LOOKING_FOR_VARIABLE_BEGIN;
						append=false;
						if (asjson)
						{
							data[currentstr]=null;
						}
						else
						{
							var entry = transformValue(key,currentstr);
							entry.operator = operator;
							entry.key = entry.value;
							entry.empty = true;
							data.push(entry);
						}
						key = null;
						quotedStart = false, tickStart = false;
						currentstr = '';
						break;
					}
					case STATE_LOOKING_FOR_VALUE_END:
					{
						if (!quotedStart && !tickStart)
						{
							state = STATE_LOOKING_FOR_VARIABLE_BEGIN;
							append = false;
							if (asjson)
							{
								data[key]=transformValue(key,currentstr,quotedStart||tickStart);
							}
							else
							{
								var entry = transformValue(key,currentstr);
								entry.operator = operator;
								data.push(entry);
							}
							key = null;
							quotedStart = false, tickStart = false;
							currentstr = '';
						}
						break;
					}
				}
				break;
			}
			case ' ':
			{
			    break;
			}
			case '\n':
			case '\t':
			case '\r':
			{
				append = false;
				break;
			}
			case '{':
			{
				switch (state)
				{
					case STATE_LOOKING_FOR_VALUE_BEGIN:
					{
						state = STATE_LOOKING_FOR_VALUE_AS_JSON_END;
					}
				}
				break;
			}
			case '}':
			{
				if (state == STATE_LOOKING_FOR_VALUE_AS_JSON_END)
				{
					state = STATE_LOOKING_FOR_VARIABLE_BEGIN;
					append = false;
					currentstr+='}';
					if (asjson)
					{
						data[key]=transformValue(key,currentstr,quotedStart||tickStart);
					}
					else
					{
						var entry = transformValue(key,currentstr);
						entry.operator = operator;
						data.push(entry);
					}
					key = null;
					quotedStart = false, tickStart = false;
					currentstr = '';
				}
				break;
			}
			default:
			{
				switch (state)
				{
					case STATE_LOOKING_FOR_VARIABLE_BEGIN:
					{
						state = STATE_LOOKING_FOR_VARIABLE_END;
						break;
					}
					case STATE_LOOKING_FOR_VALUE_BEGIN:
					{
						state = STATE_LOOKING_FOR_VALUE_END;
						break;
					}
				}
			}
		}
		if (append)
		{
			currentstr+=ch;
		}
		if (c + 1 == len && key)
		{
			//at the end
			currentstr = currentstr.strip();
			if (asjson)
			{
				data[key]=transformValue(key,currentstr,quotedStart||tickStart);
			}
			else
			{
				var entry = transformValue(key,currentstr);
				entry.operator = operator;
				data.push(entry);
			}
		}
	}

	if (currentstr && !key)
	{
		if (asjson)
		{
			data[key]=null;
		}
		else
		{
			var entry = transformValue(key,currentstr);
			entry.empty = true;
			entry.key = entry.value;
			entry.operator = operator;
			data.push(entry);
		}
	}
	return data;
};
App.Wel.getHtml = function (element,convertHtmlPrefix)
{
	convertHtmlPrefix = (convertHtmlPrefix==null) ? true : convertHtmlPrefix;

	var html = element.innerHTML || App.Util.Dom.getText(element);

	// convert funky url-encoded parameters escaped
	if (html.indexOf('#%7B')!=-1)
	{
	   html = html.gsub('#%7B','#{').gsub('%7D','}');
    }

	// IE/Opera unescape XML in innerHTML, need to escape it back
	html = html.gsub(/\\\"/,'&quot;');
	return html;

};


//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* api.js */

//
// Add support for creating on expressions via JS
//
if (jQuery)
{
	(function()
	{
		jQuery.fn.on = function(expr)
		{
			return this.each(function()
			{
				App.Wel.compileExpression($(this)[0],expr,false);
			})
		}
	})(jQuery);

}
else
{
	App.on = function(id, expr)
	{
		App.Wel.compileExpression(swiss('#'+id),expr,false)
	}	
}

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* statemachine.js */

(function()
{
	if (App.mq)
	{
		App.Wel.StateMachine = {};

		// track active state machines
		App.Wel.StateMachine.active = [];

		App.StateMachine = function(name)
		{
			// record state machine
			App.Wel.StateMachine.active.push(this);

			// name of state machine
			this.name = name;

			// states
			this.states = [];

			// state change listeners
			this.listeners = [];

			// active state
			this.activeState = null;

			// add a state
			this.addState = function(state,trigger,active)
			{
				// create listener
				var self = this

				// parse trigger data
				// takes for of message[name=value,name2!=value]
				var actionParams = App.Wel.parameterRE.exec(trigger);
				var type = (actionParams ? actionParams[1] : trigger);
				var params = actionParams ? actionParams[2] : null;
				var actionParams = params ? App.Wel.getParameters(params,false) : null;

				// setup listener
				$MQL(type, function(msg)
				{
					var ok = App.Wel.parseConditionCondition(actionParams, msg.payload);
					if (ok == true)
					{
						self.fireStateChange(state);
					}
				});

				// only one active state
				if (active ==true)
				{
					this.fireStateChange(state);
					this.activeState = state;
					for (var i=0;i<this.states.length;i++)
					{
						if (this.states[i].active == true)
						{
							this.states[i].active = false;
						}
					}
				}

				// store state objects for each state machine
				var stateObj = {active:(active)?active:false,name:state};
				this.states.push(stateObj);
			};

			// helper method to get current active state
			this.getActiveState = function()
			{
				return this.activeState;
			};

			// helper method to programatically set the active state
			this.setActiveState = function(state)
			{
				this.fireStateChange(state);
			}

			// add a state change listener
			this.addListener = function(callback)
			{
				this.listeners.push(callback);
			};

			// fire a state change
			this.fireStateChange = function(state)
			{
				// set states
				for (var i=0;i<this.states.length;i++)
				{
					if (this.states[i].name == state)
					{
						this.states[i].active = true;
						this.activeState = state;
					}
					else
					{
						this.states[i].active = false;
					}
				}
				// call listeners
				for (var i=0;i<this.listeners.length;i++)
				{
					this.listeners[i].call(this)
				}

			}
		}		
	}

	
})()

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* history.js */

App.History = {};

App.History.changeListeners = [];
App.History.currentState = false;

App.History.onChange = function(listener)
{
	App.History.changeListeners.push(listener);	
};

App.History.go = function(historyToken)
{
	document.location.hash = historyToken;
};

App.History.fireChange = function(newState)
{
	if (newState && newState.charAt(0)=='#')
    {
        newState = newState.substring(1);
    }
    
    if (newState === '')
    {
    	newState = null;
    }
    
    if (App.History.currentState!=newState)
    {
	    App.History.currentState = newState;
	    
	    var data = 
	    {
	    	state:newState
	    };
	    
	    for (var c=0;c<App.History.changeListeners.length;c++)
	    {
	        var listener = App.History.changeListeners[c];
	        listener(newState,data);
	    }
    }
};

if (App.Browser.isIE)
{
	App.History.loadIE = function()
	{
	    var iframe = document.createElement('iframe');
	    iframe.id='app_hist_frame';
	    iframe.style.position='absolute';
	    iframe.style.left='-10px';
	    iframe.style.top='-10px';
	    iframe.style.width='1px';
	    iframe.style.height='1px';
		iframe.src='javascript:false';	
	    document.body.appendChild(iframe);
	
	    var frame = swiss('#app_hist_frame').get(0);
	    var stateField = null;
	    var state = null;
	    var initial = false;
	    
	    setInterval(function()
	    {
	        var doc = frame.contentWindow.document;
	        if (!doc)
	        {
	            return;
	        }
	
	        stateField = doc.getElementById('state');
	        var cur = document.location.hash;
	        
	        if (cur!==initial)
	        {
	            initial = cur;
	            doc.open();
	            doc.write( '<html><body><div id="state">' + cur + '</div></body></html>' );
	            doc.close();
	            App.History.fireChange(cur);
	        }
	        else
	        {
	            // check for state
	            if (stateField)
	            {
	                var newState = stateField.innerText;
	                if (state!=newState)
	                {
	                    state = newState;
	                    if (newState==null || newState==='')
	                    {
	                        if (document.location.hash)
	                        {
	                            initial = '#';
	                            document.location.hash='';
	                            App.History.fireChange('#');
	                        }
	                    }
	                    else
	                    {
	                        if (newState!=document.location.hash)
	                        {
	                            document.location.hash=newState;
	                            App.History.fireChange(document.location.hash);
	                        }
	                    }
	                }
	            }
	            else
	            {
	                if (initial)
	                {
	                    initial = false;
	                }
	            }
	        }
	    },50);	
	};
}

App.Compiler.afterDocumentCompile(function()
{
    if (App.Browser.isIE)
    {
    	App.History.loadIE();
    }
    else
    {
    	// THIS TRICK CAME FROM YUI's HISTORY COMPONENT
    	//
    	// On Safari 1.x and 2.0, the only way to catch a back/forward
        // operation is to watch history.length... We basically exploit
        // what I consider to be a bug (history.length is not supposed
        // to change when going back/forward in the history...) This is
        // why, in the following thread, we first compare the hash,
        // because the hash thing will be fixed in the next major
        // version of Safari. So even if they fix the history.length
        // bug, all this will still work!
        var counter = history.length;
        
        // On Gecko and Opera, we just need to watch the hash...
        var hash = null; // set it to null so we can start off in a null state to check for first change
        
        setInterval( function () 
        {
            var newHash;
            var newCounter;

            newHash = document.location.hash;
            newCounter = history.length;

            if ( newHash !== hash ) 
            {
                hash = newHash;
                counter = newCounter;
                App.History.fireChange(newHash);
            } 
            else if ( newCounter !== counter ) 
            {
                // If we ever get here, we should be on Safari...
                hash = newHash;
                counter = newCounter;
                App.History.fireChange(newHash);
            }
        }, 50 );
    }
});
//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* set.js */

(function()
{
	var addsetBuildFunction = function(id,action,params,scope)
	{
		if (params.length == 0)
		{
			throw "syntax error: expected parameter key:value for action: "+action;
		}
		var target = App.Wel.findTarget(id,params);
		for (var c=0;c<params.length;c++)
		{
			var obj = params[c];
			var key = obj.key;
			if (typeof(key)!= "string") continue;
			var value = obj.value;
			if (App.Wel.isCSSAttribute(key))
			{
				key = App.Wel.convertCSSAttribute(key);
				swiss('#'+target).css(key, value);
				continue;
			}
			else if (key == 'class')
			{
				if (action=='set')
				{
					swiss('#'+target).get(0).className = App.Wel.getEvaluatedValue(value,(scope)?scope.data:{});
				}
				else
				{
					swiss('#'+target).addClass(App.Wel.getEvaluatedValue(value,(scope)?scope.data:{}));
				}
			}
			else if (key.startsWith('style'))
			{
			    swiss('#'+target).get(0)[key] = App.Wel.getEvaluatedValue(value,(scope)?scope.data:{});
		    }
		    else
		    {
				var e = swiss('#'+target).get(0);
				if (!e)
				{
				    throw "syntax error: element with ID: "+target+" doesn't exist";
				}
				if (e[key]!=null)
				{
	    			switch(key)
	    			{
	    				case 'checked':
	    				case 'selected':
	    				case 'disabled':
						case 'defaultChecked':
	    				{
							var value = App.Wel.getEvaluatedValue(value,(scope)?scope.data:{});
							if (value)
							{
								e.setAttribute(key,value);
							}
							else
							{
								e.removeAttribute(key);
							}
	    					break;
						}
	    				default:
	    				{
	            			var isOperaSetIframe = App.Browser.isOpera && e.nodeName=='IFRAME' && key=='src';
	    				    if (isOperaSetIframe)
	    				    {
	    				        e.location.href = App.Wel.getEvaluatedValue(value,(scope)?scope.data:{});
	    				    }
	    				    else
	    				    {
	    				        e[key] = App.Wel.getEvaluatedValue(value,(scope)?scope.data:{});
	    				    }
						}
	    			}
			    }
			    else
			    {
			        e.setAttribute(key, App.Wel.getEvaluatedValue(value,(scope)?scope.data:{}));
			    }
			}
		}
	}

    App.Wel.registerCustomAction('add',
	{
		execute: addsetBuildFunction
	});
    App.Wel.registerCustomAction('set',
    {
        execute: addsetBuildFunction
    });
})();

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* hide.js */

App.Wel.registerCustomAction('hide',
{
	execute: function(id,action,params)
	{
		var el = App.Wel.findTarget(id,params);
 		swiss('#'+el).hide();
	}
});

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* show.js */

App.Wel.registerCustomAction('show',
{
	execute: function(id,action,params)
	{
		var el = App.Wel.findTarget(id,params)
		swiss('#'+el).show();
 	}
});

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* hidden.js */

App.Wel.registerCustomAction('hidden',
{
	execute: function(id,action,params)
	{
		var el = App.Wel.findTarget(id,params);
  		swiss('#'+el).css('visibility','hidden');
	}
});

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* visible.js */

App.Wel.registerCustomAction('visible',
{
	execute: function(id,action,params)
	{
  		swiss('#'+App.Wel.findTarget(id,params)).css('visibility','visible');
	}
});

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* script.js */

(function()
{
	var scriptBuilderAction =
	{
	    parseParameters: function (id,action,params)
	    {
	        return params;
	    },
	    execute: function (id,action,params,scope)
	    {   
	        var f = function() { eval(params); }
	        f.apply(scope);
	    }
	};
	App.Wel.registerCustomAction('javascript',scriptBuilderAction);
	App.Wel.registerCustomAction('function',scriptBuilderAction);
	App.Wel.registerCustomAction('script',scriptBuilderAction);
})();

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* effect.js */

App.Wel.registerCustomAction('effect',
{
	execute: function(id,action,params)
	{
		// get effect name
		var arg1= params[0].key.split(",");
		var effectName = arg1[0];
		
		// build options
		var options = {}
		var target = id;
		if (params.length > 1)
		{
			for (var i=1;i<params.length;i++)
			{
				if (params[i].key == "id")
				{
					target = params[i].value;
				}
				else
				{

					options[params[i].key] = params[i].value;
				}
			}
		}

		if (swiss('#'+target).effect(effectName, options) == null)
		{
			throw ('effect not supported by library => effect name: ' + effectName);
		}
	}
});

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* generics.js */

(function()
{
	var registerGenericAction = function(action)
	{
		App.Wel.registerCustomAction(action,
		{
			execute:function(id,action,params)
			{
				var target = App.Wel.findTarget(id,params);
				switch(action)
				{
					case 'focus':
					case 'blur':
					case 'click':
					case 'submit':
					case 'select':
					{
						swiss('#'+target).fire(action);
						break;
					}
					case 'disable':
					{
						swiss('#'+target).get(0).disabled = true;
						swiss('#'+target).fire('disabled');

						break;
					}
					case 'enable':
					{
						swiss('#'+target).get(0).disabled = false;
						swiss('#'+target).fire('enabled');
						break;
					}

				}
			}
		})
	}
	registerGenericAction('enable');
	registerGenericAction('disable');
	registerGenericAction('focus');
	registerGenericAction('blur');
	registerGenericAction('select');
	registerGenericAction('click');
	registerGenericAction('submit');
	
})();

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* remove.js */

App.Wel.registerCustomAction('remove',
{
	execute: function(id,action,params)
	{
		if (params.length == 0)
		{
			throw "syntax error: expected parameter for action: "+action;
		}
		var target = App.Wel.findTarget(id,params);
		var key = null;
		var value = null;
		for (var c=0;c<params.length;c++)
		{
			if (params[c].key == 'id') continue;
			key = params[c].key;
			value = params[c].value;
			if (key)
			{
				switch (key)
				{
					case 'class':
					    swiss('#'+target).removeClass(value);
					    break;
					default:
		    			swiss('#'+target).get(0).removeAttribute(key);
				}
			}

		}
	}
});

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* statechange.js */

App.Wel.registerCustomAction('statechange',
{
	execute: function(id,action,params)
	{
		if (params.length == 0)
		{
			throw "syntax error: expected parameters in format 'statechange[statemachine=state]'";
		}

		var statemachine = params[0].key;
		var state = params[0].value
		
		// find statemachine
		for (var i=0;i<App.Wel.StateMachine.active.length;i++)
		{
			var curMachine = App.Wel.StateMachine.active[i];
			
			// if same, then fire state change
			if (curMachine.name == statemachine)
			{
				curMachine.fireStateChange(state);
				return;
			}
		}
	}
});
//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* reset_clear.js */

(function()
{
	var ResetAction =
	{
		execute: function(id,action,params)
		{
			var target = App.Wel.findTarget(id,params);
			var element = swiss('#'+target).get(0);
			if (!element)return;
			var revalidate = false;
			var value = '';
			switch (App.Compiler.getTagname(element))
			{
				case 'input':
				case 'textarea':
				{
				    element.value = value;
					revalidate=true;
					break;
				}
				case 'select':
				{
				    element.selectedIndex = 0;
					revalidate=true;
					break;
				}
				case 'form':
				{
					var formEls = swiss('#'+element.id+ "> * ").results;
					for (var i=0;i<formEls.length;i++)
					{
						var tag = App.Compiler.getTagname(formEls[i])
						switch(tag)
						{
							case 'input':
							{
								if (formEls[i].type == 'text')
									formEls[i].value = '';
							  	else
									formEls[i].checked = false;
								swiss(formEls[0]).fire('revalidate');
								break;
							}
							case 'textarea':
							{
								formEls[i].value = '';
								swiss(formEls[0]).fire('revalidate');
								break;
							}
							case 'select':
							{
								formEls[i].selectedIndex=0;
								swiss(formEls[0]).fire('revalidate');
								break;
								
							}
						}
					}
	                return;
				}
				default:
				{
					swiss('#'+target).html(value);
					return;
				}
			}
			
			if (revalidate==true)
			{
			   swiss(element).fire('revalidate');
			}
		}
	};
	App.Wel.registerCustomAction('clear',ResetAction);
	App.Wel.registerCustomAction('reset',ResetAction);
	
})();

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* select_option.js */

App.Wel.registerCustomAction('selectOption',
{
	execute: function(id,action,params,scope)
	{
		if (params.length == 0)
		{
			throw "syntax error: expected parameter property for action: "+action;
		}
		var select = swiss('#'+id).get(0);

		if (!select.options)
		{
			throw "syntax error: selectOption must apply to a select tag";
		}

		// try to get value from action args
		var key = params[0].key;
		var selectedValue = params[0].value || key;
		if (selectedValue=='$null')
		{
			selectedValue = '';
		}
		
		// try to get value from message data
		if (scope.data && selectedValue == null)
		{
			selectedValue = App.Util.getNestedProperty(scope.data, key, def);

		}
		
		// if no selected value found return
		if (selectedValue == null) return;
		
		var targetSelect = swiss('#'+id).get(0);
		var isArray = selectedValue.constructor == Array;

        targetSelect.selectedIndex = -1;

		for (var j=0;j<targetSelect.options.length;j++)
		{
			if (isArray)
			{
				targetSelect.options[j].selected = selectedValue.include(targetSelect.options[j].value);
			}
			else
			{
			    if (targetSelect.options[j].value == selectedValue)
			    {
			        targetSelect.selectedIndex = j;
			        break;
			    }
			}
		}
		swiss(targetSelect).fire('revalidate');
	}
});

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* toggle.js */

App.Wel.toggleValues = {};
App.Wel.registerCustomAction('toggle',
{
	execute: function(id,action,params)
	{
		if (params && params.length > 0)
		{
			var toggleKey;
			var toggleValue;
			for (var i=0;i<params.length;i++)
			{
				if (params[i].key == id)
				{
					continue;
				}
				else
				{
					toggleKey = params[i].key;
					toggleValue = params[i].value
				}
			}
			var target = App.Wel.findTarget(id,params)

			// toggle class
			if (toggleKey == 'class')
			{
			    if (swiss('#'+target).hasClass(toggleValue))
			    {
			        swiss('#'+target).removeClass(toggleValue);
			    }
			    else
			    {
			        swiss('#'+target).addClass(toggleValue);
		        }
			}
			else
			{
				if (App.Wel.isCSSAttribute(toggleKey))
				{
					var key = App.Wel.convertCSSAttribute(toggleKey);
					switch (key)
					{
						case 'display':
						case 'visibility':
						{
							var opposite = '';
							switch(toggleValue)
							{
								case 'inline':
									opposite='none';break;
								case 'block':
									opposite='none'; break;
								case 'none':
									opposite='block'; break;
								case 'hidden':
									opposite='visible'; break;
								case 'visible':
									opposite='hidden'; break;
							}
							var a = swiss('#'+target).css(key);
						    var value = null;
							if (a!=opposite)
							{
							    value = opposite;
							}
							else
							{
							    value = toggleValue;
						    }
						    swiss('#'+target).css(key,value);
							break;
						}
						default:
						{
							var a = swiss('#'+target).css(key);
							
							if (a != toggleValue)
							{
								App.Wel.toggleValues[target] = a;
								swiss('#'+target).css(key,toggleValue);
							}
							else
							{
								swiss('#'+target).css(key,App.Wel.toggleValues[target]);
							}
							break;
						}
					}
				}
				else
				{
					var a = swiss('#'+target).get(0);
					if (!a)
					{
					    throw "no element with ID: "+target;
					}
					var v = a.getAttribute(toggleKey);
					if (v)
					{
					    a.removeAttribute(toggleKey);
					}
					else
					{
					    a.setAttribute(toggleKey,toggleValue);
				    }
				}
			}
		}
		else
		{
			throw "syntax error: toggle action must have parameters";
		}
	}
});

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* value.js */

App.Wel.registerCustomAction('value',
{
	execute: function(id,action,params,scope)
	{
		var target = App.Wel.findTarget(id,params);
		var element = swiss('#'+target).get(0);
		var valueHtml = null;
		var append = false;
		var form = false;
		var key = null;
		var value = null;
		
		if (params)
		{
			for (var c=0,len=params.length;c<len;c++)
			{
				var param = params[c];
				switch(param.key)
				{
					case 'append':
					{
						append=true;
						break;
					}
					case 'value':
					{
						valueHtml = param.value;
						break;
					}
					default:
					{
						key = param.key;
						value = param.value;
						if (param.empty)
						{
							if (key.startsWith("'") && key.endsWith("'"))
							{
								value = App.Wel.dequote(param.key);
								value = null;
							}
						}
					}
				}
			}
		}
		
		if (!key && !valueHtml)
		{
			key = params[0].key;
			value = params[0].value;
		}
		if (valueHtml == null)
		{
			if (!value && key && key.startsWith("'") && key.endsWith("'"))
			{
				if (element.id == 'nope')alert('in first if ' );

				valueHtml = App.Wel.dequote(key);
			}
			else if (!value)
			{
				valueHtml = App.Util.getNestedProperty(scope.data,key);
			}
			else if (value)
			{
				if (typeof(value)=='object')
				{
					if (element.id == 'nope')alert('in third if ');

					valueHtml = App.Util.getNestedProperty(value,key);
				}
				else
				{
					valueHtml = value;
				}
			}
		}

		var html = '';
		var variable = '';
		var expression = '';

		var revalidate = false;
		var elementTagname = App.Compiler.getTagname(element)
		switch (elementTagname)
		{
			case 'input':
			{
				revalidate = true;
				var type = element.getAttribute('type') || 'text';
				switch (type)
				{
					case 'password':
					case 'hidden':
					case 'text':
					{
						variable='value';
						break;
					}
/*					case 'radio': TODO- fix me */
					case 'checkbox':
					{
						variable='checked';
						append=false;
						expression = "==true || " + valueHtml + "=='true'";
						break;
					}
					case 'button':
					case 'submit':
					{
						variable='value';
						break;
					}
				}
				break;
			}
			case 'textarea':
			{
				revalidate = true;
				variable = 'value';
				break;
			}
			case 'select':
			{
				// select is a special beast
				var code = '';
				var property = App.Wel.findParameter(params,'property');
				var row = App.Wel.findParameter(params,'row');
				var value = App.Wel.findParameter(params,'value');
				var text = App.Wel.findParameter(params,'text');
				if (!property) throw "required parameter named 'property' not found in value parameter list";
				if (!value) throw "required parameter named 'value' not found in value parameter list";
				if (!text) text = value;
				if (!append)
				{
				    element.options.length = 0;
				}
				var ar = App.Wel.getEvaluatedValue(property,(scope)?scope.data:{});
				if (ar)
				{
				    for (var c=0;c<ar.length;c++)
				    {
				        if (row)
				        {
				            var rowData = App.Util.getNestedProperty(ar[c],row);
				        }
				        else
				        {
				            var rowData = ar[c];
				        }
				        if (rowData)
				        {
				            element.options[element.options.length] = new Option(App.Util.getNestedProperty(rowData, text), App.Util.getNestedProperty(rowData, value));
				        }
				    }
				}
               swiss(element).fire('revalidate')
				return;
			}
			case 'div':
			case 'span':
			case 'p':
			case 'a':
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'td':
			case 'code':
			case 'li':
			case 'blockquote':
			{
				variable = 'innerHTML';
				break;
			}
			case 'img':
			case 'iframe':
			{
				append=false;
				variable = 'src';
				break;
			}
			case 'form':
			{
				//Guarantee that the form will not auto-submit when someone hits enter by adding 1 display:none text field
				var new_input_id = id+'_no_submit';
				if (!swiss('#'+new_input_id).get(0)) 
				{
					var new_input = document.createElement('input');
					new_input.id = new_input_id;
					new_input.type = 'text';
					new_input.style.display = 'none';
					new_input.name = 'no_submit_guarantee';
					element.appendChild(new_input);
				}

				//Set form to true so we clear html var below -- we delegate to subsequent calls to handleCondition
				form = true;

				//e.g. value[bar]
				var elementAction = 'value['+key+']';

				//find the matching clause (in case the form has several actions in its on expression); e.g. r:foo
				var clause = this.findMatchingFormClause(element,elementAction);

				var descendants = swiss('#'+element.id + '> * ').results;
				for (var c = 0; c < descendants.length; c++)
				{
					var child = descendants[c];
					//need an id to handle the condition later and probably need one anyway so make sure it's there
					App.Compiler.getAndEnsureId(child);
					var child_parameter;
					var tag = App.Compiler.getTagname(child);
					switch(tag)
					{
						 case 'select':
						 case 'textarea':
						 case 'input':
						 {
							  child_parameter = child.getAttribute('name') || child.id || ''
							  break;
						 }
						 default:
						 {
							  /**
							   * We don't look for an id as the value to read out on normal elements since divs, spans, etc.
							   * may have ids for styling, etc. but we do not want to overwrite text for labels etc.
							   * For divs, spans, etc. we require the name attribute if they are to be populated with data
							   * without their own explicit on expression (that is when the on expression is on a form tag).
							   */
							   child_parameter = child.getAttribute('name') || '';
						 }
					}
					
					if (child_parameter)
					{
						var action = null;
						if (tag == 'select')
						{
							action = 'selectOption['+ key + '.' + child_parameter+']';
						}
						else
						{
							action = 'value['+ key + '.' + child_parameter+']';
	
						}
						App.Wel.handleCondition.call(this, [child,true,action,scope,null,null]);

					}
				}
				break;
			}
			default:
			{
				throw "syntax error: " + element.nodeName+' not supported for value action';
			}
		}

		if (!form)
		{
			if (append)
			{
			    var val = element[variable];
			    element[variable] = val + valueHtml + expression;
			}
			else
			{
				if (elementTagname == 'input' && element.type == 'checkbox')
				{
					element[variable] = valueHtml;
				}
				else
				{
				    element[variable] = valueHtml + expression;
				}

			}
			if (revalidate)
			{
			    swiss(element).fire('revalidate');
			}
		}
	},
	findMatchingFormClause: function(element, params)
	{
		//iterate over the clauses and find the appropriate clause to return
		//(the one with the appropriate action being handled by the cal for registerCustomAction('value'))
		var clauses = App.Wel.parseExpression(element.getAttribute('on'));

		for (var i = 0; i < clauses.length; i++)
		{
			var condition = clauses[i][2];
			if (condition == params)
			{
				return clauses[i];
			}
		}
		return [];
	}
});

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* history.js */

App.Wel.registerCustomAction('history',
{
	execute: function(id,action,params)
	{
		if (params && params.length > 0)
		{
			var obj = params[0];
			var key = obj.key;
			App.History.go(key);
		}
		else
		{
			throw "required parameter for history action";
		}	
	}
});

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* dom.js */

App.Wel.registerCustomCondition(

	function(element,condition,action,elseAction,delay,ifCond)
	{	
		switch (condition)
		{
			case 'click':
			case 'focus':
			case 'blur':
			case 'load':
			case 'unload':
			case 'select':
			case 'resize':
			case 'scroll':
			case 'submit':
			case 'dblclick':
			case 'mousedown':
			case 'mouseout':
			case 'mouseover':
			case 'mousemove':
			case 'mouseup':
			case 'change':
			case 'contextmenu':
			case 'mousewheel':
			{
				if (elseAction)
				{
					throw 'condition: '+ condition + ' does not support else';
					return false;
				}
				var actionFunc = App.Wel.makeConditionalAction(element.id,action,ifCond);
				
				// handle change specially 
				// default onchange only fires after focus
				// is lost, we want to fire immediately after change
				if (condition == 'change')
				{
					// get current value
					var value = App.Util.getElementValue(element)
					setInterval(function()
					{
						var currentValue = App.Util.getElementValue(element)
						if (currentValue != value)
						{
							value = currentValue;
							App.Wel.executeAfter(actionFunc,delay,{id:element.id});									
						}					
					},500);
				}
				else
				{
					swiss(element).on(condition,{}, function(e)
					{
						App.Wel.executeAfter(actionFunc,delay,{id:element.id});		
					});
				}
				App.Compiler.addTrash(element,function()
				{
					swiss(element).un(condition)
				})
				return true;
			}
		}
		return false;
	}
);


//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* key.js */

App.Wel.registerCustomCondition(

	function(element,condition,action,elseAction,delay,ifCond)
	{	
		// capture key event and args (if any)
		var keyEvent = condition;
		var i = condition.indexOf('[');
		var args = null;
		if (i > 0)
		{
		    args = condition.substring(i+1,condition.indexOf(']'));
		    keyEvent = condition.substring(0,i);
		}
		else
		{
			keyEvent = condition;
		}

		// ensure we support this condition
	   if (keyEvent.indexOf('keypress')==-1 && keyEvent.indexOf('keyup')==-1 && keyEvent.indexOf('keydown')==-1)
	    {
	        return false;
	    }
	
		// create function that will get executed
		// when main keyEvent condition is met
		// this function will further narrow the condition as defined
		var keyFunction = function(e)
		{
			// if args then process
	        if (args)
	        {
	            var mods = args.split('+');
	            var code = mods[mods.length-1];
	           	var key = e.keyCode;
				// first process the key code
				switch (code)
	            {
	                case 'enter':
	                {
	                    if (key != 13) return;
	                    break;
	                }
	                case 'esc':
	                {
	                    if (key != 27) return;
	                    break;
	                }
	                case 'left':
	                {
	                    if (key != 37) return;
	                    break;
	                }
	                case 'right':
	                {
	                    if (key != 39) return;
	                    break;
	                }
	                case 'up':
	                {
	                    if (key != 38) return;
	                    break;
	                }
	                case 'down':
	                {
	                    if (key != 40) return;
	                    break;
	                }
	                case 'tab':
	                {
	                    if (key != 9) return;
	                    break;
	                }
	                case 'delete':
	                {
	                    if (key != 46) return;
	                    break;
	                }
	                case 'backspace':
	                {
	                    if (key != 8) return;
	                    break;
	                }
	                default:
	                {
	                    if (key != code) return;
	                    break;
	                }
	            }
	
				// now process any special key combos (if present)
	            if (mods.length > 1)
	            {
	                for (var i=0; i<(mods.length-1); i++)
	                {
	                    var mod = mods[i];
	                    switch (mod)
	                    {
	                        case 'ctrl':
	                        {
	                            if (!e.ctrlKey) return;
	                            break;
	                        }
	                        case 'alt':
	                        {
	                            if (!e.altKey) return;
	                            break;
	                        }
	                        case 'shift':
	                        {
	                            if (!e.shiftKey) return;
	                            break;
	                        }
	                        case 'meta':
	                        {
	                            if (!e.metaKey) return;
	                            break;
	                        }
	                    }
	                }
	            }
	
	        }

			// no else action support
			if (elseAction)
			{
				throw 'condition: '+ condition + ' does not support else';
				return false;
			}

			// create action function (generic)
			var actionFunc = App.Wel.makeConditionalAction(element.id,action,ifCond);
			App.Wel.executeAfter(actionFunc,delay,{id:element.id});		
			
		};

		swiss(element).on(keyEvent,{},keyFunction);
		App.Compiler.addTrash(element,function()
		{
			swiss(element).un(keyEvent)
		})
		
		return true;
	}
);


//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* interactions.js */

App.Wel.registerCustomCondition(

	function(element,condition,action,elseAction,delay,ifCond)
	{	
		switch (condition)
		{
			case 'dragend':
			case 'dragstart':
			case 'dragover':
			case 'dropover':
			case 'dropout':
			case 'drag':
			case 'drop':
			case 'sortupdate':
			case 'sortchange':
			case 'sortstart':
			case 'sortend':
			case 'resizestart':
			case 'resizeend':
			case 'resize':
			case 'selected':
			case 'selecting':
			case 'unselected':
			case 'unselecting':
			case 'enabled':
			case 'disabled':
			case 'invalid':
			case 'valid':
			case 'hide':
			case 'show':
			{
				if (elseAction)
				{
					throw 'condition: '+ condition + ' does not support else';
					return false;
				}
				var actionFunc = App.Wel.makeConditionalAction(element.id,action,ifCond);
				swiss(element).on(condition,{}, function(e,ui)
				{
					App.Wel.executeAfter(actionFunc,delay,{id:element.id,event:e,ui:ui});		
				});
				App.Compiler.addTrash(element,function()
				{
					swiss(element).un(condition)
				})
				
				return true;
			}
		}
		return false;
	}
);


//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* statemachine.js */

App.Wel.registerCustomCondition(

	function(element,condition,action,elseAction,delay,ifCond)
	{	
		// parse condition
		var sm = null;
		var state = null;
		var i = condition.indexOf('[');

		if (i > 0)
		{
		    state = condition.substring(i+1,condition.indexOf(']'));
		    sm = condition.substring(0,i);
		}
		else
		{
			return false;
		}
		var currentSM = null;
		
		// find statemachine
		for (var i=0;i<App.Wel.StateMachine.active.length;i++)
		{			
			// if same, then fire state change
			if (App.Wel.StateMachine.active[i].name == sm)
			{
				currentSM = App.Wel.StateMachine.active[i];
				break;
			}
		}
		if (currentSM == null)
		{
			return false;
		}

		var actionFunc = App.Wel.makeConditionalAction(element.id,action,ifCond);
		var elseActionFunc = (elseAction != null)?App.Wel.makeConditionalAction(element.id,elseAction,ifCond):null;
		
		// fire action is initial state is set
		if (currentSM.activeState == state)
		{
			App.Wel.executeAfter(actionFunc,delay,{id:element.id,statemachine:this});		
		}
		else if (elseActionFunc != null)
		{
			App.Wel.executeAfter(elseActionFunc,delay,{id:element.id,statemachine:this})
		}
		
		// add state change listener
		currentSM.addListener(function()
		{
			if (state == this.activeState)
			{
				App.Wel.executeAfter(actionFunc,delay,{id:element.id,statemachine:this});		
			}
			else if (elseActionFunc != null)
			{
				App.Wel.executeAfter(elseActionFunc,delay,{id:element.id,statemachine:this})
			}
			
		});

		return true;

	}
);


//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* message.js */

if (App && App.mq)
{
	//
	// this is a custom condition for handling executing actions based on a message condition
	//
	App.Wel.registerCustomCondition(function(element,condition,action,elseAction,delay,ifCond)
	{
		if (condition.startsWith('local:') ||
		       condition.startsWith('l:') || 
		       condition.startsWith('remote:') ||
		       condition.startsWith('r:') ||
			   condition.startsWith('both:') ||
			   condition.startsWith('*:') )
		{
			var id = element.id;
			var actionParams = App.Wel.parameterRE.exec(condition);
			var type = (actionParams ? actionParams[1] : condition);
			var params = actionParams ? actionParams[2] : null;
			var actionFunc = App.Wel.makeConditionalAction(id,action,ifCond);
			var elseActionFunc = (elseAction ? App.Wel.makeConditionalAction(id,elseAction,null) : null);
			
			return App.Wel.MessageAction.makeMBListener(element,type,actionFunc,params,delay,elseActionFunc);
			
		}
		return false;
	});

	App.Wel.MessageAction = {};

	App.Wel.MessageAction.makeMBListener = function(element,type,action,params,delay,elseaction)
	{
		var actionParams = params ? App.Wel.getParameters(params,false) : null;
		var i = actionParams ? type.indexOf('[') : 0;
		if (i>0)
		{
			type = type.substring(0,i);
		}
		if (type.indexOf(':~') == 1)
		{
			var parts = type.split('~',2);
			var msg = parts[0]+parts[1]
			type = new RegExp(msg);
		}
		
		$MQL(type,function(msg)
		{
			if (swiss('#'+element.id).get(0))
				App.Wel.MessageAction.onMessage(element,msg.name,msg.payload,actionParams,action,delay,elseaction);
		},element.scope,element);

		return true;
	};

	App.Wel.MessageAction.onMessage = function(element,type,data,actionParamsStr,action,delay,elseaction)
	{
		var ok = App.Wel.parseConditionCondition(actionParamsStr, data);
		var obj = {id:element.id,type:type,data:data};
		if (ok)
		{
			App.Wel.executeAfter(action,delay,obj);
		}
		else if (elseaction)
		{
			App.Wel.executeAfter(elseaction,delay,obj);
		}
	};

	
}

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* history.js */

App.Wel.registerCustomCondition(
	function(element,condition,action,elseAction,delay,ifCond)
	{
	    if (!condition.startsWith('history:') && !condition.startsWith('history['))
		{
			return false;
		}

	    var token = null;

	    if (condition.startsWith('history:'))
	    {
	        token = condition.substring(8);
	    }
    
	    if (condition.startsWith('history['))
	    {
	        token = condition.substring(8,condition.indexOf(']'));
	    }

		// allow token to be empty string which is essentially wildcard
	    token = token || '';

		var id = element.id;
		var actionFunc = App.Wel.makeConditionalAction(id,action,ifCond);
		var elseActionFunc = elseAction ? App.Wel.makeConditionalAction(id,elseAction,null) : null;
		var operator = '==';

		if (token.charAt(0)=='!')
		{
			token = token.substring(1);
			operator = '!=';
		}
		else if (token == '*')
		{
		    operator = '*';
		}
	
		// support a null (no history) history
		token = token.length == 0 || token=='_none_' || token==='null' ? null : token;
	
		App.History.onChange(function(newLocation,data,scope)
		{
			switch (operator)
			{
				case '==':
				{
					if (newLocation == token)
					{
						App.Wel.executeAfter(actionFunc,delay,{data:data});
					}
					else if (elseActionFunc)
					{
						App.Wel.executeAfter(elseActionFunc,delay,{data:data});
					}
					break;
				}
				case '!=':
				{
					if (newLocation != token)
					{
						App.Wel.executeAfter(actionFunc,delay,{data:data});
					}
					else if (elseActionFunc)
					{
						App.Wel.executeAfter(elseActionFunc,delay,{data:data});
					}
					break;
				}
				case '*':
				{
				    if (newLocation)
				    {
						App.Wel.executeAfter(actionFunc,delay,{data:data});
				    }
					break;
				}
			}
		});
		return true;
	}
);




//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* on.js */

App.Compiler.registerAttributeProcessor('*','on',
{
	handle: function(element,attribute,value)
	{
		if (value)
		{
			if (element.getAttribute('control') !=null ||
			    element.getAttribute('behavior') !=null ||
			    element.getAttribute('layout') !=null||
			    element.getAttribute('theme') !=null)
			{
				// set calls parse after its done, let it win
				return;
			}
			App.Wel.parseOnAttribute(element);
		}
	}
});
//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* validator.js */

(function(){

	App.Validator = 
	{
	    toString: function ()
	    {
	        return '[App.Validator]';
	    },

	    uniqueId: 0,
		names: [],

		addValidator: function(name, validator)
		{
			App.Validator[name] = validator;
			App.Validator.names.push(name);
		},

		URI_REGEX: /^((([hH][tT][tT][pP][sS]?|[fF][tT][pP])\:\/\/)?([\w\.\-]+(\:[\w\.\&%\$\-]+)*@)?((([^\s\(\)\<\>\\\"\.\[\]\,@;:]+)(\.[^\s\(\)\<\>\\\"\.\[\]\,@;:]+)*(\.[a-zA-Z]{2,4}))|((([01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}([01]?\d{1,2}|2[0-4]\d|25[0-5])))(\b\:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)\b)?((\/[^\/][\w\.\,\?\'\\\/\+&%\$#\=~_\-@]*)*[^\.\,\?\"\'\(\)\[\]!;<>{}\s\x7F-\xFF])?)$/,
	    ALPHANUM_REGEX: /^[0-9a-zA-Z]+$/,
	    DECIMAL_REGEX: /^[-]?([1-9]{1}[0-9]{0,}(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|\.[0-9]{1,2})$/,
	 	EMAIL_REGEX: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
		PHONE_REGEX: /^(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}(?:\-?|\ ?))[2-9]\d{2}[- ]?\d{4}$/,
		SSN_REGEX: /(^|\s)(00[1-9]|0[1-9]0|0[1-9][1-9]|[1-6]\d{2}|7[0-6]\d|77[0-2])(-?|[\. ])([1-9]0|0[1-9]|[1-9][1-9])\3(\d{3}[1-9]|[1-9]\d{3}|\d[1-9]\d{2}|\d{2}[1-9]\d)($|\s|[;:,!\.\?])/,

		//
		// DATE VALIDATION UTILS
		//
		dtCh:"/",
		minYear:1000,
		maxYear:3000,
		stripCharsInBag: function(s, bag)
		{
			var i;
		    var returnString = "";
		    for (i = 0; i < s.length; i++)
			{   
		        var c = s.charAt(i);
		        if (bag.indexOf(c) == -1) returnString += c;
		    }
		    return returnString;
		},
		daysInFebruary: function (year)
		{
		    return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
		},
	 	DaysArray: function(n) 
		{
			for (var i = 1; i <= n; i++) 
			{
				this[i] = 31
				if (i==4 || i==6 || i==9 || i==11) {this[i] = 30}
				if (i==2) {this[i] = 29}
		   } 
		   return this;
		}

	};

	
	var addValidator = App.Validator.addValidator;
	
    addValidator('required', function(value)
    {
       if (null == value)
        {
            return false;
        }
        if (typeof(value) == 'boolean')
        {
            return value;
        }
		value = ''+value;
        return value.trim().length > 0;
    });

	addValidator('email_optional', function(value)
	{
		if (!value || value.trim().length == 0) return true;
		return App.Validator.EMAIL_REGEX.test(value);		
	});

    addValidator('email', function(value)
    {
        return App.Validator.EMAIL_REGEX.test(value);
    });

    addValidator('zipcode_5', function(value)
    {
		return (value.length == 5 && App.Validator.number(value)==true)?true:false
    });

    addValidator('zipcode_5_optional', function(value)
    {
	 	if (!value || value.trim().length == 0) return true;
        return App.Validator.zipcode_5(value);
    });

    addValidator('ssn', function(value)
    {
        return App.Validator.SSN_REGEX.test(value);
    });
    addValidator('ssn_optional', function(value)
    {
	 	if (!value || value.trim().length == 0) return true;
        return App.Validator.ssn(value);
    });

    addValidator('phone_us', function(value)
    {
        return App.Validator.PHONE_REGEX.test(value);
    });

    addValidator('phone_us_optional', function(value)
    {
	 	if (!value || value.trim().length == 0) return true;
        return App.Validator.phone_us(value);
    });

    addValidator('fullname_optional', function(value)
    {
        if (!value || value.trim().length == 0) return true;
        return App.Validator.fullname(value);
    });

    addValidator('fullname', function(value)
    {
        // allow Jeffrey George Haynie or Jeff Haynie or Jeff Smith, Jr.
        return ((value.split(" ")).length > 1);
    });

    addValidator('noSpaces_optional', function(value)
    {
       if (!value) return true;
       return App.Validator.noSpaces(value);
    });

    addValidator('noSpaces', function(value)
    {
        // also must have a value
        // check before we check for spaces
        if (!App.Validator.required(value))
        {
            return false;
        }
        return value.indexOf(' ') == -1;
    });
 
    addValidator('password_optional', function (value)
    {
	   if (!value || value.trim().length == 0) return true;
       return App.Validator.password(value);
    });

    addValidator('password', function (value)
    {
        return (value.length >= 6);
    });

    addValidator('number', function (value)
    {
		if (!value || value.trim().length == 0 || value < 0)return false;
		return App.Validator.DECIMAL_REGEX.test(value);
		
	});

    addValidator('number_optional', function (value)
    {
		if (!value || value.trim().length == 0) return true;
		return App.Validator.number(value);
	});

    addValidator('wholenumber_optional', function (value)
    {
		if (!value || value.trim().length == 0) return true;
		return App.Validator.wholenumber(value);
	});
		
    addValidator('wholenumber', function (value)
    {
		if (!value || value < 0) return false;
		
		for (var i = 0; i < value.length; i++)
		{   
			var c = value.charAt(i);
		    if (((c < "0") || (c > "9"))) return false;
		}
		return true;
    });

    addValidator('url_optional', function (value)
    {
		if (!value || value.trim().length == 0)return true;
        return App.Validator.url(value);
    });

    addValidator('url', function (value)
    {
      	return App.Validator.URI_REGEX.test(value);
    });

    addValidator('checked', function (value)
    {
        return value;
    });

    addValidator('length', function (value, element)
    {
        if (value)
        {
            try
            {
                var min = parseInt(element.getAttribute('validatorMinLength') || '1');
                var max = parseInt(element.getAttribute('validatorMaxLength') || '999999');
                var v = value.length;
                return v >= min && v <= max;
            }
            catch (e)
            {
            }
        }
        return false;
    });
    
    addValidator('alphanumeric_optional', function (value,element)
    {
    	if (!value || value.trim().length ==0)return true;
		return App.Validator.ALPHANUM_REGEX.test(value)==true;
    });
	
    addValidator('alphanumeric', function (value,element)
    {
    	return App.Validator.ALPHANUM_REGEX.test(value)==true;
    });

	addValidator('date_optional', function(value)
	{
		if (!value || value.trim().length == 0)return true;
		return App.Validator.date(value);
		
	});
	
	addValidator('date', function(value)
	{
		
		var daysInMonth = App.Validator.DaysArray(12);
		var pos1=value.indexOf(App.Validator.dtCh);
		var pos2=value.indexOf(App.Validator.dtCh,pos1+1);
		var strMonth=value.substring(0,pos1);
		var strDay=value.substring(pos1+1,pos2);
		var strYear=value.substring(pos2+1);
		strYr=strYear;
		if (strDay.charAt(0)=="0" && strDay.length>1) 
			strDay=strDay.substring(1);
		if (strMonth.charAt(0)=="0" && strMonth.length>1) 
			strMonth=strMonth.substring(1);
		for (var i = 1; i <= 3; i++) 
		{
			if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1);
		}
		month=parseInt(strMonth);
		day=parseInt(strDay);
		year=parseInt(strYr);
		if (pos1==-1 || pos2==-1)
		{
			return false;
		}
		if (strMonth.length<1 || month<1 || month>12)
		{
			return false;
		}
		if (strDay.length<1 || day<1 || day>31 || (month==2 && day>App.Validator.daysInFebruary(year)) || day > daysInMonth[month])
		{
			return false;
		}
		if (strYear.length != 4 || year==0 || year<App.Validator.minYear || year>App.Validator.maxYear)
		{
			return false;
		}
		var numberTest = month + "/" + day + "/" + year;
		if (value.indexOf(App.dtCh,pos2+1)!=-1 || App.Validator.number(App.Validator.stripCharsInBag(numberTest, App.Validator.dtCh))==false)
		{
			return false;
		}
		return true;
	});
})();


//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* decorator.js */


(function(){
	
	App.Decorator = 
	{
	    toString: function ()
	    {
	        return '[App.Decorator]';
	    },

	    decoratorId: 0,
	    names: [],

		addDecorator: function(name, decorator)
		{
			App.Decorator[name] = decorator;
			App.Decorator.names.push(name);
		},

	    checkInvalid: function (element, valid, decId, msg, showValid)
	    {
	    	var cssValue = (valid)?'hidden':'visible';
	
			// show specified decorator ID
	    	if (decId != null)
	        {	
	 			swiss('#'+decId).css('visibility',cssValue);
	        }
			// build our own
	        else
	        {
	            var id = 'decorator_' + element.id;
	            var errorMsg = swiss('#'+id).get(0);
	            if (errorMsg == null)
	            {
					errorMsg = '<span id="'+id+'" style="color:#ff0000;margin-left:5px;margin-right:5px"></span>';
					swiss('#'+element.id).insertHTMLAfter(errorMsg)
					errorMsg = swiss('#'+id).get(0)
	            }
	            if (valid == false)
	            {
	                 errorMsg.innerHTML = '<span>' + msg + '</span>';
	            }
				swiss('#'+id).css('visibility',cssValue);

	        }
	    }	
	};

	var addDecorator = App.Decorator.addDecorator;
	
	addDecorator('defaultDecorator', function(element, valid)
	{
		// do nothing
	});
	
	addDecorator('custom', function(element, valid, decId)
	{
		if (!decId)
		{
			throw "invalid custom decorator, decoratorId attribute must be specified";
		}
		var dec = swiss('#'+decId).get(0);
		if (!dec)
		{
			throw "invalid custom decorator, decorator with ID: "+decId+" not found";
		}
		if (!valid)
		{
			if (dec.style.display=='none')
			{
				dec.style.display='block';
			}
			if (dec.style.visibility=='hidden' || dec.style.visibility == '')
			{
				dec.style.visibility='visible';
			}
		}
		else
		{
			if (dec.style.display!='none')
			{
				dec.style.display='none';
			}
			if (dec.style.visibility!='hidden')
			{
				dec.style.visibility='hidden';
			}
		}
	});
	
  
    addDecorator('required', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'required');
    });

    addDecorator('zipcode_5', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, '5 digit zipcode required');
    });
    addDecorator('phone_us', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, '10 digit phone number required (###-###-####)');
    });
    addDecorator('ssn', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, '9 digit ssn required (###-##-####)');
    });

    addDecorator('email', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'enter a valid email address');
    });
	addDecorator('date', function(element, valid, decId)
	{
       this.checkInvalid(element, valid, decId, 'invalid date');	
	});
	addDecorator('number', function(element, valid, decId)
	{
       this.checkInvalid(element, valid, decId, 'invalid number');			
	});
    addDecorator('fullname', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'enter first and last name');
    });

	addDecorator('alphanumeric', function(element,valid,decId)
	{
        this.checkInvalid(element, valid, decId, 'enter an alphanumeric value');
	});

    addDecorator('noSpaces', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'value must contain no spaces');
    });

    addDecorator('password', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'password must be at least 6 characters');
    });

    addDecorator('url', function (element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'enter a valid URL');
    });

   	addDecorator('checked', function (element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'item must be checked');
    });

  	addDecorator('wholenumber', function (element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'enter a whole number');
    });

    addDecorator('length', function (element, valid, decId)
    {
        if (!valid)
        {
            var min = element.getAttribute('validatorMinLength') || '0';
            var max = element.getAttribute('validatorMaxLength') || '999999';
            this.checkInvalid(element, valid, decId, 'value must be between ' + min + '-' + max + ' characters');
        }
        else
        {
            this.checkInvalid(element, valid, decId, element.value.length + ' characters', true);
        }
    });
})();

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* validator.js */

// 
// register our input fields listener
// 
App.Compiler.registerAttributeProcessor(['textarea','input','select'],'validator',
{
	handle: function(element,attribute,value)
	{
		if (value && element.getAttribute('type')!='button')
		{
			// get the validator
			var validatorFunc = App.Validator[value];
			if (!validatorFunc)
			{
				throw "syntax error: validator specified is not registered: "+value;
			}
			var value = App.Util.getElementValue(element,true,true);
			element.validatorValid = validatorFunc(value, element) || false;
			
			// get the decorator
			var decoratorValue = element.getAttribute('decorator');
			var decorator = null, decoratorId = null;
			if (decoratorValue)
			{
				decorator = App.Decorator[decoratorValue];
				if (!decorator)
				{
					throw "syntax error: decorator specified is not registered: "+decoratorValue;
				}
				decoratorId = decorator ? element.getAttribute('decoratorId') : null;
			}
						
			var timer = null;
			var keystrokeCount = 0;
			var timerFunc = function()
			{
				swiss('#'+element.id).fire('revalidate')
			};

			// strart timer on click - but call only once
			swiss('#'+element.id).on('click', {}, function()
			{
				timerFunc();
			});
			
			// strart timer on focus
			swiss('#'+element.id).on('focus', {}, function()
			{
				timer = setInterval(timerFunc,100);
			});
			
			// cancel timers on blur
			swiss('#'+element.id).on('blur', {}, function()
			{
				if (timer)
				{
					clearInterval(timer);
					timer=null;
				}
			})
			
			// handler revalation
			swiss('#'+element.id).on('revalidate',{},function()
			{
				var value = App.Util.getElementValue(element,true,true);
				var valid = validatorFunc(value, element);
				element.validatorValid = valid;				
				var event = (valid==true)?'valid':'invalid';
				swiss('#'+element.id).fire(event);
				
				if (decorator)
				{
					decorator.apply(App.Decorator,[element,element.validatorValid,decoratorId]);
				}
				
			});
						
			swiss('#'+element.id).fire('revalidate')
		}
	}
});

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* activators.js */

// 
// register our input button listener for handling
// activators
// 
App.Compiler.registerAttributeProcessor(['div','input','button'],'activators',
{
	handle: function(element,attribute,value)
	{
		var fieldset = element.getAttribute('fieldset');
		if (fieldset)
		{
			// do initial check
			var fields = swiss('*[fieldset='+fieldset+']').results; 
			var initialState = false;
			for (var i=0;i<fields.length;i++)
			{
				// if validator is invalid, disabled element
				if (fields[i].validatorValid == false)
				{
					initialState = true;
				}
				
				// if element has a validator, setup a revalidate listener
				if (fields[i].validatorValid != undefined)
				{
					swiss('#'+fields[i].id).on('revalidate',function()
					{
						var disabled = false;
						for (var j=0;j<fields.length;j++)
						{
							if (fields[j].validatorValid == false)
							{
								disabled = true;
								break;
							}
						}
						if (disabled==true)
						{
							element.setAttribute('disabled','true');
						}
						else
						{
							element.removeAttribute('disabled');
						}
						var event = (disabled == true)?'disabled':'enabled';
						swiss('#'+element.id).fire(event);
					});
				}
			}
			var initialEvent = (initialState == true)?'disabled':'enabled';
			//element.disabled = initialState;
			if (initialState ==true)
			{
				element.setAttribute('disabled','true');
			}
			else
			{
				element.removeAttribute('disabled');
			}
			swiss('#'+element.id).fire(initialEvent);
		}
	}
});
//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* fieldset.js */

App.fieldSets = {};
App.addFieldSet = function(element,excludeSelf,fieldsetName)
{
	excludeSelf = (excludeSelf==null) ? false : excludeSelf;
	fieldsetName = fieldsetName || element.getAttribute('fieldset');
	if (fieldsetName)
	{
		var fieldset = App.fieldSets[fieldsetName];
		if (!fieldset)
		{
			fieldset=[];
			App.fieldSets[fieldsetName] = fieldset;
		}
		if (false == excludeSelf)
		{
			fieldset.push(element.id);
		}
		return fieldset;
	}
	return null;
};

App.removeFieldSet = function(element)
{
	var fieldsetName = element.getAttribute('fieldset');
	if (fieldsetName)
	{
		var fieldset = App.fieldSets[fieldsetName];
		if (fieldset)
		{
			fieldset.remove(element.id);
		}
	}
};
App.fetchFieldset = function(fieldset, localMode, data) 
{
	if(!data) 
	{
        data = {};
    }
    
    var fields = App.fieldSets[fieldset];
	if (fields && fields.length > 0)
	{
		for (var c=0,len=fields.length;c<len;c++)
		{
			var fieldid = fields[c];
			var field = swiss('#'+fieldid).get(0);
			var name = field.getAttribute('name') || fieldid;
            
            // don't overwrite other values in the payload
			if (data[name] == null)
			{
				// special case type field we only want to add
				// the value if it's checked
				if (field.type == 'radio' && !field.checked)
				{
					continue;
				}
				var newvalue = App.Util.getElementValue(field,true,localMode);
				var valuetype = typeof(newvalue);
				if (newvalue != null && (valuetype=='object' || newvalue.length > 0 || valuetype=='boolean'))
				{
					data[name] = newvalue;
				}
				else
				{
					data[name] = '';
				}
			}
			else
			{
			    if(field.type != 'radio')
			    {
			        App.Util.Logger.warn('fieldset value for "'+name+'" ignored because it conflicts with existing data payload value');
		        }
			}
		}
	}
	return data;
};

App.Compiler.registerAttributeProcessor('*','fieldset',
{
	handle: function(element,attribute,value)
	{
		if (value && element.getAttribute('type')!='button')
		{
			App.addFieldSet(element,false);

			// Appcelerator.Compiler.addTrash(element, function()
			// {
			//     Appcelerator.Compiler.removeFieldSet(element);
			// });
		}
	}
});

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* uri.js */

/*!
 ******************************************************************************
  uri_funcs.js - URI functions based on STD 66 / RFC 3986

  Author (original): Mike J. Brown <mike at skew.org>
  Version: 2007-01-04

  License: Unrestricted use and distribution with any modifications permitted,
  so long as:
  1. Modifications are attributed to their author(s);
  2. The original author remains credited;
  3. Additions derived from other code libraries are credited to their sources
  and used under the terms of their licenses.

*******************************************************************************/

/** 
 * slight modifications by Jeff Haynie of Appcelerator
 */

var absoluteUriRefRegex = /^[A-Z][0-9A-Z+\-\.]*:/i;
var splitUriRefRegex = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/;
var reMissingGroupSupport = (typeof "".match(/(a)?/)[1] != "string");

App.URI = {}

/**
 * This function determines whether the given URI reference is absolute
 * (has a scheme).
 */
App.URI.isAbsolute = function(uriRef) 
{
	return absoluteUriRefRegex.test(uriRef);
};

/*
splitUriRef(uriRef)

This function splits a URI reference into an Array of its principal components,
[scheme, authority, path, query, fragment] as per STD 66 / RFC 3986 appendix B.
*/

App.URI.splitUriRef = function(uriRef) 
{
	var parts = uriRef.match(splitUriRefRegex);
	parts.shift();
	var scheme=parts[1], auth=parts[3], path=parts[4], query=parts[6], frag=parts[8];
	if (!reMissingGroupSupport) {
		var undef;
		if (parts[0] == "") scheme = undef;
		if (parts[2] == "") auth = undef;
		if (parts[5] == "") query = undef;
		if (parts[7] == "") frag = undef;
	}
	parts = [scheme, auth, this.uriPathRemoveDotSegments(path), query, frag];
	return parts;
};

/*
unsplitUriRef(uriRefSeq)

This function, given an Array as would be produced by splitUriRef(),
assembles and returns a URI reference as a string.
*/
App.URI.unsplitUriRef=function(uriRefSeq) 
{
    var uriRef = "";
    if (typeof uriRefSeq[0] != "undefined") uriRef += uriRefSeq[0] + ":";
    if (typeof uriRefSeq[1] != "undefined") uriRef += "//" + uriRefSeq[1];
    uriRef += uriRefSeq[2];
    if (typeof uriRefSeq[3] != "undefined") uriRef += "?" + uriRefSeq[3];
    if (typeof uriRefSeq[4] != "undefined") uriRef += "#" + uriRefSeq[4];
    return uriRef;
}

/*
uriPathRemoveDotSegments(path)

This function supports absolutizeURI() by implementing the remove_dot_segments
function described in RFC 3986 sec. 5.2.  It collapses most of the '.' and '..'
segments out of a path without eliminating empty segments. It is intended
to be used during the path merging process and may not give expected
results when used independently.

Based on code from 4Suite XML:
http://cvs.4suite.org/viewcvs/4Suite/Ft/Lib/Uri.py?view=markup
*/
App.URI.uriPathRemoveDotSegments = function (path) 
{
	// return empty string if entire path is just "." or ".."
	if (path == "." || path == "..") {
		return "";
	}
	// remove all "./" or "../" segments at the beginning
	while (path) {
		if (path.substring(0,2) == "./") {
			path = path.substring(2);
		} else if (path.substring(0,3) == "../") {
			path = path.substring(3);
		} else if (path.substring(0,2)=="//") {
		   path = path.substring(1);
		} else {
			break;
		}
	}
	// We need to keep track of whether there was a leading slash,
	// because we're going to drop it in order to prevent our list of
	// segments from having an ambiguous empty first item when we call
	// split().
	var leading_slash = false;
	if (path.charAt(0) == "/") {
		path = path.substring(1);
		if (path.charAt(0)=='/')
		{
			path = path.substring(1);
		}
		leading_slash = true;
	}
	// replace a trailing "/." with just "/"
	if (path.substring(path.length - 2) == "/.") {
		path = path.substring(0, path.length - 1);
	}
	// convert the segments into a list and process each segment in
	// order from left to right.
	var segments = path.split("/");
	var keepers = [];
	segments = segments.reverse();
	while (segments.length) {
		var seg = segments.pop();
		// '..' means drop the previous kept segment, if any.
		// If none, and if the path is relative, then keep the '..'.
		// If the '..' was the last segment, ensure
		// that the result ends with '/'.
		if (seg == "..") {
			if (keepers.length) {
				keepers.pop();
			} else if (! leading_slash) {
				keepers.push(seg);
			}
			if (! segments.length) {
				keepers.push("");
			}
		// ignore '.' segments and keep all others, even empty ones
		} else if (seg != ".") {
			keepers.push(seg);
		}
	}
	// reassemble the kept segments
	return (leading_slash && "/" || "") + keepers.join("/");
}

/*
absolutizeURI(uriRef, baseUri)

This function resolves a URI reference to absolute form as per section 5 of
STD 66 / RFC 3986. The URI reference is considered to be relative to the
given base App.URI.

It is the caller's responsibility to ensure that the base URI matches
the absolute-URI syntax rule of RFC 3986, and that its path component
does not contain '.' or '..' segments if the scheme is hierarchical.
Unexpected results may occur otherwise.

Based on code from 4Suite XML:
http://cvs.4suite.org/viewcvs/4Suite/Ft/Lib/Uri.py?view=markup
*/
App.URI.absolutizeURI = function(uriRef, baseUri)
{
	// Ensure base URI is absolute
	if (! baseUri || ! App.URI.isAbsolute(baseUri)) {
		 throw Error("baseUri '" + baseUri + "' is not absolute");
	}
	// shortcut for the simplest same-document reference cases
	if (uriRef == "" || uriRef.charAt(0) == "#") {
		return baseUri.split('#')[0] + uriRef;
	}
	var tScheme, tAuth, tPath, tQuery;
	// parse the reference into its components
	var parts = App.URI.splitUriRef(uriRef);
	var rScheme=parts[0], rAuth=parts[1], rPath=parts[2], rQuery=parts[3], rFrag=parts[4];
	// if the reference is absolute, eliminate '.' and '..' path segments
	// and skip to the end
	if (typeof rScheme != "undefined") {
		var tScheme = rScheme;
		var tAuth = rAuth;
		var tPath = App.URI.uriPathRemoveDotSegments(rPath);
		var tQuery = rQuery;
	} else {
		// the base URI's scheme, and possibly more, will be inherited
		parts = App.URI.splitUriRef(baseUri);
		var bScheme=parts[0], bAuth=parts[1], bPath=parts[2], bQuery=parts[3], bFrag=parts[4];
		// if the reference is a net-path, just eliminate '.' and '..' path
		// segments; no other changes needed.
		if (typeof rAuth != "undefined") {
			tAuth = rAuth;
			tPath = App.URI.uriPathRemoveDotSegments(rPath);
			tQuery = rQuery;
		// if it's not a net-path, we need to inherit pieces of the base URI
		} else {
			// use base URI's path if the reference's path is empty
			if (! rPath) {
				tPath = bPath;
				// use the reference's query, if any, or else the base URI's,
				tQuery = (typeof rQuery != "undefined" && rQuery || bQuery);
			// the reference's path is not empty
			} else {
				// just use the reference's path if it's absolute
				if (rPath.charAt(0) == "/") {
					tPath = App.URI.uriPathRemoveDotSegments(rPath);
				// merge the reference's relative path with the base URI's path
				} else {
					if (typeof bAuth != "undefined" && ! bPath) {
						tPath = "/" + rPath;
					} else {
						tPath = bPath.substring(0, bPath.lastIndexOf("/") + 1) + rPath;
					}
					tPath = App.URI.uriPathRemoveDotSegments(tPath);
				}
				// use the reference's query
				tQuery = rQuery;
			}
			// since the reference isn't a net-path,
			// use the authority from the base URI
			tAuth = bAuth;
		}
		// inherit the scheme from the base URI
		tScheme = bScheme;
	}
	// always use the reference's fragment (but no need to define another var)
	//tFrag = rFrag;
	// now compose the target URI (RFC 3986 sec. 5.3)
	var result = App.URI.unsplitUriRef([tScheme, tAuth, tPath, tQuery, rFrag]);
	return result;
};
//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* api.js */

var App = (typeof App == "undefined")?{}:App;
App.UI = {};
App.UI.elementMap = {};
App.UI.UIListeners = [];


//
// Get an instance of a control that is already
// declared
//
App.getControl = function(id,type,callback)
{
	if (App.UI.elementMap[id + "_control_" + type])
	{
		callback.apply(App.UI.elementMap[id + "_control_" + type].inst)
	}
	else
	{
		App.registerListener(id,'control', type, 'afterBuild', function()
		{
			if (App.UI.elementMap[id + "_control_" + type])
			{
				callback.apply(App.UI.elementMap[id + "_control_" + type].inst)
			}
		});
	}
};

//
// Get an instance of a behavior that is already
// declared
//
App.getBehavior = function(id,type,callback)
{
	if (App.UI.elementMap[id + "_behavior_" + type])
	{
		callback.apply(App.UI.elementMap[id + "_behavior_" + type].inst)
	}
	else
	{
		App.registerListener(id, 'behavior', type, 'afterBuild', function(scope)
		{
			if (App.UI.elementMap[id + "_behavior_" + type])
			{
				callback.apply(App.UI.elementMap[id + "_behavior_" + type].inst)
			}
		});
	}
};


//
// jQuery plugins for creating controls 
//
if (jQuery)
{
	(function()
	{
		jQuery.fn.createControl = function(type,args,callback)
		{
			return this.each(function()
			{
				App.loadUIManager('control',type,this,args||{},true,callback);
			})
		}
	})(jQuery);

	(function()
	{
		jQuery.fn.addBehavior = function(type,args,callback)
		{
			return this.each(function()
			{
				App.loadUIManager('behavior',type,this,args||{},true,callback);
			})
		}
	})(jQuery);

}

//
//  Create a control - regular syntax
//
App.createControl = function (id,type, args, callback)
{
	if (id && id.indexOf('#') == -1)
	{
		id = '#'+id;
	}
	var el = swiss(id).get(0);
	App.loadUIManager('control',type,el,args||{},true,callback);	
};

//
//  Add a behavior - regular syntax
//
App.addBehavior = function (id,type, args, callback)
{
	if (id && id.indexOf('#') == -1)
	{
		id = '#'+id;
	}
	var el = swiss(id).get(0);
	App.loadUIManager('behavior',type,el,args||{},true,callback);	
};

//
//  Register UI Event Listeners
//
App.registerListener = function(id,type,name,event,callback)
{
	var f = function()
	{
		if (this.name == name || name == '*')
		{
			if ((this.event == event || event == '*') && (this.type == type) && (this.data.element.id == id)) 
			{
				var scope = this.data || {};
				scope.id = this.id;
				scope.type = this.type;
				scope.name = this.name;
				scope.event = this.event;
				callback.call(scope);
			}
		}
	};
	App.UI.UIListeners.push(f);
};

//
// Get a named value from an action
// event or API call
//
App.getActionValue = function(obj,name,def)
{
	// Value Hierarchy
	// 1. action value - i.e., obj = value
	// 2. action value - i.e. obj.param.value (no name is specified but there is something in the action 'l:foo then title[foo]')
	// 2. action value via param - i.e., obj.param[name]
	// 3. message value via param - i.e., obj.scope.data[name]
	// 4. default
	
	// first see if just a value is present
	if (typeof(obj) === 'string' || typeof(obj) === 'number' || typeof(obj) === 'bool')
	{
		return obj;
	}
	
	// next look for param in action 
	// or named param in action
	if (obj && obj.params)
	{
		if (typeof(obj.params)=='object')
		{
			for (var i=0;i<obj.params.length;i++)
			{
				if (obj.params[i].key == name || !name || obj.params.length == 1)
				{
					return obj.params[i].value
				}
			}
		}
	}

	// next look for data in message unless name is not specified
	if (!name)
	{
		return def;
	}

	if (typeof(obj) === 'object' && name && !obj.scope)
	{
		return App.Util.getNestedProperty(obj,name,def)
	}
	if (obj && obj.scope)
	{
		return App.Util.getNestedProperty(obj.scope.data, name, def)
	}
};



//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* core.js */

App.UI.UIManager = {managers:{}};
App.UI.UIComponents = {};
App.UI.fetching = {};
App.UI.componentRoot = '/components/';
App.UI.commonRoot = '/common/';

App.TableModel = function(data)
{
	this.data = data;
	
	this.getRowCount = function()
	{
		return this.data ? this.data.length : 0;
	},
	this.getRow = function(idx)
	{
		return (this.data ? this.data[idx] : null);
	}

};
(function()
{
	App.TreeModel = function(data)
	{
		this.data = {};
		this.rootNodes = [];

		this.isLeaf = function(id)
		{
			return (this.getChildCount(id) == 0);
		};
		this.getRootNodes = function()
		{
			return this.rootNodes;
		};
		this.getChildCount = function(id)
		{
			return (this.data[id] && this.data[id].children)?this.data[id].children.length:0;
		};
		this.getChildren = function(id)
		{
			return (this.data[id] && this.data[id].children)?this.data[id].children:[];
		};
		this.getParentId = function(id)
		{
			var d= this.data[id];
			var p = (d)?d['parent']:null;
			return p;
		};
		this.addNode = function(parentId,node)
		{
			// if we already have it, return
			if (this.data[node.id])return false;
			
			// add to stack
			this.data[node.id] = node;
			
			if (parentId == null)
			{
				this.rootNodes.push(node);
			}
			else
			{
				this.data[node.id]['parent']=parentId;

				var parent = this.data[parentId];

				if (!parent)return false;

				// add to parent

				// first child
				if (!parent.children.length)
				{
					parent.children = [];
					parent.children[0] = node;
				}
				else
				{
					// do we already have this child
					var childExists = false;
					for (var i=0; i<parent.children.length;i++)
					{
						if (parent.children[i].id == node.id)
						{
							childExists = true;
							break;
						}
					}
					// if not, then add
					if (childExists == false)
					{
						// last child
						if (parent.children.length <= node.id)
						{
							parent.children[parent.children.length] = node;
						}
						// in the middle
						else
						{
							var currentLength = parent.children.length
							for (var i=currentLength;i>node.id;i--)
							{
								parent.children[i] = parent.children[i-1];
							}
							parent.children[node.id] = node;
						}	
					}
				}
				
			}
			return true;
		};
		this.getNode = function(id)
		{
			return (this.data[id] != null)?this.data[id]:null
		};
		this.removeNode = function(id)
		{
			if (!this.data[id])return;
			
			// remove children
			var children = (this.data[id] && this.data[id].children)?this.data[id].children:[];
			children.splice(0,children.length)

			// remove from parent if exists
			var parent = this.data[this.data[id].parent];
			if (parent)
			{
				for (var i=0;i<parent.children.length;i++)
				{
					if (parent.children[i].id == id)
					{
						parent.children.splice(i,1);
						break;
					}
				}
			}

			// remove object
			this.data[id] = null;
			
			for (var i=0;i<this.rootNodes.length;i++)
			{
				if (id == this.rootNodes[i].id)
				{
					this.rootNodes.splice(i,1);
					break;
				}
			}

		};
		this.updateNode = function(id,node)
		{
			if (!this.data[id])return;

			// delete node's individual children
			if (this.data[id].children)
			{
				for (var i=0;i<this.data[id].children.length;i++)
				{
					var child = this.data[id].children[i];
					if (this.data[child.id])
						this.data[child.id]=null;
				}
			}
			// update the node
			// NOTE: the node's index isn't touched in this case
			this.data[id] = node;

			// add node's new children to this.data
			if (node.children)
			{
				for (var i=0;i<node.children.length;i++)
				{
					var child = node.children[i];
					this.data[child.id] = child;
					this.data['parent'] = id;
				}
			}
		};
		this.flattenData = function(data,parentId)
		{
			if (!data)return;
			for (var i=0;i<data.length;i++)
			{
				var node = data[i];
				this.data[node.id] = node;
				this.data[node.id]['parent'] = parentId;
				if (parentId == null)
				{
					this.rootNodes.push(this.data[node.id]); 
				}

				if (node.children)
				{
					this.flattenData(node.children,node.id)
				}
			}
			
		};
		this.flattenData(data,null);
		
	}
	
	App.HTMLTreeModel = function(data)
	{
		this.data = {};
		this.rootNodes = [];

		this.flattenData = function(childNodes,parentId)
		{

			for (var i=0;i<childNodes.length;i++)
			{
				var node = childNodes[i];
				// only process DIVs
				if (node.nodeType == 1 && node.tagName && node.tagName.toUpperCase() == 'DIV')
				{
					var nodeData = {};
					// replicate attributes and store by name
					var attrs = (node.attributes)?node.attributes:[]
					for (var j=0;j<attrs.length;j++)
					{
						var value = node.getAttribute(attrs[j].name);
						if (value=="true")value=true;
						else if(value=="false")value=false;

						nodeData[attrs[j].name.toLowerCase()] = value;
					}
					// ensure we have an id
					if (!nodeData['id'])
					{
						node.id = nodeData['id'] = App.Compiler.getAndEnsureId(node);
					}
					// store innerHTML as attribute
					nodeData['html'] = node.innerHTML.trim();

					// record data
					this.data[node.id] = nodeData;
					this.data[node.id]['parent'] = parentId;

					// if we are a child - store children
					if (parentId != null)
					{
						if (!this.data[parentId].children)
						{
							this.data[parentId].children = [];
						}
						this.data[parentId].children[this.data[parentId].children.length] = nodeData;

					}
					else
					{
						this.rootNodes.push(this.data[node.id]); 
					}

					// if we have children - process
					if (node.childNodes.length > 0)
					{
						this.flattenData(node.childNodes,node.id);
					}
				}
			}

		}
		this.flattenData(data,null)
		
	};
		
	App.HTMLTreeModel.prototype = new App.TreeModel();
})();



/////////////////////////////////////////////////////////////////////////
//
// Script/CSS Loading Functions
//
////////////////////////////////////////////////////////////////////////

/**
 * dynamically load a javascript file
 *
 * @param {string} path to resource
 * @param {function} onload function to execute once loaded
 */
App.UI.remoteLoadScript = function(path,onload,onerror)
{
    App.UI.remoteLoad('script','text/javascript',path,onload,onerror);  
};

/**
 * dynamically load a css file
 *
 * @param {string} path to resource
 * @param {function} onload function to execute once loaded
 */
App.UI.remoteLoadCSS = function(path,onload,onerror)
{
    App.UI.remoteLoad('link','text/css',path,onload,onerror);  
};

/**
 * dynamically load a remote file
 *
 * @param {string} name of the tag to insert into the DOM
 * @param {string} type as in content type
 * @param {string} full path to the resource
 * @param {function} onload to invoke upon load
 * @param {function} onerror to invoke upon error
 */
App.UI.remoteLoad = function(tag,type,path,onload,onerror)
{
	// fixup the URI
	path = App.URI.absolutizeURI(path,App.docRoot);
	
    var array = App.UI.fetching[path];
    if (array)
    {
        if (onload)
        {
            array.push(onload);
        }
        return;
    }
    if (onload)
    {
        App.UI.fetching[path]=[onload];
    }
    var element = document.createElement(tag);
    element.setAttribute('type',type);
    switch(tag)
    {
        case 'script':
            element.setAttribute('src',path);
            break;
        case 'link':
            element.setAttribute('href',path);
            element.setAttribute('rel','stylesheet');
            break;
    }
	var timer = null;
    var loader = function()
    {
	   if (timer) clearTimeout(timer);
       var callbacks = App.UI.fetching[path];
       if (callbacks)
       {
           for (var c=0;c<callbacks.length;c++)
           {
               try { callbacks[c](); } catch (E) { }
           }
           delete App.UI.fetching[path];
       }
    };    
    if (tag == 'script')
    {
	    if (App.Browser.isSafari2)
	    {
	        //this is a hack because we can't determine in safari 2
	        //when the script has finished loading
	        setTimeout(function(){loader(); },1500);
	    }
	    else
	    {
	        (function()
	        {
	            var loaded = false;
	            element.onload = loader;
				if (onerror)
				{
					if (!loaded)
					{
						// max time to determine if we've got an error
						// obviously won't work if takes long than 3.5 secs to load script
						timer=setTimeout(onerror,3500);
					}
					element.onerror = function()
					{
						// for browsers that support onerror
						if (timer) clearTimeout(timer);
						onerror();
					};
				}
	            element.onreadystatechange = function()
	            {
	                switch(this.readyState)
	                {
	                    case 'loaded':   // state when loaded first time
	                    case 'complete': // state when loaded from cache
	                        break;
	                    default:
	                        return;
	                }
	                if (loaded) return;
	                loaded = true;
	                
	                // prevent memory leak
	                this.onreadystatechange = null;
	                loader();
	            }   
	        })();
	    }   
	}
	else
	{
	   setTimeout(function(){loader()},5);
	}
   	document.getElementsByTagName('head')[0].appendChild(element);
};


//
// called by an UI manager implementation to register itself by type
//
App.UI.registerUIManager = function(ui,impl)
{
	App.UI.UIManager.managers[ui] = impl;
};

/**
 * called by UI manager to register itself
 */
App.UI.registerUIComponent = function(type,name,impl)
{
	try
	{
		var f = App.UI.UIComponents[type+':'+name];

		if (!f)
		{
			f = {};
			App.UI.UIComponents[type+':'+name]=f;
		}

		f.impl = impl;
		f.loaded = true;

		if (impl.setPath)
		{
			impl.setPath.call(impl,f.dir);
		}

		if (f.elements)
		{
			for (var c=0;c<f.elements.length;c++)
			{
				var obj = f.elements[c];
				App.UI.activateUIComponent(f.impl,f.dir,obj.type,obj.name,obj.element,obj.options,obj.callback);
			}

			f.elements = null;
		}
	}
	catch(e)
	{
		App.Compiler.handleElementException(null,e,'registerUIComponent for '+type+':'+name);
	}
};


/////////////////////////////////////////////////////////////////////////
//
// Register Four Main UI Managers
//
////////////////////////////////////////////////////////////////////////

App.UI.registerUIManager('layout', function(type,element,options,callback)
{
   App.UI.loadUIComponent('layout',type,element,options,callback);
});


App.UI.registerUIManager('behavior', function(type,element,options,callback)
{
   App.UI.loadUIComponent('behavior',type,element,options,callback);
});

App.UI.registerUIManager('theme', function(theme,element,options,callback)
{
	// is this a default setting
	if (theme == 'defaults')
	{
		for (var key in options)
		{
			App.UI.setDefaultThemes(key,options[key])
		}
		App.Compiler.compileElementChildren(element);
	}
	else
	{
		var type = element.nodeName.toLowerCase();
		options['theme']=theme;
		App.UI.loadUIComponent('control',type,element,options,callback);		
	}
});

App.UI.widgetRegex = /^app:/
App.UI.registerUIManager('control',function(type,element,options,callback)
{
    App.UI.loadUIComponent('control',type,element,options,callback);
});

/////////////////////////////////////////////////////////////////////////
//
// UI Event Handling
//
////////////////////////////////////////////////////////////////////////


//
//  Fire UI Events
//
App.UI.fireEvent = function(type,name,event,data)
{
	var listeners = App.UI.UIListeners;
	if (listeners && listeners.length > 0)
	{
		var scope = {type:type,name:name,event:event,data:data};
		for (var c=0;c<listeners.length;c++)
		{
			listeners[c].call(scope);
		}
	}
};

/////////////////////////////////////////////////////////////////////////
//
// Load and Activate UI Managers/Components
//
////////////////////////////////////////////////////////////////////////

//
// called by a UI to load a UI manager
//
App.loadUIManager=function(ui,type,element,args,failIfNotFound,callback)
{
	var f = App.UI.UIManager.managers[ui];
	if (f)
	{
		var data = {args:args,element:element};
		App.UI.fireEvent(ui,type,'beforeBuild',data);
		var afterBuild = function(inst)
		{
			// pass instance in event
			data.instance = inst;

			App.UI.fireEvent(ui,type,'afterBuild',data);
			if (callback){ callback.apply(inst)};
		};
		f(type,element,args,afterBuild);
	} 
};

//
// called to load UI component by UI manager
// 
App.UI.loadUIComponent = function(type,name,element,options,callback)
{
	var f = App.UI.UIComponents[type+':'+name];
	if (f)
	{
		if (f.loaded)
		{
			App.UI.activateUIComponent(f.impl,f.dir,type,name,element,options,callback);
		}
		else
		{
			f.elements.push({type:type,name:name,element:element,options:options,callback:callback});
		}
	}
	else
	{
		// added for API calls
		if (!element.state)element.state = {pending:0};
		
		element.state.pending+=1;
		var dir = App.docRoot + App.UI.componentRoot +type+'s/'+name;
		var path = dir+'/'+name+'.js';
		App.UI.UIComponents[type+':'+name] = {dir:dir,loaded:false,elements:[{type:type,name:name,element:element,options:options,callback:callback}]};
		App.UI.remoteLoadScript(path,function()
		{
			element.state.pending-=1;
			App.Compiler.checkLoadState(element);
		},function()
		{
			App.UI.handleLoadError(element,type,name,null,path);
			element.state.pending-=1;
			App.Compiler.checkLoadState(element);
		});
	}
};
App.UI.componentJSFiles = {};
//
// Instantiate UI component once loaded
//
App.UI.activateUIComponent = function(impl,setdir,type,name,element,options,callback)
{
	var componentRootDir = App.docRoot + App.UI.componentRoot +type+'s/'+name
	var inst = null;
	var formattedOptions = null;
	try
	{
		// get instance
		inst = new impl.create();

		// get options
		formattedOptions = App.UI.UIManager.parseAttributes(element,inst,options);
		// if the control has external JS dependencies, load them prior to calling build
		var jsFiles = null
		if (inst.getControlJS)
		{
			jsFiles = inst.getControlJS();
		}
		if (jsFiles !=null)
		{
			App.UI.componentJSFiles[element.id+'_'+type+'_'+name] = jsFiles.length;
			
			for (var i=0;i<jsFiles.length;i++)
			{
				App.UI.remoteLoadScript(componentRootDir + "/" + jsFiles[i],function()
				{
					App.UI.componentJSFiles[element.id+'_'+type+'_'+name]--;
					if (App.UI.componentJSFiles[element.id+'_'+type+'_'+name] == 0)
					{
						var compile = inst.build(element,formattedOptions);
						if (compile != false)
						{
							App.Compiler.compileElementChildren(element)
						}

						// keep track of elements and their UI attributes
						App.UI.addElementUI(element,type,name,inst);

						if (callback)
						{
							callback(inst);
						}
						
					}
				},null);
			}
		}
		else
		{
			var compile = inst.build(element,formattedOptions);
			if (compile != false)
			{
				App.Compiler.compileElementChildren(element)
			}

			// keep track of elements and their UI attributes
			App.UI.addElementUI(element,type,name,inst);
			
			if (callback)
			{
				callback(inst);
			}
			
		}


	}
	catch (e)
	{
		App.Compiler.handleElementException(element,e,'activateUIComponent for '+type+':'+name);
	}
	
	// get any external css files
	if (inst.getControlCSS)
	{
		cssFiles = inst.getControlCSS()
		if (cssFiles.length && cssFiles.length > 0)
		{
			for (var i=0;i<cssFiles.length;i++)
			{
				App.UI.remoteLoadCSS(componentRootDir + "/" + cssFiles[i]);
			}
		}
		
	}
	// get any custom actions
	if (inst.getActions)
	{
		var actions = inst.getActions();
		var id = element.id;
		for (var c=0;c<actions.length;c++)
		{
			(function()
			{
				var actionName = actions[c];
				var action = inst[actionName];
				if (action)
				{
					var xf = function(params,scope)
					{	
						var obj = {params:params,scope:scope}
						try
						{
							action.apply(inst,[obj]);
						}
						catch (e)
						{
							App.Compiler.handleElementException(element,e,'Error executing '+actionName+' in container type: '+type);
						}
					};
					App.UI.buildCustomElementAction(actionName, element, xf);
				}
			})();
		}
	}
	// get any custom conditions
	if (inst.getConditions)
	{
        /* App.Wel.customConditionObservers[element.id] = {};

        var customConditions = inst.getConditions();
        for (var i = 0; i < customConditions.length; i++)
        {
            var custCond = customConditions[i];
            var condFunct = App.Wel.customConditionFunctionCallback(custCond);
            App.Wel.registerCustomCondition({conditionNames: [custCond]}, 
                condFunct, element.id);
        }

		*/
	}
	
	if (App.Wel) App.Wel.parseOnAttribute(element);
};

// 
// Basic Functions for creating and executing actions on controls
//
App.UI.actionElementMap = {}
App.UI.createElementActionFunction = function(element,name,f)
{
	var id = (typeof element == 'string') ? element : element.id;
	var key = id + '_' + name;
	App.UI.actionElementMap[key]=f;
	return element;
};
App.UI.executeElementActionFunction = function(id,name,params,scope)
{
	var f = App.UI.actionElementMap[id + '_' + name];
	if (f)
	{
		f(params,scope);
	}
}
App.UI.buildCustomElementAction = function (name, element, callback)
{
	App.UI.createElementActionFunction(element,name,callback);
	
    App.Wel.registerCustomAction(name, 
	{
		execute: function(id,action,params,scope)
		{
			App.UI.executeElementActionFunction(id,action,params,scope);
		}
	}, element);
};

// 
// Keep track of an element's UI attributes (controls, behaviors, layouts, etc)
// This is used to faciliate dependency handling between controls and behaviors
// specifically if one element is using a certain control + one or more behaviors
// 
App.UI.addElementUI = function(element, ui, type,inst)
{
	// is UI attribute combo part of an existing dependency
	var map = App.UI.dependencyMap;
	for (var i=0;i<map.length;i++)
	{
		if (map[i].element.id == element.id)
		{
			// new UI + TYPE has a dependency for this element
			if ((map[i].dependencyUI == ui) && (map[i].dependencyType == type))
			{
				// see if element already has UI + TYPE 
				if (App.UI.elementMap[element.id + "_" + map[i].ui + "_" + map[i].type])
				{
					map[i].callback(element);
				}
			}
		}
	}
	App.UI.elementMap[element.id + "_" + ui + "_" + type] = {element:element,inst:inst};
	
};


/****************************************************
  HANDLE CROSS-CONTROL/BEHAVIOR/LAYOUT DEPENDENCIES
*****************************************************/
App.UI.dependencyMap = [];

//
// allow components to register their dependencies for an element
//
App.UI.addElementUIDependency = function(element,ui,type,dependencyUI, dependencyType, callback)
{

	// see if element already has UI attribute that is a dependency
	if (App.UI.elementMap[element.id + "_" + dependencyUI +"_" + dependencyType])
	{
		callback(element);
	}
	
	// otherwise store it for later
	else
	{
		App.UI.dependencyMap.push({element:element,ui:ui,type:type,dependencyUI:dependencyUI,dependencyType:dependencyType,callback:callback});	
	}
};



//
// Parse passed in attributes and make sure they match what 
// is supported by component
//
App.UI.UIManager.parseAttributes = function(element,f,options)
{
	var moduleAttributes = f.getAttributes();
	for (var i = 0; i < moduleAttributes.length; i++)
	{
		var error = false;
		var modAttr = moduleAttributes[i];
		var value =  options[modAttr.name] || element.style[modAttr.name] || modAttr.defaultValue;
		// check and make sure the value isn't a function as what will happen in certain
		// situations because of prototype's fun feature of attaching crap on to the Object prototype
		if (typeof value == 'function')
		{
			value = modAttr.defaultValue;
		}
		if (!value && !modAttr.optional)
		{
			App.Compiler.handleElementException(element, null, 'required attribute "' + modAttr.name + '" not defined for ' + element.id);
			error = true;
		}
		options[modAttr.name] = value;
		if (error == true)
		{
			if (App.Util.Logger) App.Util.Logger.error('error parsing attributes for '+element);
			return false;
		}
	}
	return options;
};



//
// called to handle load error
//
App.UI.handleLoadError = function(element,type,name,subtype,path)
{
	App.Compiler.handleElementException(element,null,"couldn't load "+type+":"+name+" for : "+path);
};



//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* processors.js */

//
// Processor for controls
//
App.Compiler.registerAttributeProcessor('*','control',
{
	handle: function(element,attribute,value)
	{
		var compiler = function()
		{
//			App.Compiler.compileElementChildren(element);
		};
		
		var options = App.UI.parseDeclarativeUIExpr(value)
		element.stopCompile=true;
		App.loadUIManager("control",options.type,element,options.args,false,compiler);
		
	},
	metadata:
	{
		description: (
			"create a control for an element"
		)
	}
	
});

//
// Processor for layouts
//
App.Compiler.registerAttributeProcessor('*','layout',
{
	handle: function(element,attribute,value)
	{
		var compiler = function()
		{
			App.Compiler.compileElementChildren(element);
		};
		
		var options = App.UI.parseDeclarativeUIExpr(value)
		element.stopCompile=true;
		App.loadUIManager("layout",options.type,element,options.args,false,compiler);

	},
	metadata:
	{
		description: (
			"create a layout for an element"
		)
	}
	
});

//
// Processor for themes
//
App.Compiler.registerAttributeProcessor('*','theme',
{
	handle: function(element,attribute,value)
	{
		var compiler = function()
		{
			App.Compiler.compileElementChildren(element);
		};
		
		var options = App.UI.parseDeclarativeUIExpr(value)
		element.stopCompile=true;
		App.loadUIManager("theme",options.type,element,options.args,false,compiler);
	},
	metadata:
	{
		description: (
			"create a theme for an element"
		)
	}
	
});

//
// Processor for behaviors
//
App.Compiler.registerAttributeProcessor('*','behavior',
{
	handle: function(element,attribute,value)
	{
		var compiler = function()
		{
			App.Compiler.compileElementChildren(element);
		};
		
		var expr = App.Wel.smartSplit(value,' and ');
		var options = null;
		if (expr.length >0)
		{
			for (var i=0;i<expr.length;i++)
			{
				options = App.UI.parseDeclarativeUIExpr(expr[i])
				element.stopCompile=true;
				App.loadUIManager("behavior",options.type,element,options.args,false,compiler);
			}
		}
		else
		{
			var options = App.UI.parseDeclarativeUIExpr(value)
			element.stopCompile=true;
			App.loadUIManager("behavior",options.type,element,options.args,false,compiler);
			
		}
	},
	metadata:
	{
		description: (
			"create a behavior for an element"
		)
	}
	
});

//
// Helper function for parsing control attributes
//
App.UI.parseDeclarativeUIExpr = function(value)
{
	var args = {};
	if (value.indexOf("[") == -1)
	{
		type = value;
	}
	else
	{
		var expr = value.replace("[",",").replace("]","");
		var pieces = expr.split(",")
		for (var i=0;i<pieces.length;i++)
		{
			if (i==0)type = pieces[i].trim();
			else
			{
				var pair = pieces[i].split("=");
				var value = pair[1].trim();
				if (value == 'true')
				{
					value = true;
				}
				else if(value == 'false')
				{
					value = false;
				}
				else if (value.startsWith('expr('))
				{
					var func =    value.substring(5,value.length-1) + '()';
			        value = func.toFunction(true);
				}
			
				args[pair[0].trim()] = value;					
			}
		}
	}
	return {type:type, args:args}
	
};

//--------------------------------------------------------------------------------

/* includes: jquery, swiss, mq, wel and ui */


/* themes.js */

/////////////////////////////////////////////////////////////////////////
//
// Theme Functions
//
////////////////////////////////////////////////////////////////////////

App.UI.themes = {};
App.UI.thirdPartyJS = {};

//
//  Default Themes by Control
//
App.UI.defaultThemes = 
{
	'panel':'basic',
	'shadow':'basic',
	'button':'white_gradient',
	'input':'white_gradient',
	'textarea':'white_gradient',
	'select':'thinline',
	'tabpanel':'white',
	'accordion':'basic'
};

//
// Get a default theme for a control
//
App.UI.getDefaultTheme = function(type)
{
	return App.UI.defaultThemes[type];
};

//
// Set a default theme for a control
//
App.UI.setDefaultThemes = function(type,theme)
{
	App.UI.defaultThemes[type] = theme;
};

//
// Register a theme handler
//
App.UI.registerTheme = function(type,container,theme,impl)
{
	var key = App.UI.getThemeKey(type,container,theme);
	var themeImpl = App.UI.themes[key];
	if (!themeImpl)
	{
		themeImpl = {};
		App.UI.themes[key] = themeImpl;
	}
	themeImpl.impl = impl;
	themeImpl.loaded = true;
	// trigger on registration any pending guys
	App.UI.loadTheme(type,container,theme,null,null);
};

//
// Contruct a theme key
//
App.UI.getThemeKey = function(pkg,container,theme)
{
	return pkg + ':' + container + ':' + theme;
};

//
// Dynamically load a theme file
//
App.UI.loadTheme = function(pkg,container,theme,element,options)
{
	theme = theme || App.UI.getDefaultTheme(container);
	var key = App.UI.getThemeKey(pkg,container,theme);
	var themeImpl = App.UI.themes[key];
	var fetch = false;
	var path = App.docRoot + App.UI.componentRoot + pkg + 's/' + container + '/themes/' +theme;

	if (!themeImpl)
	{
		themeImpl = { callbacks: [], impl: null, loaded: false, path: path };
		App.UI.themes[key] = themeImpl;
		fetch = true;
	}
	
	if (themeImpl.loaded)
	{
		if (themeImpl.callbacks && themeImpl.callbacks.length > 0 && themeImpl.impl && themeImpl.impl.build)
		{
			for (var c=0;c<themeImpl.callbacks.length;c++)
			{
				var callback = themeImpl.callbacks[c];
				themeImpl.impl.build(callback.element,callback.options);
			}
		}
		if (element!=null && options!=null && themeImpl.impl && themeImpl.impl.build)
		{
			if (themeImpl.impl.setPath)
			{
				themeImpl.impl.setPath.call(themeImpl.impl,path);
			}
			themeImpl.impl.build(element,options);
		}
		themeImpl.callbacks = null;
	}
	else
	{
		themeImpl.callbacks.push({element:element,options:options});
	}
	
	if (fetch)
	{
		var css_path =  path + '/' +theme+  '.css';
		App.UI.remoteLoadCSS(css_path);

		// var js_path = path + '/' +theme+  '.js';
		// App.UI.remoteLoadScript(js_path,null,function()
		// {
		// 	App.UI.handleLoadError(element,pkg,theme,container,js_path);
		// });
	}
};


//--------------------------------------------------------------------------------
