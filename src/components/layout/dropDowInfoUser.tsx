import { DownOutlined, LogoutOutlined, ShopOutlined, UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Dropdown, Menu, MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

const DropDowInfoUser = () => {
    const navigate = useNavigate();

    const handleMenuClick: MenuProps['onClick'] = (e) => {
    };


    const items: MenuProps['items'] = [
        {
            label: '1st menu item',
            key: '1',
            icon: <UserOutlined style={{
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer'
            }} />,
        },
        {
            label: '2nd menu item',
            key: '2',
            icon: <UserOutlined />,
        },
        {
            label: '3rd menu item',
            key: '3',
            icon: <UserOutlined />,
            danger: true,
        },
        {
            label: '4rd menu item',
            key: '4',
            icon: <UserOutlined />,
            danger: true,
            disabled: true,
        },
    ];
    const userMenu = (
        <Menu className="ant-popover-inner-content">
            <Menu.Item key="1">
                <div className="menu-item" style={{ backgroundColor: "#012970" }}>
                    <UserOutlined style={{
                        color: 'rgb(255, 255, 255)',
                        fontSize: '25px',
                        margin: '5px'
                    }} />
                    <div style={{ alignContent: "center", width: "100%" }}>
                        {/* <h4 style={{ fontWeight: 400, color: "rgb(255, 255, 255)" }}>{getAuthToLocal.userName}</h4>
                        <h6 style={{ color: "rgb(255, 255, 255)" }}>{getAuthToLocal.LoginId}</h6> */}
                    </div>
                </div>
            </Menu.Item>

            <Menu.Item key="2">
                <div className="menu-item" onClick={() => {
                    navigate({
                        pathname: 'nhanvien',
                    });
                }}>
                    <UsergroupAddOutlined className="icon-menu" />
                    <h5 className="title">Quản lý người dùng</h5>
                </div>
            </Menu.Item>

            <Menu.Item key="3">
                <div className="menu-item" onClick={() => {
                    navigate({
                        pathname: 'quanlycuahang',
                    });
                }}>
                    <ShopOutlined className="icon-menu" />
                    <h5 className="title">Thông tin cửa hàng</h5>
                </div>
            </Menu.Item>

            <Menu.Item key="4">
                <div className="menu-item" onClick={() => {
                    // resetAuth();
                    window.location.href = '/';
                }}>
                    <LogoutOutlined className="icon-menu" />
                    <h5 className="title">Đăng xuất</h5>
                </div>
            </Menu.Item>
        </Menu >
    );

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    return (
        <>
            <Dropdown overlay={userMenu}>
                <div className="user-info">
                    <UserOutlined style={{
                        color: 'white',
                        fontSize: '20px',
                        cursor: 'pointer'
                    }} />
                    {/* <p className="name-user">{getAuthToLocal.userName || getAuthToLocal.LoginId || ''}</p> */}
                    <DownOutlined />
                </div>
            </Dropdown>
            {/* <Dropdown.Button menu={menuProps} onClick={handleMenuClick}>
                <div className="user-info">
                    <UserOutlined style={{
                        color: 'white',
                        fontSize: '20px',
                        cursor: 'pointer'
                    }} />
                    <p className="name-user">han</p>
                    <DownOutlined />
                </div>
            </Dropdown.Button> */}
        </>
    )
}
export default DropDowInfoUser;