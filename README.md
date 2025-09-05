# Rosemary Nzembi Website

Professional website for Certified Professional Coach and Inspirational Speaker Rosemary Nzembi.

## Features

- ✅ Professional coaching and speaking services
- ✅ Daily inspirational content 
- ✅ Podcast showcase (Kandid Xpressions)
- ✅ Book collection
- ✅ Working contact form with email delivery
- ✅ Fully responsive design
- ✅ Fast loading and SEO optimized

## Contact Form Setup

The contact form uses Vercel serverless functions and Resend for email delivery.

### Quick Setup (Free):

1. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Deploy automatically

2. **Set up email delivery (Optional but recommended):**
   - Go to [Resend.com](https://resend.com) and create a free account
   - Get your API key
   - In Vercel dashboard, go to your project settings
   - Add environment variable: `RESEND_API_KEY` with your Resend API key
   - Verify a domain in Resend (or use their test domain for development)

3. **That's it!** Your contact form will now send emails to `kandidxpressions@gmail.com`

### How it works:

- Form submissions are processed by `/api/contact.js`
- Emails are sent via Resend service
- Professional HTML email format with all form data
- Validation and error handling included
- CORS configured for frontend requests

### Testing:

- Fill out the contact form on your live site
- Check `kandidxpressions@gmail.com` for the email
- Check Vercel function logs for debugging

## File Structure

```
/
├── api/
│   └── contact.js          # Serverless function for contact form
├── *.html                  # Website pages
├── *.jpg, *.png, *.jpeg   # Images
├── package.json            # Dependencies
├── vercel.json            # Vercel configuration
└── README.md              # This file
```

## Environment Variables

For production, set these in your Vercel dashboard:

- `RESEND_API_KEY` - Your Resend API key for email sending

## Support

For technical support, check:
- Vercel documentation: https://vercel.com/docs
- Resend documentation: https://resend.com/docs

---

© 2025 Rosemary Nzembi & Kandid Xpressions. All rights reserved.
