
App.UI.registerUIComponent('control','iterator',
{
	create: function()
	{
		/**
		 * The attributes supported by the controls. This metadata is 
		 * important so that your control can automatically be type checked, documented, 
		 * so the IDE can auto-sense the widgets metadata for autocomplete, etc.
		 */
		
		this.getAttributes = function()
		{
			return [
					{name: 'template', optional: true, description: "Set the template for each row"},
					{name: 'items', optional: true, description: "reference to array within row"},
					{name: 'property', optional: true,  description: "Property for implicit model"}
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
		
		this.getActions = function()
		{
			return ['execute','render'];
		},
		this.render = function(value)
		{
			this.execute(value)
		}
		this.execute = function(value)
		{
			var rowNum = 0;
			var rowCount = 0;
			this.model = new App.TableModel(App.getActionValue(value,this.options.property));
			rowCount = this.model.getRowCount();
			App.Compiler.destroy(this.element,true)
			this._cleanElement();
	
			while ( rowNum < rowCount )
			{
				var row = this.model.getRow(rowNum);
				row['iterator_index'] = rowNum;	
				var html = this.compiledTemplate.call(this,row);
				swiss(this.element).appendHTML(html);
				rowNum++;
			}
			App.Compiler.compileElementChildren(this.element,true)
			this.element.style.display = 'block';
		
		}
		   
		/**
		 * This is called when the control is loaded and applied for a specific element that 
		 * references (or uses implicitly) the control.
		 */
		this.build = function(element,options)
		{
			this.element = element;
			this.options = options
			this.compiledTemplate = App.Wel.compileTemplate(App.Wel.getHtml(this.element));
			this.element.style.display = 'none';
			
			// process items - this is a special case
			// you can specify hard coded array values like items="1,2,3,4"
			// or as a nested iterator you can specify a template value like items="#{users}"
			var items = element.getAttribute('items');
			if (items != null)
			{
				var count = 0
				var rowNum = 0;
				var itemsData = [];
				var rowCount = 0;

				// if nested template
				if (items.indexOf('{') != -1)
				{
					var data = swiss.evalJSON(this.element.getAttribute('items'))
					for (d in data)
					{
						itemsData.push(data[count])
						count++;
					}
					rowCount = count;
				}
				// otherwise hardcoded
				else
				{
					var arrayItems = items.split(',')
					for (var i=0;i<arrayItems.length;i++)
					{
						itemsData.push(arrayItems[i]);
					}
					rowCount = itemsData.length;
				}
				
				this._cleanElement();
				while ( rowNum < rowCount )
				{
					var row = itemsData[rowNum];
					if (typeof(row) != 'object')
					{
						row = {'iterator_value':row,'iterator_index':rowNum};
					}
					else
					{
						row['iterator_index'] = rowNum;											
					}
					html = this.compiledTemplate.call(this,row);
					swiss(this.element).appendHTML(html);
					rowNum++;
				}
				this.element.style.display = 'block';
				return false;
			}
			return false;		
		};
		this._cleanElement = function()
		{

			//innerHTML is READ-ONLY for tables in IE
			if (this.element.tagName.toUpperCase() == 'TABLE' && App.Browser.isIE)
			{
				var nodes = this.element.childNodes;
				for (var i=0;i<nodes.length;i++)
				{
					this.element.removeChild(nodes[i]);
				}
			}
			else
			{
				this.element.innerHTML = '';
			}

		}

	}
});
