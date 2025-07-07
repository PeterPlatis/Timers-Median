import React, { useState, useEffect } from "react";

export default function LogsViewer() {
    const [allDates, setAllDates] = useState([]);
    const [logsByDate, setLogsByDate] = useState({});
    const [selectedDate, setSelectedDate] = useState("");

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
            setSelectedDate(dates[0]);
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

    const getMedian = (logs) => {
        if (!logs || logs.length === 0) return 0;
        const sorted = [...logs].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-md space-y-6">
            <h1 className="text-2xl font-bold">Logs Calendar Viewer</h1>
            {allDates.length === 0 && <p>No logs saved yet.</p>}
            {allDates.length > 0 && (
                <div className="mb-4">
                    <label className="mr-2 font-semibold">Select Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border p-2 rounded-xl"
                    />
                </div>
            )}
            {selectedDate && logsByDate[selectedDate] ? (
                <div className="border p-4 rounded-xl">
                    <h2 className="text-xl font-semibold">Logs for {selectedDate}</h2>
                    <ul className="list-disc list-inside">
                        {logsByDate[selectedDate].map((log, index) => (
                            <li key={index}>{formatTime(log)}</li>
                        ))}
                    </ul>
                    <p className="mt-2 font-mono">Median: {formatTime(getMedian(logsByDate[selectedDate]))}</p>
                </div>
            ) : (
                selectedDate && <p>No logs for selected date.</p>
            )}
        </div>
    );
}
