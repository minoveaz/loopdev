import React from 'react';
import { Button, Card, Badge } from '@blueprints/components/ui/DesignSystem';
import { BarChart3, Users, TrendingUp, Globe, MoreHorizontal, ArrowRight, Activity, Zap } from 'lucide-react';

export const ExamplesOne: React.FC = () => {
  return (
    <div className="p-6 md:p-12 pb-24 max-w-[1600px] mx-auto">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <Badge variant="energy">Live Demo</Badge>
               <span className="text-sm text-text-muted font-mono">v2.4.2</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-main dark:text-white mb-4">
              Marketing Analytics
            </h1>
            <p className="text-lg text-text-muted max-w-2xl">
              Real-time performance tracking of global campaigns. Generative insights powered by Loop System v2.
            </p>
          </div>
          <div className="flex gap-3">
             <Button variant="secondary" icon={<Globe size={16}/>}>Global View</Button>
             <Button icon={<BarChart3 size={16}/>}>Export Report</Button>
          </div>
       </div>
       
       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Revenue", value: "$124,592", trend: "+12.5%", icon: TrendingUp },
            { label: "Active Users", value: "45.2k", trend: "+3.2%", icon: Users },
            { label: "Bounce Rate", value: "24.8%", trend: "-0.8%", icon: Activity },
            { label: "Avg. Session", value: "4m 32s", trend: "+12s", icon: Zap }
          ].map((stat, i) => (
             <Card key={i} hoverEffect className="group">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <stat.icon size={20} />
                   </div>
                   <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {stat.trend}
                   </span>
                </div>
                <div className="text-3xl font-black text-text-main dark:text-white mb-1 tracking-tight">{stat.value}</div>
                <div className="text-xs text-text-muted uppercase font-bold tracking-wider">{stat.label}</div>
             </Card>
          ))}
       </div>

       {/* Main Chart Area */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 min-h-[450px] flex flex-col">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-lg font-bold text-text-main dark:text-white">Revenue Overview</h3>
                   <p className="text-sm text-text-muted">Monthly performance vs target</p>
                </div>
                <div className="flex gap-2">
                   <div className="flex items-center gap-2 text-xs font-medium text-text-muted mr-4">
                      <span className="w-2 h-2 rounded-full bg-primary"></span> Current
                      <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 ml-2"></span> Previous
                   </div>
                   <Button variant="ghost" size="sm" icon={<MoreHorizontal size={16}/>}>Options</Button>
                </div>
             </div>
             
             <div className="flex-1 w-full flex items-end justify-between gap-3 px-2 pb-2">
                {[45, 60, 75, 50, 80, 95, 85, 70, 65, 90, 100, 85].map((h, i) => (
                   <div key={i} className="w-full h-full flex items-end relative group cursor-pointer">
                      {/* Background Bar (Target/Previous) */}
                      <div className="absolute bottom-0 w-full bg-slate-100 dark:bg-slate-800/50 rounded-t-sm" style={{ height: `${h * 0.8}%` }}></div>
                      
                      {/* Foreground Bar (Current) */}
                      <div 
                        className="w-full bg-primary rounded-t-sm relative z-10 transition-all duration-500 group-hover:bg-primary-dark group-hover:shadow-[0_0_20px_rgba(19,91,236,0.3)]"
                        style={{ height: `${h}%` }}
                      >
                         {/* Tooltip */}
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                            ${h * 1.2}k
                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
             <div className="flex justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-mono font-bold text-text-muted px-2">
                <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                <span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
             </div>
          </Card>
          
          <div className="flex flex-col gap-6">
             <Card className="flex-1 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-6xl">donut_large</span>
                </div>
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-6">Traffic Sources</h3>
                <div className="space-y-6">
                   {[
                      { source: "Direct", value: 45, color: "bg-primary", width: "w-[45%]" },
                      { source: "Social", value: 32, color: "bg-energy", width: "w-[32%]" },
                      { source: "Referral", value: 18, color: "bg-blue-400", width: "w-[18%]" },
                      { source: "Organic", value: 5, color: "bg-slate-400", width: "w-[5%]" }
                   ].map((item, i) => (
                      <div key={i} className="group">
                         <div className="flex justify-between text-xs font-bold text-text-muted mb-2">
                            <span className="text-text-main dark:text-white group-hover:text-primary transition-colors">{item.source}</span>
                            <span>{item.value}%</span>
                         </div>
                         <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`${item.color} h-full rounded-full relative overflow-hidden`} style={{ width: `${item.value}%` }}>
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button className="w-full flex items-center justify-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors">
                        View Detailed Breakdown <ArrowRight size={16} />
                    </button>
                </div>
             </Card>
             
             <Card className="flex-1 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 text-white border-none shadow-xl shadow-blue-900/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-colors"></div>
                
                <div className="flex flex-col h-full justify-between relative z-10">
                   <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                            <span className="material-symbols-outlined fill-1">auto_awesome</span>
                        </div>
                        <Badge variant="energy">New Insight</Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Traffic Anomaly</h3>
                      <p className="text-sm text-blue-100 leading-relaxed font-medium">
                         Unusual spike detected in European region (EU-West). 
                         <span className="block mt-2 opacity-80 font-normal">Suggestion: Increase server capacity by 20% to maintain latency targets.</span>
                      </p>
                   </div>
                   <div className="flex gap-3 mt-6">
                    <button className="flex-1 py-2 rounded-lg bg-white text-primary font-bold text-xs shadow-lg hover:bg-slate-50 transition-colors">
                        Auto-Scale
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-black/20 text-white font-bold text-xs hover:bg-black/30 transition-colors backdrop-blur-md">
                        Dismiss
                    </button>
                   </div>
                </div>
             </Card>
          </div>
       </div>

       {/* Recent Activity Table */}
       <div className="grid grid-cols-1">
          <Card>
             <div className="flex items-center justify-between p-2 mb-4">
                <h3 className="text-lg font-bold text-text-main dark:text-white">Recent Transactions</h3>
                <div className="flex gap-2">
                    <input type="text" placeholder="Search..." className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary w-48" />
                    <Button variant="outline" size="sm">Filter</Button>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4 rounded-tl-lg">Transaction ID</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 rounded-tr-lg text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <tr key={item} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4 font-mono text-xs text-text-muted group-hover:text-primary transition-colors">#TRX-8823{item}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${item === 3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${item === 3 ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                                        {item === 3 ? 'Pending' : 'Completed'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-text-main dark:text-white">$245.00</td>
                                <td className="px-6 py-4 text-text-muted text-xs">Oct 24, 2023</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-text-muted hover:text-primary transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
             <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                <button className="text-xs font-bold text-primary hover:underline">View All Transactions</button>
             </div>
          </Card>
       </div>
    </div>
  );
};