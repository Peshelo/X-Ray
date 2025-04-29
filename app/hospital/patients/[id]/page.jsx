"use client";

import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  DatePicker,
  FloatButton,
  Image,
  Tabs,
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileSearchOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import Cookies from 'js-cookie';
import moment from 'moment';
import FloatButtonGroup from 'antd/es/float-button/FloatButtonGroup';

const { TabPane } = Tabs;

const Id = () => {
  const { id } = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState(null);
  const [radiographs, setRadiographs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRadiograph, setCurrentRadiograph] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRadiograph, setSelectedRadiograph] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please select fingerprint files to upload.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    try {
      setUploading(true);
      setError('');
      setSuccessMessage('');
      
      const response = await fetch(`http://4.222.233.23:8080/patient/add-fingerprint?userId=${id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload fingerprint.');
      }

      setSuccessMessage('Fingerprint(s) uploaded successfully.');
      setSelectedFiles(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred.');
    } finally {
      setUploading(false);
    }
  };


  // Navigate back to the previous page
  const onBack = () => {
    router.back();
  };

  // Show modal for adding a new radiograph
  const showAddModal = () => {
    setIsEdit(false);
    setCurrentRadiograph(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Show modal for editing an existing radiograph
  const showEditModal = (record) => {
    setIsEdit(true);
    setCurrentRadiograph(record);
    form.setFieldsValue({
      ...record,
      date: moment(record.date),
    });
    setIsModalVisible(true);
  };

  // Handle modal cancel action
  const handleCancel = () => {
    setIsModalVisible(false);
    setDrawerOpen(false);
    setCurrentRadiograph(null);
    setSelectedRadiograph(null);
  };

  // Handle form submission for adding/editing radiograph
  const handleFormSubmit = async (values) => {
    const token = Cookies.get('token');
    const formattedValues = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
    };

    if (isEdit) {
      // Update radiograph logic (assuming API endpoint exists)
      try {
        const response = await fetch(`http://4.222.233.23:8080/radiograph/${currentRadiograph.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedValues),
        });

        if (response.ok) {
          message.success('Radiograph updated successfully');
          fetchRadiographs();
        } else {
          const errorData = await response.json();
          message.error(errorData.error || 'Failed to update radiograph');
        }
      } catch (error) {
        message.error('An error occurred while updating radiograph');
      }
    } else {
      // Add new radiograph
      try {
        const response = await fetch(`http://4.222.233.23:8080/radiograph/create-for-patient/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedValues),
        });

        if (response.ok) {
          const newRadiograph = await response.json();
          setRadiographs((prev) => [...prev, newRadiograph]);
          message.success('Radiograph added successfully');
        } else {
          const errorData = await response.json();
          message.error(errorData.error || 'Failed to add radiograph');
        }
      } catch (error) {
        message.error('An error occurred while adding radiograph');
      }
    }

    setIsModalVisible(false);
    setCurrentRadiograph(null);
    form.resetFields();
  };

  // Handle file upload for radiograph image
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const token = Cookies.get('token');

    if (!file) return;

    try {
      setUploading(true);
      const fileForm = new FormData();
      fileForm.append('file', file);

      const response = await fetch(`http://4.222.233.23:8080/documents/upload`, {
        method: 'POST',
        body: fileForm,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.error || 'Failed to upload image');
        return;
      }

      form.setFieldsValue({
        imageUrl: data.location,
      });
      message.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading documents:', error);
      message.error('An error occurred during image upload');
    } finally {
      setUploading(false);
    }
  };

  // Fetch patient details
  const fetchPatient = async () => {
    setLoading(true);
    const token = Cookies.get('token');
    try {
      const response = await fetch(`http://4.222.233.23:8080/patient/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatient(data);
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Failed to fetch patient details');
      }
    } catch (error) {
      message.error('An error occurred while fetching patient details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch radiographs for the patient
  const fetchRadiographs = async () => {
    setLoading(true);
    const token = Cookies.get('token');
    try {
      const response = await fetch(`http://4.222.233.23:8080/radiograph/get-by-patient/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRadiographs(data);
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Failed to fetch radiographs');
      }
    } catch (error) {
      message.error('An error occurred while fetching radiographs');
    } finally {
      setLoading(false);
    }
  };

  // Delete a radiograph
  const deleteRadiograph = async (radiographId) => {
    setLoading(true);
    const token = Cookies.get('token');
    try {
      const response = await fetch(`http://4.222.233.23:8080/radiograph/${radiographId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success('Radiograph deleted successfully');
        fetchRadiographs();
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Failed to delete radiograph');
      }
    } catch (error) {
      message.error('An error occurred while deleting radiograph');
    } finally {
      setLoading(false);
    }
  };

  // Define table columns for Medical Records
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Radiographer Notes',
      dataIndex: 'radiographerNotes',
      key: 'radiographerNotes',
      sorter: (a, b) => a.radiographerNotes.localeCompare(b.radiographerNotes),
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (text) => (
        <Image
          src={`http://4.222.233.23:8080/${text}`}
          alt="Radiograph"
          style={{ width: 100, height: 100, objectFit: 'cover' }}
        />
      ),
      sorter: (a, b) => a.imageUrl.localeCompare(b.imageUrl),
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
            title="Are you sure you want to delete this radiograph?"
            onConfirm={() => deleteRadiograph(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
          <Button
            type="default"
            icon={<FileSearchOutlined />}
            onClick={() => {
              setSelectedRadiograph(record);
              setDrawerOpen(true);
            }}
          >
            View Report
          </Button>
        </Space>
      ),
    },
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchPatient();
    fetchRadiographs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4">
      <Button onClick={onBack} className="my-2" icon={<ArrowLeftOutlined />}>
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-6">
        Patient: {patient?.firstname} {patient?.lastname}
      </h1>

      <Tabs defaultActiveKey="1">
        {/* Patient Details Tab */}
        <TabPane tab="Patient Details" key="1">
          <Card className="mb-6" loading={loading}>
            <div className="flex flex-col md:flex-row items-center">
              <div className="mr-4 mb-4 md:mb-0">
                {patient?.profileUrl ? (
                  <Image
                    src={`http://4.222.233.23:8080/${patient.profileUrl}`}
                    alt="Profile Image"
                    width={400}
                    height={400}
                    style={{ objectFit: 'cover', }}
                  />
                ) : (
                  <Image
                    src="/images/placeholder-profile.png"
                    alt="Profile Image"
                    width={150}
                    height={150}
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                  />
                )}
              </div>
              <Descriptions title="Patient Details" bordered >
                <Descriptions.Item label="Firstname">{patient?.firstname}</Descriptions.Item>
                <Descriptions.Item label="Lastname">{patient?.lastname}</Descriptions.Item>
                <Descriptions.Item label="National ID">{patient?.nationalId}</Descriptions.Item>
                <Descriptions.Item label="Address">{patient?.address}</Descriptions.Item>
                <Descriptions.Item label="Gender">{patient?.gender}</Descriptions.Item>
                <Descriptions.Item label="Contact">{patient?.mobileNumber}</Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </TabPane>

        {/* National ID Tab */}
        <TabPane tab="Identity Documents" key="2">
          <Card className="mb-6" loading={loading}>
            {patient?.nationalIdUrl ? (
              <div className="flex justify-center mb-4">
                <Image
                  src={`http://4.222.233.23:8080/${patient.nationalIdUrl}`}
                  alt="National ID Document"
                  style={{ maxWidth: '400px', width: '100%', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <p>No National ID document available.</p>
            )}
            <Descriptions size="middle" title="National ID Details" bordered column={1}>
              <Descriptions.Item label="National ID">{patient?.nationalId}</Descriptions.Item>
            </Descriptions>
            <h1 className="text-2xl font-bold my-10 text-blue-600 mb-6">
          Add Fingerprint
        </h1>

        <div className="flex flex-col gap-4">
          <input 
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Fingerprint(s)"}
          </button>

          {successMessage && (
            <p className="text-green-600 text-center text-sm mt-2">{successMessage}</p>
          )}

          {error && (
            <p className="text-red-500 text-center text-sm mt-2">{error}</p>
          )}
        </div>
          </Card>
        </TabPane>

        {/* Medical Records Tab */}
        <TabPane tab="Medical Records" key="3">
          <FloatButtonGroup description="Radiograph">
            <FloatButton
              onClick={showAddModal}
              tooltip="Add new radiograph"
              icon={<PlusOutlined />}
              type="primary"
            />
          </FloatButtonGroup>
          <h2 className="text-xl font-bold my-4">Radiograph Records</h2>
          <Table
            columns={columns}
            dataSource={radiographs}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            loading={loading}
            bordered
          />
        </TabPane>
      </Tabs>

      {/* Modal for Adding/Editing Radiograph */}
      <Modal
        title={isEdit ? 'Edit Radiograph' : 'Add Radiograph'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="date"
            label="Date of Scan"
            rules={[{ required: true, message: 'Please select the date of scan' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          {/* <Form.Item
            name="description"
            label="Radiographer Notes"
            rules={[{ required: true, message: 'Please enter your description' }]}
          >
            <Input.TextArea rows={2} placeholder="Description" />
          </Form.Item> */}


          <Form.Item
            name="radiographerNotes"
            label="Radiographer Notes"
            rules={[{ required: true, message: 'Please enter notes' }]}
          >
            <Input.TextArea rows={2} placeholder="Notes..." />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Radiograph Image"
            valuePropName="fileList"
            getValueFromEvent={() => form.getFieldValue('imageUrl')}
            rules={[{ required: true, message: 'Please upload an image' }]}
          >
            <div className="my-3 p-2 border border-blue-500 rounded-md border-dashed">
              <label htmlFor="imageUpload" className="text-gray-400 cursor-pointer">
                Select image from your computer or mobile device
              </label>
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                id="imageUpload"
                name="imageUpload"
                onChange={handleFileUpload}
                className="hidden"
              />
              {/* Display upload status */}
              {uploading ? (
                <div className="flex items-center mt-2">
                  <span className="ml-2">Uploading...</span>
                </div>
              ) : (
                form.getFieldValue('imageUrl') && (
                  <img
                    src={`http://4.222.233.23:8080/${form.getFieldValue('imageUrl')}`}
                    alt="Radiograph"
                    className="w-32 h-32 object-cover my-2 rounded-md shadow-md"
                  />
                )
              )}
            </div>
          </Form.Item>

          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {isEdit ? 'Update' : 'Add'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer for Viewing Radiograph Report */}
      <Drawer
        title="X-Ray Report"
        visible={drawerOpen}
        onClose={handleCancel}
        footer={null}
        width={1400}
      >
        {selectedRadiograph && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Image
              alt="X-Ray"
              src={`http://4.222.233.23:8080/${selectedRadiograph.imageUrl}`}
              className="w-full h-fit object-contain"
            />
            <div className="w-full flex flex-col gap-4">
              <Descriptions column={1} title="Patient Details" bordered>
                <Descriptions.Item label="Name">
                  {selectedRadiograph.patient?.firstname} {selectedRadiograph.patient?.lastname}
                </Descriptions.Item>
                <Descriptions.Item label="Gender">
                  {selectedRadiograph.patient?.gender}
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  {selectedRadiograph.patient?.dateOfBirth
                    ? moment(selectedRadiograph.patient.dateOfBirth).format('YYYY-MM-DD')
                    : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="National ID">
                  {selectedRadiograph.patient?.nationalId}
                </Descriptions.Item>
                <Descriptions.Item label="Contact">
                  {selectedRadiograph.patient?.mobileNumber}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions column={1} title="Scan Details" bordered>
                <Descriptions.Item label="Name">{selectedRadiograph.name}</Descriptions.Item>
                <Descriptions.Item label="Description">{selectedRadiograph.description}</Descriptions.Item>
                <Descriptions.Item label="Date of Scan">
                  {selectedRadiograph.date
                    ? moment(selectedRadiograph.date).format('YYYY-MM-DD')
                    : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Radiographer Notes">
                  {selectedRadiograph.radiographerNotes}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions column={1} title="Radiographer Details" bordered>
                <Descriptions.Item label="Name">
                  {selectedRadiograph.radiographer?.firstname} {selectedRadiograph.radiographer?.lastname}
                </Descriptions.Item>
                <Descriptions.Item label="Gender">
                  {selectedRadiograph.radiographer?.gender}
                </Descriptions.Item>
                <Descriptions.Item label="National ID">
                  {selectedRadiograph.radiographer?.nationalId}
                </Descriptions.Item>
                <Descriptions.Item label="Contact">
                  {selectedRadiograph.radiographer?.mobileNumber}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Id;
