import { ODatabaseService } from "../orientdb/orientdb.service";
import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "ng2-translate/ng2-translate";
import { GridOptions, GridApi } from "ag-grid";
import { NotificationService } from "../services/notification-service";
import { LoadingGridService } from "../services/loading/loading-grid.service";
import { Operation } from "../orientdb/model/operation";
import { BatchType } from "../orientdb/model/batch-type";
import { Observable } from "rxjs";
import { CrudLevel } from "./model/crud-level";
import { Location } from "@angular/common";
import { LinksetProperty } from "./model/linkset-property";
import { GridService } from "../services/grid.service";
import { Button } from "./model/button";
import { RouterOutletService } from "../services/router-outlet-service";
import { BackendService } from "../services/backend/backend.service";
import * as _ from "lodash";
const clone = require("js.clone");

const squel = require('squel');
let cubeGridHtml = require('../common/spinner/cube-grid/cube-grid.component.html');

@Injectable()
export class CrudService {
    public crudLevel: Array<CrudLevel> = [];
    public isHint: Array<boolean> = [];
    public focusedRow;
    public clickOnDeleteBtn: boolean;
    public isDisableDeleteButton: boolean;
    public clickOnEditBtn: boolean;
    public multipleSelectValid = false;
    public querySelectors = null;
    public rowSelectionLinkset = null;
    public linkedClass: string = null;
    public initGridData: Promise<any> = Promise.resolve();
    public crud: Promise<any> = Promise.resolve();
    public parentPath = null;
    public className = null;
    public repositoryName: string = '';
    public dataNotFound = false;
    public successExecute = false;
    public titleColumns = {};
    public model = {};
    public gridOptions: GridOptions = {
        rowSelection: 'multiple',
        rowHeight: 30,
        columnDefs: [],
        rowData: [],
        enableSorting: true
    };

    private limitCrudLevel: number = 3;

    constructor(public databaseService: ODatabaseService,
                public router: Router,
                public route: ActivatedRoute,
                public translate: TranslateService,
                public serviceNotifications: NotificationService,
                public loadingService: LoadingGridService,
                public gridService: GridService,
                public roService: RouterOutletService,
                public location: Location,
                public backendService: BackendService) {
    }

    onFilterChanged(value, gridOptions) {
        gridOptions.api.setQuickFilter(value);
    }

    /**
     * Called when select the row and sets the style to checkbox.
     *
     * @param value
     */
    cellValueChanged(value) {
        let focusedRow = this.focusedRow;
        let operations: Array<Operation> = [
            {
                type: BatchType.UPDATE,
                record: value.data
            }
        ];

        this.databaseService.batch(operations)
            .subscribe(res => {
                this.setCellStyleWhenDataIncorrect(this.gridOptions,
                    { backgroundColor: 'none' }, value);
                this.serviceNotifications.createNotification('success',
                    'message.createSuccessful', 'orientdb.successCreate');

                this.gridService.selectLinksetProperties(this.gridOptions.columnDefs,
                    [focusedRow.data])
                    .then(() => {
                        this.gridOptions.api.setRowData(this.gridOptions.rowData);
                    });

                return Promise.resolve(res);
            }, err => {
                this.setCellStyleWhenDataIncorrect(this.gridOptions,
                    { backgroundColor: '#ffccba' }, value);
                this.serviceNotifications.incorrectData(err.json().errors[0].content);
                return Promise.reject(err);
            });
    }

    /**
     * Sets the cell style if the entered incorrect data.
     *
     * @param gridOptions
     * @param style
     * @param changeCell
     */
    setCellStyleWhenDataIncorrect(gridOptions: GridOptions, style: Object, changeCell) {
        gridOptions.columnDefs.filter(i => {
            if (i['property'] === changeCell.colDef.property) {
                i['cellStyle'] = (params) => {
                    if (params.data['@rid'] === changeCell.data['@rid']) {
                        return style;
                    }
                };
            }
        });
        gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
    }

    /**
     * Called when select the row and sets the style to checkbox.
     *
     * @param gridOptions
     */
    rowSelected(gridOptions: GridOptions) {
        this.changeCheckboxState(gridOptions);
    }

    /**
     * Delete button enabled if the selected record
     * @param api
     */
    disableDeleteButton(api: GridApi) {
        if (api.getSelectedRows().length) {
            this.isDisableDeleteButton = true;
        } else {
            this.isDisableDeleteButton = false;
        }
    }

    /**
     * Replaces overlay loading template.
     *
     * @returns {any|T}
     */
    overlayLoadingTemplate() {
        return cubeGridHtml;
    }

