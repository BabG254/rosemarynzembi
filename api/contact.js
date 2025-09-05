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

    // Store submission data for logging/notification
    const submissionData = {
      timestamp: new Date().toISOString(),
      name: `${first_name} ${last_name}`,
      email,
      phone: phone || 'Not provided',
      country: country || 'Not provided',
      inquiry_type,
      organization: organization || 'Not provided',
      role: role || 'Not provided',
      event_date: event_date || 'Not specified',
      audience_size: audience_size || 'Not specified',
      budget: budget || 'Not specified',
      message
    };

    // Log the submission (you can check Vercel function logs to see these)
    console.log('📧 NEW CONTACT FORM SUBMISSION:');
    console.log('================================');
    console.log(`Name: ${submissionData.name}`);
    console.log(`Email: ${submissionData.email}`);
    console.log(`Phone: ${submissionData.phone}`);
    console.log(`Country: ${submissionData.country}`);
    console.log(`Inquiry Type: ${submissionData.inquiry_type}`);
    console.log(`Organization: ${submissionData.organization}`);
    console.log(`Role: ${submissionData.role}`);
    console.log(`Event Date: ${submissionData.event_date}`);
    console.log(`Audience Size: ${submissionData.audience_size}`);
    console.log(`Budget: ${submissionData.budget}`);
    console.log(`Message: ${submissionData.message}`);
    console.log(`Submitted at: ${submissionData.timestamp}`);
    console.log('================================');

    // Send notification to your email using FormSubmit (free service)
    try {
      const formData = new FormData();
      formData.append('_to', 'kandidxpressions@gmail.com');
      formData.append('_subject', `New Contact Form Submission from ${first_name} ${last_name}`);
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');
      formData.append('Name', `${first_name} ${last_name}`);
      formData.append('Email', email);
      formData.append('Phone', phone || 'Not provided');
      formData.append('Country', country || 'Not provided');
      formData.append('Inquiry_Type', inquiry_type);
      formData.append('Organization', organization || 'Not provided');
      formData.append('Role', role || 'Not provided');
      formData.append('Event_Date', event_date || 'Not specified');
      formData.append('Audience_Size', audience_size || 'Not specified');
      formData.append('Budget', budget || 'Not specified');
      formData.append('Message', message);
      formData.append('Submission_Time', submissionData.timestamp);

      const response = await fetch('https://formsubmit.co/kandidxpressions@gmail.com', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('✅ Email notification sent successfully via FormSubmit');
      } else {
        console.log('⚠️ FormSubmit response not OK, but submission logged');
      }
    } catch (emailError) {
      console.error('⚠️ Email notification failed, but submission is logged:', emailError.message);
    }

    // Return success response
    return res.status(200).json({ 
      message: 'Thank you for your message! I will personally review it and respond within 48 hours.',
      success: true,
      submissionId: submissionData.timestamp 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      message: 'Something went wrong. Please try again or contact us directly via email.',
      success: false 
    });
  }
}
