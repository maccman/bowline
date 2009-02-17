App.UI.registerUIComponent('behavior','rounded',
{
	create: function()
	{
		this.getAttributes = function()
		{
			return [
				{name: 'tl', defaultValue:'10', optional: true, description: "top left radius"},
				{name: 'bl', defaultValue:'10', optional: true, description: "top right radius"},
				{name: 'tr', defaultValue:'10', optional: true, description: "bottom left radius"},
				{name: 'br', defaultValue:'10', optional: true, description: "bottom right radius"},
				{name: 'radius', optional: true, description: "radius for all corners"}

			];
		}

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

		this.build = function(element,options)
		{
			var tl=options.tl;
			var tr=options.tr;
			var bl=options.bl;
			var br=options.br;
			if (options.radius)
			{
				tl = tr = bl = br = options.radius;
			}
			swiss(element).addClass('app-rounded-top-left-' + tl);
			swiss(element).addClass('app-rounded-top-right-' + tr);
			swiss(element).addClass('app-rounded-bottom-left-' + bl);
			swiss(element).addClass('app-rounded-bottom-right-' + br);
			App.UI.loadTheme('behavior','rounded','basic',element,options);
		
		}
	}
});
