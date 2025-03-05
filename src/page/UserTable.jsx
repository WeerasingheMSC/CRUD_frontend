import React,{useState} from 'react';
import { Table,Drawer,Button } from 'antd';

const UserTable = () => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const data = [
        {
          key: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "Admin",
        },
        {
          key: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "User",
        },
        {
          key: "3",
          name: "Alice Brown",
          email: "alice@example.com",
          role: "Editor",
        },
      ];
    
      // Table columns
      const columns = [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "Role",
          dataIndex: "role",
          key: "role",
        },
      ];
    
      // Function to handle row click
      const handleRowClick = (record) => {
        setSelectedRow(record);
        setIsDrawerVisible(true);
      };
  
  return (
    <div style={{ display: "flex" }}>
    {/* Table Section */}
    <Table
      columns={columns}
      dataSource={data}
      onRow={(record) => ({
        onClick: () => handleRowClick(record),
      })}
      style={{ width: "100%" }}
    />

    {/* Drawer (Side Panel) */}
    <Drawer
      title="User Details"
      placement="right"
      onClose={() => setIsDrawerVisible(false)}
      open={isDrawerVisible}
    >
      {selectedRow ? (
        <div>
          <p><strong>Name:</strong> {selectedRow.name}</p>
          <p><strong>Email:</strong> {selectedRow.email}</p>
          <p><strong>Role:</strong> {selectedRow.role}</p>
        </div>
      ) : (
        <p>Select a user to view details.</p>
      )}
    </Drawer>
  </div>
);
}

export default UserTable