    /**
     * Adds checkbox selection to the columnDefs property.
     *
     * @param columnDefs
     * @param gridOptions
     */
    addColumnCheckbox(gridOptions: GridOptions) {
        gridOptions.columnDefs.unshift({
            headerName: ' ',
            field: 'checkboxSel',
            width: 25,
            checkboxSelection: true,
            headerCellTemplate: () => {
                let that = this;
                let eCell = document.createElement('span');
                eCell.innerHTML =
                    '<div colid="checkboxSel" tabindex="-1" class="ag-cell-no-focus ag-cell ' +
                    'ag-cell-not-inline-editing" style="left: 0px; width: 25px;"><span class="' +
                    'ag-cell-wrapper">' +
                    '   <span class="ag-selection-checkbox" id="select-all">' +
                    '       <img id="all-selected" style="display: none;" src="data:image/png;' +
                    'base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQ' +
                    'BBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHB' +
                    'hY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
                    'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlI' +
                    'DUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZj' +
                    'pSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXg' +
                    'tbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6' +
                    'Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvY' +
                    'mUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy' +
                    '5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDp' +
                    'FQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1w' +
                    'LmRpZDpBRkJCRDU1MTEyM0ExMUU2ODE4MUUyOTNBNTRGQkIxNyIgeG1wTU06SW5zdGFuY2VJR' +
                    'D0ieG1wLmlpZDpBRkJCRDU1MDEyM0ExMUU2ODE4MUUyOTNBNTRGQkIxNyIgeG1wOkNyZWF0b3' +
                    'JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJ' +
                    'vbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2' +
                    'Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDO' +
                    'ERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZX' +
                    'RhPiA8P3hwYWNrZXQgZW5kPSJyIj8+riMaEQAAAL5JREFUeNqUks0JhDAQhSd7tgtLMDUIyTX' +
                    'F2IdNWIE3c0ruYg9LtgcPzvpEF8SfHR8MGR75hpcwRERmrjQXCyutDKUQAkuFu2AUpsyiJ1JK' +
                    '0UtycRgGMsbsPBFYVRVZaw/+7Zu895znOY/j+PPWT7oGp2lirTU3TbPz/4IAAGLALeic47Ztl' +
                    'x7RELHrusPAAwgoy7LlrOuay7I8TXIadYOLouC+7+XgBiP2lTbw0crFGAF9ANq1kS75G8xXgA' +
                    'EAiqu9OeWZ/voAAAAASUVORK5CYII=">' +
                    '       <img id="not-selected" style="display: inline;" src="data:image/png;' +
                    'base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQ' +
                    'BBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHB' +
                    'hY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
                    'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlI' +
                    'DUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZj' +
                    'pSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXg' +
                    'tbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6' +
                    'Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvY' +
                    'mUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy' +
                    '5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDp' +
                    'FQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1w' +
                    'LmRpZDo2MkU1Rjk1NDExNDExMUU2ODhEQkMyRTJGOUNGODYyQyIgeG1wTU06SW5zdGFuY2VJR' +
                    'D0ieG1wLmlpZDo2MkU1Rjk1MzExNDExMUU2ODhEQkMyRTJGOUNGODYyQyIgeG1wOkNyZWF0b3' +
                    'JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJ' +
                    'vbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI1MkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2' +
                    'Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDO' +
                    'ERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZX' +
                    'RhPiA8P3hwYWNrZXQgZW5kPSJyIj8+t+CXswAAAFBJREFUeNrsksENwDAIA023a9YGNqlItki' +
                    'xlAFIn1VOMv5wvACAOxOZWUwsB6Gqswp36QivJNhBRHDhI0f8j9jNrCy4O2twNMobT/7QeQUY' +
                    'AFaKU1yE2OfhAAAAAElFTkSuQmCC">' +
                    '       <img id="not-all-selected" style="display: none;" src="data:image/' +
                    'png;' +
                    'base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQB' +
                    'BZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY' +
                    '2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1' +
                    'ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuM' +
                    'y1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREY' +
                    'geG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjI' +
                    'j4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5' +
                    'hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL' +
                    '3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5' +
                    'jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3O' +
                    'DM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGMjU' +
                    '4MzhGQjEyM0ExMUU2QjAxM0Q2QjZFQ0IzNzM4NiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZ' +
                    'DpGMjU4MzhGQTEyM0ExMUU2QjAxM0Q2QjZFQ0IzNzM4NiIgeG1wOkNyZWF0b3JUb29sPSJBZG9' +
                    'iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppb' +
                    'nN0YW5jZUlEPSJ4bXAuaWlkOjIzMkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJ' +
                    'lZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzI' +
                    'i8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQ' +
                    'gZW5kPSJyIj8+2Xml2QAAAGBJREFUeNpiYGBg8ATiZ0D8n0j8DKqH4dnhw4f/EwtAakF6GEGmA' +
                    'AEDKYCRkZGBiYFMQH+NLNjcjw2ghwMLIQWDx48Do/H5kSNHiNZw9OhREPUCRHiBNJOQyJ+A9AA' +
                    'EGACqkFldNkPUwwAAAABJRU5ErkJggg==">' +
                    '   </span>' +
                    '   <span class="ag-cell-value"></span></span>' +
                    '</div>';

                let clicked = false;

                this.querySelectors = {
                    eCalendar: eCell.querySelector('#select-all'),
                    allSelected: eCell.querySelector('#all-selected'),
                    notSelected: eCell.querySelector('#not-selected'),
                    notAllSelected: eCell.querySelector('#not-all-selected')
                };

                this.querySelectors.eCalendar.addEventListener('click', () => {
                    clicked = !clicked;

                    if (clicked) {
                        that.changeCheckboxState(gridOptions, 'allSelected');
                    } else {
                        that.changeCheckboxState(gridOptions, 'notSelected');
                    }
                });

                return eCell;
            }
        });
    }

