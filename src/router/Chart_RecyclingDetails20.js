import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const RecycleDetailsChart20 = ({ data }) => {
    const [currentYear, setCurrentYear] = useState(2020);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        const years = [2020, 2021, 2022];
        let index = 0;

        const interval = setInterval(() => {
            setCurrentYear(years[index]);
            index++;
            if (index === years.length) {
                index = 0;
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!data.length) return;

        const filteredData = data.filter(item => item.YEAR === currentYear);
        const groupedData = {
            '천류': ['섬유', '의류'],
            '소형가전류': ['전기전자'],
            '플라스틱류': ['수지', '플라스틱'],
            '금속류': ['캔', '고철'],
            '유리류': ['유리'],
            '종이류': ['종이', '폐지']
        };

        const categoryData = {};
        Object.keys(groupedData).forEach(key => {
            categoryData[key] = 0;
        });

        filteredData.forEach(item => {
            Object.entries(groupedData).forEach(([category, subcategories]) => {
                if (subcategories.some(subcategory => item.CATEGORY3.includes(subcategory))) {
                    categoryData[category] += parseFloat(item.AMOUNT);
                }
            });
        });

        if (chartInstance) chartInstance.destroy();

        const newChart = new Chart(document.getElementById('detailsChart20'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    label: `${currentYear}년 품목별 재활용 처리 현황`,
                    data: Object.values(categoryData),
                    backgroundColor: [
                        '#49C6E5', '#82D4F2', '#0088A8', '#BF40BF', '#7A67EE', '#00FFFF', '#E0FFFF', '#008B8B'
                    ],
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `${currentYear}년 품목별 재활용 처리 현황`,
                        font: { size: 20 }
                    },
                    legend: { position: 'bottom' }
                }
            }
        });

        setChartInstance(newChart);
    }, [data, currentYear]);

    return <canvas id="detailsChart20" width="500" height="500"></canvas>;
};

export default RecycleDetailsChart20;
