const ServicesPage = () => {
    const services = [
        { name: 'Abhyanga Massage', duration: '60 min', price: 1200, description: 'Full-body herbal oil massage that improves circulation and calms the nervous system.' },
        { name: 'Shirodhara Therapy', duration: '45 min', price: 1800, description: 'Warm oil poured over the forehead to relieve stress and enhance mental clarity.' },
        { name: 'Panchakarma Detox', duration: '90 min', price: 2500, description: 'Comprehensive cleansing program to eliminate toxins and rejuvenate the body.' },
        { name: 'Herbal Steam', duration: '30 min', price: 800, description: 'Steam therapy with medicinal herbs to open pores and eliminate toxins through skin.' },
        { name: 'Nasya Therapy', duration: '30 min', price: 900, description: 'Nasal administration of herbal oils to clear sinuses and improve respiratory health.' },
        { name: 'Kati Basti (Back Care)', duration: '50 min', price: 1400, description: 'Warm medicated oil pooled on lower back to relieve pain and stiffness.' },
        { name: 'Swedana (Sweating Therapy)', duration: '40 min', price: 1100, description:'Herbal steam therapy to eliminate toxins and improve circulation.' },
        { name: 'Netra Tarpana (Eye Care)', duration: '35 min', price: 1000, description: 'Ghee treatment for eyes to improve vision and relieve eye strain.' },
    ];

    const paymentModes = [
        'UPI (Google Pay / PhonePe)',
        'Debit or Credit Card',
        'Cash',
        'Bank Transfer',
    ];

    const discounts = [
        { type: 'Senior Citizen (60+)', discount: '15% Off' },
        { type: 'First Visit', discount: '10% Off' },
        { type: 'Package (3+ Sessions)', discount: '20% Off' },
        { type: 'Weekend Special', discount: '12% Off' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-herbal-50 to-beige-50 p-8 rounded-lg shadow-md">
                <span className="pointer-events-none absolute -top-2 right-12 h-2 w-2 rounded-full bg-herbal-300/70"></span>
                <span className="pointer-events-none absolute top-10 right-24 h-1.5 w-1.5 rounded-full bg-amber-300/70"></span>
                <span className="pointer-events-none absolute bottom-6 left-12 h-2 w-2 rounded-full bg-herbal-200/70"></span>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Our Services</h1>
                <p className="text-base text-gray-600">Standard offerings with transparent pricing</p>
            </div>

            {/* Services List */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ayurvedic Treatments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service, index) => (
                        <div key={index} className="border-l-4 border-brand pl-6 py-4 hover:bg-gray-50 transition">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                                <span className="text-brand font-bold text-lg">Rs. {service.price}</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{service.duration}</p>
                            <p className="text-gray-600">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-herbal-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Session Flow</h2>
                    <p className="text-xs text-gray-500 mb-4">What a standard visit looks like.</p>
                    <div className="space-y-4">
                        {[
                            { label: 'Check-in', detail: 'Vitals and comfort check' },
                            { label: 'Consult', detail: 'Therapy selection and plan' },
                            { label: 'Therapy', detail: 'Focused treatment session' },
                            { label: 'Aftercare', detail: 'Home care and guidance' },
                        ].map((step, index) => (
                            <div key={step.label} className="flex items-center gap-3">
                                <div className="relative flex items-center">
                                    <div className="h-2.5 w-2.5 rounded-full bg-herbal-600"></div>
                                    {index < 3 && (
                                        <div className="absolute left-1 top-3 h-6 w-[2px] bg-herbal-200"></div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{step.label}</p>
                                    <p className="text-xs text-gray-500">{step.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-herbal-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Preparation Tips</h2>
                    <p className="text-xs text-gray-500 mb-4">Small steps that improve results.</p>
                    <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>Arrive 10 minutes early to relax.</li>
                        <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>Choose light meals before therapy.</li>
                        <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>Avoid caffeine 2 hours prior.</li>
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-herbal-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Aftercare Notes</h2>
                    <p className="text-xs text-gray-500 mb-4">Simple do's for recovery.</p>
                    <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>Stay warm and hydrated.</li>
                        <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>Prefer light, warm food.</li>
                        <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>Rest for 30-60 minutes post-therapy.</li>
                    </ul>
                </div>
            </div>

            {/* Payment Modes */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Payment Modes</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {paymentModes.map((mode, index) => (
                        <div key={index} className="bg-herbal-50 px-6 py-3 rounded-lg border border-herbal-200">
                            <p className="text-gray-700 font-medium">{mode}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Special Discounts */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Special Discounts</h2>
                <p className="text-center text-gray-500 mb-6">Limited time offers for our valued guests</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {discounts.map((discount, index) => (
                        <div key={index} className="bg-gradient-to-br from-herbal-50 to-beige-50 p-6 rounded-lg text-center border border-herbal-200">
                            <p className="text-gray-700 font-semibold mb-2">{discount.type}</p>
                            <p className="text-xl font-bold text-brand">{discount.discount}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Closing Message */}
            <div className="bg-gradient-to-r from-brand to-brand-dark p-8 rounded-lg shadow-md text-center text-white">
                <h2 className="text-xl font-semibold mb-2">Calm spaces, mindful care.</h2>
                <p className="text-base">Experience the healing power of Ayurveda at Shree Sanjeevni</p>
            </div>
        </div>
    );
};

export default ServicesPage;