    /**
     * Called when select the row or click on checkbox and sets the style to checkbox.
     *
     * @param isSelectCheckbox
     * @param gridOptions
     */
    changeCheckboxState(gridOptions, isSelectCheckbox?: string) {
        if (!isSelectCheckbox) {
            if (gridOptions.api.getSelectedRows().length === gridOptions.rowData.length) {
                isSelectCheckbox = 'allSelected';
            } else if (!gridOptions.api.getSelectedRows().length) {
                isSelectCheckbox = 'notSelected';
            } else {
                isSelectCheckbox = 'notAllSelected';
            }
        }

        switch (isSelectCheckbox) {
            case 'allSelected':
                gridOptions.api.selectAll();

                this.querySelectors.allSelected.setAttribute('style', 'display: inline;');
                this.querySelectors.notSelected.setAttribute('style', 'display: none;');
                this.querySelectors.notAllSelected.setAttribute('style', 'display: none;');
                break;

            case 'notSelected':
                gridOptions.api.deselectAll();

                this.querySelectors.allSelected.setAttribute('style', 'display: none;');
                this.querySelectors.notSelected.setAttribute('style', 'display: inline;');
                this.querySelectors.notAllSelected.setAttribute('style', 'display: none;');
                break;

            case 'notAllSelected':
                this.querySelectors.allSelected.setAttribute('style', 'display: none;');
                this.querySelectors.notSelected.setAttribute('style', 'display: none;');
                this.querySelectors.notAllSelected.setAttribute('style', 'display: inline;');
                break;

            default:
                break;
        }
    }

    /**
     * Renders the button in column.
     *
     * @example
     * let columnDefs = [
     *  { headerName: 'Employee', field: 'employee' }
     * ];
     *
     * btnRenderer(columnDefs, 'Button', 200, 'done', (event) => {
     *  // do something
     * });
     *
     * @param columnDefs
     * @param nameBtn
     * @param width
     * @param iconName
     * @param clickEvent
     */
    btnRenderer(gridOptions: GridOptions, buttons: Array<Button>, width) {
        gridOptions.columnDefs.unshift({
            headerName: ' ',
            field: 'controlPanel',
            width: width,
            cellRenderer: () => {
                let that = this;
                let buttonWrapper = document.createElement('div');
                buttonWrapper.setAttribute('class', 'ag-control-panel');

                buttons.forEach((i) => {
                    let button = document.createElement('i');
                    button.setAttribute('class', 'material-icons ' +
                        i.nameButton.toLowerCase() + 'Icon');
                    button.setAttribute('id', i.nameButton.toLowerCase() + 'Icon');
                    that.translate.get(i.nameButton.toUpperCase())
                        .subscribe(title => {
                            button.setAttribute('title', title);
                        });
                    button.innerHTML = i.iconName;
                    button.setAttribute(
                        'style', 'font-size: 18px; color: #009688; cursor: pointer;');
                    button.addEventListener('click', (event) => {
                        if (i.clickEvent) {
                            i.clickEvent(event);
                        }
                    });

                    buttonWrapper.appendChild(button);
                });

                return buttonWrapper;
            }
        });
    }

