// src/app/api/webhooks/clerk/route.ts

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the event
  const eventType = evt.type;
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, phone_numbers, ...attributes } = evt.data;

    const email = email_addresses[0]?.email_address
    const phone = phone_numbers[0]?.phone_number

    if (!email) {
      return new Response('Error occured -- no email address', {
        status: 400
      })
    }

    await prisma.user.upsert({
      where: { clerkId: id as string },
      create: {
        clerkId: id as string,
        email: email,
        phone: phone,
        name: `${attributes.first_name} ${attributes.last_name}`,
      },
      update: {
        email: email,
        phone: phone,
        name: `${attributes.first_name} ${attributes.last_name}`,
      },
    })

    return new Response('User created or updated', { status: 200 })
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    await prisma.user.delete({
      where: { clerkId: id as string },
    })

    return new Response('User deleted', { status: 200 })
  }

  return new Response('Webhook received', { status: 200 })
}