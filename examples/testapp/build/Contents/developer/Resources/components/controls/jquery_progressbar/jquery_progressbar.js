App.UI.registerUIComponent('control','jquery_progressbar',
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
		this.getControlCSS = function()
		{
			return ['../../../../common/css/jquery-themes/ui.all.css']
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
			return [{name: "duration", 
						optional: true, 
						description: "Time for progressing.",
						defaultValue: 1000
					},
					{name: "increment", 
						optional: true, 
						description: "Min stepping of the progressbar. ",
						defaultValue: 1
					},
					{name: "interval", 
						optional: true, 
						description: "The technical writers at jQuery thought that this was so obvious that it didn't need a description.",
						defaultValue: 100
					},
					{name: "range", 
						optional: true,
						description: "Whether show range number as text on the bar.",
						defaultValue: true
					},
					{name: "text", 
						optional: true, 
						description: "Text to show on the bar.",
						defaultValue: "Demo"
					},																	 
					{name: "textClass", 
						optional: true, 
						description: "Text CSS class."
					},		 
					{name: "width", 
						optional: true, 
						description: "Width of the progressbar.", 
						defaultValue: 300
					},
					{name: "start", 
						optional: true, 
						description: "Callback function triggered when the progressbar is started.", 
						defaultValue: false
					},
					{name: "pause", 
						optional: true, 
						description: "Callback function triggered when the progressbar is paused.", 
						defaultValue: null
					},
					{name: "progress", 
						optional: true, 
						description: "Callback function triggered when the progressbar is progressing.", 
						defaultValue: null
					},
					{name: "value", 
						optional: true, 
						description: "initial value", 
						defaultValue: 0
					},

					{name: "stop", 
						optional: true, 
						description: "Callback function triggered when the progressbar is stopped.", 
						defaultValue: 0
					}
					];
		}
		
		this.enable = function(value)
		{
			jQuery("#" + this.id).progressbar("enable");
		}
		
		this.disable = function(value)
		{
			jQuery("#" + this.id).progressbar("disable");
		}
		
		this.value = function(value)
		{
			jQuery("#" + this.id).progressbar("value", parseInt(App.getActionValue(value,"value")));
		}
		
		this.pause = function(value)
		{
			jQuery("#" + this.id).progressbar("pause");
		}

		this.stop = function(value)
		{
			jQuery("#" + this.id).progressbar("stop");
		}

		this.start = function(value)
		{
			jQuery("#" + this.id).progressbar("start");
		}
				
		this.getActions = function()
		{
			return ['value','pause','stop','start','enable','disable'];
		}

		this.build = function(element,options)
		{
			this.options = options;
			this.id = element.id;
			
	        jQuery("#" + element.id).progressbar(options);			
		}
	}
});
