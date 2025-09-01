export default function Footer() {
    return (
        <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-sm">jambo</div>
              <span className="ml-3 text-xl font-semibold">jamboAI</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-200">Privacy Policy</a>
              <a href="#" className="hover:text-blue-200">Terms of Service</a>
              <a href="#" className="hover:text-blue-200">Contact</a>
            </div>
          </div>
          <div className="text-center text-blue-200 mt-8">
            <p>© {new Date().getFullYear()} jamboAI Health Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}