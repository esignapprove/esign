import { createTransport } from 'nodemailer';

import { ResendTransport } from '@documenso/nodemailer-resend';

import { MailChannelsTransport } from './transports/mailchannels';

const getTransport = () => {
  const transport = process.env.NEXT_PRIVATE_SMTP_TRANSPORT ?? 'smtp-auth';

  if (transport === 'mailchannels') {
    return createTransport(
      MailChannelsTransport.makeTransport({
        apiKey: process.env.NEXT_PRIVATE_MAILCHANNELS_API_KEY,
        endpoint: process.env.NEXT_PRIVATE_MAILCHANNELS_ENDPOINT,
      }),
    );
  }

  if (transport === 'resend') {
    return createTransport(
      ResendTransport.makeTransport({
        apiKey: process.env.NEXT_PRIVATE_RESEND_API_KEY || '',
      }),
    );
  }
  
  // Check for Gmail Transport
  if (transport === 'gmail') {
    if (!process.env.NEXT_PRIVATE_SMTP_USERNAME || !process.env.NEXT_PRIVATE_SMTP_PASSWORD) {
      throw new Error(
        'Gmail transport requires NEXT_PRIVATE_SMTP_USERNAME and NEXT_PRIVATE_SMTP_PASSWORD',
      );
    }

    return createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_PRIVATE_SMTP_USERNAME,
        pass: process.env.NEXT_PRIVATE_SMTP_PASSWORD,
      },
    });
  }

  if (transport === 'smtp-api') {
    if (!process.env.NEXT_PRIVATE_SMTP_HOST || !process.env.NEXT_PRIVATE_SMTP_APIKEY) {
      throw new Error(
        'SMTP API transport requires NEXT_PRIVATE_SMTP_HOST and NEXT_PRIVATE_SMTP_APIKEY',
      );
    }

    return createTransport({
      host: process.env.NEXT_PRIVATE_SMTP_HOST,
      port: Number(process.env.NEXT_PRIVATE_SMTP_PORT) || 587,
      secure: process.env.NEXT_PRIVATE_SMTP_SECURE === 'true',
      auth: {
        user: process.env.NEXT_PRIVATE_SMTP_APIKEY_USER ?? 'apikey',
        pass: process.env.NEXT_PRIVATE_SMTP_APIKEY ?? '',
      },
    });
  }

  return createTransport({
    host: process.env.NEXT_PRIVATE_SMTP_HOST ?? 'localhost:2500',
    port: Number(process.env.NEXT_PRIVATE_SMTP_PORT) || 587,
    secure: process.env.NEXT_PRIVATE_SMTP_SECURE === 'true',
    auth: {
      user: process.env.NEXT_PRIVATE_SMTP_USERNAME ?? '',
      pass: process.env.NEXT_PRIVATE_SMTP_PASSWORD ?? '',
    },
  });
};

export const mailer = getTransport();
