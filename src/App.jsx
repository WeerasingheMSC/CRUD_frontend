import { React, useState, useEffect, useRef, use } from "react";
import axios from "axios";
import "./App.css";
import { Button, Input, Space, Table, Form, Modal, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const App = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // Ant Design Form instance
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const  [Header,setHeader] = useState("User Contact");
  const [width,setWidth] = useState("95%");
  const [userUpdate,UseSetUpdate] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const data = users.map((user, index) => {
    return {
      key: index,
      no: index + 1,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      id: user._id,
    };
  });
  useEffect(() => {
    axios.get("http://localhost:3000/api/user")
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: "10%",
      ...getColumnSearchProps("no"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      ...getColumnSearchProps("email"),
      // sorter: (a, b) => a.address.length - b.address.length,
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: "20%",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "40%",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "15%",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() =>{viewform();handleUpdate(record.id)}}>Edit</Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this contact?"
            okText="Yes"
            onConfirm={() => handleDelete(record.id)}
            onCancel={() => console.log("Cancel")}
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  // Show the modal
  const showModal = () => {
    setIsModalOpen(true);
  };
 // Close the form
  const closeform = () => {
    setIsEditFormVisible(false);
    setWidth("95%");
    if(setHeader === "User Contact"){
      setHeader("User Contact -> Edit User");
    }
    else{
      setHeader("User Contact");
    }
    form.resetFields();
  };
  // Show the form
  const viewform = () => {
    setIsEditFormVisible(true);
    setWidth("70%");
    if(setHeader === "User Contact ->Edit User"){
      setHeader("User Contact");
    }
    else{
      setHeader("User Contact -> Edit User");
    }
    
  };
    
  // update form handling
  const handleUpdate = (userid) => {
    axios.get(`http://localhost:3000/api/user/${userid}`)
      .then((res) => {
        console.log("API Response:", res.data);
        const userData = res.data ;
        UseSetUpdate({
          id: userid,
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
        });

        form.setFieldsValue({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
        });
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  };
  
  // Handle form submission
  const handleOk = () => {
    form.validateFields()
    .then(async (values) => {
      if (!values.no) {
        values.no = Date.now(); // Auto-generate a unique value if missing
      }
      try {
        const response = await axios.post("http://localhost:3000/api/user", values);
        if (response.status === 201) {
          alert("User added successfully!");
          setUsers([...users, response.data]); // Update UI
        }
        setIsModalOpen(false);
        form.resetFields();
      } catch (error) {
        console.error("Error adding user:", error);
        alert("Failed to add user.");
      }
    })
    .catch((info) => console.log("Validation Failed:", info));
  };

  // Close modal without submitting
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // delete the column belongs to table
  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/user/${userId}`
      );
      console.log("User deleted:", response.data);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const UpdateColumn = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/user/${id}`, updatedData);
      
      if (response.status === 200) {
        console.log("User updated successfully!", response.data);
        alert("User updated successfully!");
        setIsEditFormVisible(false);
        window.location.reload();
        setWidth("95%");
        setHeader("User Contact");
      }
    } catch (error) {
      console.error("Error updating user:", error.response ? error.response.data : error.message);
      alert("Failed to update user.");
    }
  };
  

  return (
    <>
    <div className="App">
      <div className="container">
        <h2>{Header}</h2>
        {!isEditFormVisible && <Button type="primary" onClick={showModal}>
          <PlusOutlined />
          Add User
        </Button>}
      </div>
      <div className="table"  style={{width: width}}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 20,
          }}
          scroll={{
            y: 55 * 10,
            x: "max-content"
          }}
        />
        
      </div>
      {isEditFormVisible && (
      <div className="editform">
        <h2 className="head">Edit User Form</h2>
        <Form form={form} layout="vertical" style={{height: '100%', gap: '20px',marginLeft: '5%'}}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input style= {{height: '38px',width:"90%",marginLeft:'5%'}} // ✅ Prevents undefined error
        onChange={(e) => UseSetUpdate((prev) => ({ ...prev, name: e.target.value }))} // ✅ Updates state
      
               />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input style= {{height: '38px',width:"90%",marginLeft:'5%'}} 
             onChange={(e) => UseSetUpdate((prev) => ({ ...prev, email: e.target.value }))}
             />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter your Phone Number!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Phone number must be exactly 10 digits!",
              },
            ]}
          >
            <Input placeholder="Enter your email" style= {{height: '38px',width:"90%",marginLeft:'5%'}} maxLength={10} 
           onChange={(e) => UseSetUpdate(prev => ({ ...prev, phone: e.target.value }))}/>
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address!" }]}
          >
            <Input.TextArea placeholder="Enter your address" style= {{height: '100px',width:"90%",marginLeft:'5%'}}
            onChange={(e) => UseSetUpdate(prev => ({ ...prev, address: e.target.value }))} />
          </Form.Item>
          <Button type="primary" onClick={() => UpdateColumn(userUpdate.id, userUpdate)}>
            Submit
          </Button> 
          <Button type="primary" onClick={closeform}>
            Cancel
          </Button>
        </Form>
        </div>
    )}
      <Modal
        title="User Form"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter your Phone Number!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Phone number must be exactly 10 digits!",
              },
            ]}
          >
            <Input placeholder="Enter your email" maxLength={10} />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address!" }]}
          >
            <Input.TextArea placeholder="Enter your address" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
    </>
  );
};

export default App;