import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientSidebarComponent } from './client-sidebar/client-sidebar.component';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterModule, ClientSidebarComponent],
  template: `
    <div class="client-layout">
      <app-client-sidebar></app-client-sidebar>
      <div class="client-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .client-layout {
      display: flex;
      min-height: 100vh;
      background: #fafafa;
    }

    .client-content {
      flex: 1;
      margin-left: 280px;
      min-height: 100vh;

      @media (max-width: 768px) {
        margin-left: 0;
      }
    }
  `]
})
export class ClientLayoutComponent {}
