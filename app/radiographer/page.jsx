"use client";
import { Card, Descriptions, Tag, Avatar, Row, Col, Statistic, List, Divider, Image } from 'antd';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

const Index = () => {
    const [profile, setProfile] = useState(null);
    const [recentActivity, setRecentActivity] = useState([
        { id: 1, activity: "Completed X-ray scan for Patient ID 1234" },
        { id: 2, activity: "Uploaded report for Patient ID 5678" },
        { id: 3, activity: "Reviewed MRI scan for Patient ID 4321" }
    ]);

    const fetchProfile = async () => {
        const token = Cookies.get("token");
        const data = await fetch(`http://localhost:8080/radiographer/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(res => res.json());
        setProfile(data);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className='p-6 min-h-screen'>
            {/* Welcome Header */}
            <div className="p-8 mb-8">
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>Welcome to your Dashboard</h1>
                <h2 className='text-xl font-semibold text-gray-600'>Hello, {profile?.firstname} {profile?.lastname}</h2>
                <p className="text-sm text-gray-500">DEPARTMENT: {profile?.department}</p>
            </div>

            {/* Profile and Statistics */}
            <Row gutter={[16, 16]} className=" bg-gray-50 p-6 drop-shadow-lg">
                {/* Profile Card */}
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <div className='rounded-xl'>
                        <div className='flex'>
                            <Image
                                width={400}
                                height={400}
                                src={`http://localhost:8080/${profile?.profileUrl}`}  
                                className='shadow-md border-2 object-cover border-white'
                            />
                        </div>
                      
                    </div>
                </Col>

                {/* Statistics */}
                <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                <Descriptions title="Profile Information" column={1} bordered>
                            <Descriptions.Item label="Firstname">
                                {profile?.firstname}
                            </Descriptions.Item>
                            <Descriptions.Item label="Lastname">
                                {profile?.lastname}
                            </Descriptions.Item>
                            <Descriptions.Item label="Gender">
                                <Tag color='blue'>{profile?.gender}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Date of Birth">
                                {profile?.dateOfBirth}
                            </Descriptions.Item>
                        </Descriptions>
                </Col>
            </Row>

            {/* Recent Activity */}
            {/* <Divider orientation="left" className='text-gray-800 font-semibold'>Recent Activity</Divider>
            <Card className='rounded-xl shadow-sm border border-gray-100'>
                <List
                    itemLayout="horizontal"
                    dataSource={recentActivity}
                    renderItem={item => (
                        <List.Item className='hover:bg-gray-50 transition-colors duration-200'>
                            <List.Item.Meta
                                title={<span className='text-gray-700'>{item.activity}</span>}
                            />
                        </List.Item>
                    )}
                />
            </Card> */}
        </div>
    );
};

export default Index;