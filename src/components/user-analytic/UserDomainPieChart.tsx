
'use client';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { fetchUserDomainPieChart } from '@/core/services/affiliate.service';
import { AiOutlineInfoCircle } from 'react-icons/ai'
import styles from 'styles/Carts.module.scss'
import { Tooltip } from 'reactstrap'
interface DomainData {
    id: string;
    lastChangedDateTime: string;
    orderNumber: string;
    orderStatus: string;
    promoValue: number | null;
    promoApplied: boolean;
    domainName: string;
    domainProvider: string;
    mintStatus: string;
    price?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1', '#FF6F91'];

const UserDomainPieChart = () => {
    const [data, setData] = useState<DomainData[]>([]);
    const [filteredData, setFilteredData] = useState<DomainData[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orderStatus, setOrderStatus] = useState('All');
    const [activeSlice, setActiveSlice] = useState<any>(null);
    const [selectedChart, setSelectedChart] = useState<'provider' | 'portfolio'>('provider');
    const [activeBar, setActiveBar] = useState<any>(null);
    const [monthsFilter, setMonthsFilter] = useState<'3m' | '6m' | '12m' | ''>('');
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const toggle = () => setTooltipOpen(!tooltipOpen)

    useEffect(() => {
        setActiveSlice(null);
        setActiveBar(null);
        const fetchData = async () => {
            try {
                const response = await fetchUserDomainPieChart({ startDate, endDate, orderStatus, monthsFilter: monthsFilter || undefined });

                if (response.success === false || !response.result) {
                    console.error('API failed:', response.message);
                    setData([]);
                    setFilteredData([]);
                    setActiveSlice(null);
                    return;
                }

                const result = Array.isArray(response.result) ? response.result : [];
                setData(result);
                setFilteredData(result);
            } catch (error) {
                console.error('Error fetching domain data:', error);
                setData([]);
                setFilteredData([]);
            }
        };

        fetchData();
    }, [startDate, endDate, orderStatus, monthsFilter]);


    const buildProviderData = () => {
        let dataToUse = [];

        if (selectedChart === "portfolio") {
            // Show only completed orders in Portfolio chart
            dataToUse = filteredData.filter(item => item.orderStatus === "Completed");
        } else {
            // Apply normal filtering logic based on selected order status
            const status = orderStatus;
            dataToUse = status === "All"
                ? filteredData
                : filteredData.filter(item => item.orderStatus === status);
        }

        const chartData = dataToUse.reduce((acc: any[], item) => {
            if (!item.domainProvider) return acc;

            const existing = acc.find(a => a.name === item.domainProvider);
            const detail = {
                domainName: item.domainName || "Unknown",
                lastChangedDateTime: item.lastChangedDateTime,
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

        const totalDomains = dataToUse.length;
        chartData.forEach(entry => {
            entry.pct = totalDomains > 0 ? (entry.count / totalDomains) * 100 : 0;
        });

        return chartData;
    };


    const buildPortfolioData = () => {
        const completedData = filteredData.filter(item => item.orderStatus === "Completed");
        const portfolioData = completedData.reduce((acc: any[], item) => {
            if (!item.domainProvider) return acc;
            const existing = acc.find(a => a.name === item.domainProvider);
            if (existing) {
                existing.totalPrice += item.price || 0;
            } else {
                acc.push({ name: item.domainProvider, totalPrice: item.price || 0 });
            }

            return acc;
        }, []);

        return portfolioData;
    };

    const providerData = buildProviderData();
    const portfolioData = buildPortfolioData();

    const renderCustomizedLabel = (props: any) => {
        const { cx, cy, midAngle, outerRadius, name, count, pct } = props;
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 40;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        if (pct < 5) return null;
        return (
            <g>
                <text x={x} y={y} fill="#333" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
                    {`Provider: ${name}`}
                </text>
                <text x={x} y={y + 16} fill="#666" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>
                    {`Domains: ${count}`}
                </text>
            </g>
        );
    };

    const CustomXAxisTick = ({ x, y, payload }: any) => {
        const item = providerData.find((d: any) => d.name === payload.value);
        if (!item?.details?.length) {
            return <text />;
        }

        const dates = item.details.map((d: any) => new Date(d.lastChangedDateTime).getTime());
        const minDate = new Date(Math.min(...dates)).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
        });
        const maxDate = new Date(Math.max(...dates)).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
        });

        return (
            <g transform={`translate(${x},${y + 10})`}>
                <text textAnchor="middle" fill="#444" fontSize={12} dy={0}>
                    {payload.value}
                </text>
                <text textAnchor="middle" fill="#777" fontSize={11} dy={14}>
                    {`${minDate} - ${maxDate}`}
                </text>
            </g>
        );
    };