    /**
     * Called when click on cell.
     *
     * @param event
     */
    clickOnCell(event) {
        if (event.colDef.type === 'LINK' ||
            event.colDef.type === 'LINKSET') {
            this.setLinkedClass(event.colDef.linkedClass);
            let linsetProperty: LinksetProperty = {
                name: event.colDef.property,
                type: event.colDef.type,
                bingingProperties: event.colDef.bingingProperties,
                data: event.data
            };

            this.navigateToLinkset(event.colDef.linkedClass, linsetProperty);
        }
    }

    /**
     * Called when click on row.
     *
     * @param event
     */
    rowClicked(event) {
        this.focusedRow = event;

        if (this.clickOnDeleteBtn) {
            // navigate to delete component
            this.router.navigate([this.parentPath, 'delete', event.data['@rid']]);
            this.clickOnDeleteBtn = false;
        } else if (this.clickOnEditBtn) {
            // navigate to edit component
            this.router.navigate([this.parentPath, 'edit', event.data['@rid']]);
            this.clickOnEditBtn = false;
        }
    }

    /**
     * Navigates back in the platform's history and reduces a crud level
     */
    back() {
        this.previousCrudLevel();
        this.location.back();
    }

    /**
     * Navigate to delete component
     */
    navigateToDelete() {
        let id = this.getSelectedRID(this.gridOptions);

        this.router.navigate([this.parentPath, 'delete',
            id.join().replace(/\[|\]/gi, '')]);
    }

    /**
     * Navigate to create component
     * @param className
     */
    navigateToCreate(className: string) {
        this.setModel({});
        this.router.navigate([this.parentPath,
            'create', className]);
    }

    /**
     * Navigate to linkset component and sets next level in crud system.
     *
     * @param linsetProperty
     */
    navigateToLinkset(className: string, linksetProperty?: LinksetProperty) {
        this.nextCrudLevel(linksetProperty);
        this.router.navigate([this.parentPath, 'linkset', className]);
    }

    /**
     * Moves to the next level in crud system and saves the data like:
     * class name, input model (from the dynamic form) and linksetProperty.
     *
     * @param linsetProperty
     */
    nextCrudLevel(linsetProperty?: LinksetProperty) {
        let crudLevel: CrudLevel = {
            className: this.getLinkedClass(),
            inputModel: this.model,
            linksetProperty: linsetProperty
        };

        this.crudLevel.push(crudLevel);
    }

    /**
     * Adds selected links to the multiple select component or updates a linkset property in record
     *
     * @param gridOptions
     * @return {Promise<U>|Promise<TResult>}
     */
    addLink(gridOptions) {
        let className = this.getLinkedClass();
        let previousCrudLevel: CrudLevel = this.previousCrudLevel();
        let params: any = previousCrudLevel.linksetProperty.data;

        return this.getLinkset(gridOptions, previousCrudLevel.linksetProperty.type, className)
            .then(linkSet => {
                params[previousCrudLevel.linksetProperty.name] = linkSet;

                if (this.roService.isPreviousRoute('CrudViewComponent')) {
                    // this.updateRecord(params);
                    this.location.back();
                } else {
                    this.model = params;
                    this.location.back();
                }

            });
    }

    /**
     * Replaces a RID with title columns property
     *
     * @param gridOptions
     * @param type
     * @param className
     * @return {Promise<Array<any>>|Promise<Array>}
     */
    getLinkset(gridOptions, type, className) {
        let focusedRows = gridOptions.api.getSelectedRows();
        let result = [];

        return this.gridService.getTitleColumns(className)
            .then((columnName) => {
                for (let i = 0; i < focusedRows.length; i++) {
                    switch (type) {
                        case 'LINKSET':
                            result['_' + i] = focusedRows[i]['@rid'];

                            if (focusedRows[i].hasOwnProperty(columnName) &&
                                typeof columnName !== 'undefined') {
                                result.push(focusedRows[i][columnName]);
                            } else {
                                result.push(focusedRows[i]['@rid']);
                            }
                            break;
                        case 'LINK':
                            result[0] = focusedRows[i][columnName];
                            result['rid'] = focusedRows[i]['@rid'];
                            break;

                        default:
                            break;
                    }
                }

                result['type'] = type;

                return result;
            });
    }

    /**
     * Moves to the previous level in crud system and removes the last level.
     *
     * @returns {CrudLevel}
     */
    previousCrudLevel(): CrudLevel {
        let previousLevel: CrudLevel = this.crudLevel.pop();

        this.setLinkedClass(previousLevel.className);
        this.setModel(previousLevel.inputModel);

        return previousLevel;
    }

    getSelectedRID(selectedRows) {
        let id = [];

        selectedRows.forEach((i) => {
            id.push(i.customerId);
        });

        return id;
    }

