/**
 * SEO Configuration
 * Update these values with real data as your application grows
 */

export const seoConfig = {
  // Application ratings - update with real data from your reviews/ratings system
  ratings: {
    value: 4.8,
    count: 150,
    // Set to true when you have real ratings data
    useRealData: false,
  },
  
  // Social media profiles (add your actual profiles)
  social: {
    twitter: '@essaywriter', // Update with your Twitter handle
    facebook: '', // Add your Facebook page URL
    linkedin: '', // Add your LinkedIn company page
    instagram: '', // Add your Instagram handle
  },
  
  // Contact information for structured data
  contact: {
    email: '', // Add your support email
    phone: '', // Add your phone number if applicable
  },
  
  // Organization details
  organization: {
    name: 'Essay Writer',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://essay-writer-01.vercel.app',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://essay-writer-01.vercel.app'}/opengraph-image`,
  },
}

