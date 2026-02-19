import './globals.css'

export const metadata = {
  title: 'Vesta Design Studio',
  description: 'Designer tools and resources for Vesta Home',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
