"use client";

import {
  Button,
  Card,
  Descriptions,
  Space,
  Table,
  Popconfirm,
  message,
  Image,
} from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  EditOutlined,
  DeleteOutlined,
  FileSearchOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import Cookies from 'js-cookie';

const MedicalReports = () => {
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [radiographs, setRadiographs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Navigate back to the previous page
  const onBack = () => {
    router.back();
  };

  // Fetch patient details and radiographs
  const fetchPatientAndRadiographs = async () => {
    setLoading(true);
    const token = Cookies.get('token');

    try {
      // Fetch patient profile
      const profileResponse = await fetch('http://4.222.233.23/api/patient/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        message.error(errorData.error || 'Failed to fetch patient profile');
        return;
      }

      const patientData = await profileResponse.json();
      setPatient(patientData);

      // Fetch radiographs using the patient ID
      const radiographsResponse = await fetch(`http://4.222.233.23/api/radiograph/get-by-patient/${patientData.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (radiographsResponse.ok) {
        const radiographsData = await radiographsResponse.json();
        setRadiographs(radiographsData);
      } else {
        const errorData = await radiographsResponse.json();
        message.error(errorData.error || 'Failed to fetch radiographs');
      }
    } catch (error) {
      message.error('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Delete a radiograph
  const deleteRadiograph = async (radiographId) => {
    setLoading(true);
    const token = Cookies.get('token');
    try {
      const response = await fetch(`http://4.222.233.23/api/radiograph/${radiographId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success('Radiograph deleted successfully');
        fetchPatientAndRadiographs(); // Refresh data
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

  // Define table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Radiographer Notes',
      dataIndex: 'radiographerNotes',
      key: 'radiographerNotes',
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (text) => (
        <Image
          src={`http://4.222.233.23/api/${text}`}
          width={100}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {/* <Popconfirm
            title="Are you sure you want to delete this radiograph?"
            onConfirm={() => deleteRadiograph(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm> */}
          <Button
            type="default"
            icon={<FileSearchOutlined />}
            // Add your view report logic here
          >
            View Report
          </Button>
        </Space>
      ),
    },
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchPatientAndRadiographs();
  }, []);

  return (
    <div className="p-4">
      <Button onClick={onBack} className="my-2" icon={<ArrowLeftOutlined />}>
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-6">
        Medical Records
      </h1>
      <Table
        dataSource={radiographs}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default MedicalReports;
