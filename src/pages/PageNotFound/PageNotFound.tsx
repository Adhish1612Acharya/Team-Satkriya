import { Ghost, HomeIcon } from 'lucide-react'


const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <Ghost className="h-32 w-32 text-indigo-500 animate-float" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Oops! The page you're looking for seems to have vanished into thin air.
        </p>
        
        <a 
          href="/"
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 gap-2"
        >
          <HomeIcon className="h-5 w-5" />
          Back to Home
        </a>
      </div>
    </div>
  )
}

export default PageNotFound