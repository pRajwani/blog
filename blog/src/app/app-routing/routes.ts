import { LoginComponent } from '../login/login.component';
import { IndexComponent } from '../index/index.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/index', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'index', component: IndexComponent }
];