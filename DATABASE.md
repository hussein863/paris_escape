# Paris Escape — Database Conception

## Overview

Paris Escape is a tour/experience booking platform connecting **Guides** (experience providers) with **Clients** (customers). The platform includes a public landing/booking flow, a client dashboard, a guide admin panel, and a super-admin management interface.

---

## Entities

### 1. USER
Base entity for all platform users.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| name | string | |
| email | string | unique |
| phone | string | includes country code |
| avatar | string | URL |
| role | enum | `Customer` `Guide` `Business` `Admin` |
| status | enum | `Active` `Suspended` `KYC Pending` |
| country | string | |
| city | string | |
| preferredLanguage | string | e.g. `FR` `EN` `ES` |
| currency | enum | `EUR` `USD` `GBP` |
| emergencyContactName | string | |
| emergencyContactPhone | string | |
| registrationDate | date | |

---

### 2. GUIDE
Extends User. Holds guide-specific profile data.

| Field | Type | Notes |
|---|---|---|
| userId | string (FK → User) | |
| pronouns | string | |
| bio | string | max 1000 chars |
| coverImage | string | URL |
| yearsOfExperience | number | |
| isVerified | boolean | |
| isOriginal | boolean | platform badge |
| rating | decimal | |
| reviewCount | number | |
| totalTours | number | |
| priceRange | string | e.g. `€65 - €150` |
| responseTime | string | e.g. `Within 2 hours` |
| meetingPointName | string | |
| meetingPointAddress | string | |
| pickupOptions | string | |
| accessibility | string | |

---

### 3. GUIDE_LANGUAGE
Languages a guide speaks.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| guideId | string (FK → Guide) | |
| name | string | e.g. `French` `English` |
| level | enum | `Native` `Fluent` `Conversational` `Basic` |

---

### 4. GUIDE_SPECIALTY
Thematic specialties of a guide.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| guideId | string (FK → Guide) | |
| name | string | e.g. `Art & Museums` `Food & Wine` `Hidden Gems` |

---

### 5. EXPERIENCE
Core product of the platform — a tour or activity offered by a guide.

| Field | Type | Notes |
|---|---|---|
| id | number (PK) | |
| guideId | string (FK → Guide) | |
| title | string | |
| shortDescription | string | |
| longDescription | string | |
| highlights | string[] | selling points |
| category | string | e.g. `Art & Museums` `History` `Photography` |
| subcategory | string | |
| tags | string[] | |
| difficulty | enum | `Easy` `Moderate` `Hard` |
| durationValue | number | |
| durationUnit | enum | `minutes` `hours` `days` |
| languages | string[] | offered in |
| groupSizeMin | number | |
| groupSizeMax | number | |
| maxPeople | number | |
| strollerFriendly | boolean | |
| wheelchairAccessible | boolean | |
| hasMinAge | boolean | |
| minAge | number (nullable) | |
| hasMaxAge | boolean | |
| maxAge | number (nullable) | |
| basePrice | number | |
| currency | enum | `EUR` `USD` `GBP` |
| pricingModel | enum | `per-person` `private` |
| childPricingEnabled | boolean | |
| childPrice | number | |
| childAgeRange | string | e.g. `3-12` |
| image | string | cover image URL |
| status | enum | `Draft` `Pending` `Active` `Under Review` `Refused` |
| views | number | |
| bookings | number | |
| rating | decimal | |
| createdDate | date | |
| updatedDate | date | |
| publishedDate | date (nullable) | |

---

### 6. EXPERIENCE_MEDIA
Photos and videos attached to an experience.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| experienceId | number (FK → Experience) | |
| type | enum | `image` `video` |
| url | string | |
| caption | string | |
| isCoverImage | boolean | |
| ordering | number | |
| uploadDate | date | |

---

### 7. EXPERIENCE_INCLUSION
What is included, not included, or to bring for an experience.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| experienceId | number (FK → Experience) | |
| text | string | |
| type | enum | `included` `not-included` `to-bring` |
| ordering | number | |

---

