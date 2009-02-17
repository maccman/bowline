
App.UI.registerUIComponent('control','jquery_tabs',
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
			return [{name: 'selected', 
						optional: true, 
						description: "Zero-based index of the tab to be selected on initialization. To set all tabs to unselected set this option to null.", 
						defaultValue: 0
					},
					{name: 'unselect', 
						optional: true, 
						description: "Allows a currently selected tab to become unselected upon clicking.",
						defaultValue: false
					},
					{name: 'event', 
						optional: true, 
						description: "The type of event to be used for selecting a tab.",
						defaultValue: "click"
					},
					{name: 'disabled', 
						optional: true, 
						description: "An array containing the position of the tabs (zero-based index) that should be disabled on initialization.",
						defaultValue: []
					},
					{name: 'cookie', 
						optional: true, 
						description: "Store the latest active (clicked) tab in a cookie. The cookie is used to determine the active tab on the next page load. Requires cookie plugin. The object needs to have key/value pairs of the form the cookie plugin expects as options. Available options: { expires: 7, path: '/', domain: 'jquery.com', secure: true }",
						defaultValue: null
					},									
					{name: 'spinner', 
						optional: true, 
						description: "The HTML content of this string is shown in a tab title while remote content is loading. Pass in empty string to deactivate that behavior.",
						defaultValue: "Loading&#8230;"
					},								
					{name: 'cache', 
						optional: true, 
						description: "Wether or not to cache remote tabs content, e.g. load only once or with every click. Cached content is being lazy loaded, e.g once and only once for the first click. Note that to prevent the actual Ajax requests from being cached by the browser you need to provide an extra cache: false flag to ajaxOptions.",
						defaultValue: false
					},								
					{name: 'ajaxOptions', 
						optional: true, 
						description: "Additional Ajax options to consider when loading tab content",
						defaultValue: {}
					},
					{name: 'idPrefix', 
						optional: true, 
						description: "If the remote tab, its anchor element that is, has no title attribute to generate an id from, an id/fragment identifier is created from this prefix and a unique id returned by $.data(el), for example 'ui-tabs-54'.",
						defaultValue: "ui-tabs-"
					},
					{name: 'fx', 
						optional: true, 
						description: "Enable animations for hiding and showing tab panels. The duration option can be a string representing one of the three predefined speeds ('slow', 'normal', 'fast') or the duration in milliseconds to run an animation (default is 'normal').",
						defaultValue: null
					},
					{name: 'tabTemplate', 
						optional: true, 
						description: "HTML template from which a new tab is created and added. The placeholders #{href} and #{label} are replaced with the url and tab label that are passed as arguments to the add method.",
						defaultValue: "<li><a href='#{href}'><span>#{label}</span></a></li>"
					},
					{name: 'panelTemplate', 
						optional: true, 
						description: "HTML template from which a new tab panel is created in case of adding a tab with the add method or when creating a panel for a remote tab on the fly.",
						defaultValue: "<div></div>"
					},
					{name: 'select', 
						optional: true, 
						description: "Function that gets called when clicking a tab.", 
						defaultValue: null
					},
					{name: 'load', 
						optional: true, 
						description: "Function that gets called when clicking a tab.", 
						defaultValue: null
					},
					{name: 'show', 
						optional: true, 
						description: "Function that gets called when a tab is shown.", 
						defaultValue: null
					},
					{name: 'add', 
						optional: true, 
						description: "Function that gets called when a tab was added.", 
						defaultValue: null
					},
					{name: 'remove', 
						optional: true, 
						description: "Function that gets called when a tab was removed.", 
						defaultValue: null
					},
					{name: 'enable', 
						optional: true, 
						description: "Function that gets called when a tab was enabled.", 
						defaultValue: null
					},	
					{name: 'disable', 
						optional: true, 
						description: "Function that gets called when a tab was disabled.", 
						defaultValue: null
					}																																													
					];
		}		
		
		this.enable = function(value)
		{
			jQuery("#" + this.id).tabs("enable", parseInt(App.getActionValue(value)));
		}
		
		this.disable = function(value)
		{
			jQuery("#" + this.id).tabs("disable", parseInt(App.getActionValue(value)));
		}
		
		this.add = function(value)
		{
			jQuery("#" + this.id).tabs("add", 
				App.getActionValue(value,'url'), 
				App.getActionValue(value,'label'), 
				parseInt(App.getActionValue(value,'index')));
				
			if(App.getActionValue(value,'content'))
			{
				jQuery("#" + this.id + " " + App.getActionValue(value,'url')).get(0).innerHTML = App.getActionValue(value,'content');
			}	
		}

		this.remove = function(value)
		{
			jQuery("#" + this.id).tabs("remove",
				parseInt((App.getActionValue(value))));
		}

		this.select = function(value)
		{
			jQuery("#" + this.id).tabs("select",
				parseInt(App.getActionValue(value)));
		}

		this.load = function(value)
		{
			jQuery("#" + this.id).tabs("load", 
				parseInt(App.getActionValue(value)));
		}

		this.url = function(value)
		{
			jQuery("#" + this.id).tabs("url", 
				parseInt(App.getActionValue(value,'index')), 
				App.getActionValue(value,'url'));
		}

		this.reload = function(value)
		{
			jQuery("#" + this.id).tabs("url", 
				parseInt(App.getActionValue(value,'index')), 
				App.getActionValue(value,'url'));

			jQuery("#" + this.id).tabs("load", 
				parseInt(App.getActionValue(value,'index')));

		}

		this.length = function(value)
		{
			return jQuery("#" + this.id).tabs("length");
		}
		
		this.getActions = function()
		{
			return ['add','remove','enable','disable','select','reload','render'];
		}
		
		this.render = function(value)
		{
			var html = [];
			var data = App.getActionValue(value, this.options["property"])

			html.push('<ul>\r\n'); // start of tabs

			swiss.each(data, function(p) {
				
				var li = "<li><a href='";
				li += data[p].url || "#" + data[p].id;
				li += "'>" + data[p].title + "</a></li>\r\n";

				html.push(li);				

			});
		
			html.push('</ul>\r\n'); // end of tabs	
			
			swiss.each(data, function(p) {
			
				html.push('<div id="' + data[p].id + '">\r\n');
				html.push(data[p].content);
	        	html.push('</div>\r\n\r\n');
				
			});
			
			jQuery("#" + this.id).get(0).innerHTML = html.join(' ');
	        jQuery("#" + this.id).tabs(this.options);

		}

		this.build = function(element, options)
		{
			this.options = options;

			this.id = element.id;
			var html = [];

			if(jQuery("#" + this.id).get(0).getAttribute("control"))
			{
				
				html.push('<ul>'); // start of tabs

		 		for (var c=0,len=element.childNodes.length;c<len;c++)
				{
					var node = element.childNodes[c];
				
					if(node.tagName == "DIV")
					{
						var li = "<li><a href='";
					
						li += node.getAttribute("href") || "#" + node.id;
					
						li += "'>" + node.title + "</a></li>";

						html.push(li);
					}
				}	
				
				html.push('</ul>'); // end of tabs				
				
		 		for (var c=0,len=element.childNodes.length;c<len;c++)
				{	
					var node = element.childNodes[c];
					if(node.tagName == "DIV")
					{				
			        	html.push('<div id="' + node.id + '">');
						html.push(node.innerHTML);
			        	html.push('</div>');
					}
				}
			
				element.innerHTML = html.join(' ');
		        jQuery("#" + element.id).tabs(options);		
			}
			
		}
	}
});
