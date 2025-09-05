import { Resend } from 'resend';

const resend = new Resend('re_cTuJZeBr_468xPkfJQsKV9F5t4JMnie36');

export default async function handler(req, res) {
  // Enable CORS for frontend requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      country,
      inquiry_type,
      organization,
      role,
      event_date,
      audience_size,
      budget,
      message
    } = req.body;

    // Basic validation
    if (!first_name || !last_name || !email || !inquiry_type || !message) {
      return res.status(400).json({ 
        message: 'Please fill in all required fields',
        success: false 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address',
        success: false 
      });
    }

    // Create email content in HTML format
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #D4AF37, #B8860B); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
          <p style="color: white; margin: 5px 0;">From rosemarynzembi.com</p>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Personal Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${first_name} ${last_name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Country:</td><td style="padding: 8px;">${country || 'Not provided'}</td></tr>
          </table>

          <h2 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-top: 30px;">Inquiry Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold;">Type of Inquiry:</td><td style="padding: 8px;">${inquiry_type}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Organization:</td><td style="padding: 8px;">${organization || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Role/Title:</td><td style="padding: 8px;">${role || 'Not provided'}</td></tr>
            ${event_date ? `<tr><td style="padding: 8px; font-weight: bold;">Event Date:</td><td style="padding: 8px;">${event_date}</td></tr>` : ''}
            ${audience_size ? `<tr><td style="padding: 8px; font-weight: bold;">Audience Size:</td><td style="padding: 8px;">${audience_size}</td></tr>` : ''}
            ${budget ? `<tr><td style="padding: 8px; font-weight: bold;">Budget Range:</td><td style="padding: 8px;">${budget}</td></tr>` : ''}
          </table>

          <h2 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-top: 30px;">Message</h2>
          <div style="background: white; padding: 15px; border-left: 4px solid #D4AF37; margin: 10px 0;">
            ${message}
          </div>

          <div style="margin-top: 30px; padding: 15px; background: #e8f4f8; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>How to respond:</strong> Simply reply to this email to contact ${first_name} directly at ${email}
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email using Resend
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'kandidxpressions@gmail.com',
        replyTo: email,
        subject: `New Contact Form Submission from ${first_name} ${last_name}`,
        html: htmlContent,
      });
      
      console.log('Email sent successfully via Resend');
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the form submission if email fails, but log the error
    }

    // Log the submission for debugging
    console.log('Contact form submission received:', {
      name: `${first_name} ${last_name}`,
      email,
      inquiry_type,
      timestamp: new Date().toISOString()
    });

    // Return success response
    return res.status(200).json({ 
      message: 'Thank you for your message! I will personally review it and respond within 48 hours.',
      success: true 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      message: 'Something went wrong. Please try again or contact us directly via email.',
      success: false 
    });
  }
}
