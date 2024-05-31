import React, { useContext, useState } from "react"
import { Form, Input, Popconfirm, Select, Table, Typography, message } from "antd"
import { useMutation, useQuery } from "react-query"
import { fetchUsers, updateUser } from "../../../services/users"
import { AuthContext } from "../../../utils"

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: "number" | "text" | "select"
  record: any
  index: number
  children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode = <Input />

  if (dataIndex == "role") {
    inputNode = (
      <Select placeholder={dataIndex}>
        <Select.Option value={"Admin"}>Admin</Select.Option>
        <Select.Option value={"User"}>User</Select.Option>
      </Select>
    )
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const MemberList: React.FC = () => {
  const [form] = Form.useForm()

  // Get currently Logged in Admin
  const { user } = useContext(AuthContext)

  const [editingKey, setEditingKey] = useState(null)

  const {
    data: usersData,
    refetch,
    isLoading,
  } = useQuery(["users"], () => fetchUsers(), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    enabled: true,
    cacheTime: 0,

    select: ({ data }) => {
      return {
        data: data?.map((values, i) => ({
          ...values,
          key: i,
        })),
      }
    },
  })

  const { mutate, isLoading: updateLoading } = useMutation(updateUser, {
    onSuccess: () => {
      // Reset Editing Key on success
      setEditingKey(null)
      // Refetch features on successful creation
      refetch()
      message.open({
        type: "success",
        content: "Successfully Updated",
      })
    },
    onError: (err: any) => {
      message.open({
        type: "error",
        content: err?.response?.data?.message || "Error while updating",
      })
    },
  })

  const isEditing = (record: any) => record.key === editingKey

  const edit = (record: Partial<any> & { key: React.Key }) => {
    form.setFieldsValue({ ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    form.resetFields()
    setEditingKey(null)
  }

  const save = async (key: React.Key) => {
    await form.validateFields()
    const formValues = form.getFieldsValue()

    const newData = [...usersData?.data]
    const index = newData.findIndex((item) => key === item.key)
    const item = newData[index]

    mutate({ ...formValues, email: item?.email })
  }

  const columns = [
    {
      title: "User id",
      dataIndex: "id",
      width: "20%",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      width: "25%",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      width: "25%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "15%",
    },
    {
      title: "Role",
      dataIndex: "role",
      width: "15%",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        const editable = isEditing(record)

        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography.Link
              // Dont allow editing if it is current user or super admin i.e John Don
              disabled={
                editingKey !== null ||
                record?.id == user?.user_id ||
                record?.email == "admin@gmail.com"
              }
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
          </div>
        )
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === "role" ? "select" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  return (
    <>
      <Form form={form} component={false}>
        <h3>Create/Edit User Roles </h3>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={usersData?.data}
          columns={mergedColumns}
          loading={isLoading || updateLoading}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
    </>
  )
}

export default MemberList
