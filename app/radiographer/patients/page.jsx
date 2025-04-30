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
    SearchOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import Cookies from 'js-cookie';
import Link from 'next/link';

const { Option } = Select;
const { RangePicker } = DatePicker;

// Debounce function to limit API calls during search
const debounce = (func, delay) => {
    let debounceTimer;
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    }
}

const Page = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null);
    const [form] = Form.useForm();

    const [filters, setFilters] = useState({
        gender: null,
        language: null,
        accountStatus: null,
        searchText: '',
        dateRange: [],
    });

    const [loading, setLoading] = useState(false);

    // Statistics calculations
    const totalPatients = filteredPatients.length;
    const malePatients = filteredPatients.filter(p => p.gender === 'MALE').length;
    const femalePatients = filteredPatients.filter(p => p.gender === 'FEMALE').length;
    const lockedAccounts = filteredPatients.filter(p => p.accountLocked).length;

    // Table columns definition with sorting and filtering
    const columns = [
        {
            title: 'Name',
            dataIndex: 'firstname',
            key: 'firstname',
            render: (text, record) => `${record.firstname} ${record.lastname}`,
            sorter: (a, b) => a.firstname.localeCompare(b.firstname),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'NationalId',
            dataIndex: 'nationalId',
            key: 'nationalId',
            render: (nationalId) => <Tag color='blue'>{nationalId}</Tag>,
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
            sorter: (a, b) => a.gender.localeCompare(b.gender),
        },
        {
            title: 'Mobile Number',
            dataIndex: 'mobileNumber',
            key: 'mobileNumber',
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (date) => moment(date).format('YYYY-MM-DD'),
            sorter: (a, b) => moment(a.dateOfBirth).unix() - moment(b.dateOfBirth).unix(),
        },
        {
            title: 'Language',
            dataIndex: 'language',
            key: 'language',
            filters: [
                { text: 'English', value: 'ENGLISH' },
                { text: 'Shona', value: 'SHONA' },
                { text: 'French', value: 'FRENCH' },
                // Add more languages as needed
            ],
            onFilter: (value, record) => record.language === value,
            sorter: (a, b) => a.language.localeCompare(b.language),
        },
        {
            title: 'Account Status',
            dataIndex: 'accountLocked',
            key: 'accountLocked',
            filters: [
                { text: 'Active', value: false },
                { text: 'Locked', value: true },
            ],
            onFilter: (value, record) => record.accountLocked === value,
            render: (locked) => (locked ? <Tag color='red'>Locked</Tag> : <Tag color='green'>Active</Tag>),
            sorter: (a, b) => a.accountLocked - b.accountLocked,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/radiographer/patients/${record.id}`}>
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                        >
                            View Profile
                        </Button>
                    </Link>
                    {/* <Button
                        type="default"
                        icon={<FileSearchOutlined />}
                        onClick={() => viewReports(record)}
                    >
                        View Reports
                    </Button> */}
                    <Popconfirm
                        title="Are you sure you want to delete this patient?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Handlers for Filters
    const handleFilterChange = (changedFilters) => {
        setFilters(prev => ({ ...prev, ...changedFilters }));
    };

    const applyFilters = () => {
        let filtered = [...patients];

        // Filter by Gender
        if (filters.gender) {
            filtered = filtered.filter(p => p.gender === filters.gender);
        }

        // Filter by Language
        if (filters.language) {
            filtered = filtered.filter(p => p.language === filters.language);
        }

        // Filter by Account Status
        if (filters.accountStatus !== null) {
            filtered = filtered.filter(p => p.accountLocked === filters.accountStatus);
        }

        // Filter by Date Range
        if (filters.dateRange && filters.dateRange.length === 2) {
            const [start, end] = filters.dateRange;
            filtered = filtered.filter(p => {
                const dob = moment(p.dateOfBirth);
                return dob.isBetween(start, end, 'day', '[]');
            });
        }

        // Search by Text
        if (filters.searchText) {
            const search = filters.searchText.toLowerCase();
            filtered = filtered.filter(p =>
                p.firstname.toLowerCase().includes(search) ||
                p.lastname.toLowerCase().includes(search) ||
                p.email.toLowerCase().includes(search) ||
                p.nationalId.toLowerCase().includes(search)
            );
        }

        setFilteredPatients(filtered);
    };

    useEffect(() => {
        applyFilters();
    }, [filters, patients]);

    // Debounced Search Handler
    const handleSearch = debounce((value) => {
        handleFilterChange({ searchText: value });
    }, 500);

    // Fetch patients from backend
    const fetchPatients = async () => {
        setLoading(true);
        const token = Cookies.get("token");
        try {
            const response = await fetch("http://4.222.233.23/api/patient", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPatients(data);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || "Failed to fetch patients");
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
            message.error("An error occurred while fetching patients");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPatients();
    }, []);

    // Handlers for Add/Edit Modal
    const showAddModal = () => {
        setIsEdit(false);
        setCurrentPatient(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditModal = (record) => {
        setIsEdit(true);
        setCurrentPatient(record);
        form.setFieldsValue({
            ...record,
            dateOfBirth: moment(record.dateOfBirth),
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentPatient(null);
    };

    // Handler for Delete
    const handleDelete = async (id) => {
        const token = Cookies.get("token");
        try {
            const response = await fetch(`http://4.222.233.23/api/patient/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setPatients(patients.filter(patient => patient.id !== id));
                message.success('Patient deleted successfully');
            } else {
                const errorData = await response.json();
                message.error(errorData.message || "Failed to delete patient");
            }
        } catch (error) {
            console.error("Error deleting patient:", error);
            message.error("An error occurred while deleting the patient");
        }
    };

    // Handler for Form Submission
    const handleFormSubmit = async (values) => {
        const token = Cookies.get("token");
        const formattedValues = {
            ...values,
            dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
        };

        if (isEdit) {
            try {
                const response = await fetch(`http://4.222.233.23/api/patient/${currentPatient.id}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formattedValues),
                });

                if (response.ok) {
                    const updatedPatient = await response.json();
                    setPatients(patients.map(patient => patient.id === updatedPatient.id ? updatedPatient : patient));
                    message.success('Patient updated successfully');
                } else {
                    const errorData = await response.json();
                    message.error(errorData.message || "Failed to update patient");
                }
            } catch (error) {
                console.error("Error updating patient:", error);
                message.error("An error occurred while updating the patient");
            }
        } else {
            try {
                const response = await fetch("http://4.222.233.23/api/patient", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formattedValues),
                });

                if (response.ok) {
                    const newPatient = await response.json();
                    setPatients([...patients, newPatient]);
                    message.success('Patient added successfully');
                } else {
                    const errorData = await response.json();
                    message.error(errorData.message || "Failed to add patient");
                }
            } catch (error) {
                console.error("Error adding patient:", error);
                message.error("An error occurred while adding the patient");
            }
        }

        setIsModalVisible(false);
        setCurrentPatient(null);
        form.resetFields();
    };

    // Handler for Viewing Reports
    const viewReports = (record) => {
        Modal.info({
            title: `Radiograph Reports for ${record.firstname} ${record.lastname}`,
            content: (
                <div>
                    <p>No reports available.</p>
                    {/* You can enhance this section to display actual reports */}
                </div>
            ),
            onOk() {},
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Patient Management</h1>

            {/* Patients Statistics */}
            <Row gutter={16} className="mb-6">
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Patients"
                            value={totalPatients}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Male Patients"
                            value={malePatients}
                            precision={0}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Female Patients"
                            value={femalePatients}
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

            {/* Filters Section */}
                        <Form.Item label="Search">
                            <Input
                                placeholder="Search by name, email, or username"
                                maxLength={50}
                                prefix={<SearchOutlined />}
                                allowClear
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </Form.Item>
       

            {/* Action Buttons */}
            {/* <Space className="mb-4">
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                    Add Patient
                </Button>
            </Space> */}

            {/* Patients Table */}
            <Table
            className='drop-shadow-lg'
                columns={columns}
                dataSource={filteredPatients}
                rowKey="id"
                pagination={{ pageSize: 10, showSizeChanger: true }}
                loading={loading}
                bordered
            />

            {/* Add/Edit Patient Modal */}
            <Modal
                title={isEdit ? 'Edit Patient' : 'Add Patient'}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstname"
                                label="First Name"
                                rules={[{ required: true, message: 'Please enter first name' }]}
                            >
                                <Input placeholder="First Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastname"
                                label="Last Name"
                                rules={[{ required: true, message: 'Please enter last name' }]}
                            >
                                <Input placeholder="Last Name" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please enter username' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter password' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="gender"
                                label="Gender"
                                rules={[{ required: true, message: 'Please select gender' }]}
                            >
                                <Select placeholder="Select Gender">
                                    <Option value="MALE">Male</Option>
                                    <Option value="FEMALE">Female</Option>
                                    <Option value="OTHER">Other</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="mobileNumber"
                                label="Mobile Number"
                                rules={[{ required: true, message: 'Please enter mobile number' }]}
                            >
                                <Input placeholder="Mobile Number" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="nationalId"
                                label="National ID"
                                rules={[{ required: true, message: 'Please enter national ID' }]}
                            >
                                <Input placeholder="National ID" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="dateOfBirth"
                                label="Date of Birth"
                                rules={[{ required: true, message: 'Please select date of birth' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: 'Please enter address' }]}
                    >
                        <Input.TextArea rows={2} placeholder="Address" />
                    </Form.Item>
                    <Form.Item
                        name="language"
                        label="Language"
                        rules={[{ required: true, message: 'Please select language' }]}
                    >
                        <Select placeholder="Select Language">
                            <Option value="ENGLISH">English</Option>
                            <Option value="SPANISH">Spanish</Option>
                            <Option value="FRENCH">French</Option>
                            {/* Add more languages as needed */}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {isEdit ? 'Update' : 'Add'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
    export default Page;

