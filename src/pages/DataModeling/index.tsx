import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Row, Segmented} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useLocation, useNavigate} from 'react-router-dom';
import {createModel as reqCreateModel} from '../../api/model';
import SelectModel from "./components/SelectModel.tsx";
import FieldList from "./components/FieldList.tsx";
import IndexList from "./components/IndexList.tsx";
import RecordList from "./components/RecordList.tsx";
import CreateModel from "./components/CreateModel.tsx";
import {getRecordList} from "../../api/record.ts"; // 假设是API请求

const ModelingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 替代 useHistory

  // 从URL中获取datasource参数
  const {datasource} = location.state as { datasource: string } || {};

  // 选项设置
  const options = [
    {label: 'Field', value: 'field'},
    {label: 'Index', value: 'index'},
    {label: 'Record', value: 'record'},
  ];

  const [selectModelKey, setSelectModelKey] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<string>('field');
  const [activeDs, setActiveDs] = useState<string>(datasource || '');
  const [activeModel, setActiveModel] = useState<any>({});
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleRefreshModelList = () => {
    setSelectModelKey(prevKey => prevKey + 1); // 更新key，导致子组件重新渲染
  };

  // 处理选择的模型变化
  const handleItemChange = (ds: string, item: any) => {
    setActiveDs(ds);
    setActiveModel(item);
  };

  // 添加模型
  const addModel = async (item: any) => {
    await reqCreateModel(activeDs, item);
    setDrawerVisible(false);
    handleRefreshModelList();
  };

  useEffect(() => {
    if (activeDs) {
      navigate(`/modeling`, {state: {datasource: activeDs}});
    }
  }, [activeDs, navigate]);

  return (
    <>
      <Card>
        <Row>
          <Col span={24}>
            <div>
              <Row>
                <Col span={12}>
                  <span style={{fontWeight: 600, fontSize: '16px'}}>
                  Data modeling
                  </span>
                </Col>
                <Col span={12} style={{textAlign: 'right'}}>
                  <Segmented
                    value={selectedItem}
                    onChange={(val) => setSelectedItem(val as string)}
                    options={options}
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={5}>
            <div style={{borderRight: '1px solid rgba(5, 5, 5, 0.06)', padding: '10px 10px 0px 0px'}}>
              <SelectModel
                key={selectModelKey}
                datasource={activeDs}
                editable
                onChange={handleItemChange}
              />
              <Divider/>
              <Button
                type="primary"
                icon={<PlusOutlined/>}
                onClick={() => setDrawerVisible(true)}
                block
                ghost
              >
                New model
              </Button>
            </div>
          </Col>
          <Col span={19}>
            {selectedItem === 'field' && (
              <FieldList
                datasource={activeDs}
                model={activeModel}
                /* onFieldsChange={(fields) => setActiveModel((prev) => ({ ...prev, fields }))}*/
              />
            )}
            {selectedItem === 'index' && (
              <IndexList
                datasource={activeDs}
                model={activeModel}
                /*onIndexesChange={(indexes) => setActiveModel((prev) => ({ ...prev, indexes }))}*/
              />
            )}
            {selectedItem === 'record' && (
              <RecordList datasource={activeDs} model={activeModel}
                          getRecordList={(datasource: string, modelName: string, query: {
                            current: number;
                            pageSize: number
                          }) => getRecordList(datasource, modelName, query)}
              />
            )}
          </Col>
        </Row>
      </Card>
      <CreateModel visible={drawerVisible} datasource={activeDs} onConform={addModel}
                   onCancel={() => setDrawerVisible(false)}/>
    </>
  );
};

export default ModelingPage;
