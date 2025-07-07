import React, { useState, useEffect } from "react";

export default function MonthMedian() {
    const [allDates, setAllDates] = useState([]);
    const [logsByDate, setLogsByDate] = useState({});
    const [selectedMonth, setSelectedMonth] = useState("");

    useEffect(() => {
        const keys = Object.keys(localStorage).filter(key => key.startsWith("logs-"));
        const dates = keys.map(key => key.replace("logs-", ""));
        const data = {};
        dates.forEach(date => {
            const saved = localStorage.getItem(`logs-${date}`);
            if (saved) {
                data[date] = JSON.parse(saved);
            }
        });
        setAllDates(dates);
        if (dates.length > 0) {
            const today = new Date();
            const monthStr = today.toISOString().slice(0, 7);
            setSelectedMonth(monthStr);
        }
        setLogsByDate(data);
    }, []);

    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const millis = ms % 1000;
        return `${mins}:${secs.toString().padStart(2, "0")}.${millis}`;
    };

    const getMedian = (values) => {
        if (!values || values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    const allLogsForMonth = allDates
        .filter(date => date.startsWith(selectedMonth))
        .flatMap(date => logsByDate[date] || []);

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-md space-y-6">
            <h1 className="text-2xl font-bold">Monthly Median Viewer</h1>
            {allDates.length === 0 && <p>No logs saved yet.</p>}
            {allDates.length > 0 && (
                <div className="mb-4">
                    <label className="mr-2 font-semibold">Select Month:</label>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border p-2 rounded-xl"
                    />
                </div>
            )}
            {allLogsForMonth.length > 0 ? (
                <div className="border p-4 rounded-xl">
                    <h2 className="text-xl font-semibold">Median for {selectedMonth}</h2>
                    <p className="mt-2 font-mono">{formatTime(getMedian(allLogsForMonth))}</p>
                </div>
            ) : (
                selectedMonth && <p>No logs for selected month.</p>
            )}
        </div>
    );
}
