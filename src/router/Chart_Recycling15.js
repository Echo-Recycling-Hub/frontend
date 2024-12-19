import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const RecycleChart15 = ({ data }) => {
    useEffect(() => {
        const filteredData = data.filter(item => item.CATEGORY3 === '소계' && item.CATEGORY2.includes('재활용'));
        const chart = new Chart(document.getElementById('recycleChart15'), {
            type: 'line',
            data: {
                labels: filteredData.map(item => item.YEAR),
                datasets: [{
                    label: '연도별 전국 재활용 처리 현황(2015~2019)',
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
                        text: '연도별 전국 재활용 처리 현황(2015~2019)',
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

    return <canvas id="recycleChart15" width="500" height="500"></canvas>;
};

export default RecycleChart15;
