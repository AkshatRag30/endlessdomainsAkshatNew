// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
// } from "recharts";
// import React, { useMemo } from "react";

// export default function PortfolioLineChart({ filteredData }: { filteredData: any[] }) {
//     const portfolioData = useMemo(() => {
//         return filteredData.reduce((acc: any[], item) => {
//             if (item.orderStatus !== "Completed" || !item.domainProvider) return acc;

//             const existing = acc.find(a => a.name === item.domainProvider);
//             if (existing) {
//                 existing.totalPrice += item.price || 0;
//             } else {
//                 acc.push({
//                     name: item.domainProvider,
//                     totalPrice: item.price || 0,
//                 });
//             }
//             return acc;
//         }, []);
//     }, [filteredData]);

//     const colors: Record<string, string> = {
//         UD: "#1E90FF",
//         ENS: "#32CD32",
//         Arbitrum: "#FF8C00",
//         BinanceSmartChain: "#FFD700",
//     };

//     return (
//         <ResponsiveContainer width="80%" height={250}>
//             <LineChart
//                 data={portfolioData}
//                 margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
//             >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 <XAxis
//                     dataKey="name"
//                     tick={{ fontSize: 12 }}
//                     axisLine={false}
//                     tickLine={false}
//                 />
//                 <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
//                 <Tooltip
//                     contentStyle={{
//                         backgroundColor: "#fff",
//                         border: "1px solid #ddd",
//                         borderRadius: "8px",
//                     }}
//                 />
//                 <Line
//                     type="monotone"
//                     dataKey="totalPrice"
//                     stroke="#1E90FF"
//                     strokeWidth={3}
//                     dot={({ cx, cy, payload }) => (
//                         <circle
//                             cx={cx}
//                             cy={cy}
//                             r={6}
//                             fill={colors[payload.name] || "#8884d8"}
//                             stroke="#fff"
//                             strokeWidth={2}
//                         />
//                     )}
//                     activeDot={{ r: 8 }}
//                 />
//             </LineChart>
//         </ResponsiveContainer>
//     );
// }


import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import React, { useMemo, useState } from "react";

export default function PortfolioLineChart({ filteredData, selectedChart }: { filteredData: any[]; selectedChart: string }) {
    const [activePoint, setActivePoint] = useState<any>(null);

    const portfolioData = useMemo(() => {
        return filteredData.reduce((acc: any[], item) => {
            if (!item.domainProvider || item.orderStatus?.toLowerCase() !== "completed") return acc;

            const existing = acc.find(a => a.name === item.domainProvider);
            const detail = {
                domainName: item.domainName || "Unknown",
                lastChangedDateTime: item.lastChangedDateTime,
                date: new Date(item.lastChangedDateTime).toLocaleDateString(),
                orderStatus: item.orderStatus,
                price: item.price || 0,
            };

            if (existing) {
                existing.totalPrice += item.price || 0;
                existing.count += 1;
                existing.details.push(detail);
            } else {
                acc.push({
                    name: item.domainProvider,
                    totalPrice: item.price || 0,
                    count: 1,
                    details: [detail],
                });
            }
            return acc;
        }, []);
    }, [filteredData]);

    const colors: Record<string, string> = {
        UD: "#1E90FF",
        ENS: "#32CD32",
        Arbitrum: "#FF8C00",
        BinanceSmartChain: "#FFD700",
    };
    console.log(portfolioData, 'portfolioData')
    return (
        <div style={{ position: "relative" }}>
            <ResponsiveContainer width="80%" height={250}
                children={
                    <LineChart
                        data={portfolioData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                        onClick={(state: any) => {
                            if (state && state.activePayload) {
                                setActivePoint(state.activePayload[0].payload);
                            }
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />

                        <Line
                            type="linear"
                            dataKey="totalPrice"
                            stroke="#1E90FF"
                            strokeWidth={2}
                            dot={(props) => {
                                const { cx, cy, payload } = props;
                                if (!payload || cx == null || cy == null) return null;
                                return (
                                    <g>
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={8}
                                            fill="transparent"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActivePoint(payload);
                                            }}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={5}
                                            fill={colors[payload.name] || "#8884d8"}
                                            stroke="#fff"
                                            strokeWidth={2}
                                        />
                                    </g>
                                );
                            }}
                        />
                    </LineChart>
                }

            />

            {activePoint && selectedChart === "portfolio" && (
                <div
                    className="custom-tool-tip"
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "#fff",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                        borderRadius: 8,
                        padding: "16px",
                        width: 280,
                        zIndex: 10,
                    }}
                >
                    <button
                        onClick={() => setActivePoint(null)}
                        className="custom-button"
                    >
                        ×
                    </button>

                    <p>
                        <strong>{activePoint.name}</strong>
                    </p>
                    <p>Total Domains: {activePoint.count}</p>
                    <p>Total Value: ${activePoint.totalPrice}</p>
                    <hr />
                    <div style={{ maxHeight: 150, overflowY: "auto", paddingRight: 8 }}>
                        {activePoint.details.map((d: any, i: number) => (
                            <div
                                key={i}
                                style={{
                                    fontSize: 13,
                                    padding: "6px 0",
                                    borderBottom:
                                        i < activePoint.details.length - 1 ? "1px solid #f5f5f5" : "none",
                                }}
                            >
                                • {d.domainName} | ${d.price} |{" "}
                                {new Date(d.lastChangedDateTime).toLocaleDateString()} |{" "}
                                {d.orderStatus}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
