App.UI.registerUIComponent('control','jquery_slider',
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
			return [{name: "animate", 
						optional: true, 
						description: "Whether slide handle smoothly when user click outside handle on the bar.",
						defaultValue: true
					},
					{name: "axis", 
						optional: true, 
						description: "Normally you don't need to set this option because the plugin detects the slider orientation automatically. If the orientation is not correctly detected you can set this option to 'horizontal' or 'vertical'.",
						defaultValue: null
					},
					{name: "handle", 
						optional: true, 
						description: "The jquery selector to use for the handle(s) of the slider.",
						defaultValue: ".ui-slider-handle"
					},
					{name: "handles", 
						optional: true, 
						description: "Specify boundaries for one or more handles. Format: [{start:Integer, min:Integer, max:Integer, id:String} [, ..]]. Only start is required. If the slider doesn't have handles already, they are automatically created.",
						defaultValue: null
					},																	 
					{name: "min", 
						optional: true, 
						description: "The maximum value of the slider. Useful for tracking values via callback, and to set steps.",
						defaultValue: 0
					},		 
					{name: "max", 
						optional: true, 
						description: "The minimum value of the slider. Useful for tracking values via callback, and to set steps.", 
						defaultValue: 100
					},
					{name: "range", 
						optional: true, 
						description: "If set to true, the slider will detect if you have two handles and create a stylable range element between these two. You now also have access to ui.range in your callbacks to get the amount of the range.", 
						defaultValue: false
					},
					{name: "value", 
						optional: true, 
						description: "The value the handle will have first.", 
						defaultValue: null
					},
					{name: "stepping", 
						optional: true, 
						description: "If defined, the new value has to be dividable through this number, so the slider jumps from step to step.", 
						defaultValue: null
					},
					{name: "steps", 
						optional: true, 
						description: "Alternative to stepping, this defines how many steps a slider will have, instead of how many values to jump, as in stepping.", 
						defaultValue: 0
					},
					{name: "start", 
						optional: true, 
						description: "Function that gets called when the user starts sliding.", 
						defaultValue: null
					},	
					{name: "slide", 
						optional: true, 
						description: "Function that gets called on every mouse move during slide. Takes arguments e and ui, for event and user-interface respectively. Use ui.value (single-handled sliders) to obtain the value of the current handle, $(..).slider('value', index) to get another handles' value.", 
						defaultValue: null
					},
					{name: "change", 
						optional: true, 
						description: "Function that gets called on slide stop, but only if the slider position has changed. Takes arguments e and ui, for event and user-interface respectively. Use ui.value (single-handled sliders) to obtain the value of the current handle, $(..).slider('value', index) to get another handles' value.", 
						defaultValue: null
					},	
					{name: "stop", 
						optional: true, 
						description: "Function that gets called when the user stops sliding.", 
						defaultValue: null
					}
					];
		}
		
		this.enable = function(value)
		{
			jQuery("#" + this.id).slider("enable");
		}
		
		this.disable = function(value)
		{
			jQuery("#" + this.id).slider("disable");
		}
		
		this.value = function(value)
		{
			return jQuery("#" + this.id).slider("value", parseInt(App.getActionValue(value)));
		}
		
		this.getActions = function()
		{
			return ['value','enable','disable','showRow','activate','content','remove'];
		}

		this.build = function(element,options)
		{
			this.options = options;
			this.id = element.id;
			
	        jQuery("#" + element.id).slider(options);			
		}
	}
});