    return (
        <div style={{ width: '100%', height: 500, position: 'relative' }}>
            <div className="chart-tabs d-flex gap-2" style={{ marginBottom: 15 }}>
                <button
                    onClick={() => { setSelectedChart('provider'); setActiveSlice(null); setActiveBar(null); setOrderStatus('All'); }}
                    className={`mb-0 btn btn-secondary text-nowrap ${selectedChart === 'provider' ? 'active' : ''}`}
                >
                    Provider Distribution
                </button>
                <button
                    onClick={() => { setSelectedChart('portfolio'); setActiveSlice(null); setOrderStatus('Completed'); setActiveBar(null); }}
                    className={`mb-0 btn btn-secondary text-nowrap ${selectedChart === 'portfolio' ? 'active' : ''}`}
                >
                    Portfolio Value
                </button>
                <button id="Tooltip3" className='info-chart'>
                    <AiOutlineInfoCircle size={20} color="#524E4E" className={`${styles.cart_item_icon} `} />
                </button>
                <Tooltip isOpen={tooltipOpen} target="Tooltip3" toggle={toggle}>
                    Shows a breakdown of domains purchased and their distribution across your portfolio.
                </Tooltip>
            </div>

            {selectedChart !== 'portfolio' && <div className="filter-button-ui-new new-color" style={{ marginBottom: 15 }}>
                <div className="fbu-group">
                    <label>Start Date: </label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="fbu-group">
                    <label>End Date: </label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className="fbu-group">
                    <label>Order Status: </label>
                    <select value={orderStatus} onChange={e => { setOrderStatus(e.target.value); setActiveBar(null), setActiveSlice(null) }}>
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="fbu-group">
                    <label>Months Filter: </label>
                    <select value={monthsFilter} onChange={e => { setMonthsFilter(e.target.value as '3m' | '6m' | '12m' | ''); setActiveBar(null) }}>
                        <option value="">None</option>
                        <option value="3m">Last 3 Months</option>
                        <option value="6m">Last 6 Months</option>
                        <option value="12m">Last 12 Months</option>
                    </select>
                </div>
                <div className="fbu-group">
                    <label>&nbsp; </label>
                    <button
                        onClick={() => {
                            setStartDate('');
                            setEndDate('');
                            setOrderStatus('All');
                            setActiveSlice(null);
                            setFilteredData(data);
                            setActiveBar(null)
                        }}

                    >
                        Reset
                    </button>
                </div>
            </div>
            }
            {filteredData.length > 0 ? (
                <>
                    {selectedChart === 'portfolio' ? (
                        <div className='bar-chart pos-rel'>
                            <ResponsiveContainer width="100%" height={400}
                                children={
                                    <BarChart
                                        data={portfolioData}
                                        barCategoryGap="40%"
                                        barGap={10}
                                        margin={{ top: 30, right: 30, left: 10, bottom: 30 }}
                                    >

                                        <XAxis
                                            dataKey="name"
                                            interval={0}
                                            tickMargin={25}
                                            height={60}
                                            tick={<CustomXAxisTick />}
                                        />

                                        <YAxis
                                            tickFormatter={(value) => (value === 0 ? "0" : `$ ${value}`)}
                                            tick={{ fontSize: 12, fill: "#555" }}
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <Bar
                                            dataKey="totalPrice"
                                            radius={[6, 6, 0, 0]}
                                            barSize={40}
                                            onClick={(barData) => {
                                                const item = providerData.find((d) => d.name === barData.name);
                                                if (item) setActiveBar(item);
                                            }}
                                        >
                                            {portfolioData.map((entry, index) => {
                                                let color = "#8884d8";
                                                switch (entry.name) {
                                                    case "UD":
                                                        color = "#1E90FF"; // Blue
                                                        break;
                                                    case "ENS":
                                                        color = "#32CD32"; // Green
                                                        break;
                                                    case "Arbitrum":
                                                        color = "#FF8C00"; // Orange
                                                        break;
                                                    case "BinanceSmartChain":
                                                        color = "#FFD700"; // Gold
                                                        break;
                                                    default:
                                                        color = COLORS[index % COLORS.length];
                                                }
                                                return <Cell key={`cell-${index}`} fill={color} />;
                                            })}
                                        </Bar>
                                    </BarChart>
                                }
                            />
                            <div className='cust-tool'>
                                {
                                    activeBar && selectedChart === 'portfolio' && (
                                        <div className="custom-tool-tip">
                                            <button

                                                className='custom-button'
                                                onClick={() => setActiveBar(null)}

                                            >
                                                ×
                                            </button>

                                            <p><strong>{activeBar.name}</strong></p>
                                            <p>Total Domains: {activeBar.count}</p>
                                            <p>Total Value: ${activeBar.totalPrice}</p>
                                            <hr />
                                            <div style={{ maxHeight: 150, overflowY: 'auto', paddingRight: 8 }}>
                                                {activeBar.details.map((d: any, i: number) => (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            fontSize: 13,
                                                            padding: '6px 0',
                                                            borderBottom:
                                                                i < activeBar.details.length - 1 ? '1px solid #f5f5f5' : 'none'
                                                        }}
                                                    >
                                                        • {d.domainName} | ${d.price} |{' '}
                                                        {new Date(d.lastChangedDateTime).toLocaleDateString()}
                                                        {orderStatus === 'All' ? ` | ${d.orderStatus}` : ''}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                    ) : (
                        <div className="bar-chart pos-rel" style={{ width: "100%", height: 400 }}>
                            <ResponsiveContainer
                                children={
                                    <PieChart>
                                        <Pie
                                            data={providerData}
                                            dataKey="count"
                                            key="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            onClick={data => setActiveSlice(data)}
                                        >
                                            {providerData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                }
                            />
                            <div className='cust-tool'>
                                {
                                    activeSlice && selectedChart === 'provider' && (
                                        <div className="custom-tool-tip">
                                            <button className='custom-button' onClick={() => setActiveSlice(null)}>×</button>
                                            <p><strong>{activeSlice.name}</strong></p>
                                            <p>Total Domains: {activeSlice.count}</p>
                                            <p>Total Value: ${activeSlice.totalPrice}</p>
                                            <hr />
                                            <div style={{ maxHeight: 150, overflowY: 'auto', paddingRight: 8 }}>
                                                {activeSlice.details.map((d: any, i: number) => (
                                                    <div key={i} style={{ fontSize: 13, padding: '6px 0', borderBottom: i < activeSlice.details.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                                                        • {d.domainName} | ${d.price} | {new Date(d.lastChangedDateTime).toLocaleDateString()}
                                                        {orderStatus === 'All' ? ` | ${d.orderStatus}` : ''}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )}


                </>
            ) : (
                <div style={{ textAlign: 'center', paddingTop: 80 }}>No data available for selected filters</div>
            )}
        </div >
    );


};

export default UserDomainPieChart;
