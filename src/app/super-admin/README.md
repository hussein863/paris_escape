# Super Admin Dashboard

A comprehensive super-admin interface for managing the Paris Experiences platform.

## 🎯 Overview

The Super Admin component provides a complete management interface with 4 main sections, each designed following the provided wireframes.

## 📂 Structure

```
super-admin/
├── super-admin.component.ts         # Main layout component
├── super-admin.component.html       # Main layout template
├── super-admin.component.scss       # Main layout styles
├── sidebar/                         # Navigation sidebar
├── dashboard/                       # Dashboard (Wireframe 1)
├── users/                          # Users management (Wireframe 2)
├── business/                       # Business center (Wireframe 3)
└── system/                         # System settings (Wireframe 4)
```

## 🚀 Routes

Access the super-admin interface via:

- **Dashboard**: `/super-admin/dashboard` or `/super-admin`
- **Users**: `/super-admin/users`
- **Business**: `/super-admin/business`
- **System**: `/super-admin/system`

## ✨ Features

### 1. Dashboard (Wireframe 1)
- **Topbar**: Search, notifications, help, profile menu
- **KPI Cards**: Revenue, bookings, experiences, users with trend indicators
- **Critical Alerts**: Priority notifications for failed payments, pending KYC, disputes
- **Charts**: Revenue over time and traffic/bookings analytics
- **Quick Actions**: Shortcuts to main sections
- **Recent Activity**: Timeline of latest platform events
- **Footer**: Legal links and system version

### 2. Users (Wireframe 2)
- **List View**: Complete user table with avatar, email, role, status
- **Advanced Filters**: Role, status, KYC, date range, search
- **Export**: CSV export functionality
- **360° Profile Panel**: Sliding panel with:
  - Personal information
  - Activity overview (bookings, earnings, experiences)
  - Transaction history
  - Permissions management (for admins)
  - Internal notes system
- **Actions**: View, suspend/activate users

### 3. Business (Wireframe 3)
Four tabs for complete business management:

#### Tab 1: Experiences
- List of all experiences with guide, city, category, status, price
- Actions: Publish, refuse, edit
- Filters: Status, city, category

#### Tab 2: Bookings
- Booking management with customer, guide, date/time, amount
- Actions: Refund, reschedule
- Status tracking: Confirmed, canceled, pending

#### Tab 3: Payments
- Payment tracking with type, user, amount, method, status
- Actions: View payout, retry failed payments
- Payment types: Booking, commission, subscription

#### Tab 4: Disputes
- Dispute resolution with booking reference, reason, evidence
- Actions: Approve refund, reject, add message, partial refund
- Status: Open, resolved

### 4. System (Wireframe 4)
Nine configuration sections with sidebar navigation:

#### 1. General Settings
- Platform name
- Logo upload
- Currency settings
- Tax/VAT configuration

#### 2. CMS
- Page management (Home, About, Categories)
- Content editor
- Custom slugs
- Preview functionality

#### 3. SEO
- Meta title and description
- OG image upload
- Sitemap generation

#### 4. Analytics
- Session tracking
- Conversion rates
- Top cities and experiences
- Traffic source visualization

#### 5. Integrations / API
- API keys management
- Webhook configuration
- Integration status (Stripe, SendGrid, Google Analytics, AWS S3)
- Error logs

#### 6. Roles & Permissions
- Role management (Admin, Support, Finance, Read-only)
- Permission matrix
- User count per role

#### 7. Emails & Languages
- Email template editor
- Dynamic variables
- Multilingual support (EN, FR, ES)

#### 8. Compliance / GDPR
- Export user data
- Delete user account
- Compliance logs
- GDPR compliance tools

#### 9. Logs & System Health
- Uptime monitoring
- Error count (24h)
- Email deliverability
- Background tasks status
- Recent error logs with severity levels

## 🎨 Design Features

### Responsive Design
- **Desktop**: Full layout with sidebar (1024px+)
- **Tablet**: Optimized grid layouts (768px - 1024px)
- **Mobile**: Stacked layouts, collapsible sidebar (<768px)

### Color Palette
- **Primary**: Black (#000000)
- **Background**: Light gray (#f8f9fa)
- **Cards**: White (#ffffff)
- **Borders**: Gray (#e5e7eb)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Inter (from project's global styles)
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)
- **Hierarchy**: Clear heading sizes (28px, 20px, 18px, 16px, 14px)

### Components
- **Buttons**: Multiple variants (primary, secondary, danger, warning, success)
- **Cards**: Consistent 12px border radius with subtle shadows
- **Tables**: Hover states, alternating rows, responsive overflow
- **Badges**: Color-coded status indicators
- **Forms**: Clean inputs with focus states
- **Icons**: Emoji-based for universal support

### Interactions
- Smooth transitions (0.2s - 0.3s)
- Hover effects on interactive elements
- Loading states and animations
- Toast notifications for actions
- Slide-in panels for detailed views

## 📱 Mobile Optimizations

- Stacked layouts for narrow screens
- Touch-friendly button sizes (min 44px)
- Collapsible navigation
- Horizontal scrolling for tables
- Full-width forms on mobile
- Simplified chart visualizations

## 🔧 Technical Details

### Technologies
- **Angular 17+**: Standalone components
- **TypeScript**: Type-safe development
- **SCSS**: Component-scoped styles
- **RxJS**: Reactive data handling (ready for implementation)

### Component Architecture
- Standalone components (no modules required)
- CommonModule and FormsModule imports
- Two-way data binding with `[(ngModel)]`
- Reactive state management ready
- Clean separation of concerns

### Data Management
- Mock data for demonstration
- Ready for service integration
- Interface-driven development
- Type-safe data structures

## 🚀 Usage

### Accessing the Super Admin
Navigate to `/super-admin` in your browser. The interface will load with the dashboard as the default view.

### Navigation
Use the persistent sidebar to navigate between:
- Dashboard (overview)
- Users (management)
- Business (operations)
- System (configuration)

### Quick Actions
Click on any quick action card on the dashboard to jump directly to the relevant section.

### User Management
1. Go to Users section
2. Use filters to find specific users
3. Click "View" to open the 360° profile panel
4. Take actions from the panel (suspend, edit notes, etc.)

### Business Operations
1. Go to Business Center
2. Switch between tabs: Experiences, Bookings, Payments, Disputes
3. Use filters to narrow down results
4. Take actions directly from the table

### System Configuration
1. Go to System Settings
2. Use the sidebar to navigate between sections
3. Modify settings as needed
4. Click "Save Changes" to persist

## 🎯 Future Enhancements

- Real-time data with WebSocket connections
- Advanced charting with Chart.js or D3.js
- CSV/PDF export functionality
- Bulk actions for users and experiences
- Advanced search with Elasticsearch
- Audit trail for all admin actions
- Role-based access control (RBAC)
- Multi-language interface
- Dark mode support
- Email notifications for critical events

## 📝 Notes

- All functionality is currently using mock data
- Actions show alert dialogs (replace with actual API calls)
- Charts show placeholders (integrate charting library)
- Forms are functional but not connected to backend
- Ready for backend integration with minimal changes

## 🤝 Integration with Existing Project

The super-admin component follows the same patterns as the existing admin and portfolio components:
- Consistent styling with the Paris project
- Matches the Inter font family
- Uses the same color scheme
- Follows the same responsive breakpoints
- Compatible with existing routing structure

## 📞 Support

For questions or issues, refer to the main project documentation or contact the development team.
