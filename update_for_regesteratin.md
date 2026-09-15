# Discovery 2026 — Registration & Razorpay Payment Reliability Upgrade

## ROLE

You are a senior backend/payment-systems engineer working on the existing **Discovery 2026** event registration system.

Repository:

`https://github.com/Yashrajsalunkhe/Discovery`

Your task is to **upgrade ONLY the registration and Razorpay payment architecture**.

This is a production system handling real student payments. Payment reliability and preventing lost registrations are the highest priorities.

### VERY IMPORTANT

Do NOT blindly rewrite the project.

First inspect the existing implementation completely, understand how it works, identify the current failure points, and then make the smallest safe architectural changes necessary.

Do NOT redesign the frontend or unrelated parts of the application.

---

# 1. PRIMARY OBJECTIVE

The current architecture appears to be approximately:

```text
Student
   ↓
Registration Form
   ↓
Create Razorpay Order
   ↓
Razorpay Checkout
   ↓
Payment Success
   ↓
Browser Callback
   ↓
POST /api/register
   ↓
Verify Razorpay Signature
   ↓
MongoDB Registration
```

The major reliability problem is:

```text
Payment succeeds
        ↓
Browser/network/serverless function fails
        ↓
/api/register never completes
        ↓
Payment exists in Razorpay
but registration may not exist in MongoDB
```

The new architecture must ensure that **a successful Razorpay payment can be recovered even if the user's browser disappears immediately after payment.**

The browser callback must NOT be the only path that creates the registration.

Implement a **Razorpay webhook-driven payment recovery architecture** while retaining the current immediate client-side verification flow for good UX.

---

# 2. FIRST: AUDIT THE EXISTING PROJECT

Before modifying anything, inspect the complete registration/payment flow.

At minimum inspect:

```text
frontend/src/components/RegistrationForm.tsx

backend/src/index.ts

backend/src/register.ts

backend/src/utils/payment-verification.ts

backend/src/utils/razorpay.ts

backend/src/utils/guaranteedQueue.ts

backend/src/utils/deduplication.ts

backend/src/utils/atomicCounter.ts

backend/src/utils/feeCalculation.ts
```

Also search the entire repository for:

```text
razorpay
payment
payment-verification
paymentId
orderId
signature
registerUser
/api/register
/api/order
queue
guaranteedQueue
webhook
payment.captured
order.paid
payment.authorized
payment.failed
```

Inspect:

* package.json
* Vercel configuration
* environment configuration
* MongoDB models
* API/serverless entry points
* frontend registration flow
* existing error handling
* existing retry logic
* existing duplicate protection
* existing email flow

Before coding, produce an internal architecture map of:

```text
Frontend
   ↓
Order creation
   ↓
Razorpay
   ↓
Payment callback
   ↓
Registration API
   ↓
Database
```

and identify exactly where payment/registration can currently be lost.

Do not modify code until you understand this flow.

---

# 3. DO NOT BREAK EXISTING FUNCTIONALITY

The following must continue working:

* Registration form
* Event selection
* Team registration
* Individual registration if currently supported
* Fee calculation
* Razorpay Checkout
* Razorpay order creation
* Existing payment signature verification
* MongoDB registration
* Registration ID generation
* Email confirmation
* Admin functionality
* Existing duplicate protection
* Existing queue/retry mechanisms where useful

Do not redesign unrelated UI.

Do not change event data.

Do not change event prices unless absolutely required by the existing architecture.

Do not remove existing safety mechanisms unless replacing them with a stronger equivalent.

---

# 4. TARGET ARCHITECTURE

Implement this architecture:

```text
                         STUDENT
                            │
                            ▼
                   Registration Form
                            │
                            ▼
                    POST /api/order
                            │
                            ▼
                       Razorpay
                            │
                            ▼
                    Razorpay Checkout
                            │
                  Payment completed
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
          Browser Callback          Webhook
                 │                     │
                 ▼                     ▼
       Immediate verification    Server-side
                                 verification
                 │                     │
                 └──────────┬──────────┘
                            ▼
                     Payment Record
                            │
                            ▼
                    Idempotency Check
                            │
                            ▼
                     Amount Check
                            │
                            ▼
                  Registration Processor
                            │
                            ▼
                    MongoDB Registration
                            │
                            ▼
                   Registration Confirmed
```

