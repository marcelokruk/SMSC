import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import { AuthGuard } from '../common/auth.guard';

@Injectable()
export class DashboardGuard extends AuthGuard {

}
