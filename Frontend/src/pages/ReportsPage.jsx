import { useMemo } from 'react';
import { useCustomers } from '../context/CustomerContext';

const ReportsPage = () => {
    const { customers } = useCustomers();

    const analytics = useMemo(() => {
        if (!customers || customers.length === 0) {
            return {
                weeklyPatients: 0,
                growthPercent: 0,
                therapiesBooked: 0,
                topTherapy: 'General',
                totalRevenue: 0,
                weeklyFocus: [],
            };
        }

        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);

        const prevWeekStart = new Date(now);
        prevWeekStart.setDate(now.getDate() - 14);

        // Filter patients from this week
        const thisWeekPatients = customers.filter((c) => {
            const apptDate = new Date(c.appointmentDate);
            return apptDate >= weekStart && apptDate <= now;
        });

        // Filter patients from last week
        const lastWeekPatients = customers.filter((c) => {
            const apptDate = new Date(c.appointmentDate);
            return apptDate >= prevWeekStart && apptDate < weekStart;
        });

        // Calculate growth percentage
        const lastWeekCount = lastWeekPatients.length;
        const growth = lastWeekCount > 0
            ? Math.round(((thisWeekPatients.length - lastWeekCount) / lastWeekCount) * 100)
            : 0;

        // Aggregate therapy types from this week
        const therapyBreakdown = {};
        thisWeekPatients.forEach((c) => {
            const therapy = c.therapyType || 'General';
            therapyBreakdown[therapy] = (therapyBreakdown[therapy] || 0) + 1;
        });

        const therapyArray = Object.entries(therapyBreakdown)
            .map(([name, count]) => ({ label: name, count }))
            .sort((a, b) => b.count - a.count);

        // Normalize to percentages for chart
        const maxTherapy = Math.max(1, ...therapyArray.map((t) => t.count));
        const weeklyFocus = therapyArray.map((t) => ({
            label: t.label,
            value: Math.round((t.count / maxTherapy) * 100),
        }));

        // Calculate total revenue from this week
        const totalRevenue = thisWeekPatients.reduce((sum, c) => {
            const serviceCost = parseFloat(c.serviceCost) || 0;
            const discount = parseFloat(c.discount) || 0;
            return sum + (serviceCost - discount);
        }, 0);

        // Get top therapy
        const topTherapy = therapyArray[0]?.label || 'General';

        return {
            weeklyPatients: thisWeekPatients.length,
            growthPercent: growth,
            therapiesBooked: thisWeekPatients.length,
            topTherapy,
            totalRevenue,
            weeklyFocus,
        };
    }, [customers]);

    const routineTips = [
        'Warm water on waking improves digestion.',
        'Lunch should be the largest meal of the day.',
        'Short evening walk supports restful sleep.',
    ];

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden bg-gradient-to-r from-herbal-50 to-beige-50 p-6 rounded-lg shadow-md">
                <span className="pointer-events-none absolute -top-2 right-10 h-2 w-2 rounded-full bg-herbal-300/70"></span>
                <span className="pointer-events-none absolute top-10 right-24 h-1.5 w-1.5 rounded-full bg-amber-300/70"></span>
                <span className="pointer-events-none absolute bottom-6 left-12 h-2 w-2 rounded-full bg-herbal-200/70"></span>
                <h2 className="text-2xl font-semibold text-gray-800">Reports</h2>
                <p className="text-sm text-gray-500">Key insights and Ayurveda guidance for the team.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-herbal-100 rounded-lg p-5 shadow-soft">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Weekly Patients</p>
                    <p className="text-2xl font-semibold text-herbal-700 mt-2">{analytics.weeklyPatients}</p>
                    <p className={`text-xs mt-1 ${analytics.growthPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analytics.growthPercent >= 0 ? '+' : ''}{analytics.growthPercent}% from last week
                    </p>
                </div>
                <div className="bg-white border border-herbal-100 rounded-lg p-5 shadow-soft">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Therapies Booked</p>
                    <p className="text-2xl font-semibold text-herbal-700 mt-2">{analytics.therapiesBooked}</p>
                    <p className="text-xs text-gray-500 mt-1">Top: {analytics.topTherapy}</p>
                </div>
                <div className="bg-white border border-herbal-100 rounded-lg p-5 shadow-soft">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Total Revenue</p>
                    <p className="text-2xl font-semibold text-herbal-700 mt-2">₹{analytics.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">This week's income</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-herbal-100 rounded-lg p-6 shadow-soft">
                    <h3 className="text-sm font-bold text-herbal-800 uppercase tracking-widest">Weekly Focus</h3>
                    <p className="text-xs text-gray-500 mt-1">Most requested therapy themes.</p>
                    <div className="mt-5 space-y-3">
                        {analytics.weeklyFocus.slice(0, 4).map((item) => (
                            <div key={item.label} className="flex items-center gap-3">
                                <span className="w-28 text-xs text-gray-500">{item.label}</span>
                                <div className="flex-1 h-2 rounded-full bg-herbal-50 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-herbal-500 to-herbal-700"
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">{item.value}%</span>
                            </div>
                        ))}
                        {analytics.weeklyFocus.length === 0 && (
                            <p className="text-xs text-gray-400">No therapies booked this week.</p>
                        )}
                    </div>
                </div>
                <div className="bg-white border border-herbal-100 rounded-lg p-6 shadow-soft">
                    <h3 className="text-sm font-bold text-herbal-800 uppercase tracking-widest">Ayurveda Tips</h3>
                    <p className="text-xs text-gray-500 mt-1">Share with patients after visits.</p>
                    <ul className="mt-5 space-y-3 text-sm text-gray-700">
                        {routineTips.map((tip) => (
                            <li key={tip} className="flex items-start gap-2">
                                <span className="mt-1 h-2 w-2 rounded-full bg-herbal-500"></span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="bg-white border border-herbal-100 rounded-lg p-6 shadow-soft">
                <h3 className="text-sm font-bold text-herbal-800 uppercase tracking-widest">Care Flow</h3>
                <p className="text-xs text-gray-500 mt-1">A simple flow chart for staff alignment.</p>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Intake', detail: 'Vitals and notes' },
                        { label: 'Consult', detail: 'Dosha and goals' },
                        { label: 'Therapy', detail: 'Session delivery' },
                        { label: 'Follow-up', detail: 'Care plan' },
                    ].map((step) => (
                        <div key={step.label} className="rounded-lg border border-herbal-100 bg-herbal-50 px-4 py-3">
                            <p className="text-sm font-semibold text-gray-800">{step.label}</p>
                            <p className="text-xs text-gray-500 mt-1">{step.detail}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
