import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
    selector: 'crud-metadata',
    template: require('./crud-meta-data.component.html'),
    styleUrls: [
        require('./crud-meta-data.component.scss')
    ],
    providers: [BreadcrumbComponent]
})
export class CrudMetaDataComponent {
    constructor(public translate: TranslateService) {
    }

    ngOnInit() {
    }
}
