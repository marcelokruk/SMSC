import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { CrudService } from "../crud.service";
import { CrudResolve } from "./crudResolve";

@Injectable()
export class CrudCreateResolve extends CrudResolve {

    constructor(public router:Router,
                public crudService:CrudService) {
        super();
    }

    resolve(route:ActivatedRouteSnapshot, state:RouterStateSnapshot) {
        this.crudService.initializationGrid(this.crudService.getClassName());
    }

}