The important principle is:

```text
Razorpay = source of truth for payment status

MongoDB = source of truth for registration

Webhook = reliable bridge between payment and registration
```

---

# 5. CREATE A PAYMENT MODEL

Create a dedicated MongoDB Payment model/collection.

Use the project's existing Mongoose conventions.

Suggested fields:

```typescript
{
  orderId: string,
  paymentId?: string,

  amount: number,
  currency: string,

  status: string,

  registrationStatus: string,

  razorpayEventId?: string,

  registrationId?: string,

  createdAt: Date,
  updatedAt: Date
}
```

You may improve the schema if the existing project requires additional fields.

Recommended payment states:

```text
CREATED
AUTHORIZED
CAPTURED
FAILED
```

Recommended registration states:

```text
PENDING
PROCESSING
CONFIRMED
FAILED
```

For recovery situations use a state such as:

```text
PAYMENT_RECEIVED_REGISTRATION_PENDING
```

if useful.

The exact enum design may be adjusted based on the existing code.

---

# 6. PAYMENT RECORD MUST BE DURABLE

When a Razorpay order is created, store enough information to later associate:

```text
orderId
amount
currency
registration context
```

with the payment.

Do NOT rely exclusively on browser memory.

If the user closes the browser, the backend must still have enough information to recover the registration.

If the existing registration data is only sent after payment, redesign this carefully so the payment can still be associated with the intended registration.

Possible approaches include storing a pending registration/order record before opening Checkout or attaching safe metadata to the Razorpay order.

Choose the approach that best fits the existing project.

Do NOT put sensitive information in Razorpay notes/metadata.

---

# 7. BACKEND MUST BE AUTHORITATIVE FOR PAYMENT AMOUNT

Never trust:

```text
totalFee
```

from the frontend as the final source of truth.

The backend must calculate or validate the expected amount.

The flow should be:

```text
Selected events
      ↓
Backend calculates expected amount
      ↓
Backend creates Razorpay order
      ↓
Razorpay order amount = backend amount
```

After payment:

```text
Razorpay payment amount
        ↓
compare
        ↓
Razorpay order amount
```

Require:

```text
payment.amount === order.amount
```

and validate currency as appropriate.

If there is an amount mismatch:

```text
DO NOT create registration.
```

Record the suspicious/inconsistent payment state and make it recoverable for admin investigation.

---

# 8. KEEP CLIENT-SIDE PAYMENT SIGNATURE VERIFICATION

Do NOT remove the existing Razorpay Checkout signature verification.

Continue verifying:

```text
razorpay_order_id
razorpay_payment_id
razorpay_signature
```

using the server-side Razorpay secret.

The current HMAC-SHA256 verification should be preserved if correctly implemented.

The client callback is useful for:

* immediate confirmation
* fast UX
* displaying registration status

But it must NOT be the only mechanism that creates the registration.

---

# 9. IMPLEMENT RAZORPAY WEBHOOK

Add a dedicated endpoint such as:

```text
POST /api/razorpay/webhook
```

Use the exact route structure that fits the existing Vercel/Express architecture.

Support the relevant Razorpay events, preferably:

```text
payment.captured
order.paid
payment.failed
```

and handle `payment.authorized` if required by the existing capture configuration.

Do not blindly process every event.

---

# 10. WEBHOOK SIGNATURE VERIFICATION

This is critical.

Razorpay webhook signature verification must use:

```text
X-Razorpay-Signature
```

and the configured webhook secret.

Calculate the HMAC-SHA256 using the **raw request body**.

Do NOT parse/re-stringify the body before verifying the webhook signature.

The implementation must preserve access to the raw request bytes.

Because the application currently uses Express JSON middleware, carefully modify middleware configuration so that:

```text
Webhook route
    ↓
raw request body
    ↓
signature verification
    ↓
JSON parsing
```

works correctly.

Do not accidentally break JSON parsing for the rest of the API.

Use a dedicated webhook middleware strategy if necessary.

---

# 11. WEBHOOK IDEMPOTENCY

Razorpay webhook events can be delivered more than once.

Use:

```text
x-razorpay-event-id
```

as the webhook event identifier.

Store it in MongoDB.

Before processing an event:

