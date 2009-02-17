App.UI.registerUIComponent('control','jquery_accordion',
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
			return [{name: "active", 
						optional: true, 
						description: "Selector for the active element. Set to false to display none at start. (Requires the parameter alwaysOpen to be set to false.",
						defaultValue: "first child"
					},
					{name: "alwaysOpen", 
						optional: true, 
						description: "Whether there must be one content element open. Allows collapsing the active section by the triggering event (click is the default).",
						defaultValue: false 
					},
					{name: "animated", 
						optional: true, 
						description: "Choose your favorite animation, or disable them (set to false). In addition to the default, 'bounceslide' and 'easeslide' are supported (both require the easing plugin).",
						defaultValue: "slide"
					},
					{name: "autoHeight", 
						optional: true, 
						description: "If set, clears height and overflow styles after finishing animations. This enables accordions to work with dynamic content. Won't work together with autoheight.",
						defaultValue: false
					},
					{name: "clearStyle", 
						optional: true, 
						description: "If set, the highest content part is used as height reference for all other parts. Provides more consistent animations.",
						defaultValue: true
					},
					{name: "event", 
						optional: true, 
						description: "The event on which to trigger the accordion.",
						defaultValue: "click"
					},
					{name: "fillSpace", 
						optional: true, 
						description: "If set, the accordion completely fills the height of the parent element. Overrides autoheight.",
						defaultValue: false
					},
					{name: "header", 
						optional: true, 
						description: "Selector for the header element. ",
						defaultValue: "h3.ui-accordion-header"
					},
					{name: "icons", 
						optional: true, 
						description: "Icons to use for headers. Available icons are 'header' and 'headerSelected'",
						defaultValue: {
							header: "ui-icon-arrow-1-e",
							headerSelected: "ui-icon-arrow-1-s"
						}
					},
					{name: "navigation", 
						optional: true, 
						description: "If set, looks for the anchor that matches location.href and activates it. Great for href-based state-saving. Use navigationFilter to implement your own matcher.", 
						defaultValue: false
					},
					{name: "navigationFilter", 
						optional: true, 
						description: "Overwrite the default location.href-matching with your own matcher.", 
						defaultValue: null
					},
					{name: "selectedClass", 
						optional: true, 
						description: "", 
						defaultValue: "selected"
					}
					];
		}

		this.title =  function(value)
		{
			jQuery("#" + this.id + " .ui-accordion-header a").get(App.getActionValue(value,'index')).innerHTML = App.getActionValue(value,'value');
		}
		
		this.enable = function(value)
		{
			jQuery("#" + this.id).accordion("enable");
		}
		
		this.disable = function(value)
		{
			jQuery("#" + this.id).accordion("disable");
		}
		
		this.hideRow = function(value)
		{
			var el = jQuery("#" + this.id + " .ui-accordion-group").get(App.getActionValue(value,'index')); 
			jQuery(el).hide();
		}
		
		this.content = function(value)
		{
			jQuery("#" + this.id + " .ui-accordion-content").get(App.getActionValue(value,'index')).innerHTML = App.getActionValue(value,'value');
		}
		
		this.showRow = function(value)
		{
			var el = jQuery("#" + this.id + " .ui-accordion-group").get(App.getActionValue(value,'index')); 
			jQuery(el).show();
		}
		
		this.activate = function(value)
		{
			jQuery("#" + this.id).accordion("activate", App.getActionValue(value, "index"));
		}
		
		this.remove = function(value)
		{
			jQuery(jQuery("#" + this.id + " .ui-accordion-group").get(App.getActionValue(value,'index'))).remove();
		}
		
		this.loadHTML = function(value)
		{
			jQuery(jQuery("#" + this.id + " .ui-accordion-content").get(App.getActionValue(value,'index'))).load(App.getActionValue(value,'url'));
		}
		
		this.getActions = function()
		{
			return ['title','enable','disable','hideRow','showRow','activate','content','remove','render','loadHTML','property'];
		}
		
		this.addRow = function(value)
		{
			var html = [];

			html.push('<div class="ui-accordion-group">');
	        html.push('	<h3 class="ui-accordion-header"><a href="#">' + App.getActionValue(value,'title') + '</a></h3>');
			html.push('	 <div class="ui-accordion-content" id="' + App.getActionValue(value, 'id') + '">');

			if(App.getActionValue(value, 'content'))
			{
				html.push(App.getActionValue(value,'content'));
			}

			html.push(' </div>');
	        html.push('</div>');

			if(App.getActionValue(value, "insert") === "before")
			{
				if(App.getActionValue(value, "index"))
				{
					jQuery(jQuery("#" + this.id + " .ui-accordion-group").get(App.getActionValue(value,'index'))).before(html.join(" "));
				}
				else
				{
					jQuery("#" + this.id).prepend(html.join(" "));					
				}
			}
			else 
			{
				if(App.getActionValue(value, "index"))
				{
					jQuery(jQuery("#" + this.id + " .ui-accordion-group").get(App.getActionValue(value,'index'))).after(html.join(" "));
				} 
				else
				{
					jQuery("#" + this.id).append(html.join(" "));
				}
			}
			
			jQuery("#" + this.id).accordion("destroy");

			if(App.getActionValue(value, "url"))
			{

				jQuery('#'+App.getActionValue(value, 'id')).load(App.getActionValue(value, "url"));
			}

			jQuery("#" + this.id).accordion(this.options);

		}	
		
		this.deleteRow = function(value)
		{
			jQuery(jQuery("#" + this.id + " .ui-accordion-group").get(App.getActionValue(value))).remove();
		}
		
		this.render = function(value)
		{
			var html = [];
			var requests = [];

			if(App.getActionValue(value,this.options["property"]))
			{
				var data = App.getActionValue(value,this.options["property"])

				for(var i=0; i < data.length; i++)
				{
					html.push('<div class="ui-accordion-group">');
			        html.push('	<h3 class="ui-accordion-header"><a href="#">' + data[i].title + '</a></h3>');
					html.push('	 <div class="ui-accordion-content" id="ui-accordion-' + this.id + '-' + i + '">');

					if(data[i].content)
					{
						html.push(data[i].content);
					}
					else if(data[i].url)
					{
						requests.push({ el: "#ui-accordion-" + this.id + "-" + i, url: data[i].url });
					}
					
					html.push(' </div>');
			        html.push('</div>');
				}
			}	

			jQuery("#" + this.id).get(0).innerHTML = html.join(' ');
			jQuery("#" + this.id).accordion("destroy");
	        jQuery("#" + this.id).accordion(this.options);

			if(requests.length > 0)
			{	
				jQuery.each(requests, function() { jQuery(this.el).load(this.url); });
			}
		}

		this.build = function(element,options)
		{
			this.options = options;
			this.id = element.id;

			if(jQuery("#" + this.id).get(0).getAttribute("control"))
			{
				var html = [];
				
	 			for (var c=0; c < element.childNodes.length; c++)
				{
					var node = element.childNodes[c];

					if(node.tagName == "DIV")
					{
			        	html.push('<div class="ui-accordion-group">');
				        html.push('	<h3 class="ui-accordion-header"><a href="#">' + node.title + '</a></h3>');					
						html.push('	 <div class="ui-accordion-content">');					
						html.push(node.innerHTML);
						html.push(' </div>');
				        html.push('</div>');					
					}
				}

				element.innerHTML = html.join(' ');
	        	jQuery("#" + element.id).accordion(options);
			}
			
		}
	}
});
