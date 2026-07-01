import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientSidebarComponent } from './client-sidebar/client-sidebar.component';
import { ClientHeaderComponent } from './client-header/client-header.component';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterModule, ClientSidebarComponent, ClientHeaderComponent],
  template: `
    <app-client-header></app-client-header>
    <div class="client-shell">
      <app-client-sidebar></app-client-sidebar>
      <div class="client-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .client-shell {
      display: flex;
      min-height: calc(100vh - 70px);
      background: #fafafa;
    }

    .client-content {
      flex: 1;
      margin-left: 280px;
      min-height: calc(100vh - 70px);

      @media (max-width: 768px) {
        margin-left: 0;
      }
    }
  `]
})
export class ClientLayoutComponent {}
