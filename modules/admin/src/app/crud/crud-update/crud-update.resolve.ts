import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { CrudResolve } from "../common/crud-resolve";
import { CrudService } from "../crud.service";
import { Location } from "@angular/common";
import { Observable } from "rxjs";
import { GridOptions } from "../model/grid-options";
import { BackendService } from "../../services/backend/backend.service";
import { NotificationService } from "../../services/notification-service";

@Injectable()
export class CrudEditResolve extends CrudResolve {

    constructor(public crudService: CrudService,
                public location: Location,
                public notification: NotificationService,
                public backendService: BackendService) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = route.params['id'];
        let gridOptions: GridOptions = <GridOptions>{};

        return Observable.create((observer) => {
            this.crudService.getFormColumnDefs(this.crudService.getClassName())
                .subscribe((columns) => {
                    gridOptions.columnDefs = columns;

                    this.backendService.getResource(id, this.crudService.getRepositoryName())
                        .subscribe(resource => {
                            gridOptions.rowData = resource;

                            observer.next(gridOptions);
                            observer.complete();
                        }, err => {
                            this.notification.createNotificationOnResponse(err);
                            observer.error(err);
                            observer.complete();
                        });
                }, err => {
                    this.notification.createNotificationOnResponse(err);
                    observer.error(err);
                    observer.complete();
                });
        });

    }

}