```text
Does this event ID already exist?
```

If yes:

```text
Do not process it again.
Return 2xx.
```

If no:

```text
Record the event
Process it
```

Also make the actual payment/registration operation idempotent independently of webhook event IDs.

Do NOT depend only on event ID because different webhook events may refer to the same payment.

---

# 12. PAYMENT/REGISTRATION IDEMPOTENCY

The same payment must never create multiple registrations.

Use unique constraints and/or atomic checks for:

```text
paymentId
orderId
```

where appropriate.

For example:

```text
paymentId = pay_ABC
```

must always map to at most one registration.

The following scenario must be safe:

```text
Browser callback
       ↓
register request

Webhook
       ↓
registration request

Webhook retry
       ↓
registration request

Second browser request
       ↓
registration request
```

All of them must converge on:

```text
ONE PAYMENT
ONE REGISTRATION
ONE REGISTRATION ID
```

No duplicate registration IDs.

No duplicate team registration.

No duplicate payment association.

---

# 13. REGISTRATION PROCESSOR

Create a central registration-processing function.

Conceptually:

```typescript
processPaidOrder(orderId, paymentId)
```

or an equivalent name.

This function should:

1. Find the payment/order record.
2. Verify the Razorpay order/payment relationship.
3. Verify amount.
4. Check whether registration already exists.
5. If registration exists, return the existing registration.
6. If not, create exactly one registration.
7. Generate the registration ID atomically.
8. Persist the registration.
9. Mark payment.registrationStatus = CONFIRMED.
10. Trigger confirmation email safely.

Both:

```text
/api/register
```

and:

```text
/api/razorpay/webhook
```

should use the same core registration logic rather than maintaining two completely separate implementations.

---

# 14. TRANSACTION / ATOMICITY

Use the existing MongoDB transaction strategy where appropriate.

The system must avoid:

```text
Registration ID generated
        ↓
Registration save fails
        ↓
ID permanently lost
```

and:

```text
Registration partially saved
        ↓
Payment state incorrectly marked confirmed
```

Use the existing atomic counter and transaction infrastructure if it is correct.

Do not unnecessarily replace working transaction code.

---

# 15. HANDLE THE CRITICAL FAILURE CASE

This scenario must be explicitly supported:

```text
Student
  ↓
Pays successfully
  ↓
Internet disconnects
  ↓
Browser callback never reaches backend
```

Expected result:

```text
Razorpay
  ↓
Webhook
  ↓
Payment = CAPTURED
  ↓
Registration processor
  ↓
MongoDB registration
  ↓
Registration = CONFIRMED
```

Another scenario:

```text
Payment successful
       ↓
Webhook reaches backend
       ↓
MongoDB temporarily unavailable
```

Expected result:

```text
Payment = RECEIVED
Registration = PENDING
```

The payment must NOT be marked as failed.

The system must be able to retry/recover later.

---

# 16. VERCEL SERVERLESS CONSTRAINT

This project is currently deployed using Vercel/serverless infrastructure.

Do NOT rely on:

```typescript
someAsyncTask();
return response;
```

as a guaranteed background worker.

Do not assume the serverless function will continue running indefinitely after the HTTP response.

The webhook should:

1. Verify the request.
2. Persist the important payment/event state.
3. Perform only bounded work.
4. Return a 2xx response promptly.

Do not put slow email sending or long-running processing before webhook acknowledgment if it could cause the webhook to exceed its allowed response window.

Use durable MongoDB state for recovery.

The existing `guaranteedQueue` can remain and can be reused as a recovery mechanism if appropriate, but it must not be the sole guarantee based on an abandoned serverless request.

---

# 17. WEBHOOK RESPONSE BEHAVIOR

For a valid webhook:

```text
HTTP 200/2xx
```

For a duplicate already-processed webhook:

```text
HTTP 200/2xx
```

For malformed/invalid signature:

```text
HTTP 400
```

For temporary internal processing failures where Razorpay should retry:

Return an appropriate non-2xx response **only when retry is genuinely required**.

Do not acknowledge an event as successfully processed before its important durable state has been recorded.

---

# 18. PAYMENT FAILED

Handle:

```text
payment.failed
```

without creating a registration.

The Payment record should reflect:

```text
status = FAILED
registrationStatus = NOT_CREATED
```

