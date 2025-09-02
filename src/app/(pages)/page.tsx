"use client";
import Header from "@/components/Header";
import { pricingPlans } from "@/pricing";
import Image from "next/image";
import {  BellAlertIcon, ChartBarIcon, LightBulbIcon } from "@heroicons/react/24/solid";
import Footer from "@/components/Footer";
// import { redirect } from "next/navigation";
// import useAuth from "@/context/useAuth";

export default function Home () {
//   const {authStatus} = useAuth();
// if (authStatus) {
//     redirect('/pay');
//   }
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Header/>
      <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
                    Your Personal Health Assistant
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                    AI-powered healthcare that understands you. Get personalized health insights, reminders, and recommendations.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a href="/sigIn"
                  >
                    <button
                    // onClick={() => setLoginModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
                    >
                    Get Started
                    </button>
                    </a>
                    <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium text-lg transition-colors" >
                        Learn More

                    </button>
                </div>
                <div className="mt-16 max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-2">
                        <div className="aspect-video bg-gradient-t-r from-blue-100 to-teal-100 rounded-lg flex items-center justify-center ">
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        {/* <i className="fas fa-robot text-white text-2xl"></i> */}
                                        <Image
                                          src="/icon-512.png"
                                          width={200}
                                          height={200}
                                          className="" 
                                          alt="JamboAI"
                                          />
                                </div>
                                <h3 className="text-xl font-semibold text-blue-900">
                                        AI Health Assistant 
                                </h3>
                                {/* <p className="text-gray-600 mt-2">Interactive dashboard would appear here</p> */}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
      </section>

      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">How jamboAI Helps You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        {/* <i className="fas fa-brain text-blue-600 text-xl"></i> */}
                        <LightBulbIcon className="size-6 text-yellow-600 text-xl" />
                    </div>
                         <h3 className="text-xl font-semibold text-blue-900 mb-2">AI-Powered Insights</h3>
                     <p className="text-gray-600">Get personalized health recommendations based on your symptoms and health data.</p>
                </div>
            <div className="bg-teal-50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    {/* <i className="fas fa-bell "></i> */}
                    <BellAlertIcon className="size-6 text-teal-600 text-xl " />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Smart Reminders</h3>
                 <p className="text-gray-600">Never miss medication, appointments, or health routines with intelligent reminders.</p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    {/* <i className="fas fa-chart-line text-indigo-600 text-xl"></i> */}
                    <ChartBarIcon className="size-6 text-indigo-600 text-xl" />
                </div>
                 <h3 className="text-xl font-semibold text-blue-900 mb-2">Health Tracking</h3>
              <p className="text-gray-600">Monitor your health metrics over time and see trends with easy-to-understand visuals.</p>
            </div>
            </div>
        </div>

      </section>

      <section id="pricing" className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-4">
            Simple, Transparent Pricing
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">Choose the plan that works best for you and your health goals.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
                <div
                key={index}
                className={`bg-white rounded-xl shadow-lg overflow-hidden ${plan.isPopular ? 'border-2 border-blue-600 transform scale-105' : 'border border-gray-200'}`}
                > 
                {plan.isPopular && (
                    <div className="bg-blue-600 text-white py-2 text-center font-semibold">
                        
                    </div>
                )}
                <div className="p-6">
                    <h3 className="text-2xl font-bold text-blue-900">{plan.name}</h3>
                    <div className="my-4">
                         <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <ul className="space-y-3 my-6">
                        {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}

                    </ul>
                    <button 
                    // onClick={() => setLoginModalOpen(true)}
                    className={`w-full py-3 rounded-lg font-medium mt-4 ${plan.isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}
                  >
                    Get Started
                  </button>
                    </div>

                </div>
                    
            ))}
        </div>
        </div>
      </section>

      <section id="faq" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-blue-900">How does the AI health assistant work?</h3>
              <p className="text-gray-600 mt-2">Our AI analyzes your health data, symptoms, and goals to provide personalized recommendations, reminders, and insights for better health management.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-blue-900">Is my health data secure?</h3>
              <p className="text-gray-600 mt-2">Yes, we use industry-standard encryption and comply with healthcare data protection regulations to keep your information safe and private.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-blue-900">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600 mt-2">Absolutely. You can cancel your monthly subscription at any time without any cancellation fees.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to take control of your health?</h2>
          {/* <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-10">Join thousands of users who are already improving their health with S.AI</p> */}
          <button 
            // onClick={() => setLoginModalOpen(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium text-lg transition-colors"
          >
            Get Started Today
          </button>
        </div>
      </section>
      <Footer/>
    </main>
  )
}