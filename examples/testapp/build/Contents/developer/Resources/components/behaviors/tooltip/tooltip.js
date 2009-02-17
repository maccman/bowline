App.UI.registerUIComponent('behavior','tooltip',
{
	create: function()
	{
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
			return [
				{name: 'id', optional: false, description: "element id that triggers tooltip"},
				{name: 'delay', optional: true, description: "delay before hiding",  defaultValue: '0'},
				{name: 'position', optional: true, description: "position of tooltip - either relative or fixed", defaultValue: 'relative'},
				{name: 'showEffect', optional: true, description: "effect to use when showing"},
				{name: 'hideEffect', optional: true, description: "effect to use when hiding"}
			];
		}

		this.build = function(element,options)
		{
			
			element.style.display = "none";
			var timer;
			var delay = 0;
			delay = App.Util.DateTime.timeFormat(options['delay']);

			var hide = function(el)
			{
				var effect = options['hideEffect'];
				if (effect)
				{
					swiss('#'+el.id).effect(effect,{});
				}
				else
				{
					swiss('#'+el.id).hide();
				}
			};
			var show = function(el)
			{
				var effect = options['showEffect'];
				if (effect)
				{
					swiss('#'+el.id).effect(effect,{});
				}
				else
				{
					swiss('#'+el.id).show();
				}
			};

			function startTimer(el)
			{
				cancelTimer();
				timer = setTimeout(function()
				{
					hide(el);
				}
				,delay);
			}
			function cancelTimer()
			{
				if (timer)
				{
					clearTimeout(timer);
					timer = null;
				}				
			}

			// we call this in a defer to allow processing to continue
			// and in case ID hasn't yet been seen or compiled
			(function()
			{
				swiss('#'+options['id']).on('mouseover',{},function(e)
				{	
					cancelTimer();
					if (options['position']=='relative')
					{
						element.style.position = "absolute";
						element.style.zIndex = '1000';
						element.style.top = (swiss.getMouseY(e)) + "px";
						element.style.left = (swiss.getMouseX(e)) + "px";
					}
					show(element);
					
				})
				swiss('#'+options['id']).on('mouseout',{},function(e)
				{
					startTimer(element);
				});	
				swiss('#'+element.id).on('mouseover',{},function(e)
				{
					cancelTimer();
				});	
				swiss('#'+element.id).on('mouseout',{},function(e)
				{
					startTimer(element);
				});	

			})();
		}
	}
});
