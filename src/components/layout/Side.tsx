import { PieChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Flex, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: '1',
        label: 'Tổng quan',
        icon: <PieChartOutlined />
    },
    {
        key: '2',
        label: <Link to="./kho/nhapkho" className='text-decoration-none'>Hóa đơn</Link>,
        icon: <img alt="icon sider bar" src={require('../../assets/img/hoa-don.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
    },
    {
        key: '4',
        label: <Link to="./product" className='text-decoration-none'>Sản phẩm</Link>,
        icon: <img alt="icon sider bar" src={require('../../assets/img/sp.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
    },
    {
        key: '5',
        label: 'Quản lí kho',
        icon: <img alt="icon sider bar" src={require('../../assets/img/kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
        children: [
            {
                key: '6',
                label: <Link to="./kho/nhapkho" className='text-decoration-none'>Nhập kho</Link>,
                icon: <img alt="icon sider bar" src={require('../../assets/img/nhap-kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            },
            {
                key: '7',
                label: <Link to="./kho/xuatkho" className='text-decoration-none'>Xuất kho</Link>,
                icon: <img alt="icon sider bar" src={require('../../assets/img/xuat-kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            },
            {
                key: '8',
                label: <Link to="./kho/kiemkho" className='text-decoration-none'>Kiểm kho</Link>,
                icon: <img alt="icon sider bar" src={require('../../assets/img/kiem-kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            },
        ],
    },
    {
        key: '9',
        label: 'Đối tác',
        icon: <img alt="icon sider bar" src={require('../../assets/img/doi-tac.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
        children: [
            {
                key: '10',
                label: <Link to="./customer" className='text-decoration-none'>Khách hàng</Link>,
                icon: <img alt="icon sider bar" src={require('../../assets/img/account.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            },
            {
                key: '11',
                label: <Link to="./customer/group" className='text-decoration-none'>Nhóm khách hàng</Link>,
                icon: <img alt="icon sider bar" src={require('../../assets/img/customer_group.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            },
            {
                key: '12',
                label: <Link to="./provider" className='text-decoration-none'>Nhà cung cấp</Link>,
                icon: <img alt="icon sider bar" src={require('../../assets/img/provider.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            },
        ],
    },
];


const SideLayout = (props: any) => {
    const { Sider } = Layout;

    const siderStyle: React.CSSProperties = {
        flex: '0 0 80px',
        maxWidth: '80px',
        minWidth: '80px',
        width: '80px',
        background: '#fff',
        paddingBottom: '48px'
    };

    const siderStyleContent: React.CSSProperties = {
        flex: '0 0 250px',
        maxWidth: '250px',
        minWidth: '250px',
        width: '250px',
        background: '#fff',
        paddingBottom: '48px'
    };


    const userImage: React.CSSProperties = {
        width: '40px',
        height: '40px',
        borderRadius: '50%'
    };

    return (
        <>
            <Sider
                width={props.collapsed ? 80 : 250}
                style={props.collapsed ? siderStyleContent : siderStyle}
                collapsible
                theme='light'
                onCollapse={(value) => props.setCollapsed(value)}
                collapsed={props.collapsed}
                collapsedWidth='80'>
                <div className="demo-logo-vertical" style={{ padding: '20px 20px 10px' }}>
                    <div className="user-info" style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            size="large"
                            src={require('../../assets/img/logo-app.af7d24a2.png')} />
                        {
                            props.collapsed ? "" : <div style={{ padding: '5px', fontWeight: '600', lineHeight: '17px' }}>Han</div>
                        }
                    </div>

                </div>
                <Menu theme="light" mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['1']}
                    items={items} />
            </Sider>
        </>
    )
}

export default SideLayout;