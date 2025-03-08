"use client"

import React from 'react';
import { Form, Input, Button, Tabs, Card, Switch } from 'antd';
import { UserOutlined, LockOutlined, SettingOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const Page = () => {
    const onFinish = (values) => {
        console.log('Settings Updated:', values);
    };

    return (
        <div className=" p-8">
            <h1 className="text-3xl font-semibold mb-6">Parirenyatwa Hospital - Settings</h1>
            <p className="text-lg text-gray-600 mb-6">Located in Harare, Zimbabwe</p>
            <Tabs defaultActiveKey="1" type="card">
                {/* General Settings Tab */}
                <TabPane
                animated={true}
                    tab={<span><SettingOutlined /> General Settings</span>}
                    key="1"
                >
                    <Card title="General Settings" className="mb-6">
                        <Form
                            name="general-settings"
                            onFinish={onFinish}
                            layout="vertical"
                            initialValues={{
                                hospitalName: 'Parirenyatwa Hospital',
                                contactNumber: '0242-123-456',
                            }}
                        >
                            <Form.Item
                                label="Hospital Name"
                                name="hospitalName"
                                rules={[{ required: true, message: 'Please input the hospital name!' }]}
                            >
                                <Input placeholder="Enter hospital name" />
                            </Form.Item>

                            <Form.Item
                                label="Contact Number"
                                name="contactNumber"
                                rules={[{ required: true, message: 'Please input the contact number!' }]}
                            >
                                <Input placeholder="Enter contact number" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full">
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                {/* User Management Tab */}
                <TabPane
                    tab={<span><UserOutlined /> User Management</span>}
                    key="2"
                >
                    <Card title="User Management" className="mb-6">
                        <Form
                            name="user-management"
                            onFinish={onFinish}
                            layout="vertical"
                        >
                            <Form.Item
                                label="Admin Username"
                                name="adminUsername"
                                rules={[{ required: true, message: 'Please input the admin username!' }]}
                            >
                                <Input placeholder="Enter admin username" />
                            </Form.Item>

                            <Form.Item
                                label="Change Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input a new password!' }]}
                            >
                                <Input.Password placeholder="Enter new password" />
                            </Form.Item>

                            <Form.Item
                                label="Enable Two-Factor Authentication"
                                name="twoFactor"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full">
                                    Update User Settings
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                {/* Notification Settings Tab */}
                <TabPane
                    tab={<span><SettingOutlined /> Notification Settings</span>}
                    key="3"
                >
                    <Card title="Notification Settings" className="mb-6">
                        <Form
                            name="notification-settings"
                            onFinish={onFinish}
                            layout="vertical"
                        >
                            <Form.Item
                                label="Email Notifications"
                                name="emailNotifications"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                label="SMS Notifications"
                                name="smsNotifications"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full">
                                    Save Notification Settings
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Page;
