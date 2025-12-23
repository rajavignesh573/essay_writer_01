#!/usr/bin/env node

/**
 * Sitemap Submission Helper
 * 
 * This script helps you submit your sitemap to search engines.
 * 
 * Usage:
 *   node scripts/submit-sitemap.js
 * 
 * Make sure to set your site URL in the environment variable:
 *   NEXT_PUBLIC_SITE_URL=https://your-domain.com
 */

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://essay-writer-01.vercel.app'
const sitemapUrl = `${baseUrl}/sitemap.xml`

console.log('\n🚀 Sitemap Submission Helper\n')
console.log(`Your sitemap URL: ${sitemapUrl}\n`)

console.log('📋 Instructions to submit your sitemap:\n')

console.log('1️⃣  Google Search Console:')
console.log('   a. Go to https://search.google.com/search-console')
console.log('   b. Select your property')
console.log('   c. Go to Sitemaps in the left menu')
console.log('   d. Enter: sitemap.xml')
console.log('   e. Click Submit\n')

console.log('2️⃣  Bing Webmaster Tools:')
console.log('   a. Go to https://www.bing.com/webmasters')
console.log('   b. Select your site')
console.log('   c. Go to Sitemaps')
console.log('   d. Enter: ' + sitemapUrl)
console.log('   e. Click Submit\n')

console.log('3️⃣  Yandex Webmaster:')
console.log('   a. Go to https://webmaster.yandex.com')
console.log('   b. Select your site')
console.log('   c. Go to Indexing > Sitemaps')
console.log('   d. Enter: ' + sitemapUrl)
console.log('   e. Click Add\n')

console.log('4️⃣  Direct API Submission (Optional):\n')
console.log('   You can also submit programmatically using these URLs:')
console.log(`   Google: https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`)
console.log(`   Bing: https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`)

rl.question('\n❓ Would you like to open these URLs in your browser? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    const { exec } = require('child_process')
    const open = (url) => {
      const platform = process.platform
      const command =
        platform === 'darwin'
          ? 'open'
          : platform === 'win32'
          ? 'start'
          : 'xdg-open'
      exec(`${command} ${url}`)
    }

    console.log('\nOpening URLs...')
    setTimeout(() => open('https://search.google.com/search-console'), 500)
    setTimeout(() => open('https://www.bing.com/webmasters'), 1000)
    setTimeout(() => open(sitemapUrl), 1500)
  }
  
  console.log('\n✅ Done! Remember to verify your sitemap in each search engine.\n')
  rl.close()
})

