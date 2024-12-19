import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // css import
import { useQuery } from 'react-query'; // react-query에서 useQuery 가져오기
import axios from 'axios'; // axios 가져오기
import moment from 'moment'; // moment 가져오기

function MyApp() {
    const [value, onChange] = useState(new Date());

    const [mark, setMark] = useState([]);

    const { data } = useQuery(
        ["logDate"],
        async () => {
            const result = await axios.get(
                `/api/healthLogs?health_log_type=DIET`
            );
            return result.data;
        },
        {
            onSuccess: (data: any) => {
                setMark(data);
                // ["2022-02-02", "2022-02-02", "2022-02-10"] 형태로 가져옴
            },
        }
    );

    return (
        <div>
            <Calendar
                onChange={onChange}
                formatDay={(locale, date) => moment(date).format("DD")}
                value={value}
                className="mx-auto w-full text-sm border-b"
                tileContent={({ date, view }) => {
                    if (mark.find((x) => x === moment(date).format("YYYY-MM-DD"))) {
                        return (
                            <>
                                <div className="flex justify-center items-center absoluteDiv">
                                    <div className="dot"></div>
                                </div>
                            </>
                        );
                    }
                }}
            />
        </div>
    );
}

export default MyApp;
