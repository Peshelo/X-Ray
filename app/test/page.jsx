"use client";
import React, { useState } from 'react';
import { Form, Input, Button, Select, DatePicker, message, Steps, Card, Divider } from 'antd';
import { IconBase } from 'react-icons';
import { useRouter } from 'next/navigation';
// import { UserOutlined, HospitalOutlined, LinkOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { Option } = Select;

export default function HospitalAdminCreation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [adminId, setAdminId] = useState(null);
  const [hospitalId, setHospitalId] = useState(null);
  const [loading, setLoading] = useState(false);
const router = useRouter(); // Use useRouter from next/navigation
  const [adminForm] = Form.useForm();
  const [hospitalForm] = Form.useForm();

  const handleAdminSubmit = async (values) => {
    console.log(values);
    setLoading(true);
    try {
      // Format date to YYYY-MM-DD
      values.dateOfBirth = values.dateOfBirth.format('YYYY-MM-DD');
      values.roles = ["ADMIN"];

      const response = await fetch('http://4.222.233.23/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "firstname": values.firstname,
          "lastname": values.lastname,
          "email": values.email,
          "username": values.username,
          "password": values.password,
          "gender": values.gender,
          "mobileNumber": values.mobileNumber,
          "nationalId": values.nationalId,
          "dateOfBirth": values.dateOfBirth,
          "address": values.address,
          "roles": [
              "ADMIN"
          ]
      }),
      });

      if (!response.ok) {
        throw new Error('Failed to create admin');
      }

      const data = await response.json();
      setAdminId(data.id);
      message.success('Admin created successfully!');
      setCurrentStep(1);
    } catch (error) {
      message.error(`Error creating admin: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleHospitalSubmit = async (values) => {
    setLoading(true);
    try {
      // Create hospital without admin first
      const hospitalData = {
        ...values,
        admin: null,
        radiographers: []
      };

      const response = await fetch('http://4.222.233.23/api/hospital', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hospitalData),
      });

      if (!response.ok) {
        throw new Error('Failed to create hospital');
      }

      const data = await response.json();
      setHospitalId(data.id);
      message.success('Hospital created successfully!');
      setCurrentStep(2);
    } catch (error) {
      message.error(`Error creating hospital: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://4.222.233.23/api/hospital/${hospitalId}/assign-admin/${adminId}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to assign admin to hospital');
      }

      message.success('Admin assigned to hospital successfully!');
      setCurrentStep(0);
      adminForm.resetFields();
      hospitalForm.resetFields();
      setAdminId(null);
      setHospitalId(null);
      router.push('/auth/sign-in'); // Redirect to hospital page after assignment
    } catch (error) {
      message.error(`Error assigning admin: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card title="Register new hospital" className="shadow-lg">
        <Steps current={currentStep} className="mb-8">
          <Step title="Create Admin"  />
          <Step title="Create Hospital" />
          <Step title="Assign Admin" />
        </Steps>

        <Divider />

        {currentStep === 0 && (
          <Form
            form={adminForm}
            layout="vertical"
            onFinish={handleAdminSubmit}
            className="p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="First Name"
                name="firstname"
                rules={[{ required: true, message: 'Please input the first name!' }]}
              >
                <Input placeholder="John" />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastname"
                rules={[{ required: true, message: 'Please input the last name!' }]}
              >
                <Input placeholder="Doe" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please input the email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input placeholder="john.doe@example.com" />
              </Form.Item>

              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input the username!' }]}
              >
                <Input placeholder="johndoe" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input the password!' }]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please select gender!' }]}
              >
                <Select placeholder="Select gender">
                  <Option value="MALE">Male</Option>
                  <Option value="FEMALE">Female</Option>
                  <Option value="OTHER">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Mobile Number"
                name="mobileNumber"
                rules={[{ required: true, message: 'Please input the mobile number!' }]}
              >
                <Input placeholder="+1234567890" />
              </Form.Item>

              <Form.Item
                label="National ID"
                name="nationalId"
                rules={[{ required: true, message: 'Please input the national ID!' }]}
              >
                <Input placeholder="1234567890" />
              </Form.Item>

              <Form.Item
                label="Date of Birth"
                name="dateOfBirth"
                rules={[{ required: true, message: 'Please select date of birth!' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input the address!' }]}
              >
                <Input.TextArea rows={2} placeholder="123 Main St, City, Country" />
              </Form.Item>
            </div>

            <Form.Item className="mt-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full md:w-auto"
              >
                Create Admin
              </Button>
            </Form.Item>
          </Form>
        )}

        {currentStep === 1 && (
          <Form
            form={hospitalForm}
            layout="vertical"
            onFinish={handleHospitalSubmit}
            className="p-4"
          >
            <div className="grid grid-cols-1 gap-4">
              <Form.Item
                label="Hospital Name"
                name="name"
                rules={[{ required: true, message: 'Please input the hospital name!' }]}
              >
                <Input placeholder="General Hospital" />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input the hospital address!' }]}
              >
                <Input.TextArea rows={2} placeholder="456 Health Ave, Medical City" />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Phone Number"
                  name="phoneNumber"
                  rules={[{ required: true, message: 'Please input the phone number!' }]}
                >
                  <Input placeholder="+1234567890" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please input the email!' },
                    { type: 'email', message: 'Please enter a valid email!' },
                  ]}
                >
                  <Input placeholder="contact@generalhospital.com" />
                </Form.Item>

                <Form.Item
                  label="Website"
                  name="website"
                  rules={[{ type: 'url', message: 'Please enter a valid URL!' }]}
                >
                  <Input placeholder="https://www.generalhospital.com" />
                </Form.Item>
              </div>
            </div>

            <Form.Item className="mt-6">
              <div className="flex justify-between">
                <Button
                  onClick={() => setCurrentStep(0)}
                  className="mr-4"
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Create Hospital
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}

        {currentStep === 2 && (
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Admin Information</h3>
              <p className="text-gray-600">
                Admin ID: <span className="font-mono">{adminId}</span>
              </p>
              <p className="text-gray-600">
                Name: <span className="font-mono">
                  {adminForm.getFieldValue('firstname')} {adminForm.getFieldValue('lastname')}
                </span>
              </p>
              <p className="text-gray-600">
                Email: <span className="font-mono">{adminForm.getFieldValue('email')}</span>
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold">Hospital Information</h3>
              <p className="text-gray-600">
                Hospital ID: <span className="font-mono">{hospitalId}</span>
              </p>
              <p className="text-gray-600">
                Name: <span className="font-mono">{hospitalForm.getFieldValue('name')}</span>
              </p>
              <p className="text-gray-600">
                Address: <span className="font-mono">{hospitalForm.getFieldValue('address')}</span>
              </p>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                onClick={() => setCurrentStep(1)}
                className="mr-4"
              >
                Back
              </Button>
              <Button
                type="primary"
                onClick={handleAssignAdmin}
                loading={loading}
              >
                Assign Admin to Hospital
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

