import { Component } from "@angular/core";
import { TranslatePipe, TranslateService } from "ng2-translate/ng2-translate";
import { Router } from "@angular/router";
import { CrudService } from "../crud.service";
import { CrudModel } from "../crud.model";

@Component({
    selector: 'crud-create',
    template: require('./crud.create.html'),
    styles: [
        require('./crud.create.scss')
    ],
    providers: [CrudService],
    directives: [],
    pipes: [TranslatePipe]
})

export class CrudCreate {
    constructor(public translate:TranslateService,
                public crudService:CrudService,
                public router:Router) {
    }

    ngOnInit() {
    }

}