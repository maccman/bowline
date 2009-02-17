
App.UI.registerUIComponent('control','tree',
{
	create: function()
	{
		this.getAttributes = function()
		{
			return [
				{name: "property", 
					optional: true, 
					description: "data property for extracting tree data from a message"
				},
				{name: "toggleEffect", 
					optional: true, 
					description: "effect for opening and closing tree folders"
				},
				{name: "clickMessage", 
					optional: true, 
					description: "message to send when a tree node is clicked"
				},

				{name: "theme", 
					optional: true, 
					description: "theme for tree",
					defaultValue:'basic'
				}
				

			]
		};
		
		this.getVersion = function()
		{
			return '__VERSION__';
		};
		
		this.getSpecVersion = function()
		{
			return 1.0;
		};
		
		this.getActions = function()
		{
			return ['render','execute','addNode','removeNode']
		};
		this.render = function(value)
		{
			this.execute(value)
		};
		this.execute = function(value)
		{
			var data = App.getActionValue(value,this.options.property);
			this.model = new App.TreeModel(data)
			this.element.innerHTML = this._buildTree(this.model.getRootNodes());
			
			this._setupListeners();
		};
		this.addNode = function(value)
		{
			var parent = App.getActionValue(value,'parent');
			var node = App.getActionValue(value,'node');
			if (!parent)parent=null;
			if (this.model.addNode(parent,node) == true)
			{
				this.element.innerHTML = this._buildTree(this.model.getRootNodes());
				this._setupListeners();
			}
		};
		this.removeNode = function(value)
		{
			var index = App.getActionValue(value,'index');
			this.model.removeNode(index);
			this.element.innerHTML = this._buildTree(this.model.getRootNodes());
			this._setupListeners();
		};
		
		/**
		 * This is called when the control is loaded and applied for a specific element that 
		 * references (or uses implicitly) the control.
		 */
		this.build = function(element,options)
		{
			this.element = element;
			this.options = options;
			// determine if markup or message
			if (element.innerHTML.trim().length > 0)
			{
				this.model = new App.HTMLTreeModel(this.element.childNodes)
				this.element.innerHTML = this._buildTree(this.model.getRootNodes());
			}
			this._setupListeners();
			App.UI.loadTheme('control','tree',options.theme,element,options);
		};
		this._setupListeners = function()
		{
			var self = this;

			// toggle node display
			swiss('#'+this.element.id+' .app-tree.expandable').on('click',{},function()
			{
				var node = swiss(this).attr('nodeId')
				var parent = swiss(this).attr('parentId');
				var el = swiss('#tree_child_'+parent + '_' + node)
				if (swiss(this).hasClass('open'))
				{
					swiss(this).removeClass('open')
				}
				else
				{
					swiss(this).addClass('open')
				}
				if (self.options.toggleEffect)
				{
					el.effect(self.options.toggleEffect,{})
				}
				else
				{
					if (swiss(this).hasClass('open'))
					{
						el.show();
					}
					else
					{
						el.hide();
					}

				}
			})
			
			if (self.options.clickMessage)
			{
				// send a message on click
				swiss('#'+this.element.id+' .app-tree.clickable').on('click',{},function()
				{
					var nodeId = swiss(this).attr('nodeId')
					var parent = swiss(this).attr('parentId');
					var node = self.model.getNode(nodeId);
					var title = node.title || node.html
					$MQ(self.options.clickMessage,{id:nodeId,parentId:parent,title:title})
				});
			}
		}
		this._buildTree = function(nodes)
		{
			var html = [];
			for (var i=0;i<nodes.length;i++)
			{
				var node = nodes[i];
				var nodeClass = (node.classname)?node.classname:'node';
				var leafClass = (node.classname)?node.classname:'leaf';
				var title = (node.title)?node.title:node.html || 'no title';
				if (node.children)
				{
					html.push('<div parentId="'+this.element.id+'" nodeId="'+node.id+'" class="app-tree '+nodeClass+' clickable expandable" >');
					html.push('		<span style="margin-left:25px">'+title+'</span>');
					html.push('</div>');

					html.push('<div id="tree_child_'+this.element.id + '_' + node.id+'"  style="display:none;margin-left:20px" >');
					var children = this.model.getChildren(node.id)
					this._buildTreeSubNodes(children,html);

					html.push('</div>');
				}
				else
				{
					html.push('<div parentId="'+this.element.id+'"  nodeId="'+node.id+'"  class="app-tree '+leafClass+' clickable">');
					html.push('		<span style="margin-left:25px">'+title+'</span>');
					html.push('</div>');
				}
			}
			return html.join(' ');
		};
		this._buildTreeSubNodes = function(children,html)
		{
			for (var j=0;j<children.length;j++)
			{
				var node = children[j];
				var nodeClass = (node.classname)?node.classname:'node';
				var leafClass = (node.classname)?node.classname:'leaf';
				var title = (node.title)?node.title:node.html || 'no title';

				if (node.children)
				{
					html.push('<div parentId="'+this.element.id+'"  nodeId="'+node.id+'" class="app-tree '+nodeClass+' clickable expandable">');
					html.push('		<span style="margin-left:25px">'+title+'</span>');
					html.push('</div>');

					html.push('<div id="tree_child_'+this.element.id + '_' + node.id+'"  style="display:none;margin-left:20px" >');

					this._buildTreeSubNodes(this.model.getChildren(node.id),html);
					html.push('</div>');
				}
				else
				{
					html.push('<div parentId="'+this.element.id+'"  nodeId="'+node.id+'" class="app-tree '+leafClass+' clickable">');
					html.push('		<span style="margin-left:25px">'+title+'</span>');
					html.push('</div>');
				}
			}
		}

	}
});
