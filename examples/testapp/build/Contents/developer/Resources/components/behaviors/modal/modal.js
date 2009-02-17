App.UI.registerUIComponent('behavior','modal',
{
	create: function()
	{
		this.id = null;
		this.element = null;
		
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
			return [{name: 'background-color', optional: true, description: "background color for modal",defaultValue: '#222'},
		       	    {name: 'opacity', optional: true, description: "opacity for modal background",defaultValue: 0.6},
					{name: 'hideEffect',optional:true},
					{name: 'showEffect',optional:true}
					];
		}

		this.hide=function(value)
		{
			this._hideModal();
		}
		this.show=function(value)
		{
			// show the element and modal container
			swiss('#'+this.id+'_modal_container').show();
			if (this.options.showEffect != null)
			{
				swiss('#'+this.id).effect(this.options.showEffect,{});
			}
			else
			{
				swiss('#'+this.id).show();
			}
			// set left for element based on width
			// trying to center the element
			this.bodyHeight = swiss(document).height();
			this.bodyWidth = swiss(document).width();	

			var elWidth = swiss('#'+this.id).width();
			var left = (this.bodyWidth - elWidth)/2 + 'px';
			var container = swiss('#'+this.id+'_modal_container').get(0)
			container.style.width = this.bodyWidth + 'px';
			container.style.height = this.bodyHeight + 'px';
			container.style.backgroundColor = this.options['background-color'];
			container.style.opacity = this.options['opacity'];
			
			this.element.style.left = left;
			// scroll to top
			window.scrollTo(0,0)			
			
		},

		this._hideModal = function()
		{
			swiss('#'+this.id+'_modal_container').hide();
			if (this.options.hideEffect != null)
			{
				swiss('#'+this.id).effect(this.options.hideEffect,{});
			}
			else
			{
				swiss('#'+this.id).hide();
			}
		}

		this.getActions=function()
		{
			return ['hide','show'];
		}

		this.build = function(element,options)
		{
			this.id = element.id
			this.element = element;
			this.options = options;
			
			// create modal container
			var modalContainer = document.createElement('div');
			modalContainer.id = this.id + '_modal_container';
			modalContainer.style.display = "none";
			modalContainer.style.position = "absolute";
			modalContainer.style.top = '0px';
			modalContainer.style.left = '0px';
			modalContainer.style.zIndex = '2000';
			modalContainer.style.backgroundColor = options['background-color'];
			modalContainer.style.opacity = options['opacity'];
			modalContainer.style.filter = "alpha( opacity = "+options['opacity']*100+")";
			swiss(document.body).prependElement(modalContainer);

			// style modal element
			element.style.position = "absolute";
			element.style.top = "100px";
			element.style.zIndex='2001';
			element.style.display = 'none'
			swiss(document.body).prependElement(element);
		}
	}
});
