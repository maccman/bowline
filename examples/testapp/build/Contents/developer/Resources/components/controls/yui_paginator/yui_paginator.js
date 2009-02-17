App.UI.registerUIComponent('control','yui_paginator',
{
	create: function()
	{
		this.options = {};
		this.element = null;
		this.pager = null;
		
		this.getAttributes = function()
		{
			return [
			{name: 'message', optional: true, 
			 description: "Message to be sent on page request click"},
			{name: 'rowsPerPage', optional: true, 
			 description: "size of each page",defaultValue:5},
			{name: 'totalRecords', optional: true, 
			 description: "total number of records",defaultValue:0},
			{name: 'firstPageLinkLabel', optional: true, 
			 description: "label for first page"},
			{name: 'lastPageLinkLabel', optional: true, 
			 description: "label for last page"},
			{name: 'previousPageLinkLabel', optional: true, 
			 description: "label for previous page"},
			{name: 'nextPageLinkLabel', optional: true, 
			 description: "label for next page"},
			{name: 'pageLinks', optional: true, defaultValue:5,
			 description: "number of page links to display"},
			{name: 'initialPage', optional: true, defaultValue:1,
			 description: "initial page to display"},
			{name: 'pageReportTemplate', optional: true, defaultValue:'Page {currentPage} of {totalPages}',
			 description: "template for show page x of y"},
			
			{name: 'alwaysVisible', optional: true,defaultValue:false, 
			 description: "show page controls always even if no data"}

		];
		};
		
		this.getVersion = function()
		{
			// leave this as-is and only configure from the build.yml file 
			// and this will automatically get replaced on build of your distro
			return '__VERSION__';
		};
		
		this.getSpecVersion = function()
		{
			return 1.0;
		};

		this.getActions = function()
		{
		};

		/*
		*	this.getControlJS will pass an array of files to a dyanmic loader. 
		*/
		// this.getControlJS = function()
		// {
		// 	return ['js/paginator-min.js']
		// }
				
		/*
		*	this.getControlCSS will pass an array of files to a dyanmic loader. 
		*/		
		this.getControlCSS = function()
		{
			return ['assets/skins/sam/paginator-skin.css']
		}
		this.rowsPerPage = function(value)
		{
			this.options.rowsPerPage = App.getActionValue(value,'rowsPerPage',this.options.rowsPerPage)
			this.pager.setRowsPerPage(parseInt(this.options.rowsPerPage))
			this.pager.render();
		}  
		this.page = function(value)
		{
			this.options.initialPage = App.getActionValue(value,'page',this.options.initialPage)
			this.pager.setPage(parseInt(this.options.initialPage))
			this.pager.render();
		}  
		this.totalRecords = function(value)
		{
			this.options.totalRecords = App.getActionValue(value,'totalRecords',this.options.totalRecords)
			this.pager.setTotalRecords(parseInt(this.options.totalRecords))
			this.pager.render();

		}  
		this.render = function(value)
		{
			this.update(value)
		}
		this.update = function(value)
		{
			this.options.rowsPerPage = App.getActionValue(value,'rowsPerPage',this.options.rowsPerPage)
			this.options.initialPage = App.getActionValue(value,'page',this.options.initialPage)
			this.options.totalRecords = App.getActionValue(value,'totalRecords',this.options.totalRecords);
			this.pager.setRowsPerPage(parseInt(this.options.rowsPerPage))
			this.pager.setPage(parseInt(this.options.initialPage));
			this.pager.setTotalRecords(parseInt(this.options.totalRecords))
			this.pager.render();
			
		}
		this.getActions = function()
		{
			return ['rowsPerPage','page','totalRecords','update','render'];
		} 
		/**
		 * This is called when the control is loaded and applied for a specific element that 
		 * references (or uses implicitly) the control.
		 */
		this.build = function(element,options)
		{
			this.element=element;
			this.options = options;
			this.element.style.display = 'none'

			this.pager = new YAHOO.widget.Paginator({ 
				    rowsPerPage  : parseInt(options.rowsPerPage), 
				    totalRecords : parseInt(options.totalRecords), 
				    containers   : this.element.id, 
				    template     : this.element.innerHTML,
					alwaysVisible: options.alwaysVisible,
					nextPageLinkLabel:options.nextPageLinkLabel,
					previousPageLinkLabel:options.previousPageLinkLabel,
					firstPageLinkLabel:options.firstPageLinkLabel,
					lastPageLinkLabel:options.lastPageLinkLabel,
					initialPage:parseInt(options.initialPage),
					pageReportTemplate    : options.pageReportTemplate,
					pageLinks:parseInt(options.pageLinks)
			});
			var self = this;
			this.pager.subscribe('changeRequest',function(state)
			{
				self.pager.setState(state)
				if (self.options.message != null)
				{
					$MQ(self.options.message,state);
				}
			})

		};
		
	}
});
