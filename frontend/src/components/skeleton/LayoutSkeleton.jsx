const LayoutSkeleton = () => {
    return (
        <div className="flex h-screen w-full rounded-lg overflow-hidden animate-pulse">

            <div className="flex h-full w-1/5">
                <div className="w-full bg-black p-4 space-y-3 mt-28">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-12 rounded-md bg-slate-700"
                        />
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-black flex flex-col my-10">
                <div className="flex justify-between bg-slate-200 px-4 py-4 mb-2 rounded-tr-lg">
                    <div className="h-4 w-40 bg-slate-500 rounded" />
                </div>

                <div className="mt-auto h-12 bg-slate-800 pl-16 pr-4 flex items-center">
                    <div className="h-8 w-full bg-slate-700 rounded" />
                </div>
            </div>
        </div>
    );
};

export default LayoutSkeleton;
