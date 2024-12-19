import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const EmissionsChart15 = ({ data }) => {
    useEffect(() => {
        const filteredData = data.filter(item => item.CATEGORY2 === '총계');
        const chart = new Chart(document.getElementById('emissionsChart15'), {
            type: 'line',
            data: {
                labels: filteredData.map(item => item.YEAR),
                datasets: [{
                    label: '연도별 전국 쓰레기 배출량(2015~2019)',
                    data: filteredData.map(item => item.AMOUNT),
                    fill: false,
                    borderColor: '#49C6E5',
                    tension: 0.1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: '연도별 전국 쓰레기 배출량(2015~2019)',
                        font: { size: 20 }
                    },
                    legend: { position: 'bottom' }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });

        return () => chart.destroy();
    }, [data]);

    return <canvas id="emissionsChart15" width="500" height="500"></canvas>;
};

export default EmissionsChart15;
