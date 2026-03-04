const BenefitsPage = () => {
    const benefits = [
        {
            title: "Natural Healing",
            description: "Uses herbs, minerals, and natural compounds to heal without harsh chemicals or side effects.",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Stress Relief",
            description: "Meditation, yoga, and breathing exercises reduce stress hormones and promote mental peace.",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Improved Digestion",
            description: "Ayurvedic diet and herbs enhance digestive fire (Agni), leading to better nutrient absorption.",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            title: "Weight Management",
            description: "Personalized diet plans and treatments help maintain healthy body weight naturally.",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Glowing Skin",
            description: "Detoxification and herbal treatments purify blood, resulting in radiant, healthy skin.",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: "bg-pink-100 text-pink-600"
        },
        {
            title: "Stronger Immunity",
            description: "Rasayana (rejuvenation) therapies boost the immune system and prevent diseases.",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            color: "bg-red-100 text-red-600"
        },
        {
            title: "Better Sleep",
            description: "Herbal remedies and lifestyle adjustments promote deep, restful sleep and reduce insomnia.",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ),
            color: "bg-indigo-100 text-indigo-600"
        },
        {
            title: "Pain Relief",
            description: "Massage therapies and herbal treatments alleviate chronic pain and inflammation naturally.",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            color: "bg-orange-100 text-orange-600"
        },
        {
            title: "Hormonal Balance",
            description: "Specific herbs and treatments help regulate hormones for reproductive and overall health.",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            ),
            color: "bg-teal-100 text-teal-600"
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-herbal-50 to-beige-50 p-8 rounded-lg shadow-md">
                <span className="pointer-events-none absolute -top-2 right-12 h-2 w-2 rounded-full bg-herbal-300/70"></span>
                <span className="pointer-events-none absolute top-10 right-24 h-1.5 w-1.5 rounded-full bg-amber-300/70"></span>
                <span className="pointer-events-none absolute bottom-6 left-12 h-2 w-2 rounded-full bg-herbal-200/70"></span>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Benefits of Ayurveda</h1>
                <p className="text-base text-gray-600">Discover how ancient Ayurvedic wisdom can transform your health and well-being</p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className={`${benefit.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                            {benefit.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-herbal-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Rituals</h2>
                    <p className="text-xs text-gray-500 mb-4">Small routines that compound over time.</p>
                    <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>Wake up early and hydrate before coffee.</li>
                        <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>Eat warm, freshly cooked meals.</li>
                        <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>Oil massage (abhyanga) 2-3 times a week.</li>
                        <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>End the day with light stretches and breathing.</li>
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-herbal-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Dosha Balance Guide</h2>
                    <p className="text-xs text-gray-500 mb-4">Quick reference for balancing actions.</p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                            <span className="text-xs text-gray-600">Vata</span>
                            <span className="text-xs font-semibold text-blue-600">Warm, grounding, routine</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
                            <span className="text-xs text-gray-600">Pitta</span>
                            <span className="text-xs font-semibold text-red-600">Cooling, calm, steady</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3">
                            <span className="text-xs text-gray-600">Kapha</span>
                            <span className="text-xs font-semibold text-green-700">Light, active, energizing</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Treatments Section */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Signature Treatments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-l-4 border-brand pl-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Abhyanga Massage (60 min)</h4>
                        <p className="text-gray-600 mb-2">Full-body herbal oil massage that improves circulation and calms the nervous system.</p>
                        <p className="text-brand font-semibold">Rs. 1200</p>
                    </div>
                    <div className="border-l-4 border-brand pl-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Shirodhara Therapy (45 min)</h4>
                        <p className="text-gray-600 mb-2">Warm oil poured over the forehead to relieve stress and enhance mental clarity.</p>
                        <p className="text-brand font-semibold">Rs. 1800</p>
                    </div>
                    <div className="border-l-4 border-brand pl-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Panchakarma Detox (90 min)</h4>
                        <p className="text-gray-600 mb-2">Comprehensive cleansing program to eliminate toxins and rejuvenate the body.</p>
                        <p className="text-brand font-semibold">Rs. 2500</p>
                    </div>
                    <div className="border-l-4 border-brand pl-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Nasya Therapy (30 min)</h4>
                        <p className="text-gray-600 mb-2">Nasal administration of herbal oils to clear sinuses and improve respiratory health.</p>
                        <p className="text-brand font-semibold">Rs. 900</p>
                    </div>
                </div>
            </div>

            {/* Testimonial Section */}
            <div className="bg-gradient-to-r from-brand-light to-herbal-100 p-8 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">What Our Patients Say</h2>
                <div className="text-center max-w-2xl mx-auto">
                    <p className="text-base text-gray-700 italic mb-4">
                        "Ayurveda has completely transformed my life. The treatments at Shree Sanjeevni are exceptional, 
                        and I feel more energized and balanced than ever before."
                    </p>
                    <p className="text-gray-600 font-semibold">- Priya Sharma, Regular Patient</p>
                </div>
            </div>
        </div>
    );
};

export default BenefitsPage;
