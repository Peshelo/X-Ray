"use client";
import React, { useEffect, useState } from "react";
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
  Drawer,
  Image,
  Descriptions,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileSearchOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Cookies from "js-cookie";

const { Option } = Select;

// Dummy data for hospitals (ideally, fetch from backend)
const hospitals = [
  {
    id: 1,
    name: "City Hospital",
    address: "123 Health St, Wellness City",
    phoneNumber: "(123) 456-7890",
    email: "contact@cityhospital.com",
    website: "https://www.cityhospital.com",
  },
  {
    id: 2,
    name: "Townsville Medical Center",
    address: "456 Elm St, Townsville",
    phoneNumber: "(987) 654-3210",
    email: "info@townsvillemed.com",
    website: "https://www.townsvillemed.com",
  },
];

// Radiographer Management Component
const Radiographer = () => {
  const [radiographers, setRadiographers] = useState([]);
  const [filteredRadiographers, setFilteredRadiographers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRadiographer, setCurrentRadiographer] = useState(null);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRadiographer, setSelectedRadiographer] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Statistics calculations
  const totalRadiographers = filteredRadiographers.length;
  const maleRadiographers = filteredRadiographers.filter((r) => r.gender === "MALE").length;
  const femaleRadiographers = filteredRadiographers.filter((r) => r.gender === "FEMALE").length;
  const lockedAccounts = filteredRadiographers.filter((r) => r.accountLocked).length;
  const departments = [...new Set(filteredRadiographers.map((r) => r.department))].length;

  // Fetch Radiographers from Backend
  const fetchRadiographers = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://4.222.233.23:8080/radiographer", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch radiographers");
      }

      const data = await response.json();
      setRadiographers(data);
      setFilteredRadiographers(data); // Initialize filtered list
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch radiographers");
    }
  };

  useEffect(() => {
    fetchRadiographers();
  }, []);

  // Handle Search
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = radiographers.filter(
      (r) =>
        r.firstname.toLowerCase().includes(value.toLowerCase()) ||
        r.lastname.toLowerCase().includes(value.toLowerCase()) ||
        r.email.toLowerCase().includes(value.toLowerCase()) ||
        r.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRadiographers(filtered);
  };

  // Table columns definition
  const columns = [
    {
      title: "Firstname",
      dataIndex: "firstname",
      key: "firstname",
      sorter: (a, b) => a.firstname.localeCompare(b.firstname),
    },
    {
      title: "Lastname",
      dataIndex: "lastname",
      key: "lastname",
      sorter: (a, b) => a.lastname.localeCompare(b.lastname),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "MALE" },
        { text: "Female", value: "FEMALE" },
        { text: "Other", value: "OTHER" },
      ],
      onFilter: (value, record) => record.gender === value,
      render: (gender) => {
        let color = "geekblue";
        if (gender === "FEMALE") {
          color = "pink";
        } else if (gender === "MALE") {
          color = "blue";
        } else {
          color = "purple";
        }
        return <Tag color={color}>{gender}</Tag>;
      },
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
      sorter: (a, b) => dayjs(a.dateOfBirth).unix() - dayjs(b.dateOfBirth).unix(),
    },
    {
      title: "Account Status",
      dataIndex: "accountLocked",
      key: "accountLocked",
      render: (locked) =>
        locked ? <Tag color="red">Locked</Tag> : <Tag color="green">Active</Tag>,
      filters: [
        { text: "Active", value: false },
        { text: "Locked", value: true },
      ],
      onFilter: (value, record) => record.accountLocked === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this radiographer?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="default" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
          <Button
            type="default"
            icon={<FileSearchOutlined />}
            onClick={() => {
              setSelectedRadiographer(record);
              setDrawerVisible(true);
            }}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  // Handlers
  const showAddModal = () => {
    setIsEdit(false);
    setCurrentRadiographer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setIsEdit(true);
    setCurrentRadiographer(record);
    form.setFieldsValue({
      ...record,
      dateOfBirth: dayjs(record.dateOfBirth),
      hospital: record.hospital?.id || undefined,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentRadiographer(null);
  };

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`http://4.222.233.23:8080/radiographer/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete radiographer");
      }

      setRadiographers(radiographers.filter((r) => r.id !== id));
      setFilteredRadiographers(filteredRadiographers.filter((r) => r.id !== id));
      message.success("Radiographer deleted successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete radiographer");
    }
  };

  const handleFileUpload = async (event, fieldName) => {
    const file = event.target.files[0];
    const token = Cookies.get("token");

    if (!file) return;

    try {
      setUploading(true);
      const fileForm = new FormData();
      fileForm.append("file", file);

      const response = await fetch("http://4.222.233.23:8080/documents/upload", {
        method: "POST",
        body: fileForm,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.error || "Failed to upload file");
        return;
      }

      form.setFieldsValue({
        [fieldName]: data.location,
      });
      message.success("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("An error occurred during file upload");
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const token = Cookies.get("token");

      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        hospital: values.hospital ? { id: values.hospital } : null,
      };

      if (isEdit) {
        // Update Radiographer
        const response = await fetch(`http://4.222.233.23:8080/radiographer/${currentRadiographer.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedValues),
        });

        if (!response.ok) {
          throw new Error("Failed to update radiographer");
        }

        const updatedRadiographer = await response.json();
        setRadiographers(
          radiographers.map((r) => (r.id === updatedRadiographer.id ? updatedRadiographer : r))
        );
        setFilteredRadiographers(
          filteredRadiographers.map((r) => (r.id === updatedRadiographer.id ? updatedRadiographer : r))
        );
        message.success("Radiographer updated successfully");
      } else {
        // Add Radiographer
        const response = await fetch("http://4.222.233.23:8080/radiographer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedValues),
        });

        if (!response.ok) {
          throw new Error("Failed to add radiographer");
        }

        const newRadiographer = await response.json();
        setRadiographers([...radiographers, newRadiographer]);
        setFilteredRadiographers([...filteredRadiographers, newRadiographer]);
        message.success("Radiographer added successfully");
      }

      setIsModalVisible(false);
      setCurrentRadiographer(null);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Failed to submit form");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Radiographer Management</h1>

      {/* Radiographers Statistics */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Radiographers"
              value={totalRadiographers}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Male Radiographers"
              value={maleRadiographers}
              precision={0}
              valueStyle={{ color: "#1890ff" }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Female Radiographers"
              value={femaleRadiographers}
              precision={0}
              valueStyle={{ color: "#eb2f96" }}
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
              valueStyle={{ color: "#cf1322" }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Action Buttons and Search */}
      <Space className="mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          Add Radiographer
        </Button>
        <Input
          placeholder="Search by name, email, or username"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </Space>

      {/* Radiographers Table */}
      <Table
        columns={columns}
        dataSource={filteredRadiographers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
        scroll={{ x: "max-content" }}
      />

      {/* Add/Edit Radiographer Modal */}
      <Modal
        title={isEdit ? "Edit Radiographer" : "Add Radiographer"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstname"
                label="First Name"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastname"
                label="Last Name"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: !isEdit, message: "Please enter password" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Please select gender" }]}
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
                rules={[{ required: true, message: "Please enter mobile number" }]}
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
                rules={[{ required: true, message: "Please enter national ID" }]}
              >
                <Input placeholder="National ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[{ required: true, message: "Please select date of birth" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input.TextArea rows={2} placeholder="Address" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: "Please enter department" }]}
              >
                <Input placeholder="Department" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="language"
                label="Language"
                rules={[{ required: true, message: "Please select language" }]}
              >
                <Select placeholder="Select Language">
                  <Option value="ENGLISH">English</Option>
                  <Option value="SPANISH">Shona</Option>
                  <Option value="FRENCH">French</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="profileUrl"
            label="Profile Image"
            rules={[{ required: true, message: "Please upload profile image" }]}
          >
            <div className="my-3 p-2 border border-blue-500 rounded-md border-dashed">
              <label htmlFor="profileUpload" className="text-gray-400 cursor-pointer">
                Select Profile Image
              </label>
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                id="profileUpload"
                name="profileUpload"
                onChange={(e) => handleFileUpload(e, "profileUrl")}
                className="hidden"
              />
              {uploading ? (
                <div className="flex items-center mt-2">
                  <span className="ml-2">Uploading...</span>
                </div>
              ) : (
                form.getFieldValue("profileUrl") && (
                  <Image
                    src={`http://4.222.233.23:8080/${form.getFieldValue("profileUrl")}`}
                    alt="Profile"
                    className="w-32 h-32 object-cover my-2 rounded-md shadow-md"
                  />
                )
              )}
            </div>
          </Form.Item>
          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {isEdit ? "Update" : "Add"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer for Radiographer Details */}
      <Drawer
        title="Radiographer Details"
        placement="right"
        width="75%"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        {selectedRadiographer && (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                <Image
                  src={`http://4.222.233.23:8080/${selectedRadiographer.profileUrl}`}
                  alt="Profile"
                  className="w-full h-auto rounded-md shadow-md"
                />
              </Col>
              <Col span={16}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="First Name">
                    {selectedRadiographer.firstname}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Name">
                    {selectedRadiographer.lastname}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {selectedRadiographer.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Username">
                    {selectedRadiographer.username}
                  </Descriptions.Item>
                  <Descriptions.Item label="Gender">
                    {selectedRadiographer.gender}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mobile Number">
                    {selectedRadiographer.mobileNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="National ID">
                    {selectedRadiographer.nationalId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">
                    {dayjs(selectedRadiographer.dateOfBirth).format("YYYY-MM-DD")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {selectedRadiographer.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Department">
                    {selectedRadiographer.department}
                  </Descriptions.Item>
                  <Descriptions.Item label="Language">
                    {selectedRadiographer.language}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Radiographer;