    /**
     * Adds additional columns to grid like RID, checkbox selection, etc
     */
    addColumn(gridOptions) {
        let deleteButton: Button = {
            nameButton: 'Delete',
            iconName: 'delete',
            clickEvent: () => {
                this.clickOnDeleteBtn = true;
            }
        };

        let editButton: Button = {
            nameButton: 'Edit',
            iconName: 'mode_edit',
            clickEvent: () => {
                this.clickOnEditBtn = true;
            }
        };

        // add buttons
        this.btnRenderer(gridOptions, [editButton, deleteButton], 50);

        // add column with checkbox selection
        this.addColumnCheckbox(gridOptions);
    }

    /**
     * Returns column definitions for the grid
     * @param className
     * @returns {any}
     */
    getGridColumnDefs(className: string = '') {
        return Observable.create((observer) => {

            this.backendService.getResources('crud-class-meta-data')
                .subscribe(data => {
                    // find the crudClassMetaData by class name
                    let columns = _.find(data, (o) => {
                        return o['className'] === className;
                    });
                    let linkToMetaGridData = columns['_links'].crudMetaGridData.href;

                    this.backendService.getDataByLink(linkToMetaGridData)
                        .subscribe(_data => {
                            let columns = _data['crud-meta-grid-data'];

                            for (let key in columns) {
                                if (columns.hasOwnProperty(key)) {
                                    let currColumn = columns[key];

                                    currColumn.field = currColumn.property;
                                }
                            }

                            // sorted columns in ascending order by 'order' property
                            columns = _.sortBy(columns, ['order']);

                            this.translateColumnDefs(columns, 'headerName')
                                .subscribe(translatedCols => {
                                    observer.next(translatedCols);
                                    observer.complete();
                                });
                        });
                }, err => {
                    observer.error(err);
                    observer.complete();
                });

        });
    }

    /**
     * Returns column definitions for the form
     * @param className
     * @return {any}
     */
    getFormColumnDefs(className) {
        return Observable.create((observer) => {

            this.backendService.getResources('crud-class-meta-data')
                .subscribe(data => {
                    // find the crudClassMetaData by class name
                    let columns = _.find(data, (o) => {
                        return o['className'] === className;
                    });
                    let linkToMetaFormData = columns['_links'].crudMetaFormData.href;

                    this.backendService.getDataByLink(linkToMetaFormData)
                        .subscribe(_data => {
                            let columns = _data['crud-meta-form-data'];

                            // sorted columns in ascending order by 'order' property
                            columns = _.sortBy(columns, ['order']);

                            this.translateColumnDefs(columns, 'headerName')
                                .subscribe(translatedCols => {
                                    observer.next(translatedCols);
                                    observer.complete();
                                });
                        });
                }, err => {
                    observer.error(err);
                    observer.complete();
                });

        });
    }

    /**
     * Translates columns and creates the new property with a translated value for the each of column
     * @param columns
     * @param translateProperty
     * @returns {any}
     */
    translateColumnDefs(columns, translateProperty: string) {
        let observableStore = [],
            _columns = clone(columns);

        for (let key in _columns) {
            if (_columns.hasOwnProperty(key)) {
                let columnName = _columns[key].hasOwnProperty('property') ? _columns[key]['property'] : '';

                observableStore.push(this.translate.get(columnName)
                    .subscribe(headerName => {
                        _columns[key][translateProperty] = headerName;
                    }));

            }
        }

        return Observable.create(obs => {
            obs.next(_columns);
            obs.complete();
        });
    }

    /**
     * Hides all messages.
     */
    hideAllMessageBoxes() {
        this.dataNotFound = false;
        this.successExecute = false;
    }

    /**
     * Checks the limit of crud levels.
     *
     * @returns {boolean}
     */
    isLimitCrudLevel() {
        if (this.crudLevel.length >= this.limitCrudLevel - 1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks whether a multiple select is filled
     *
     * @param event
     */
    isRequired(event) {
        if (event) {
            this.multipleSelectValid = true;
            return;
        }
    }

    /**
     * Gets the current CRUD level
     * @return {number}
     */
    getCurrentCrudLevel(): number {
        return this.crudLevel.length;
    }

    resetCrudLevels() {
        this.crudLevel = [];
    }

    setClassName(className) {
        this.className = className;
    }

    getClassName() {
        return this.className;
    }

    setRepositoryName(repositoryName) {
        this.repositoryName = repositoryName;
    }

    getRepositoryName() {
        return this.repositoryName;
    }

    setLinkedClass(linkedClass) {
        this.linkedClass = linkedClass;
    }

    getLinkedClass() {
        return this.linkedClass;
    }

    setModel(model) {
        this.model = model;
    }
}
