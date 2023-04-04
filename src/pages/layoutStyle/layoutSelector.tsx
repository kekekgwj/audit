import * as React from 'react'
import { Row, Col, Divider, Dropdown, Menu, Card, Space } from 'antd'
import {
  DownOutlined,
  TrademarkCircleFilled,
  ChromeFilled,
  BranchesOutlined,
  ApartmentOutlined,
  AppstoreFilled,
  CopyrightCircleFilled,
  ShareAltOutlined
} from '@ant-design/icons'
import LayoutOptionsPanel from './layoutOptionPanel'
import { Layouts } from './layoutsOptions'

const iconMapByType = {
  'graphin-force': <ShareAltOutlined />,
  random: <TrademarkCircleFilled />,
  concentric: <ChromeFilled />,
  circular: <BranchesOutlined />,
  force: <AppstoreFilled />,
  dagre: <ApartmentOutlined />,
  grid: <CopyrightCircleFilled />,
  radial: <ShareAltOutlined />,
  gForce: <AppstoreFilled />,
  mds: <AppstoreFilled />
}

interface LayoutSelectorProps {
  style?: React.CSSProperties
  /** 布局类型 */
  type: string

  /** 布局切换的回调函数 */
  onChange: ({ type, options }: { type?: string; options?: unknown }) => void

  /** 所有布局信息 */
  layouts: Layouts
}
const defaultStyle: React.CSSProperties = {
  position: 'absolute',
  top: 50,
  right: 30,
  boxShadow: `0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%)`,
  width: '300px',
  height: '460px'
}

const LayoutMenu = ({ handleChange, description, layouts }) => {
  const [visible, setVisible] = React.useState(false)
  const handleVisibleChange = flag => {
    setVisible(flag)
  }
  const handleChangeLayoutType = e => {
    handleChange(e.key)
    setVisible(false)
  }
  const menu = (
    <Menu onClick={handleChangeLayoutType}>
      {layouts.map(item => {
        const { type, title } = item
        return (
          <Menu.Item key={type}>
            <Space>
              {iconMapByType[type]} {title}
            </Space>
          </Menu.Item>
        )
      })}
    </Menu>
  )
  return (
    <Row style={{ paddingTop: '15px' }}>
      <Col span={8}>布局算法</Col>
      <Col span={16}>
        <Dropdown
          overlay={menu}
          onVisibleChange={handleVisibleChange}
          visible={visible}>
          {description}
        </Dropdown>
      </Col>
    </Row>
  )
}

const LayoutSelector: React.FunctionComponent<LayoutSelectorProps> = props => {
  const { style, type, onChange, layouts } = props
  const matchLayout = layouts.find(item => item.type === type)
  const matchOptions = matchLayout.options
  const { title } = matchLayout
  const handleChange = (selectedType, options = {}) => {
    console.log(selectedType, 103333333)
    if (onChange) {
      onChange({ type: selectedType, options })
    }
  }
  const description = (
    <Space>
      {iconMapByType[type]} {title} <DownOutlined />
    </Space>
  )
  return (
    <div>
      <LayoutMenu
        handleChange={handleChange}
        description={description}
        layouts={layouts}
      />
      <div style={{ marginTop: '20px' }}>
        <LayoutOptionsPanel
          options={matchOptions}
          type={type}
          key={type}
          handleChange={handleChange}
        />
      </div>
    </div>
  )
}

export default LayoutSelector
