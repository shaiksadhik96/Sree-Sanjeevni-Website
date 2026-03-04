const AboutAyurvedaPage = () => {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-herbal-50 to-beige-50 p-8 rounded-lg shadow-md">
                <span className="pointer-events-none absolute -top-3 right-10 h-2 w-2 rounded-full bg-herbal-300/70"></span>
                <span className="pointer-events-none absolute top-10 right-24 h-1.5 w-1.5 rounded-full bg-amber-300/70"></span>
                <span className="pointer-events-none absolute bottom-6 left-12 h-2 w-2 rounded-full bg-herbal-200/70"></span>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Ayurveda</h1>
                <p className="text-base text-gray-600">Ancient wisdom for modern wellness</p>
            </div>

            {/* About Section */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">What is Ayurveda?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Ayurveda is a 5,000-year-old system of natural healing that originated in India. The word "Ayurveda" comes from Sanskrit: 
                    "Ayur" (life) and "Veda" (knowledge or science), meaning "the science of life."
                </p>
                <p className="text-gray-700 leading-relaxed">
                    This holistic approach to health focuses on balancing the mind, body, and spirit through natural therapies, 
                    herbal treatments, proper nutrition, and lifestyle adjustments tailored to each individual's unique constitution.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-herbal-100">
                    <h3 className="text-sm font-semibold text-herbal-800 uppercase tracking-widest">Daily Rhythm</h3>
                    <p className="text-xs text-gray-500 mt-1">Simple routine for balance.</p>
                    <ul className="mt-4 space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>
                            Start the day with warm water and light stretching.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>
                            Eat the biggest meal at mid-day when digestion is strongest.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>
                            Wind down early with herbal tea and gentle breathing.
                        </li>
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-herbal-100">
                    <h3 className="text-sm font-semibold text-herbal-800 uppercase tracking-widest">Herb Spotlight</h3>
                    <p className="text-xs text-gray-500 mt-1">Common clinic favorites.</p>
                    <div className="mt-4 space-y-3 text-sm text-gray-700">
                        <div>
                            <p className="font-semibold">Ashwagandha</p>
                            <p className="text-xs text-gray-500">Supports energy and stress balance.</p>
                        </div>
                        <div>
                            <p className="font-semibold">Triphala</p>
                            <p className="text-xs text-gray-500">Gentle digestion and detox support.</p>
                        </div>
                        <div>
                            <p className="font-semibold">Turmeric</p>
                            <p className="text-xs text-gray-500">Helps with inflammation and recovery.</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-herbal-100">
                    <h3 className="text-sm font-semibold text-herbal-800 uppercase tracking-widest">Quick Facts</h3>
                    <p className="text-xs text-gray-500 mt-1">Helpful reference points.</p>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between rounded-lg bg-herbal-50 px-4 py-3">
                            <span className="text-xs text-gray-600">Core Doshas</span>
                            <span className="text-sm font-semibold text-herbal-700">3</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-beige-50 px-4 py-3">
                            <span className="text-xs text-gray-600">Basic Principles</span>
                            <span className="text-sm font-semibold text-beige-500">5 Elements</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 border border-herbal-100">
                            <span className="text-xs text-gray-600">Lifestyle Pillars</span>
                            <span className="text-sm font-semibold text-gray-700">Diet, Sleep, Routine</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Three Doshas */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">The Three Doshas</h2>
                <p className="text-gray-700 mb-6">
                    According to Ayurveda, every person is made of a unique combination of three fundamental energies or doshas:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Vata */}
                    <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Vata</h3>
                        </div>
                        <p className="text-gray-700 text-sm mb-2"><strong>Elements:</strong> Air & Space</p>
                        <p className="text-gray-700 text-sm mb-2"><strong>Qualities:</strong> Movement, creativity, flexibility</p>
                        <p className="text-gray-700 text-sm">Governs breathing, circulation, and nerve impulses</p>
                    </div>

                    {/* Pitta */}
                    <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Pitta</h3>
                        </div>
                        <p className="text-gray-700 text-sm mb-2"><strong>Elements:</strong> Fire & Water</p>
                        <p className="text-gray-700 text-sm mb-2"><strong>Qualities:</strong> Transformation, intelligence, metabolism</p>
                        <p className="text-gray-700 text-sm">Governs digestion, metabolism, and body temperature</p>
                    </div>

                    {/* Kapha */}
                    <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Kapha</h3>
                        </div>
                        <p className="text-gray-700 text-sm mb-2"><strong>Elements:</strong> Earth & Water</p>
                        <p className="text-gray-700 text-sm mb-2"><strong>Qualities:</strong> Structure, stability, lubrication</p>
                        <p className="text-gray-700 text-sm">Governs immunity, strength, and body structure</p>
                    </div>
                </div>
            </div>

            {/* Flow of Health */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">How Ayurveda Promotes Health</h2>
                
                <div className="relative">
                    {/* Vertical Flow Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-green-400 to-purple-400 transform -translate-x-1/2 hidden md:block"></div>
                    
                    <div className="space-y-12">
                        {/* Step 1 */}
                        <div className="flex items-center md:flex-row flex-col">
                            <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Balance</h3>
                                <p className="text-gray-700">Ayurveda works to balance the three doshas according to your unique constitution, promoting optimal health.</p>
                            </div>
                            <div className="relative z-10 flex-shrink-0">
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="md:w-1/2 md:pl-12"></div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-center md:flex-row flex-col">
                            <div className="md:w-1/2 md:pr-12"></div>
                            <div className="relative z-10 flex-shrink-0">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="md:w-1/2 md:pl-12 mb-4 md:mb-0">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Detoxification</h3>
                                <p className="text-gray-700">Through Panchakarma and other therapies, toxins are eliminated from the body, strengthening immune function.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-center md:flex-row flex-col">
                            <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Nourishment</h3>
                                <p className="text-gray-700">Proper nutrition and herbal supplements nourish the body at a cellular level, promoting vitality and longevity.</p>
                            </div>
                            <div className="relative z-10 flex-shrink-0">
                                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="md:w-1/2 md:pl-12"></div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-center md:flex-row flex-col">
                            <div className="md:w-1/2 md:pr-12"></div>
                            <div className="relative z-10 flex-shrink-0">
                                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="md:w-1/2 md:pl-12 mb-4 md:mb-0">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">4. Harmony</h3>
                                <p className="text-gray-700">Mind-body practices like yoga and meditation create emotional balance and mental clarity for holistic wellness.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-brand to-brand-dark p-8 rounded-lg shadow-md text-center text-white relative overflow-hidden">
                <span className="pointer-events-none absolute top-6 left-10 h-2 w-2 rounded-full bg-white/40"></span>
                <span className="pointer-events-none absolute bottom-8 right-12 h-1.5 w-1.5 rounded-full bg-white/40"></span>
                <h2 className="text-2xl font-semibold mb-4">Begin Your Healing Journey</h2>
                <p className="text-base mb-6">Experience the transformative power of Ayurveda at Shree Sanjeevni</p>
                <button className="bg-white text-brand px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                    Book a Consultation
                </button>
            </div>
        </div>
    );
};

export default AboutAyurvedaPage;