or the project's equivalent.

Do not accidentally register a student simply because an order exists.

---

# 19. AUTHORIZED VS CAPTURED

Understand the Razorpay capture configuration already used by the project.

Do not assume:

```text
authorized = successfully registered
```

unless the payment configuration guarantees that behavior.

Prefer the final captured/paid state for registration.

Inspect the existing Razorpay order creation code before deciding the exact event flow.

---

# 20. EXISTING /api/register

Do NOT delete `/api/register`.

It should continue to provide immediate registration processing after the client callback.

But change it so that it:

1. Validates the request.
2. Verifies Razorpay signature.
3. Validates order/payment relationship.
4. Validates payment amount.
5. Uses the central idempotent registration processor.
6. Returns the existing registration if already processed.
7. Does not create duplicates.

The webhook becomes the recovery path.

---

# 21. FRONTEND BEHAVIOR

Make only the minimum required frontend changes.

After successful payment:

```text
Payment successful
      ↓
Call backend
      ↓
Receive registration confirmation/status
```

If the backend responds that payment has been received but registration is still processing:

Display an appropriate message such as:

```text
Payment received successfully.
Your registration is being confirmed.
Please do not make another payment.
```

Do NOT tell the student:

```text
Payment failed
```

when the payment may actually have succeeded.

This is important.

Never encourage the student to pay again just because the registration request timed out.

---

# 22. PREVENT DOUBLE PAYMENT / DOUBLE SUBMISSION

Inspect the existing frontend registration button behavior.

Prevent accidental multiple submissions while payment is in progress.

Implement safe UI state such as:

```text
idle
creating-order
checkout-open
payment-processing
registration-processing
success
pending
failure
```

Do not allow users to accidentally trigger multiple registration requests from double clicks.

However, backend idempotency must still protect against duplicates even if the frontend protection fails.

---

# 23. ERROR HANDLING

Separate these cases clearly:

### Payment failed

```text
PAYMENT_FAILED
```

### Payment successful, registration successful

```text
PAYMENT_CONFIRMED
REGISTRATION_CONFIRMED
```

### Payment successful, registration still processing

```text
PAYMENT_CONFIRMED
REGISTRATION_PENDING
```

### Invalid payment signature

```text
INVALID_PAYMENT_SIGNATURE
```

### Amount mismatch

```text
PAYMENT_AMOUNT_MISMATCH
```

### Duplicate request

Return the already-created registration instead of creating another one.

---

# 24. EMAIL HANDLING

Email sending must NOT determine whether payment is considered successful.

Bad:

```text
Payment
 ↓
Registration
 ↓
Send email
 ↓
Email fails
 ↓
Whole request considered failed
```

Correct:

```text
Payment
 ↓
Registration persisted
 ↓
Registration CONFIRMED
 ↓
Email attempted
```

If email fails, registration must remain confirmed.

Email can be retried separately.

---

# 25. LOGGING

Add useful structured logs around payment processing.

For example:

```text
ORDER_CREATED
PAYMENT_WEBHOOK_RECEIVED
PAYMENT_SIGNATURE_VALID
PAYMENT_SIGNATURE_INVALID
PAYMENT_AMOUNT_VALID
PAYMENT_AMOUNT_MISMATCH
PAYMENT_ALREADY_PROCESSED
REGISTRATION_CREATED
REGISTRATION_ALREADY_EXISTS
REGISTRATION_PROCESSING_FAILED
REGISTRATION_CONFIRMED
EMAIL_FAILED
```

Do NOT log:

```text
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
sensitive personal information unnecessarily
```

Payment IDs and order IDs can be logged for debugging if appropriate.

---

# 26. DATABASE INDEXES

Review and add appropriate indexes.

At minimum investigate unique indexes for:

```text
paymentId
orderId
razorpayEventId
```

and any existing registration identifiers that must be unique.

Be careful when adding unique indexes to an existing production database.

Before applying a unique index, check for existing duplicates.

Do not blindly deploy an index migration that could fail because of existing data.

---

# 27. EXISTING GUARANTEED QUEUE

Inspect:

```text
backend/src/utils/guaranteedQueue.ts
```

Do not automatically delete it.

Determine:

