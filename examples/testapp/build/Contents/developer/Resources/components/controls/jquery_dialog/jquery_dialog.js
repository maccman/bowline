App.UI.registerUIComponent('control','jquery_dialog',
{
	create: function()
	{
		this.options = null;
		this.id = null;

		/**
		 * The version of the control. This will automatically be corrected when you
		 * publish the component.
		 */
		this.getVersion = function()
		{
			// leave this as-is and only configure from the build.yml file 
			// and this will automatically get replaced on build of your distro
			return '1.0';
		}

		/**
		 * The control spec version.  This is used to maintain backwards compatability as the
		 * Widget API needs to change.
		 */
		this.getSpecVersion = function()
		{
			return 1.0;
		}

		this.getAttributes = function()
		{
			return [{name: "autoOpen", 
						optional: true, 
						description: "When autoOpen is true the dialog will open automatically when dialog is called. If false it will stay hidden until .dialog('open') is called on it.", 
						defaultValue: true
					},
					{name: "bgiframe", 
						optional: true, 
						description: "When true, the bgiframe plugin will be used, to fix the issue in IE6 where select boxes show on top of other elements, regardless of zIndex. Requires including the bgiframe plugin. Future versions may not require a separate plugin.", 
						defaultValue: false
					},
					{name: "buttons", 
						optional: true, 
						description: "Specifies which buttons should be displayed on the dialog. The property key is the text of the button. The value is the callback function for when the button is clicked. The context of the callback is the dialog element; if you need access to the button, it is available as the target of the event object.", 
						defaultValue: {
							"Delete all items in recycle bin": function() { jQuery(this).dialog('close'); }, 
							"Cancel": function() { jQuery(this).dialog('close'); }
						}
					},
					{name: "dialogClass", 
						optional: true, 
						description: "The specified class name(s) will be added to the dialog, for additional theming.", 
						defaultValue: null
					},			
					{name: "draggable", 
						optional: true, 
						description: "When draggable is true the resulting dialog will be draggable. If false the dialog will not be draggable.", 
						defaultValue: true
					},			
					{name: "height", 
						optional: true, 
						description: "The height of the dialog, in pixels.", 
						defaultValue: 200
					},			
					{name: "hide", 
						optional: true, 
						description: "The effect to be used when the dialog is closed.", 
						defaultValue: null
					},			
					{name: "maxHeight", 
						optional: true, 
						description: "The maximum height to which the dialog can be resized, in pixels.", 
						defaultValue: null
					},			
					{name: "maxWidth", 
						optional: true, 
						description: "The maximum width to which the dialog can be resized, in pixels.", 
						defaultValue: null
					},			
					{name: "minHeight", 
						optional: true, 
						description: "The minimum height to which the dialog can be resized, in pixels.", 
						defaultValue: 100
					},			
					{name: "minWidth", 
						optional: true, 
						description: "The minimum width to which the dialog can be resized, in pixels.", 
						defaultValue: 150
					},			
					{name: "modal", 
						optional: true, 
						description: "When modal is set to true the dialog will have modal behavior; other items on the page will be disabled (i.e. cannot be interacted with). Modal dialogs create an overlay below the dialog but above other page elements. Custom style values for the overlay (e.g. changing its color or opacity) can be provided with the overlay option.", 
						defaultValue: false
					},			
					{name: "overlay", 
						optional: true, 
						description: "Key/value object of style properties for the overlay to display behind the dialog (but above other page elements).", 
						defaultValue: null
					},			
					{name: "position", 
						optional: true, 
						description: "Specifies where the dialog should be displayed. Possible values: 'center', 'left', 'right', 'top', 'bottom', or an array containing a coordinate pair (in pixel offset from top left of viewport) or the possible string values (e.g. ['right','top'] for top right corner).", 
						defaultValue: "center"
					},			
					{name: "resizable", 
						optional: true, 
						description: "Specifies whether the dialog will be resizeable. Possible values: true, false.", 
						defaultValue: true
					},			
					{name: "show", 
						optional: true, 
						description: "The effect to be used when the dialog is opened.", 
						defaultValue: null
					},			
					{name: "stack", 
						optional: true, 
						description: "Specifies whether the dialog will stack on top of other dialogs. This will cause the dialog to move to the front of other dialogs when it gains focus.", 
						defaultValue: true
					},			
					{name: "title", 
						optional: true, 
						description: "Specifies the title of the dialog. The title can also be specified by the title attribute on the dialog source element.", 
						defaultValue: null
					},			
					{name: "width", 
						optional: true, 
						description: "The width of the dialog, in pixels.", 
						defaultValue: 300
					},			
					{name: "open", 
						optional: true, 
						description: "Callback for the dialogopen event. The function gets passed two arguments in accordance with the triggerHandler interface.", 
						defaultValue: null
					},			
					{name: "focus", 
						optional: true, 
						description: "Callback for the dialogfocus event. The function gets passed two arguments in accordance with the triggerHandler interface.", 
						defaultValue: null
					},			
					{name: "dragStart", 
						optional: true, 
						description: "Callback for the beginning of the dialog being dragged.", 
						defaultValue: null
					},			
					{name: "drag", 
						optional: true, 
						description: "Callback for during the dialog being dragged.", 
						defaultValue: null
					},			
					{name: "dragStop", 
						optional: true, 
						description: "Callback for after the dialog has been dragged.", 
						defaultValue: null
					},			
					{name: "resizeStart", 
						optional: true, 
						description: "Callback for the beginning of the dialog being resized.", 
						defaultValue: null
					},			
					{name: "resize", 
						optional: true, 
						description: "Callback for during the dialog being resized.", 
						defaultValue: null
					},			
					{name: "resizeStop", 
						optional: true, 
						description: "Callback for after the dialog has been resize.", 
						defaultValue: null
					},			
					{name: "close", 
						optional: true, 
						description: "Callback for the close.dialog event. The function gets passed two arguments in accordance with the triggerHandler interface.", 
						defaultValue: null
					}
					];
		}

		this.title =  function(value)
		{
			jQuery("#ui-dialog-title-" + this.id).html(App.getActionValue(value));
		}
		
		this.open = function(value)
		{
			jQuery("#" + this.id).dialog("open");
		}
		
		this.close = function(value)
		{
			jQuery("#" + this.id).dialog("close");
		}
		
		this.isOpen = function(value)
		{
			return jQuery("#" + this.id).dialog("isOpen");
		}
				
		this.content = function(value)
		{
			jQuery("#" + this.id + ".ui-dialog-content.ui-widget-content").get(0).innerHTML = App.getActionValue(value);
		}
		
		this.getActions = function()
		{
			return ['title','open','close','content'];
		}

		this.build = function(element,options)
		{
			this.options = options;
			this.id = element.id;
			
			setTimeout(function() {

	        	jQuery("#" + element.id).dialog(options);
	
				if(options.content)
				{
					jQuery("#" + element.id + ".ui-dialog-content.ui-widget-content").get(0).innerHTML = options.content;
				}	

			}, 10);
	
		}
	}
});
