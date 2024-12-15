import { BellOutlined, HomeOutlined, MenuOutlined, ProfileOutlined } from '@ant-design/icons';
import { Button, Flex, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Header } from 'antd/es/layout/layout';

const HeaderLayout = (props: any) => {
  const navigate = useNavigate();
  return (
    <>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          height: '55px',
          paddingLeft: '20px',
          backgroundColor: '#012970',
          color: '#fff'
        }}
      >
        <Flex gap="middle" justify="space-between" align={'center'} style={{ width: '100%' }} >
          <Flex justify={'flex-start'} align={'center'}>
            <MenuOutlined style={{
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              paddingRight: '15px',
              marginLeft: props.collapsed ? 20 : 0
            }} onClick={props.toggleCollapsed} />
            {
              props.collapsed ? "" : <div style={{fontSize: '20px'}}>Medicine</div>
            }
          </Flex>
          <Flex justify={'flex-end'} align={'center'}>
            <div className="left-item">
              <Button
                className="button btn-add button-invoice"
                type="primary"
                style={{ height: 35, backgroundColor: '#000', borderWidth: '0px', fontWeight: 'bold' }}
                onClick={() => {
                  navigate({
                    // pathname: Routers.BillRetail.path,
                  });
                }}
              >
                <ProfileOutlined style={{fontWeight: 'bold'}}/>
                <span>TẠO ĐƠN</span>
              </Button>
            </div>
          </Flex>


        </Flex>
      </Header >
    </>

  )
};

export default HeaderLayout;