App.UI.registerUIComponent('control','content',
{
	create: function()
	{
		this.options = null;
		this.element = null;
		this.getAttributes = function()
		{
			return [
					{name: 'src', optional: true, 
					 description: "The source for the content file to load."},
					{name: 'args', optional: true, 
					 description: "Used to replace text in the content file."},
					{name: 'lazy', optional: true, defaultValue: 'false', 
					 description: "Indicates whether the content file should be lazy loaded."},
					{name: 'onload', optional: true, 
					 description: "Fire this message when content file is loaded."},
					{name: 'onfetch', optional: true, 
					 description: "Fire this message when content file is fetched but before being loaded."}
			];
		};
		
		/**
		 * The version of the control. This will automatically be corrected when you
		 * publish the component.
		 */
		
		this.getVersion = function()
		{
			// leave this as-is and only configure from the build.yml file 
			// and this will automatically get replaced on build of your distro
			return '__VERSION__';
		};
		
		/**
		 * The control spec version.  This is used to maintain backwards compatability as the
		 * Widget API needs to change.
		 */
		this.getSpecVersion = function()
		{
			return 1.0;
		};
		this.load = function(value)
		{
			this.execute(value)
		}
		this.execute = function(value)
		{
			var src = App.getActionValue(value,'src')
			if (src)
			{
				this.options.src = src;
			}
			this.fetch();
		}
		this.getActions = function()
		{
			return ['execute','load'];
		};
		   
		/**
		 * This is called when the control is loaded and applied for a specific element that 
		 * references (or uses implicitly) the control.
		 */
		this.build = function(element,options)
		{
			this.options = options;
			this.element = element;
			if (!(options['lazy'] == true) && options['src'])
			{
				this.fetch();
			}
			
		};
		this.unload = function(target)
		{
			var child = $(target).firstChild;
			if (child && child.nodeType == 1)
			{
				 App.Compiler.destroy(child);
			}
		},
		
		this.fetch = function()
		{
			this.options.src = App.URI.absolutizeURI(this.options.src,App.docRoot);
	        this.element.style.visibility='hidden';
			var self = this;

			App.Util.IFrame.fetch(this.options.src,function(doc)
			{
				if (self.element._executed) self.unload(self.element);
				self.element._executed=true;

				if (self.options.onfetch)
				{
					$MQ(self.options.onfetch,{'src':self.options.src,'args':self.options.args});
				}

				var scope = self.element.getAttribute('scope') || self.element.scope;
				doc.setAttribute('scope',scope);
				doc.scope = scope;
				App.Compiler.getAndEnsureId(doc);
				var contentHTML = doc.innerHTML;
				var state = {pending:0,scanned:false};
				self.element.state = state;
				var html = '<div>'+contentHTML+'</div>';
				//var html = '<div>'+contentHTML+'</div>';

				if (self.options.args)
				{
					// replace tokens in our HTML with our args
					var t = App.Wel.compileTemplate(html);
					html = t(swiss.evalJSON(self.options.args));
				}
				// turn off until we're done compiling
				self.element.innerHTML = html;
				state.onafterfinish=function()
				{
					 // turn it back on once we're done compiling
				     self.element.style.visibility='visible';
		             if (self.options.onload)
		             {
		                $MQ(self.options.onload,{'src':self.options.src,'args':self.options.args});
		             }
				};
				// evaluate scripts
			//	App.Util.evalScripts(contentHTML);
				App.Compiler.compileElement(self.element.firstChild,state);
				state.scanned=true;
				App.Compiler.checkLoadState(self.element);
			},true,true);
		};
	}
});
