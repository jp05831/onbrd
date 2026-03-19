export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  content: string
}

export const posts: BlogPost[] = [
  {
    slug: 'client-onboarding-checklist',
    title: 'Client Onboarding Checklist: Everything You Need to Include',
    description:
      'A complete client onboarding checklist covering contracts, payments, intake forms, kickoff calls, and more — so nothing falls through the cracks.',
    date: '2025-03-10',
    readTime: '6 min read',
    category: 'Guides',
    content: `
## Why Your Onboarding Process Matters

First impressions are everything. A smooth onboarding experience sets the tone for the entire client relationship — it signals professionalism, builds trust, and reduces the back-and-forth that drains everyone's time.

A disorganized onboarding (scattered emails, missing documents, forgotten steps) does the opposite. Clients start to wonder if they made the right call.

Here's a checklist you can use to make sure every client gets a consistent, professional experience from day one.

---

## The Complete Client Onboarding Checklist

### 1. Send a Welcome Message
Don't wait for them to reach out. As soon as a client signs on, send a warm welcome email that:
- Confirms you're excited to work together
- Sets expectations for what happens next
- Gives them a timeline for the onboarding process

### 2. Send the Contract
Get this signed before any work begins. Use a tool like DocuSign, PandaDoc, or HelloSign to make it easy for clients to sign digitally. Make sure your contract covers:
- Scope of work
- Payment terms
- Revision policy
- Termination clauses

### 3. Collect Payment
Don't start work without a deposit or first payment in place. Tools like Stripe make it easy to collect upfront payments securely.

### 4. Send an Intake Form
Gather all the information you need to do great work. Your intake form might include:
- Brand guidelines, logos, and assets
- Login credentials (use a secure sharing tool)
- Goals and success metrics
- Key contacts and decision-makers
- Deadlines and important dates

### 5. Provide Access to Your Client Portal
Give clients a single place to track progress, upload files, and see what's coming next. This replaces the "what's the status?" emails that eat up hours every week.

### 6. Schedule the Kickoff Call
Get everyone on the same page early. A 30-60 minute kickoff call should cover:
- Project goals and priorities
- Communication preferences (email, Slack, etc.)
- Meeting cadence
- Your working process

### 7. Set Up Communication Channels
Decide where and how you'll communicate. Stick to one or two channels max — email plus a Slack channel is usually plenty.

### 8. Share a Project Timeline
Give clients a clear view of milestones, deliverables, and deadlines. Use a simple shared doc or project management tool.

---

## The Problem with Manual Checklists

Most freelancers and agencies run this process through a mix of email templates, Notion docs, and mental notes. It works until it doesn't — one busy week and steps get skipped, emails get forgotten, clients fall through the cracks.

The better approach is a client onboarding portal: a single link you send to every new client that walks them through each step in order. They sign the contract, pay the invoice, fill out the intake form, and book the kickoff call — all in one place, all tracked automatically.

That's exactly what [Onbrd](https://www.onbrd.net) does. Build your flow once, send the link to every new client, and see their progress in real time.

---

## Summary

A great client onboarding checklist includes:
1. Welcome message
2. Contract signing
3. Payment collection
4. Intake form
5. Client portal access
6. Kickoff call
7. Communication setup
8. Project timeline

Get these steps right and you'll start every engagement on solid footing.
    `.trim(),
  },
  {
    slug: 'how-to-create-client-onboarding-portal',
    title: 'How to Create a Client Onboarding Portal (Step by Step)',
    description:
      'Learn how to build a client onboarding portal that guides clients through contracts, payments, and intake forms — without the email chaos.',
    date: '2025-03-15',
    readTime: '5 min read',
    category: 'How-to',
    content: `
## What Is a Client Onboarding Portal?

A client onboarding portal is a dedicated page — usually a single link — that walks a new client through every step they need to complete before work begins. Instead of sending a barrage of emails ("here's the contract... now here's the invoice... did you fill out the intake form?"), you send one link that handles it all in sequence.

Done right, a client portal:
- Reduces back-and-forth emails
- Makes your business look more professional
- Ensures no steps get skipped
- Lets you track client progress without chasing

Here's how to build one.

---

## Step 1: Map Out Your Onboarding Steps

Start by listing every action a new client needs to take. Most businesses need some combination of:

- **Sign the contract** — DocuSign, PandaDoc, HelloSign
- **Pay the deposit** — Stripe, PayPal, Square
- **Fill out an intake form** — Typeform, Google Forms, JotForm
- **Upload assets** — logos, brand guidelines, photos
- **Book the kickoff call** — Calendly, Cal.com
- **Join your Slack/communication channel**

You don't need to build these tools — you just need a place to organize the links and track completion.

---

## Step 2: Choose Your Portal Tool

You have a few options:

**DIY with Notion or Google Sites** — Free but clunky. Clients can't mark steps as done, you can't track progress, and it doesn't look great.

**Custom-built portal** — Full control, but expensive and time-consuming to build and maintain.

**Dedicated onboarding tool** — Purpose-built for this exact use case. [Onbrd](https://www.onbrd.net) lets you create step-by-step onboarding flows in minutes, share a single link, and track which steps each client has completed.

---

## Step 3: Build Your Flow

In Onbrd:
1. Create a new flow and give it a name (e.g., "New Client Onboarding")
2. Add each step with a title, description, and link to the relevant tool
3. Order the steps so they flow logically (contract first, then payment, then intake form)
4. Preview it from your client's perspective

---

## Step 4: Customize for Each Client

A good portal feels personal, not generic. Add:
- Your client's company name
- Any specific instructions unique to their project
- A custom message at the top

---

## Step 5: Send the Link

Copy the unique link for this client's flow and paste it into your welcome email. That's it. Your client clicks it, sees exactly what they need to do, completes each step, and you get notified when they're done.

---

## What to Avoid

- **Too many steps** — keep it to the essentials. If you have more than 6-7 steps, consider splitting into phases.
- **Vague step names** — "Complete paperwork" is worse than "Sign your service agreement (takes 2 min)"
- **No progress tracking** — you need to know when clients are stuck so you can follow up

---

## The Result

When your onboarding process is centralized in a portal, you spend less time chasing clients and more time doing the actual work. Clients appreciate the clarity, and you look like a more established, professional operation.

Ready to build yours? [Start free on Onbrd →](https://www.onbrd.net/signup)
    `.trim(),
  },
  {
    slug: 'best-client-onboarding-tools',
    title: 'Best Client Onboarding Tools in 2025',
    description:
      'A roundup of the best tools for client onboarding — from portals and contracts to payments and scheduling. Find the right stack for your business.',
    date: '2025-03-18',
    readTime: '7 min read',
    category: 'Resources',
    content: `
## The Client Onboarding Tool Stack

There's no single tool that handles every part of client onboarding — but there is a stack of tools that, together, make the whole process smooth and professional.

Here's a breakdown of the best tools in each category.

---

## Client Onboarding Portals

**[Onbrd](https://www.onbrd.net)** — Purpose-built for creating step-by-step client onboarding flows. You create a flow with links to your existing tools (contracts, payments, forms), share one link with your client, and track their progress in real time. No extra software for clients to learn. Start free.

**Notion** — Works as a lightweight portal if you're on a budget, but clients can't mark steps as done and you can't track progress automatically.

**Dubsado / HoneyBook** — Full CRM platforms with onboarding features built in. Great if you want an all-in-one solution, but heavier and more expensive than dedicated tools.

---

## Contract Signing

**DocuSign** — The industry standard. Reliable, legally binding, integrates with almost everything. Starts at ~$15/mo.

**PandaDoc** — Strong alternative with a good free tier and built-in templates. Better UI than DocuSign in many opinions.

**HelloSign (now Dropbox Sign)** — Clean, simple, and affordable. Great for smaller teams.

---

## Payments

**Stripe** — Best-in-class for online payments. Used by millions of businesses. Easy to create payment links, subscriptions, and invoices.

**PayPal** — Ubiquitous and trusted by clients, though fees can be higher than Stripe.

**Square** — Good if you also take in-person payments.

---

## Intake Forms

**Typeform** — Beautiful, conversational forms with high completion rates. Great for intake forms that feel human.

**Google Forms** — Free and simple. Not the prettiest but gets the job done.

**JotForm** — More powerful than Google Forms with better file upload support. Good free tier.

---

## Scheduling

**Calendly** — The go-to for scheduling kickoff calls. Clients pick a time from your availability, it syncs to your calendar automatically.

**Cal.com** — Open-source alternative to Calendly. Self-hostable if you care about that.

**SavvyCal** — Lets clients overlay their own calendar for easier scheduling.

---

## File Sharing

**Google Drive** — Simple and familiar. Works well for sharing brand assets and documents.

**Dropbox** — Better for larger files and external sharing.

**Onbrd** — Also supports direct file uploads from clients as part of your onboarding flow.

---

## Communication

**Slack** — Great for ongoing client communication, especially on longer projects.

**Linear / Notion** — For tracking project tasks and sharing progress.

**Email** — Still the default. Keep it clean and professional.

---

## The Recommended Stack

For most freelancers and small agencies, this combination works well:

| Step | Tool |
|------|------|
| Onboarding portal | Onbrd |
| Contract | PandaDoc or HelloSign |
| Payment | Stripe |
| Intake form | Typeform |
| Scheduling | Calendly |
| Communication | Email + Slack |

The key is to tie it all together in one place — so clients don't have to hunt through their inbox for the right link. An onboarding portal like Onbrd does exactly that.

[Build your client onboarding portal free →](https://www.onbrd.net/signup)
    `.trim(),
  },
]

export function getAllPosts(): BlogPost[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
