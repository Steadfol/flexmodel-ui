import React from 'react';
import {Button, Form, Input, Modal} from 'antd';

interface EditProviderProps {
  visible: boolean;
  data: any;
  onCancel: () => void;
  onConfirm: (form: any) => void;
}

const EditProvider: React.FC<EditProviderProps> = ({visible, data, onCancel, onConfirm}) => {
  const [form] = Form.useForm();

  const handleConfirm = async () => {
    const values = await form.validateFields();
    onConfirm(values);
  };

  return (
    <Modal
      title="Edit provider"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleConfirm}>
          Confirm
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={data}>
        {/* Connection Name */}
        <Form.Item name="name" label="Connection name">
          <Input disabled/>
        </Form.Item>

        {/* OIDC Provider, assuming this is a custom component */}
        <Form.Item name="type" label="Type">
          <Input disabled/>
        </Form.Item>
        <Form.Item
          label="Issuer"
          name="issuer"
          rules={[{required: true, message: 'Issuer is required'}]}
        >
          <Input placeholder="e.g. http://localhost:8080/realms/master"/>
        </Form.Item>

        {/* Discovery endpoint */}
        {(form as any)?.issuer && <Form.Item label="Discovery endpoint">
          {(form as any)?.issuer}/.well-known/openid-configuration
        </Form.Item>}


        {/* Client ID */}
        <Form.Item
          label="Client ID"
          name="clientId"
          rules={[{required: true, message: 'Client ID is required'}]}
        >
          <Input/>
        </Form.Item>

        {/* Client Secret */}
        <Form.Item
          label="Client Secret"
          name="clientSecret"
          rules={[{required: true, message: 'Client Secret is required'}]}
        >
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProvider;
