App.UI.registerUIComponent('control','jquery_datepicker',
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
			return [{name: "clearText", 
						optional: true, 
						description: "The text to display for the clear link. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Clear"
					},
					{name: "clearStatus", 
						optional: true, 
						description: "The text to display in the status bar for the clear link. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Erase the current date"
					},					
					{name: "mandatory", 
						optional: true, 
						description: "True if a date must be selected, causing the Clear link to be removed. False if the date is not required.", 
						defaultValue: false
					},					
					{name: "closeText", 
						optional: true, 
						description: "The text to display for the close link. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Close"
					},					
					{name: "closeStatus", 
						optional: true, 
						description: "The text to display in the status bar for the close link. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Close without change"
					},					
					{name: "closeAtTop", 
						optional: true, 
						description: "Position the Clear/Close links at the top (true) or bottom (false).", 
						defaultValue: true
					},					
					{name: "prevText", 
						optional: true, 
						description: "The text to display for the previous month link. This attribute is one of the regionalisation attributes.", 
						defaultValue: "<Prev"
					},				
					{name: "prevStatus", 
						optional: true, 
						description: "The text to display in the status bar for the previous month link. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Show the previous month"
					},						
					{name: "nextText", 
						optional: true, 
						description: "The text to display for the next month link. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Next>"
					},					
					{name: "nextStatus", 
						optional: true, 
						description: "The text to display in the status bar for the next month link. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Show the next month"
					},					
					{name: "hideIfNoPrevNext", 
						optional: true, 
						description: "Normally the previous and next links are disabled when not applicable (see minDate/maxDate). You can hide them altogether by setting this attribute to true.", 
						defaultValue: false
					},					
					{name: "currentText", 
						optional: true, 
						description: "The text to display for the current day link. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Today"
					},					
					{name: "currentStatus", 
						optional: true, 
						description: "The text to display in the status bar for the current day link. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Show the current month"
					},					
					{name: "gotoCurrent", 
						optional: true, 
						description: "If true, the current day link moves to the currently selected date instead of today.", 
						defaultValue: false
					},					
					{name: "navigationAsDateFormat", 
						optional: true, 
						description: "When true the formatDate function is applied to the prevText, nextText, and currentText values before display, allowing them to display the target month names for example.", 
						defaultValue: false
					},					
					{name: "monthNames", 
						optional: true, 
						description: "The list of full month names, as used in the month header on each datepicker and as requested via the dateFormat setting. This attribute is one of the regionalisation attributes.", 
						defaultValue: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
					},					
					{name: "monthNamesShort", 
						optional: true, 
						description: "The list of abbreviated month names, for use as requested via the dateFormat setting. This attribute is one of the regionalisation attributes.", 
						defaultValue: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
					},					
					{name: "changeMonth", 
						optional: true, 
						description: "Allows you to change the month by selecting from a drop-down list. You can disable this feature by setting the attribute to false.", 
						defaultValue: true
					},
					{name: "monthStatus", 
						optional: true, 
						description: "The text to display in the status bar for the month drop-down list. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Show a different month"
					},
					{name: "yearRange", 
						optional: true, 
						description: "Control the range of years displayed in the year drop-down: either relative to current year (-nn:+nn) or absolute (nnnn:nnnn).", 
						defaultValue: "-10:+10"
					},
					{name: "changeYear", 
						optional: true, 
						description: "Allows you to change the year by selecting from a drop-down list. You can disable this feature by setting the attribute to false.", 
						defaultValue: true
					},
					{name: "yearStatus", 
						optional: true, 
						description: "The text to display in the status bar for the year drop-down list. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Show a different year"
					},
					{name: "weekHeader", 
						optional: true, 
						description: "The column header for the week of the year (see showWeeks). This attribute is one of the regionalisation attributes.", 
						defaultValue: "Wk"
					},
					{name: "weekStatus", 
						optional: true, 
						description: "The text to display in the status bar for the week of the year. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Week of the year"
					},
					{name: "dayNames", 
						optional: true, 
						description: "The list of long day names, starting from Sunday, for use as requested via the dateFormat setting. They also appear as popup hints when hovering over the corresponding column headings. This attribute is one of the regionalisation attributes.", 
						defaultValue: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
					},
					{name: "dayNamesShort", 
						optional: true, 
						description: "The list of abbreviated day names, starting from Sunday, for use as requested via the dateFormat setting. This attribute is one of the regionalisation attributes.", 
						defaultValue: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
					},
					{name: "dayNamesMin", 
						optional: true, 
						description: "The list of minimised day names, starting from Sunday, for use as column headers within the datepicker. This attribute is one of the regionalisation attributes.", 
						defaultValue: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
					},
					{name: "firstDay", 
						optional: true, 
						description: "Set the first day of the week: Sunday is 0, Monday is 1, ... This attribute is one of the regionalisation attributes.", 
						defaultValue: 0
					},
					{name: "changeFirstDay", 
						optional: true, 
						description: "Allows you to click on the day names to have the week start on that day. You can disable this feature by setting the attribute to false.", 
						defaultValue: true
					},
					{name: "dayStatus", 
						optional: true, 
						description: "The text to display in the status bar for the day of the week links. Use 'DD' for the full name of the day, or 'D' for its short name. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Set DD as first week day"
					},	
					{name: "highlightWeek", 
						optional: true, 
						description: "If true, the entire week row is highlighted when the mouse hovers over a day.", 
						defaultValue: false
					},
					{name: "showOtherMonths", 
						optional: true, 
						description: "Display dates in other months (non-selectable) at the start or end of the current month.", 
						defaultValue: false
					},
					{name: "dateStatus", 
						optional: true, 
						description: "The text to display in the status bar for the date links. Use any of the date formatting characters (see dateFormat). This attribute is one of the regionalisation attributes.", 
						defaultValue: "Select DD, M d"
					},
					{name: "showWeeks", 
						optional: true, 
						description: "Display the week of the year alongside each month. The column header is specified by the weekHeader setting. The week number is calculated based on the first date shown in each row in the datepicker, and so may not apply to all days in that row. The calculateWeek setting allows you to change the week of the year calculation from the default ISO 8601 implementation.", 
						defaultValue: false
					},
					{name: "calculateWeek", 
						optional: true, 
						description: "Perform the week of the year calculation. This function accepts a Date as a parameter and returns the number of the corresponding week of the year. The default implementation uses the ISO 8601 definition of a week: weeks start on a Monday and the first week of the year contains January 4. This means that up to three days from the previous year may be included in the first week of the current year, and that up to three days from the current year may be included in the last week of the previous year." 
					},
					{name: "numberOfMonths", 
						optional: true, 
						description: "Set how many months to show at once. The value can be a straight integer, or can be a two-element array to define the number of rows and columns to display.", 
						defaultValue: 1
					},																																												
					{name: "stepMonths", 
						optional: true, 
						description: "Set how many months to move when clicking the Previous/Next links.", 
						defaultValue: 1
					},																																												
					{name: "rangeSelect", 
						optional: true, 
						description: "Set to true to allow the selection of a date range on the one date picker, or false to just select a single date. For a date range, the first click sets the start date and a second click sets the end date.", 
						defaultValue: false
					},																																												
					{name: "rangeSeparator", 
						optional: true, 
						description: "Set the text to use to separate the two dates in a date range via the onSelect function.", 
						defaultValue: "-"
					},																																												
					{name: "defaultDate", 
						optional: true, 
						description: "Set the date to display on first opening if the field is blank. Specify either an actual date via a Date object, or relative to today with a number (e.g. +7) or a string of values and periods ('y' for years, 'm' for months, 'w' for weeks, 'd' for days, e.g. '+1m +7d'), or null for today.", 
						defaultValue: null
					},																																												
					{name: "minDate", 
						optional: true, 
						description: "Set a minimum selectable date via a Date object, or relative to today with a number (e.g. +7) or a string of values and periods ('y' for years, 'm' for months, 'w' for weeks, 'd' for days, e.g. '-1y -1m'), or null for no limit.", 
						defaultValue: null
					},																																												
					{name: "maxDate", 
						optional: true, 
						description: "Set a maximum selectable date via a Date object, or relative to today with a number (e.g. +7) or a string of values and periods ('y' for years, 'm' for months, 'w' for weeks, 'd' for days, e.g. '+1m +1w'), or null for no limit.", 
						defaultValue: null
					},																																												
					{name: "dateFormat", 
						optional: true, 
						description: "The format for parsed and displayed dates. This attribute is one of the regionalisation attributes. For a full list of the possible formats see the formatDate function."
					},																																												
					{name: "shortYearCutoff", 
						optional: true, 
						description: "Set the cutoff year for determining the century for a date (used in conjunction with dateFormat 'y'). If a numeric value (0-99) is provided then this value is used directly. If a string value is provided then it is converted to a number and added to the current year. Once the cutoff year is calculated, any dates entered with a year value less than or equal to it are considered to be in the current century, while those greater than it are deemed to be in the previous century.", 
						defaultValue: "+10"
					},																																												
					{name: "initStatus", 
						optional: true, 
						description: "The text to display in the status bar when the datepicker is first opened. This attribute is one of the regionalisation attributes.", 
						defaultValue: "Select a date"
					},																																												
					{name: "showStatus", 
						optional: true, 
						description: "True if a status bar should be shown within the datepicker indicating what each control does. False if no status bar is required.", 
						defaultValue: false
					},																																												
					{name: "statusForDate", 
						optional: true, 
						description: "The function to call to determine the status text for a date within the datepicker. The default function uses the dateStatus value and substitutes in information from the current date."
					},																																												
					{name: "appendText", 
						optional: true, 
						description: "The text to display after each date field, e.g. to show the required format.", 
						defaultValue: ""
					},																																												
					{name: "duration", 
						optional: true, 
						description: "Control the speed at which the datepicker appears, it may be a time in milliseconds, a string representing one of the three predefined speeds ('slow', 'normal', 'fast'), or '' for immediately.", 
						defaultValue: "normal"
					},																																												
					{name: "showOn", 
						optional: true, 
						description: "Have the datepicker appear automatically when the field receives focus ('focus'), appear only when a button is clicked ('button'), or appear when either event takes place ('both').", 
						defaultValue: "focus"
					},																																												
					{name: "showAnim", 
						optional: true, 
						description: "Set the name of the animation used to show/hide the datepicker. Use 'show' (the default), 'slideDown', 'fadeIn', or any of the show/hide jQuery UI effects.", 
						defaultValue: "show"
					},																																												
					{name: "showOptions", 
						optional: true, 
						description: "If using one of the jQuery UI effects for showAnim, you can provide additional settings for that animation via this option.", 
						defaultValue: {}
					},																																												
					{name: "buttonText", 
						optional: true, 
						description: "The text to display on the trigger button. Use in conjunction with showOn equal to 'button' or 'both'.", 
						defaultValue: "..."
					},																																												
					{name: "buttonImage", 
						optional: true, 
						description: "The URL for the popup button image. If set, button text becomes the alt value and is not directly displayed.", 
						defaultValue: ""
					},
					{name: "buttonImageOnly", 
						optional: true, 
						description: "Set to true to place an image after the field to use as the trigger without it appearing on a button.", 
						defaultValue: false
					},																																												
					{name: "beforeShow", 
						optional: true, 
						description: "Can be a function that takes an input field and current datepicker instance and returns a settings (anonymous) object to update the date picker with. It is called just before the datepicker is displayed.", 
						defaultValue: null
					},																																												
					{name: "beforeShowDay", 
						optional: true, 
						description: "The function takes a date as a parameter and must return an array with [0] equal to true/false indicating whether or not this date is selectable and [1] equal to a CSS class name(s) or '' for the default presentation. It is called for each day in the datepicker before is it displayed.", 
						defaultValue: null
					},	
					{name: "altField", 
						optional: true, 
						description: "The jQuery selector for another field that is to be updated with the selected date from the datepicker. Use the altFormat setting below to change the format of the date within this field. Leave as blank for no alternate field.", 
						defaultValue: ""
					},																																												
					{name: "altFormat", 
						optional: true, 
						description: "The dateFormat to be used for the altField above. This allows one date format to be shown to the user for selection purposes, while a different format is actually sent behind the scenes.", 
						defaultValue: ""
					},
					{name: "onSelect", 
						optional: true, 
						description: "Allows you to define your own event when the datepicker is selected. The function receives the selected date(s) as text and the datepicker instance as parameters. this refers to the associated input field.", 
						defaultValue: null
					},																																												
					{name: "onChangeMonthYear", 
						optional: true, 
						description: "Allows you to define your own event when the datepicker moves to a new month and/or year. The function receives the date of the first day of the first displayed month and the datepicker instance as parameters. this refers to the associated input field.", 
						defaultValue: null
					},
					{name: "onClose", 
						optional: true, 
						description: "Allows you to define your own event when the datepicker is closed, whether or not a date is selected. The function receives the selected date(s) as a date or array of dates and the datepicker instance as parameters. this refers to the associated input field.", 
						defaultValue: null
					},																																																														
					{name: "isRTL", 
						optional: true, 
						description: "True if the current language is drawn from right to left. This attribute is one of the regionalisation attributes.", 
						defaultValue: false
					},																																																														
					{name: "constrainInput", 
						optional: true, 
						description: "True if the input field is constrained to the current date format.", 
						defaultValue: true
					}					
					];
		}


		this.enable = function(value)
		{
			jQuery("#" + this.id).datepicker("enable");
		}
		
		this.disable = function(value)
		{
			jQuery("#" + this.id).datepicker("disable");
		}
		
		this.isDisabled = function(value)
		{
			return jQuery("#" + this.id).datepicker("isDisabled");
		}
		
		this.option = function(value)
		{
			jQuery("#" + this.id).datepicker("option", App.getActionValue(value,'settings'));
		}

		this.dialog = function(value)
		{
			// dateText (str) the initial date for the date picker.
			// onSelect (fn) a callback function when a date is selected. The function receives the date text and date picker instance as parameters.
			// settings (obj) the new settings for the date picker.
			
			jQuery("#" + this.id).datepicker("dialog", App.getActionValue(value,'dateText'), App.getActionValue(value,'onSelect'), App.getActionValue(value,'settings')) 
		}		
		
		this.hide = function(value)
		{
			if(App.getActionValue(value,'speed'))
			{
				jQuery("#" + this.id).datepicker("hide", App.getActionValue(value,'speed'));
			}
			else
			{
				jQuery("#" + this.id).datepicker("hide");
			}
		}
				
		this.show = function(value)
		{
			jQuery("#" + this.id).datepicker("show");
		}
		
		this.getDate = function(value)
		{
			return jQuery("#" + this.id).datepicker("getDate");
		}
		
		this.setDate = function(value)
		{
			var date = typeof(App.getActionValue(value,'date')) === "string" ? new Date(Date.parse(App.getActionValue(value,'date'))) : App.getActionValue(value,'date');
			var endDate = typeof(App.getActionValue(value,'endDate')) === "string" ? new Date(Date.parse(App.getActionValue(value,'endDate'))) : App.getActionValue(value,'endDate');

			if(endDate)
			{
				jQuery("#" + this.id).datepicker("setDate", date, endDate);
			}
			else
			{
				
				jQuery("#" + this.id).datepicker("setDate", date);
			}
		}

		this.getActions = function()
		{
			return ['enable','disable','isDisabled','hide','show','setDate'];
		}

		this.build = function(element,options)
		{
			this.options = options;
			this.id = element.id;

			App.UI.remoteLoadCSS(App.docRoot + '../common/css/jquery-themes/ui.all.css');

	        jQuery("#" + element.id).datepicker(options);			
		}
	}
});
