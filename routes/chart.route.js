
// work in progress 20230118


import React, { useState, useEffect } from 'react';
import mysql from 'mysql2/promise';
import db from '../utils/db';

async function getNPSData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'my_user',
    password: 'my_password',
    database: 'my_database'
  });

  const [rows] = await db.query(`
    SELECT
      month,
      -- Calculate the NPS for the current month
      (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)
       FROM survey_responses s
       WHERE s.month = month AND rating BETWEEN 9 AND 10)
      -
      (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)
       FROM survey_responses s
       WHERE s.month = month AND rating BETWEEN 0 AND 6) AS nps,
      -- Calculate the rolling average NPS for the past 12 months
      AVG(
        (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)
         FROM survey_responses s
         WHERE s.month = month AND rating BETWEEN 9 AND 10)
        -
        (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)
         FROM survey_responses s
         WHERE s.month = month AND rating BETWEEN 0 AND 6)
      ) OVER (ORDER BY month ROWS BETWEEN 11 PRECEDING AND CURRENT ROW) AS rolling_average_nps,
      -- Calculate the percentage of Promoters for the current month
      (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)
       FROM survey_responses s
       WHERE s.month = month AND rating BETWEEN 9 AND 10) AS promoters,
      -- Calculate the percentage of Passives for the current month
      (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)
       FROM survey_responses s
       WHERE s.month = month AND rating BETWEEN 7 AND 8) AS passives,
      -- Calculate the percentage of Detractors for the current month
      (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)
       FROM survey_responses s
       WHERE s.month = month AND rating BETWEEN 0 AND 6) AS detractors
    FROM (
      -- Generate a list of months to use as the x-axis for the chart
      SELECT DISTINCT month FROM survey_responses ORDER BY month
    ) months
  `);

  connection.end();
  return rows;
}

function MyChart() {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      getNPSData().then(rows => {
        setData({
          labels: rows.map(row => row.month),
          datasets: [
            {
              label: 'Promoters',
              data: rows.map(row => row.promoters),
              backgroundColor: '#00FF00'
            },
            {
              label: 'Passives',
              data: rows.map(row => row.passives),
              backgroundColor: '#FFFF00'
            },
            {
              label: 'Detractors',
              data: rows.map(row => row.detractors),
              backgroundColor: '#FF0000'
            }
          ]
        });
      });
    }, []);
  
    return (
      <div>
        {data ? (
          <Bar
            data={data}
            options={{
              scales: {
                yAxes: [{
                  stacked: true
                }]
              }
            }}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }