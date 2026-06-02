import { Routes } from '@angular/router';

import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ReservationsComponent } from './admin/reservations/reservations.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { SupportComponent } from './admin/support/support.component';
import { KycComponent } from './admin/kyc/kyc.component';
import { ReviewsComponent } from './admin/reviews/reviews.component';
import { PaymentsComponent } from './admin/payments/payments.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { MessagesComponent } from './admin/messages/messages.component';
import { ExperiencesComponent } from './admin/experiences/experiences.component';
import { CreateExperienceComponent } from './admin/create-experience/create-experience.component';

import { ClientComponent } from './portfolio/client/client.component';
import { GuideProfileComponent } from './portfolio/guide-profile/guide-profile.component';
import { HomeComponent } from './portfolio/client/home/home.component';
import { ClientLayoutComponent } from './portfolio/client/client-layout.component';
import { ClientReservationsComponent } from './portfolio/client/reservations/reservations.component';
import { ClientMessagesComponent } from './portfolio/client/messages/messages.component';
import { FavoritesComponent } from './portfolio/client/favorites/favorites.component';
import { SettingsComponent as ClientSettingsComponent } from './portfolio/client/settings/settings.component';
import { CheckoutComponent } from './portfolio/checkout/checkout.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ExperienceDetailComponent } from './portfolio/experience-detail/experience-detail.component';

import { SuperAdminComponent } from './super-admin/super-admin.component';
import { DashboardComponent as SuperAdminDashboardComponent } from './super-admin/dashboard/dashboard.component';
import { UsersComponent } from './super-admin/users/users.component';
import { BusinessComponent } from './super-admin/business/business.component';
import { SystemComponent } from './super-admin/system/system.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/dashboard',
    pathMatch: 'full'
  },

  /* ================= CLIENT ================= */
  {
    path:'landing',
    children: [
       {
        path: '',
        component: PortfolioComponent,
      },
      {
        path: 'experience',
        component: ClientComponent,
      },
      {
        path: 'experience/:id',
        component: ExperienceDetailComponent,
      },
      {
        path: 'experience/:id/book',
        component: CheckoutComponent
      },
      {
        path: 'profil',
        component: GuideProfileComponent
      }
    ]


  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'reservations',
        component: ClientReservationsComponent
      },
      {
        path: 'messages',
        component: ClientMessagesComponent
      },
      {
        path: 'favorites',
        component: FavoritesComponent
      },
      {
        path: 'reviews',
        component: HomeComponent // TODO
      },
      {
        path: 'settings',
        component: ClientSettingsComponent
      }
    ]
  },

  /* ================= ADMIN ================= */
  {
    path: 'admin',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'experiences',
        component: ExperiencesComponent
      },
      {
        path: 'experiences/create',
        component: CreateExperienceComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'messages',
        component: MessagesComponent
      },
      {
        path: 'reservations',
        component: ReservationsComponent
      },
      {
        path: 'reviews',
        component: ReviewsComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'support',
        component: SupportComponent
      },
      {
        path: 'kyc',
        component: KycComponent
      },
      {
        path: 'payments',
        component: PaymentsComponent
      }
    ]
  },

  /* ================= SUPER ADMIN ================= */
  {
    path: 'super-admin',
    component: SuperAdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: SuperAdminDashboardComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'business',
        component: BusinessComponent
      },
      {
        path: 'system',
        component: SystemComponent
      }
    ]
  }
];
