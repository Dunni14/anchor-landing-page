import { neon } from '@netlify/neon';

export default async (request, context) => {
  const sql = neon();
  
  // Enable CORS for all origins
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }
  
  try {
    const { email } = await request.json();
    
    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid email address' 
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Insert into database
    const result = await sql`
      INSERT INTO waitlist_signups (email, created_at, user_agent, ip_address) 
      VALUES (
        ${email}, 
        NOW(), 
        ${request.headers.get('user-agent') || 'Unknown'}, 
        ${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown'}
      )
      ON CONFLICT (email) DO UPDATE SET
        updated_at = NOW()
      RETURNING id, created_at
    `;
    
    const isNewSignup = result.length > 0;
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: isNewSignup ? 'Successfully signed up!' : 'Email already registered!',
      isNew: isNewSignup
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    
    // Check if it's a duplicate email error
    if (error.message && error.message.includes('duplicate key')) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Email already registered!',
        isNew: false
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Server error. Please try again.' 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
};