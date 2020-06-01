import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { HomeGuard } from '../guards/home.guard';
import { DataResolverService } from '../resolver/data-resolver.service';
import { ScheduleResolverService } from '../resolver/schedule-resolver.service';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    canActivate: [HomeGuard],
    children: [{
      path: '',
      loadChildren: () =>
        import('../pages/dashboard/dashboard.module').then(
          m => m.DashboardPageModule)
    },
    {
      path: 'profile',
      loadChildren: () =>
        import('../pages/profile/profile.module').then(
          m => m.ProfilePageModule
        )
    },
    {
      path: 'badges',
      loadChildren: () => import('../pages/badges/badges.module').then(m => m.BadgesPageModule)
    },
    {
      path: 'hospital',
      loadChildren: () => import('../pages/hospital/hospital.module').then(m => m.HospitalPageModule)
    },
    {
      path: 'faqs',
      loadChildren: () => import('../pages/faqs/faqs.module').then(m => m.FaqsPageModule)
    },
    {
      path: 'help',
      loadChildren: () => import('../pages/help/help.module').then(m => m.HelpPageModule)
    },
    {
      path: 'order',
      loadChildren: () => import('../pages/order/order.module').then(m => m.OrderPageModule)
    },
    {
      path: 'google-map',
      loadChildren: () => import('../pages/google-map/google-map.module').then(m => m.GoogleMapPageModule)
    },
    {
      path: 'todo/:id',
      loadChildren: () => import('../pages/todo-details/todo-details.module').then(m => m.TodoDetailsPageModule)
    },
    {
      path: 'todo',
      loadChildren: () => import('../pages/todo-details/todo-details.module').then(m => m.TodoDetailsPageModule)
    },
    {
      path: 'todo-list',
      loadChildren: () => import('../pages/todo-list/todo-list.module').then(m => m.TodoListPageModule)
    },
    {
      path: 'employees',
      loadChildren: () => import('../pages/employees/employees.module').then(m => m.EmployeesPageModule)
    },
    {
      path: 'category',
      loadChildren: () => import('../pages/category/category.module').then(m => m.CategoryPageModule)
    },
    {
      path: 'category/:id',
      loadChildren: () => import('../pages/category/category.module').then(m => m.CategoryPageModule)
    },
    {
      path: 'employeeservice',
      loadChildren: () => import('../pages/employeeservice/employeeservice.module').then(m => m.EmployeeservicePageModule)
    },
    {
      path: 'upload-image',
      loadChildren: () => import('../pages/upload-image/upload-image.module').then(m => m.UploadImagePageModule)
    },
    {
      path: 'services/:id',
      resolve: {
        data: DataResolverService
      },
      loadChildren: () => import('../pages/services/services.module').then(m => m.ServicesPageModule)
    },
    {
      path: 'categorylist',
      loadChildren: () => import('../pages/categorylist/categorylist.module').then(m => m.CategorylistPageModule)
    },
    {
      path: 'servicelist/:id',
      loadChildren: () => import('../pages/servicelist/servicelist.module').then(m => m.ServicelistPageModule)
    },
    {
      path: 'schedule/:id',
      loadChildren: () => import('../pages/schedule/schedule.module').then(m => m.SchedulePageModule)
    },
    {
      path: 'stepper-partner/:id',
      resolve: {
        data: ScheduleResolverService
      },
      loadChildren: () => import('../pages/stepper-partner/stepper-partner.module').then(m => m.StepperPartnerPageModule)
    }


    ]
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
