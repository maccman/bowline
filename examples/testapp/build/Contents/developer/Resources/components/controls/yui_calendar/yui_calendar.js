App.UI.registerUIComponent('control','yui_calendar',
{
	create: function()
	{

		this.options = null;
		this.id = null;
		this.cal = null;
		
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
				{name: "pagedate", 
					optional: true, 
					description: "Sets the calendar's visible month and year. If set using a string, the default string format is 'mm/yyyy'. (render required)", 
					defaultValue: new Date()
				},
				{name: "selected", 
					optional: true, 
					description: "Sets the calendar's selected dates. The built-in default date format is MM/DD/YYYY. Ranges are defined using MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD. Any combination of these can be combined by delimiting the string with commas. For example: '12/24/2005,12/25/2005,1/18/2006-1/21/2006'. (render required)"
				},
				{name: "mindate", 
					optional: true, 
					description: "Sets the Calendar's minimum selectable date, either in the form of a Javascript Date object, or a string date. For example: '4/12/2007'. (render required)", 
					defaultValue: null
				},
				{name: "maxdate", 
					optional: true, 
					description: "Sets the Calendar's maximum selectable date, either in the form of a Javascript Date object, or a string date For example '4/12/2007'. (render required)", 
					defaultValue: null
				},
				{name: "title", 
					optional: true, 
					description: "Sets the Calendar's title, displayed at the top of the container.", 
					defaultValue: null
				},
				{name: "close", 
					optional: true, 
					description: "When set to true, displays a close icon that can be used to dismiss the Calendar", 
					defaultValue: null
				},
				{name: "iframe", 
					optional: true, 
					description: "Places an iframe shim underneath the Calendar to prevent select elements from bleeding through", 
					defaultValue: true
				},
				{name: "multi_select", 
					optional: true, 
					description: "Determines whether the Calendar should allow for the selection of multiple dates", 
					defaultValue: false
				},
				{name: "navigator", 
					optional: true, 
					description: "Configures the CalendarNavigator (Year Selector) feature for the Calendar. If set to true, the Calendar's Year Selector functionality is enabled. The CalendarNavigator's configuration can be customized (strings, month format etc.) by setting this property to an object literal as defined in the Navigator Configuration Object documentation. (render required)", 
					defaultValue: null
				},
				{name: "show_weekdays", 
					optional: true, 
					description: "Determines whether to display the weekday headers", 
					defaultValue: true
				},
				{name: "locale_months", 
					optional: true, 
					description: "The format of the month title to be displayed. Possible values are 'short', 'medium', and 'long'. (render required)", 
					defaultValue: "long"
				},
				{name: "locale_weekdays", 
					optional: true, 
					description: "The format of the weekday title to be displayed. Possible values are '1char', 'short', 'medium', and 'long'. (render required)", 
					defaultValue: "short"
				},
				{name: "start_weekday", 
					optional: true, 
					description: "0-6, representing the day that a week begins on (render required)", 
					defaultValue: 0
				},
				{name: "show_week_header", 
					optional: true, 
					description: "Determines whether to display row headers (render required)", 
					defaultValue: false
				},			
				{name: "show_week_footer", 
					optional: true, 
					description: "Determines whether to display row footers (render required)", 
					defaultValue: false
				},	
				{name: "hide_blank_weeks", 
					optional: true, 
					description: "Determines whether to hide extra weeks that are completely outside the current month", 
					defaultValue: false
				},
				{name: "nav_arrow_left", 
					optional: true, 
					description: " The image path used for the left navigation arrow."
				}
			];
		}
		
		this.getControlJS = function()
		{
			return ['js/yahoo.js','js/dom.js','js/event.js','js/calendar.js']
		}
		
		this.getControlCSS = function()
		{
			return ['css/calendar.css']
		}
		
		this.show = function(value)
		{
			swiss('#'+this.id).show();
		}
		
		this.mindate = function(value)
		{
			this.cal.cal.cfg.setProperty("mindate", App.getActionValue(value),false); 
			this.cal.cal.render();
		}
		
		this.value = function(value)
		{
			var val = App.getActionValue(value);
			this.cal.cal.cfg.setProperty("selected",val,false);
			var parts = val.split('/')
			if (parts.length == 3)
			{
				this.cal.cal.cfg.setProperty("pagedate",parts[0] + "/" + parts[2])				
			}
			this.cal.render();
		}
		
		
		this.addMonthRenderer = function(value)
		{
			this.cal.addMonthRenderer(App.getActionValue(value,'month'), App.getActionValue(value,'fnRender'));
		}
		
		this.addMonths = function(value)
		{
			this.cal.addMonths(parseInt(App.getActionValue(value)));
		}
		
		this.addRenderer = function(value)
		{
			this.cal.addRenderer(App.getActionValue(value,'sDates'), App.getActionValue(value,'fnRender'));
		}
		
		this.addWeekdayRenderer = function(value)
		{
			this.cal.addWeekdayRenderer(App.getActionValue(value,'weekday'), App.getActionValue(value,'fnRender'));
		}
		
		this.addYears = function(value)
		{
			this.cal.addYears(parseInt(App.getActionValue(value)));
		}
		
		this.applyListeners = function(value)
		{
			this.cal.applyListeners();
		}
		
		this.buildDayLabel = function(value)
		{
			return this.cal.buildDayLabel(App.getActionValue(value));
		}
		
		this.buildMonthLabel = function(value)
		{
			return this.cal.buildMonthLabel();
		}
		
		this.buildWeekdays = function(value)
		{
			return this.cal.buildWeekdays(App.getActionValue(value));
		}
		
		this.clear = function(value)
		{
			this.cal.clear();
		}
		
		this.clearAllBodyCellStyles = function(value)
		{
			this.cal.clearAllBodyCellStyles(App.getActionValue(value));
		}
		
		this.clearElement = function(value)
		{
			this.cal.clearElement(App.getActionValue(value));
		}
		
		this.configClose = function(value)
		{
			this.cal.configClose();
		}
		
		this.configIframe = function(value)
		{
			this.cal.configIframe();
		}
		
		this.configLocale = function(value)
		{
			this.cal.configLocale();
		}
		
		this.configLocaleValues = function(value)
		{
			this.cal.configLocaleValues();
		}
		
		this.configMaxDate = function(value)
		{
			this.cal.configMaxDate();
		}
		
		this.configMinDate = function(value)
		{
			this.cal.configMinDate();
		}
		
		this.configNavigator = function(value)
		{
			this.cal.configNavigator();
		}
		
		this.configOptions = function(value)
		{
			this.cal.configOptions();
		}
		
		this.configPageDate = function(value)
		{
			this.cal.configPageDate();
		}
		
		this.configSelected = function(value)
		{
			this.cal.configSelected();
		}
		
		this.configStrings = function(value)
		{
			this.cal.configStrings();
		}
		
		this.configTitle = function(value)
		{
			this.cal.configTitle();
		}
		
		this.createCloseButton = function(value)
		{
			this.cal.createCloseButton();
		}
		
		this.createTitleBar = function(value)
		{
			this.cal.createTitleBar(App.getActionValue(value));
		}
		
		this.deselect = function(value)
		{
			return this.cal.deselect(App.getActionValue(value));
		}
		
		this.deselectAll = function(value)
		{
			return this.cal.deselectAll();
		}
		
		this.deselectCell = function(value)
		{
			return this.cal.deselectCell(App.getActionValue(value));
		}
		
		this.destroy = function(value)
		{
			this.cal.destroy();
		}
		
		this.doCellMouseOut = function(value)
		{
			this.cal.doCellMouseOut(App.getActionValue(value,'e'), App.getActionValue(value,'cal'));
		}
		
		this.doCellMouseOver = function(value)
		{
			this.cal.doCellMouseOver(App.getActionValue(value,'e'), App.getActionValue(value,'cal'));
		}
		
		this.doNextMonthNav = function(value)
		{
			this.cal.doNextMonthNav(App.getActionValue(value,'e'), App.getActionValue(value,'cal'));
		}
		
		this.doPreviousMonthNav = function(value)
		{
			this.cal.doPreviousMonthNav(App.getActionValue(value,'e'), App.getActionValue(value,'cal'));
		}
		
		this.doSelectCell = function(value)
		{
			this.cal.doSelectCell(App.getActionValue(value,'e'), App.getActionValue(value,'cal'));
		}
		
		this.getCellIndex = function(value)
		{
			return this.cal.getCellIndex(App.getActionValue(value));
		}
		
		this.getDateByCellId = function(value)
		{
			return this.cal.getDateByCellId(App.getActionValue(value));
		}
		
		this.getDateFieldsByCellId = function(value)
		{
			return this.cal.getDateFieldsByCellId(App.getActionValue(value));
		}
		
		this.getIndexFromId = function(value)
		{
			return this.cal.getIndexFromId(App.getActionValue(value));
		}
		
		this.getSelectedDates = function(value)
		{
			return this.cal.getSelectedDates();
		}
		
		this.hide = function(value)
		{
			this.cal.hide();
		}
		
		this.init = function(value)
		{
			this.cal.init(App.getActionValue(value, 'id'), App.getActionValue(value, 'container'), App.getActionValue(value, 'config'));
		}
		
		this.initEvents = function(value)
		{
			this.cal.initEvents();
		}
		
		this.initStyles = function(value)
		{
			this.cal.initStyles();
		}
		
		this.isDateOOB = function(value)
		{
			return this.cal.isDateOOB(App.getActionValue(value));
		}

		this.isDateOOM = function(value)
		{
			this.cal.isDateOOM(App.getActionValue(value));
		}
		
		this.nextMonth = function(value)
		{
			this.cal.nextMonth();
		}
		
		this.nextYear = function(value)
		{
			this.cal.nextYear();
		}
		
		this.previousMonth = function(value)
		{
			this.cal.previousMonth();
		}
		
		this.previousYear = function(value)
		{
			this.cal.previousYear();
		}
		
		this.removeCloseButton = function(value)
		{
			this.cal.removeCloseButton();
		}
		
		this.removeRenderers = function(value)
		{
			this.cal.removeRenderers();
		}
		
		this.removeTitleBar = function(value)
		{
			this.cal.removeTitleBar();
		}
		
		this.render = function(value)
		{
			this.cal.render();
		}
		
		this.renderBody = function(value)
		{
			return this.cal.renderBody(App.getActionValue(value,'workingDate'), App.getActionValue(value,'html'));
		}
		
		this.renderBodyCellRestricted = function(value)
		{
			return this.cal.renderBodyCellRestricted(App.getActionValue(value,'workingDate'), App.getActionValue(value,'cell'));
		}
		
		this.renderCellDefault = function(value)
		{
			this.cal.renderCellDefault(App.getActionValue(value,'workingDate'), App.getActionValue(value,'cell'));
		}
		
		this.renderCellNotThisMonth = function(value)
		{
			return this.cal.renderCellNotThisMonth(App.getActionValue(value,'workingDate'), App.getActionValue(value,'cell'));
		}
		
		this.renderCellStyleHighlight1 = function(value)
		{
			this.cal.renderCellStyleHighlight1(App.getActionValue(value,'workingDate'), App.getActionValue(value,'cell'));
		}
		
		this.renderCellStyleHighlight2 = function(value)
		{
			this.cal.renderCellStyleHighlight2(App.getActionValue(value,'workingDate'), App.getActionValue(value,'cell'));
		}
		
		this.renderCellStyleHighlight3 = function(value)
		{
			this.cal.renderCellStyleHighlight3(App.getActionValue(value,'workingDate'), App.getActionValue(value,'cell'));
		}
		
		this.renderCellStyleHighlight4 = function(value)
		{
			this.cal.renderCellStyleHighlight4(App.getActionValue(value,'workingDate'), App.getActionValue(value,'cell'));
		}
		
		this.renderCellStyleSelected = function(value)
		{
			return this.cal.renderCellStyleSelected(App.getActionValue(value,'workingDate'), App.getActionValue(value,'cell'));
		}
		
		this.renderCellStyleToday = function(value)
		{
			this.cal.renderCellStyleToday(App.getActionValue(value,'workingDate'), App.getActionValue(value,'cell'));
		}
		
		this.renderFooter = function(value)
		{
			return this.cal.renderFooter(App.getActionValue(value,'html'));
		}
		
		this.renderHeader = function(value)
		{
			return this.cal.renderHeader(App.getActionValue(value,'html'));
		}
		
		this.renderOutOfBoundsDate = function(value)
		{
			return this.cal.renderOutOfBoundsDate(App.getActionValue(value,'workingDate'), App.getActionValue(value,'cell'));
		}
		
		this.renderRowFooter = function(value)
		{
			this.cal.renderRowFooter(App.getActionValue(value,'weekNum'), App.getActionValue(value,'cell'));
		}
		
		this.renderRowHeader = function(value)
		{
			this.cal.renderRowHeader(App.getActionValue(value,'weekNum'), App.getActionValue(value,'cell'));
		}
		
		this.reset = function(value)
		{
			this.cal.reset();
		}
		
		this.resetRenderers = function(value)
		{
			this.cal.resetRenderers();
		}
		
		this.select = function(value)
		{
			this.cal.select(App.getActionValue(value));
		}
		
		this.selectCell = function(value)
		{
			return this.cal.selectCell(App.getActionValue(value));
		}
		
		this.setMonth = function(value)
		{
			this.cal.setMonth(App.getActionValue(value));
		}
		
		this.setYear = function(value)
		{
			this.cal.setYear(App.getActionValue(value));
		}
		
		this.show = function(value)
		{
			this.cal.show();
		}
		
		this.styleCellDefault = function(value)
		{
			this.cal.styleCellDefault(App.getActionValue(value,'weekNum'), App.getActionValue(value,'cell'));
		}
		
		this.subtractMonths = function(value)
		{
			this.cal.subtractMonths(App.getActionValue(value));
		}
		
		this.subtractYears = function(value)
		{
			this.cal.subtractYears(App.getActionValue(value));
		}
		
		this.toDate = function(value)
		{
			this.cal.toDate(App.getActionValue(value));
		}
		
		this.toString = function(value)
		{
			this.cal.toString();
		}
		
		this.validate = function(value)
		{
			this.cal.validate();
		}
		
		
		this.getActions = function()
		{
			return ['addMonthRenderer',
				'addMonths',
				'addRenderer',
				'addWeekdayRenderer',
				'addYears',
				'applyListeners',
				'buildDayLabel',
				'buildMonthLabel',
				'buildWeekdays',
				'clear',
				'clearAllBodyCellStyles',
				'clearElement',
				'configClose',
				'configIframe',
				'configLocale',
				'configLocaleValues',
				'configMaxDate',
				'configMinDate',
				'configNavigator',
				'configOptions',
				'configPageDate',
				'configSelected',
				'configStrings',
				'configTitle',
				'createCloseButton',
				'createTitleBar',
				'deselect',
				'deselectAll',
				'deselectCell',
				'destroy',
				'doCellMouseOut',
				'doCellMouseOver',
				'doNextMonthNav',
				'doPreviousMonthNav',
				'doSelectCell',
				'getCellIndex',
				'getDateByCellId',
				'getDateFieldsByCellId',
				'getIndexFromId',
				'getSelectedDates',
				'hide',
				'init',
				'initEvents',
				'initStyles',
				'isDateOOB',
				'isDateOOM',
				'nextMonth',
				'nextYear',
				'previousMonth',
				'previousYear',
				'removeCloseButton',
				'removeRenderers',
				'removeTitleBar',
				'render',
				'renderBody',
				'renderBodyCellRestricted',
				'renderCellDefault',
				'renderCellNotThisMonth',
				'renderCellStyleHighlight1',
				'renderCellStyleHighlight2',
				'renderCellStyleHighlight3',
				'renderCellStyleHighlight4',
				'renderCellStyleSelected',
				'renderCellStyleToday',
				'renderFooter',
				'renderHeader',
				'renderOutOfBoundsDate',
				'renderRowFooter',
				'renderRowHeader',
				'reset',
				'resetRenderers',
				'select',
				'selectCell',
				'setMonth',
				'setYear',
				'show',
				'styleCellDefault',
				'subtractMonths',
				'subtractYears',
				'toDate',
				'toString',
				'validate'
			]
		}
		
		this.build = function(element,options)
		{	

			this.options = options;
			this.id = element.id;
			
			var self = this;
			var inputElement = swiss("#" + this.options.inputId);
			
			this.cal = new YAHOO.widget.Calendar(this.options.inputId, this.id, this.options);
			this.cal.render();
			
			inputElement.on("click", {}, function() { 
				
				self.cal.show();
			
			});
			
			this.cal.selectEvent.subscribe(function(type,args,obj)
	        {
	            var dates=args[0];
	            var date=dates[0];
	            var year=date[0];
	            var month=date[1];
	            var date=date[2];
	            var dateString = month + '/' + date + '/' + year;

				inputElement.get(0).value = dateString;

	        }, this.cal, true);
			
		}
	}
});

