import React, {useEffect, useState} from 'react';
import {Card, Col, Divider, Row, Segmented} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import SelectModel from "./components/SelectModel.tsx";
import FieldList from "./components/FieldList.tsx";
import IndexList from "./components/IndexList.tsx";
import RecordList from "./components/RecordList.tsx";

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

  const [selectedItem, setSelectedItem] = useState<string>('field');
  const [activeDs, setActiveDs] = useState<string>(datasource || '');
  const [activeModel, setActiveModel] = useState<any>({});

  // 处理选择的模型变化
  const handleItemChange = (ds: string, item: any) => {
    setActiveDs(ds);
    setActiveModel(item);
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
                datasource={activeDs}
                editable
                onChange={handleItemChange}
              />
              <Divider/>
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
              <RecordList datasource={activeDs} model={activeModel}/>
            )}
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ModelingPage;
