# Non-Functional Requirements (NFR)

## 1. Performance
- **Load Time**: The main dashboard should load within 1.5 seconds on 4G networks.
- **Responsiveness**: UI must be fully responsive and usable on devices from 320px width up to 4k monitors.
- **Animations**: Transitions and hover effects should run at 60fps.

## 2. Accessibility
- **WCAG Compliance**: All UI components must meet WCAG 2.1 AA standards.
- **Keyboard Navigation**: All interactive elements (cards, buttons) must be navigable via keyboard.
- **Screen Readers**: All images and icons must have appropriate `alt` text or `aria-labels`.

## 3. Usability
- **Click Targets**: Interactive elements must have a minimum touch target size of 44x44px on mobile.
- **Visual Feedback**: Buttons and cards must provide visual feedback on hover and active states.
- **Content Visibility**: Text must not be truncated or hidden unless explicitly designed with a "read more" mechanism.

## 4. Reliability
- **Error Handling**: UI should gracefully handle missing data or API failures without breaking the layout.

## 5. Data Integrity
- **DI-001**: All transactional records (Bookings, Shipments, Invoices) must be linked to a valid User and Organization ID.
- **DI-002**: Orphaned records should be prevented by database constraints or application logic.
