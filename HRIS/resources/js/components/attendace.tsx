import WorkClock from '@/components/clock'

export default function TodayAttendance({ data }: any) {
    const percentage = data.total > 0 ? Math.round((data.hadir / data.total) * 100) : 0;

    return (
        <div className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-lg hover:border-emerald-200 transform hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-between mb-8">
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 group-hover:text-emerald-700 transition-colors">
                    Absensi Hari Ini
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 group-hover:bg-white rounded-full animate-pulse"></span>
                    LIVE
                </span>
            </div>

            <div className="relative z-10 flex items-end justify-between mt-auto">
                <div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-extrabold text-gray-800 tracking-tight group-hover:scale-110 origin-bottom-left transition-transform duration-300">
                            {data.hadir}
                        </p>
                        <p className="text-sm font-semibold text-gray-400 group-hover:text-gray-500 transition-colors">
                            / {data.total} Hadir
                        </p>
                    </div>
                </div>
                
                <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-500 mb-0.5 group-hover:scale-110 origin-bottom-right transition-transform duration-300">{percentage}%</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold group-hover:text-emerald-600 transition-colors">Rasio</p>
                </div>
            </div>
            
            <div className="relative z-10 w-full bg-gray-100 h-2 rounded-full mt-6 overflow-hidden shadow-inner hidden lg:block">
                <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                    style={{ width: `${percentage}%` }} 
                />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center pointer-events-none" />
        </div>
    )
}
