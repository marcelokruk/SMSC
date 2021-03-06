import { Component, ModuleWithProviders, NgModule } from "@angular/core";
import { TranslateService, TranslateModule } from "ng2-translate/ng2-translate";
import { Router, ActivatedRoute } from "@angular/router";
import { CrudService } from "../crud.service";
import { Location, CommonModule } from "@angular/common";
import { GridService } from "../../services/grid.service";
import { MdSelectModule } from "../../common/material/select/select.component";
import { DropdownModule, AlertModule } from "ng2-bootstrap";
import { AgGridModule } from "ag-grid-ng2";
import { LoadingGridModule } from "../../common/loading-grid.component";
import { FormsModule } from "@angular/forms";
import { DynamicViewModule } from "../dynamic-view/dynamic-view.component";
import { GridPropertyModel } from "../model/grid-property";

@Component({
    selector: 'crud-linkset',
    template: '<dynamic-view [crudClass]="crudService.getLinkedClass()"></dynamic-view>',
    styleUrls: [],
    providers: []
})

export class CrudLinksetComponent {
    public resolveData: Array<GridPropertyModel> = [];

    constructor(public translate: TranslateService,
                public crudService: CrudService,
                public router: Router,
                public route: ActivatedRoute,
                public location: Location,
                public gridService: GridService) {
    }

    ngOnInit() {
        this.resolveData = this.route.snapshot.data['linkset'];
        this.crudService.gridOptions.columnDefs = this.resolveData;
        this.crudService.gridOptions.rowData = [];

        // adds additional columns
        this.crudService.addColumn(this.crudService.gridOptions);
    }
}

@NgModule({
    imports: [
        CommonModule,
        MdSelectModule,
        FormsModule,
        DropdownModule,
        TranslateModule,
        AlertModule,
        AgGridModule,
        LoadingGridModule,
        DynamicViewModule
    ],
    exports: [CrudLinksetComponent],
    declarations: [CrudLinksetComponent]
})
export class CrudLinksetModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CrudLinksetModule,
            providers: []
        };
    }
}
