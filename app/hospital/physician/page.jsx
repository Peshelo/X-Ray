"use client";
import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Space,
    Popconfirm,
    message,
    Statistic,
    Row,
    Col,
    Card,
    Tag,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    FileSearchOutlined,
    UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

const { Option } = Select;

const Physician = () => {
    const [physicians, setPhysicians] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentPhysician, setCurrentPhysician] = useState(null);
    const [form] = Form.useForm();

    // Statistics calculations
    const totalPhysicians = physicians.length;
    const malePhysicians = physicians.filter(p => p.gender === 'MALE').length;
    const femalePhysicians = physicians.filter(p => p.gender === 'FEMALE').length;
    const lockedAccounts = physicians.filter(p => p.accountLocked).length;
    const specialties = [...new Set(physicians.map(p => p.specialty))].length;

    // Fetch Physicians from Backend
    const fetchPhysicians = async () => {
        try {
            const token = Cookies.get("token");
            const response = await fetch("http://4.222.233.23:8080/physician", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch physicians');
            }

            const data = await response.json();
            setPhysicians(data);
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch physicians");
        }
    };

    useEffect(() => {
        fetchPhysicians();
    }, []);

    // Table columns definition
    const columns = [
        {
            title: 'Firstname',
            dataIndex: 'firstname',
            key: 'firstname',
            sorter: (a, b) => a.firstname.localeCompare(b.firstname),
        },
        {
            title: 'Lastname',
            dataIndex: 'lastname',
            key: 'lastname',
            sorter: (a, b) => a.lastname.localeCompare(b.lastname),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            filters: [
                { text: 'Male', value: 'MALE' },
                { text: 'Female', value: 'FEMALE' },
                { text: 'Other', value: 'OTHER' },
            ],
            onFilter: (value, record) => record.gender === value,
            render: gender => {
                let color = 'geekblue';
                if (gender === 'FEMALE') {
                    color = 'pink';
                } else if (gender === 'MALE') {
                    color = 'blue';
                } else {
                    color = 'purple';
                }
                return <Tag color={color}>{gender}</Tag>;
            },
        },
        {
            title: 'Specialty',
            dataIndex: 'specialty',
            key: 'specialty',
            filters: [...new Set(physicians.map(p => p.specialty))].map(spec => ({ text: spec, value: spec })),
            onFilter: (value, record) => record.specialty === value,
            sorter: (a, b) => a.specialty.localeCompare(b.specialty),
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (date) => dayjs(date).format('YYYY-MM-DD'),
            sorter: (a, b) => dayjs(a.dateOfBirth).unix() - dayjs(b.dateOfBirth).unix(),
        },
        {
            title: 'Account Status',
            dataIndex: 'accountLocked',
            key: 'accountLocked',
            render: (locked) => (locked ? <Tag color='red'>Locked</Tag> : <Tag color='green'>Active</Tag>),
            filters: [
                { text: 'Active', value: false },
                { text: 'Locked', value: true },
            ],
            onFilter: (value, record) => record.accountLocked === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this physician?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="danger" icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Modal handlers
    const showAddModal = () => {
        setIsEdit(false);
        setCurrentPhysician(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditModal = (record) => {
        setIsEdit(true);
        setCurrentPhysician(record);
        form.setFieldsValue({
            ...record,
            dateOfBirth: dayjs(record.dateOfBirth),
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentPhysician(null);
    };

    const handleDelete = async (id) => {
        try {
            const token = Cookies.get("token");
            const response = await fetch(`http://4.222.233.23:8080/physician/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete physician');
            }

            setPhysicians(physicians.filter(p => p.id !== id));
            message.success('Physician deleted successfully');
        } catch (error) {
            console.error(error);
            message.error("Failed to delete physician");
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            const token = Cookies.get("token");

            const formattedValues = {
                ...values,
                dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
            };

            if (isEdit) {
                const response = await fetch(`http://4.222.233.23:8080/physician/${currentPhysician.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formattedValues),
                });

                if (!response.ok) {
                    throw new Error('Failed to update physician');
                }

                const updatedPhysician = await response.json();
                setPhysicians(
                    physicians.map(p => p.id === updatedPhysician.id ? updatedPhysician : p)
                );
                message.success('Physician updated successfully');
            } else {
                const response = await fetch("http://4.222.233.23:8080/physician", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formattedValues),
                });

                if (!response.ok) {
                    throw new Error('Failed to add physician');
                }

                const newPhysician = await response.json();
                setPhysicians([...physicians, newPhysician]);
                message.success('Physician added successfully');
            }

            setIsModalVisible(false);
            setCurrentPhysician(null);
            form.resetFields();
        } catch (error) {
            console.error(error);
            message.error("Failed to submit form");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Physician Management</h1>

            {/* Physician Statistics */}
            <Row gutter={16} className="mb-6">
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Physicians"
                            value={totalPhysicians}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Male Physicians"
                            value={malePhysicians}
                            precision={0}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Female Physicians"
                            value={femalePhysicians}
                            precision={0}
                            valueStyle={{ color: '#eb2f96' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Locked Accounts"
                            value={lockedAccounts}
                            precision={0}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Action Buttons */}
            <Space className="mb-4">
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                    Add Physician
                </Button>
            </Space>

            {/* Physicians Table */}
            <Table
                columns={columns}
                dataSource={physicians}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                bordered
                scroll={{ x: 'max-content' }}
            />

            {/* Add/Edit Physician Modal */}
            <Modal
                title={isEdit ? "Edit Physician" : "Add Physician"}
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okText="Submit"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    initialValues={{
                        gender: 'MALE',
                        accountLocked: false,
                    }}
                >
                    <Form.Item
                        name="firstname"
                        label="Firstname"
                        rules={[{ required: true, message: "Please enter the firstname" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="lastname"
                        label="Lastname"
                        rules={[{ required: true, message: "Please enter the lastname" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Please enter the email" },
                            { type: 'email', message: "Please enter a valid email" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: "Please enter the email",min: 4 },
                            { type: 'string', message: "Please enter a password" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: "Please select the gender" }]}
                    >
                        <Select>
                            <Option value="MALE">Male</Option>
                            <Option value="FEMALE">Female</Option>
                            <Option value="OTHER">Other</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="specialty"
                        label="Specialty"
                        rules={[{ required: true, message: "Please enter the specialty" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                        rules={[{ required: true, message: "Please select the date of birth" }]}
                    >
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                        name="accountLocked"
                        label="Account Locked"
                        valuePropName="checked"
                    >
                        <Select>
                            <Option value={true}>Locked</Option>
                            <Option value={false}>Active</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Physician;
