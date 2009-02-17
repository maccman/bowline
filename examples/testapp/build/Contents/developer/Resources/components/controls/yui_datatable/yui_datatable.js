
App.UI.registerUIComponent('control','yui_datatable',
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
		
		/*
		*	this.getAttributes passes an array of object literals, each being a valid argument to the UI component. 
		*/
		this.getAttributes = function()
		{
	        return [{name: "", 
						optional: true, 
						description: ""
					}
	        ];
		}
		
		/*
		*	this.getControlJS will pass an array of files to a dyanmic loader. 
		*/
		this.getControlJS = function()
		{
			// the file, "assets/data.js" contains an object with dummy data in it.
			
			return ['../../../common/js/yahoo-min.js','assets/data.js']
		}
		
		/*
		*	this.getControlCSS will pass an array of files to a dyanmic loader. 
		*/		
		this.getControlCSS = function()
		{
			return ['css/datatable.css']
		}

		/*
		*	this.getActions will pass an array of valid "actions" which determine 
		*	the provilaged members of this class that are accessible from the "on" expression. 
		*/
		this.getActions = function()
		{
			return ['addRow',
				    'addRows',
				    'cancelCellEditor',
				    'clearTextSelection',
				    'DataTable._cloneObject',
					'DataTable._destroyColumnDragTargetEl',
					'DataTable._destroyColumnResizerProxyEl',
					'DataTable._initColumnDragTargetEl',
					'DataTable._initColumnResizerProxyEl',
					'DataTable.editCheckbox',
					'DataTable.editDate',
					'DataTable.editDropdown',
					'DataTable.editRadio',
					'DataTable.editTextarea',
					'DataTable.editTextbox',
					'DataTable.formatButton',
					'DataTable.formatCheckbox',
					'DataTable.formatCurrency',
					'DataTable.formatDate',
					'DataTable.formatDefault',
					'DataTable.formatDropdown',
					'DataTable.formatEmail',
					'DataTable.formatLink',
					'DataTable.formatNumber',
					'DataTable.formatRadio',
					'DataTable.formatText',
					'DataTable.formatTextarea',
					'DataTable.formatTextbox',
					'DataTable.formatTheadCell',
					'DataTable.validateNumber',
					'deleteRow',
					'deleteRows',
					'destroy',
					'destroyCellEditor',
					'disable',
					'doBeforeLoadData',
					'doBeforePaginatorChange',
					'doBeforeShowCellEditor',
					'doBeforeSortColumn',
					'focus',
					'focusTbodyEl',
					'focusTheadEl',
					'formatCell',
					'getAboveTdEl',
					'getBelowTdEl',
					'getBody',
					'getCell',
					'getCellEditor',
					'getColumn',
					'getColumnById',
					'getColumnSet',
					'getColumnSortDir',
					'getContainerEl',
					'getDataSource',
					'getFirstTdEl',
					'getFirstTrEl',
					'getId',
					'getLastSelectedCell',
					'getLastSelectedRecord',
					'getLastTdEl',
					'getLastTrEl',
					'getMsgTbodyEl',
					'getMsgTdEl',
					'getNextTdEl',
					'getNextTrEl',
					'getPreviousTdEl',
					'getPreviousTrEl',
					'getRecord',
					'getRecordIndex',
					'getRecordSet',
					'getRow',
					'getSelectedCells',
					'getSelectedColumns',
					'getSelectedRows',
					'getSelectedTdEls',
					'getSelectedTrEls',
					'getState',
					'getTableEl',
					'getTbodyEl',
					'getTdEl',
					'getTdLinerEl',
					'getTheadEl',
					'getThEl',
					'getThLinerEl',
					'getTrEl',
					'getTrIndex',
					'handleDataReturnPayload',
					'hideColumn',
					'hideTableMessage',
					'highlightCell',
					'highlightColumn',
					'highlightRow',
					'initAttributes',
					'initializeTable',
					'insertColumn',
					'isSelected',
					'onDataReturnAppendRows',
					'onDataReturnInitializeTable',
					'onDataReturnInsertRows',
					'onDataReturnReplaceRows',
					'onDataReturnSetRecords',
					'onDataReturnSetRows',
					'onEditorBlockEvent',
					'onEditorBlurEvent',
					'onEditorUnblockEvent',
					'onEventCancelCellEditor',
					'onEventEditCell',
					'onEventFormatCell',
					'onEventHighlightCell',
					'onEventHighlightColumn',
					'onEventHighlightRow',
					'onEventSaveCellEditor',
					'onEventSelectCell',
					'onEventSelectColumn',
					'onEventSelectRow',
					'onEventShowCellEditor',
					'onEventSortColumn',
					'onEventUnhighlightCell',
					'onEventUnhighlightColumn',
					'onEventUnhighlightRow',
					'onPaginatorChange',
					'onPaginatorChangeRequest',
					'onShow',
					'refreshView',
					'removeColumn',
					'render',
					'renderPaginator',
					'reorderColumn',
					'resetCellEditor',
					'saveCellEditor',
					'select',
					'selectCell',
					'selectColumn',
					'selectRow',
					'setColumnWidth',
					'showCellEditor',
					'showColumn',
					'showTableMessage',
					'sortColumn',
					'toString',
					'undisable',
					'unhighlightCell',
					'unhighlightColumn',
					'unhighlightRow',
					'unselectAllCells',
					'unselectAllRows',
					'unselectCell',
					'unselectColumn',
					'unselectRow',
					'updateCell',
					'updateRow',
					'validateColumnWidths',
					'update' /* not part of YUI, see function comment... */
					]
		}

		/*
		*	custom actions...
		*/
		
			this.addRow = function(value)
			{
				this.dataTable.addRow(App.getActionValue(value, this.options["property"]), App.getActionValue(value, "index"));
			}  
			
			this.addRows = function(value)
			{
				this.dataTable.addRows(App.getActionValue(value, this.options["property"]), App.getActionValue(value, "index"));
			}

			this.cancelCellEditor = function(value)
			{
				this.dataTable.cancelCellEditor(); 
			}

			this.clearTextSelection = function(value)
			{
				this.dataTable.clearTextSelection();
			}

			this.DataTable = {};

			this.DataTable._cloneObject = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.DataTable._destroyColumnDragTargetEl = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.DataTable._destroyColumnResizerProxyEl = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.DataTable._initColumnDragTargetEl = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.DataTable._initColumnResizerProxyEl = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.DataTable.editCheckbox = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.DataTable.editDate = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.DataTable.editDropdown = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.DataTable.editRadio = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.DataTable.editTextarea = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.DataTable.editTextbox = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.DataTable.formatButton = function(value)
			{
				this.dataTable.DataTable.formatButton(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData")); 
			}

			this.DataTable.formatCheckbox = function(value)
			{
				this.dataTable.DataTable.formatCheckbox(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData")); 
			}

			this.DataTable.formatCurrency = function(value)
			{
				this.dataTable.DataTable.formatCurrency(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData"));
			}

			this.DataTable.formatDate = function(value)
			{
				this.dataTable.DataTable.formatDate(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData")); 
			}

			this.DataTable.formatDefault = function(value)
			{
				this.dataTable.DataTable.formatDefault(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData")); 
			}

			this.DataTable.formatDropdown = function(value)
			{
				this.dataTable.DataTable.formatDropdown(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData")); 
			}

			this.DataTable.formatEmail = function(value)
			{
				this.dataTable.DataTable.formatEmail(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData")); 
			}

			this.DataTable.formatLink = function(value)
			{
				this.dataTable.DataTable.formatLink(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData")); 
			}

			this.DataTable.formatNumber = function(value)
			{
				this.dataTable.DataTable.formatNumber(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData"));
			}

			this.DataTable.formatRadio = function(value)
			{
				this.dataTable.DataTable.formatRadio(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData"));;
			}

			this.DataTable.formatText = function(value)
			{
				this.dataTable.DataTable.formatText(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData"));;
			}

			this.DataTable.formatTextarea = function(value)
			{
				this.dataTable.DataTable.formatTextarea(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData"));
			}

			this.DataTable.formatTextbox = function(value)
			{
				this.dataTable.DataTable.formatTextbox(App.getActionValue(value, "el"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData"));
			}

			this.DataTable.formatTheadCell = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.DataTable.validateNumber = function(value)
			{
				this.dataTable.DataTable.validateNumber(App.getActionValue(value, "oData"));
			}

			this.deleteRow = function(value)
			{
				this.dataTable.deleteRow(App.getActionValue(value));
			}

			this.deleteRows = function(value)
			{
				if(App.getActionValue(value, "count"))
				{
					this.dataTable.deleteRows(App.getActionValue(value, "row"), App.getActionValue(value, "count")); 
				}
				else
				{
					this.dataTable.deleteRows(App.getActionValue(value, "row"), this.dataTable.getRecordSet().getLength());
				}
			}

			this.destroy = function(value)
			{
				this.dataTable.destroy();
			}

			this.destroyCellEditor = function(value)
			{
				this.dataTable.destroyCellEditor();
			}

			this.disable = function(value)
			{
				this.dataTable.disable();
			}

			this.doBeforeLoadData = function(value)
			{
				this.dataTable.doBeforeLoadData(App.getActionValue(value, "sRequest"), App.getActionValue(value, "oResponse"), App.getActionValue(value, "oPayload"));
			}

			this.doBeforePaginatorChange = function(value)
			{
				this.dataTable.doBeforePaginatorChange(App.getActionValue(value, "oPaginatorState"));
			}

			this.doBeforeShowCellEditor = function(value)
			{
				this.dataTable.doBeforeShowCellEditor(App.getActionValue(value, "oCellEditor"));
			}

			this.doBeforeSortColumn = function(value)
			{
				this.dataTable.doBeforeSortColumn(App.getActionValue(value, "oColumn"), App.getActionValue(value, "sSortDir"));
			}

			this.focus = function(value)
			{
				this.dataTable.focus();
			}

			this.focusTbodyEl = function(value)
			{
				this.dataTable.focusTbodyEl();
			}

			this.focusTheadEl = function(value)
			{
				this.dataTable.formatCell(App.getActionValue(value, "elCell"), App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn")); 
			}

			this.formatCell = function(value)
			{
				this.dataTable.getAboveTdEl(App.getActionValue(value, "cell"));
			}

			this.getAboveTdEl = function(value)
			{
				return this.dataTable.getBelowTdEl(App.getActionValue(value, "cell"));
			}

			this.getBelowTdEl = function(value)
			{
				return this.dataTable.getBelowTdEl(App.getActionValue(value, "cell"));
			}

			this.getBody = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.getCell = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.getCellEditor = function(value)
			{
				return this.dataTable.getCellEditor();
			}

			this.getColumn = function(value)
			{
				return this.dataTable.getColumn(App.getActionValue(value, "column"));
			}

			this.getColumnById = function(value)
			{
				return this.dataTable.getColumnById(App.getActionValue(value, "column"));
			}

			this.getColumnSet = function(value)
			{
				return this.dataTable.getColumnSet();
			}

			this.getColumnSortDir = function(value)
			{
				return this.dataTable.getColumnSortDir(App.getActionValue(value, "oColumn"), App.getActionValue(value, "oSortedBy"));
			}

			this.getContainerEl = function(value)
			{
				return this.dataTable.getContainerEl();
			}

			this.getDataSource = function(value)
			{
				return this.dataTable.getDataSource();
			}

			this.getFirstTdEl = function(value)
			{
				return this.dataTable.getFirstTdEl(App.getActionValue(value, "row"));
			}

			this.getFirstTrEl = function(value)
			{
				return this.dataTable.getFirstTrEl();
			}

			this.getId = function(value)
			{
				return this.dataTable.getId();
			}

			this.getLastSelectedCell = function(value)
			{
				return this.dataTable.getLastSelectedCell();
			}

			this.getLastSelectedRecord = function(value)
			{
				return this.dataTable.getLastSelectedRecord();
			}

			this.getLastTdEl = function(value)
			{
				return this.dataTable.getLastTdEl();
			}

			this.getLastTrEl = function(value)
			{
				return this.dataTable.getLastTrEl();
			}

			this.getMsgTbodyEl = function(value)
			{
				return this.dataTable.getMsgTbodyEl();
			}

			this.getMsgTdEl = function(value)
			{
				return this.dataTable.getMsgTdEl();
			}

			this.getNextTdEl = function(value)
			{
				return this.dataTable.getNextTdEl(App.getActionValue(value, "cell"));
			}

			this.getNextTrEl = function(value)
			{
				return this.dataTable.getNextTrEl(App.getActionValue(value, "row"));
			}

			this.getPreviousTdEl = function(value)
			{
				return this.dataTable.getPreviousTdEl(App.getActionValue(value, "cell"));
			}

			this.getPreviousTrEl = function(value)
			{
				return this.dataTable.getPreviousTrEl(App.getActionValue(value, "row"));
			}

			this.getRecord = function(value)
			{
				return this.dataTable.getRecord(App.getActionValue(value, "row"));
			}

			this.getRecordIndex = function(value)
			{
				return this.dataTable.getRecordIndex(App.getActionValue(value, "row"));
			}

			this.getRecordSet = function(value)
			{
				return this.dataTable.getRecordSet();
			}

			this.getRow = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.getSelectedCells = function(value)
			{
				return this.dataTable.getSelectedCells();
			}

			this.getSelectedColumns = function(value)
			{
				return this.dataTable.getSelectedColumns();
			}

			this.getSelectedRows = function(value)
			{
				return this.dataTable.getSelectedRows();
			}

			this.getSelectedTdEls = function(value)
			{
				return this.dataTable.getSelectedTdEls();
			}

			this.getSelectedTrEls = function(value)
			{
				return this.dataTable.getSelectedTrEls();
			}

			this.getState = function(value)
			{
				return this.dataTable.getState();
			}

			this.getTableEl = function(value)
			{
				return this.dataTable.getTableEl();
			}

			this.getTbodyEl = function(value)
			{
				return this.dataTable.getTbodyEl();
			}

			this.getTdEl = function(value)
			{
				return this.dataTable.getTdEl(App.getActionValue(value, "row"));
			}

			this.getTdLinerEl = function(value)
			{
				return this.dataTable.getTdLinerEl(App.getActionValue(value, "row"));
			}

			this.getTheadEl = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.getThEl = function(value)
			{
				return this.dataTable.getThEl(App.getActionValue(value, "theadCell"));
			}

			this.getThLinerEl = function(value)
			{
				return this.dataTable.getThLinerEl(App.getActionValue(value, "theadCell"));
			}

			this.getTrEl = function(value)
			{
				return this.dataTable.getTrEl(App.getActionValue(value, "row"));
			}

			this.getTrIndex = function(value)
			{
				return this.dataTable.getTrIndex(App.getActionValue(value, "row"));
			}

			this.handleDataReturnPayload = function(value)
			{
				return this.dataTable.handleDataReturnPayload(App.getActionValue(value, "oRequest"), App.getActionValue(value, "oResponse"), App.getActionValue(value, "oPayload")); 
			}

			this.hideColumn = function(value)
			{
				this.dataTable.hideColumn(App.getActionValue(value, "oColumn"));
			}

			this.hideTableMessage = function(value)
			{
				this.dataTable.hideTableMessage();
			}

			this.highlightCell = function(value)
			{
				this.dataTable.highlightCell(App.getActionValue(value, "row"));
			}

			this.highlightColumn = function(value)
			{
				this.dataTable.highlightColumn(App.getActionValue(value, "column"));
			}

			this.highlightRow = function(value)
			{
				this.dataTable.highlightRow(App.getActionValue(value, "row"));
			}

			this.initAttributes = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.initializeTable = function(value)
			{
				this.dataTable.initializeTable();
			}

			this.insertColumn = function(value)
			{
				this.dataTable.insertColumn(App.getActionValue(value, "oColumn"), App.getActionValue(value, "index"));
			}

			this.isSelected = function(value)
			{
				return this.dataTable.isSelected(App.getActionValue(value, "o"));
			}

			this.onDataReturnAppendRows = function(value)
			{
				this.dataTable.onDataReturnAppendRows(App.getActionValue(value, "sRequest"), App.getActionValue(value, "oResponse"), App.getActionValue(value, "oPayload"));
			}

			this.onDataReturnInitializeTable = function(value)
			{
				this.dataTable.onDataReturnInitializeTable(App.getActionValue(value, "sRequest"), App.getActionValue(value, "oResponse"), App.getActionValue(value, "oPayload"));
			}

			this.onDataReturnInsertRows = function(value)
			{
				this.dataTable.onDataReturnInsertRows(App.getActionValue(value, "sRequest"), App.getActionValue(value, "oResponse"), App.getActionValue(value, "oPayload"));
			}

			this.onDataReturnReplaceRows = function(value)
			{
				this.dataTable.onDataReturnReplaceRows(App.getActionValue(value, "oRequest"), App.getActionValue(value, "oResponse"), App.getActionValue(value, "oPayload"));
			}

			this.onDataReturnSetRecords = function(value)
			{
				this.dataTable.onDataReturnSetRows(App.getActionValue(value, "oRequest"), App.getActionValue(value, "oResponse"), App.getActionValue(value, "oPayload"));
			}

			this.onDataReturnSetRows = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.onEditorBlockEvent = function(value)
			{
				this.dataTable.onEditorBlockEvent(App.getActionValue(value, "oArgs"));
			}

			this.onEditorBlurEvent = function(value)
			{
				this.dataTable.onEditorBlurEvent(App.getActionValue(value, "oArgs"));
			}

			this.onEditorUnblockEvent = function(value)
			{
				this.dataTable.onEditorUnblockEvent(App.getActionValue(value, "oArgs")); 
			}

			this.onEventCancelCellEditor = function(value)
			{
				this.dataTable.onEventCancelCellEditor();
			}

			this.onEventEditCell = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.onEventFormatCell = function(value)
			{
				this.dataTable.onEventFormatCell(App.getActionValue(value, "oArgs").event, App.getActionValue(value, "oArgs").target); 
			}

			this.onEventHighlightCell = function(value)
			{
				this.dataTable.onEventHighlightCell(App.getActionValue(value, "oArgs").event, App.getActionValue(value, "oArgs").target);
			}

			this.onEventHighlightColumn = function(value)
			{
				this.dataTable.onEventHighlightColumn(App.getActionValue(value, "oArgs").event, App.getActionValue(value, "oArgs").target);
			}

			this.onEventHighlightRow = function(value)
			{
				this.dataTable.onEventHighlightRow(App.getActionValue(value, "oArgs").event, App.getActionValue(value, "oArgs").target); 
			}

			this.onEventSaveCellEditor = function(value)
			{
				this.dataTable.onEventSaveCellEditor();
			}

			this.onEventSelectCell = function(value)
			{
				this.dataTable. onEventSelectCell(App.getActionValue(value, "oArgs").event, App.getActionValue(value, "oArgs").target);
			}

			this.onEventSelectColumn = function(value)
			{
				this.dataTable.onEventSelectColumn(App.getActionValue(value, "oArgs").event, App.getActionValue(value, "oArgs").target);
			}

			this.onEventSelectRow = function(value)
			{
				this.dataTable.onEventSelectRow(App.getActionValue(value, "oArgs").event, App.getActionValue(value, "oArgs").target); 
			}

			this.onEventShowCellEditor = function(value)
			{
				this.dataTable.onEventShowCellEditor(App.getActionValue(value, "oArgs").event, App.getActionValue(value, "oArgs").target); 
			}

			this.onEventSortColumn = function(value)
			{
				this.dataTable.onEventSortColumn(App.getActionValue(value, "oArgs").event, App.getActionValue(value, "oArgs").target);
			}

			this.onEventUnhighlightCell = function(value)
			{
				this.dataTable.onEventUnhighlightCell(App.getActionValue(value, "oArgs").event, App.getActionValue(value, "oArgs").target); 
			}

			this.onEventUnhighlightColumn = function(value)
			{
				this.dataTable.onEventUnhighlightColumn(App.getActionValue(value, "oArgs").event, App.getActionValue(value, "oArgs").target);
			}

			this.onEventUnhighlightRow = function(value)
			{
				this.dataTable.onEventUnhighlightRow(App.getActionValue(value, "oArgs").event, App.getActionValue(value, "oArgs").target);
			}

			this.onPaginatorChange = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.onPaginatorChangeRequest = function(value)
			{
				this.dataTable.onPaginatorChangeRequest(App.getActionValue(value, "oPaginatorState")); 
			}

			this.onShow = function(value)
			{
				this.dataTable.onShow();
			}

			this.refreshView = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.removeColumn = function(value)
			{
				return this.dataTable.removeColumn(App.getActionValue(value, "oColumn"));
			}

			this.render = function(value)
			{
				this.dataTable.render();
			}

			this.renderPaginator = function(value)
			{
				this.dataTable.renderPaginator();
			}

			this.reorderColumn = function(value)
			{
				return this.dataTable.reorderColumn(App.getActionValue(value, "oColumn"), App.getActionValue(value, "index"));
			}

			this.resetCellEditor = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.saveCellEditor = function(value)
			{
				this.dataTable.saveCellEditor();
			}

			this.select = function(value)
			{
				// method signature is marked as protected or deprecated...
			}

			this.selectCell = function(value)
			{
				this.dataTable.selectCell(App.getActionValue(value, "cell"));
			}

			this.selectColumn = function(value)
			{
				this.dataTable.selectColumn(App.getActionValue(value, "column"));
			}

			this.selectRow = function(value)
			{
				this.dataTable.selectRow(App.getActionValue(value, "row"));
			}

			this.setColumnWidth = function(value)
			{
				this.dataTable.setColumnWidth(App.getActionValue(value, "oColumn"), App.getActionValue(value, "nWidth"));
			}

			this.showCellEditor = function(value)
			{
				this.dataTable.showCellEditor(App.getActionValue(value, "elCell"));
			}

			this.showColumn = function(value)
			{
				this.dataTable.showColumn(App.getActionValue(value, "oColumn"));
			}

			this.showTableMessage = function(value)
			{
				this.dataTable.showTableMessage(App.getActionValue(value, "sHTML"), App.getActionValue(value, "sClassName"));
			}

			this.sortColumn = function(value)
			{
				this.dataTable.sortColumn(App.getActionValue(value, "oColumn"), App.getActionValue(value, "sDir"));
			}

			this.toString = function(value)
			{
				return this.dataTable.toString();
			}

			this.undisable = function(value)
			{
				this.dataTable.undisable();
			}

			this.unhighlightCell = function(value)
			{
				this.dataTable.unhighlightCell(App.getActionValue(value, "cell"));
			}

			this.unhighlightColumn = function(value)
			{
				this.dataTable.unhighlightColumn(App.getActionValue(value, "column"));
			}

			this.unhighlightRow = function(value)
			{
				this.dataTable.unhighlightRow(App.getActionValue(value, "row"));
			}

			this.unselectAllCells = function(value)
			{
				this.dataTable.unselectAllCells(); 
			}

			this.unselectAllRows = function(value)
			{
				this.dataTable.unselectAllRows();
			}

			this.unselectCell = function(value)
			{
				this.dataTable.unselectCell(App.getActionValue(value, "cell"));
			}

			this.unselectColumn = function(value)
			{
				this.dataTable.unselectColumn(App.getActionValue(value, "column"));
			}

			this.unselectRow = function(value)
			{
				this.dataTable.unselectRow(App.getActionValue(value, "row"));
			}

			this.updateCell = function(value)
			{
				this.dataTable.updateCell(App.getActionValue(value, "oRecord"), App.getActionValue(value, "oColumn"), App.getActionValue(value, "oData")); 
			}

			this.updateRow = function(value)
			{
				this.dataTable.updateRow(App.getActionValue(value, "row"), App.getActionValue(value, "oData"));
			}

			this.validateColumnWidths = function(value)
			{
				this.dataTable.validateColumnWidths(App.getActionValue(value, "oArg").column);
			}

			this.update = function(value)
			{
				// to-do... there's a better way to do this i'm sure... anyone YUI-savvy is welcomed to chime in here... 

				this.dataTable.getRecordSet().deleteRecords(0, this.dataTable.getRecordSet().getLength());
				this.dataTable.getRecordSet().addRecords(App.getActionValue(value, this.options["property"]));
				this.dataTable.render();
			}

		this.build = function(element, options)
		{
	    	var dataSource = options["property"];
			var columnDefs = [];

			this.options = options;
			this.id = element.id;

			if(!swiss("#" + this.id).get(0).getAttribute("control"))
			{
				this.dataSource = new YAHOO.util.DataSource(options.source || {}); 

				this.dataSource.responseType = YAHOO.util.DataSource.TYPE_HTMLTABLE; 
				this.dataSource.responseSchema = options.responseSchema || {};
				this.dataTable = new YAHOO.widget.DataTable(this.id, options.columnDefs || {}, this.dataSource);

				return;
			}

			this.dataTable = null;
			this.dataSource = new YAHOO.util.DataSource({});
			this.dataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			this.dataSource.responseSchema = {};
			this.dataSource.responseSchema.fields = [];			

	 		for (var c=0,len=element.childNodes.length;c<len;c++)
			{
				var node = element.childNodes[c];

				if(node.tagName == "COLUMN")
				{
					var params = {};

					if(node.getAttribute("label")) 
					{ 
						params.label = node.getAttribute("label"); 
					}
					
					if(node.getAttribute("formatter")) {
						
						switch(node.getAttribute("formatter").toLowerCase())
						{
							case "date": params.formatter = YAHOO.widget.DataTable.formatDate; 
							break;
							case "number": params.formatter = YAHOO.widget.DataTable.formatNumber;
							break;
							case "currency": params.formatter = YAHOO.widget.DataTable.formatCurrency;
							break;
						}
					}

					if(node.getAttribute("sortable")) { params.sortable = node.getAttribute("sortable"); }
					if(node.getAttribute("resizeable")) { params.resizeable = node.getAttribute("resizeable"); }
					if(node.getAttribute("abbr")) { params.abbr = node.getAttribute("abbr"); }
					if(!App.Browser.isIE)
					{
						if(node.getAttribute("children")) { params.children = node.getAttribute("children"); } // does not work in IE because IE creates an object by this name...
					}
					else
					{
						if(node.getAttribute("children")) { params.children = node.getAttribute("colChildren"); } // does not work in IE because IE creates an object by this name...
					}
					if(node.getAttribute("className")) { params.className = node.getAttribute("className"); }
					if(node.getAttribute("editor")) { params.editor = node.getAttribute("editor"); }
					if(node.getAttribute("hidden")) { params.hidden = node.getAttribute("hidden"); }
					if(node.getAttribute("maxAutoWidth")) { params.maxAutoWidth = node.getAttribute("maxAutoWidth"); }
					if(node.getAttribute("minWidth")) { params.minWidth = node.getAttribute("minWidth"); }
					if(node.getAttribute("selected")) { params.selected = node.getAttribute("selected"); }
					if(node.getAttribute("sortOptions.defaultDir")) { if(!params.sortOptions) { params.sortOptions = {};} params.sortOptions.defaultDir = node.getAttribute("sortOptions.defaultDir"); }
					if(node.getAttribute("sortOptions.sortFunction")) { if(!params.sortOptions) { params.sortOptions = {};} params.sortOptions.sortFunction = node.getAttribute("sortOptions.defaultDir"); }					
					if(node.getAttribute("width")) { params.width = node.getAttribute("width"); }																																																						

					if(node.getAttribute("key")) { params.key = node.getAttribute("key"); this.dataSource.responseSchema.fields.push(params.key); }
					
					columnDefs.push(params);
					
				}
			}

			element.innerHTML = ""; /* clear the faux markup... */
			
	        this.dataTable = new YAHOO.widget.DataTable(element.id,
	               columnDefs, this.dataSource, { caption: element.getAttribute("caption") || "" });
	
	        return;

		}
	}
});

