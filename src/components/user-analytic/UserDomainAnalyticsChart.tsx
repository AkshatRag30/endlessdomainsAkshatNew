import React, { useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Tooltip } from "reactstrap";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import styles from 'styles/Carts.module.scss'
import { fetchUserDomainAnalytics } from '@/core/services/affiliate.service';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A66DD4", "#FF6B6B"];
interface DomainDetail {
    createdDateTime: string;
    domainName: string;
    domainProvider: string;
    ownerAddress: string;
    registryAddress: string;
    token_id: string;
    expiryDate: string;
}
interface PieData extends Record<string, any> {
    name: string;
    count: number;
    domains: DomainDetail[];
}

const UserDomainAnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [activeSlice, setActiveSlice] = useState<any>(null);
    const [selectedTLD, setSelectedTLD] = useState("All");
    const [selectedProvider, setSelectedProvider] = useState("All");
    const [expiryType, setExpiryType] = useState<"All" | "Expired" | "Non-Expired">("All");
    const [evmType, setEvmType] = useState<"All" | "EVM" | "Non-EVM">("All");
    const [renewalType, setRenewalType] = useState<'All' | 'Renewal' | 'Non-Renewal'>('All');
    const [listedDomains, setListedDomains] = useState<"All" | "Listed">("All");
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);

    // 🔹 Fetch data when filters change
    useEffect(() => {
        const fetchData = async () => {
            const filters: any = {};
            if (selectedTLD !== "All") filters.tlds = [selectedTLD];
            if (selectedProvider !== "All") filters.blockchains = [selectedProvider];
            if (expiryType !== "All") filters.expiredStatus = expiryType;
            if (evmType !== "All") filters.evmType = evmType;
            if (listedDomains) filters.listedDomains = listedDomains;
            if (renewalType !== 'All') filters.renewalType = renewalType;

            const response = await fetchUserDomainAnalytics(filters);
            if (response?.result) {
                setAnalytics(response.result);
            }
        };
        fetchData();
    }, [selectedTLD, selectedProvider, expiryType, evmType, listedDomains, renewalType]);

    if (!analytics) return <div>Loading...</div>;


    let displayedDomains = analytics.allDomains;

    if (evmType === "EVM") displayedDomains = analytics.evmDomains?.domains || [];
    else if (evmType === "Non-EVM") displayedDomains = analytics.nonEvmDomains?.domains || [];
    else if (renewalType === 'Renewal') displayedDomains = analytics.renewalStatus?.find((r: any) => r.type === 'Renewal')?.domains || [];
    else if (renewalType === 'Non-Renewal') displayedDomains = analytics.renewalStatus?.find((r: any) => r.type === 'Non-Renewal')?.domains || [];
    else if (listedDomains === "Listed") displayedDomains = analytics.listedDomains?.domains || [];

    const chartData: PieData[] = Object.values(
        displayedDomains.reduce((acc: any, domain: any) => {
            const category = domain.domainProvider;

            if (!acc[category]) {
                acc[category] = { name: category, count: 0, domains: [] as DomainDetail[] };
            }

            const existing = acc[category];
            existing.count += 1;
            existing.domains!.push(domain);

            return acc;
        }, {} as Record<string, PieData>)
    );

    const renderCustomizedLabel = (props: any) => {
        const { cx, cy, midAngle, outerRadius, name, count } = props;
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 40;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (count / displayedDomains.length < 0.05) return null;

        return (
            <g>
                <text
                    x={x}
                    y={y}
                    fill="#333"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight="bold"
                >
                    {name}
                </text>
                <text
                    x={x}
                    y={y + 16}
                    fill="#666"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    fontSize={11}
                >
                    {`Domains: ${count}`}
                </text>
            </g>
        );
    };

    return (
        <div style={{ width: "100%", height: 500 }}>
            <div className="filter-button-ui-new  graph-seprater" style={{ marginBottom: 15 }}>
                <button id="Tooltip3" className="info-chart">
                    <AiOutlineInfoCircle size={20} color="#524E4E" className={`${styles.cart_item_icon}`} />
                </button>
                <Tooltip isOpen={tooltipOpen} target="Tooltip3" toggle={toggle}>
                    View how your owned domains are distributed across providers and types using the selected filters.
                </Tooltip>

                {/* 🔹 Filter Controls */}
                <div className="fbu-group">
                    <label>TLD:</label>
                    <select value={selectedTLD} onChange={(e) => { setSelectedTLD(e.target.value); setActiveSlice(null) }}>
                        <option value="All">All</option>
                        {analytics.uniqueTLDs?.map((tld: string) => (
                            <option key={tld} value={tld}>
                                {tld}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="fbu-group">
                    <label>Provider:</label>
                    <select value={selectedProvider} onChange={(e) => { setSelectedProvider(e.target.value); setActiveSlice(null) }}>
                        <option value="All">All</option>
                        {analytics.uniqueProviders?.map((p: string) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="fbu-group">
                    <label>Expiry:</label>
                    <select value={expiryType} onChange={(e) => { setExpiryType(e.target.value as any); setActiveSlice(null) }}>
                        <option value="All">All</option>
                        <option value="Expired">Expired</option>
                        <option value="Non-Expired">Non-Expired</option>
                    </select>
                </div>
                <div className="fbu-group">
                    <label>Renewal Type: </label>
                    <select value={renewalType} onChange={e => { setRenewalType(e.target.value as any); setActiveSlice(null) }}>
                        <option value="All">All</option>
                        <option value="Renewal">Renewal</option>
                        <option value="Non-Renewal">Non-Renewal</option>
                    </select>
                </div>

                <div className="fbu-group">
                    <label>Domain Type:</label>
                    <select value={evmType} onChange={(e) => { setEvmType(e.target.value as any); setActiveSlice(null) }}>
                        <option value="All">All</option>
                        <option value="EVM">EVM</option>
                        <option value="Non-EVM">Non-EVM</option>
                    </select>
                </div>
                <div className="fbu-group">
                    <label>Domain Listing:</label>
                    <select value={listedDomains} onChange={(e) => { setListedDomains(e.target.value as any); setActiveSlice(null) }}>
                        <option value="All">All</option>
                        <option value="Listed">Listed</option>
                    </select>
                </div>


                <div className="fbu-group">
                    <label>&nbsp;</label>
                    <button
                        onClick={() => {
                            setSelectedTLD("All");
                            setSelectedProvider("All");
                            setExpiryType("All");
                            setEvmType("All");
                            setRenewalType('All');
                            setListedDomains("All");
                            setActiveSlice(null);

                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* 🔹 Chart */}
            {chartData.length > 0 ? (
                <>
                    <div className="graph-head">Total Domains: {displayedDomains.length}</div>
                    <div className="pie-chart thd" style={{ width: "100%", height: 350 }}>
                        <ResponsiveContainer
                            children={
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="count"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        onClick={(data) => setActiveSlice(data)}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            } />

                        {/* Custom Tooltip */}
                        <div className="cust-tool">
                            {activeSlice && (
                                <div className="custom-tool-tip">
                                    <button className="custom-button" onClick={() => setActiveSlice(null)}>
                                        ×
                                    </button>
                                    <p>
                                        <strong>{activeSlice.name}</strong>
                                    </p>
                                    <p>Total Domains: {activeSlice.count}</p>
                                    <hr />
                                    <div style={{ maxHeight: 150, overflowY: "auto", paddingRight: 8 }}>
                                        {activeSlice.domains.map((d: any, i: number) => (
                                            <div
                                                key={i}
                                                style={{
                                                    fontSize: 13,
                                                    padding: "6px 0",
                                                    borderBottom: i < activeSlice.domains.length - 1 ? "1px solid #f5f5f5" : "none",
                                                }}
                                            >
                                                • {d.domainName} | {d.domainProvider} |{" "}
                                                {new Date(d.createdDateTime).toLocaleDateString()}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ textAlign: "center", paddingTop: 80 }}>
                    No data available for selected filters
                </div>
            )}
        </div>
    );
};

export default UserDomainAnalyticsDashboard;