### 8. EXPERIENCE_ITINERARY_ITEM
Step-by-step itinerary of an experience.

| Field | Type | Notes |
|---|---|---|
| id | number (PK) | |
| experienceId | number (FK → Experience) | |
| order | number | |
| title | string | |
| duration | string | |
| description | string | |

---

### 9. EXPERIENCE_OPTION
Optional add-ons available for an experience.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| experienceId | number (FK → Experience) | |
| title | string | |
| description | string | |
| icon | string | FontAwesome class e.g. `fa-camera` |
| price | number | |
| pricingType | enum | `per-person` `per-booking` |

---

### 10. EXPERIENCE_AVAILABILITY
Scheduling rules for an experience.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| experienceId | number (FK → Experience) | one-to-one |
| recurringPattern | enum | `daily` `weekends` `custom` |
| minimumNotice | enum | `1-hour` `2-hours` `4-hours` `12-hours` `1-day` `2-days` `3-days` `1-week` |
| sameDayCutoff | time | e.g. `08:00` |
| googleCalendarConnected | boolean | |
| iCalConnected | boolean | |

---

### 11. TIME_SLOT
Available time slots within an availability schedule.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| availabilityId | string (FK → Experience_Availability) | |
| time | string | e.g. `10:00 AM` |
| label | string | e.g. `Morning slot` |

---

### 12. EXPERIENCE_POLICY
Cancellation and safety policies for an experience.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| experienceId | number (FK → Experience) | one-to-one |
| cancellationWindow | enum | `24-hours` `48-hours` `72-hours` |
| lateArrivalPolicy | enum | `wait-15` `start-on-time` `custom` |
| noShowPolicy | enum | `no-refund` `partial-refund` `custom` |
| weatherPolicy | enum | `light-rain` `cancel-bad` `reschedule-severe` |
| safetyNotes | string | |
| insuranceCoverage | boolean | |
| emergencyProcedures | boolean | |
| photographyConsent | boolean | |

---

### 13. BOOKING
A reservation made by a customer for an experience.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| bookingRef | string | e.g. `PE-2024-1214-001` |
| experienceId | number (FK → Experience) | |
| customerId | string (FK → User) | |
| guideId | string (FK → Guide) | |
| date | date | |
| time | time | e.g. `10:00 AM` |
| timeZone | string | |
| status | enum | `Confirmed` `Pending` `Cancelled` `Disputed` |
| adults | number | |
| children | number | |
| basePrice | number | |
| addOnsTotal | number | |
| subtotal | number | |
| serviceFee | number | |
| taxes | number | |
| totalAmount | number | |
| cancellationDeadline | date (nullable) | |
| createdDate | date | |
| modifiedDate | date | |

---

### 14. BOOKING_ADDON
Add-ons selected for a specific booking.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| bookingId | string (FK → Booking) | |
| optionId | string (FK → Experience_Option) | |
| name | string | snapshot at booking time |
| price | number | snapshot at booking time |
| quantity | number | |

---

### 15. BOOKING_DETAIL
Contact and preferences submitted during checkout.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| bookingId | string (FK → Booking) | one-to-one |
| firstName | string | |
| lastName | string | |
| email | string | |
| phoneCode | string | |
| phoneNumber | string | |
| country | string | |
| specialRequests | string | |
| acceptTerms | boolean | |
| receiveUpdates | boolean | |

---

### 16. REVIEW
Customer review for an experience or guide.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| bookingId | string (FK → Booking) | |
| experienceId | number (FK → Experience) | |
| guideId | string (FK → Guide) | |
| customerId | string (FK → User) | |
| rating | number | 1–5 |
| content | string | |
| language | string | e.g. `EN` `FR` |
| verified | boolean | |
| photos | string[] | URLs |
| helpful | number | upvote count |
| date | date | |

---

### 17. REVIEW_REPLY
Guide's reply to a review.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| reviewId | string (FK → Review) | one-to-one |
| guideId | string (FK → Guide) | |
| content | string | |
| date | date | |
| lastEdited | date (nullable) | |

---