* what problem it currently solves
* whether it duplicates the new webhook mechanism
* whether it can safely remain as a retry/recovery layer
* whether it has any serverless-specific weaknesses

If useful, refactor it so the queue processes durable MongoDB payment/registration states.

If it is redundant after the new architecture, remove it only after proving that all of its guarantees are covered elsewhere.

---

# 28. SECURITY REQUIREMENTS

Never expose:

```text
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
MONGO_URI
```

to the frontend.

Frontend may only receive:

```text
VITE_RAZORPAY_KEY_ID
```

or whatever public Razorpay identifier is currently required.

Verify all payment-sensitive operations server-side.

Never trust:

```text
frontend totalFee
frontend payment status
frontend registration ID
```

as authoritative.

---

# 29. TESTING — EXTREMELY IMPORTANT

Before considering the work complete, create tests for all critical scenarios.

### Test 1 — Normal payment

```text
Order created
Payment succeeds
Callback succeeds
Webhook succeeds
```

Expected:

```text
1 payment
1 registration
1 registration ID
```

### Test 2 — Browser disappears

```text
Order created
Payment succeeds
Browser callback never reaches backend
Webhook arrives
```

Expected:

```text
Registration still created
```

### Test 3 — Duplicate webhook

Send the same webhook twice.

Expected:

```text
1 payment
1 registration
```

### Test 4 — Multiple webhook events

Send:

```text
payment.captured
order.paid
```

Expected:

```text
1 registration
```

### Test 5 — Duplicate /api/register

Send the same registration request twice.

Expected:

```text
1 registration
```

### Test 6 — MongoDB temporary failure

Simulate database failure during registration.

Expected:

```text
Payment is not marked failed.
Registration remains recoverable.
```

### Test 7 — Wrong amount

Example:

```text
Expected = ₹1500
Paid = ₹100
```

Expected:

```text
Registration NOT created.
```

### Test 8 — Invalid Checkout signature

Expected:

```text
Registration NOT created.
```

### Test 9 — Invalid webhook signature

Expected:

```text
Webhook rejected.
No registration created.
```

### Test 10 — Payment failed

Expected:

```text
No registration.
```

### Test 11 — Email failure

Expected:

```text
Registration remains CONFIRMED.
```

### Test 12 — Serverless timeout / request interruption

Simulate the registration HTTP request being interrupted after payment.

Expected:

```text
Webhook still recovers the registration.
```

---

# 30. TEST RAZORPAY IN TEST MODE FIRST

Do not immediately modify the production/live payment configuration.

Use Razorpay Test Mode.

Verify:

```text
Order creation
Checkout
Payment
Webhook
Signature
MongoDB
Registration
Email
Duplicate protection
Recovery
```

Only after the entire flow is proven should the production webhook configuration be considered.

---

# 31. ENVIRONMENT VARIABLES

Add only the required server-side variable, for example:

```text
RAZORPAY_WEBHOOK_SECRET
```

Do NOT expose it as:

```text
VITE_RAZORPAY_WEBHOOK_SECRET
```

or any frontend variable.

Update:

```text
.env.example
```

with placeholder values only.

Never commit real secrets.

---

# 32. VERCEL DEPLOYMENT

Inspect the current Vercel configuration and determine the correct way to expose the webhook endpoint.

The final endpoint must be publicly reachable over HTTPS.

Example:

```text
https://your-domain.com/api/razorpay/webhook
```

Do not assume the URL structure until you inspect the existing project.

Do not change the domain unless necessary.

---

# 33. RAZORPAY DASHBOARD CONFIGURATION

After code implementation, provide exact instructions for configuring the Razorpay webhook:

```text
Webhook URL
Webhook secret
Events to subscribe to
```

Recommended events should be based on the actual capture/order flow discovered in the repository.

Do NOT include the real secret in code.

---

# 34. IMPORTANT DESIGN RULE

The final system must satisfy this invariant:

```text
If Razorpay confirms that a valid payment was captured,
the system must have a durable path to create the corresponding registration.
```

And:

```text
One successful payment
        =
At most one registration
```

And:

```text
Payment failure
        ≠
Registration
```

And:

```text
Registration failure
        ≠
Payment failure
```

These distinctions must be reflected in the database state.

---

# 35. IMPLEMENTATION STRATEGY

Work in small, reviewable steps.

