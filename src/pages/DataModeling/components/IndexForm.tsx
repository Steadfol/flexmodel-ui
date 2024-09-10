import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Select, Switch, Button, notification } from 'antd';

interface Field {
  fieldName: string;
  direction?: 'ASC' | 'DESC';
}

interface ChangeIndexProps {
  visible: boolean;
  datasource: string;
  model: { fields: { name: string }[] };
  currentValue: { name?: string; fields: Field[]; unique?: boolean };
  onConfirm: (data: { name: string; fields: Field[]; unique: boolean }) => void;
  onCancel: () => void;
}

const IndexForm: React.FC<ChangeIndexProps> = ({ visible, datasource, model, currentValue, onConform, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (currentValue) {
      form.setFieldsValue({
        name: currentValue.name || '',
        fields: currentValue.fields.map(field => field.direction ? `${field.fieldName}:${field.direction}` : field.fieldName),
        unique: currentValue.unique || false
      });
    }
  }, [currentValue, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const fields = values.fields.map((f: string) => {
        let fieldName = f;
        let direction: 'ASC' | 'DESC' | undefined;
        if (f.endsWith('ASC')) {
          fieldName = f.replace(':ASC', '');
          direction = 'ASC';
        } else if (f.endsWith('DESC')) {
          fieldName = f.replace(':DESC', '');
          direction = 'DESC';
        }
        return {
          fieldName,
          direction,
        };
      });

      onConform({
        name: values.name,
        fields,
        unique: values.unique,
      });
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <Modal
      title={currentValue?.name ? 'Edit Index' : 'New Index'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={580}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: '',
          fields: [],
          unique: false,
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the index name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="fields"
          label="Fields"
          rules={[{ required: true, message: 'Please select the index fields!' }]}
        >
          <Select mode="multiple" allowClear>
            {model.fields.map(field => (
              <Select.Option key={field.name} value={field.name}>{field.name}</Select.Option>
            ))}
            <Select.OptGroup label="DESC">
              {model.fields.map(field => (
                <Select.Option key={`${field.name}:DESC`} value={`${field.name}:DESC`}>
                  {`${field.name} DESC`}
                </Select.Option>
              ))}
            </Select.OptGroup>
            <Select.OptGroup label="ASC">
              {model.fields.map(field => (
                <Select.Option key={`${field.name}:ASC`} value={`${field.name}:ASC`}>
                  {`${field.name} ASC`}
                </Select.Option>
              ))}
            </Select.OptGroup>
          </Select>
        </Form.Item>
        <Form.Item name="unique" label="Unique" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IndexForm;