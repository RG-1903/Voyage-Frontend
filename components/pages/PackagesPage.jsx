import React, { useState } from 'react';
import { cn } from '../../utils/helpers';
import PackageCard from '../ui/PackageCard';

const PackagesPage = ({ packages, onViewDetails }) => {
    const [activeFilter, setActiveFilter] = useState("All");
    const filters = ["All", "Adventure", "Relaxation", "Cultural"];

    const filteredPackages = packages.filter(p => activeFilter === 'All' || p.type === activeFilter);

    return (
        <div className="bg-slate-50 pt-32 pb-24 min-h-screen">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-extrabold text-center mb-6 text-slate-800">Explore Our Packages</h1>
                <p className="text-xl text-slate-600 text-center mb-16 max-w-3xl mx-auto">Find the perfect adventure that speaks to your soul. We have something for everyone.</p>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={cn(
                                "px-6 py-2 font-semibold rounded-full transition-colors duration-300",
                                activeFilter === filter ? "bg-teal-600 text-white shadow-md" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                            )}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredPackages.map((pkg, index) => (
                        <PackageCard key={pkg._id} pkg={pkg} index={index} onViewDetails={onViewDetails} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PackagesPage;