Recommended order:

### Step 1

Audit existing registration/payment architecture.

### Step 2

Document current failure points.

### Step 3

Create Payment model.

### Step 4

Modify order creation to persist durable payment/order context.

### Step 5

Implement webhook endpoint.

### Step 6

Implement raw-body webhook signature verification.

### Step 7

Implement webhook event idempotency.

### Step 8

Implement payment/order/amount validation.

### Step 9

Create central idempotent registration processor.

### Step 10

Refactor `/api/register` to use it.

### Step 11

Connect webhook to the same processor.

### Step 12

Integrate existing queue/retry system where appropriate.

### Step 13

Update frontend only where required.

### Step 14

Add tests.

### Step 15

Run lint/typecheck/build/tests.

### Step 16

Review the complete payment flow again.

---

# 36. DO NOT DO THESE THINGS

Do NOT:

* rewrite the entire application
* migrate away from Vercel
* migrate away from MongoDB
* introduce paid infrastructure
* introduce Redis unless absolutely necessary
* introduce Kafka/RabbitMQ/etc.
* depend on a continuously running worker
* trust frontend payment status
* trust frontend fee amount
* store Razorpay secrets in frontend code
* remove signature verification
* remove duplicate protection
* create registrations directly from unverified webhooks
* create duplicate registrations for duplicate webhook events
* send confirmation email before registration persistence
* tell users to pay again just because registration confirmation is delayed
* assume serverless background execution is guaranteed
* make unrelated UI changes

Keep the solution as simple as possible while achieving production-grade payment reliability.

---

# 37. ACCEPTANCE CRITERIA

The implementation is complete only if all of these are true:

```text
[ ] Existing registration flow still works

[ ] Razorpay order creation works

[ ] Backend controls the expected payment amount

[ ] Checkout signature is verified server-side

[ ] Razorpay webhook exists

[ ] Webhook signature is verified using raw request body

[ ] Webhook event IDs are deduplicated

[ ] Payment records are persisted

[ ] Payment status is separated from registration status

[ ] Successful payment can recover registration without browser callback

[ ] Duplicate webhook cannot create duplicate registration

[ ] Duplicate /api/register cannot create duplicate registration

[ ] Payment amount mismatch cannot create registration

[ ] Failed payment cannot create registration

[ ] MongoDB failure does not incorrectly mark payment as failed

[ ] Registration creation is idempotent

[ ] Registration ID generation remains safe

[ ] Email failure cannot invalidate successful registration

[ ] Existing queue/retry functionality is preserved or safely replaced

[ ] No secrets are exposed to frontend

[ ] Vercel deployment remains supported

[ ] Razorpay Test Mode flow passes

[ ] Production webhook configuration is documented

[ ] TypeScript compilation passes

[ ] Build passes

[ ] Tests pass
```

---

# 38. FINAL REPORT REQUIRED FROM THE AI AGENT

After implementation, provide a concise report containing:

## A. What was wrong

Explain the original payment → registration failure path.

## B. What changed

List every modified/created file.

For each file explain the change.

## C. New architecture

Show:

```text
Student
 ↓
Razorpay
 ↓
Callback + Webhook
 ↓
Payment
 ↓
Registration
```

## D. Failure recovery

Explain exactly what happens when:

```text
Browser closes
Network fails
Vercel request fails
MongoDB temporarily fails
Webhook is duplicated
Payment is duplicated
```

## E. Security

Explain:

```text
Checkout signature
Webhook signature
Amount validation
Idempotency
Secret handling
```

## F. Testing

Report the result of every critical test.

## G. Deployment

Give exact:

```text
Vercel environment variables
Razorpay webhook URL
Razorpay webhook events
Webhook secret configuration
```

Do not expose real secrets.

---

# FINAL INSTRUCTION

Treat this as a **payment reliability project**, not a normal CRUD feature.

The most important requirement is:

> A student must never lose their registration simply because their browser, internet connection, or client-side callback fails after Razorpay has successfully captured their payment.

At the same time:

> The system must never create duplicate registrations for the same payment.

Prioritize **correctness, durability, idempotency, security, and recoverability** over adding unnecessary complexity.

Before making changes, inspect the actual repository and adapt the implementation to the existing architecture rather than assuming filenames, routes, or deployment structure.
