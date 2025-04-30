"use client";
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Tabs, Table, Descriptions } from 'antd';
import { UserOutlined, TeamOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';

const { TabPane } = Tabs;

// Dummy data for statistics
const statisticsData = [
    { title: 'Total Patients', value: 6, icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} /> },
    { title: 'Total Doctors', value: 5, icon: <TeamOutlined style={{ fontSize: '24px', color: '#52c41a' }} /> },
    { title: 'Total Reports', value: 2, icon: <FileTextOutlined style={{ fontSize: '24px', color: '#faad14' }} /> },
    { title: 'Pending Tasks', value: 3, icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#eb2f96' }} /> },
];

// Dummy data for recent reports
const recentReportsData = {
    Radiology: [
        {
            key: '1',
            patient: 'John Doe',
            report: 'Chest X-Ray',
            date: '2024-04-20',
            status: 'Completed',
        },
        {
            key: '2',
            patient: 'Jane Smith',
            report: 'MRI Scan',
            date: '2024-04-18',
            status: 'Pending',
        },
    ],
    Cardiology: [
        {
            key: '1',
            patient: 'Alice Johnson',
            report: 'ECG',
            date: '2024-04-19',
            status: 'Completed',
        },
        {
            key: '2',
            patient: 'Bob Brown',
            report: 'Echocardiogram',
            date: '2024-04-17',
            status: 'Pending',
        },
    ],
};

// Columns for the reports table
const columns = [
    {
        title: 'Patient Name',
        dataIndex: 'patient',
        key: 'patient',
    },
    {
        title: 'Report',
        dataIndex: 'report',
        key: 'report',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text) => (
            <span style={{ color: text === 'Completed' ? '#52c41a' : '#faad14' }}>
                {text}
            </span>
        ),
    },
];

const BASE_URL = "http://localhost:8080";

const Dashboard = () => {
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const fetchHospital = async () => {
        const token = Cookies.get("token");
        const hospitalData = await fetch(`${BASE_URL}/hospital/get-by-admin`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(res => res.json());
        setHospital(hospitalData);
    };

    useEffect(() => {
        fetchHospital();

        // Check localStorage for the user's theme preference
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            setIsDarkMode(true);
        }
    }, []);

    // Function to toggle the theme
    const toggleTheme = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">{hospital?.name} Hospital Admin Dashboard</h1>

            {/* Statistics Section */}
            {/* <Row gutter={16} className="mb-6">
                {statisticsData.map((stat) => (
                    <Col xs={24} sm={12} md={6} key={stat.title}>
                        <Card>
                            <Statistic
                                title={stat.title}
                                value={stat.value}
                                prefix={stat.icon}
                            />
                        </Card>
                    </Col>
                ))}
            </Row> */}

            {/* Hospital Details Section */}
            <Card className="mb-6">
                <Descriptions title="Hospital Details" bordered column={1}>
                    <Descriptions.Item label="Name">{hospital?.name}</Descriptions.Item>
                    <Descriptions.Item label="Location">{hospital?.address}</Descriptions.Item>
                    <Descriptions.Item label="Departments">Radiology, Cardiology, Neurology, Orthopedics</Descriptions.Item>
                    <Descriptions.Item label="Contact">
                        Phone: {hospital?.phoneNumber} <br />
                        Email: {hospital?.website}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Recent Reports Tabs */}
            {/* <Card>
                <Tabs defaultActiveKey="Radiology">
                    {Object.keys(recentReportsData).map((department) => (
                        <TabPane tab={department} key={department}>
                            <Table
                                columns={columns}
                                dataSource={recentReportsData[department]}
                                pagination={false}
                            />
                        </TabPane>
                    ))}
                </Tabs>
            </Card> */}
        </div>
    );
};

export default Dashboard;