### 18. CONVERSATION
Messaging thread between a customer and a guide.

| Field | Type | Notes |
|---|---|---|
| id | number (PK) | |
| customerId | string (FK → User) | |
| guideId | string (FK → Guide) | |
| bookingId | string (FK → Booking, nullable) | |
| status | enum | `Confirmed` `Pending` `Pre-contact` `Open` |
| lastMessage | string | |
| lastMessageAt | date | |
| unread | boolean | |

---

### 19. MESSAGE
Individual message within a conversation.

| Field | Type | Notes |
|---|---|---|
| id | number (PK) | |
| conversationId | number (FK → Conversation) | |
| senderType | enum | `Customer` `Guide` |
| senderId | string (FK → User) | |
| text | string | |
| timestamp | date | |
| read | boolean | |

---

### 20. PAYMENT
Financial transaction record.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| invoiceNumber | string | e.g. `INV-2024-12-001` |
| bookingId | string (FK → Booking, nullable) | |
| userId | string (FK → User) | |
| type | enum | `Booking` `Commission` `Refund` `Subscription` |
| date | date | |
| amount | number | |
| currency | string | |
| status | enum | `Paid` `Unpaid` `Failed` `Pending` `Completed` |
| method | string | e.g. `Stripe` `Bank Transfer` |
| description | string | |

---

### 21. PAYOUT
Guide payout record.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| guideId | string (FK → Guide) | |
| date | date | |
| amount | number | |
| status | enum | `Paid` `Pending` |
| bankAccount | string | masked e.g. `BNP ••••1234` |
| frequency | enum | `Weekly` `Bi-weekly` `Monthly` |

---

### 22. BILLING_INFO
Guide's legal and billing information.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| guideId | string (FK → Guide) | one-to-one |
| legalName | string | |
| companyName | string (nullable) | |
| address | string | |
| siret | string | French business registration number |
| vatNumber | string | |
| invoiceEmail | string | |
| publicEmail | string | |
| publicPhone | string | |
| showEmailOnProfile | boolean | |
| showPhoneOnProfile | boolean | |

---

### 23. BANK_INFO
Guide's bank account for payouts.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| guideId | string (FK → Guide) | one-to-one |
| bankName | string | |
| bankAccount | string | masked |
| payoutFrequency | enum | `Weekly` `Bi-weekly` `Monthly` |
| nextPayoutDate | date | |
| nextPayoutAmount | number | |

---

### 24. PAYMENT_METHOD
Saved card for a customer.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| userId | string (FK → User) | |
| cardLast4 | string | |
| cardExpiry | string | `MM/YY` |
| cardExpired | boolean | |
| cardBrand | string | e.g. `Visa` `Mastercard` |

---

### 25. SUBSCRIPTION
Guide subscription plan.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| guideId | string (FK → Guide) | |
| planName | string | e.g. `Pro Plan` `Basic Plan` |
| planPrice | number | |
| billingCycle | enum | `month` `year` |
| status | enum | `Active` `Paused` `Cancelled` |
| startDate | date | |
| renewalDate | date | |
| endDate | date (nullable) | |

---

### 26. KYC_VERIFICATION
Identity verification record for a guide.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| userId | string (FK → User) | one-to-one |
| personType | enum | `individual` `company` |
| isMicroEnterprise | boolean | |
| pepScreening | boolean | |
| dataProtection | boolean | |
| accuracyConfirmation | boolean | |
| verificationStatus | enum | `verified` `in-review` `not-started` |

---

### 27. KYC_DOCUMENT
Individual documents submitted for KYC.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| kycId | string (FK → KYC_Verification) | |
| category | enum | `Identity` `Address` `Business & Tax` `Bank Account` |
| status | enum | `verified` `in-review` `not-started` |
| statusText | string | human-readable description |
| uploadedDate | date (nullable) | |

---

