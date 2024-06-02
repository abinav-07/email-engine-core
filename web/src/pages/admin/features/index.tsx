import React, { useEffect } from "react"
import {
  Form,
  Layout,
  Table,
  TableColumnsType,
  Tag
} from "antd"
import { useQuery } from "react-query"
import { fetchEmails } from "../../../services"
import { Header } from "antd/lib/layout/layout"
import { Content } from "antd/es/layout/layout"
import { TableWrapper } from "./styles"
import { io } from 'socket.io-client';
import { API_URL } from "../../../config"

//Socket 
let socket: any;

const FeatureList: React.FC = () => {
  const [form] = Form.useForm()


  const {
    data: emailsData,
    isLoading,
    isFetching,
    refetch: featuresRefetch,
  } = useQuery(["emails"], () => fetchEmails(), {
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

  useEffect(() => {
    socket = io(`${API_URL}`);
    socket.on('cron-job-complete', () => {
      featuresRefetch()
    })

    // Unmounting
    return () => {
      socket.off();//Remove socket instance on component unmount
    }
  }, [])



  const expandedRowRender = (row) => {
    const mailBoxColumns: TableColumnsType<any> = [
      {
        title: "MailBox Type",
        dataIndex: "displayName",
        key: "displayName",
        render: (text) => text || "-",
        width: "25%",
      },
      {
        title: "Total items count",
        dataIndex: "totalItemCount",
        key: "totalItemCount",
        width: "25%",
      },
      {
        title: "Unread Item Count",
        dataIndex: "unreadItemCount",
        key: "unreadItemCount",
        width: "20%",
      },
    ]

    const emailColumns: TableColumnsType<any> = [
      {
        title: "Email Subject",
        dataIndex: "subject",
        key: "subject",
        width: "25%",
      },
      {
        title: "Body Preview",
        dataIndex: "bodyPreview",
        key: "bodyPreview",
        width: "25%",
      },
      {
        title: "Read",
        dataIndex: "isRead",
        key: "isRead",
        width: "20%",
        render: (text) => text ? <Tag color="green">Read</Tag> : <Tag color="lime">Not Read</Tag>
      },
      {
        title: "Draft",
        dataIndex: "isDraft",
        key: "isDraft",
        width: "20%",
        render: (text) => text ? <Tag color="lime">Draft</Tag> : <Tag color="green">Not Draft</Tag>
      },
      {
        title: "Flag",
        dataIndex: "flag",
        key: "flag",
        width: "20%",
        render: (text) => <>{text?.flagStatus}</>

      },
    ]


    return (
      <TableWrapper>
        <Table bordered columns={mailBoxColumns} dataSource={row?.mailboxes} pagination={false} />
        <Table bordered columns={emailColumns} dataSource={row?.emails} pagination={false} />
      </TableWrapper>

    )
  }

  const columns = [
    {
      title: "User id",
      dataIndex: "id",
      width: "25%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "15%",
    },
    {
      title: "Name",
      dataIndex: "displayName",
      width: "20%",
    },
    {
      title: "Email Given Id",
      dataIndex: "service_user_id",
      width: "15%",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "date",
      width: "25%",
      render: (_: any, record: any) =>
        `${record?.created_at ? new Date(record?.created_at).toISOString().split("T")[0] : "-"}`,
    },

  ]

  return (
    <>
      <Layout>
        <Header style={{ background: "#fff" }}>
          <h3>Page and their Features </h3>
        </Header>
        <Content>
          <Form form={form} component={false}>
            <Table
              bordered
              expandable={{ expandedRowRender }}
              dataSource={emailsData?.data}
              columns={columns}
              loading={isLoading || isFetching}
              pagination={false}
            />
          </Form>
        </Content>
      </Layout>
    </>
  )
}

export default FeatureList
