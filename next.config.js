/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // pageExtensions:['Tasks.tsx','TasksPage.tsx','CheckList.tsx','LinearProgressWithLabel.tsx','AppBar.tsx','TaskCard.tsx'],
  env:{
    siteUrl:'https://do-it-project-six.vercel.app',
    NEXT_PUBLIC_CLIENT_ID:'535846742868-guptiq92rmta181m6o53rtdic29km3v1.apps.googleusercontent.com'

  }
}

module.exports = nextConfig