### 28. SUPPORT_TICKET
Customer or guide support request.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | e.g. `SUP-2847` |
| userId | string (FK → User) | |
| bookingId | string (FK → Booking, nullable) | |
| status | enum | `Open` `Awaiting my reply` `Pending platform` `Resolved` `Dispute` |
| priority | enum | `Urgent` `Normal` `Low` |
| title | string | |
| openedDate | date | |
| lastUpdate | date | |

---

### 29. DISPUTE
Dispute linked to a booking.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| bookingId | string (FK → Booking) | one-to-one |
| ticketId | string (FK → Support_Ticket, nullable) | |
| reason | string | |
| status | enum | `Open` `Resolved` |
| evidence | string | file references |

---

### 30. FAVORITE
Customer's saved/favorited experiences.

| Field | Type | Notes |
|---|---|---|
| id | string (PK) | |
| customerId | string (FK → User) | |
| experienceId | number (FK → Experience) | |
| savedAt | date | |

---

## Relationships Summary

```
User ─────────────── Guide (1:1)
Guide ────────────── Guide_Language (1:N)
Guide ────────────── Guide_Specialty (1:N)
Guide ────────────── Experience (1:N)
Guide ────────────── Billing_Info (1:1)
Guide ────────────── Bank_Info (1:1)
Guide ────────────── Subscription (1:N)
Guide ────────────── Payout (1:N)
Guide ────────────── KYC_Verification (1:1)

Experience ──────── Experience_Media (1:N)
Experience ──────── Experience_Inclusion (1:N)
Experience ──────── Experience_Itinerary_Item (1:N)
Experience ──────── Experience_Option (1:N)
Experience ──────── Experience_Availability (1:1)
Experience ──────── Time_Slot via Availability (1:N)
Experience ──────── Experience_Policy (1:1)
Experience ──────── Review (1:N)
Experience ──────── Favorite (1:N)

Booking ─────────── Booking_Detail (1:1)
Booking ─────────── Booking_Addon (1:N)
Booking ─────────── Review (1:N)
Booking ─────────── Payment (1:N)
Booking ─────────── Dispute (1:1)
Booking ─────────── Support_Ticket (1:N)

Review ──────────── Review_Reply (1:1)

Conversation ─────── Message (1:N)

KYC_Verification ─── KYC_Document (1:N)

User (Customer) ──── Booking (1:N)
User (Customer) ──── Conversation (1:N)
User (Customer) ──── Payment_Method (1:N)
User (Customer) ──── Support_Ticket (1:N)
User (Customer) ──── Favorite (1:N)
```

---

## Key Enums Reference

| Enum | Values |
|---|---|
| User.role | `Customer` `Guide` `Business` `Admin` |
| User.status | `Active` `Suspended` `KYC Pending` |
| Experience.status | `Draft` `Pending` `Active` `Under Review` `Refused` |
| Experience.difficulty | `Easy` `Moderate` `Hard` |
| Experience.pricingModel | `per-person` `private` |
| Experience.durationUnit | `minutes` `hours` `days` |
| Booking.status | `Confirmed` `Pending` `Cancelled` `Disputed` |
| Payment.status | `Paid` `Unpaid` `Failed` `Pending` `Completed` |
| Payment.type | `Booking` `Commission` `Refund` `Subscription` |
| Inclusion.type | `included` `not-included` `to-bring` |
| Language.level | `Native` `Fluent` `Conversational` `Basic` |
| Availability.recurringPattern | `daily` `weekends` `custom` |
| Availability.minimumNotice | `1-hour` `2-hours` `4-hours` `12-hours` `1-day` `2-days` `3-days` `1-week` |
| Policy.cancellationWindow | `24-hours` `48-hours` `72-hours` |
| Policy.weatherPolicy | `light-rain` `cancel-bad` `reschedule-severe` |
| KYC.verificationStatus | `verified` `in-review` `not-started` |
| KYC_Document.category | `Identity` `Address` `Business & Tax` `Bank Account` |
| Subscription.billingCycle | `month` `year` |
| Payout.frequency | `Weekly` `Bi-weekly` `Monthly` |
| Support_Ticket.priority | `Urgent` `Normal` `Low` |
| Dispute.status | `Open` `Resolved` |
