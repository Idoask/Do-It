/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // pageExtensions:['Tasks.tsx','TasksPage.tsx','CheckList.tsx','LinearProgressWithLabel.tsx','AppBar.tsx','TaskCard.tsx'],
  env:{
    siteUrl:'https://do-it-project-six.vercel.app',
    NEXT_PUBLIC_CLIENT_ID:'719797199893-br8esks29ts1ih0t3u5fd9ep22ln5rfc.apps.googleusercontent.com'

  }
}

module.exports = nextConfig
