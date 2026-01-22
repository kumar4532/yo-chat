const LayoutSkeleton = () => {
    return (
        <div className="flex h-[90vh] w-full rounded-lg overflow-hidden animate-pulse">

            {/* Sidebar skeleton */}
            <div className="w-1/4 bg-slate-800 p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-12 rounded-md bg-slate-700"
                    />
                ))}
            </div>

            {/* Message area skeleton */}
            <div className="flex-1 bg-slate-900 flex flex-col">

                {/* Header */}
                <div className="h-12 bg-slate-800 px-4 flex items-center">
                    <div className="h-4 w-40 bg-slate-700 rounded" />
                </div>


                {/* Input */}
                <div className="mt-auto h-12 bg-slate-800 px-4 flex items-center">
                    <div className="h-8 w-full bg-slate-700 rounded" />
                </div>
            </div>
        </div>
    );
};

export default LayoutSkeleton;
